/* JanAwaz voice-first civic complaint prototype (demo).
   Voice: Web Speech API. Typed fallback always available.
   Backend is a clearly labeled demo municipal backend; references are DEMO- numbers.
   The demo collects no names or phone numbers; fictional input only. */
"use strict";

const STRINGS = {
  hi: {
    tagline: "बोलकर नागरी शिकायत दर्ज करें",
    demo_banner: "प्रोटोटाइप डेमो - असली सरकारी सेवा नहीं",
    privacy_note: "कृपया सिर्फ़ काल्पनिक शिकायत दर्ज करें। असली नाम, फ़ोन नंबर या पता न डालें।",
    lang_label: "भाषा चुनिए",
    greet: "नमस्ते, अपनी शिकायत बताइए।",
    ask_location: "समस्या कहाँ है? सही जगह या वार्ड बताइए।",
    ask_duration: "यह समस्या कितने दिनों से है?",
    confirm_heading: "आपकी शिकायत",
    confirm_question: "क्या शिकायत दर्ज करूँ? 'हाँ भेज दो' कहिए या हरा बटन दबाइए।",
    yes_btn: "हाँ, भेज दो",
    no_btn: "नहीं, रद्द करो",
    out_of_scope: "माफ़ कीजिए, यह सेवा अभी उपलब्ध नहीं है। अभी सिर्फ़ पानी, स्ट्रीट लाइट और सफाई की शिकायतें ली जाती हैं। कृपया संबंधित कार्यालय से सीधे संपर्क करें।",
    cant_hear: "मैं साफ़ सुन नहीं पाई। कृपया दोबारा बोलिए।",
    typed_fallback: "आवाज़ सुनाई नहीं दे रही। कृपया टाइप करके बताइए।",
    type_btn: "टाइप करके बताएँ",
    typed_label: "यहाँ टाइप करिए",
    typed_send: "भेजें",
    status_btn: "मेरी शिकायत का क्या हुआ?",
    filed: "आपकी शिकायत दर्ज हो गई। संदर्भ संख्या है:",
    demo_note: "यह सिर्फ़ प्रोटोटाइप डेमो है। यह असली सरकारी संदर्भ संख्या नहीं है।",
    ask_ref: "अपनी संदर्भ संख्या बोलिए या टाइप करिए, जैसे demo 2026 0001।",
    status_prefix: "आपकी शिकायत की स्थिति:",
    ref_not_found: "यह संदर्भ संख्या नहीं मिली। कृपया जाँचकर दोबारा बताइए।",
    no_speech_support: "इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया टाइप करिए।",
    cancelled: "ठीक है, शिकायत दर्ज नहीं की गई।",
    queued_offline: "इंटरनेट नहीं है। शिकायत इसी डिवाइस पर सहेजी गई है; अभी दर्ज नहीं हुई।",
    l_problem: "समस्या", l_place: "जगह", l_duration: "कितने दिनों से", l_category: "वर्ग",
    cat_water: "पानी", cat_street_light: "स्ट्रीट लाइट", cat_sanitation: "सफाई",
    heard_prefix: "सुना: ",
    footer: "JanAwaz प्रोटोटाइप डेमो। सारा नमूना डेटा काल्पनिक है।",
    network_error: "सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा कोशिश करिए।"
  },
  mr: {
    tagline: "बोलून नागरी तक्रार नोंदवा",
    demo_banner: "प्रोटोटाइप डेमो - खरी सरकारी सेवा नाही",
    privacy_note: "कृपया फक्त काल्पनिक तक्रार नोंदवा. खरे नाव, फोन नंबर किंवा पत्ता टाकू नका.",
    lang_label: "भाषा निवडा",
    greet: "नमस्कार, तुमची तक्रार सांगा.",
    ask_location: "समस्या कुठे आहे? नेमकी जागा किंवा वॉर्ड सांगा.",
    ask_duration: "ही समस्या किती दिवसांपासून आहे?",
    confirm_heading: "तुमची तक्रार",
    confirm_question: "तक्रार नोंदवायची आहे का? 'होय, पाठवा' म्हणा किंवा हिरवे बटण दाबा.",
    yes_btn: "होय, पाठवा",
    no_btn: "नको, रद्द करा",
    out_of_scope: "माफ करा, ही सेवा अजून उपलब्ध नाही. सध्या फक्त पाणी, स्ट्रीट लाइट आणि स्वच्छतेच्या तक्रारी घेतल्या जातात. कृपया संबंधित कार्यालयाशी थेट संपर्क साधा.",
    cant_hear: "मला ऐकू आले नाही. कृपया पुन्हा सांगा.",
    typed_fallback: "आवाज ऐकू येत नाही. कृपया टाईप करून सांगा.",
    type_btn: "टाईप करून सांगा",
    typed_label: "इथे टाईप करा",
    typed_send: "पाठवा",
    status_btn: "माझ्या तक्रारीचे काय झाले?",
    filed: "तुमची तक्रार नोंदवली गेली. संदर्भ क्रमांक:",
    demo_note: "हे फक्त प्रोटोटाइप डेमो आहे. हा खरा सरकारी संदर्भ क्रमांक नाही.",
    ask_ref: "तुमचा संदर्भ क्रमांक बोला किंवा टाईप करा, उदा. demo 2026 0001.",
    status_prefix: "तुमच्या तक्रारीची स्थिती:",
    ref_not_found: "हा संदर्भ क्रमांक सापडला नाही. कृपया तपासून पुन्हा सांगा.",
    no_speech_support: "या ब्राउझरमध्ये आवाज ओळख उपलब्ध नाही. कृपया टाईप करा.",
    cancelled: "ठीक आहे, तक्रार नोंदवली गेली नाही.",
    queued_offline: "इंटरनेट नाही. तक्रार याच उपकरणावर जतन केली आहे; अजून नोंदवली गेली नाही.",
    l_problem: "समस्या", l_place: "जागा", l_duration: "किती दिवसांपासून", l_category: "प्रकार",
    cat_water: "पाणी", cat_street_light: "स्ट्रीट लाइट", cat_sanitation: "स्वच्छता",
    heard_prefix: "ऐकले: ",
    footer: "JanAwaz प्रोटोटाइप डेमो. सर्व नमुना डेटा काल्पनिक आहे.",
    network_error: "सर्व्हरशी संपर्क झाला नाही. कृपया पुन्हा प्रयत्न करा."
  },
  en: {
    tagline: "File a civic complaint by speaking",
    demo_banner: "PROTOTYPE DEMO - not a real government service",
    privacy_note: "Please file only a fictional complaint. Do not enter real names, phone numbers or addresses.",
    lang_label: "Choose language",
    greet: "Namaste. Please describe your complaint.",
    ask_location: "Where is the problem? Tell me the exact place or ward.",
    ask_duration: "For how many days has this problem been going on?",
    confirm_heading: "Your complaint",
    confirm_question: "Shall I file this complaint? Say 'yes, send it' or press the green button.",
    yes_btn: "Yes, send it",
    no_btn: "No, cancel",
    out_of_scope: "Sorry, that service is not covered yet. Right now only water, street light and sanitation complaints are taken. Please contact the concerned office directly.",
    cant_hear: "I could not hear clearly. Please say it again.",
    typed_fallback: "I cannot hear you. Please type instead.",
    type_btn: "Type instead",
    typed_label: "Type here",
    typed_send: "Send",
    status_btn: "What happened to my complaint?",
    filed: "Your complaint is filed. The reference number is:",
    demo_note: "This is only a prototype demo. This is not a real government reference number.",
    ask_ref: "Say or type your reference number, for example demo 2026 0001.",
    status_prefix: "Your complaint status:",
    ref_not_found: "I could not find that reference number. Please check and try again.",
    no_speech_support: "This browser does not support speech recognition. Please type instead.",
    cancelled: "Okay, the complaint was not filed.",
    queued_offline: "No internet. The complaint is saved on this device; it has not been filed yet.",
    l_problem: "Problem", l_place: "Place", l_duration: "Since how long", l_category: "Category",
    cat_water: "Water", cat_street_light: "Street light", cat_sanitation: "Sanitation",
    heard_prefix: "Heard: ",
    footer: "JanAwaz prototype demo. All sample data is fictional.",
    network_error: "Could not reach the server. Please try again."
  }
};

