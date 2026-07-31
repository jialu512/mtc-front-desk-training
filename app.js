import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { doc, getDoc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ownerUid } from "./firebase-config.js?v=2";

const CONTENT_VERSION = 2;

const starterSections = [
  {
    id: "office",
    label: "Office",
    eyebrow: "Front desk essentials",
    title: "Office Training",
    intro: "Use these shift checklists and reference notes to keep the office clean, prepared, and running smoothly.",
    groups: [
      { title: "Shift 1", topics: [
        { id: "s1-outside", title: "Outside", summary: "Prepare the porches, entrance, and Omomi area.", details: "☐ Blow the front and back porches all the way to the street, including the brown mats and rocks between the small planters.\n☐ Put the sandwich board and flyers out front; wipe them clean if dusty.\n☐ Water the back-porch plants every Monday, Wednesday, and Friday.\n☐ Turn on the Omomi TV, lights, and window lights.\n☐ If Omomi technicians are running late, unlock the front door for clients.", videoTitle: "", videoUrl: "" },
        { id: "s1-passcodes", title: "Passcodes & keys", summary: "Know where to find the access information needed for opening.", details: "Confirm that you know the passcode or access procedure for:\n☐ Back door\n☐ Computer\n☐ Voicemail\n☐ Omomi phone\n☐ Omomi Square app\n☐ Location of the Omomi backup key", videoTitle: "", videoUrl: "" },
        { id: "s1-bathrooms", title: "Bathrooms & hallway", summary: "Turn on shared-area equipment and check supplies.", details: "☐ Turn on the hallway lights.\n☐ Turn on the white-noise machines.\n☐ Stock bathrooms with towels, toilet paper, tissues, and air freshener.\n☐ Restock paper cups on top of the water cooler as needed.", videoTitle: "", videoUrl: "" },
        { id: "s1-lunch-room", title: "Staff lunch room", summary: "Turn on the lights and verify both security monitors.", details: "☐ Turn on both lights.\n☐ Confirm that the lobby and back-door monitors are on.\n☐ If the lobby monitor is black, go to the reception area and unplug and reconnect the monitor above the large mirror.", videoTitle: "", videoUrl: "" },
        { id: "s1-front-desk", title: "Front desk & lobby", summary: "Open, clean, and prepare all guest-facing areas.", details: "LIGHTS\n☐ Turn on the lobby and desk-area lights, the lights behind the shelf, and the small lobby table lamp.\n\nOPEN SIGN\n☐ Turn it on.\n\nLOBBY\n☐ Dust surfaces and use the rule of three: organize small items into three groups.\n☐ Check and restock the snack basket as needed.\n\nSHADES\n☐ Raise the shades so people can see that we are open.\n\nWINDOWS & DOORS\n☐ Clean fingerprints from the see-through window in the hallway door.\n☐ Wipe fingerprints from the entrance door.", videoTitle: "", videoUrl: "" },
        { id: "s1-systems", title: "Systems, messages & cash", summary: "Log in, review communications, and prepare the cash box.", details: "☐ Log in to WellnessLiving.\n☐ Log in to Omomi Square on both the desktop and phone.\n☐ Check missed calls, voicemail, and text messages on the MTC phone and Omomi phone.\n☐ Turn on music.\n☐ Count the Shift 1 cash box and complete the daily cash worksheet.\n☐ Inform Jialu if the box is high on large bills or low on small bills.\n☐ Check sauna reservations, write cards, and set alarms if needed.\n\nONCE SETTLED IN\n☐ Recheck missed calls and voicemail.\n☐ Print the confirmation-call sheet.\n☐ Make confirmation calls.\n☐ Check notes for additional information; some clients do not want calls.", videoTitle: "", videoUrl: "" },
        { id: "s1-massage-rooms", title: "Massage rooms", summary: "Check each room for supplies, cleanliness, and readiness.", details: "☐ Replace tissue boxes when necessary.\n☐ Place the black stool in the corner without touching the wall.\n☐ Make sure the wastebasket is clean.\n☐ Check that clocks show the correct time.", videoTitle: "", videoUrl: "" },
        { id: "s1-during", title: "During the shift", summary: "Maintain the schedule, supplies, sauna, and hourly checks.", details: "☐ Print the next day's appointment list and make confirmation calls.\n☐ Restock masks, brochures, and tip envelopes as needed.\n☐ Check the day's sauna list and prepare cards as needed.\n☐ Turn on the sauna 30 minutes before arrival and turn it off immediately afterward.\n☐ Check bathrooms, voicemail, and email every hour.\n☐ Check bathroom cleanliness and toilet-paper stock.", videoTitle: "", videoUrl: "" },
        { id: "s1-linen", title: "Linen deliveries — M/W/F", summary: "Verify deliveries and document discrepancies.", details: "☐ Verify the count of every delivered item and check it off if correct.\n☐ Note discrepancies on the invoice.\n☐ Initial the invoice and place it in Jialu's mailbox.", videoTitle: "", videoUrl: "" },
        { id: "s1-end", title: "End of Shift 1", summary: "Balance the cash box, clean the desk, and leave a complete handoff.", details: "☐ Count the cash and enter the ending amount on the daily cash worksheet and the card in the box.\n☐ Clean and wipe down the front-desk area.\n☐ Log out of WellnessLiving and email at shift exchange.\n☐ Take out trash from the lobby, bathrooms, and kitchen.\n☐ Confirm that no clients under your watch left without paying.", videoTitle: "", videoUrl: "" },
      ]},
      { title: "Shift 2", topics: [
        { id: "s2-coming-soon", title: "Shift 2 checklist", summary: "Content ready to be added.", details: "Shift 2 procedures will appear here.", videoTitle: "", videoUrl: "" },
      ]},
      { title: "General Notes", topics: [
        { id: "general-notes", title: "General notes", summary: "Shared office information and reminders.", details: "General office notes will appear here.", videoTitle: "", videoUrl: "" },
      ]},
      { title: "Trouble Shooting", topics: [
        { id: "trouble-shooting", title: "Trouble shooting", summary: "Quick solutions for common front-desk issues.", details: "Trouble-shooting instructions will appear here.", videoTitle: "", videoUrl: "" },
      ]},
    ],
  },
  {
    id: "wellness",
    label: "Wellness",
    eyebrow: "Guest knowledge",
    title: "Wellness Training",
    intro: "Build the knowledge and language to guide guests thoughtfully while staying within the front-desk role.",
    groups: [
      { title: "Foundations", topics: [
        { id: "wellness-services", title: "Know our services", summary: "Describe each offering simply and accurately.", details: "Learn the purpose, typical experience, and basic differences between services. When a clinical recommendation is needed, connect the guest with the appropriate practitioner.", videoTitle: "Service overview", videoUrl: "" },
        { id: "wellness-boundaries", title: "Role boundaries", summary: "Be helpful without offering medical advice.", details: "Share approved factual information, ask clarifying questions, and escalate health or treatment questions to a qualified practitioner.", videoTitle: "", videoUrl: "" },
      ]},
      { title: "Guest conversations", topics: [
        { id: "wellness-needs", title: "Understanding guest needs", summary: "Listen first, then help identify the next step.", details: "Ask open, neutral questions about what the guest is looking for. Avoid diagnosing or promising outcomes, and document relevant preferences clearly.", videoTitle: "A helpful wellness conversation", videoUrl: "" },
        { id: "wellness-sensitive", title: "Sensitive conversations", summary: "Respond with privacy, empathy, and good judgment.", details: "Keep your voice low, move the conversation away from other guests when possible, and involve a manager or practitioner when the situation goes beyond your role.", videoTitle: "", videoUrl: "" },
      ]},
      { title: "Safety & support", topics: [
        { id: "wellness-privacy", title: "Privacy & confidentiality", summary: "Protect guest information everywhere.", details: "Never confirm a guest’s presence or share personal information without following the approved identity-verification process.", videoTitle: "", videoUrl: "" },
        { id: "wellness-escalation", title: "When to escalate", summary: "Know when—and who—to ask for help.", details: "Escalate emergencies, health concerns, unusual reactions, privacy issues, and any situation where you are uncertain about the correct response.", videoTitle: "Escalation basics", videoUrl: "" },
      ]},
    ],
  },
  {
    id: "test",
    label: "Test",
    eyebrow: "Knowledge check",
    title: "Training Test",
    intro: "Use these review topics to confirm your understanding before working independently.",
    groups: [
      { title: "Review", topics: [
        { id: "test-office", title: "Office knowledge check", summary: "Review opening, guest care, scheduling, and closing.", details: "Your manager will provide the office knowledge check after you have completed all Office topics and videos.", videoTitle: "", videoUrl: "" },
        { id: "test-wellness", title: "Wellness knowledge check", summary: "Review services, boundaries, privacy, and escalation.", details: "Complete this check after all Wellness topics. Bring any uncertain answers to your manager for discussion.", videoTitle: "", videoUrl: "" },
      ]},
    ],
  },
];

