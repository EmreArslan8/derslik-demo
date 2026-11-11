(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const view = $("#view");
  const course = (id) => DB.courses.find((c) => c.id === id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (x) => Math.round(x * 100);

  /* ---------- Ders çizimleri (stok görsel yerine ince çizgi SVG) ---------- */
  const ART = {
    curve: `<path d="M8 92 C 40 90, 60 20, 100 30 S 150 80, 192 12"/><path d="M60 64 L 140 24" class="hl"/><circle cx="100" cy="44" r="3" class="dot"/><path d="M8 100h184M20 8v96" class="axis"/>`,
    wave: `<path d="M8 56 Q 30 10, 52 56 T 96 56 T 140 56 T 184 56"/><path d="M8 56 Q 30 86, 52 56 T 96 56 T 140 56 T 184 56" class="hl"/><path d="M8 56h184" class="axis"/>`,
    molecule: `<circle cx="70" cy="50" r="14"/><circle cx="130" cy="36" r="9"/><circle cx="128" cy="78" r="9"/><circle cx="34" cy="80" r="8"/><path d="M84 46 121 38M83 56l36 18M58 59 41 73"/><circle cx="70" cy="50" r="3" class="dot"/><path d="M150 20c20 10 30 40 20 70" class="hl"/>`,
    cell: `<ellipse cx="100" cy="56" rx="80" ry="42"/><ellipse cx="88" cy="58" rx="20" ry="15" class="hl"/><circle cx="88" cy="58" r="4" class="dot"/><path d="M134 40c8 0 12 6 18 6M140 74c6-4 14-2 20 2M44 46c8-6 16-2 20 4"/>`,
    lines: `<path d="M24 26h120M24 44h152M24 62h96M24 80h138" /><path d="M24 98h70" class="hl"/><path d="M182 20v80" class="axis"/>`,
    timeline: `<path d="M12 60h176" /><circle cx="36" cy="60" r="4"/><circle cx="84" cy="60" r="4"/><circle cx="132" cy="60" r="5" class="dot"/><circle cx="170" cy="60" r="4"/><path d="M36 60V30M84 60v34M132 60V22M170 60v26" class="axis"/><path d="M118 22h28" class="hl"/>`,
  };
  const art = (c, cls = "") => `<svg class="art ${cls}" viewBox="0 0 200 112" style="--c:${c.hue}" aria-hidden="true">${ART[c.art]}</svg>`;

  const ring = (p, size = 44, stroke = 3) => {
    const r = (size - stroke) / 2, C = 2 * Math.PI * r;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" class="track"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
  };

  const today = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const hour = new Date().getHours();
  const greet = hour < 6 ? "İyi geceler" : hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  /* ---------- PANEL ---------- */
  function renderPanel() {
    const s = DB.student;
    const max = Math.max(...s.week.map((d) => d.m), s.goalMinutes);
    const total = s.week.reduce((a, d) => a + d.m, 0);
    const cur = DB.courses[0];
    const curTopic = cur.topics.find((t) => t.current);
    const dq = DB.dailyQuestion;

    view.innerHTML = `
      <header class="head">
        <div>
          <p class="eyebrow mono">${today}</p>
          <h1>${greet}, ${s.name}. <em>Bugün türevi bitirelim.</em></h1>
        </div>
        <a class="btn" href="#/asistan">Asistana sor <span aria-hidden="true">→</span></a>
      </header>

      <section class="grid panel-grid">
        <a class="glass card resume" href="#/ders/${cur.id}">
          <div class="card-top"><span class="tag" style="--c:${cur.hue}">${cur.name}</span><span class="mono muted">Kaldığın yer</span></div>
          ${art(cur, "lg")}
          <h2>${curTopic.name}</h2>
          <ol class="sub">
            <li class="done"><span class="mono">01</span>Tanım ve limit ile türev</li>
            <li class="done"><span class="mono">02</span>Temel kurallar</li>
            <li class="now"><span class="mono">03</span>Zincir kuralı <small class="mono">burada kaldın</small></li>
            <li><span class="mono">04</span>Kısa tekrar quizi</li>
          </ol>
          <div class="meta"><span>${curTopic.mins} dk</span><span class="sep"></span><span>${cur.teacher}</span></div>
          <div class="bar"><i style="width:${pct(cur.progress)}%;--c:${cur.hue}"></i></div>
          <span class="go">Devam et →</span>
        </a>

        <div class="glass card week">
          <div class="card-top"><h3>Bu hafta</h3><span class="mono muted">${Math.floor(total / 60)} sa ${total % 60} dk</span></div>
          <div class="chart" role="img" aria-label="Haftalık çalışma süreleri">
            <span class="goal" style="bottom:calc(22px + (100% - 30px) * ${s.goalMinutes / max})"><em class="mono">hedef ${s.goalMinutes} dk</em></span>
            ${s.week.map((d, i) => `<div class="col ${i === 6 ? "is-today" : ""}" title="${d.d}: ${d.m} dk"><div class="b"><i style="height:${(d.m / max) * 100}%"></i></div><span class="mono">${d.d}</span></div>`).join("")}
          </div>
          <div class="stats">
            <div><b>${s.streak}</b><span>gün seri</span></div>
            <div><b>${s.week.filter((d) => d.m >= s.goalMinutes).length}/7</b><span>hedef tuttu</span></div>
            <div><b>84%</b><span>quiz ort.</span></div>
          </div>
        </div>

        <div class="glass card daily" id="daily">
          <div class="card-top"><h3>Günün sorusu</h3><span class="tag" style="--c:${course(dq.course).hue}">${course(dq.course).name}</span></div>
          <p class="q">${dq.q}</p>
          <div class="opts">${dq.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="mono">${"ABCD"[i]}</span>${o}</button>`).join("")}</div>
          <p class="why" hidden></p>
        </div>

        <div class="glass card weak">
          <div class="card-top"><h3>Tekrar etmen gerekenler</h3><span class="mono muted">son 14 gün</span></div>
          <ul class="rows">
            ${DB.weak.map((w) => { const c = course(w.course); return `
              <li>
                <span class="dotc" style="--c:${c.hue}"></span>
                <span class="grow"><b>${w.topic}</b><small>${c.name}</small></span>
                <span class="score mono">${pct(w.score)}%</span>
                <a class="mini" href="#/asistan?q=${encodeURIComponent(w.topic + " konusunu açıkla")}">Çalış</a>
              </li>`; }).join("")}
          </ul>
        </div>

        <div class="glass card agenda">
          <div class="card-top"><h3>Yaklaşanlar</h3></div>
          <ul class="rows">
            ${DB.agenda.map((a) => { const c = course(a.course); return `
              <li>
                <span class="when mono">${a.when}</span>
                <span class="grow"><b>${a.title}</b><small>${c.name} · ${a.kind}</small></span>
              </li>`; }).join("")}
          </ul>
        </div>

        <div class="glass card courses-mini">
          <div class="card-top"><h3>Dersler</h3><a class="mono muted link" href="#/dersler">tümü →</a></div>
          <ul class="rings">
            ${DB.courses.map((c) => `<li><a href="#/ders/${c.id}" style="--c:${c.hue}">${ring(c.progress)}<span>${c.short || c.name}</span><small class="mono">${pct(c.progress)}%</small></a></li>`).join("")}
          </ul>
        </div>
      </section>`;

    $$("#daily .opt").forEach((b) =>
      b.addEventListener("click", () => {
        const i = +b.dataset.i;
        $$("#daily .opt").forEach((x, j) => {
          x.disabled = true;
          if (j === dq.answer) x.classList.add("ok");
          else if (j === i) x.classList.add("bad");
        });
        const why = $("#daily .why");
        why.hidden = false;
        why.innerHTML = `<b>${i === dq.answer ? "Doğru." : "Tam değil."}</b> ${dq.why}`;
      })
    );
  }

  /* ---------- DERSLER ---------- */
  function renderCourses() {
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">2026–2027 · 1. dönem</p><h1>Dersler</h1></div>
        <div class="seg" role="tablist"><button class="on">Tümü</button><button>Devam eden</button><button>Tamamlanan</button></div>
      </header>
      <section class="grid courses">
        ${DB.courses.map((c) => {
          const done = c.topics.filter((t) => t.done).length;
          const cur = c.topics.find((t) => t.current);
          return `
          <a class="glass card course" href="#/ders/${c.id}" style="--c:${c.hue}">
            <div class="card-top"><span class="mono muted">${c.code}</span><span class="mono muted">${done}/${c.topics.length} konu</span></div>
            ${art(c)}
            <h2>${c.name}</h2>
            <p class="muted">Sıradaki: ${cur ? cur.name : "—"}</p>
            <div class="bar"><i style="width:${pct(c.progress)}%"></i></div>
            <div class="meta"><span>${c.teacher}</span><span class="mono">${pct(c.progress)}%</span></div>
          </a>`;
        }).join("")}
      </section>`;
    $$(".seg button").forEach((b, i) =>
      b.addEventListener("click", () => {
        $$(".seg button").forEach((x) => x.classList.toggle("on", x === b));
        $$(".course").forEach((card, k) => {
          const p = DB.courses[k].progress;
          card.hidden = (i === 1 && p >= 1) || (i === 2 && p < 1);
        });
        if (i === 2 && !$$(".course").some((c) => !c.hidden)) {
          $(".courses").insertAdjacentHTML("beforeend", `<p class="empty muted">Henüz tamamlanan ders yok. Matematik %${pct(DB.courses[0].progress)}'te.</p>`);
        } else $(".empty")?.remove();
      })
    );
  }

  /* ---------- DERS DETAYI ---------- */
  function renderCourse(id) {
    const c = course(id);
    if (!c) return renderCourses();
    const cur = c.topics.find((t) => t.current) || c.topics[0];
    const note = DB.notes[cur.id];

    view.innerHTML = `
      <header class="head">
        <div>
          <p class="eyebrow mono"><a href="#/dersler">Dersler</a> / ${c.name}</p>
          <h1>${cur.name}</h1>
        </div>
        <a class="btn ghost" href="#/quiz?c=${c.id}">Bu konudan quiz</a>
      </header>
      <section class="lesson" style="--c:${c.hue}">
        <nav class="glass card outline" aria-label="Konular">
          <p class="mono muted">${c.code} · ${pct(c.progress)}%</p>
          <ol>
            ${c.topics.map((t, i) => `<li class="${t.done ? "done" : ""} ${t.current ? "now" : ""}"><span class="n mono">${String(i + 1).padStart(2, "0")}</span><span>${t.name}</span><small class="mono">${t.mins} dk</small></li>`).join("")}
          </ol>
        </nav>

        <article class="glass card note">
          ${note ? `
            <p class="lead">${note.lead}</p>
            ${art(c, "wide")}
            ${note.blocks.map((b) => `
              <section>
                <h3>${b.h}</h3>
                ${b.f ? `<pre class="formula">${b.f}</pre>` : ""}
                ${b.p ? `<p>${b.p}</p>` : ""}
                ${b.list ? `<ul class="rules">${b.list.map((x) => `<li class="mono">${x}</li>`).join("")}</ul>` : ""}
              </section>`).join("")}
            <div class="note-foot"><span class="muted">Bir yeri anlamadın mı? Metni seç, sağdaki asistana gönder.</span></div>
          ` : `
            ${art(c, "wide")}
            <p class="lead">Bu konunun ders notu demo kapsamında hazırlanmadı.</p>
            <p class="muted">Matematik → Türev veya Fizik → Elektriksel kuvvet konularını açarak dolu bir örnek görebilirsin. Sağdaki asistan yine de çalışır.</p>`}
        </article>

        <aside class="glass card side-chat" id="sidechat">
          <div class="card-top"><h3>Konu asistanı</h3><span class="mono muted prov"></span></div>
          <div class="chips">
            <button data-p="Bu konuyu basitçe açıkla" data-m="acikla">Basitçe açıkla</button>
            <button data-p="Bu konuyu sınav için özetle" data-m="ozet">Özetle</button>
            <button data-p="Beni bu konuda sorularla yönlendir" data-m="sokratik">Sorularla öğret</button>
          </div>
          <div class="msgs" aria-live="polite"></div>
          <form class="composer">
            <input name="q" placeholder="${cur.name} hakkında sor…" autocomplete="off" />
            <button class="send" aria-label="Gönder"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
          </form>
        </aside>
      </section>`;

    const chat = mountChat($("#sidechat"), { context: `${c.name} — ${cur.name}`, compact: true });
    $$("#sidechat .chips button").forEach((b) => b.addEventListener("click", () => chat.send(b.dataset.p, b.dataset.m)));

    $(".note")?.addEventListener("mouseup", () => {
      const sel = String(window.getSelection()).trim();
      $(".ask-sel")?.remove();
      if (sel.length < 4) return;
      const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
      const b = document.createElement("button");
      b.className = "ask-sel";
      b.textContent = "Asistana sor";
      b.style.left = r.left + r.width / 2 + "px";
      b.style.top = r.top + window.scrollY - 8 + "px";
      b.onmousedown = (e) => { e.preventDefault(); chat.send(`Şunu açıklar mısın: "${sel.slice(0, 140)}"`, "acikla"); b.remove(); };
      document.body.appendChild(b);
    });
  }

  /* ---------- ASİSTAN ---------- */
  function renderAssistant(params) {
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">Gemini · ChatGPT · Claude ile uyumlu</p><h1>Asistan</h1></div>
        <div class="seg" id="modes" role="tablist" aria-label="Yanıt biçimi">
          <button data-m="acikla" class="on">Açıkla</button>
          <button data-m="sokratik">Sorularla</button>
          <button data-m="ozet">Özetle</button>
        </div>
      </header>
      <section class="assistant">
        <div class="glass card big-chat" id="bigchat">
          <div class="msgs" aria-live="polite">
            <div class="empty-chat">
              <svg viewBox="0 0 200 112" class="art" style="--c:var(--accent)" aria-hidden="true">${ART.curve}</svg>
              <p>Ders sorunu yaz, istediğin biçimde anlatayım.<br><span class="muted">Cevabı doğrudan istemiyorsan “Sorularla” modunu seç.</span></p>
              <div class="chips">
                <button data-p="Zincir kuralını örnekle açıkla">Zincir kuralını örnekle açıkla</button>
                <button data-p="Coulomb yasasında uzaklık neden kareli?">Coulomb yasasında uzaklık neden kareli?</button>
                <button data-p="Molarite nasıl hesaplanır?">Molarite nasıl hesaplanır?</button>
              </div>
            </div>
          </div>
          <form class="composer">
            <input name="q" placeholder="Bir soru yaz…" autocomplete="off" />
            <button class="send" aria-label="Gönder"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
          </form>
        </div>
        <aside class="glass card ctx">
          <h3>Bağlam</h3>
          <p class="muted small">Asistan, seçtiğin dersi ve zayıf konularını bilir. Böylece yanıtlar müfredatına göre şekillenir.</p>
          <label class="field-l"><span class="mono">Ders</span>
            <select id="ctxCourse">${DB.courses.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select>
          </label>
          <div class="hair"></div>
          <p class="mono muted small">Sağlayıcı</p>
          <p class="prov-line"></p>
          <p class="muted small">Gerçek bir modele bağlamak için <span class="mono">js/ai.js</span> içindeki <span class="mono">proxyUrl</span> alanını doldur.</p>
        </aside>
      </section>`;

    let mode = "acikla";
    const ctxSel = $("#ctxCourse");
    const chat = mountChat($("#bigchat"), {
      context: () => course(ctxSel.value).name,
      mode: () => mode,
    });
    $$("#modes button").forEach((b) =>
      b.addEventListener("click", () => {
        mode = b.dataset.m;
        $$("#modes button").forEach((x) => x.classList.toggle("on", x === b));
      })
    );
    $$("#bigchat .chips button").forEach((b) => b.addEventListener("click", () => chat.send(b.dataset.p)));
    updateProvider();
    if (params.get("q")) chat.send(params.get("q"));
  }

  /* Ortak sohbet bileşeni */
  function mountChat(root, opts) {
    const msgs = $(".msgs", root);
    const form = $(".composer", root);
    const input = $("input", form);
    const history = [];
    let busy = false;

    const val = (v) => (typeof v === "function" ? v() : v);

    function bubble(role, html) {
      $(".empty-chat", root)?.remove();
      const el = document.createElement("div");
      el.className = "msg " + role;
      el.innerHTML = html;
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    }

    async function send(text, modeOverride) {
      text = (text || "").trim();
      if (!text || busy) return;
      busy = true;
      form.classList.add("busy");
      history.push({ role: "user", text });
      bubble("user", esc(text));
      const out = bubble("bot", `<span class="typing"><i></i><i></i><i></i></span>`);
      const mode = modeOverride || val(opts.mode) || "acikla";
      try {
        const ans = await AI.chat({
          messages: history,
          mode,
          context: val(opts.context),
          onToken: (t) => { out.innerHTML = fmt(t); msgs.scrollTop = msgs.scrollHeight; },
        });
        history.push({ role: "assistant", text: ans });
        out.insertAdjacentHTML("beforeend", `<div class="msg-foot mono">${AI.isLive() ? providerName() : "demo yanıtı"} · ${modeLabel(mode)}</div>`);
      } catch (e) {
        out.innerHTML = `<span class="err">${esc(e.message)}</span>`;
      }
      busy = false;
      form.classList.remove("busy");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const t = input.value;
      input.value = "";
      send(t);
    });
    updateProvider();
    return { send };
  }

  const modeLabel = (m) => ({ acikla: "açıklama", sokratik: "sorularla", ozet: "özet" }[m]);
  const fmt = (t) =>
    esc(t)
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

  /* ---------- QUIZ ---------- */
  function renderQuiz(params) {
    const pre = params.get("c") || "matematik";
    const available = DB.courses.filter((c) => DB.bank[c.id]);
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">Yapay zekâ ile soru üret</p><h1>Quiz</h1></div>
      </header>
      <section class="quiz-wrap">
        <form class="glass card quiz-setup" id="setup">
          <h3>Yeni quiz</h3>
          <fieldset>
            <legend class="mono muted">Ders</legend>
            <div class="pick">
              ${available.map((c) => `<label style="--c:${c.hue}"><input type="radio" name="c" value="${c.id}" ${c.id === pre ? "checked" : ""}/><span>${c.name}</span></label>`).join("")}
            </div>
          </fieldset>
          <fieldset>
            <legend class="mono muted">Zorluk</legend>
            <div class="pick">
              ${["Kolay", "Orta", "Zor"].map((d, i) => `<label><input type="radio" name="d" value="${d}" ${i === 1 ? "checked" : ""}/><span>${d}</span></label>`).join("")}
            </div>
          </fieldset>
          <fieldset>
            <legend class="mono muted">Soru sayısı <output id="nOut">4</output></legend>
            <input type="range" min="3" max="6" value="4" name="n" id="nRange" />
          </fieldset>
          <button class="btn full">Soruları oluştur</button>
          <p class="muted small">Demo modunda sorular hazır bir havuzdan seçilir. Bir sağlayıcı bağlandığında konuya ve zayıf noktalarına göre yeni sorular üretilir.</p>
        </form>
        <div class="glass card quiz-stage" id="stage">
          <div class="stage-empty">
            <svg viewBox="0 0 200 112" class="art" style="--c:var(--accent)" aria-hidden="true">${ART.lines}</svg>
            <p class="muted">Soldan ders ve zorluk seç. Her sorudan sonra kısa bir açıklama göreceksin.</p>
          </div>
        </div>
      </section>`;

    const range = $("#nRange");
    range.addEventListener("input", () => ($("#nOut").value = range.value));
    $("#setup").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const cid = f.get("c");
      const stage = $("#stage");
      stage.innerHTML = `<div class="stage-empty"><span class="typing"><i></i><i></i><i></i></span><p class="muted">${course(cid).name} için ${f.get("n")} soru hazırlanıyor…</p></div>`;
      const qs = await AI.generateQuiz({ course: cid, count: +f.get("n"), level: f.get("d") });
      runQuiz(stage, qs, course(cid));
    });
  }

  function runQuiz(stage, qs, c) {
    let i = 0, score = 0;
    const answers = [];
    const step = () => {
      if (i >= qs.length) return finish();
      const q = qs[i];
      stage.innerHTML = `
        <div class="q-head">
          <span class="tag" style="--c:${c.hue}">${c.name}</span>
          <span class="mono muted">${i + 1} / ${qs.length}</span>
        </div>
        <div class="steps">${qs.map((_, k) => `<i class="${k < i ? (answers[k] ? "ok" : "bad") : k === i ? "cur" : ""}"></i>`).join("")}</div>
        <p class="q big">${q.q}</p>
        <div class="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}"><span class="mono">${"ABCD"[k]}</span>${o}</button>`).join("")}</div>
        <div class="explain" hidden></div>`;
      $$(".opt", stage).forEach((b) =>
        b.addEventListener("click", () => {
          const k = +b.dataset.k, right = k === q.a;
          answers[i] = right;
          if (right) score++;
          $$(".opt", stage).forEach((x, j) => {
            x.disabled = true;
            if (j === q.a) x.classList.add("ok");
            else if (j === k) x.classList.add("bad");
          });
          const ex = $(".explain", stage);
          ex.hidden = false;
          ex.innerHTML = `<p><b>${right ? "Doğru." : "Yanlış."}</b> ${q.why}</p><button class="btn">${i + 1 < qs.length ? "Sonraki soru" : "Sonucu gör"} →</button>`;
          $("button", ex).addEventListener("click", () => { i++; step(); });
          $("button", ex).focus();
        })
      );
    };
    const finish = () => {
      const p = score / qs.length;
      stage.innerHTML = `
        <div class="result">
          <div class="result-ring" style="--c:${c.hue}">${ring(p, 132, 4)}<b>${score}/${qs.length}</b></div>
          <h2>${p >= 0.75 ? "Konu oturmuş görünüyor." : p >= 0.5 ? "Fena değil, birkaç eksik var." : "Bu konuya biraz daha zaman ayıralım."}</h2>
          <ul class="review">${qs.map((q, k) => `<li class="${answers[k] ? "ok" : "bad"}"><span class="mono">${String(k + 1).padStart(2, "0")}</span>${q.q}</li>`).join("")}</ul>
          <div class="row">
            <a class="btn" href="#/asistan?q=${encodeURIComponent(c.name + ": yanlış yaptığım soruları açıkla")}">Yanlışları asistanla çalış</a>
            <button class="btn ghost" id="again">Yeni quiz</button>
          </div>
        </div>`;
      $("#again").addEventListener("click", () => renderQuiz(new URLSearchParams("c=" + c.id)));
    };
    step();
  }

  /* ---------- Sağlayıcı seçimi ---------- */
  const provSel = $("#provider");
  provSel.innerHTML = DB.providers.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  provSel.value = AI.config.provider;
  provSel.addEventListener("change", () => { AI.setProvider(provSel.value); updateProvider(); });

  function providerName() { return DB.providers.find((p) => p.id === AI.config.provider)?.name || "Demo"; }
  function updateProvider() {
    const p = DB.providers.find((x) => x.id === AI.config.provider);
    const live = AI.isLive();
    $$(".prov").forEach((el) => (el.textContent = live ? p.name : p.id === "mock" ? "demo" : `${p.name} · demo`));
    $$(".prov-line").forEach((el) => (el.innerHTML = `<b>${p.name}</b><br><span class="muted small">${live ? "Bağlı" : p.id === "mock" ? p.note : p.note + " — şu an demo yanıtları gösteriliyor"}</span>`));
  }

  /* ---------- Yönlendirme ---------- */
  function route() {
    const [path, qs] = (location.hash.slice(1) || "/").split("?");
    const params = new URLSearchParams(qs || "");
    const parts = path.split("/").filter(Boolean);
    $(".ask-sel")?.remove();
    const key = parts[0] || "panel";
    $$("[data-nav]").forEach((a) => a.classList.toggle("on", a.dataset.nav === (key === "ders" ? "dersler" : key)));
    if (key === "dersler") renderCourses();
    else if (key === "ders") renderCourse(parts[1]);
    else if (key === "asistan") renderAssistant(params);
    else if (key === "quiz") renderQuiz(params);
    else renderPanel();
    view.classList.remove("enter");
    void view.offsetWidth;
    view.classList.add("enter");
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