const SPEECH_LANG = { hi: "hi-IN", mr: "mr-IN", en: "en-IN" };

const CATEGORY_KEYWORDS = {
  water: ["paani", "pani", "water", "पानी", "पाणी", "pipeline", "supply", "नल", "jal"],
  street_light: ["street light", "light", "batti", "बत्ती", "लाइट", "lamp", "diva", "दिवा", "लाईट"],
  sanitation: ["kachra", "कचरा", "garbage", "safai", "सफाई", "स्वच्छता", "gutter", "naali", "नाली", "gandagi", "गंदगी", "साफ"]
};

const YES_WORDS = ["haan", "han", "ha", "yes", "bhej", "हाँ", "हां", "हो", "होय", "ठीक", "theek", "ok", "okay", "पाठव", "भेज"];
const NO_WORDS = ["nahi", "nahin", "नहीं", "नाही", "no", "nako", "नको", "रद्द", "cancel", "ना "];
const STATUS_WORDS = ["status", "kya hua", "क्या हुआ", "काय झाल", "स्थिती", "स्थिति"];

const $ = id => document.getElementById(id);
const state = {
  lang: "hi",
  step: "greet",
  draft: {},
  lastRef: localStorage.getItem("janawaz_last_ref") || null,
  retries: 0,
  recognition: null,
  listening: false
};

