(function () {
  const { $, $$, course, icon, Router, hue, store, toast } = UI;
  const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

  function render(view) {
    let plan = store.get("plan", DB.plan);
    const todayIdx = (new Date().getDay() + 6) % 7;
    let mDay = todayIdx;
    const monday = new Date(); monday.setDate(monday.getDate() - todayIdx);
    const dateOf = (i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return d.getDate(); };
    const sayisal = ["matematik", "fizik", "kimya", "biyoloji"];

    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">${dateOf(0)}–${dateOf(6)} ${new Intl.DateTimeFormat("tr-TR", { month: "long" }).format(monday)} · YKS'ye <b>217</b> gün</p><h1>Haftalık plan</h1></div>
        <button class="btn ghost" id="genToggle">${icon("spark")} Yapay zekâ ile yeniden planla</button>
      </header>

      <form class="glass card gen" id="gen" hidden>
        <div class="gen-grid">
          <fieldset>
            <legend class="mono muted">Günlük süre <output id="hOut">2</output> saat</legend>
            <input type="range" min="1" max="5" step="0.5" value="2" name="h" id="hRange" />
          </fieldset>
          <fieldset>
            <legend class="mono muted">Öncelikli dersler</legend>
            <div class="pick">${DB.courses.map((c) => `<label><input type="checkbox" name="f" value="${c.id}" ${["matematik", "fizik"].includes(c.id) ? "checked" : ""}/><span>${c.short || c.name}</span></label>`).join("")}</div>
          </fieldset>
          <div class="gen-side">
            <label class="switch"><input type="checkbox" name="w" checked /><span></span>Pazar dinlenme günü</label>
            <button class="btn">${icon("spark")} Planı oluştur</button>
          </div>
        </div>
        <p class="muted small">Plan; zayıf konularını, deneme sonuçlarını ve cumartesi deneme sınavını hesaba katar.</p>
      </form>

      <div class="plan-sum" id="planSum"></div>
      <div class="day-tabs" id="dayTabs"></div>
      <section class="week-grid" id="weekGrid"></section>`;

    const draw = () => {
      const done = plan.filter((p) => p.done).length;
      const mins = plan.reduce((a, p) => a + p.mins, 0);
      const byCourse = {};
      plan.forEach((p) => (byCourse[p.course] = (byCourse[p.course] || 0) + p.mins));
      const maxC = Math.max(...Object.values(byCourse));
      $("#planSum").innerHTML = `
        <div class="glass card kpi"><span class="mono muted">tamamlanan</span><b>${done}<small>/${plan.length}</small></b><span class="bar"><i style="width:${(done / plan.length) * 100}%"></i></span></div>
        <div class="glass card kpi"><span class="mono muted">planlanan süre</span><b>${Math.floor(mins / 60)}<small> sa </small>${mins % 60}<small> dk</small></b><span class="muted small">günde ort. ${Math.round(mins / 7)} dk</span></div>
        <div class="glass card dist">
          <span class="mono muted">ders dağılımı</span>
          <ul>${Object.entries(byCourse).sort((a, b) => b[1] - a[1]).map(([id, m]) => { const c = course(id); return `<li><span>${c.short || c.name}</span><span class="hbar"><i style="width:${(m / maxC) * 100}%;background:${hue(c)}"></i></span><small class="mono">${m} dk</small></li>`; }).join("")}</ul>
        </div>`;
      $("#dayTabs").innerHTML = DAYS.map((d, i) => `<button data-d="${i}" class="${i === mDay ? "on" : ""} ${i === todayIdx ? "today" : ""}"><small class="mono">${d.slice(0, 3)}</small><b>${dateOf(i)}</b></button>`).join("");
      $("#weekGrid").innerHTML = DAYS.map((d, i) => {
        const items = plan.map((p, k) => ({ ...p, k })).filter((p) => p.day === i).sort((a, b) => a.start.localeCompare(b.start));
        return `
        <div class="day ${i === todayIdx ? "today" : ""} ${i === mDay ? "m-on" : ""}">
          <div class="day-h"><span>${d}</span><b class="mono">${dateOf(i)}</b></div>
          ${items.length ? items.map((p) => { const c = course(p.course); return `
            <button class="blk ${p.done ? "done" : ""} ${p.exam ? "exam" : ""}" data-k="${p.k}" style="--c:${hue(c)}">
              <span class="mono t">${p.start} · ${p.mins} dk</span>
              <b>${p.title}</b>
              <span class="small c">${c.short || c.name}</span>
              <span class="chk">${icon("check")}</span>
            </button>`; }).join("") : `<p class="rest muted small">Dinlenme</p>`}
        </div>`;
      }).join("");
      $$("#weekGrid .blk").forEach((b) => (b.onclick = () => {
        const p = plan[+b.dataset.k];
        p.done = !p.done;
        store.set("plan", plan);
        if (p.done) toast(`“${p.title}” tamamlandı · +10 XP`);
        draw();
      }));
      $$("#dayTabs button").forEach((b) => (b.onclick = () => { mDay = +b.dataset.d; draw(); }));
    };

    $("#genToggle").onclick = () => ($("#gen").hidden = !$("#gen").hidden);
    $("#hRange").oninput = (e) => ($("#hOut").value = e.target.value);
    $("#gen").onsubmit = async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const btn = $("button", e.target);
      btn.disabled = true;
      $("#weekGrid").classList.add("loading");
      plan = await AI.generatePlan({ hours: +f.get("h"), focus: f.getAll("f"), weekendOff: !!f.get("w") });
      store.set("plan", plan);
      btn.disabled = false;
      $("#weekGrid").classList.remove("loading");
      $("#gen").hidden = true;
      draw();
      toast(`${plan.length} oturumluk yeni plan hazır.`);
    };
    draw();
  }

  Router.add("plan", render);
})();
