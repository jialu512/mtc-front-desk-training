import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { doc, getDoc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig, ownerUid } from "./firebase-config.js?v=2";

const s2ClosingTopics = [
  { id: "s2-wellness", title: "WELLNESS", summary: "", details: "☐ Did anyone under your watch leave without paying?\n☐ Count the S2 ending cash, fill out the worksheet, lock the box and drawer, put the key away, and file the worksheet.\n☐ Sign out and close WellnessLiving and email.", videoTitle: "", videoUrl: "" },
  { id: "s2-turn-off", title: "TURN OFF / UNPLUG", summary: "", details: "☐ Candle in massage room.\n☐ Massage-table heating pad (fire hazard).\n☐ White-noise machine.\n☐ All lights.\n☐ Sauna (fire hazard).\n☐ Space heater (fire hazard).\n☐ AC / heat.", videoTitle: "", videoUrl: "" },
  { id: "s2-restock-reset", title: "RESTOCK/RESET", summary: "", details: "☐ Restock massage cream, sanitizer when less than ½ full, and tissues.\n☐ Refill massage oil in the kitchen.\n☐ Reset the room using the rule of three (see picture below).\n☐ Restock kitchen coffee, creamer, and cups.\n☐ Restock brochures, business cards, and tip envelopes.\n☐ Tidy and wipe down the front desk and surrounding areas.\n☐ Optional: Update the Room 5 left-hand closet with supplies from the right-hand side.\n☐ Text Jialu if we are running low on supplies. Update the shift-checklist comments so we do not spam her.\n\nTIP\nIt is generally slower toward the end, so stagger closing procedures to reduce a rushed process. Do your best to restock as much as you can to help S1.", videoTitle: "", videoUrl: "" },
  { id: "s2-trash", title: "TRASH", summary: "", details: "☐ Take out trash from the lobby, office, massage rooms, kitchen, and bathrooms.\n☐ Try to consolidate trash by pouring it into the kitchen bag instead of taking out every bag. Only replace smaller bags if needed.", videoTitle: "", videoUrl: "" },
  { id: "s2-omomi", title: "OMOMI", summary: "", details: "☐ Turn off the Omomi TV.\n☐ Turn off Omomi lights if their staff have already left and forgot.", videoTitle: "", videoUrl: "" },
  { id: "s2-exit", title: "EXIT", summary: "", details: "☐ Bring in the sandwich board and lock the front door.\n☐ Pull down the lobby shades.\n☐ Exit through the back door and double-check that it is locked.", videoTitle: "", videoUrl: "" },
];
const wellnessTopics = [
  { id: "wellness-appointments", title: "Make / change appointments", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-credit-cards", title: "Add credit cards", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-checkout", title: "Checkout", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-checkout-credit-card", parentId: "wellness-checkout", title: "With credit card", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-checkout-account-balance", parentId: "wellness-checkout", title: "With account balance", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-checkout-gc", parentId: "wellness-checkout", title: "With GC", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-checkout-cash", parentId: "wellness-checkout", title: "With cash", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-checkout-zelle-venmo", parentId: "wellness-checkout", title: "With zelle/venmo", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-gift-cards", title: "Sell Gift cards", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-gift-card-existing", parentId: "wellness-gift-cards", title: "Sell GC to existing clients", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-gift-card-walkin", parentId: "wellness-gift-cards", title: "Sell GC to walkin's", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-gift-card-find", parentId: "wellness-gift-cards", title: "Find an existing GC", summary: "", details: "", videoTitle: "", videoUrl: "" },
  { id: "wellness-package", title: "Package", summary: "", details: "", videoTitle: "", videoUrl: "" },
];
const guideStructureVersion = 2;

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
        ...structuredClone(s2ClosingTopics),
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
    intro: "",
    groups: [
      { title: "Wellness", topics: structuredClone(wellnessTopics) },
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
  const loadedSections = saved?.sections || structuredClone(starterSections);
  const closingMigration = splitS2ClosingProcedure(loadedSections);
  const previousStructureVersion = saved?.structureVersion || 0;
  const treeMigration = previousStructureVersion < 1
    ? applyChecklistTree(closingMigration.sections)
    : { sections: closingMigration.sections, changed: false };
  const wellnessMigration = previousStructureVersion < 2
    ? applyWellnessMenu(treeMigration.sections)
    : { sections: treeMigration.sections, changed: false };
  sections = wellnessMigration.sections;
  if ((closingMigration.changed || treeMigration.changed || wellnessMigration.changed) && user.uid === ownerUid) {
    await setDoc(doc(db, "training", "guide"), { sections, structureVersion: guideStructureVersion, updatedAt: new Date().toISOString() });
  }
  render();
}

function splitS2ClosingProcedure(sourceSections) {
  let changed = false;
  const migrated = structuredClone(sourceSections);
  const office = migrated.find((section) => section.id === "office");
  const shift2 = office?.groups.find((group) => group.topics.some((topic) => topic.id === "s2-closing"));
  if (shift2 && !shift2.topics.some((topic) => topic.id === "s2-wellness")) {
    const closingIndex = shift2.topics.findIndex((topic) => topic.id === "s2-closing");
    shift2.topics.splice(closingIndex, 1, ...structuredClone(s2ClosingTopics));
    changed = true;
  }
  return { sections: migrated, changed };
}

function applyChecklistTree(sourceSections) {
  const migrated = structuredClone(sourceSections);
  const office = migrated.find((section) => section.id === "office");
  const shift1 = office?.groups.find((group) => group.topics.some((topic) => topic.id === "s1-outside"));
  const shift2 = office?.groups.find((group) => group.topics.some((topic) => topic.id === "s2-beginning"));

  if (shift1) {
    shift1.title = "Shift 1 Checklist";
    const openingIds = ["s1-outside", "s1-passcodes", "s1-bathrooms", "s1-lunch-room", "s1-front-desk", "s1-massage-rooms", "s1-linen"];
    shift1.topics.forEach((topic) => {
      if (openingIds.includes(topic.id)) topic.menuParent = "Opening";
      else delete topic.menuParent;
      delete topic.treeHidden;
    });
    const requestedOrder = [...openingIds, "s1-during", "s1-end"];
    const knownTopics = new Map(shift1.topics.map((topic) => [topic.id, topic]));
    const requestedTopics = requestedOrder.map((id) => knownTopics.get(id)).filter(Boolean);
    const additionalTopics = shift1.topics.filter((topic) => !requestedOrder.includes(topic.id));
    shift1.topics = [...requestedTopics, ...additionalTopics];
  }

  if (shift2) {
    shift2.title = "Shift 2";
    const closingIds = ["s2-wellness", "s2-turn-off", "s2-restock-reset", "s2-trash", "s2-omomi", "s2-exit"];
    shift2.topics.forEach((topic) => {
      if (closingIds.includes(topic.id)) topic.menuParent = "Closing";
      else delete topic.menuParent;
      topic.treeHidden = topic.id === "s2-wellness";
    });
    const requestedOrder = ["s2-beginning", ...closingIds];
    const knownTopics = new Map(shift2.topics.map((topic) => [topic.id, topic]));
    const requestedTopics = requestedOrder.map((id) => knownTopics.get(id)).filter(Boolean);
    const additionalTopics = shift2.topics.filter((topic) => !requestedOrder.includes(topic.id));
    shift2.topics = [...requestedTopics, ...additionalTopics];
  }

  return { sections: migrated, changed: true };
}

function applyWellnessMenu(sourceSections) {
  const migrated = structuredClone(sourceSections);
  const wellness = migrated.find((section) => section.id === "wellness");
  if (!wellness) return { sections: migrated, changed: false };
  wellness.intro = "";
  wellness.groups = [{ title: "Wellness", topics: structuredClone(wellnessTopics) }];
  return { sections: migrated, changed: true };
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
$("#edit-button").addEventListener("click", () => {
  const visibleTopics = [...document.querySelectorAll(".topic-section")].filter((topic) => {
    const rect = topic.getBoundingClientRect();
    return rect.bottom > 90 && rect.top < window.innerHeight;
  });
  const anchor = visibleTopics.reduce((closest, topic) => {
    if (!closest) return topic;
    return Math.abs(topic.getBoundingClientRect().top - 170) < Math.abs(closest.getBoundingClientRect().top - 170) ? topic : closest;
  }, null);
  const anchorId = anchor?.id;
  const anchorTop = anchor?.getBoundingClientRect().top;
  const previousScroll = window.scrollY;
  editing = true;
  $("#edit-button").classList.add("hidden");
  $("#save-button").classList.remove("hidden");
  renderContent();
  requestAnimationFrame(() => {
    const replacement = anchorId ? document.getElementById(anchorId) : null;
    if (replacement && anchorTop !== undefined) window.scrollBy(0, replacement.getBoundingClientRect().top - anchorTop);
    else window.scrollTo(0, previousScroll);
  });
});
$("#save-button").addEventListener("click", async () => {
  await setDoc(doc(db, "training", "guide"), { sections, structureVersion: guideStructureVersion, updatedAt: new Date().toISOString() });
  editing = false;
  $("#save-button").classList.add("hidden");
  $("#edit-button").classList.remove("hidden");
  renderContent();
});

function updateSection(id, key, value) {
  sections = sections.map((section) => section.id === id ? { ...section, [key]: value } : section);
}

function updateGroup(sectionId, groupIndex, value) {
  sections = sections.map((section) => section.id !== sectionId ? section : {
    ...section,
    groups: section.groups.map((group, index) => index === groupIndex ? { ...group, title: value } : group),
  });
}

function keepAnchorAfterRender(anchorId, anchorTop) {
  renderContent();
  requestAnimationFrame(() => {
    const replacement = document.getElementById(anchorId);
    if (replacement && anchorTop !== undefined) window.scrollBy(0, replacement.getBoundingClientRect().top - anchorTop);
  });
}

function moveGroup(sectionId, groupIndex, direction) {
  const section = sections.find((item) => item.id === sectionId);
  const targetIndex = groupIndex + direction;
  if (!section || targetIndex < 0 || targetIndex >= section.groups.length) return;
  const anchorId = `group-${section.groups[groupIndex].topics[0].id}`;
  const anchorTop = document.getElementById(anchorId)?.getBoundingClientRect().top;
  const groups = [...section.groups];
  [groups[groupIndex], groups[targetIndex]] = [groups[targetIndex], groups[groupIndex]];
  sections = sections.map((item) => item.id === sectionId ? { ...item, groups } : item);
  keepAnchorAfterRender(anchorId, anchorTop);
}

function moveTopic(sectionId, groupIndex, topicIndex, direction) {
  const section = sections.find((item) => item.id === sectionId);
  const group = section?.groups[groupIndex];
  if (!group) return;
  const topic = group.topics[topicIndex];
  const siblingIndices = group.topics.reduce((indices, candidate, index) => {
    const sameParent = (candidate.parentId || "") === (topic.parentId || "");
    const sameMenuParent = (candidate.menuParent || "") === (topic.menuParent || "");
    if (sameParent && sameMenuParent && !candidate.treeHidden) indices.push(index);
    return indices;
  }, []);
  const siblingPosition = siblingIndices.indexOf(topicIndex);
  const targetIndex = siblingIndices[siblingPosition + direction];
  if (targetIndex === undefined) return;
  const anchorId = group.topics[topicIndex].id;
  const anchorTop = document.getElementById(anchorId)?.getBoundingClientRect().top;
  const topics = [...group.topics];
  [topics[topicIndex], topics[targetIndex]] = [topics[targetIndex], topics[topicIndex]];
  sections = sections.map((item) => item.id !== sectionId ? item : {
    ...item,
    groups: item.groups.map((currentGroup, index) => index === groupIndex ? { ...currentGroup, topics } : currentGroup),
  });
  keepAnchorAfterRender(anchorId, anchorTop);
}

function reorderButton(label, title, disabled, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "reorder-button";
  button.textContent = label;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
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

function addChildTopic(sectionId, groupIndex, parentId) {
  const topicId = `topic-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newTopic = { id: topicId, parentId, title: "", summary: "", details: "", videoTitle: "", videoUrl: "" };
  sections = sections.map((section) => section.id !== sectionId ? section : {
    ...section,
    groups: section.groups.map((group, index) => {
      if (index !== groupIndex) return group;
      const topics = [...group.topics];
      const topicById = new Map(topics.map((topic) => [topic.id, topic]));
      const isDescendant = (topic, ancestorId) => {
        let currentParent = topic.parentId;
        while (currentParent) {
          if (currentParent === ancestorId) return true;
          currentParent = topicById.get(currentParent)?.parentId;
        }
        return false;
      };
      let insertIndex = topics.findIndex((topic) => topic.id === parentId) + 1;
      while (insertIndex < topics.length && isDescendant(topics[insertIndex], parentId)) insertIndex += 1;
      topics.splice(insertIndex, 0, newTopic);
      return { ...group, topics };
    }),
  });
  renderContent();
  requestAnimationFrame(() => {
    const article = document.getElementById(topicId);
    article?.scrollIntoView({ behavior: "smooth", block: "center" });
    article?.querySelector(".topic-title-input")?.focus();
  });
}

function deleteTopic(sectionId, groupIndex, topicId) {
  const section = sections.find((item) => item.id === sectionId);
  const group = section?.groups[groupIndex];
  const topic = group?.topics.find((item) => item.id === topicId);
  if (!group || !topic) return;
  const idsToDelete = new Set([topicId]);
  let foundChild = true;
  while (foundChild) {
    foundChild = false;
    group.topics.forEach((candidate) => {
      if (candidate.parentId && idsToDelete.has(candidate.parentId) && !idsToDelete.has(candidate.id)) {
        idsToDelete.add(candidate.id);
        foundChild = true;
      }
    });
  }
  const nestedCount = idsToDelete.size - 1;
  const label = topic.title || "Untitled topic";
  const message = nestedCount
    ? `Delete “${label}” and its ${nestedCount} nested topic${nestedCount === 1 ? "" : "s"}? This cannot be undone after you save.`
    : `Delete “${label}”? This cannot be undone after you save.`;
  if (!window.confirm(message)) return;
  sections = sections.map((item) => item.id !== sectionId ? item : {
    ...item,
    groups: item.groups.map((currentGroup, index) => index === groupIndex
      ? { ...currentGroup, topics: currentGroup.topics.filter((candidate) => !idsToDelete.has(candidate.id)) }
      : currentGroup),
  });
  renderContent();
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
  const insertNode = (node, inline = false) => {
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
    const spacer = inline ? document.createTextNode("\u00a0") : document.createElement("br");
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

  const linkButton = document.createElement("button");
  linkButton.type = "button";
  linkButton.textContent = "Link";
  linkButton.title = "Insert link";
  linkButton.addEventListener("mousedown", (event) => event.preventDefault());
  linkButton.addEventListener("click", () => {
    const selectedText = savedRange && !savedRange.collapsed ? savedRange.toString() : "";
    openLinkDialog(selectedText, (url, label) => {
      const link = document.createElement("a");
      link.href = url;
      link.textContent = label || url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      insertNode(link, true);
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
    linkButton,
    photoButton,
  );
  editor.addEventListener("keyup", rememberSelection);
  editor.addEventListener("mouseup", rememberSelection);
  editor.addEventListener("input", () => onChange(editor.innerHTML));
  wrapper.append(toolbar, editor);
  return wrapper;
}

function openLinkDialog(selectedText, onInsert) {
  document.querySelector(".photo-dialog-backdrop")?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = "photo-dialog-backdrop";
  const form = document.createElement("form");
  form.className = "photo-dialog";
  form.innerHTML = `
    <h3>Insert link</h3>
    <label>Link text<input name="link-text" type="text" placeholder="Text staff will see"></label>
    <label>Web address<input name="link-url" type="text" inputmode="url" placeholder="https://"></label>
    <p class="photo-dialog-error" aria-live="polite"></p>
    <div class="photo-dialog-actions"><button type="button" data-cancel>Cancel</button><button type="submit">Insert</button></div>
  `;
  form.querySelector('[name="link-text"]').value = selectedText;
  const close = () => backdrop.remove();
  form.querySelector("[data-cancel]").addEventListener("click", close);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const url = normalizeLinkUrl(String(data.get("link-url") || ""));
    if (!url) {
      form.querySelector(".photo-dialog-error").textContent = "Enter a valid web address beginning with https:// or http://.";
      return;
    }
    onInsert(url, String(data.get("link-text") || "").trim());
    close();
  });
  backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
  backdrop.append(form);
  document.body.append(backdrop);
  form.querySelector(selectedText ? '[name="link-url"]' : '[name="link-text"]').focus();
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
  const containsMarkup = /<(?:br|div|p|ul|ol|li|u|font|img|a)\b/i.test(value);
  const template = document.createElement("template");
  template.innerHTML = containsMarkup ? value : escapeHtml(value).replace(/\n/g, "<br>");
  const allowedTags = new Set(["BR", "DIV", "P", "UL", "OL", "LI", "U", "FONT", "IMG", "A"]);
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
    if (element.tagName === "A") {
      const safeLink = normalizeLinkUrl(element.getAttribute("href") || "");
      if (!safeLink) { element.replaceWith(document.createTextNode(element.textContent || "")); return; }
      Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));
      element.href = safeLink;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
      return;
    }
    Array.from(element.attributes).forEach((attribute) => {
      const allowedFontAttribute = element.tagName === "FONT" && ["color", "size"].includes(attribute.name.toLowerCase());
      if (!allowedFontAttribute) element.removeAttribute(attribute.name);
    });
  });
  return template.innerHTML;
}

function normalizeLinkUrl(value) {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return "";
  try {
    const parsed = new URL(trimmed);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
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

function videoThumbnailUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : "";
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : "";
    }
    if (parsed.hostname.includes("drive.google.com")) {
      const id = parsed.pathname.match(/\/d\/([^/]+)/)?.[1] || parsed.searchParams.get("id");
      return id ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200` : "";
    }
  } catch {}
  return "";
}

function videoPreview(topic) {
  const url = normalizeLinkUrl(topic.videoUrl || "");
  if (!url) return null;

  const block = document.createElement("div");
  block.className = "video-block";

  const label = document.createElement("p");
  label.className = "video-label";
  label.textContent = topic.videoTitle || "Training video";

  const link = document.createElement("a");
  link.className = "video-preview-link";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = `Open ${topic.videoTitle || topic.title || "training video"}`;
  link.setAttribute("aria-label", link.title);

  const thumbnailUrl = videoThumbnailUrl(topic.videoUrl || "");
  if (thumbnailUrl) {
    const image = document.createElement("img");
    image.src = thumbnailUrl;
    image.alt = `${topic.videoTitle || topic.title || "Training video"} preview`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      link.classList.add("no-thumbnail");
    });
    link.append(image);
  } else {
    link.classList.add("no-thumbnail");
  }

  const play = document.createElement("span");
  play.className = "video-preview-play";
  play.setAttribute("aria-hidden", "true");
  play.textContent = "▶";

  const note = document.createElement("span");
  note.className = "video-preview-note";
  note.textContent = "Click to watch video";

  link.append(play, note);
  block.append(label, link);
  return block;
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
    if (!matchingTopics.length && !editing) return;
    matchCount += matchingTopics.length;

    const treeGroup = document.createElement("div");
    treeGroup.className = "tree-group";
    const groupTarget = group.topics[0] ? `group-${group.topics[0].id}` : `group-${section.id}-${groupIndex}`;
    const groupHeading = document.createElement("h3");
    if (editing) {
      groupHeading.className = "group-menu-editor";
      const groupName = field("input", group.title, "group-name-input", (value) => updateGroup(section.id, groupIndex, value), "Menu name");
      groupName.setAttribute("aria-label", `Edit ${group.title} menu name`);
      const addSubitem = document.createElement("button");
      addSubitem.type = "button";
      addSubitem.className = "add-subitem-button";
      addSubitem.textContent = "+";
      addSubitem.title = `Add item to ${group.title}`;
      addSubitem.setAttribute("aria-label", `Add item to ${group.title}`);
      addSubitem.addEventListener("click", () => addTopic(section.id, groupIndex));
      groupHeading.append(
        groupName,
        reorderButton("↑", `Move ${group.title} up`, groupIndex === 0, () => moveGroup(section.id, groupIndex, -1)),
        reorderButton("↓", `Move ${group.title} down`, groupIndex === section.groups.length - 1, () => moveGroup(section.id, groupIndex, 1)),
        addSubitem,
      );
    } else {
      groupHeading.innerHTML = `<a href="#${groupTarget}">${escapeHtml(group.title)}</a>`;
    }
    treeGroup.append(groupHeading);
    const list = document.createElement("ul");
    const nestedLists = new Map();
    const menuItems = new Map();

    const contentGroup = document.createElement("section");
    contentGroup.className = "content-group";
    contentGroup.id = groupTarget;
    contentGroup.innerHTML = `<p class="group-kicker">${escapeHtml(group.title)}</p>`;
    let activeContentParent = "";

    matchingTopics.forEach((topic) => {
      const parentTarget = topic.menuParent ? `subgroup-${groupIndex}-${topic.menuParent.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : "";
      if (!topic.treeHidden) {
        const item = document.createElement("li");
        item.innerHTML = `<a class="menu-topic-title" href="#${topic.id}">${escapeHtml(topic.title || "Untitled topic")}</a>`;
        if (editing) {
          item.className = "menu-topic-editor";
          const topicIndex = group.topics.findIndex((currentTopic) => currentTopic.id === topic.id);
          const siblings = group.topics.filter((candidate) => (candidate.parentId || "") === (topic.parentId || "") && (candidate.menuParent || "") === (topic.menuParent || "") && !candidate.treeHidden);
          const siblingIndex = siblings.findIndex((candidate) => candidate.id === topic.id);
          const controls = document.createElement("span");
          controls.className = "topic-reorder-controls";
          controls.append(
            reorderButton("↑", `Move ${topic.title || "untitled topic"} up`, siblingIndex === 0, () => moveTopic(section.id, groupIndex, topicIndex, -1)),
            reorderButton("↓", `Move ${topic.title || "untitled topic"} down`, siblingIndex === siblings.length - 1, () => moveTopic(section.id, groupIndex, topicIndex, 1)),
          );
          const addChild = document.createElement("button");
          addChild.type = "button";
          addChild.className = "add-child-button";
          addChild.textContent = "+";
          addChild.title = `Add topic under ${topic.title || "this item"}`;
          addChild.setAttribute("aria-label", `Add topic under ${topic.title || "this item"}`);
          addChild.addEventListener("click", () => addChildTopic(section.id, groupIndex, topic.id));
          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.className = "delete-topic-button";
          deleteButton.textContent = "×";
          deleteButton.title = `Delete ${topic.title || "this item"}`;
          deleteButton.setAttribute("aria-label", `Delete ${topic.title || "this item"}`);
          deleteButton.addEventListener("click", () => deleteTopic(section.id, groupIndex, topic.id));
          controls.append(addChild, deleteButton);
          item.append(controls);
        }
        menuItems.set(topic.id, item);
      }

      if (topic.menuParent && topic.menuParent !== activeContentParent) {
        const subgroupHeading = document.createElement("h2");
        subgroupHeading.className = "content-subgroup-title";
        subgroupHeading.id = parentTarget;
        subgroupHeading.textContent = topic.menuParent;
        contentGroup.append(subgroupHeading);
      }
      activeContentParent = topic.menuParent || "";

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
        const preview = videoPreview(topic);
        if (preview) article.append(preview);
      }
      contentGroup.append(article);
    });

    matchingTopics.forEach((topic) => {
      if (topic.treeHidden || !menuItems.has(topic.id)) return;
      const item = menuItems.get(topic.id);
      if (topic.parentId && menuItems.has(topic.parentId)) {
        const parentItem = menuItems.get(topic.parentId);
        let childList = parentItem.querySelector("ul.topic-children");
        if (!childList) {
          childList = document.createElement("ul");
          childList.className = "topic-children";
          parentItem.append(childList);
        }
        childList.append(item);
        return;
      }
      if (topic.menuParent) {
        if (!nestedLists.has(topic.menuParent)) {
          const parentTarget = `subgroup-${groupIndex}-${topic.menuParent.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          const parentItem = document.createElement("li");
          parentItem.className = "tree-parent";
          parentItem.innerHTML = `<a href="#${parentTarget}">${escapeHtml(topic.menuParent)}</a>`;
          const nestedList = document.createElement("ul");
          parentItem.append(nestedList);
          list.append(parentItem);
          nestedLists.set(topic.menuParent, nestedList);
        }
        nestedLists.get(topic.menuParent).append(item);
        return;
      }
      list.append(item);
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
