/* Ödevler: liste, detay, teslim ve yapay zekâ ön kontrolü */
(function () {
  const { $, $$, esc, icon, Router, course, person, avatar, tag, hue, store, toast, sleep, ring } = UI;

  const subs = () => store.get("subs", {});
  const statusOf = (a) => (subs()[a.id] ? "teslim edildi" : a.status);
  const dueText = (iso) => {
    const ms = new Date(iso) - new Date();
    if (ms < 0) return { t: "süresi geçti", cls: "late" };
    const h = Math.floor(ms / 36e5);
    if (h < 24) return { t: `${h} saat kaldı`, cls: "soon" };
    const d = Math.floor(h / 24);
    return { t: `${d} gün kaldı`, cls: d <= 1 ? "soon" : "" };
  };
  const fmtDate = (iso) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  const STATUS = { bekliyor: "Bekliyor", "teslim edildi": "Teslim edildi", notlandı: "Notlandı" };

  function list(view, params) {
    const f = params.get("f") || "bekliyor";
    const all = DB.assignments.map((a) => ({ ...a, st: statusOf(a) }));
    const count = (s) => all.filter((a) => a.st === s).length;
    const rows = all.filter((a) => a.st === f).sort((a, b) => a.due.localeCompare(b.due));

    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">11-B · 6 öğretmen</p><h1>Ödevler</h1></div>
        <div class="seg" id="hwf">
          ${Object.entries(STATUS).map(([k, l]) => `<button data-f="${k}" class="${k === f ? "on" : ""}">${l} <span class="mono muted">${count(k)}</span></button>`).join("")}
        </div>
      </header>
      ${f === "bekliyor" && rows.length ? `<div class="glass card hw-alert">${icon("timer")}<p><b>${rows[0].title}</b> için ${dueText(rows[0].due).t}. Başlamadıysan asistanla 10 dakikalık bir ön hazırlık yapabilirsin.</p><a class="mini" href="#/odev/${rows[0].id}">Aç</a></div>` : ""}
      <section class="hw-list">
        ${rows.length ? rows.map((a) => { const c = course(a.course), d = dueText(a.due); return `
          <a class="glass card hw-row" href="#/odev/${a.id}" style="--c:${hue(c)}">
            <span class="hw-bar"></span>
            <div class="grow">
              <div class="row-l">${tag(c)}<span class="mono muted">${a.points} puan</span></div>
              <h3>${a.title}</h3>
              <div class="meta">${avatar(a.teacher, 20)}<span>${person(a.teacher).name}</span><span class="dotsep"></span><span>${fmtDate(a.due)}</span></div>
            </div>
            <div class="hw-right">
              ${a.st === "notlandı" ? `<b class="grade">${a.grade}<small>/${a.points}</small></b>` : a.st === "teslim edildi" ? `<span class="st-chip ok">${icon("check")} teslim edildi</span>` : `<span class="due-chip ${d.cls}">${d.t}</span>`}
              ${icon("arrow")}
            </div>
          </a>`; }).join("") : `<div class="glass card empty-state">${icon("task")}<b>Burada ödev yok.</b><p class="muted small">${f === "bekliyor" ? "Bekleyen ödevin kalmadı. Güzel iş." : "Henüz bu durumda bir ödev yok."}</p></div>`}
      </section>`;
    $$("#hwf button").forEach((b) => (b.onclick = () => (location.hash = "#/odevler?f=" + encodeURIComponent(b.dataset.f))));
  }

  function detail(view, params, [id]) {
    const a = DB.assignments.find((x) => x.id === id);
    if (!a) return list(view, new URLSearchParams());
    const c = course(a.course), st = statusOf(a), d = dueText(a.due);
    let files = [];
    const draft = store.get("hwDraft", {})[a.id] || "";

    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono"><a href="#/odevler">ödevler</a> / ${(c.short || c.name).toLocaleLowerCase("tr")}</p><h1>${a.title}</h1></div>
        <span class="due-chip ${st === "bekliyor" ? d.cls : ""} lg">${st === "bekliyor" ? d.t : STATUS[st]}</span>
      </header>
      <section class="hw-detail" style="--c:${hue(c)}">
        <div class="hw-main">
          <div class="glass card">
            <div class="row-l">${avatar(a.teacher, 36)}<span><b>${person(a.teacher).name}</b><small class="muted"> · ${person(a.teacher).role}</small><br><span class="mono muted small">son teslim: ${fmtDate(a.due)} · ${a.points} puan</span></span></div>
            <p class="hw-desc">${a.desc}</p>
            ${a.files.length ? `<div class="files">${a.files.map((f) => `<button class="file" data-f="${f}">${icon("file")}<span>${f}</span><small class="mono muted">PDF · 240 KB</small></button>`).join("")}</div>` : ""}
            ${a.rubric.length ? `<div><p class="mono muted small">değerlendirme ölçütleri</p><ul class="rubric">${a.rubric.map((r) => `<li>${icon("check")}${r}</li>`).join("")}</ul></div>` : ""}
          </div>
          <div class="glass card hw-help">
            <div class="card-top"><h3>${icon("spark")} Ödev asistanı</h3><span class="mono muted">ödev modu</span></div>
            <p class="muted small">Ödev modunda asistan cevap vermez; ipucu verir ve soruyla yönlendirir. Öğretmenin bu modu açık tuttu.</p>
            <div class="chips"><a class="mini" href="#/asistan?q=${encodeURIComponent(a.title + " için nereden başlamalıyım?")}">Nereden başlamalıyım?</a><a class="mini" href="#/asistan?q=${encodeURIComponent(c.name + " konusunu özetle")}">Konuyu özetle</a><a class="mini" href="#/kartlar">Konu kartları</a></div>
          </div>
        </div>

        <aside class="glass card hw-sub" id="sub">
          ${st === "notlandı" ? `
            <h3>Değerlendirme</h3>
            <div class="grade-ring">${ring(a.grade / a.points, 120, 4)}<b>${a.grade}</b></div>
            <p class="mono muted small center">${a.submitted} tarihinde teslim edildi</p>
            <div class="fb">${avatar(a.teacher, 28)}<p>${a.feedback}</p></div>
            <a class="btn ghost full" href="#/quiz?c=${c.id}">Eksik konudan quiz çöz</a>`
          : st === "teslim edildi" ? `
            <div class="sub-done">${icon("check")}<h3>Teslim edildi</h3><p class="muted small">${a.submitted || "Bugün"} · Öğretmenin değerlendirdiğinde bildirim alacaksın.</p></div>
            <button class="btn ghost full" id="unsubmit">Teslimi geri al</button>`
          : `
            <h3>Teslimin</h3>
            <label class="dropz" id="dz"><input type="file" multiple hidden id="hwFile" />${icon("upload")}<span>Dosya veya fotoğraf ekle</span><small class="muted">PDF, JPG, PNG · en fazla 20 MB</small></label>
            <ul class="up-list" id="upList"></ul>
            <label class="fld"><span>Not / cevap metni</span><textarea id="hwText" rows="5" placeholder="Öğretmenine iletmek istediğin not ya da yazılı cevabın…">${esc(draft)}</textarea><em class="mono muted" id="saved"></em></label>
            <button class="btn ghost full" id="check">${icon("spark")} Yapay zekâ ön kontrolü</button>
            <div id="checkOut"></div>
            <button class="btn full" id="submitHw">Teslim et</button>
            <p class="muted small center">Teslimden sonra son tarihe kadar geri alabilirsin.</p>`}
        </aside>
      </section>`;

    $$(".file", view).forEach((b) => (b.onclick = () => toast(`${b.dataset.f} indiriliyor… (demo)`)));
    if (st === "teslim edildi") $("#unsubmit").onclick = () => { const s = subs(); delete s[a.id]; store.set("subs", s); Router.refresh(); toast("Teslim geri alındı."); };
    if (st !== "bekliyor") return;

    const drawFiles = () => {
      $("#upList").innerHTML = files.map((f, i) => `<li>${icon("file")}<span class="grow">${esc(f.name)}</span><small class="mono muted">${(f.size / 1024).toFixed(0)} KB</small><button class="ib sm" data-i="${i}">${icon("x")}</button></li>`).join("");
      $$("#upList button").forEach((b) => (b.onclick = () => { files.splice(+b.dataset.i, 1); drawFiles(); }));
    };
    $("#hwFile").onchange = (e) => { files.push(...e.target.files); drawFiles(); e.target.value = ""; };
    const dz = $("#dz");
    dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("over"); });
    dz.addEventListener("dragleave", () => dz.classList.remove("over"));
    dz.addEventListener("drop", (e) => { e.preventDefault(); dz.classList.remove("over"); files.push(...e.dataTransfer.files); drawFiles(); });
    let t;
    $("#hwText").oninput = (e) => {
      clearTimeout(t);
      t = setTimeout(() => { const all = store.get("hwDraft", {}); all[a.id] = e.target.value; store.set("hwDraft", all); $("#saved").textContent = "taslak kaydedildi"; }, 500);
    };
    $("#check").onclick = async () => {
      const out = $("#checkOut");
      const text = $("#hwText").value.trim();
      out.innerHTML = `<div class="check-out"><span class="typing"><i></i><i></i><i></i></span> ölçütlere göre kontrol ediliyor…</div>`;
      await sleep(1200);
      const res = (a.rubric.length ? a.rubric : ["Ödev açıklamasına uygunluk"]).map((r, i) => ({ r, ok: i === 0 ? files.length > 0 || text.length > 40 : i === 1 ? text.length > 120 : files.length > 0 }));
      out.innerHTML = `<div class="check-out"><p class="mono muted small">ön kontrol · not vermez, yalnızca eksikleri gösterir</p>
        <ul>${res.map((x) => `<li class="${x.ok ? "ok" : "warn"}">${icon(x.ok ? "check" : "x")}<span><b>${x.r}</b><small>${x.ok ? "Karşılanıyor görünüyor." : files.length || text ? "Daha fazla ayrıntı eklemeyi düşün." : "Henüz dosya ya da metin eklemedin."}</small></span></li>`).join("")}</ul></div>`;
    };
    $("#submitHw").onclick = async (e) => {
      if (!files.length && !$("#hwText").value.trim()) { toast("Teslim etmeden önce dosya ya da metin ekle."); return; }
      e.currentTarget.disabled = true;
      e.currentTarget.innerHTML = `<span class="typing"><i></i><i></i><i></i></span> yükleniyor`;
      await sleep(900);
      const s = subs(); s[a.id] = { at: Date.now(), files: files.map((f) => f.name) }; store.set("subs", s);
      a.submitted = "Bugün";
      Router.refresh();
      toast("Ödev teslim edildi · +25 XP");
    };
  }

  Router.add("odevler", list);
  Router.add("odev", detail, "odevler");
})();
