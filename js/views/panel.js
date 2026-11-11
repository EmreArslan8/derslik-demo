(function () {
  const { $, $$, pct, course, person, hue, img, avatar, stack, icon, Focus, Router, ring, tag, store } = UI;

  function render(view) {
    const s = DB.student;
    const max = Math.max(...s.week.map((d) => d.m), s.goalMinutes);
    const total = s.week.reduce((a, d) => a + d.m, 0);
    const v = DB.videos[0];
    const c = course(v.course);
    const dq = DB.dailyQuestion;
    const today = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
    const h = new Date().getHours();
    const greet = h < 6 ? "İyi geceler" : h < 12 ? "Günaydın" : h < 18 ? "İyi günler" : "İyi akşamlar";
    const todayIdx = (new Date().getDay() + 6) % 7;
    const plan = store.get("plan", DB.plan).filter((p) => p.day === todayIdx);
    const due = UI.dueCards();
    const live = DB.rooms.reduce((a, r) => a + r.live, 0);

    view.innerHTML = `
      <header class="head">
        <div>
          <p class="eyebrow mono">${today}</p>
          <h1>${greet}, ${s.name}. <em>Bugün türevi bitirelim.</em></h1>
        </div>
        <div class="head-stats">
          <span class="chip">${icon("flame")}<b>${s.streak}</b> gün seri</span>
          <span class="chip"><b>${s.xp.toLocaleString("tr")}</b> XP · Sv ${s.level}</span>
          <span class="chip">Okulda <b>#${s.rank}</b></span>
        </div>
      </header>

      <section class="grid panel-grid">
        <a class="glass card resume" href="#/ders/${c.id}?v=1">
          <div class="media">
            <img src="${img(v.img)}" alt="" />
            <span class="play">${icon("play")}</span>
            <span class="dur mono">${UI.fmtSecs(v.secs * v.watched)} / ${v.dur}</span>
            <span class="vbar"><i style="width:${pct(v.watched)}%"></i></span>
          </div>
          <div class="card-top">${tag(c)}<span class="mono muted">Kaldığın yer</span></div>
          <h2>${v.title}</h2>
          <div class="meta">${avatar(c.teacher, 22)}<span>${person(c.teacher).name}</span><span class="sep"></span><span>Bölüm 4 / 5 · Zincir kuralı</span></div>
        </a>

        <div class="glass card focus" id="focusCard">
          <div class="card-top"><h3>Odak</h3><div class="seg sm" id="fmode"><button data-m="25">25 dk</button><button data-m="50">50 dk</button></div></div>
          <div class="focus-dial">
            <div class="dial" id="dial"></div>
            <div class="dial-in"><b class="mono" id="ftime"></b><small id="fphase"></small></div>
          </div>
          <div class="row">
            <button class="btn" id="fbtn"></button>
            <a class="btn ghost" href="#/odalar">Odada çalış</a>
          </div>
          <p class="muted small center">Bugün <b id="fsess">${Focus.sessions}</b> oturum tamamlandı</p>
        </div>

        <div class="glass card week">
          <div class="card-top"><h3>Bu hafta</h3><span class="mono muted">${Math.floor(total / 60)} sa ${total % 60} dk · <span class="dash"></span> hedef ${s.goalMinutes} dk</span></div>
          <div class="chart" role="img" aria-label="Haftalık çalışma süreleri, dakika">
            <span class="goal" style="bottom:calc(22px + (100% - 30px) * ${s.goalMinutes / max})"></span>
            ${s.week.map((d, i) => `<div class="col ${i === todayIdx ? "is-today" : ""}"><div class="b"><i style="height:${(d.m / max) * 100}%"></i><span class="tip mono">${d.m} dk</span></div><span class="mono">${d.d}</span></div>`).join("")}
          </div>
          <div class="stats">
            <div><b>${s.week.filter((d) => d.m >= s.goalMinutes).length}/7</b><span>hedef tuttu</span></div>
            <div><b>84%</b><span>quiz ort.</span></div>
            <div><b>+3,5</b><span>son deneme net</span></div>
          </div>
        </div>

        <div class="glass card today-plan">
          <div class="card-top"><h3>Bugünün planı</h3><a class="mono muted link" href="#/plan">plan →</a></div>
          <ul class="rows">
            ${plan.length ? plan.map((p) => { const pc = course(p.course); return `
              <li class="${p.done ? "is-done" : ""}">
                <span class="when mono">${p.start}</span>
                <span class="pbar" style="--c:${hue(pc)}"></span>
                <span class="grow"><b>${p.title}</b><small>${pc.short || pc.name} · ${p.mins} dk</small></span>
                ${p.done ? `<span class="ok-ic">${icon("check")}</span>` : ""}
              </li>`; }).join("") : `<li class="muted">Bugün için plan yok. <a class="link" href="#/plan">Plan oluştur →</a></li>`}
          </ul>
        </div>

        <div class="glass card daily" id="daily">
          <div class="card-top"><h3>Günün sorusu</h3>${tag(course(dq.course))}</div>
          <p class="q">${dq.q}</p>
          <div class="opts">${dq.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="mono">${"ABCD"[i]}</span>${o}</button>`).join("")}</div>
          <p class="why" hidden></p>
        </div>

        <a class="glass card due" href="#/kartlar">
          <div class="card-top"><h3>Tekrar zamanı</h3>${icon("arrow")}</div>
          <div class="due-stack"><span></span><span></span><span class="front">Zincir kuralı<small class="mono">matematik</small></span></div>
          <p><b class="big">${due}</b> kart bugün tekrar bekliyor</p>
        </a>

        <div class="glass card weak">
          <div class="card-top"><h3>Tekrar etmen gerekenler</h3><span class="mono muted">son 14 gün</span></div>
          <ul class="rows">
            ${DB.weak.map((w) => { const wc = course(w.course); return `
              <li>
                <span class="dotc" style="--c:${hue(wc)}"></span>
                <span class="grow"><b>${w.topic}</b><small>${wc.name}</small></span>
                <span class="meter" title="Hâkimiyet ${pct(w.score)}%"><i style="width:${pct(w.score)}%"></i></span>
                <span class="score mono">${pct(w.score)}%</span>
                <a class="mini" href="#/asistan?q=${encodeURIComponent(w.topic + " konusunu açıkla")}">Çalış</a>
              </li>`; }).join("")}
          </ul>
        </div>

        <a class="card rooms-promo" href="#/odalar">
          <img src="${img("r-kutuphane")}" alt="" />
          <div class="rp-in">
            <span class="live mono"><i></i>canlı</span>
            <h3>Şu an ${live} öğrenci çalışıyor</h3>
            <div class="row-l">${stack(["zeynep", "ege", "mert", "ada"], 26, live - 4)}<span class="btn sm light">Odaya katıl</span></div>
          </div>
        </a>

        <div class="glass card hw-mini">
          <div class="card-top"><h3>Yaklaşan ödevler</h3><a class="mono muted link" href="#/odevler">tümü →</a></div>
          <ul class="rows">
            ${DB.assignments.filter((a) => a.status === "bekliyor" && !store.get("subs", {})[a.id]).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 3).map((a) => { const ac = course(a.course); const h = Math.floor((new Date(a.due) - new Date()) / 36e5); return `
              <li><span class="dotc" style="--c:${hue(ac)}"></span><a class="grow" href="#/odev/${a.id}"><b>${a.title}</b><small>${ac.short || ac.name} · ${person(a.teacher).name}</small></a><span class="due-chip ${h < 48 ? "soon" : ""}">${h < 0 ? "geçti" : h < 24 ? h + " sa" : Math.floor(h / 24) + " gün"}</span></li>`; }).join("") || `<li class="muted">Bekleyen ödevin yok.</li>`}
          </ul>
        </div>

        <div class="glass card courses-mini">
          <div class="card-top"><h3>Dersler</h3><a class="mono muted link" href="#/dersler">tümü →</a></div>
          <ul class="rings">
            ${DB.courses.map((x) => `<li><a href="#/ders/${x.id}" style="--c:${hue(x)}">${ring(x.progress)}<span>${x.short || x.name}</span><small class="mono">${pct(x.progress)}%</small></a></li>`).join("")}
          </ul>
        </div>
      </section>`;

    /* Günün sorusu */
    $$("#daily .opt").forEach((b) =>
      b.addEventListener("click", () => {
        const i = +b.dataset.i;
        $$("#daily .opt").forEach((x, j) => { x.disabled = true; if (j === dq.answer) x.classList.add("ok"); else if (j === i) x.classList.add("bad"); });
        const why = $("#daily .why");
        why.hidden = false;
        why.innerHTML = `<b>${i === dq.answer ? "Doğru." : "Tam değil."}</b> ${dq.why}`;
        if (i === dq.answer) UI.toast("+20 XP · Günün sorusu");
      })
    );

    /* Odak kartı */
    const dial = $("#dial");
    const off = Focus.on((f) => {
      if (!document.body.contains(dial)) return;
      const p = 1 - f.left / f.total;
      dial.innerHTML = ring(p, 168, 3);
      $("#ftime").textContent = f.fmt();
      $("#fphase").textContent = f.running ? (f.phase === "odak" ? "odaklanıyorsun" : "mola") : f.left === f.total ? "hazır" : "duraklatıldı";
      $("#fbtn").innerHTML = `${icon(f.running ? "pause" : "play")} ${f.running ? "Duraklat" : f.left === f.total ? "Başlat" : "Devam et"}`;
      $("#fsess").textContent = f.sessions;
      $$("#fmode button").forEach((b) => b.classList.toggle("on", +b.dataset.m * 60 === f.total));
    });
    Router.onLeave(off);
    $("#fbtn").onclick = () => Focus.toggle();
    $$("#fmode button").forEach((b) => (b.onclick = () => Focus.set(+b.dataset.m)));
  }

  UI.Router.add("panel", render);
})();
