(function () {
  const { $, $$, esc, icon, Router, img, avatar, stack, person, toast, Focus } = UI;

  function list(view) {
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">birlikte, sessizce</p><h1>Çalışma odaları</h1></div>
        <button class="btn ghost" id="newRoom">${icon("plus")} Oda oluştur</button>
      </header>
      <section class="grid rooms">
        ${DB.rooms.map((r, i) => `
          <a class="room ${i === 0 ? "feat" : ""}" href="#/oda/${r.id}">
            <img src="${img(r.img)}" alt="" loading="lazy" />
            <div class="room-in">
              <div class="card-top"><span class="live mono"><i></i>${r.live} kişi</span><span class="mono pill-d">${r.mode}</span></div>
              <div>
                <h2>${r.name}</h2>
                <p class="small">${r.topic}</p>
                <div class="row-l">${stack(r.people, 26, r.live - r.people.length)}<span class="btn sm light">Katıl</span></div>
              </div>
            </div>
          </a>`).join("")}
      </section>`;
    $("#newRoom").onclick = () => toast("Özel oda oluşturma yakında. Şimdilik açık odalara katılabilirsin.");
  }

  const CHAT = [
    ["zeynep", "50 dakikalık tura başlıyorum, kolay gelsin herkese"],
    ["ege", "türev çalışan var mı, zincir kuralında takıldım"],
    ["kaan", "@ege asistan'daki sorularla modu iyi, cevabı vermeden yönlendiriyor"],
    ["ada", "mola! 10 dk sonra dönüyorum"],
    ["mert", "bugünkü hedef: 40 paragraf sorusu"],
    ["nil", "kütüphane modunda müzik açmayın lütfen :)"],
  ];

  function room(view, params, [id]) {
    const r = DB.rooms.find((x) => x.id === id);
    if (!r) return list(view);
    const everyone = [...new Set([...r.people, "ege", "zeynep", "mert", "ada", "kaan", "nil"])].slice(0, 8);
    let ci = 0;

    view.innerHTML = `
      <section class="oda">
        <div class="oda-stage">
          <img src="${img(r.img)}" alt="" />
          <div class="oda-in">
            <div class="card-top">
              <a href="#/odalar" class="ib light">${icon("back")}</a>
              <span class="live mono"><i></i>${r.live} kişi · ${r.mode}</span>
            </div>
            <div class="oda-center">
              <p class="mono">${esc(r.name)}</p>
              <div class="oda-timer"><div id="odaRing"></div><div class="oda-t"><b class="mono" id="odaTime"></b><small id="odaPhase"></small></div></div>
              <div class="row">
                <button class="btn light" id="odaBtn"></button>
                <button class="btn ghost light-ghost" id="odaLeave">${icon("exit")} Ayrıl</button>
              </div>
            </div>
            <div class="oda-bar">
              <button class="ib light" title="Mikrofon kapalı">${icon("mic")}</button>
              <button class="ib light" title="Kamera kapalı">${icon("cam")}</button>
              <button class="ib light" title="Ortam sesi">${icon("volume")}</button>
              <span class="small">Yağmur sesi · %30</span>
            </div>
          </div>
        </div>
        <aside class="glass card oda-side">
          <h3>Odadakiler</h3>
          <ul class="people">
            <li>${avatar("elif", 34)}<span class="grow"><b>Sen</b><small>Türev · zincir kuralı</small></span><span class="st on mono">odakta</span></li>
            ${everyone.map((p, i) => `<li>${avatar(p, 34)}<span class="grow"><b>${person(p).name}</b><small>${["Paragraf", "Türev", "Organik kimya", "Tarih tekrar", "Fizik soru", "Geometri", "Biyoloji", "Edebiyat"][i]}</small></span><span class="st mono ${i % 3 === 2 ? "" : "on"}">${i % 3 === 2 ? "molada" : "odakta"}</span></li>`).join("")}
          </ul>
          <div class="hair"></div>
          <div class="oda-chat" id="odaChat"></div>
          <form class="composer" id="odaForm"><input placeholder="Odaya mesaj yaz…" /><button class="send" aria-label="Gönder">${icon("send")}</button></form>
        </aside>
      </section>`;

    if (Focus.total !== (r.mode.includes("50") ? 50 : 25) * 60 && !Focus.running) Focus.set(r.mode.includes("50") ? 50 : 25);
    const off = Focus.on((f) => {
      if (!$("#odaRing")) return;
      $("#odaRing").innerHTML = UI.ring(1 - f.left / f.total, 220, 2);
      $("#odaTime").textContent = f.fmt();
      $("#odaPhase").textContent = f.running ? (f.phase === "odak" ? "odak turu" : "mola") : "başlamaya hazır";
      $("#odaBtn").innerHTML = `${icon(f.running ? "pause" : "play")} ${f.running ? "Duraklat" : "Turu başlat"}`;
    });
    $("#odaBtn").onclick = () => Focus.toggle();
    $("#odaLeave").onclick = () => { location.hash = "#/odalar"; toast("Odadan ayrıldın. Sayaç çalışmaya devam ediyor."); };

    const chat = $("#odaChat");
    const push = (who, text) => {
      chat.insertAdjacentHTML("beforeend", `<div class="cm">${avatar(who, 22)}<p><b>${who === "elif" ? "Sen" : person(who).name.split(" ")[0]}</b> ${esc(text)}</p></div>`);
      chat.scrollTop = chat.scrollHeight;
    };
    CHAT.slice(0, 3).forEach(([w, t]) => push(w, t)); ci = 3;
    const t = setInterval(() => { if (ci < CHAT.length) push(...CHAT[ci++]); }, 6000);
    $("#odaForm").onsubmit = (e) => { e.preventDefault(); const i = $("input", e.target); if (i.value.trim()) push("elif", i.value.trim()); i.value = ""; };
    Router.onLeave(() => { clearInterval(t); off(); });
  }

  Router.add("odalar", list);
  Router.add("oda", room, "odalar");
})();
