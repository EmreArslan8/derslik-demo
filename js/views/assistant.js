(function () {
  const { $, $$, esc, course, icon, Router, md, toast, img } = UI;

  const FOLLOW = {
    zincir: ["Bana 3 benzer soru ver", "Sık yapılan hataları göster", "Bunu kartlara ekle"],
    türev: ["Kuvvet kuralıyla 3 örnek çöz", "Türev ile limit ilişkisi ne?", "Beni test et"],
    coulomb: ["Alan çizgilerini anlat", "Uzaklık 3 katına çıkarsa?", "Beni test et"],
    molar: ["Seyreltme örneği çöz", "Kütlece yüzde nedir?", "Beni test et"],
  };
  const followFor = (t) => {
    t = t.toLocaleLowerCase("tr");
    const k = Object.keys(FOLLOW).find((k) => t.includes(k));
    return k ? FOLLOW[k] : ["Daha basit anlat", "Bir örnek ver", "Beni test et"];
  };
  const modeLabel = (m) => ({ acikla: "açıklama", sokratik: "sorularla", ozet: "özet" }[m]);

  /* Ortak sohbet bileşeni */
  function mountChat(root, opts = {}) {
    const msgs = $(".msgs", root);
    const form = $(".composer", root);
    const input = $("input[name=q]", form);
    const history = [];
    let busy = false, pendingImage = null;
    const val = (v) => (typeof v === "function" ? v() : v);

    $$(".prov", root).forEach((el) => (el.textContent = AI.isLive() ? AI.config.provider : "demo"));

    function bubble(role, html) {
      $(".empty-chat", root)?.remove();
      $$(".follow", msgs).forEach((f) => f.remove());
      const el = document.createElement("div");
      el.className = "msg " + role;
      el.innerHTML = html;
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    }

    async function send(text, modeOverride) {
      text = (text || "").trim();
      if ((!text && !pendingImage) || busy) return;
      if (text === "Beni test et") { location.hash = "#/quiz"; return; }
      if (text === "Bunu kartlara ekle") { toast("2 kart “Türev kuralları” destesine eklendi.", { href: "#/kartlar/turev", label: "Aç" }); return; }
      busy = true;
      form.classList.add("busy");
      const image = pendingImage; pendingImage = null; $(".attach-prev", root)?.remove();
      const msg = { role: "user", text: text || "Bu soruyu çözer misin?", image: !!image };
      history.push(msg);
      bubble("user", `${image ? `<img class="msg-img" src="${image}" alt="Eklenen görsel" />` : ""}${esc(msg.text)}`);
      const out = bubble("bot", `<span class="typing"><i></i><i></i><i></i></span>`);
      const mode = modeOverride || val(opts.mode) || "acikla";
      try {
        const ans = await AI.chat({
          messages: history, mode, context: val(opts.context),
          onToken: (t) => { out.innerHTML = md(t); msgs.scrollTop = msgs.scrollHeight; },
        });
        history.push({ role: "assistant", text: ans });
        out.insertAdjacentHTML("beforeend", `
          <div class="msg-foot">
            <span class="mono">${AI.isLive() ? AI.config.provider : "demo yanıtı"} · ${modeLabel(mode)}</span>
            <button class="ib sm" data-a="copy" title="Kopyala">${icon("copy")}</button>
            <button class="ib sm" data-a="redo" title="Yeniden üret">${icon("redo")}</button>
            <button class="ib sm" data-a="card" title="Karta dönüştür">${icon("cards")}</button>
          </div>`);
        $("[data-a=copy]", out).onclick = () => { navigator.clipboard?.writeText(ans).catch(() => {}); toast("Yanıt kopyalandı."); };
        $("[data-a=redo]", out).onclick = () => { history.pop(); const last = history.pop(); $$(".follow", msgs).forEach((f) => f.remove()); out.remove(); msgs.lastElementChild?.remove(); send(last.text, mode); };
        $("[data-a=card]", out).onclick = () => toast("Yanıttan 2 kart oluşturuldu.", { href: "#/kartlar", label: "Kartlar" });
        if (!opts.noFollow) {
          const f = document.createElement("div");
          f.className = "chips follow";
          f.innerHTML = followFor(text + " " + ans).map((x) => `<button>${x}</button>`).join("");
          $$("button", f).forEach((b) => (b.onclick = () => send(b.textContent)));
          msgs.appendChild(f);
          msgs.scrollTop = msgs.scrollHeight;
        }
      } catch (e) {
        out.innerHTML = `<span class="err">${esc(e.message)}</span>`;
      }
      busy = false;
      form.classList.remove("busy");
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); const t = input.value; input.value = ""; send(t); });

    const file = $("input[type=file]", form);
    if (file) {
      file.onchange = () => {
        const f = file.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          pendingImage = r.result;
          $(".attach-prev", root)?.remove();
          form.insertAdjacentHTML("beforebegin", `<div class="attach-prev"><img src="${pendingImage}" alt="" /><span class="small">Görsel eklendi</span><button type="button" class="ib sm">${icon("x")}</button></div>`);
          $(".attach-prev button", root).onclick = () => { pendingImage = null; $(".attach-prev", root).remove(); };
          input.focus();
        };
        r.readAsDataURL(f);
        file.value = "";
      };
    }
    return { send, attachSample() { pendingImage = img("soru"); send("Bu sorunun çözümü ne?"); } };
  }
  UI.mountChat = mountChat;

  /* ---------- Asistan sayfası ---------- */
  function render(view, params) {
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
        <aside class="glass card hist">
          <button class="btn ghost full" id="newChat">${icon("plus")} Yeni sohbet</button>
          <p class="mono muted small">Geçmiş</p>
          <ul>${DB.history.map((h, i) => `<li><span>${h.title}</span><small class="mono">${h.when}</small></li>`).join("")}</ul>
        </aside>

        <div class="glass card big-chat" id="bigchat">
          <div class="msgs" aria-live="polite">
            <div class="empty-chat">
              <div class="orb" aria-hidden="true"></div>
              <p class="lead-s">Ne çalışıyoruz, ${DB.student.name}?</p>
              <p class="muted small">Ders sorunu yaz ya da fotoğrafını ekle. Cevabı doğrudan istemiyorsan “Sorularla” modunu seç.</p>
              <div class="starter">
                <button data-p="Zincir kuralını örnekle açıkla"><b>Zincir kuralı</b><span>örnekle açıkla</span></button>
                <button data-p="Coulomb yasasında uzaklık neden kareli?"><b>Coulomb yasası</b><span>uzaklık neden kareli?</span></button>
                <button data-p="Molarite nasıl hesaplanır?"><b>Molarite</b><span>nasıl hesaplanır?</span></button>
                <button data-s="1"><b>Fotoğraftan çöz</b><span>örnek bir soru görseli gönder</span></button>
              </div>
            </div>
          </div>
          <form class="composer">
            <label class="ib attach" title="Görsel ekle">${icon("clip")}<input type="file" accept="image/*" hidden /></label>
            <input name="q" placeholder="Bir soru yaz…" autocomplete="off" />
            <button type="button" class="ib mic" title="Sesle sor (demo)">${icon("mic")}</button>
            <button class="send" aria-label="Gönder">${icon("send")}</button>
          </form>
        </div>

        <aside class="glass card ctx">
          <h3>Bağlam</h3>
          <p class="muted small">Asistan seçtiğin dersi ve zayıf konularını bilir; yanıtlar müfredatına göre şekillenir.</p>
          <label class="field-l"><span class="mono">Ders</span>
            <select id="ctxCourse">${DB.courses.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select>
          </label>
          <div class="hair"></div>
          <p class="mono muted small">Zayıf konuların</p>
          <ul class="ctx-weak">${DB.weak.map((w) => `<li><span class="dotc" style="--c:${UI.hue(course(w.course))}"></span>${w.topic}<small class="mono">${UI.pct(w.score)}%</small></li>`).join("")}</ul>
          <div class="hair"></div>
          <p class="mono muted small">Sağlayıcı</p>
          <p class="prov-line"><b>${DB.providers.find((p) => p.id === AI.config.provider).name}</b><br><span class="muted small">${AI.isLive() ? "Bağlı" : "Demo yanıtları gösteriliyor"}</span></p>
          <p class="muted small">Gerçek modele bağlamak için <span class="mono">js/ai.js</span> içindeki <span class="mono">proxyUrl</span> alanını doldur.</p>
        </aside>
      </section>`;

    let mode = "acikla";
    const ctxSel = $("#ctxCourse");
    const chat = mountChat($("#bigchat"), { context: () => course(ctxSel.value).name, mode: () => mode });
    $$("#modes button").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; $$("#modes button").forEach((x) => x.classList.toggle("on", x === b)); }));
    $$("#bigchat .starter button").forEach((b) => b.addEventListener("click", () => (b.dataset.s ? chat.attachSample() : chat.send(b.dataset.p))));
    $("#newChat").onclick = () => render(view, new URLSearchParams());
    $$(".hist li").forEach((li) => (li.onclick = () => chat.send(li.firstElementChild.textContent)));
    $(".mic").onclick = () => toast("Sesli soru demo modunda kapalı.");
    if (params.get("q")) chat.send(params.get("q"));
  }

  Router.add("asistan", render);
})();