function S(key) { return STRINGS[state.lang][key]; }

function applyStaticStrings() {
  $("tagline").textContent = S("tagline");
  $("demo-banner").textContent = S("demo_banner");
  $("privacy-note").textContent = S("privacy_note");
  $("lang-label").textContent = S("lang_label");
  $("type-toggle").textContent = S("type_btn");
  $("status-btn").textContent = S("status_btn");
  $("typed-label").textContent = S("typed_label");
  $("typed-send").textContent = S("typed_send");
  $("confirm-heading").textContent = S("confirm_heading");
  $("confirm-yes").textContent = S("yes_btn");
  $("confirm-no").textContent = S("no_btn");
  $("footer-note").textContent = S("footer");
}

function say(text) {
  $("status-line").textContent = text;
  if (!("speechSynthesis" in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = SPEECH_LANG[state.lang];
    const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith(SPEECH_LANG[state.lang].slice(0, 2)));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) { /* TTS unavailable: text stays on screen */ }
}

function show(id) { $(id).classList.remove("hidden"); }
function hide(id) { $(id).classList.add("hidden"); }

function detectCategory(text) {
  const t = " " + text.toLowerCase() + " ";
  for (const cat of Object.keys(CATEGORY_KEYWORDS)) {
    if (CATEGORY_KEYWORDS[cat].some(k => t.includes(k))) return cat;
  }
  return null;
}

function isYes(text) {
  const t = " " + text.toLowerCase().trim() + " ";
  return YES_WORDS.some(w => t.includes(w));
}
function isNo(text) {
  const t = " " + text.toLowerCase().trim() + " ";
  return NO_WORDS.some(w => t.includes(w));
}
function isStatusQuery(text) {
  const t = text.toLowerCase();
  return STATUS_WORDS.some(w => t.includes(w));
}
function extractRef(text) {
  const digits = text.replace(/[^0-9]/g, "");
  const m = digits.match(/2026(\d{4})/);
  if (m) return "DEMO-2026-" + m[1];
  const m2 = text.toUpperCase().match(/DEMO-?2026-?(\d{4})/);
  return m2 ? "DEMO-2026-" + m2[1] : null;
}

function advance(text) {
  $("heard").textContent = S("heard_prefix") + text;
  state.retries = 0;

  if (state.step === "await_ref") {
    const ref = extractRef(text);
    if (ref) { fetchStatus(ref); return; }
    say(S("ref_not_found"));
    return;
  }

  if (state.step === "done" || state.step === "greet") {
    if (isStatusQuery(text)) { beginStatusFlow(); return; }
    if (state.step === "done") { state.step = "greet"; }
    state.draft = {};
    state.step = "desc";
  }

  switch (state.step) {
    case "desc": {
      const cat = detectCategory(text);
      if (!cat) { say(S("out_of_scope")); state.step = "greet"; return; }
      state.draft.description = text;
      state.draft.category = cat;
      state.step = "location";
      say(S("ask_location"));
      break;
    }
    case "location":
      state.draft.location = text;
      state.step = "duration";
      say(S("ask_duration"));
      break;
    case "duration":
      state.draft.duration = text;
      showConfirm();
      break;
    case "confirm":
      if (isYes(text)) submitComplaint();
      else if (isNo(text)) { resetToStart(true); say(S("cancelled")); }
      else say(S("confirm_question"));
      break;
    default:
      state.step = "desc";
      advance(text);
  }
}

