import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ownerUid } from "./firebase-config.js";

const starterChapters = [
  {
    id: "start",
    label: "Start here",
    eyebrow: "01 · Welcome",
    title: "A thoughtful welcome starts with you.",
    intro: "Begin with the essentials: how we work, what great service feels like, and what to know before your first shift.",
    topics: [
      { id: "welcome", title: "Welcome to the team", summary: "Our standards, values, and what success looks like at the front desk.", details: "Read the welcome guide before your first shift. Write down any questions and bring them to your manager check-in.", videoTitle: "", videoUrl: "" },
      { id: "first-week", title: "Your first week", summary: "A simple roadmap for training, shadowing, and practice.", details: "Day 1: orientation. Days 2–3: shadow a teammate. Days 4–5: practice the opening and closing routines with support.", videoTitle: "", videoUrl: "" },
    ],
  },
  {
    id: "guests",
    label: "Guest experience",
    eyebrow: "02 · Service",
    title: "Make every arrival feel easy.",
    intro: "Learn the language, habits, and judgment that turn a front-desk interaction into genuine hospitality.",
    topics: [
      { id: "greeting", title: "The first 30 seconds", summary: "A warm, confident greeting—even when the desk is busy.", details: "Acknowledge every guest promptly. Make eye contact, smile, and set a clear expectation if you need a moment before helping them.", videoTitle: "Watch: A strong guest greeting", videoUrl: "" },
      { id: "phone", title: "Phone and message etiquette", summary: "Answer, place on hold, transfer, and take messages with care.", details: "Use the approved greeting, confirm names and numbers, repeat key details, and explain what will happen next.", videoTitle: "", videoUrl: "" },
    ],
  },
  {
    id: "operations",
    label: "Daily operations",
    eyebrow: "03 · Routines",
    title: "Confident shifts, from open to close.",
    intro: "Follow repeatable routines for a calm, organized desk and a clean handoff to the next team member.",
    topics: [
      { id: "opening", title: "Opening checklist", summary: "Prepare the desk, systems, and shared spaces for the day.", details: "Complete the opening checklist in order and note anything unusual in the shift log before guests begin arriving.", videoTitle: "Watch: Opening the front desk", videoUrl: "" },
      { id: "closing", title: "Closing and handoff", summary: "Leave the desk ready and the next person fully informed.", details: "Finish the closing checklist, secure sensitive materials, and write a concise handoff with open items and owners.", videoTitle: "", videoUrl: "" },
    ],
  },
  {
    id: "safety",
    label: "Safety & support",
    eyebrow: "04 · Preparedness",
    title: "Know what to do—and who to call.",
    intro: "Use these guides for urgent situations, privacy questions, and moments when you need extra support.",
    topics: [
      { id: "emergency", title: "Emergency basics", summary: "Immediate actions, important locations, and escalation steps.", details: "In an immediate emergency, contact local emergency services first. Then follow the internal notification procedure.", videoTitle: "", videoUrl: "" },
      { id: "privacy", title: "Guest privacy", summary: "Protect personal information in person, by phone, and on screen.", details: "Never confirm a guest’s presence or share personal information without following the approved identity-verification process.", videoTitle: "", videoUrl: "" },
    ],
  },
];

const $ = (selector) => document.querySelector(selector);
const loading = $("#loading");
const setupNeeded = $("#setup-needed");
const loginView = $("#login-view");
const siteView = $("#site-view");
let chapters = structuredClone(starterChapters);
let activeId = chapters[0].id;
let editing = false;
let currentUser = null;
let db;
let auth;

const configured = !Object.values(firebaseConfig).some((value) => value.startsWith("PASTE_")) && ownerUid !== "PASTE_OWNER_UID";
if (!configured) {
  loading.classList.add("hidden");
  setupNeeded.classList.remove("hidden");
} else {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  onAuthStateChanged(auth, handleAuth);
}

async function handleAuth(user) {
  loading.classList.add("hidden");
  currentUser = user;
  if (!user) {
    siteView.classList.add("hidden");
    loginView.classList.remove("hidden");
    return;
  }
  loginView.classList.add("hidden");
  siteView.classList.remove("hidden");
  $("#user-email").textContent = user.email || "";
  $("#edit-button").classList.toggle("hidden", user.uid !== ownerUid);
  const snapshot = await getDoc(doc(db, "training", "guide"));
  chapters = snapshot.exists() ? snapshot.data().chapters : structuredClone(starterChapters);
  render();
}

$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#login-error").textContent = "";
  try {
    await signInWithEmailAndPassword(auth, $("#email").value.trim(), $("#password").value);
  } catch {
    $("#login-error").textContent = "That email or password is not correct.";
  }
});

