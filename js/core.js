/* Ortak yardımcılar, tema, yönlendirme, komut paleti, odak sayacı */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (x) => Math.round(x * 100);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const course = (id) => DB.courses.find((c) => c.id === id);
  const person = (id) => DB.people[id];

  /* ---------- Kalıcı durum ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("derslik." + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem("derslik." + k, JSON.stringify(v)); } catch (_) {} },
  };

  /* ---------- Oturum / kullanıcı ---------- */
  const PUBLIC = ["hosgeldin", "giris", "baslangic"];
  const session = {
    user() { return store.get("user", null); },
    save(u) { store.set("user", u); session.apply(); },
    apply() {
      const u = session.user();
      if (!u) return;
      const s = DB.student;
      s.name = u.name.split(" ")[0];
      s.fullName = u.name;
      s.grade = u.grade;
      s.track = u.track;
      s.goalMinutes = u.daily || s.goalMinutes;
      s.target = u.target;
      s.email = u.email;
      DB.people.elif.name = u.name;
      if (u.avatar === false) { delete DB.people.elif.av; DB.people.elif.initials = u.name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase(); }
      if (u.provider) AI.setProvider(u.provider);
    },
    logout() {
      ["user", "plan", "cards", "extraCards", "sessions", "subs", "done"].forEach((k) => { try { localStorage.removeItem("derslik." + k); } catch (_) {} });
      location.hash = "#/hosgeldin";
      location.reload();
    },
  };
  session.apply();

  /* ---------- Tema ---------- */
  const theme = {
    get() { return document.documentElement.dataset.theme || "light"; },
    init() {
      const saved = store.get("theme", null);
      const sys = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.dataset.theme = saved || sys;
    },
    toggle() {
      const t = theme.get() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = t;
      store.set("theme", t);
      Router.refresh();
    },
  };
  theme.init();
  if (store.get("still", false)) document.documentElement.classList.add("still");
  const hue = (c) => (theme.get() === "dark" ? c.hueDark : c.hue);

  /* ---------- Görseller ---------- */
  const img = (name) => `img/${name}.webp`;
  function avatar(id, size = 32, cls = "") {
    const p = person(id) || { name: id, initials: String(id).slice(0, 2).toUpperCase() };
    const st = `width:${size}px;height:${size}px`;
    if (p.av) return `<img class="av ${cls}" src="img/av/${p.av}.webp" alt="${esc(p.name)}" style="${st}" loading="lazy" />`;
    return `<span class="av av-i ${cls}" style="${st};font-size:${Math.round(size * 0.36)}px" title="${esc(p.name)}">${p.initials}</span>`;
  }
  const stack = (ids, size = 26, extra = 0) =>
    `<span class="stack">${ids.map((id) => avatar(id, size)).join("")}${extra > 0 ? `<span class="av av-more" style="width:${size}px;height:${size}px">+${extra}</span>` : ""}</span>`;

  /* ---------- İkonlar (1.4px çizgi) ---------- */
  const P = {
    panel: '<path d="M4 5h7v6H4zM13 5h7v3h-7zM13 10h7v9h-7zM4 13h7v6H4z"/>',
    book: '<path d="M5 4.5h10a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3z"/><path d="M5 16.5a3 3 0 0 1 3-3h10"/>',
    chat: '<path d="M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01"/>',
    camera: '<path d="M4 8.5a2 2 0 0 1 2-2h2l1.5-2h5L16 6.5h2a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/>',
    cards: '<rect x="6" y="3.5" width="12" height="15" rx="2"/><path d="M4 7v11.5a2 2 0 0 0 2 2h9"/>',
    quiz: '<circle cx="12" cy="12" r="8"/><path d="M9.6 9.6a2.4 2.4 0 1 1 3.3 2.2c-.6.3-.9.8-.9 1.4v.3M12 16.5h.01"/>',
    plan: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 14h3M8 17h6"/>',
    chart: '<path d="M4 19.5h16"/><path d="M5 15l4-4 3 3 6-7"/><circle cx="18" cy="7" r="1.2"/>',
    rooms: '<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.3"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M14.5 14.8c2.6-.4 5 .9 5.8 4.2"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/>',
    bell: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2h-14z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
    sun: '<circle cx="12" cy="12" r="3.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    pause: '<path d="M8 5.5v13M16 5.5v13"/>',
    send: '<path d="M5 12h13M13 6l6 6-6 6"/>',
    clip: '<path d="M15.5 7.5 9 14a2 2 0 0 0 2.8 2.8l7-7a4 4 0 0 0-5.6-5.7l-7 7a6 6 0 0 0 8.5 8.5L20 14"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
    redo: '<path d="M19 8a8 8 0 1 0 1 6"/><path d="M19.5 3.5V8H15"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    flame: '<path d="M12 21c3.6 0 6-2.4 6-5.6 0-4-3.5-5.6-4-9.9-2.6 1.6-4 4.2-3.6 6.7-1.2-.6-2-1.8-2.2-3.2C6.9 10.6 6 12.6 6 15.4 6 18.6 8.4 21 12 21z"/>',
    spark: '<path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.6 2.6M15.4 15.4 18 18M6 18l2.6-2.6M15.4 8.6 18 6"/>',
    timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 2M9.5 3h5"/>',
    upload: '<path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9"/><path d="M4.5 15v2.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V15"/>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H6M11 6l-6 6 6 6"/>',
    layers: '<path d="m12 4 8.5 4.5L12 13 3.5 8.5z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5"/>',
    table: '<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M4 10h16M4 14.5h16M10 5v14"/>',
    volume: '<path d="M5 9.5h3l4.5-4v13l-4.5-4H5z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
    cam: '<rect x="3.5" y="6.5" width="12" height="11" rx="2"/><path d="m15.5 10.5 5-3v9l-5-3"/>',
    task: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8.5 11l2 2 4-4M8.5 16.5h7"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.9-3.8 3.9-5.8 7.5-5.8s6.6 2 7.5 5.8"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/>',
    google: '<path d="M20 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.5a3.9 3.9 0 0 1-1.7 2.5v2h2.7c1.6-1.4 2.5-3.6 2.5-6.1z"/><path d="M12 20.5c2.3 0 4.2-.8 5.5-2.1l-2.7-2.1c-.7.5-1.7.8-2.8.8a4.9 4.9 0 0 1-4.6-3.4H4.6v2.1A8.5 8.5 0 0 0 12 20.5z"/><path d="M7.4 13.7a5 5 0 0 1 0-3.2V8.4H4.6a8.5 8.5 0 0 0 0 7.6z"/><path d="M12 6.9c1.3 0 2.4.4 3.3 1.3l2.4-2.4A8.4 8.4 0 0 0 4.6 8.4l2.8 2.1A4.9 4.9 0 0 1 12 6.9z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    file: '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/>',
    trophy: '<path d="M8 4.5h8v5a4 4 0 0 1-8 0z"/><path d="M8 6.5H5.5a2.5 2.5 0 0 0 2.6 3.6M16 6.5h2.5a2.5 2.5 0 0 1-2.6 3.6M12 13.5v3.5M8.5 20.5h7M9.5 20.5l.5-3.5h4l.5 3.5"/>',
    exit: '<path d="M14 4.5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-4M10 16.5l-4.5-4.5L10 7.5M5.5 12H15"/>',
  };
  const icon = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ""}</svg>`;

  /* ---------- Bildirim (toast) ---------- */
  function toast(msg, action) {
    let host = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast glass";
    el.innerHTML = `<span>${msg}</span>${action ? `<a href="${action.href}">${action.label}</a>` : ""}`;
    host.appendChild(el);
    setTimeout(() => el.classList.add("out"), 2800);
    setTimeout(() => el.remove(), 3200);
  }

  /* ---------- Odak sayacı (pomodoro) ---------- */
  const Focus = {
    total: 25 * 60, left: 25 * 60, running: false, phase: "odak", t: null, subs: new Set(), sessions: store.get("sessions", 3),
    set(min) { this.stop(); this.total = this.left = min * 60; this.phase = "odak"; this.emit(); },
    start() {
      if (this.running) return;
      this.running = true;
      this.t = setInterval(() => {
        this.left--;
        if (this.left <= 0) {
          if (this.phase === "odak") { this.sessions++; store.set("sessions", this.sessions); toast("Odak oturumu bitti. 5 dakika mola."); this.phase = "mola"; this.total = this.left = 5 * 60; }
          else { this.phase = "odak"; this.total = this.left = 25 * 60; this.stop(); toast("Mola bitti, hazır olduğunda devam et."); }
        }
        this.emit();
      }, 1000);
      this.emit();
    },
    stop() { this.running = false; clearInterval(this.t); this.emit(); },
    toggle() { this.running ? this.stop() : this.start(); },
    fmt() { const m = Math.floor(this.left / 60), s = this.left % 60; return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; },
    on(fn) { this.subs.add(fn); fn(this); return () => this.subs.delete(fn); },
    emit() { this.subs.forEach((f) => f(this)); },
  };

  /* ---------- Yönlendirme ---------- */
  const routes = {};
  let cleanup = [];
  const Router = {
    add(name, fn, nav) { routes[name] = { fn, nav: nav || name }; },
    onLeave(fn) { cleanup.push(fn); },
    refresh() { Router.go(true); },
    go(keepScroll) {
      const view = $("#view");
      const [path, qs] = (location.hash.slice(1) || "/").split("?");
      const params = new URLSearchParams(qs || "");
      const parts = path.split("/").filter(Boolean);
      cleanup.forEach((f) => f()); cleanup = [];
      $(".ask-sel")?.remove();
      closeSheet();
      let key = parts[0] || "panel";
      if (!session.user() && !PUBLIC.includes(key)) { location.replace("#/hosgeldin"); return; }
      if (session.user() && key === "hosgeldin") { location.replace("#/"); return; }
      const r = routes[key] || routes["404"];
      document.body.classList.toggle("bare", PUBLIC.includes(key));
      if (!shellBuilt && !PUBLIC.includes(key)) buildShell();
      $$("[data-nav]").forEach((a) => a.classList.toggle("on", a.dataset.nav === r.nav));
      document.body.dataset.route = key;
      r.fn(view, params, parts.slice(1));
      if (shellBuilt) refreshBadges();
      if (!keepScroll) {
        view.classList.remove("enter"); void view.offsetWidth; view.classList.add("enter");
        window.scrollTo(0, 0);
      }
    },
  };
  window.addEventListener("hashchange", () => Router.go());

  /* ---------- Komut paleti (⌘K) ---------- */
  const NAV = [
    { href: "#/", label: "Panel", icon: "panel", nav: "panel", group: "Çalış" },
    { href: "#/dersler", label: "Dersler", icon: "book", nav: "dersler", group: "Çalış" },
    { href: "#/odevler", label: "Ödevler", icon: "task", nav: "odevler", group: "Çalış" },
    { href: "#/plan", label: "Plan", icon: "plan", nav: "plan", group: "Çalış" },
    { href: "#/asistan", label: "Asistan", icon: "chat", nav: "asistan", group: "Yapay zekâ" },
    { href: "#/coz", label: "Soru Çöz", icon: "camera", nav: "coz", group: "Yapay zekâ" },
    { href: "#/kartlar", label: "Kartlar", icon: "cards", nav: "kartlar", group: "Yapay zekâ" },
    { href: "#/quiz", label: "Quiz", icon: "quiz", nav: "quiz", group: "Yapay zekâ" },
    { href: "#/analiz", label: "Analiz", icon: "chart", nav: "analiz", group: "Takip" },
    { href: "#/odalar", label: "Çalışma odaları", icon: "rooms", nav: "odalar", group: "Takip" },
  ];

  function paletteItems(q) {
    q = q.toLocaleLowerCase("tr").trim();
    const items = [
      ...NAV.map((n) => ({ label: n.label, sub: "Sayfa", href: n.href, icon: n.icon })),
      ...DB.courses.flatMap((c) => [
        { label: c.name, sub: "Ders", href: `#/ders/${c.id}`, icon: "book" },
        ...c.topics.map((t) => ({ label: t.name, sub: c.name + " · konu", href: `#/ders/${c.id}`, icon: "layers" })),
      ]),
      ...DB.decks.map((d) => ({ label: d.name, sub: "Kart destesi", href: `#/kartlar/${d.id}`, icon: "cards" })),
      ...DB.rooms.map((r) => ({ label: r.name, sub: "Çalışma odası", href: `#/oda/${r.id}`, icon: "rooms" })),
      ...DB.assignments.map((a) => ({ label: a.title, sub: "Ödev", href: `#/odev/${a.id}`, icon: "task" })),
      { label: "Profil", sub: "Sayfa", href: "#/profil", icon: "user" },
      { label: "Ayarlar", sub: "Sayfa", href: "#/ayarlar", icon: "gear" },
      { label: "Temayı değiştir", sub: "Komut", run: () => theme.toggle(), icon: "moon" },
      { label: "25 dk odak başlat", sub: "Komut", run: () => { Focus.set(25); Focus.start(); toast("Odak sayacı başladı."); }, icon: "timer" },
    ];
    if (!q) return items.slice(0, 9);
    const hits = items.filter((i) => (i.label + " " + i.sub).toLocaleLowerCase("tr").includes(q)).slice(0, 8);
    hits.push({ label: `Asistana sor: “${q}”`, sub: "Yapay zekâ", href: `#/asistan?q=${encodeURIComponent(q)}`, icon: "spark" });
    return hits;
  }

  function openPalette() {
    const m = $("#palette");
    m.hidden = false;
    const input = $("input", m);
    input.value = "";
    let sel = 0, items = [];
    const draw = () => {
      items = paletteItems(input.value);
      sel = Math.min(sel, items.length - 1);
      $(".pal-list", m).innerHTML = items.map((it, i) => `<li class="${i === sel ? "on" : ""}" data-i="${i}">${icon(it.icon)}<span class="grow">${esc(it.label)}</span><small class="mono">${esc(it.sub)}</small></li>`).join("");
    };
    const choose = (i) => { const it = items[i]; if (!it) return; closePalette(); it.run ? it.run() : (location.hash = it.href.slice(1)); };
    input.oninput = () => { sel = 0; draw(); };
    input.onkeydown = (e) => {
      if (e.key === "ArrowDown") { sel = (sel + 1) % items.length; draw(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { sel = (sel - 1 + items.length) % items.length; draw(); e.preventDefault(); }
      else if (e.key === "Enter") choose(sel);
      else if (e.key === "Escape") closePalette();
    };
    $(".pal-list", m).onclick = (e) => { const li = e.target.closest("li"); if (li) choose(+li.dataset.i); };
    draw();
    setTimeout(() => input.focus(), 10);
  }
  function closePalette() { $("#palette").hidden = true; }

  /* ---------- Mobil menü ---------- */
  function openSheet() { $("#sheet").hidden = false; }
  function closeSheet() { const s = $("#sheet"); if (s) s.hidden = true; }

  /* ---------- Kabuk ---------- */
  let shellBuilt = false;
  function refreshBadges() {
    const vals = { kartlar: UI.dueCards(), odevler: DB.assignments.filter((a) => a.status === "bekliyor" && !store.get("subs", {})[a.id]).length };
    $$("[data-badge]").forEach((b) => { const v = vals[b.dataset.badge]; b.textContent = v; b.hidden = !v; });
  }
  function buildShell() {
    if (shellBuilt) return;
    shellBuilt = true;
    const groups = [...new Set(NAV.map((n) => n.group))];
    $("#railNav").innerHTML = groups.map((g) => `
      <p class="nav-g mono">${g}</p>
      ${NAV.filter((n) => n.group === g).map((n) => `<a href="${n.href}" data-nav="${n.nav}">${icon(n.icon)}<span>${n.label}</span>${["kartlar", "odevler"].includes(n.nav) ? `<em class="badge ${n.nav === "odevler" ? "alt" : ""}" data-badge="${n.nav}"></em>` : ""}</a>`).join("")}`).join("");

    const nav = (k) => NAV.find((n) => n.nav === k);
    $("#tabbar").innerHTML = [
      nav("panel"), nav("dersler"), { href: "#/coz", label: "Çöz", icon: "camera", nav: "coz", center: true }, nav("asistan"),
    ].map((n) => `<a href="${n.href}" data-nav="${n.nav}" class="${n.center ? "center" : ""}">${icon(n.icon)}<span>${n.label}</span></a>`).join("") +
      `<button id="moreBtn">${icon("menu")}<span>Menü</span></button>`;

    $("#sheet .sheet-grid").innerHTML = [...NAV, { href: "#/profil", label: "Profil", icon: "user", nav: "profil" }, { href: "#/ayarlar", label: "Ayarlar", icon: "gear", nav: "ayarlar" }].map((n) => `<a href="${n.href}" data-nav="${n.nav}">${icon(n.icon)}<span>${n.label}</span></a>`).join("");

    $("#meCard").innerHTML = `${avatar("elif", 34)}<span><b>${DB.student.fullName}</b><small>${DB.student.grade} · ${DB.student.track}</small></span>`;
    $("#meCard").onclick = () => (location.hash = "#/profil");
    $("#topAv").innerHTML = `<button class="av-btn" id="avBtn" aria-label="Hesap menüsü">${avatar("elif", 34)}</button>
      <div class="glass pop pop-s" id="avMenu" hidden>
        <div class="pm-head">${avatar("elif", 36)}<span><b>${DB.student.fullName}</b><small>${esc(DB.student.email || "elif@ornek.com")}</small></span></div>
        <a href="#/profil">${icon("user")} Profil</a>
        <a href="#/ayarlar">${icon("gear")} Ayarlar</a>
        <button id="logout">${icon("exit")} Çıkış yap</button>
      </div>`;
    $("#avBtn").onclick = (e) => { e.stopPropagation(); $("#avMenu").hidden = !$("#avMenu").hidden; };
    $("#logout").onclick = () => session.logout();

    const unread = DB.notifications.filter((n) => n.unread).length;
    $("#bellBtn").innerHTML = icon("bell") + (unread ? `<i class="dot"></i>` : "");
    $("#notifs").innerHTML = `<div class="card-top"><h3>Bildirimler</h3><button class="mono link" id="readAll">tümünü okundu say</button></div>` +
      DB.notifications.map((n) => `<div class="notif ${n.unread ? "unread" : ""}">${n.who ? avatar(n.who, 32) : `<span class="av av-sys">${icon("cards")}</span>`}<p>${n.who ? `<b>${person(n.who).name}</b> ` : ""}${n.text}<small class="mono">${n.when}</small></p></div>`).join("");

    const drawTheme = () => ($("#themeBtn").innerHTML = icon(theme.get() === "dark" ? "sun" : "moon"));
    drawTheme();
    $("#themeBtn").onclick = () => { theme.toggle(); drawTheme(); };
    $("#searchBtn").onclick = openPalette;
    $("#bellBtn").onclick = (e) => { e.stopPropagation(); $("#notifs").hidden = !$("#notifs").hidden; };
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#notifs")) $("#notifs").hidden = true;
      if (!e.target.closest("#avMenu") || e.target.closest("a")) $("#avMenu") && ($("#avMenu").hidden = true);
      if (e.target.id === "readAll") { $$(".notif.unread").forEach((n) => n.classList.remove("unread")); $("#bellBtn .dot")?.remove(); }
    });
    $("#palette").addEventListener("click", (e) => { if (e.target.id === "palette") closePalette(); });
    $("#moreBtn").onclick = openSheet;
    $("#sheet").addEventListener("click", (e) => { if (e.target.id === "sheet" || e.target.closest("a")) closeSheet(); });
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
      if (e.key === "Escape") { closePalette(); closeSheet(); }
    });

    /* Sağlayıcı */
    const sel = $("#provider");
    sel.innerHTML = DB.providers.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
    sel.value = AI.config.provider;
    sel.onchange = () => { AI.setProvider(sel.value); toast(sel.value === "mock" ? "Demo yanıtlarına geçildi." : `${DB.providers.find((p) => p.id === sel.value).name} seçildi — proxy bağlanana kadar demo yanıtları gösterilir.`); };

    /* Üst çubuktaki odak göstergesi */
    Focus.on((f) => {
      const pill = $("#focusPill");
      pill.hidden = !f.running && f.left === f.total;
      pill.innerHTML = `${icon(f.running ? "pause" : "play")}<span class="mono">${f.fmt()}</span><small>${f.phase}</small>`;
    });
    $("#focusPill").onclick = () => Focus.toggle();
  }

  /* ---------- Küçük bileşenler ---------- */
  const ring = (p, size = 44, stroke = 3) => {
    const r = (size - stroke) / 2, C = 2 * Math.PI * r;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" class="track"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})" class="val"/></svg>`;
  };
  const tag = (c) => `<span class="tag" style="--c:${hue(c)}">${c.short || c.name}</span>`;
  const fmtSecs = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const md = (t) =>
    esc(t)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

  window.UI = { session, PUBLIC, $, $$, esc, pct, sleep, course, person, store, theme, hue, img, avatar, stack, icon, toast, Focus, Router, ring, tag, fmtSecs, md, buildShell, openPalette };
})();