function showConfirm() {
  state.step = "confirm";
  const d = state.draft;
  $("summary").innerHTML =
    "<dt>" + S("l_category") + "</dt><dd>" + escapeHtml(S("cat_" + d.category)) + "</dd>" +
    "<dt>" + S("l_problem") + "</dt><dd>" + escapeHtml(d.description) + "</dd>" +
    "<dt>" + S("l_place") + "</dt><dd>" + escapeHtml(d.location) + "</dd>" +
    "<dt>" + S("l_duration") + "</dt><dd>" + escapeHtml(d.duration) + "</dd>";
  show("confirm-panel");
  say(S("confirm_question"));
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function submitComplaint() {
  hide("confirm-panel");
  const payload = {
    language: state.lang,
    category: state.draft.category,
    description: state.draft.description,
    location: state.draft.location,
    duration: state.draft.duration
  };
  if (!navigator.onLine) { queueOffline(payload); return; }
  try {
    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("http " + res.status);
    const data = await res.json();
    onFiled(data);
  } catch (e) {
    if (!navigator.onLine) queueOffline(payload);
    else say(S("network_error"));
  }
}

function onFiled(data) {
  state.lastRef = data.ref;
  localStorage.setItem("janawaz_last_ref", data.ref);
  $("result-heading").textContent = S("filed");
  $("result-ref").textContent = data.ref;
  $("result-note").textContent = S("demo_note");
  show("result-panel");
  const spoken = data.ref.split("").join(" ");
  say(S("filed") + " " + spoken + ". " + S("demo_note"));
  state.step = "done";
}

function queueOffline(payload) {
  const q = JSON.parse(localStorage.getItem("janawaz_queue") || "[]");
  q.push({ payload, saved_at: new Date().toISOString() });
  localStorage.setItem("janawaz_queue", JSON.stringify(q));
  resetToStart(true);
  say(S("queued_offline"));
}

function beginStatusFlow() {
  if (state.lastRef) { fetchStatus(state.lastRef); return; }
  state.step = "await_ref";
  say(S("ask_ref"));
}

async function fetchStatus(ref) {
  try {
    const res = await fetch("/api/complaints/" + encodeURIComponent(ref));
    if (res.status === 404) { say(S("ref_not_found")); state.step = "await_ref"; return; }
    if (!res.ok) throw new Error("http " + res.status);
    const data = await res.json();
    $("track-heading").textContent = ref;
    $("track-status").textContent = S("status_prefix") + " " + data.status + ". " + S("demo_note");
    show("track-panel");
    say(S("status_prefix") + " " + data.status);
    state.step = "done";
  } catch (e) {
    say(S("network_error"));
    state.step = "done";
  }
}

function resetToStart(silent) {
  state.step = "greet";
  state.draft = {};
  hide("confirm-panel");
  if (!silent) say(S("greet"));
}

/* ---------- voice capture ---------- */

function speechSupported() {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

function startListening() {
  if (!speechSupported()) {
    say(S("no_speech_support"));
    show("typed-form");
    return;
  }
  if (state.listening) { stopListening(); return; }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Rec();
  state.recognition = rec;
  rec.lang = SPEECH_LANG[state.lang];
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onstart = () => {
    state.listening = true;
    $("mic-btn").classList.add("listening");
  };
  rec.onresult = ev => {
    const text = ev.results[0][0].transcript;
    advance(text);
  };
  rec.onerror = ev => {
    if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
      say(S("no_speech_support"));
      show("typed-form");
      state.retries = 99;
      return;
    }
    state.retries += 1;
    if (state.retries >= 2) {
      say(S("typed_fallback"));
      show("typed-form");
    } else {
      say(S("cant_hear"));
    }
  };
  rec.onend = () => {
    state.listening = false;
    $("mic-btn").classList.remove("listening");
  };
  try { rec.start(); } catch (e) { /* already started */ }
}

function stopListening() {
  if (state.recognition) { try { state.recognition.stop(); } catch (e) {} }
  state.listening = false;
  $("mic-btn").classList.remove("listening");
}

/* ---------- wiring ---------- */

$("lang").addEventListener("change", ev => {
  state.lang = ev.target.value;
  document.documentElement.lang = state.lang;
  applyStaticStrings();
  resetToStart();
});

$("mic-btn").addEventListener("click", startListening);
$("type-toggle").addEventListener("click", () => {
  $("typed-form").classList.toggle("hidden");
  $("typed-input").focus();
});
$("status-btn").addEventListener("click", beginStatusFlow);
$("confirm-yes").addEventListener("click", submitComplaint);
$("confirm-no").addEventListener("click", () => { resetToStart(true); say(S("cancelled")); });
$("typed-form").addEventListener("submit", ev => {
  ev.preventDefault();
  const text = $("typed-input").value.trim();
  if (!text) return;
  $("typed-input").value = "";
  advance(text);
});

window.addEventListener("load", () => {
  applyStaticStrings();
  if ("speechSynthesis" in window) speechSynthesis.getVoices();
  resetToStart();
});