$("#forgot-password").addEventListener("click", async () => {
  const email = $("#email").value.trim();
  if (!email) {
    $("#login-error").textContent = "Enter your email address first.";
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    $("#login-error").textContent = "A password-reset email has been sent.";
  } catch {
    $("#login-error").textContent = "We could not send a reset email.";
  }
});

$("#sign-out").addEventListener("click", () => signOut(auth));
$("#edit-button").addEventListener("click", () => {
  editing = true;
  $("#edit-button").classList.add("hidden");
  $("#save-button").classList.remove("hidden");
  render();
});
$("#save-button").addEventListener("click", async () => {
  await setDoc(doc(db, "training", "guide"), { chapters, updatedAt: new Date().toISOString() });
  editing = false;
  $("#save-button").classList.add("hidden");
  $("#edit-button").classList.remove("hidden");
  render();
});

function updateChapter(id, key, value) {
  chapters = chapters.map((chapter) => chapter.id === id ? { ...chapter, [key]: value } : chapter);
}

function updateTopic(chapterId, topicId, key, value) {
  chapters = chapters.map((chapter) => chapter.id !== chapterId ? chapter : {
    ...chapter,
    topics: chapter.topics.map((topic) => topic.id === topicId ? { ...topic, [key]: value } : topic),
  });
}

function field(tag, value, className, onChange, placeholder = "") {
  const element = document.createElement(tag);
  element.value = value;
  element.className = className;
  element.placeholder = placeholder;
  element.addEventListener("input", (event) => onChange(event.target.value));
  return element;
}

function embedUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (parsed.hostname.includes("drive.google.com")) {
      const match = parsed.pathname.match(/\/d\/([^/]+)/);
      return match ? `https://drive.google.com/file/d/${match[1]}/preview` : "";
    }
  } catch {}
  return "";
}

function render() {
  const active = chapters.find((chapter) => chapter.id === activeId) || chapters[0];
  const tabs = $("#tabs");
  tabs.replaceChildren();
  chapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.className = chapter.id === active.id ? "active" : "";
    button.textContent = chapter.label;
    button.addEventListener("click", () => { activeId = chapter.id; render(); });
    tabs.append(button);
  });

  const content = $("#content");
  content.replaceChildren();
  const hero = document.createElement("section");
  hero.className = "hero";
  hero.id = "top";
  const copy = document.createElement("div");
  copy.className = "hero-copy";
  copy.innerHTML = `<p class="eyebrow">${active.eyebrow}</p>`;
  if (editing) {
    copy.append(
      field("input", active.title, "title-input", (value) => updateChapter(active.id, "title", value)),
      field("textarea", active.intro, "intro-input", (value) => updateChapter(active.id, "intro", value)),
    );
  } else {
    copy.insertAdjacentHTML("beforeend", `<h1>${escapeHtml(active.title)}</h1><p class="intro">${escapeHtml(active.intro)}</p>`);
  }
  hero.append(copy);
  hero.insertAdjacentHTML("beforeend", `<div class="chapter-number">${String(chapters.indexOf(active) + 1).padStart(2, "0")}</div>`);
  content.append(hero);

  const topics = document.createElement("section");
  topics.className = "topics";
  active.topics.forEach((topic, index) => {
    const card = $("#topic-template").content.cloneNode(true);
    card.querySelector(".topic-number").textContent = String(index + 1).padStart(2, "0");
    const body = card.querySelector(".topic-content");
    if (editing) {
      body.append(
        field("input", topic.title, "topic-title-input", (value) => updateTopic(active.id, topic.id, "title", value)),
        field("input", topic.summary, "summary-input", (value) => updateTopic(active.id, topic.id, "summary", value)),
        field("textarea", topic.details, "details-input", (value) => updateTopic(active.id, topic.id, "details", value)),
        field("input", topic.videoTitle || "", "video-input", (value) => updateTopic(active.id, topic.id, "videoTitle", value), "Video title (optional)"),
        field("input", topic.videoUrl || "", "video-input", (value) => updateTopic(active.id, topic.id, "videoUrl", value), "YouTube or Google Drive video link"),
      );
    } else {
      body.innerHTML = `<h2>${escapeHtml(topic.title)}</h2><p class="summary">${escapeHtml(topic.summary)}</p><p class="details">${escapeHtml(topic.details)}</p>`;
      const video = embedUrl(topic.videoUrl);
      if (video) body.insertAdjacentHTML("beforeend", `<div class="video-block"><div class="video-label"><span class="play-dot">▶</span>${escapeHtml(topic.videoTitle || "Training video")}</div><div class="video-frame"><iframe src="${video}" title="${escapeHtml(topic.videoTitle || topic.title)}" allowfullscreen></iframe></div></div>`);
    }
    topics.append(card);
  });
  content.append(topics);
}

function escapeHtml(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
