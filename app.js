import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { doc, getDoc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ownerUid } from "./firebase-config.js?v=2";

const starterSections = [
  {
    id: "office",
    label: "Office",
    eyebrow: "Front desk essentials",
    title: "Office Training",
    intro: "S1 CHECKLIST and S2 CHECKLIST",
    groups: [
      { title: "Shift 1", topics: [
        { id: "s1-outside", title: "Outside", summary: "", details: "☐ Blow the front and back porches all the way to the street, including the brown mats and rocks between the small planters.\n☐ Put the sandwich board and flyers out front; wipe them clean if dusty.\n☐ Water the back-porch plants every Monday, Wednesday, and Friday.\n☐ Turn on the Omomi TV, lights, and window lights.\n☐ If Omomi technicians are running late, unlock the front door for clients.", videoTitle: "", videoUrl: "" },
        { id: "s1-passcodes", title: "Passcode", summary: "", details: "☐ Back door\n☐ Computer\n☐ Voicemail\n☐ Omomi phone\n☐ Omomi Square app\n☐ Location of the Omomi backup key", videoTitle: "", videoUrl: "" },
        { id: "s1-bathrooms", title: "Bathrooms and Hallway", summary: "", details: "☐ Turn on the hallway lights.\n☐ Turn on the white-noise machines.\n☐ Stock bathrooms with towels, toilet paper, tissues, and air freshener.\n☐ Restock paper cups on top of the water cooler as needed.", videoTitle: "", videoUrl: "" },
        { id: "s1-lunch-room", title: "Staff Lunch Room", summary: "", details: "☐ Turn on both lights.\n☐ Confirm that the lobby and back-door monitors are on.\n☐ If the lobby monitor is black, go to the reception area and unplug and reconnect the monitor above the large mirror.", videoTitle: "", videoUrl: "" },
        { id: "s1-front-desk", title: "Front Desk & Lobby", summary: "", details: "LIGHTS\n☐ Turn on the lobby and desk-area lights, the lights behind the shelf, and the small lobby table lamp.\n\nOPEN SIGN\n☐ Turn it on.\n\nTIDY UP LOBBY AREA\n☐ Keep surfaces dust-free and use the rule of three: organize small items into three groups.\n☐ Check and restock the snack basket as needed.\n\nSHADES\n☐ Make sure the shades are up so people can see we are open.\n\nWINDOW\n☐ Clean fingerprints from the see-through window in the hallway door.\n☐ Wipe fingerprints from the entrance door.\n\n☐ Log in to WellnessLiving.\n☐ Log in to Omomi Square on both the desktop and phone.\n☐ Check missed calls, voicemail, and text messages on the MTC phone and Omomi phone.\n☐ Turn on music.\n☐ Count the S1 cash box and fill out the daily cash worksheet.\n☐ Inform Jialu if high on big bills or low on small bills.\n☐ Check for sauna reservations; write cards and set alarms if needed.\n\nONCE SETTLED IN A BIT\n☐ Check missed calls and voicemail.\n☐ Make confirmation calls.\n☐ Print the sheet.\n☐ Check notes for additional information; some clients do not want calls.", videoTitle: "", videoUrl: "" },
        { id: "s1-massage-rooms", title: "Massage Room", summary: "", details: "☐ Replace the tissue box when necessary.\n☐ Keep the black stool in the corner, not touching the wall.\n☐ Make sure the wastebasket is clean.\n☐ Check that clocks are accurate.", videoTitle: "", videoUrl: "" },
        { id: "s1-during", title: "During Shift", summary: "", details: "☐ Print the appointment list for the next day and make confirmation calls.\n☐ Restock masks, brochures, and tip envelopes as needed.\n☐ Check the sauna list for the day and make cards as needed.\n☐ Turn on the sauna 30 minutes before arrival and turn it off right after.\n☐ Check bathrooms, voicemail, and email every hour.\n☐ Check bathroom cleanliness and toilet-paper stock.", videoTitle: "", videoUrl: "" },
        { id: "s1-linen", title: "Linen Deliveries M/W/F", summary: "", details: "☐ Verify the count of each item and check it off if correct.\n☐ Make note of discrepancies on the invoice.\n☐ Initial the invoice and put it in Jialu's mailbox.", videoTitle: "", videoUrl: "" },
        { id: "s1-end", title: "End of Shift 1", summary: "", details: "☐ Count cash and fill out the ending cash on the daily cash worksheet and card in the box.\n☐ Clean and wipe down the front-desk area.\n☐ Log out of WellnessLiving and email at shift exchange.\n☐ Take out trash from the lobby, bathrooms, and kitchen.\n☐ Did any clients under your watch leave without paying?", videoTitle: "", videoUrl: "" },
      ]},
      { title: "Shift 2", topics: [
        { id: "s2-beginning", title: "Beginning/During S2", summary: "", details: "☐ Check in with S1 on unfinished tasks.\n☐ Did anyone under S1's watch leave without paying?\n☐ Count the S2 cash box and fill out the daily cash worksheet.\n☐ Check bathrooms and restock as needed.\n☐ Check voicemail right away and often throughout the shift.\n☐ Make sure music is playing.\n☐ Make sure the kitchen monitor screen is on.\n☐ Wipe down the desk, counter, and lobby surfaces often.\n☐ Make sure the see-through window on the hallway door is clean and free of fingerprints.\n☐ In WellnessLiving, make sure all check-in lines are green and transactions are green, except for cash payments.\n☐ Fold and restock linen.", videoTitle: "", videoUrl: "" },
        { id: "s2-closing", title: "Closing of S2", summary: "", details: "☐ Did anyone under your watch leave without paying?\n☐ Restock massage cream, sanitizer when less than ½ full, and tissues.\n☐ Refill massage oil in the kitchen.\n☐ Reset the room using the rule of three (see picture below).\n\nTURN OFF / UNPLUG\n☐ Candle in massage room.\n☐ Massage-table heating pad (fire hazard).\n☐ White-noise machine.\n☐ All lights.\n☐ Sauna (fire hazard).\n☐ Space heater (fire hazard).\n☐ AC / heat.\n\nRESTOCK\n☐ Kitchen coffee, creamer, and cups.\n☐ Brochures, business cards, and tip envelopes.\n\n☐ Bring in the sandwich board and lock the front door.\n☐ Pull down the lobby shades.\n☐ Count the S2 ending cash, fill out the worksheet, lock the box and drawer, put the key away, and file the worksheet.\n☐ Tidy and wipe down the front desk and surrounding areas.\n☐ Sign out and close WellnessLiving and email.\n☐ Take out trash from the lobby, office, massage rooms, kitchen, and bathrooms.\n\nTRASH\n☐ Try to consolidate trash by pouring it into the kitchen bag instead of taking out every bag. Only replace smaller bags if needed.\n\n☐ Optional: Update the Room 5 left-hand closet with supplies from the right-hand side.\n☐ Text Jialu if we are running low on supplies. Update the shift-checklist comments so we do not spam her.\n☐ Turn off the Omomi TV.\n☐ Turn off Omomi lights if their staff have already left and forgot.\n☐ Exit through the back door and double-check that it is locked.\n\nTIP\nIt is generally slower toward the end, so stagger closing procedures to reduce a rushed process. Do your best to restock as much as you can to help S1.", videoTitle: "", videoUrl: "" },
      ]},
      { title: "General Notes", topics: [
        { id: "general-confirmation-calls", title: "Confirmation calls", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "general-late-cancel", title: "What to do w. Late cancel/No show", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "general-music", title: "Music not working", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "general-security-camera", title: "Security camera", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "general-el-camino", title: "El Camino Hospital / Cancer center", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "general-where-to-find", title: "Where to find ... ?", summary: "", details: "", videoTitle: "", videoUrl: "" },
      ]},
      { title: "Useful Links", topics: [
        { id: "link-front-desk-schedule", title: "Front desk schedule", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "link-room-assignment", title: "Therapists room assignment", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "link-therapist-background", title: "Therapists background", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "link-mtc-schedule", title: "MTC schedule", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "link-staff-ooo", title: "Staff OOO", summary: "", details: "", videoTitle: "", videoUrl: "" },
        { id: "link-omomi-background", title: "OMOMI technician background", summary: "", details: "", videoTitle: "", videoUrl: "" },
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
  sections = saved?.sections || structuredClone(starterSections);
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
  await setDoc(doc(db, "training", "guide"), { sections, updatedAt: new Date().toISOString() });
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

function addTopic(sectionId, groupIndex) {
  const topicId = `topic-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newTopic = { id: topicId, title: "", summary: "", details: "", videoTitle: "", videoUrl: "" };
  sections = sections.map((section) => section.id !== sectionId ? section : {
    ...section,
    groups: section.groups.map((group, index) => index === groupIndex ? { ...group, topics: [...group.topics, newTopic] } : group),
  });
  renderContent();
  requestAnimationFrame(() => {
    const article = document.getElementById(topicId);
    article?.scrollIntoView({ behavior: "smooth", block: "center" });
    article?.querySelector(".topic-title-input")?.focus();
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

function detailsEditor(value, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "details-editor";
  const toolbar = document.createElement("div");
  toolbar.className = "editor-toolbar";
  const editor = document.createElement("div");
  editor.className = "rich-editor";
  editor.contentEditable = "true";
  editor.setAttribute("role", "textbox");
  editor.setAttribute("aria-multiline", "true");
  editor.innerHTML = richTextHtml(value);
  let savedRange = null;

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount && editor.contains(selection.anchorNode)) savedRange = selection.getRangeAt(0).cloneRange();
  };
  const applyFormat = (command, commandValue = null) => {
    editor.focus();
    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
    document.execCommand(command, false, commandValue);
    rememberSelection();
    onChange(editor.innerHTML);
  };
  const insertNode = (node) => {
    editor.focus();
    const selection = window.getSelection();
    let range = savedRange;
    if (!range || !editor.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    range.deleteContents();
    range.insertNode(node);
    const spacer = document.createElement("br");
    node.after(spacer);
    range.setStartAfter(spacer);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    savedRange = range.cloneRange();
    onChange(editor.innerHTML);
  };
  const toolButton = (label, command, commandValue = null, title = label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.title = title;
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => applyFormat(command, commandValue));
    return button;
  };

  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = "#295743";
  colorPicker.title = "Text color";
  colorPicker.setAttribute("aria-label", "Text color");
  colorPicker.addEventListener("input", () => applyFormat("foreColor", colorPicker.value));

  const photoButton = document.createElement("button");
  photoButton.type = "button";
  photoButton.textContent = "Photo";
  photoButton.title = "Insert photo";
  photoButton.addEventListener("mousedown", (event) => event.preventDefault());
  photoButton.addEventListener("click", () => {
    openPhotoDialog((photoUrl, description) => {
      const image = document.createElement("img");
      image.src = photoUrl;
      image.alt = description;
      image.loading = "lazy";
      insertNode(image);
    });
  });

  toolbar.append(
    toolButton("• List", "insertUnorderedList", null, "Bullet list"),
    toolButton("→ Indent", "indent", null, "Increase indentation"),
    toolButton("← Outdent", "outdent", null, "Decrease indentation"),
    toolButton("U", "underline", null, "Underline"),
    toolButton("Small", "fontSize", "2", "Small text"),
    toolButton("Normal", "fontSize", "3", "Normal text"),
    toolButton("Large", "fontSize", "5", "Large text"),
    colorPicker,
    photoButton,
  );
  editor.addEventListener("keyup", rememberSelection);
  editor.addEventListener("mouseup", rememberSelection);
  editor.addEventListener("input", () => onChange(editor.innerHTML));
  wrapper.append(toolbar, editor);
  return wrapper;
}

function openPhotoDialog(onInsert) {
  document.querySelector(".photo-dialog-backdrop")?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = "photo-dialog-backdrop";
  const form = document.createElement("form");
  form.className = "photo-dialog";
  form.innerHTML = `
    <h3>Insert photo</h3>
    <label>Choose photo from computer<input name="photo-file" type="file" accept="image/jpeg,image/png,image/webp"></label>
    <div class="photo-or"><span>or</span></div>
    <label>Image or Google Drive link<input name="photo-url" type="url" placeholder="https://"></label>
    <label>Photo description (optional)<input name="photo-alt" type="text"></label>
    <p class="photo-dialog-error" aria-live="polite"></p>
    <div class="photo-dialog-actions"><button type="button" data-cancel>Cancel</button><button type="submit">Insert</button></div>
  `;
  const close = () => backdrop.remove();
  form.querySelector("[data-cancel]").addEventListener("click", close);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Preparing…";
    const file = form.querySelector('[name="photo-file"]').files[0];
    const enteredUrl = String(new FormData(form).get("photo-url") || "");
    const url = file ? await compressLocalPhoto(file) : normalizePhotoUrl(enteredUrl);
    if (!url) {
      form.querySelector(".photo-dialog-error").textContent = file
        ? "This photo could not be prepared. Try a smaller JPG, PNG, or WebP image."
        : "Choose a photo or enter a valid HTTPS image or Google Drive link.";
      submitButton.disabled = false;
      submitButton.textContent = "Insert";
      return;
    }
    onInsert(url, String(new FormData(form).get("photo-alt") || ""));
    close();
  });
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
  backdrop.append(form);
  document.body.append(backdrop);
  form.querySelector('[name="photo-url"]').focus();
}

function richTextHtml(value = "") {
  const containsMarkup = /<(?:br|div|p|ul|ol|li|u|font|img)\b/i.test(value);
  const template = document.createElement("template");
  template.innerHTML = containsMarkup ? value : escapeHtml(value).replace(/\n/g, "<br>");
  const allowedTags = new Set(["BR", "DIV", "P", "UL", "OL", "LI", "U", "FONT", "IMG"]);
  Array.from(template.content.querySelectorAll("*")).forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(document.createTextNode(element.textContent || ""));
      return;
    }
    if (element.tagName === "IMG") {
      const safeSource = normalizePhotoUrl(element.getAttribute("src") || "");
      if (!safeSource) { element.remove(); return; }
      const alt = element.getAttribute("alt") || "";
      Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));
      element.src = safeSource;
      element.alt = alt;
      element.loading = "lazy";
      return;
    }
    Array.from(element.attributes).forEach((attribute) => {
      const allowedFontAttribute = element.tagName === "FONT" && ["color", "size"].includes(attribute.name.toLowerCase());
      if (!allowedFontAttribute) element.removeAttribute(attribute.name);
    });
  });
  return template.innerHTML;
}

function normalizePhotoUrl(value) {
  if (/^data:image\/(?:jpeg|png|webp);base64,/i.test(value) && value.length <= 320000) return value;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return "";
    if (url.hostname.includes("drive.google.com")) {
      const fileId = url.pathname.match(/\/d\/([^/]+)/)?.[1] || url.searchParams.get("id");
      return fileId ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1600` : "";
    }
    return url.href;
  } catch {
    return "";
  }
}

function compressLocalPhoto(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return Promise.resolve("");
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve("");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => resolve("");
      image.onload = () => {
        const maxDimension = 1100;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let quality = 0.8;
        let result = canvas.toDataURL("image/jpeg", quality);
        while (result.length > 300000 && quality > 0.4) {
          quality -= 0.1;
          result = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(result.length <= 320000 ? result : "");
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
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
  section.groups.forEach((group, groupIndex) => {
    const matchingTopics = group.topics.filter((topic) => !searchTerm || [topic.title, topic.summary, topic.details, group.title].join(" ").toLowerCase().includes(searchTerm));
    if (!matchingTopics.length) return;
    matchCount += matchingTopics.length;

    const treeGroup = document.createElement("div");
    treeGroup.className = "tree-group";
    const groupTarget = `group-${group.topics[0].id}`;
    treeGroup.innerHTML = `<h3><a href="#${groupTarget}">${escapeHtml(group.title)}</a></h3>`;
    const list = document.createElement("ul");

    const contentGroup = document.createElement("section");
    contentGroup.className = "content-group";
    contentGroup.id = groupTarget;
    contentGroup.innerHTML = `<p class="group-kicker">${escapeHtml(group.title)}</p>`;

    matchingTopics.forEach((topic) => {
      const item = document.createElement("li");
      item.innerHTML = `<a href="#${topic.id}">${escapeHtml(topic.title || "Untitled topic")}</a>`;
      list.append(item);

      const article = document.createElement("article");
      article.className = "topic-section";
      article.id = topic.id;
      if (editing) {
        article.append(
          field("input", topic.title, "topic-title-input", (value) => updateTopic(section.id, topic.id, "title", value), "Topic title"),
          field("input", topic.summary, "summary-input", (value) => updateTopic(section.id, topic.id, "summary", value)),
          detailsEditor(topic.details, (value) => updateTopic(section.id, topic.id, "details", value)),
          field("input", topic.videoTitle || "", "video-input", (value) => updateTopic(section.id, topic.id, "videoTitle", value), "Video title (optional)"),
          field("input", topic.videoUrl || "", "video-input", (value) => updateTopic(section.id, topic.id, "videoUrl", value), "YouTube or Google Drive video link"),
        );
      } else {
        article.innerHTML = `<h2>${highlight(topic.title)}</h2>${topic.summary ? `<p class="summary">${highlight(topic.summary)}</p>` : ""}${topic.details ? `<div class="details">${richTextHtml(topic.details)}</div>` : ""}`;
        const video = embedUrl(topic.videoUrl);
        if (video) article.insertAdjacentHTML("beforeend", `<div class="video-block"><div class="video-label"><span class="play-dot">▶</span>${escapeHtml(topic.videoTitle || "Training video")}</div><div class="video-frame"><iframe src="${video}" title="${escapeHtml(topic.videoTitle || topic.title)}" allowfullscreen></iframe></div></div>`);
      }
      contentGroup.append(article);
    });
    if (editing) {
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "add-topic-button";
      addButton.textContent = `+ Add item to ${group.title}`;
      addButton.addEventListener("click", () => addTopic(section.id, groupIndex));
      contentGroup.append(addButton);
    }
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