const $ = (selector) => document.querySelector(selector);
const loading = $("#loading");
const setupNeeded = $("#setup-needed");
const loginView = $("#login-view");
const siteView = $("#site-view");
let sections = structuredClone(starterSections);
let activeId = "office";
let editing = false;
let currentUser = null;
let searchTerm = "";
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
  const saved = snapshot.exists() ? snapshot.data() : null;
  sections = saved?.contentVersion === CONTENT_VERSION ? saved.sections : structuredClone(starterSections);
  render();
}

$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#login-error").textContent = "";
  try { await signInWithEmailAndPassword(auth, $("#email").value.trim(), $("#password").value); }
  catch { $("#login-error").textContent = "That email or password is not correct."; }
});

$("#forgot-password").addEventListener("click", async () => {
  const email = $("#email").value.trim();
  if (!email) { $("#login-error").textContent = "Enter your email address first."; return; }
  try { await sendPasswordResetEmail(auth, email); $("#login-error").textContent = "A password-reset email has been sent."; }
  catch { $("#login-error").textContent = "We could not send a reset email."; }
});

$("#sign-out").addEventListener("click", () => signOut(auth));
$("#search-input").addEventListener("input", (event) => { searchTerm = event.target.value.trim().toLowerCase(); renderContent(); });
$("#edit-button").addEventListener("click", () => { editing = true; $("#edit-button").classList.add("hidden"); $("#save-button").classList.remove("hidden"); renderContent(); });
$("#save-button").addEventListener("click", async () => {
  await setDoc(doc(db, "training", "guide"), { sections, contentVersion: CONTENT_VERSION, updatedAt: new Date().toISOString() });
  editing = false;
  $("#save-button").classList.add("hidden");
  $("#edit-button").classList.remove("hidden");
  renderContent();
});

