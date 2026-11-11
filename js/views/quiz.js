(function () {
  const { $, $$, course, icon, Router, hue, tag, ring, toast } = UI;

  function render(view, params) {
    const pre = params.get("c") || "matematik";
    const available = DB.courses.filter((c) => DB.bank[c.id]);
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">yapay zekâ ile soru üret</p><h1>Quiz</h1></div>
        <span class="chip">Son 7 gün ortalaman <b>%84</b></span>
      </header>
      <section class="quiz-wrap">
        <form class="glass card quiz-setup" id="setup">
          <h3>Yeni quiz</h3>
          <fieldset>
            <legend class="mono muted">Ders</legend>
            <div class="pick">${available.map((c) => `<label><input type="radio" name="c" value="${c.id}" ${c.id === pre ? "checked" : ""}/><span>${c.short || c.name}</span></label>`).join("")}</div>
          </fieldset>
          <fieldset>
            <legend class="mono muted">Odak</legend>
            <div class="pick">
              <label><input type="radio" name="f" value="zayif" checked /><span>Zayıf konularım</span></label>
              <label><input type="radio" name="f" value="karma" /><span>Karma</span></label>
            </div>
          </fieldset>
          <fieldset>
            <legend class="mono muted">Zorluk</legend>
            <div class="pick">${["Kolay", "Orta", "Zor"].map((d, i) => `<label><input type="radio" name="d" value="${d}" ${i === 1 ? "checked" : ""}/><span>${d}</span></label>`).join("")}</div>
          </fieldset>
          <fieldset>
            <legend class="mono muted">Soru sayısı <output id="nOut">4</output></legend>
            <input type="range" min="3" max="6" value="4" name="n" id="nRange" />
          </fieldset>
          <label class="switch"><input type="checkbox" name="t" checked /><span></span>Soru başına 90 sn süre</label>
          <button class="btn full">${icon("spark")} Soruları oluştur</button>
          <p class="muted small">Demo modunda sorular hazır bir havuzdan seçilir. Bir sağlayıcı bağlandığında zayıf noktalarına göre yeni sorular üretilir.</p>
        </form>
        <div class="glass card quiz-stage" id="stage">
          <div class="stage-empty">
            <img class="stage-img" src="${UI.img("r-odak")}" alt="" />
            <p><b>Hazır olduğunda başla.</b></p>
            <p class="muted small">Her sorudan sonra kısa bir açıklama göreceksin. Yanlışların otomatik olarak tekrar listene eklenir.</p>
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
      if (innerWidth < 900) stage.scrollIntoView({ behavior: "smooth", block: "start" });
      stage.innerHTML = `<div class="stage-empty"><span class="typing"><i></i><i></i><i></i></span><p class="muted">${course(cid).name} için ${f.get("n")} soru hazırlanıyor…</p></div>`;
      const qs = await AI.generateQuiz({ course: cid, count: +f.get("n"), level: f.get("d") });
      runQuiz(stage, qs, course(cid), !!f.get("t"));
    });
  }

  function runQuiz(stage, qs, c, timed) {
    let i = 0, score = 0, timer = null, left = 90;
    const answers = [];
    Router.onLeave(() => clearInterval(timer));

    const step = () => {
      clearInterval(timer);
      if (i >= qs.length) return finish();
      const q = qs[i];
      left = 90;
      stage.innerHTML = `
        <div class="q-head">${tag(c)}<span class="mono muted">${timed ? `<span id="qt">1:30</span> · ` : ""}${i + 1} / ${qs.length}</span></div>
        <div class="steps">${qs.map((_, k) => `<i class="${k < i ? (answers[k] ? "ok" : "bad") : k === i ? "cur" : ""}"></i>`).join("")}</div>
        <p class="q big">${q.q}</p>
        <div class="opts">${q.o.map((o, k) => `<button class="opt" data-k="${k}"><span class="mono">${"ABCD"[k]}</span>${o}</button>`).join("")}</div>
        <div class="explain" hidden></div>`;
      if (timed) timer = setInterval(() => {
        left--;
        const el = $("#qt", stage);
        if (el) { el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`; el.classList.toggle("warn", left <= 15); }
        if (left <= 0) answer(-1);
      }, 1000);
      $$(".opt", stage).forEach((b) => b.addEventListener("click", () => answer(+b.dataset.k)));
    };

    const answer = (k) => {
      clearInterval(timer);
      const q = qs[i], right = k === q.a;
      answers[i] = right;
      if (right) score++;
      $$(".opt", stage).forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add("ok"); else if (j === k) x.classList.add("bad"); });
      const ex = $(".explain", stage);
      ex.hidden = false;
      ex.innerHTML = `<p><b>${right ? "Doğru." : k < 0 ? "Süre doldu." : "Yanlış."}</b> ${q.why}</p>
        <div class="row-l"><button class="btn" id="nx">${i + 1 < qs.length ? "Sonraki soru" : "Sonucu gör"} →</button>${right ? "" : `<a class="mini" href="#/asistan?q=${encodeURIComponent(q.q + " — bu soruyu açıkla")}">Asistana sor</a>`}</div>`;
      $("#nx", ex).addEventListener("click", () => { i++; step(); });
      $("#nx", ex).focus();
    };

    const finish = () => {
      const p = score / qs.length;
      stage.innerHTML = `
        <div class="result">
          <div class="result-ring" style="--c:${hue(c)}">${ring(p, 132, 4)}<b>${score}/${qs.length}</b></div>
          <h2>${p >= 0.75 ? "Konu oturmuş görünüyor." : p >= 0.5 ? "Fena değil, birkaç eksik var." : "Bu konuya biraz daha zaman ayıralım."}</h2>
          <p class="muted small">+${score * 15} XP · yanlışların tekrar listene eklendi</p>
          <ul class="review">${qs.map((q, k) => `<li class="${answers[k] ? "ok" : "bad"}"><span class="mono">${answers[k] ? "✓" : "✗"}</span>${q.q}</li>`).join("")}</ul>
          <div class="row">
            <a class="btn" href="#/asistan?q=${encodeURIComponent(c.name + ": yanlış yaptığım soruları açıkla")}">Yanlışları asistanla çalış</a>
            <button class="btn ghost" id="again">Yeni quiz</button>
          </div>
        </div>`;
      $("#again").addEventListener("click", () => location.hash = "#/quiz?c=" + c.id + "&r=" + Date.now());
      if (p >= 0.75) toast("Seri devam ediyor.");
    };
    step();
  }

  Router.add("quiz", render);
})();
