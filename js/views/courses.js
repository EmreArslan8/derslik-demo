(function () {
  const { $, $$, pct, course, person, hue, img, avatar, icon, Router, tag, fmtSecs, esc } = UI;

  /* ---------- Ders listesi ---------- */
  function list(view) {
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">2026–2027 · 1. dönem</p><h1>Dersler</h1></div>
        <div class="seg" role="tablist"><button class="on" data-f="all">Tümü</button><button data-f="sayisal">Sayısal</button><button data-f="sozel">Sözel</button></div>
      </header>

      <section class="grid courses">
        ${DB.courses.map((c) => {
          const done = c.topics.filter((t) => t.done).length;
          const cur = c.topics.find((t) => t.current);
          const vids = DB.videos.filter((v) => v.course === c.id).length;
          return `
          <a class="glass card course" href="#/ders/${c.id}" data-k="${["edebiyat", "tarih"].includes(c.id) ? "sozel" : "sayisal"}" style="--c:${hue(c)}">
            <div class="cover"><img src="${img(c.cover)}" alt="" loading="lazy" /><span class="code mono">${c.code}</span></div>
            <div class="card-top"><h2>${c.name}</h2><span class="pct mono">${pct(c.progress)}%</span></div>
            <p class="muted small">${c.blurb}</p>
            <div class="bar"><i style="width:${pct(c.progress)}%"></i></div>
            <div class="meta">${avatar(c.teacher, 22)}<span>${person(c.teacher).name}</span><span class="sep"></span><span class="mono">${done}/${c.topics.length} konu · ${vids} video</span></div>
            <p class="next small"><span class="mono muted">sıradaki</span> ${cur ? cur.name : "—"}</p>
          </a>`;
        }).join("")}
      </section>

      <section class="section">
        <div class="sec-head"><h3>Yeni videolar</h3><span class="mono muted">${DB.videos.length} ders videosu</span></div>
        <div class="vrow">
          ${DB.videos.map((v) => { const c = course(v.course); return `
            <a class="vcard" href="#/ders/${c.id}?v=1">
              <div class="media sm"><img src="${img(v.img)}" alt="" loading="lazy" /><span class="play">${icon("play")}</span><span class="dur mono">${v.dur}</span>${v.watched ? `<span class="vbar"><i style="width:${pct(v.watched)}%"></i></span>` : ""}</div>
              <span class="mono muted small" style="color:${hue(c)}">${c.short || c.name}</span>
              <b>${v.title}</b>
            </a>`; }).join("")}
        </div>
      </section>`;

    $$(".seg button", view).forEach((b) =>
      b.addEventListener("click", () => {
        $$(".seg button", view).forEach((x) => x.classList.toggle("on", x === b));
        $$(".course", view).forEach((card) => (card.hidden = b.dataset.f !== "all" && card.dataset.k !== b.dataset.f));
      })
    );
  }

  /* ---------- Ders detayı ---------- */
  function detail(view, params, [id]) {
    const c = course(id);
    if (!c) return list(view);
    const doneSet = UI.store.get("done", {});
    const isDone = (t) => t.done || doneSet[t.id];
    const cur = c.topics.find((t) => t.id === params.get("t")) || c.topics.find((t) => t.current) || c.topics[0];
    const note = DB.notes[cur.id];
    const video = DB.videos.find((v) => v.course === c.id && v.topic === cur.id);
    const prog = c.topics.filter(isDone).length / c.topics.length;
    const deck = DB.decks.find((d) => d.course === c.id);
    let tab = params.get("v") || !note ? "video" : "not";
    if (!video) tab = "not";

    view.innerHTML = `
      <section class="c-hero" style="--c:${hue(c)}">
        <img src="${img(c.cover)}" alt="" />
        <div class="c-hero-in">
          <p class="eyebrow mono"><a href="#/dersler">dersler</a> / ${c.name.toLocaleLowerCase("tr")}</p>
          <h1>${cur.name}</h1>
          <div class="row-l">${avatar(c.teacher, 28)}<span>${person(c.teacher).name}</span><span class="dotsep"></span><span class="mono">${c.code}</span><span class="dotsep"></span><span class="mono">${c.topics.filter(isDone).length}/${c.topics.length} konu tamamlandı</span></div>
        </div>
        <div class="c-hero-act">
          <a class="btn light" href="#/quiz?c=${c.id}">Quiz çöz</a>
          ${deck ? `<a class="btn ghost light-ghost" href="#/kartlar/${deck.id}">Kartlar</a>` : ""}
        </div>
      </section>

      <section class="lesson" style="--c:${hue(c)}">
        <nav class="glass card outline" aria-label="Konular">
          <p class="mono muted">Ünite · ${c.topics.length} konu</p>
          <ol>
            ${c.topics.map((t, i) => `<li class="${isDone(t) ? "done" : ""} ${t === cur ? "now" : ""}"><a href="#/ders/${c.id}?t=${t.id}"><span class="n mono">${isDone(t) ? "✓" : String(i + 1).padStart(2, "0")}</span><span>${t.name}</span><small class="mono">${t.mins} dk${DB.videos.some((v) => v.topic === t.id) ? " · video" : ""}</small></a></li>`).join("")}
          </ol>
          <div class="ol-prog"><span class="bar"><i style="width:${prog * 100}%"></i></span><span class="mono muted">${pct(prog)}%</span></div>
        </nav>

        <div class="lesson-main">
          <div class="tabs">
            ${video ? `<button data-t="video" class="${tab === "video" ? "on" : ""}">${icon("play")} Video</button>` : ""}
            <button data-t="not" class="${tab === "not" ? "on" : ""}">${icon("book")} Ders notu</button>
            <button class="mini done-btn ${isDone(cur) ? "is" : ""}" id="doneBtn">${icon("check")} ${isDone(cur) ? "Tamamlandı" : "Konuyu tamamladım"}</button>
          </div>
          <div id="tabBody"></div>
        </div>

        <aside class="glass card side-chat" id="sidechat">
          <div class="card-top"><h3>Konu asistanı</h3><span class="mono muted prov">demo</span></div>
          <div class="chips">
            <button data-p="Bu konuyu basitçe açıkla" data-m="acikla">Basitçe açıkla</button>
            <button data-p="Bu konuyu sınav için özetle" data-m="ozet">Özetle</button>
            <button data-p="Beni bu konuda sorularla yönlendir" data-m="sokratik">Sorularla öğret</button>
          </div>
          <div class="msgs" aria-live="polite"><div class="msg bot"><p>${esc(cur.name)} üzerinde çalışıyorsun. ${video && video.chapters ? "Videoda zincir kuralı 11:42'de başlıyor; istersen oradan önce kısa bir özet geçeyim." : "Notu okurken takıldığın yeri seçip bana gönderebilirsin."}</p></div></div>
          <form class="composer">
            <input name="q" placeholder="${esc(cur.name)} hakkında sor…" autocomplete="off" />
            <button class="send" aria-label="Gönder">${icon("send")}</button>
          </form>
        </aside>
      </section>`;

    const chat = UI.mountChat($("#sidechat"), { context: `${c.name} — ${cur.name}` });
    $$("#sidechat .chips button").forEach((b) => b.addEventListener("click", () => chat.send(b.dataset.p, b.dataset.m)));

    let stopVideo = () => {};
    const show = (t) => {
      stopVideo();
      $$(".tabs button", view).forEach((b) => b.classList.toggle("on", b.dataset.t === t));
      const body = $("#tabBody");
      if (t === "video") stopVideo = renderVideo(body, video, c, chat);
      else renderNote(body, note, c, chat);
    };
    $$(".tabs button", view).forEach((b) => (b.onclick = () => show(b.dataset.t)));
    Router.onLeave(() => stopVideo());
    show(tab);
    $("#doneBtn").onclick = () => {
      const d = UI.store.get("done", {});
      if (cur.done) return UI.toast("Bu konu zaten tamamlanmış.");
      d[cur.id] = !d[cur.id];
      UI.store.set("done", d);
      if (d[cur.id]) {
        const next = c.topics[c.topics.indexOf(cur) + 1];
        UI.toast(`“${cur.name}” tamamlandı · +30 XP`, next ? { href: `#/ders/${c.id}?t=${next.id}`, label: "Sonraki konu" } : null);
      }
      Router.refresh();
    };
  }

  function renderNote(body, note, c, chat) {
    body.innerHTML = `<article class="glass card note">${note ? `
        <p class="lead">${note.lead}</p>
        ${note.blocks.map((b) => `
          <section>
            <h3>${b.h}</h3>
            ${b.f ? `<pre class="formula">${b.f}</pre>` : ""}
            ${b.p ? `<p>${b.p}</p>` : ""}
            ${b.list ? `<ul class="rules">${b.list.map((x) => `<li class="mono">${x}</li>`).join("")}</ul>` : ""}
          </section>`).join("")}
        <div class="note-foot"><span class="muted">Bir yeri anlamadın mı? Metni seç, asistana gönder.</span></div>`
      : `<div class="note-empty"><span class="drop-ic">${icon("book")}</span><p class="lead">Bu konunun notu öğretmenin tarafından henüz yüklenmedi.</p><p class="muted">Asistandan konunun sınav odaklı bir özetini çıkarmasını isteyebilir ya da dolu örneklere bakabilirsin: Matematik → Türev, Fizik → Elektriksel kuvvet, Kimya → Sıvı çözeltiler.</p><button class="btn ghost" id="genNote">${icon("spark")} Yapay zekâ ile özet çıkar</button></div>`}
      </article>`;

    $("#genNote", body) && ($("#genNote", body).onclick = () => chat.send("Bu konuyu sınav için özetle", "ozet"));
    $(".note", body).addEventListener("mouseup", () => {
      const sel = String(window.getSelection()).trim();
      $(".ask-sel")?.remove();
      if (sel.length < 4) return;
      const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
      const b = document.createElement("button");
      b.className = "ask-sel";
      b.innerHTML = `${icon("spark")} Asistana sor`;
      b.style.left = r.left + r.width / 2 + "px";
      b.style.top = r.top + window.scrollY - 8 + "px";
      b.onmousedown = (e) => { e.preventDefault(); chat.send(`Şunu açıklar mısın: "${sel.slice(0, 140)}"`, "acikla"); b.remove(); };
      document.body.appendChild(b);
    });
  }

  /* Video oynatıcı (demo: hızlandırılmış ilerleme) */
  function renderVideo(body, v, c, chat) {
    let pos = Math.round(v.secs * v.watched), playing = false, t = null, speed = 1;
    const chapters = v.chapters || [{ t: 0, s: "Giriş" }, { t: Math.round(v.secs / 2), s: "Konu anlatımı" }];
    const transcript = v.transcript || [];

    body.innerHTML = `
      <div class="glass card player-card">
        <div class="player" id="player">
          <img src="${img(v.img)}" alt="" />
          <div class="p-shade"></div>
          <button class="p-big" id="pBig" aria-label="Oynat">${icon("play")}</button>
          <div class="p-cap" id="pCap"></div>
          <div class="p-ctl">
            <button class="p-btn" id="pBtn" aria-label="Oynat/duraklat">${icon("play")}</button>
            <span class="mono" id="pTime"></span>
            <div class="p-track" id="pTrack">
              ${chapters.map((ch) => `<i class="tick" style="left:${(ch.t / v.secs) * 100}%"></i>`).join("")}
              <span class="p-fill" id="pFill"></span><span class="p-knob" id="pKnob"></span>
            </div>
            <button class="p-btn mono" id="pSpeed">1×</button>
          </div>
        </div>
        <div class="p-info">
          <div>
            <h2>${v.title}</h2>
            <p class="muted small">${c.name} · ${v.dur} · ${person(c.teacher).name}</p>
          </div>
          <button class="btn ghost sm" id="aiSum">${icon("spark")} Yapay zekâ özeti</button>
        </div>
        <div class="ai-sum" id="sumBox" hidden></div>
      </div>
      <div class="vid-grid">
        <div class="glass card">
          <h3>Bölümler</h3>
          <ol class="chapters" id="chapters">
            ${chapters.map((ch, i) => `<li data-t="${ch.t}"><span class="mono">${fmtSecs(ch.t)}</span><span>${ch.s}</span></li>`).join("")}
          </ol>
        </div>
        <div class="glass card">
          <div class="card-top"><h3>Döküm</h3><span class="mono muted">otomatik</span></div>
          <div class="transcript" id="trans">
            ${transcript.length ? transcript.map((l) => `<p data-t="${l.t}"><span class="mono">${fmtSecs(l.t)}</span>${l.s}</p>`).join("") : `<p class="muted">Bu video için döküm demo kapsamında yok.</p>`}
          </div>
        </div>
      </div>`;

    const draw = () => {
      const p = pos / v.secs;
      $("#pFill").style.width = p * 100 + "%";
      $("#pKnob").style.left = p * 100 + "%";
      $("#pTime").textContent = `${fmtSecs(pos)} / ${v.dur}`;
      $("#pBtn").innerHTML = icon(playing ? "pause" : "play");
      $("#player").classList.toggle("is-playing", playing);
      let ci = 0; chapters.forEach((ch, i) => { if (pos >= ch.t) ci = i; });
      $$("#chapters li").forEach((li, i) => li.classList.toggle("on", i === ci));
      let li = -1; transcript.forEach((l, i) => { if (pos >= l.t) li = i; });
      $$("#trans p").forEach((p, i) => p.classList.toggle("on", i === li));
      $("#pCap").textContent = playing && li >= 0 && pos - transcript[li].t < 30 ? transcript[li].s : "";
      $("#pCap").hidden = !$("#pCap").textContent;
    };
    const play = () => { playing = true; clearInterval(t); t = setInterval(() => { pos = Math.min(v.secs, pos + speed); if (pos >= v.secs) pause(); draw(); }, 250); draw(); };
    const pause = () => { playing = false; clearInterval(t); draw(); };
    const seek = (s) => { pos = Math.max(0, Math.min(v.secs, s)); draw(); };

    $("#pBtn").onclick = $("#pBig").onclick = () => (playing ? pause() : play());
    $("#pSpeed").onclick = (e) => { speed = speed === 1 ? 2 : speed === 2 ? 4 : 1; e.currentTarget.textContent = speed + "×"; };
    $("#pTrack").onclick = (e) => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * v.secs); };
    $$("#chapters li, #trans p[data-t]").forEach((el) => (el.onclick = () => { seek(+el.dataset.t); if (!playing) play(); }));
    $("#aiSum").onclick = async () => {
      const box = $("#sumBox");
      box.hidden = false;
      box.innerHTML = `<span class="typing"><i></i><i></i><i></i></span>`;
      await UI.sleep(900);
      const items = v.summary || ["Bu video için özet, bir yapay zekâ sağlayıcısı bağlandığında döküm üzerinden üretilir."];
      box.innerHTML = `<p class="mono muted small">${items.length} maddede özet · ${AI.isLive() ? "canlı" : "demo"}</p><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>
        <div class="row-l"><button class="mini" id="sumAsk">Asistanla derinleştir</button><button class="mini" id="sumCards">Karta dönüştür</button></div>`;
      $("#sumAsk").onclick = () => chat.send("Videodaki zincir kuralı kısmını açıkla", "acikla");
      $("#sumCards").onclick = () => UI.toast(`${items.length} kart “${c.short || c.name}” destesine eklendi.`, { href: "#/kartlar", label: "Kartlar" });
    };
    draw();
    return () => clearInterval(t);
  }

  Router.add("dersler", list);
  Router.add("ders", detail, "dersler");
})();
