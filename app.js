const makePages = (slug, count) => Array.from({ length: count }, (_, index) => `assets/brochures/${slug}/page-${String(index + 1).padStart(2, "0")}.webp`);

const brochures = [
  {
    id: "speedcloud",
    title: "SpeedCloud Performance",
    category: "Performance benchmark brief",
    pdf: "assets/brochures/speedcloud/speedcloud.pdf",
    pages: makePages("speedcloud", 6)
  },
  {
    id: "supreme",
    title: "SpeedCloud Supreme",
    category: "Performance benchmark report",
    pdf: "assets/brochures/supreme/supreme.pdf",
    pages: makePages("supreme", 16)
  },
  {
    id: "ai-entitlements",
    title: "AI Customer Entitlements",
    category: "Cloud and AI service entitlements",
    pdf: "assets/brochures/ai-entitlements/ai-entitlements.pdf",
    pages: makePages("ai-entitlements", 34)
  },
  {
    id: "xperience",
    title: "The NxtGen Xperience",
    category: "India's sovereign cloud and AI",
    pdf: "assets/brochures/xperience/xperience.pdf",
    pages: makePages("xperience", 12)
  },
  {
    id: "sas-f",
    title: "SAS-F",
    category: "Standardized AI Solutions Framework",
    pdf: "assets/brochures/sas-f/sas-f.pdf",
    pages: makePages("sas-f", 8)
  },
  {
    id: "capability-catalog",
    title: "SpeedCloud Capability Catalog",
    category: "SpeedCloud capability portfolio",
    pdf: "assets/brochures/capability-catalog/capability-catalog.pdf",
    singlePage: true,
    pages: makePages("capability-catalog", 36)
  },
  {
    id: "supreme-redhat",
    title: "SpeedCloud Supreme: Red Hat",
    category: "Private cloud modernisation for AI adoption",
    pdf: "assets/brochures/supreme-redhat/supreme-redhat.pdf",
    pages: makePages("supreme-redhat", 3)
  },
  {
    id: "customer-entitlements",
    title: "SpeedCloud Customer Entitlements",
    category: "Public cloud services, operations and responsibilities",
    pdf: "assets/brochures/customer-entitlements/customer-entitlements.pdf",
    pages: makePages("customer-entitlements", 38)
  },
  {
    id: "supreme-customer-entitlements",
    title: "SpeedCloud Supreme Customer Entitlements",
    category: "Private cloud services, governance and responsibilities",
    pdf: "assets/brochures/supreme-customer-entitlements/supreme-customer-entitlements.pdf",
    pages: makePages("supreme-customer-entitlements", 27)
  }
];

const state = { selected: new Set([brochures[0].id]), active: 0, page: 0, speaking: false, muted: false };
const el = (id) => document.getElementById(id);
const rail = el("brochureRail");
const singlePageMode = () => window.matchMedia("(max-width: 760px)").matches || brochures[state.active]?.singlePage === true;

function brochureCard(brochure, index) {
  const selected = state.selected.has(brochure.id);
  return `<article class="brochure-card ${selected ? "selected" : ""}" data-index="${index}">
    <button class="cover" type="button" aria-label="Preview ${brochure.title}">
      <img class="cover-art" src="${brochure.pages[0]}" alt="${brochure.title} cover" loading="${index < 3 ? "eager" : "lazy"}" />
      <span class="selection-mark" aria-label="${selected ? "Selected" : "Not selected"}"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9" /></svg></span>
    </button>
    <div class="card-meta"><div><h3>${brochure.title}</h3><p>${brochure.category}</p></div>
    <button class="select-button" type="button">${selected ? "Selected" : "Select"}</button></div>
    <button class="preview-link" type="button">Preview brochure <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg></button>
  </article>`;
}

function renderCatalog() {
  rail.innerHTML = brochures.map(brochureCard).join("");
  el("selectionCount").textContent = `${state.selected.size} selected`;
  rail.querySelectorAll(".brochure-card").forEach((card) => {
    const index = Number(card.dataset.index);
    card.querySelector(".cover").addEventListener("click", () => openBrochure(index));
    card.querySelector(".preview-link").addEventListener("click", () => openBrochure(index));
    card.querySelector(".select-button").addEventListener("click", () => toggleSelection(index));
  });
}

