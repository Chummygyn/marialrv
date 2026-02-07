// Email de réception (déjà configuré)
const DEST_EMAIL = "info@marialrv.com";
const RVEZY_PROFILE_URL = "https://www.rvezy.com/profile/219489?cta=header-nav-avatar";

// Google Calendar (à configurer)
// 1) CALENDAR_URL = lien de prise de rendez-vous / appointment schedule
// 2) CALENDAR_EMBED_URL = lien "embed" si vous voulez l\'afficher dans la page
const CALENDAR_URL = "https://calendar.google.com/calendar/u/0/r?pli=1";
const CALENDAR_EMBED_URL = "";
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger?.addEventListener("click", () => nav.classList.toggle("open"));
nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

(function setActiveNav() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("nav a[data-page]").forEach(a => {
    if ((a.getAttribute("data-page") || "").toLowerCase() === path) a.classList.add("active");
  });
})();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent("Demande location roulotte – Marial RV Adventure");
  const body = encodeURIComponent(
    `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
  );

  window.location.href = `mailto:${DEST_EMAIL}?subject=${subject}&body=${body}`;
});// --- Reservation page wiring ---
(function initReservation(){
  const link = document.getElementById("calendarLink");
  const frame = document.getElementById("calendarFrame");
  const note = document.getElementById("calendarNote");

  if (link) link.href = CALENDAR_URL;

  // Only show iframe if an embed URL is set (Google blocks many pages in iframes)
  if (frame){
    if (CALENDAR_EMBED_URL && CALENDAR_EMBED_URL.trim().length > 0){
      frame.src = CALENDAR_EMBED_URL;
      frame.style.display = "block";
      if (note) note.style.display = "none";
    } else {
      frame.style.display = "none";
      if (note) note.style.display = "block";
    }
  }
})();

// --- Cartes cliquables sur la page Véhicules ---
(function () {
  const cards = document.querySelectorAll(".vehicle[data-href]");
  if (!cards || !cards.length) return;

  cards.forEach((card) => {
    const href = card.getAttribute("data-href");
    if (!href) return;

    const go = () => { window.location.href = href; };

    card.addEventListener("click", (e) => {
      // Si l’utilisateur clique sur un lien/bouton dans la carte, on ne redirige pas.
      const link = e.target.closest("a, button");
      if (link) return;
      go();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
  });
})();

// --- Calculateur de prix ---
(function initCalculator(){
  const nightsEl = document.getElementById("nights");
  const kmEl = document.getElementById("km");  const optEls = document.querySelectorAll(".opt");

  // Only run on the calculator page
  if (!nightsEl || !kmEl) return;

  const NIGHTLY = 150;
  const PER_KM = 3;

  const nightsLine = document.getElementById("nightsLine");
  const nightsSubtotal = document.getElementById("nightsSubtotal");

  const deliveryLine = document.getElementById("deliveryLine");
  const deliverySubtotal = document.getElementById("deliverySubtotal");

  const optionsLine = document.getElementById("optionsLine");
  const optionsSubtotal = document.getElementById("optionsSubtotal");

  const grandTotalEl = document.getElementById("grandTotal");

  const copyBtn = document.getElementById("copyQuote");
  const resetBtn = document.getElementById("resetCalc");

  function money(n){
    const v = Math.round((Number(n) || 0) * 100) / 100;
    return v.toLocaleString("fr-CA", {maximumFractionDigits: 2}) + " $";
  }

  function compute(){
    const nights = Math.max(1, parseInt(nightsEl.value || "1", 10) || 1);
    const kmOneWay = Math.max(0, parseFloat(kmEl.value || "0") || 0);
    const km = kmOneWay;
const nightsCost = nights * NIGHTLY;
    const deliveryCost = km * PER_KM;

    let optTotal = 0;
    const optNames = [];
    optEls.forEach(el => {
      if (el.checked){
        const price = parseFloat(el.getAttribute("data-price") || "0") || 0;
        optTotal += price;
        const label = (el.parentElement?.textContent || "").trim();
        optNames.push(label.replace(/\s+/g, " "));
      }
    });

    const total = nightsCost + deliveryCost + optTotal;

    if (nightsLine) nightsLine.textContent = String(nights);
    if (nightsSubtotal) nightsSubtotal.textContent = money(nightsCost);

    if (deliveryLine) deliveryLine.textContent = `${kmOneWay} km × ${PER_KM} $`;
    if (deliverySubtotal) deliverySubtotal.textContent = money(deliveryCost);

    if (optionsLine) optionsLine.textContent = optNames.length ? optNames.join(" • ") : "—";
    if (optionsSubtotal) optionsSubtotal.textContent = money(optTotal);

    if (grandTotalEl) grandTotalEl.textContent = money(total);
  }

  function reset(){
    nightsEl.value = "1";
    kmEl.value = "0";    optEls.forEach(el => el.checked = false);
    compute();
  }

  function getSummary(){
    const nights = Math.max(1, parseInt(nightsEl.value || "1", 10) || 1);
    const kmOneWay = Math.max(0, parseFloat(kmEl.value || "0") || 0);
        const optNames = [];
    optEls.forEach(el => {
      if (el.checked){
        const label = (el.parentElement?.textContent || "").trim();
        optNames.push(label.replace(/\s+/g, " "));
      }
    });

    const total = grandTotalEl?.textContent || "";
    return [
      "Marial RV Adventure – Estimation",
      `Nuits: ${nights} × 150 $`,
      `Livraison (aller): ${kmOneWay} km × 3 $ (départ: 319 Massenet J3B 8V9)`,
      `Options: ${optNames.length ? optNames.join(", ") : "Aucune"}`,
      `TOTAL (avant taxes): ${total}`
    ].join("\n");
  }

  function copy(){
    const text = getSummary();
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copié ✅";
        setTimeout(() => (copyBtn.textContent = "Copier le résumé"), 1200);
      }).catch(() => alert(text));
    } else {
      alert(text);
    }
  }

  nightsEl.addEventListener("input", compute);
  kmEl.addEventListener("input", compute);
  optEls.forEach(el => el.addEventListener("change", compute));
  resetBtn?.addEventListener("click", reset);
  copyBtn?.addEventListener("click", copy);

  compute();
})();


// --- Calculateur sur la page Réservation (dates + km + options) ---
(function initReservationPricing(){
  const startEl = document.getElementById("resStart");
  const endEl = document.getElementById("resEnd");
  const kmEl = document.getElementById("resKm");
  const addrEl = document.getElementById("resAddress");
  const optEls = document.querySelectorAll(".res-opt");

  if (!startEl || !endEl || !kmEl) return;

  const NIGHTLY = 150;
  const PER_KM = 3;

  const nightsLine = document.getElementById("resNightsLine");
  const nightsSubtotal = document.getElementById("resNightsSubtotal");

  const deliveryLine = document.getElementById("resDeliveryLine");
  const deliverySubtotal = document.getElementById("resDeliverySubtotal");

  const optionsLine = document.getElementById("resOptionsLine");
  const optionsSubtotal = document.getElementById("resOptionsSubtotal");

  const grandTotalEl = document.getElementById("resGrandTotal");

  const openBtn = document.getElementById("resOpenGCal");
  const copyBtn = document.getElementById("resCopyQuote");

  function money(n){
    const v = Math.round((Number(n) || 0) * 100) / 100;
    return v.toLocaleString("fr-CA", {maximumFractionDigits: 2}) + " $";
  }

  function parseDate(v){
    if (!v) return null;
    const [y,m,d] = v.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(Date.UTC(y, m-1, d));
  }

  function daysBetween(startUTC, endUTC){
    const ms = endUTC - startUTC;
    return Math.round(ms / (1000*60*60*24));
  }

  function yyyymmdd(v){
    return (v || "").replaceAll("-", "");
  }

  function compute(){
    const s = parseDate(startEl.value);
    const e = parseDate(endEl.value);
    let nights = 0;

    if (s && e){
      nights = daysBetween(s, e);
      if (nights < 0) nights = 0;
    }

    const km = Math.max(0, parseFloat(kmEl.value || "0") || 0);

    const nightsCost = nights * NIGHTLY;
    const deliveryCost = km * PER_KM;

    let optTotal = 0;
    const optNames = [];
    optEls.forEach(el => {
      if (el.checked){
        const price = parseFloat(el.getAttribute("data-price") || "0") || 0;
        optTotal += price;
        const label = (el.parentElement?.textContent || "").trim();
        optNames.push(label.replace(/\s+/g, " "));
      }
    });

    const total = nightsCost + deliveryCost + optTotal;

    if (nightsLine) nightsLine.textContent = nights ? `${nights} × 150 $` : "Sélectionnez vos dates";
    if (nightsSubtotal) nightsSubtotal.textContent = money(nightsCost);

    if (deliveryLine) deliveryLine.textContent = `${km} km × 3 $`;
    if (deliverySubtotal) deliverySubtotal.textContent = money(deliveryCost);

    if (optionsLine) optionsLine.textContent = optNames.length ? optNames.join(" • ") : "—";
    if (optionsSubtotal) optionsSubtotal.textContent = money(optTotal);

    if (grandTotalEl) grandTotalEl.textContent = money(total);

    return { nights, km, optNames, total };
  }

  function getSummary(){
    const { nights, km, optNames, total } = compute();
    const addr = (addrEl?.value || "").trim();
    const s = startEl.value || "";
    const e = endEl.value || "";

    return [
      "Marial RV Adventure – Demande de réservation (estimation)",
      s && e ? `Dates: ${s} → ${e} (${nights} nuits)` : "Dates: (à compléter)",
      `Livraison (aller): ${km} km × 3 $ (départ: 319 Massenet J3B 8V9)`,
      addr ? `Adresse de livraison: ${addr}` : "Adresse de livraison: (à compléter)",
      `Options: ${optNames.length ? optNames.join(", ") : "Aucune"}`,
      `TOTAL (avant taxes): ${money(total)}`
    ].join("\n");
  }

  function copy(){
    const text = getSummary();
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copié ✅";
        setTimeout(() => (copyBtn.textContent = "Copier le résumé"), 1200);
      }).catch(() => alert(text));
    } else {
      alert(text);
    }
  }

  function openGoogleCalendar(){
    const s = startEl.value;
    const e = endEl.value;

    if (!s || !e){
      alert("Veuillez choisir une date d’arrivée et une date de départ.");
      return;
    }
    const { nights } = compute();
    if (nights <= 0){
      alert("La date de départ doit être après la date d’arrivée.");
      return;
    }

    const summary = "Demande réservation – Marial RV Adventure";
    const details = getSummary();

    const dates = `${yyyymmdd(s)}/${yyyymmdd(e)}`;
    const loc = (addrEl?.value || "").trim() || "Livraison (à préciser)";

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(summary) +
      "&dates=" + encodeURIComponent(dates) +
      "&details=" + encodeURIComponent(details) +
      "&location=" + encodeURIComponent(loc);

    window.open(url, "_blank");
  }

  // Prefill start/end with today + tomorrow
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const tomorrow = new Date(today.getTime() + 24*60*60*1000);
  const yyyy2 = tomorrow.getFullYear();
  const mm2 = String(tomorrow.getMonth()+1).padStart(2, "0");
  const dd2 = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowStr = `${yyyy2}-${mm2}-${dd2}`;

  if (!startEl.value) startEl.value = todayStr;
  if (!endEl.value) endEl.value = tomorrowStr;

  startEl.addEventListener("change", compute);
  endEl.addEventListener("change", compute);
  kmEl.addEventListener("input", compute);
  addrEl?.addEventListener("input", compute);
  optEls.forEach(el => el.addEventListener("change", compute));

  openBtn?.addEventListener("click", openGoogleCalendar);
  copyBtn?.addEventListener("click", copy);

  compute();
})();


// --- Datepicker simple (calendrier popup) ---
(function initDatePicker(){
  const inputs = Array.from(document.querySelectorAll("input[readonly][placeholder='AAAA-MM-JJ']"));
  if (!inputs.length) return;

  function pad2(n){ return String(n).padStart(2, "0"); }
  function fmtDate(d){
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  }
  function parseYMD(s){
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(String(s||"").trim());
    if (!m) return null;
    const y = Number(m[1]), mo = Number(m[2]) - 1, da = Number(m[3]);
    const d = new Date(y, mo, da);
    if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== da) return null;
    return d;
  }
  function monthName(m){
    const names = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
    return names[m] || "";
  }

  function buildPopover(){
    const pop = document.createElement("div");
    pop.className = "dp-popover";
    pop.setAttribute("role","dialog");
    pop.innerHTML = `
      <div class="dp-header">
        <div class="dp-title"></div>
        <div class="dp-nav">
          <button type="button" class="dp-btn" data-nav="-1" aria-label="Mois précédent">‹</button>
          <button type="button" class="dp-btn" data-nav="1" aria-label="Mois suivant">›</button>
        </div>
      </div>
      <div class="dp-dow">
        <div>Lu</div><div>Ma</div><div>Me</div><div>Je</div><div>Ve</div><div>Sa</div><div>Di</div>
      </div>
      <div class="dp-grid"></div>
      <div class="dp-foot">
        <span class="hint">Cliquez une date</span>
        <button type="button" class="btn" style="padding:6px 10px; border-radius:12px" data-today>Aujourd’hui</button>
      </div>
    `;
    return pop;
  }

  let active = null;

  function closeActive(){
    if (!active) return;
    active.pop.remove();
    active = null;
  }

  function openFor(input){
    closeActive();
    const wrap = input.closest(".dp-wrap") || input.parentElement;
    const pop = buildPopover();
    wrap.appendChild(pop);

    const title = pop.querySelector(".dp-title");
    const grid = pop.querySelector(".dp-grid");

    const today = new Date();
    const selected = parseYMD(input.value);
    let view = selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1);

    function render(){
      title.textContent = `${monthName(view.getMonth())} ${view.getFullYear()}`;
      grid.innerHTML = "";

      const first = new Date(view.getFullYear(), view.getMonth(), 1);
      const startDow = (first.getDay() + 6) % 7; // 0=Monday
      const daysInMonth = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
      const prevLast = new Date(view.getFullYear(), view.getMonth(), 0).getDate();

      const totalCells = 42;
      for (let i=0;i<totalCells;i++){
        const cell = document.createElement("div");
        cell.className = "dp-day";

        let dayNum, dateObj, muted=false;
        if (i < startDow){
          dayNum = prevLast - (startDow - 1 - i);
          dateObj = new Date(view.getFullYear(), view.getMonth()-1, dayNum);
          muted = true;
        } else if (i >= startDow + daysInMonth){
          dayNum = i - (startDow + daysInMonth) + 1;
          dateObj = new Date(view.getFullYear(), view.getMonth()+1, dayNum);
          muted = true;
        } else {
          dayNum = i - startDow + 1;
          dateObj = new Date(view.getFullYear(), view.getMonth(), dayNum);
        }

        cell.textContent = String(dayNum);
        if (muted) cell.classList.add("muted");

        const isToday = dateObj.getFullYear()===today.getFullYear() && dateObj.getMonth()===today.getMonth() && dateObj.getDate()===today.getDate();
        if (isToday) cell.classList.add("today");

        const sel = parseYMD(input.value);
        if (sel && dateObj.getFullYear()===sel.getFullYear() && dateObj.getMonth()===sel.getMonth() && dateObj.getDate()===sel.getDate()){
          cell.classList.add("selected");
        }

        cell.addEventListener("click", () => {
          input.value = fmtDate(dateObj);
          input.dispatchEvent(new Event("change", {bubbles:true}));
          closeActive();
        });

        grid.appendChild(cell);
      }
    }

    pop.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const nav = btn.getAttribute("data-nav");
      if (nav){
        view = new Date(view.getFullYear(), view.getMonth()+Number(nav), 1);
        render();
      }

      if (btn.hasAttribute("data-today")){
        const t = new Date();
        input.value = fmtDate(t);
        input.dispatchEvent(new Event("change", {bubbles:true}));
        closeActive();
      }
    });

    active = { input, pop };
    render();
  }

  inputs.forEach(input => {
    input.addEventListener("click", () => openFor(input));
    input.addEventListener("focus", () => openFor(input));
  });

  document.addEventListener("click", (e) => {
    if (!active) return;
    const inPopover = e.target.closest(".dp-popover");
    const inWrap = e.target.closest(".dp-wrap");
    if (inPopover || inWrap) return;
    closeActive();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeActive();
  });
})();
