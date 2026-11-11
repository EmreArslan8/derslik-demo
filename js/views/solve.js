(function () {
  const { $, $$, esc, course, icon, Router, toast, hue, tag, img } = UI;

  const paper = (s, cls = "") => `
    <div class="paper ${cls}">
      <p class="hand">${esc(s.text).replace(/\n/g, "<br>")}</p>
      <div class="hand-opts">${s.options.map((o, i) => `<span class="hand">${"ABCD"[i]}) ${o}</span>`).join("")}</div>
    </div>`;

  function render(view) {
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">fotoğraf → adım adım çözüm</p><h1>Soru Çöz</h1></div>
        <span class="chip">${icon("spark")} Bu ay <b>23</b> soru çözüldü</span>
      </header>
      <section class="solve">
        <div class="solve-left">
          <label class="glass card drop" id="drop">
            <input type="file" accept="image/*" capture="environment" hidden id="file" />
            <span class="drop-ic">${icon("camera")}</span>
            <b>Sorunun fotoğrafını çek ya da yükle</b>
            <span class="muted small">Sürükle bırak da olur · JPG, PNG, HEIC</span>
            <span class="btn sm">${icon("upload")} Görsel seç</span>
          </label>
          <div class="sec-head"><h3>Örnek sorular</h3><span class="mono muted">demo</span></div>
          <div class="samples">
            ${DB.solveSamples.map((s) => `<button class="sample" data-id="${s.id}">${paper(s, "mini")}<span class="mono small" style="color:${hue(course(s.course))}">${s.topic}</span></button>`).join("")}
          </div>
        </div>
        <div class="glass card solve-stage" id="stage">
          <div class="stage-empty">
            <img class="stage-img" src="${img("soru")}" alt="" />
            <p><b>Takıldığın soruyu göster, birlikte çözelim.</b></p>
            <p class="muted small">Asistan önce soruyu metne çevirir, konusunu bulur, sonra çözümü adım adım açar. Her adımı kendin denemek için sırayla açabilirsin.</p>
          </div>
        </div>
      </section>`;

    const stage = $("#stage");
    $$(".sample").forEach((b) => (b.onclick = () => run(stage, b.dataset.id)));
    const file = $("#file");
    file.onchange = () => {
      const f = file.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => run(stage, "s1", r.result);
      r.readAsDataURL(f);
    };
    const drop = $("#drop");
    ["dragover", "dragenter"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove("over")));
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => run(stage, "s1", r.result);
      r.readAsDataURL(f);
    });
  }

  async function run(stage, id, upload) {
    const sample = DB.solveSamples.find((s) => s.id === id);
    if (innerWidth < 900) stage.scrollIntoView({ behavior: "smooth", block: "start" });
    stage.innerHTML = `
      <div class="scan">
        ${upload ? `<img src="${upload}" alt="Yüklenen soru" />` : paper(sample)}
        <span class="scan-line"></span>
      </div>
      <ol class="scan-steps mono">
        <li class="on">Görsel okunuyor…</li>
        <li>Soru metne çevriliyor</li>
        <li>Konu ve kazanım tespit ediliyor</li>
        <li>Çözüm hazırlanıyor</li>
      </ol>`;
    const steps = $$(".scan-steps li", stage);
    for (let i = 1; i < steps.length; i++) {
      await UI.sleep(420);
      steps[i - 1].classList.replace("on", "done");
      steps[i].classList.add("on");
    }
    const s = await AI.solve({ sampleId: id });
    const c = course(s.course);
    let shown = 0;

    stage.innerHTML = `
      <div class="sol-head">
        <div class="sol-thumb">${upload ? `<img src="${upload}" alt="" />` : paper(s, "mini")}</div>
        <div class="grow">
          <div class="row-l">${tag(c)}<span class="mono muted small">${s.topic}</span><span class="mono muted small">· orta zorluk</span></div>
          <p class="mono muted small" style="margin-top:10px">algılanan soru ${upload ? "· demo: örnek tanıma kullanıldı" : ""}</p>
          <p class="q">${esc(s.text).replace(/\n/g, " ")}</p>
        </div>
      </div>
      <div class="opts">${s.options.map((o, i) => `<div class="opt static" data-i="${i}"><span class="mono">${"ABCD"[i]}</span>${o}</div>`).join("")}</div>
      <div class="sol-try">
        <p class="small muted">Önce kendin dene: hangi şık?</p>
        <div class="row-l">${s.options.map((_, i) => `<button class="mini" data-g="${i}">${"ABCD"[i]}</button>`).join("")}<button class="mini ghost" data-g="-1">Doğrudan göster</button></div>
      </div>
      <ol class="sol-steps" id="solSteps">
        ${s.steps.map((st, i) => `<li hidden><span class="n mono">${i + 1}</span><div><b>${st.h}</b><p>${st.p}</p></div></li>`).join("")}
      </ol>
      <div class="sol-ctl" id="solCtl" hidden>
        <button class="btn" id="nextStep">Sonraki adım →</button>
        <button class="btn ghost" id="allSteps">Tümünü göster</button>
      </div>
      <div class="sol-final" id="solFinal" hidden>
        <p class="mono muted small">sonuç</p>
        <p class="final">${s.final}</p>
        ${s.trap ? `<p class="trap"><b>Tuzak şık:</b> ${s.trap}</p>` : ""}
        <div class="row-l">
          <a class="btn" href="#/quiz?c=${c.id}">${icon("spark")} Benzer sorular üret</a>
          <a class="btn ghost" href="#/asistan?q=${encodeURIComponent(s.topic + " konusunu açıkla")}">Asistana sor</a>
          <button class="btn ghost" id="toCards">${icon("cards")} Kartlara ekle</button>
        </div>
      </div>`;

    const reveal = () => {
      const lis = $$("#solSteps li", stage);
      if (shown < lis.length) { lis[shown].hidden = false; lis[shown].classList.add("in"); shown++; }
      if (shown >= lis.length) finish();
    };
    const finish = () => {
      $$("#solSteps li", stage).forEach((li) => (li.hidden = false));
      shown = s.steps.length;
      $("#solCtl").hidden = true;
      $("#solFinal").hidden = false;
      $$(".opt.static", stage).forEach((o) => o.classList.toggle("ok", +o.dataset.i === s.answer));
    };
    $$("[data-g]", stage).forEach((b) =>
      (b.onclick = () => {
        const g = +b.dataset.g;
        $(".sol-try", stage).innerHTML = g < 0 ? `<p class="small muted">Çözüm adım adım açılıyor.</p>` :
          g === s.answer ? `<p class="small"><b class="okc">Doğru.</b> Çözümün aynı yoldan mı gitti? Adımlara bak.</p>` :
          `<p class="small"><b class="badc">${"ABCD"[g]} değil.</b> Adımları tek tek aç, nerede ayrıldığını bul.</p>`;
        if (g >= 0 && g !== s.answer) $(`.opt.static[data-i="${g}"]`, stage).classList.add("bad");
        $("#solCtl").hidden = false;
        reveal();
      })
    );
    $("#nextStep").onclick = reveal;
    $("#allSteps").onclick = finish;
    $("#toCards").onclick = () => toast("Soru ve çözümü karta dönüştürüldü.", { href: "#/kartlar", label: "Kartlar" });
  }

  Router.add("coz", render);
})();