function openBrochure(index) {
  state.active = index;
  state.page = 0;
  if (!state.selected.has(brochures[index].id)) state.selected.add(brochures[index].id);
  stopNarration();
  renderCatalog();
  renderBook("none");
  el("bookStage").scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleSelection(index) {
  const id = brochures[index].id;
  if (state.selected.has(id) && state.selected.size > 1) state.selected.delete(id);
  else state.selected.add(id);
  renderCatalog();
}

function pageMarkup(pageUrl, pageNo, title) {
  return `<div class="pdf-page-frame"><img class="pdf-page-image" src="${pageUrl}" alt="${title}, page ${pageNo + 1}" /></div>`;
}

function renderBook(direction = "next") {
  const brochure = brochures[state.active];
  const leftIndex = state.page;
  const rightIndex = Math.min(leftIndex + 1, brochure.pages.length - 1);
  const single = singlePageMode();
  el("book").classList.toggle("single-page-book", single);
  el("viewerTitle").textContent = brochure.title;
  el("leftPage").innerHTML = pageMarkup(brochure.pages[leftIndex], leftIndex, brochure.title);
  el("rightPage").innerHTML = pageMarkup(brochure.pages[rightIndex], rightIndex, brochure.title);
  el("pageCount").textContent = single ? `${leftIndex + 1} / ${brochure.pages.length}` : `${leftIndex + 1}–${rightIndex + 1} / ${brochure.pages.length}`;
  const atStart = leftIndex === 0;
  const atEnd = single ? leftIndex >= brochure.pages.length - 1 : rightIndex >= brochure.pages.length - 1;
  el("previousPage").disabled = atStart;
  el("backControl").disabled = atStart;
  el("nextPage").disabled = atEnd;
  el("nextControl").disabled = atEnd;
  const turn = el("pageTurn");
  turn.className = direction === "none" ? "page-turn" : `page-turn ${direction}`;
  turn.innerHTML = direction === "previous"
    ? `<img src="${brochure.pages[leftIndex]}" alt="" />`
    : `<img src="${brochure.pages[rightIndex]}" alt="" />`;
  if (direction !== "none") {
    void turn.offsetWidth;
    turn.classList.add("animate");
  }
}

function changePage(delta) {
  const brochure = brochures[state.active];
  const step = singlePageMode() ? 1 : 2;
  const maxStart = singlePageMode() ? brochure.pages.length - 1 : Math.max(0, brochure.pages.length - 2);
  const next = Math.max(0, Math.min(maxStart, state.page + delta * step));
  if (next === state.page) return;
  state.page = next;
  stopNarration();
  renderBook(delta > 0 ? "next" : "previous");
}

function narrationText() {
  const brochure = brochures[state.active];
  const narration = window.NXTGEN_NARRATION?.[brochure.id] || [];
  const pages = singlePageMode() ? [state.page] : [state.page, Math.min(state.page + 1, brochure.pages.length - 1)];
  const text = pages.map((index) => narration[index]).filter(Boolean).join(". ");
  return text || `${brochure.title}. Page ${state.page + 1} of ${brochure.pages.length}.`;
}

function getIndianVoice() {
  return speechSynthesis.getVoices().find((voice) => /en-IN/i.test(voice.lang)) || speechSynthesis.getVoices().find((voice) => /^en/i.test(voice.lang));
}

function startNarration() {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const spokenText = narrationText();
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.voice = getIndianVoice();
  utterance.lang = "en-IN";
  utterance.rate = 0.88;
  utterance.pitch = 0.96;
  utterance.volume = state.muted ? 0 : 0.9;
  utterance.onboundary = (event) => { el("audioProgress").style.width = `${Math.min(100, (event.charIndex / spokenText.length) * 100)}%`; };
  utterance.onend = stopNarration;
  speechSynthesis.speak(utterance);
  state.speaking = true;
  el("listenButton").classList.add("active");
  el("listenButton").setAttribute("aria-pressed", "true");
  el("listenLabel").textContent = "Pause";
}

function stopNarration() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  state.speaking = false;
  el("listenButton")?.classList.remove("active");
  el("listenButton")?.setAttribute("aria-pressed", "false");
  if (el("listenLabel")) el("listenLabel").textContent = "Listen";
  if (el("audioProgress")) el("audioProgress").style.width = "0%";
}

