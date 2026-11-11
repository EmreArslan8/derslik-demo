/* Tanıtım sayfası, giriş/kayıt ve ilk kurulum (onboarding) */
(function () {
  const { $, $$, esc, icon, Router, img, avatar, session, store, toast, sleep } = UI;

  const brand = `<a href="#/hosgeldin" class="brand"><svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><rect x="3.5" y="6.5" width="25" height="17" rx="2" fill="none" stroke="currentColor"/><path d="M8 12h9M8 16h13" stroke="currentColor" stroke-linecap="round"/><path d="M11 23.5 9 28M21 23.5l2 4.5" stroke="currentColor" stroke-linecap="round"/><circle cx="24" cy="12" r="1.6" fill="var(--accent)"/></svg><span>Derslik</span></a>`;

  const demoUser = () => session.demo();

  /* ---------------- Tanıtım ---------------- */
  function landing(view) {
    const feats = [
      { i: "camera", h: "Fotoğraftan çözüm", p: "Takıldığın sorunun fotoğrafını çek; çözüm adım adım açılsın, önce kendin dene." },
      { i: "chat", h: "Sorularla öğreten asistan", p: "İstersen cevabı vermez, seni doğru soruyla yönlendirir. Müfredatını ve zayıf konularını bilir." },
      { i: "cards", h: "Unutmayan kartlar", p: "Notlardan ve videolardan otomatik kart; aralıklı tekrar doğru günü kendisi hesaplar." },
      { i: "plan", h: "Sana göre haftalık plan", p: "Günlük süren, deneme sonuçların ve hedefin üzerinden her hafta yeniden planlanır." },
      { i: "chart", h: "Net takibi", p: "Deneme netlerin, konu hâkimiyetin ve gelişimin tek ekranda; neye odaklanacağını söyler." },
      { i: "rooms", h: "Sessiz çalışma odaları", p: "Ortak pomodoro ile yüzlerce öğrenciyle birlikte, kamerasız ve dikkat dağıtmadan çalış." },
    ];
    const faq = [
      ["Hangi yapay zekâ modellerini kullanıyor?", "Derslik sağlayıcıdan bağımsızdır: Gemini, ChatGPT veya Claude ile çalışır. Okulunuz hangisini tercih ediyorsa ona bağlanır."],
      ["Ödevlerimi yapay zekâ mı yapıyor?", "Hayır. Asistan cevabı doğrudan vermek yerine adım adım yönlendirmeye ayarlanabilir; öğretmenler hangi modun açık olacağını seçebilir."],
      ["Ücretli mi?", "Öğrenciler için temel özellikler ücretsizdir. Okullar için sınıf yönetimi ve raporlama içeren bir okul paketi vardır."],
      ["Verilerim nerede saklanıyor?", "Bu demo yalnızca tarayıcında saklar. Gerçek üründe veriler KVKK'ya uygun olarak Türkiye'deki sunucularda tutulur."],
    ];
    view.innerHTML = `
      <div class="lp">
        <nav class="lp-nav">
          ${brand}
          <div class="lp-links"><a href="#ozellikler" data-scroll>Özellikler</a><a href="#nasil" data-scroll>Nasıl çalışır</a><a href="#okullar" data-scroll>Okullar için</a><a href="#sss" data-scroll>SSS</a></div>
          <div class="row-l">${session.user() ? `<a class="btn sm" href="#/">Uygulamaya dön ${icon("arrow")}</a>` : `<a class="btn ghost sm" href="#/giris">Giriş yap</a><a class="btn sm" href="#/giris?k=1">Ücretsiz başla</a>`}</div>
        </nav>

        <header class="lp-hero">
          <div class="lp-copy">
            <span class="chip">${icon("spark")} Gemini · ChatGPT · Claude ile uyumlu</span>
            <h1>Ders çalışmanın <em>daha sakin</em> hâli.</h1>
            <p class="lp-sub">Derslik; konu anlatımını, soru çözümünü, tekrar kartlarını ve haftalık planını tek bir yerde toplar. Yapay zekâ cevabı vermek için değil, anlamana yardım etmek için orada.</p>
            <div class="row-l">
              <a class="btn" href="#/giris?k=1">Ücretsiz hesap oluştur ${icon("arrow")}</a>
              <button class="btn ghost" id="demoGo">${icon("play")} Demoyu gez</button>
            </div>
            <div class="lp-proof">${UI.stack(["zeynep", "ege", "selin", "murat"], 30)}<span><b>12.400+</b> öğrenci bu dönem Derslik'le çalışıyor</span></div>
          </div>
          <div class="lp-visual">
            <img class="lp-photo" src="${img("hero")}" alt="Ders çalışan bir öğrenci" />
            <div class="float glass f-chat"><span class="mono muted">asistan · sorularla</span><p>(3x − 1)⁴ ifadesinde sence <b>iç fonksiyon</b> hangisi?</p></div>
            <div class="float glass f-streak">${icon("flame")}<b>12</b><span>gün seri</span></div>
            <div class="float glass f-net"><span class="mono muted">son deneme</span><b>91,5 net</b><span class="delta up">▲ 4 net</span></div>
          </div>
        </header>

        <section class="lp-band">
          <span class="mono muted">ülke genelinde kullanılan okullar</span>
          <div class="lp-schools"><span>Kadıköy AL</span><span>Ankara Fen</span><span>İzmir Bornova AL</span><span>Bursa Ulubatlı FL</span><span>Konya Meram AL</span></div>
        </section>

        <section class="lp-sec" id="ozellikler">
          <p class="eyebrow mono">özellikler</p>
          <h2 class="lp-h2">Bir öğrencinin bir haftada ihtiyaç duyduğu her şey.</h2>
          <div class="lp-feats">${feats.map((f) => `<div class="glass card lp-feat"><span class="drop-ic">${icon(f.i)}</span><h3>${f.h}</h3><p class="muted">${f.p}</p></div>`).join("")}</div>
        </section>

        <section class="lp-sec" id="nasil">
          <p class="eyebrow mono">nasıl çalışır</p>
          <h2 class="lp-h2">Üç adımda kendi çalışma düzenin.</h2>
          <div class="lp-steps">
            ${[["l-yazi", "01", "Kendini tanıt", "Sınıfını, alanını, hedefini ve zorlandığın dersleri seç. İki dakika sürer."], ["l-sinif", "02", "Planın hazır", "Derslik günlük süren ve zayıf konularına göre ilk haftalık planını oluşturur."], ["l-grup", "03", "Çalış, takıl, sor", "Video izle, soru çöz, kart tekrar et. Takıldığın her yerde asistan yanında."]].map(([im, n, h, p]) => `
              <div class="lp-step"><div class="lp-step-img"><img src="${img(im)}" alt="" loading="lazy" /><span class="mono">${n}</span></div><h3>${h}</h3><p class="muted">${p}</p></div>`).join("")}
          </div>
        </section>

        <section class="lp-sec lp-quotes">
          ${[["zeynep", "Zeynep Arı", "12. sınıf · Sayısal", "Sorularla modu başta sinir bozucuydu, şimdi zincir kuralını kimseye sormadan çözüyorum."], ["selin", "Selin Aydın", "Fizik öğretmeni", "Öğrencilerin hangi konuda takıldığını ödev gelmeden görüyorum. Ders planımı buna göre yapıyorum."], ["ege", "Ege Yılmaz", "11. sınıf · EA", "Kütüphane odasında 50 dakikalık turlar en verimli çalıştığım saatler oldu."]].map(([a, n, r, q]) => `
            <figure class="glass card lp-quote"><blockquote>“${q}”</blockquote><figcaption>${avatar(a, 36)}<span><b>${n}</b><small>${r}</small></span></figcaption></figure>`).join("")}
        </section>

        <section class="lp-sec lp-pricing" id="okullar">
          <div class="glass card price">
            <span class="mono muted">öğrenci</span><b class="price-n">Ücretsiz</b>
            <ul>${["Asistan (günde 30 soru)", "Fotoğraftan soru çözme", "Kartlar ve haftalık plan", "Çalışma odaları"].map((x) => `<li>${icon("check")}${x}</li>`).join("")}</ul>
            <a class="btn ghost full" href="#/giris?k=1">Hesap oluştur</a>
          </div>
          <div class="glass card price feat">
            <span class="mono muted">okul</span><b class="price-n">Öğrenci başı ₺29<small>/ay</small></b>
            <ul>${["Sınırsız asistan, okulun seçtiği modelle", "Öğretmen paneli ve ödev takibi", "Sınıf ve konu bazlı raporlar", "Asistan modlarını öğretmen belirler"].map((x) => `<li>${icon("check")}${x}</li>`).join("")}</ul>
            <button class="btn full" id="contact">Okulunuz için görüşelim</button>
          </div>
        </section>

        <section class="lp-sec" id="sss">
          <p class="eyebrow mono">sık sorulanlar</p>
          <div class="faq">${faq.map(([q, a]) => `<details class="glass"><summary>${q}${icon("plus")}</summary><p class="muted">${a}</p></details>`).join("")}</div>
        </section>

        <section class="lp-cta">
          <img src="${img("l-salon")}" alt="" loading="lazy" />
          <div><h2>Bu akşamki çalışmana buradan başla.</h2><a class="btn light" href="#/giris?k=1">Ücretsiz başla ${icon("arrow")}</a></div>
        </section>

        <footer class="lp-foot">
          ${brand}
          <span class="muted small">© 2026 Derslik · Demo sürüm · Görseller: Unsplash</span>
          <div class="row-l small"><a href="#sss" data-scroll>KVKK</a><a href="#sss" data-scroll>Kullanım koşulları</a></div>
        </footer>
      </div>`;

    $$("[data-scroll]", view).forEach((a) => (a.onclick = (e) => { e.preventDefault(); $(a.getAttribute("href"), view)?.scrollIntoView({ behavior: "smooth" }); }));
    $("#demoGo").onclick = () => { session.save(demoUser()); location.hash = "#/"; toast("Demo hesabıyla giriş yapıldı."); };
    $("#contact").onclick = () => toast("Teşekkürler! Okul ekibimiz 1 iş günü içinde dönüş yapar. (demo)");
  }

  /* ---------------- Giriş / kayıt ---------------- */
  function auth(view, params) {
    let mode = params.get("k") ? "kayit" : "giris";
    const draw = () => {
      view.innerHTML = `
        <div class="auth">
          <aside class="auth-side">
            <img src="${img("l-salon")}" alt="" />
            <div class="auth-side-in">
              ${brand}
              <blockquote>“Neyi bilmediğimi bilmek, çalışmanın yarısıymış.”<small>— Deniz, 12. sınıf</small></blockquote>
            </div>
          </aside>
          <main class="auth-main">
            <a class="mono muted back" href="#/hosgeldin">← tanıtıma dön</a>
            <form class="auth-card" id="authForm" novalidate>
              <h1>${mode === "giris" ? "Tekrar hoş geldin." : "Hesabını oluştur."}</h1>
              <p class="muted">${mode === "giris" ? "Kaldığın yerden devam et." : "İki dakikada kurulum, sonra planın hazır."}</p>
              <div class="seg full-seg"><button type="button" data-m="giris" class="${mode === "giris" ? "on" : ""}">Giriş yap</button><button type="button" data-m="kayit" class="${mode === "kayit" ? "on" : ""}">Kayıt ol</button></div>
              <button type="button" class="btn ghost full" id="google">${icon("google")} Google ile devam et</button>
              <div class="or"><span class="mono muted">ya da e-posta ile</span></div>
              ${mode === "kayit" ? `<label class="fld"><span>Ad soyad</span><input name="name" autocomplete="name" placeholder="Elif Kaya" /><em></em></label>` : ""}
              <label class="fld"><span>E-posta</span><input name="email" type="email" autocomplete="email" placeholder="ornek@okul.k12.tr" /><em></em></label>
              <label class="fld"><span>Şifre ${mode === "giris" ? `<a class="muted" href="#/giris" id="forgot">unuttum</a>` : ""}</span><input name="pass" type="password" autocomplete="${mode === "giris" ? "current-password" : "new-password"}" placeholder="En az 8 karakter" /><em></em></label>
              ${mode === "kayit" ? `<label class="check"><input type="checkbox" name="kvkk" /><span></span>KVKK aydınlatma metnini okudum, kabul ediyorum.</label><em class="ferr" id="kvkkErr"></em>` : ""}
              <button class="btn full" id="submit">${mode === "giris" ? "Giriş yap" : "Devam et"} ${icon("arrow")}</button>
              <p class="muted small center">Demo: herhangi bir e-posta ve 8+ karakterli şifre çalışır.</p>
            </form>
          </main>
        </div>`;
      $$(".full-seg button").forEach((b) => (b.onclick = () => { mode = b.dataset.m; draw(); }));
      $("#forgot")?.addEventListener("click", (e) => { e.preventDefault(); toast("Şifre sıfırlama bağlantısı e-postana gönderildi. (demo)"); });
      $("#google").onclick = async (e) => {
        e.currentTarget.innerHTML = `<span class="typing"><i></i><i></i><i></i></span> Google'a bağlanılıyor`;
        await sleep(900);
        if (mode === "giris") { session.save(demoUser()); location.hash = "#/"; }
        else { store.set("draft", { name: "Elif Kaya", email: "elif.kaya@gmail.com" }); location.hash = "#/baslangic"; }
      };
      $("#authForm").onsubmit = async (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        const err = (n, m) => { const el = $(`[name=${n}]`, e.target); el.closest(".fld").classList.toggle("bad", !!m); el.closest(".fld").querySelector("em").textContent = m || ""; return !!m; };
        let bad = false;
        if (mode === "kayit") bad = err("name", (f.get("name") || "").trim().split(" ").length < 2 ? "Ad ve soyadını yaz." : "") || bad;
        bad = err("email", /^\S+@\S+\.\S+$/.test(f.get("email")) ? "" : "Geçerli bir e-posta adresi yaz.") || bad;
        bad = err("pass", (f.get("pass") || "").length >= 8 ? "" : "Şifre en az 8 karakter olmalı.") || bad;
        if (mode === "kayit") { const k = !f.get("kvkk"); $("#kvkkErr").textContent = k ? "Devam etmek için onay gerekli." : ""; bad = k || bad; }
        if (bad) return;
        const btn = $("#submit");
        btn.disabled = true;
        btn.innerHTML = `<span class="typing"><i></i><i></i><i></i></span>`;
        await sleep(800);
        if (mode === "giris") { session.save({ ...demoUser(), email: f.get("email") }); location.hash = "#/"; toast("Giriş yapıldı."); }
        else { store.set("draft", { name: f.get("name").trim(), email: f.get("email") }); location.hash = "#/baslangic"; }
      };
    };
    draw();
  }

  /* ---------------- İlk kurulum ---------------- */
  function onboarding(view) {
    const d = { grade: "11. sınıf", track: "Sayısal", target: DB.targets[0], weak: [], daily: 90, provider: "gemini", tone: "samimi", ...store.get("draft", {}) };
    if (!d.email) { location.replace("#/giris?k=1"); return; }
    let step = 0;
    const STEPS = ["Sınıf", "Alan", "Hedef", "Dersler", "Yapay zekâ"];
    const radio = (name, list, cur) => `<div class="opt-grid">${list.map(([v, h, p]) => `<label class="ocard"><input type="radio" name="${name}" value="${esc(v)}" ${cur === v ? "checked" : ""}/><span><b>${h || v}</b>${p ? `<small>${p}</small>` : ""}</span></label>`).join("")}</div>`;

    const body = () => {
      if (step === 0) return `<h2>Merhaba ${esc(d.name.split(" ")[0])}, kaçıncı sınıftasın?</h2><p class="muted">Konuları ve örnek soruları buna göre seçeceğiz.</p>
        ${radio("grade", [["9. sınıf"], ["10. sınıf"], ["11. sınıf"], ["12. sınıf"], ["Mezun", "Mezun", "YKS'ye tekrar hazırlanıyorum"]], d.grade)}`;
      if (step === 1) return `<h2>Hangi alandasın?</h2><p class="muted">AYT konuların ve deneme analizlerin bu alana göre ayarlanır.</p>
        ${radio("track", [["Sayısal", "Sayısal", "Matematik, fizik, kimya, biyoloji"], ["Eşit Ağırlık", "Eşit ağırlık", "Matematik, edebiyat, tarih, coğrafya"], ["Sözel", "Sözel", "Edebiyat, tarih, coğrafya, felsefe"], ["Dil", "Yabancı dil", "YDT"]], d.track)}`;
      if (step === 2) return `<h2>Hedefin ne?</h2><p class="muted">Kesin olmak zorunda değil; sıralama tahminlerini buna göre gösteririz.</p>
        ${radio("target", DB.targets.map((t) => [t]), d.target)}`;
      if (step === 3) return `<h2>En çok hangi derslerde zorlanıyorsun?</h2><p class="muted">Birden fazla seçebilirsin. İlk planın bu derslere ağırlık verir.</p>
        <div class="opt-grid three">${DB.courses.map((c) => `<label class="ocard"><input type="checkbox" name="weak" value="${c.id}" ${d.weak.includes(c.id) ? "checked" : ""}/><span><i class="dotc" style="--c:${UI.hue(c)}"></i><b>${c.short || c.name}</b></span></label>`).join("")}</div>
        <fieldset class="daily"><legend class="mono muted">Günde ne kadar çalışabilirsin? <output id="dOut">${d.daily}</output> dk</legend><input type="range" min="30" max="240" step="15" value="${d.daily}" name="daily" id="dRange"/><div class="range-l mono muted"><span>30 dk</span><span>4 saat</span></div></fieldset>`;
      return `<h2>Asistanın nasıl çalışsın?</h2><p class="muted">Okulun bir model belirlediyse o kullanılır; sonra ayarlardan değiştirebilirsin.</p>
        ${radio("provider", [["gemini", "Gemini", "Google"], ["openai", "ChatGPT", "OpenAI"], ["claude", "Claude", "Anthropic"], ["mock", "Fark etmez", "Okulumun tercihi"]], d.provider)}
        <p class="mono muted small" style="margin-top:6px">anlatım tarzı</p>
        ${radio("tone", [["samimi", "Samimi", "Arkadaşça, kısa örnekler"], ["resmi", "Öğretmen gibi", "Düzenli, tanım odaklı"], ["sokratik", "Sorularla", "Cevabı hemen vermez"]], d.tone)}`;
    };

    const draw = () => {
      view.innerHTML = `
        <div class="onb">
          <header class="onb-top">${brand}<span class="mono muted">${step + 1} / ${STEPS.length}</span></header>
          <div class="onb-prog">${STEPS.map((s, i) => `<span class="${i < step ? "done" : i === step ? "cur" : ""}"><i></i><small class="mono">${s}</small></span>`).join("")}</div>
          <form class="glass card onb-card" id="onbForm">
            ${body()}
            <div class="onb-ctl">
              ${step > 0 ? `<button type="button" class="btn ghost" id="back">← Geri</button>` : `<span></span>`}
              <button class="btn">${step < STEPS.length - 1 ? "Devam" : "Planımı oluştur"} ${icon("arrow")}</button>
            </div>
          </form>
        </div>`;
      $("#dRange")?.addEventListener("input", (e) => ($("#dOut").value = e.target.value));
      $("#back")?.addEventListener("click", () => { collect(); step--; draw(); });
      $("#onbForm").onsubmit = (e) => {
        e.preventDefault();
        collect();
        if (step === 3 && !d.weak.length) { toast("En az bir ders seç — ya da hepsinde iyiysen bir tane tahmin et :)"); return; }
        if (step < STEPS.length - 1) { step++; draw(); } else finish();
      };
    };
    const collect = () => {
      const f = new FormData($("#onbForm"));
      ["grade", "track", "target", "provider", "tone"].forEach((k) => f.has(k) && (d[k] = f.get(k)));
      if (step === 3) { d.weak = f.getAll("weak"); d.daily = +f.get("daily"); }
      store.set("draft", d);
    };
    const finish = async () => {
      const items = ["Profilin oluşturuluyor", "Zayıf konular eşleştiriliyor", "İlk haftalık plan hazırlanıyor", "Tekrar kartların seçiliyor"];
      view.innerHTML = `<div class="onb"><header class="onb-top">${brand}</header><div class="glass card onb-card onb-load"><div class="orb"></div><h2>Her şeyi senin için hazırlıyoruz…</h2><ol class="scan-steps mono">${items.map((x, i) => `<li class="${i === 0 ? "on" : ""}">${x}</li>`).join("")}</ol></div></div>`;
      const plan = AI.generatePlan({ hours: d.daily / 60, focus: d.weak, weekendOff: true });
      const lis = $$(".scan-steps li", view);
      for (let i = 1; i < lis.length; i++) { await sleep(550); lis[i - 1].classList.replace("on", "done"); lis[i].classList.add("on"); }
      store.set("plan", await plan);
      await sleep(400);
      session.save({ ...d, avatar: false });
      try { localStorage.removeItem("derslik.draft"); } catch (_) {}
      location.hash = "#/";
      toast(`Hoş geldin ${d.name.split(" ")[0]}! İlk haftalık planın hazır.`, { href: "#/plan", label: "Planı gör" });
    };
    draw();
  }

  Router.add("hosgeldin", landing);
  Router.add("giris", auth);
  Router.add("baslangic", onboarding);
})();
