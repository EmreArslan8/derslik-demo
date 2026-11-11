/* Profil, ayarlar ve 404 */
(function () {
  const { $, $$, esc, icon, Router, avatar, img, store, toast, session, theme, person, pct } = UI;

  /* Son 12 haftanın günlük çalışma dakikaları (deterministik örnek) */
  const activity = () => {
    const out = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const today = new Date();
    const start = new Date(today); start.setDate(start.getDate() - 182 - ((today.getDay() + 6) % 7));
    for (let i = Math.round((today - start) / 864e5); i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const r = rnd();
      const m = i < 12 ? 40 + Math.round(r * 90) : r < 0.18 ? 0 : Math.round(r * 140);
      out.push({ d, m });
    }
    return out;
  };

  function profile(view) {
    const s = DB.student;
    const lvlNext = 5000, lvlPrev = 4000;
    const act = activity();
    const totalH = Math.round(act.slice(-84).reduce((a, x) => a + x.m, 0) / 60);
    const lv = (m) => (m === 0 ? 0 : m < 40 ? 1 : m < 80 ? 2 : m < 120 ? 3 : 4);
    const fmtD = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
    const lb = DB.leaderboard.map((r) => ({ ...r, name: r.me ? s.fullName : person(r.who).name }));

    view.innerHTML = `
      <section class="pf-hero">
        <img src="${img("l-grup")}" alt="" />
        <div class="pf-in">
          ${avatar("elif", 92, "pf-av")}
          <div class="grow">
            <h1>${esc(s.fullName)}</h1>
            <p>${s.grade} · ${s.track} · ${s.school}</p>
            <p class="pf-target">${icon("trophy")} Hedef: ${esc(s.target || DB.targets[0])}</p>
          </div>
          <a class="btn light sm" href="#/ayarlar">${icon("gear")} Profili düzenle</a>
        </div>
      </section>

      <section class="kpis pf-kpis">
        <div class="glass card kpi"><span class="mono muted">seviye ${s.level}</span><b>${s.xp.toLocaleString("tr")}<small> XP</small></b><span class="bar"><i style="width:${((s.xp - lvlPrev) / (lvlNext - lvlPrev)) * 100}%"></i></span><span class="muted small">${(lvlNext - s.xp).toLocaleString("tr")} XP sonra seviye ${s.level + 1}</span></div>
        <div class="glass card kpi"><span class="mono muted">seri</span><b>${s.streak}<small> gün</small></b><span class="muted small">en uzun: 19 gün</span></div>
        <div class="glass card kpi"><span class="mono muted">son 12 hafta</span><b>${totalH}<small> saat</small></b><span class="muted small">haftada ort. ${Math.round(totalH / 12)} saat</span></div>
        <div class="glass card kpi"><span class="mono muted">çözülen soru</span><b>1.284</b><span class="muted small">%78 doğruluk</span></div>
      </section>

      <section class="grid pf-grid">
        <div class="glass card pf-act">
          <div class="card-top"><h3>Çalışma takvimi</h3><span class="mono muted">son 6 ay</span></div>
          <div class="cal-wrap">
            <div class="cal-days mono muted"><span>Pzt</span><span></span><span>Çar</span><span></span><span>Cum</span><span></span><span>Paz</span></div>
            <div class="cal">${act.map((x) => `<i class="l${lv(x.m)}" title="${fmtD.format(x.d)}: ${x.m} dk"></i>`).join("")}</div>
          </div>
          <div class="heat-legend"><span class="mono muted">az</span>${[0, 1, 2, 3, 4].map((l) => `<i class="cal-k l${l}"></i>`).join("")}<span class="mono muted">çok</span></div>
        </div>

        <div class="glass card pf-lb">
          <div class="card-top"><h3>Sınıf sıralaması</h3><div class="seg sm" id="lbSeg"><button class="on">Bu hafta</button><button>Tüm zamanlar</button></div></div>
          <ol class="lb">${lb.map((r, i) => `<li class="${r.me ? "me" : ""}"><span class="mono rk">${i + 1}</span>${avatar(r.who, 30)}<span class="grow"><b>${esc(r.name)}${r.me ? " (sen)" : ""}</b><small>${r.school}</small></span><span class="mono">${r.xp.toLocaleString("tr")} XP</span></li>`).join("")}</ol>
          <p class="muted small">Ege'yi geçmene <b>610 XP</b> var — yaklaşık 4 quiz.</p>
        </div>

        <div class="glass card pf-ach">
          <div class="card-top"><h3>Başarımlar</h3><span class="mono muted">${DB.achievements.filter((a) => a.got).length} / ${DB.achievements.length}</span></div>
          <div class="ach">${DB.achievements.map((a) => `
            <div class="ach-i ${a.got ? "got" : ""}">
              <span class="ach-ic">${icon(a.got ? a.icon : "lock")}</span>
              <b>${a.name}</b><small>${a.desc}</small>
              ${a.got ? `<em class="mono">kazanıldı</em>` : `<span class="bar"><i style="width:${pct(a.p)}%"></i></span>`}
            </div>`).join("")}</div>
        </div>

        <div class="glass card pf-feed">
          <div class="card-top"><h3>Son etkinlikler</h3></div>
          <ul class="feed">
            ${[["quiz", "Türev quiz'ini 4/4 bitirdin", "2 sa önce"], ["cards", "Elektrostatik destesinde 5 kart tekrar ettin", "dün"], ["task", "Molarite çalışma kâğıdı notlandı: 88", "4 gün önce"], ["rooms", "Sessiz kütüphanede 3 odak turu", "5 gün önce"], ["flame", "7 günlük seriyi tamamladın", "1 hafta önce"]].map(([i, t, w]) => `<li><span class="feed-ic">${icon(i)}</span><span class="grow">${t}</span><small class="mono muted">${w}</small></li>`).join("")}
          </ul>
        </div>
      </section>`;
    $$("#lbSeg button").forEach((b) => (b.onclick = () => { $$("#lbSeg button").forEach((x) => x.classList.toggle("on", x === b)); toast("Tüm zamanlar sıralaması demo kapsamında aynı."); }));
  }

  function settings(view, params) {
    const u = session.user();
    const sec = params.get("s") || "hesap";
    const SECS = [["hesap", "Hesap", "user"], ["calisma", "Çalışma", "timer"], ["yz", "Yapay zekâ", "spark"], ["bildirim", "Bildirimler", "bell"], ["gorunum", "Görünüm", "moon"], ["veri", "Veri ve gizlilik", "lock"]];
    const prefs = store.get("prefs", { n_odev: true, n_kart: true, n_oda: false, n_rapor: true, mail: false, homework: true });
    const sel = (name, list, cur) => `<select name="${name}">${list.map((x) => `<option ${x === cur ? "selected" : ""}>${x}</option>`).join("")}</select>`;
    const sw = (name, label, sub, on, dis) => `<label class="set-row"><span class="grow"><b>${label}</b>${sub ? `<small>${sub}</small>` : ""}</span><span class="switch"><input type="checkbox" name="${name}" ${on ? "checked" : ""} ${dis ? "disabled" : ""}/><span></span></span></label>`;

    const bodies = {
      hesap: `
        <div class="set-av">${avatar("elif", 64)}<div><b>Profil fotoğrafı</b><p class="muted small">JPG veya PNG, en fazla 2 MB.</p><div class="row-l"><button type="button" class="mini" id="avUp">Yükle</button><button type="button" class="mini" id="avRm">Kaldır</button></div></div></div>
        <label class="fld"><span>Ad soyad</span><input name="name" value="${esc(u.name)}" /></label>
        <label class="fld"><span>E-posta</span><input name="email" type="email" value="${esc(u.email || "")}" /></label>
        <div class="fld-2">
          <label class="fld"><span>Sınıf</span>${sel("grade", ["9. sınıf", "10. sınıf", "11. sınıf", "12. sınıf", "Mezun"], u.grade)}</label>
          <label class="fld"><span>Alan</span>${sel("track", ["Sayısal", "Eşit Ağırlık", "Sözel", "Dil"], u.track)}</label>
        </div>
        <label class="fld"><span>Hedef</span>${sel("target", DB.targets, u.target)}</label>`,
      calisma: `
        <fieldset><legend class="mono muted">Günlük hedef <output id="gOut">${u.daily || 90}</output> dk</legend><input type="range" name="daily" min="30" max="240" step="15" value="${u.daily || 90}" id="gRange" /></fieldset>
        <label class="fld"><span>Varsayılan odak süresi</span>${sel("pomo", ["25 / 5", "50 / 10", "90 / 15"], u.pomo || "25 / 5")}</label>
        <label class="fld"><span>Hafta başlangıcı</span>${sel("week", ["Pazartesi", "Pazar"], "Pazartesi")}</label>
        ${sw("weekend", "Pazar dinlenme günü", "Otomatik planlar pazar gününü boş bırakır.", u.weekendOff !== false)}`,
      yz: `
        <label class="fld"><span>Sağlayıcı</span><select name="provider">${DB.providers.map((p) => `<option value="${p.id}" ${p.id === AI.config.provider ? "selected" : ""}>${p.name}</option>`).join("")}</select></label>
        <label class="fld"><span>Anlatım tarzı</span>${sel("tone", ["samimi", "resmi", "sokratik"], u.tone || "samimi")}</label>
        ${sw("homework", "Ödevlerde doğrudan cevap verme", "Öğretmenin tarafından açık tutuluyor.", true, true)}
        ${sw("sources", "Yanıtlarda kaynak konuyu göster", "Asistan hangi ders notuna dayandığını belirtir.", prefs.sources !== false)}
        <div class="hair"></div>
        <label class="fld"><span>Proxy adresi <small class="muted">— API anahtarlarını tutan sunucu ucu</small></span><input name="proxy" placeholder="https://okulunuz.edu.tr/api/ai" value="${esc(AI.config.proxyUrl)}" /></label>
        <div class="row-l"><button type="button" class="btn ghost sm" id="testConn">Bağlantıyı test et</button><span class="small muted" id="connOut">${AI.isLive() ? "Bağlı" : "Bağlı değil · demo yanıtları kullanılıyor"}</span></div>
        <p class="muted small">API anahtarları tarayıcıya hiçbir zaman girilmez. Proxy, istek gövdesini seçili sağlayıcıya iletir; ayrıntılar README'de.</p>`,
      bildirim: `
        ${sw("n_odev", "Ödev hatırlatmaları", "Son teslimden 24 ve 2 saat önce", prefs.n_odev)}
        ${sw("n_kart", "Kart tekrar hatırlatması", "Her gün 19:00'da, bekleyen kart varsa", prefs.n_kart)}
        ${sw("n_oda", "Oda davetleri", "Arkadaşların seni odaya çağırdığında", prefs.n_oda)}
        ${sw("n_rapor", "Haftalık rapor", "Pazar akşamı haftanın özeti", prefs.n_rapor)}
        ${sw("mail", "E-posta bildirimleri", "Bildirimlerin bir kopyası e-postana gelir", prefs.mail)}`,
      gorunum: `
        <p class="mono muted small">tema</p>
        <div class="opt-grid three">${[["light", "Açık"], ["dark", "Koyu"], ["system", "Sistem"]].map(([v, l]) => `<label class="ocard theme-c ${v}"><input type="radio" name="theme" value="${v}" ${(store.get("theme", "system") || "system") === v ? "checked" : ""}/><span><i class="th-prev"></i><b>${l}</b></span></label>`).join("")}</div>
        ${sw("motion", "Hareketi azalt", "Animasyonları en aza indirir", document.documentElement.classList.contains("still"))}`,
      veri: `
        <div class="set-row"><span class="grow"><b>Verilerimi indir</b><small>Profil, plan, kartlar ve teslimler JSON olarak</small></span><button type="button" class="mini" id="exp">${icon("upload")} İndir</button></div>
        <div class="set-row"><span class="grow"><b>İlerlemeyi sıfırla</b><small>Kart, plan ve ödev taslakları silinir; hesabın kalır</small></span><button type="button" class="mini" id="reset">Sıfırla</button></div>
        <div class="set-row danger"><span class="grow"><b>Hesabı sil</b><small>Bu demo tarayıcısındaki tüm Derslik verileri silinir</small></span><button type="button" class="mini" id="del">Hesabı sil</button></div>`,
    };

    view.innerHTML = `
      <header class="head"><div><p class="eyebrow mono">hesabın ve tercihlerin</p><h1>Ayarlar</h1></div></header>
      <section class="settings">
        <nav class="glass card set-nav">${SECS.map(([k, l, i]) => `<a href="#/ayarlar?s=${k}" class="${k === sec ? "on" : ""}">${icon(i)}${l}</a>`).join("")}</nav>
        <form class="glass card set-body" id="setForm">
          <h2>${SECS.find((x) => x[0] === sec)[1]}</h2>
          ${bodies[sec]}
          ${["veri", "bildirim", "gorunum"].includes(sec) ? "" : `<div class="set-foot"><button class="btn">Kaydet</button></div>`}
        </form>
      </section>`;

    const form = $("#setForm");
    $("#gRange")?.addEventListener("input", (e) => ($("#gOut").value = e.target.value));
    form.onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const nu = { ...session.user() };
      if (sec === "hesap") {
        if (f.get("name").trim().split(" ").length < 2) return toast("Ad ve soyadını yaz.");
        Object.assign(nu, { name: f.get("name").trim(), email: f.get("email"), grade: f.get("grade"), track: f.get("track"), target: f.get("target") });
      }
      if (sec === "calisma") Object.assign(nu, { daily: +f.get("daily"), pomo: f.get("pomo"), weekendOff: !!f.get("weekend") });
      if (sec === "yz") {
        Object.assign(nu, { provider: f.get("provider"), tone: f.get("tone") });
        AI.config.proxyUrl = f.get("proxy").trim();
        try { localStorage.setItem("derslik.proxy", AI.config.proxyUrl); } catch (_) {}
        $("#provider") && ($("#provider").value = f.get("provider"));
        store.set("prefs", { ...prefs, sources: !!f.get("sources") });
      }
      session.save(nu);
      if (sec === "hesap") { $("#meCard b") && ($("#meCard b").textContent = nu.name); $(".pm-head b") && ($(".pm-head b").textContent = nu.name); }
      toast("Değişiklikler kaydedildi.");
    };
    /* anında kaydedilen bölümler */
    form.addEventListener("change", (e) => {
      if (sec === "bildirim") { const f = new FormData(form); const p = { ...prefs }; ["n_odev", "n_kart", "n_oda", "n_rapor", "mail"].forEach((k) => (p[k] = !!f.get(k))); store.set("prefs", p); toast("Bildirim tercihi güncellendi."); }
      if (sec === "gorunum" && e.target.name === "theme") {
        const v = e.target.value;
        store.set("theme", v === "system" ? null : v);
        document.documentElement.dataset.theme = v === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : v;
        $("#themeBtn") && ($("#themeBtn").innerHTML = icon(theme.get() === "dark" ? "sun" : "moon"));
      }
      if (sec === "gorunum" && e.target.name === "motion") { document.documentElement.classList.toggle("still", e.target.checked); store.set("still", e.target.checked); }
    });
    $("#avUp") && ($("#avUp").onclick = () => toast("Fotoğraf yükleme demo kapsamında kapalı."));
    $("#avRm") && ($("#avRm").onclick = () => { session.save({ ...session.user(), avatar: false }); location.reload(); });
    $("#testConn") && ($("#testConn").onclick = async () => {
      const url = $("[name=proxy]").value.trim();
      const out = $("#connOut");
      if (!url) { out.textContent = "Önce bir proxy adresi gir."; return; }
      out.innerHTML = `<span class="typing"><i></i><i></i><i></i></span>`;
      try {
        const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: $("[name=provider]").value, ping: true }) });
        out.textContent = r.ok ? "Bağlantı başarılı." : `Sunucu yanıt verdi ama hata döndü (${r.status}).`;
      } catch (_) { out.textContent = "Adrese ulaşılamadı. CORS ayarlarını ve adresi kontrol et."; }
    });
    $("#exp") && ($("#exp").onclick = () => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("derslik.")) data[k.slice(8)] = localStorage.getItem(k); }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      a.download = "derslik-verilerim.json";
      a.click();
      toast("Verilerin indirildi.");
    });
    $("#reset") && ($("#reset").onclick = () => {
      if (!confirm("Kart, plan ve ödev taslakların silinecek. Emin misin?")) return;
      ["plan", "cards", "extraCards", "subs", "hwDraft", "done"].forEach((k) => { try { localStorage.removeItem("derslik." + k); } catch (_) {} });
      toast("İlerleme sıfırlandı.");
    });
    $("#del") && ($("#del").onclick = () => { if (confirm("Hesabın ve bu tarayıcıdaki tüm Derslik verileri silinecek.")) session.logout(); });
  }

  function notFound(view) {
    view.innerHTML = `
      <div class="nf">
        <p class="nf-n">404</p>
        <h1>Bu sayfa bu dönemin müfredatında yok.</h1>
        <p class="muted">Aradığın sayfa taşınmış ya da hiç olmamış olabilir.</p>
        <div class="row"><a class="btn" href="#/">Panele dön</a><button class="btn ghost" onclick="UI.openPalette()">${icon("search")} Ara</button></div>
      </div>`;
  }

  Router.add("profil", profile);
  Router.add("ayarlar", settings);
  Router.add("404", notFound, "");
})();