function csvCell(value) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
function exportLeads() {
  const leads = JSON.parse(localStorage.getItem("nxtgen-event-leads") || "[]");
  if (!leads.length) { alert("No visitor leads have been saved on this device yet."); return; }
  const headers = ["Captured at", "Full name", "Work email", "Company", "Mobile", "Selected brochures", "Sync status"];
  const rows = leads.map((lead) => [lead.capturedAt, lead.fullName, lead.email, lead.company, lead.mobile, lead.brochures.join(" | "), lead.synced ? "Synced" : "Local"]);
  const csv = "\uFEFF" + [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = `nxtgen-event-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function sendBrochures(config, lead) {
  if (!config.leadEndpoint || !config.emailJsServiceId || !config.emailJsTemplateId || !config.emailJsPublicKey) {
    throw new Error("Brochure email delivery is not configured.");
  }
  const brochureEntries = lead.brochures.map((title, index) => ({
    title,
    url: new URL(lead.brochureFiles[index], window.location.href).href
  }));
  const brochureLinks = brochureEntries.map(({ title, url }) => `${title}: ${url}`).join("\n\n");
  const directLinks = brochureEntries.map(({ url }) => url).join("\n");
  const deliveryUrl = new URL("downloads.html", window.location.href);
  deliveryUrl.searchParams.set("items", lead.brochureIds.join(","));
  const deliveryLink = deliveryUrl.href;
  const emailMessage = [
    `Hello ${lead.fullName},`,
    "",
    "Thank you for connecting with NxtGen.",
    "",
    "Open your selected brochures:",
    deliveryLink,
    "",
    "Direct PDF links:",
    brochureLinks
  ].join("\n");
  const submission = {
    ...lead,
    brochures: lead.brochures.join(" | "),
    brochureFiles: lead.brochureFiles.join(" | "),
    brochureLinks,
    deliveryLink,
    _subject: "New NxtGen brochure portal lead"
  };
  const response = await fetch(config.leadEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(submission)
  });
  let data = {};
  try { data = await response.json(); } catch (_) { data = {}; }
  if (!response.ok || !data.ok) throw new Error(data.error || "Your details could not be saved. Please try again.");

  const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "text/plain" },
    body: JSON.stringify({
      service_id: config.emailJsServiceId,
      template_id: config.emailJsTemplateId,
      user_id: config.emailJsPublicKey,
      template_params: {
        to_email: lead.email,
        to_name: lead.fullName,
        name: lead.fullName,
        email: lead.email,
        company: lead.company,
        brochure_links: brochureLinks,
        brochure_link: deliveryLink,
        brochure_url: deliveryLink,
        download_link: deliveryLink,
        download_url: deliveryLink,
        portal_link: deliveryLink,
        links: directLinks,
        pdf_link: brochureEntries[0].url,
        pdf_url: brochureEntries[0].url,
        selected_brochures: lead.brochures.join(", "),
        message: emailMessage,
        content: emailMessage,
        email_body: emailMessage,
        body: emailMessage,
        subject: "Your selected NxtGen brochures",
        reply_to: config.senderMailbox,
        from_name: "NxtGen"
      }
    })
  });
  if (!emailResponse.ok) {
    const emailError = (await emailResponse.text()).trim();
    throw new Error(emailError || "The email could not be sent. Please check the EmailJS template.");
  }
  return { ok: true, recipient: lead.email, brochures: lead.brochures };
}

const EMAIL_DOMAIN_CORRECTIONS = {
  "gmai.com": "gmail.com", "gmial.com": "gmail.com", "gmal.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com",
  "outlok.com": "outlook.com", "outloo.com": "outlook.com", "outlook.co": "outlook.com", "outlook.con": "outlook.com",
  "hotmal.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com",
  "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com",
  "nxtgen.co": "nxtgen.com", "nxtgen.con": "nxtgen.com", "nxtgne.com": "nxtgen.com"
};

function normalizeEmailAddress(rawValue) {
  const value = String(rawValue || "").trim();
  const separator = value.lastIndexOf("@");
  if (separator < 1) return value;
  return `${value.slice(0, separator)}@${value.slice(separator + 1).toLowerCase()}`;
}

function validateEmailAddress(rawValue) {
  const value = normalizeEmailAddress(rawValue);
  if (!value || value.length > 254 || /[\s,;]/.test(value)) return { ok: false, error: "Enter one valid work email address." };
  const parts = value.split("@");
  if (parts.length !== 2) return { ok: false, error: "The email must contain one @ symbol." };
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return { ok: false, error: "Check the part of the email before @." };
  }
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_{}\x60|~-]+$/.test(local)) {
    return { ok: false, error: "The email contains unsupported characters." };
  }
  if (!domain || domain.length > 253 || domain.includes("..")) return { ok: false, error: "Enter a complete email domain." };
  const labels = domain.split(".");
  if (labels.length < 2 || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) {
    return { ok: false, error: "Check the email domain after @." };
  }
  const topLevelDomain = labels[labels.length - 1];
  if (!/^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(topLevelDomain)) {
    return { ok: false, error: "The email domain ending does not look valid." };
  }
  const correctedDomain = EMAIL_DOMAIN_CORRECTIONS[domain];
  if (correctedDomain) {
    return { ok: false, error: `Did you mean ${local}@${correctedDomain}? Please correct the address.` };
  }
  const blockedDomains = new Set(["example.com", "example.org", "example.net", "test.com", "invalid.com", "mailinator.com", "tempmail.com"]);
  if (blockedDomains.has(domain) || /^(?:test|dummy|sample|demo)(?:[._+-]?\d*)?$/i.test(local)) {
    return { ok: false, error: "Enter your real work email address. Test or temporary addresses are not accepted." };
  }
  return { ok: true, value };
}

const PLACEHOLDER_VALUE = /^(?:test|testing|dummy|sample|demo|asdf|qwerty|unknown|none|na|n\/a|null|-+)$/i;

function validateTextEntry(rawValue, label) {
  const value = String(rawValue || "").trim().replace(/\s+/g, " ");
  if (value.length < 2 || PLACEHOLDER_VALUE.test(value) || /^(.)\1{2,}$/i.test(value)) {
    return { ok: false, error: `Enter a valid ${label.toLowerCase()}.` };
  }
  return { ok: true, value };
}

function validateMobileNumber(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return { ok: true, value: "" };
  if (!/^[+\d\s().-]+$/.test(value)) return { ok: false, error: "Enter a valid mobile number using digits only." };
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return { ok: false, error: "Enter a valid mobile number with 7 to 15 digits." };
  const localDigits = digits.length > 10 ? digits.slice(-10) : digits;
  if (/^(\d)\1+$/.test(localDigits) || ["1234567890", "9876543210", "0123456789"].includes(localDigits)) {
    return { ok: false, error: "Enter a real mobile number. Placeholder numbers are not accepted." };
  }
  return { ok: true, value };
}

async function submitLead(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const error = el("formError");
  if (!form.checkValidity()) { error.textContent = "Please complete the required fields and consent to receive the material."; form.reportValidity(); return; }
  const emailCheck = validateEmailAddress(formData.get("email"));
  if (!emailCheck.ok) { error.textContent = emailCheck.error; return; }
  const email = emailCheck.value;
  const nameCheck = validateTextEntry(formData.get("fullName"), "Full name");
  if (!nameCheck.ok) { error.textContent = nameCheck.error; return; }
  const companyCheck = validateTextEntry(formData.get("company"), "Company name");
  if (!companyCheck.ok) { error.textContent = companyCheck.error; return; }
  const mobileCheck = validateMobileNumber(formData.get("mobile"));
  if (!mobileCheck.ok) { error.textContent = mobileCheck.error; return; }
  form.elements.email.value = email;
  form.elements.fullName.value = nameCheck.value;
  form.elements.company.value = companyCheck.value;
  form.elements.mobile.value = mobileCheck.value;
  error.textContent = "";
  const selected = brochures.filter((item) => state.selected.has(item.id));
  const lead = {
    capturedAt: new Date().toISOString(), fullName: nameCheck.value, email,
    company: companyCheck.value, mobile: mobileCheck.value,
    brochureIds: selected.map((item) => item.id),
    brochures: selected.map((item) => item.title), brochureFiles: selected.map((item) => item.pdf),
    consent: true, synced: false, emailQueued: false
  };
  const config = window.NXTGEN_CONFIG || {};
  const sendButton = el("sendButton");
  const originalButton = sendButton.innerHTML;
  sendButton.disabled = true;
  sendButton.textContent = "Preparing securely...";
  try {
    const result = config.publicDemo
      ? { ok: true, recipient: email, brochures: selected.map((item) => item.title) }
      : await sendBrochures(config, lead);
    lead.synced = !config.publicDemo;
    lead.emailQueued = !config.publicDemo;
    if (!config.publicDemo) {
      const leads = JSON.parse(localStorage.getItem("nxtgen-event-leads") || "[]");
      leads.push(lead);
      localStorage.setItem("nxtgen-event-leads", JSON.stringify(leads));
    }
    form.hidden = true;
    el("successState").hidden = false;
    el("sentRecipient").textContent = result.recipient || email;
    el("successRecipient").textContent = result.recipient || email;
    const downloadItems = () => selected.map((item) => {
      const li = document.createElement("li");
      if (config.publicDemo || config.downloadDelivery) {
        const link = document.createElement("a");
        link.href = item.pdf;
        link.textContent = `Download ${item.title} (PDF)`;
        link.target = "_blank";
        link.rel = "noopener";
        link.setAttribute("download", "");
        li.appendChild(link);
      } else {
        li.textContent = item.title;
      }
      return li;
    });
    el("successBrochureList").replaceChildren(...downloadItems());
    el("sentBrochureList").replaceChildren(...downloadItems());
    el("successState").scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (sendError) {
    error.textContent = sendError.message || "The brochures could not be prepared.";
  } finally {
    sendButton.disabled = false;
    sendButton.innerHTML = originalButton;
  }
}

function resetVisitor() {
  if (el("sentDialog")?.open) el("sentDialog").close();
  el("leadForm").reset();
  el("leadForm").hidden = false;
  el("successState").hidden = true;
  state.selected = new Set([brochures[0].id]); state.active = 0; state.page = 0;
  renderCatalog(); renderBook("none"); window.scrollTo({ top: 0, behavior: "smooth" });
}

el("previousPage").addEventListener("click", () => changePage(-1));
el("nextPage").addEventListener("click", () => changePage(1));
el("backControl").addEventListener("click", () => changePage(-1));
el("nextControl").addEventListener("click", () => changePage(1));
el("listenButton").addEventListener("click", () => state.speaking ? stopNarration() : startNarration());
el("muteButton").addEventListener("click", () => { state.muted = !state.muted; el("muteButton").classList.toggle("active", state.muted); el("muteButton").setAttribute("aria-pressed", String(state.muted)); el("muteLabel").textContent = state.muted ? "Unmute" : "Mute"; if (state.speaking) startNarration(); });
el("fullscreenButton").addEventListener("click", () => { const stage = el("bookStage"); if (!document.fullscreenElement) stage.requestFullscreen?.(); else document.exitFullscreen?.(); });
el("leadForm").addEventListener("submit", submitLead);
el("newVisitorButton").addEventListener("click", resetVisitor);
el("dialogDoneButton").addEventListener("click", resetVisitor);
el("exportButton")?.addEventListener("click", exportLeads);
document.addEventListener("keydown", (event) => { if (event.key === "ArrowRight") changePage(1); if (event.key === "ArrowLeft") changePage(-1); });
window.addEventListener("resize", () => renderBook("none"));
if ("speechSynthesis" in window) speechSynthesis.getVoices();
renderCatalog();
renderBook("none");