function updateSection(id, key, value) {
  sections = sections.map((section) => section.id === id ? { ...section, [key]: value } : section);
}

function updateTopic(sectionId, topicId, key, value) {
  sections = sections.map((section) => section.id !== sectionId ? section : {
    ...section,
    groups: section.groups.map((group) => ({ ...group, topics: group.topics.map((topic) => topic.id === topicId ? { ...topic, [key]: value } : topic) })),
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
  const tabs = $("#tabs");
  tabs.replaceChildren();
  sections.forEach((section) => {
    const button = document.createElement("button");
    button.className = section.id === activeId ? "active" : "";
    button.textContent = section.label;
    button.addEventListener("click", () => { activeId = section.id; searchTerm = ""; $("#search-input").value = ""; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    tabs.append(button);
  });
  renderContent();
}

function renderContent() {
  const section = sections.find((item) => item.id === activeId) || sections[0];
  const content = $("#content");
  content.replaceChildren();

  const page = document.createElement("div");
  page.className = "training-page";
  const sidebar = document.createElement("aside");
  sidebar.className = "topic-index";
  sidebar.innerHTML = `<p class="index-label">On this page</p>`;
  const tree = document.createElement("nav");
  tree.setAttribute("aria-label", `${section.label} topic index`);

  const main = document.createElement("div");
  main.className = "training-content";
  const hero = document.createElement("section");
  hero.className = "page-intro";
  hero.innerHTML = `<p class="eyebrow">${escapeHtml(section.eyebrow)}</p>`;
  if (editing) {
    hero.append(field("input", section.title, "title-input", (value) => updateSection(section.id, "title", value)), field("textarea", section.intro, "intro-input", (value) => updateSection(section.id, "intro", value)));
  } else {
    hero.insertAdjacentHTML("beforeend", `<h1>${escapeHtml(section.title)}</h1><p>${escapeHtml(section.intro)}</p>`);
  }
  main.append(hero);

  let matchCount = 0;
  section.groups.forEach((group) => {
    const matchingTopics = group.topics.filter((topic) => !searchTerm || [topic.title, topic.summary, topic.details, group.title].join(" ").toLowerCase().includes(searchTerm));
    if (!matchingTopics.length) return;
    matchCount += matchingTopics.length;

    const treeGroup = document.createElement("div");
    treeGroup.className = "tree-group";
    treeGroup.innerHTML = `<h3>${escapeHtml(group.title)}</h3>`;
    const list = document.createElement("ul");

    const contentGroup = document.createElement("section");
    contentGroup.className = "content-group";
    contentGroup.innerHTML = `<p class="group-kicker">${escapeHtml(group.title)}</p>`;

    matchingTopics.forEach((topic) => {
      const item = document.createElement("li");
      item.innerHTML = `<a href="#${topic.id}">${escapeHtml(topic.title)}</a>`;
      list.append(item);

      const article = document.createElement("article");
      article.className = "topic-section";
      article.id = topic.id;
      if (editing) {
        article.append(
          field("input", topic.title, "topic-title-input", (value) => updateTopic(section.id, topic.id, "title", value)),
          field("input", topic.summary, "summary-input", (value) => updateTopic(section.id, topic.id, "summary", value)),
          field("textarea", topic.details, "details-input", (value) => updateTopic(section.id, topic.id, "details", value)),
          field("input", topic.videoTitle || "", "video-input", (value) => updateTopic(section.id, topic.id, "videoTitle", value), "Video title (optional)"),
          field("input", topic.videoUrl || "", "video-input", (value) => updateTopic(section.id, topic.id, "videoUrl", value), "YouTube or Google Drive video link"),
        );
      } else {
        article.innerHTML = `<h2>${highlight(topic.title)}</h2><p class="summary">${highlight(topic.summary)}</p><p class="details">${highlight(topic.details)}</p>`;
        const video = embedUrl(topic.videoUrl);
        if (video) article.insertAdjacentHTML("beforeend", `<div class="video-block"><div class="video-label"><span class="play-dot">▶</span>${escapeHtml(topic.videoTitle || "Training video")}</div><div class="video-frame"><iframe src="${video}" title="${escapeHtml(topic.videoTitle || topic.title)}" allowfullscreen></iframe></div></div>`);
      }
      contentGroup.append(article);
    });
    treeGroup.append(list);
    tree.append(treeGroup);
    main.append(contentGroup);
  });

  if (!matchCount) main.insertAdjacentHTML("beforeend", `<div class="empty-search"><h2>No matching topics</h2><p>Try a different word or clear the search box.</p></div>`);
  sidebar.append(tree);
  page.append(sidebar, main);
  content.append(page);
}

function highlight(text = "") {
  const safe = escapeHtml(text);
  if (!searchTerm) return safe;
  const safeTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safe.replace(new RegExp(`(${safeTerm})`, "ig"), "<mark>$1</mark>");
}

function escapeHtml(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
