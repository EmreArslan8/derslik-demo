(function () {
  const { $, $$, course, icon, Router, hue } = UI;
  const L = DB.examLabels;
  const fmt = (n) => n.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);

  function render(view) {
    let type = "tyt", table = false;

    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">${DB.exams.length} deneme · ${DB.exams[0].date} – ${DB.exams.at(-1).date}</p><h1>Analiz</h1></div>
        <div class="seg" id="type"><button data-t="tyt" class="on">TYT</button><button data-t="ayt">AYT · Sayısal</button></div>
      </header>
      <section class="kpis" id="kpis"></section>
      <section class="grid an-grid">
        <div class="glass card line-card">
          <div class="card-top"><div><h3 id="lineTitle"></h3><p class="muted small">Toplam net · kesikli çizgi hedefin</p></div><button class="ib" id="tbl" title="Tablo görünümü">${icon("table")}</button></div>
          <div class="line-wrap" id="line"></div>
        </div>
        <div class="glass card ai-insight">
          <div class="card-top"><h3>${icon("spark")} Yorum</h3><span class="mono muted">demo</span></div>
          <div id="insight"></div>
        </div>
        <div class="glass card sub-card">
          <div class="card-top"><h3>Ders bazında son deneme</h3><span class="mono muted">net / soru · ▏önceki</span></div>
          <ul class="subbars" id="subbars"></ul>
        </div>
        <div class="glass card heat-card">
          <div class="card-top"><h3>Konu hâkimiyeti</h3><span class="mono muted">son 6 hafta</span></div>
          <div class="heat" id="heat"></div>
          <div class="heat-legend"><span class="mono muted">%0</span><span class="grad"></span><span class="mono muted">%100</span></div>
        </div>
      </section>`;

    const draw = () => {
      const ex = DB.exams;
      const totals = ex.map((e) => sum(e[type]));
      const last = ex.at(-1)[type], prev = ex.at(-2)[type];
      const max = DB.examMax[type];
      const delta = totals.at(-1) - totals.at(-2);
      const gains = Object.keys(last).map((k) => [k, last[k] - ex[0][type][k]]).sort((a, b) => b[1] - a[1]);
      const goal = type === "tyt" ? 100 : 60;

      $("#kpis").innerHTML = `
        <div class="glass card kpi"><span class="mono muted">son ${type.toUpperCase()} net</span><b>${fmt(totals.at(-1))}</b><span class="delta ${delta >= 0 ? "up" : "down"}">${delta >= 0 ? "▲" : "▼"} ${fmt(Math.abs(delta))} önceki denemeye göre</span></div>
        <div class="glass card kpi"><span class="mono muted">ilk denemeden bu yana</span><b>+${fmt(totals.at(-1) - totals[0])}</b><span class="muted small">${ex.length} denemede</span></div>
        <div class="glass card kpi"><span class="mono muted">en çok gelişen</span><b class="kpi-t">${L[gains[0][0]]}</b><span class="delta up">▲ ${fmt(gains[0][1])} net</span></div>
        <div class="glass card kpi"><span class="mono muted">tahmini sıralama</span><b>${type === "tyt" ? "48.200" : "61.500"}</b><span class="muted small">hedef: ${type === "tyt" ? "35.000" : "40.000"}</span></div>`;

      $("#lineTitle").textContent = `${type.toUpperCase()} net gelişimi`;
      table ? drawTable(ex, totals) : drawLine(ex, totals, goal);

      $("#subbars").innerHTML = Object.keys(last).map((k) => `
        <li>
          <span class="lbl">${L[k]}</span>
          <span class="track" title="${L[k]}: ${fmt(last[k])} / ${max[k]}">
            <i style="width:${(last[k] / max[k]) * 100}%"></i>
            <em style="left:${(prev[k] / max[k]) * 100}%"></em>
          </span>
          <span class="mono val">${fmt(last[k])}<small>/${max[k]}</small></span>
          <span class="mono d ${last[k] - prev[k] >= 0 ? "up" : "down"}">${last[k] - prev[k] >= 0 ? "+" : "−"}${fmt(Math.abs(last[k] - prev[k]))}</span>
        </li>`).join("");

      const weakest = Object.keys(last).map((k) => [k, last[k] / max[k]]).sort((a, b) => a[1] - b[1])[0];
      $("#insight").innerHTML = `
        <p>Son üç denemede ${type.toUpperCase()} netin <b>${fmt(totals.at(-1) - totals.at(-4))}</b> arttı; artışın büyük kısmı <b>${L[gains[0][0]]}</b>'ten geliyor.</p>
        <p><b>${L[weakest[0]]}</b> hâlâ en düşük oranlı dersin (%${Math.round(weakest[1] * 100)}). Konu tablosuna göre ${type === "tyt" ? "<b>zincir kuralı</b> ve <b>elektrik alan</b>" : "<b>zincir kuralı</b> ve <b>derişim</b>"} öncelikli.</p>
        <div class="row-l"><a class="mini" href="#/plan">Plana ekle</a><a class="mini" href="#/quiz?c=matematik">Zincir kuralı quizi</a></div>`;
    };

    function drawLine(ex, totals, goal) {
      const box = $("#line");
      const W = Math.max(300, box.clientWidth), H = 240, pl = 34, pr = 16, pt = 16, pb = 30;
      const lo = Math.floor(Math.min(...totals) / 10) * 10 - 10, hi = Math.max(goal, Math.ceil(Math.max(...totals) / 10) * 10) + 5;
      const x = (i) => pl + (i * (W - pl - pr)) / (ex.length - 1);
      const y = (v) => pt + (1 - (v - lo) / (hi - lo)) * (H - pt - pb);
      const ticks = []; for (let v = Math.ceil(lo / 10) * 10; v <= hi; v += 10) ticks.push(v);
      const path = totals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
      const area = path + `L${x(ex.length - 1)},${H - pb}L${x(0)},${H - pb}Z`;
      box.innerHTML = `
        <svg width="${W}" height="${H}" class="line-svg" role="img" aria-label="Deneme net gelişimi">
          <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".18"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
          ${ticks.map((v) => `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" class="grid-l"/><text x="${pl - 8}" y="${y(v) + 4}" class="ax" text-anchor="end">${v}</text>`).join("")}
          <line x1="${pl}" x2="${W - pr}" y1="${y(goal)}" y2="${y(goal)}" class="goal-l"/><text x="${W - pr}" y="${y(goal) - 6}" class="ax" text-anchor="end">hedef ${goal}</text>
          ${ex.map((e, i) => `<text x="${x(i)}" y="${H - 8}" class="ax" text-anchor="middle">${e.date}</text>`).join("")}
          <path d="${area}" fill="url(#ag)"/>
          <path d="${path}" class="ln"/>
          ${totals.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="4" class="pt"/>`).join("")}
          <text x="${x(ex.length - 1) - 8}" y="${y(totals.at(-1)) - 12}" class="lbl-end" text-anchor="end">${fmt(totals.at(-1))}</text>
          <line class="xh" id="xh" y1="${pt}" y2="${H - pb}" x1="0" x2="0" visibility="hidden"/>
          <circle class="pt-h" id="ph" r="6" visibility="hidden"/>
          <rect x="${pl}" y="0" width="${W - pl - pr}" height="${H}" fill="transparent" id="hit"/>
        </svg>
        <div class="tip-box glass" id="tip" hidden></div>`;
      const hit = $("#hit"), tip = $("#tip");
      hit.addEventListener("mousemove", (e) => {
        const r = hit.getBoundingClientRect();
        const i = Math.max(0, Math.min(ex.length - 1, Math.round(((e.clientX - r.left) / r.width) * (ex.length - 1))));
        const xh = $("#xh"), ph = $("#ph");
        xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("visibility", "visible");
        ph.setAttribute("cx", x(i)); ph.setAttribute("cy", y(totals[i])); ph.setAttribute("visibility", "visible");
        const e2 = ex[i][type];
        tip.hidden = false;
        tip.innerHTML = `<b>${ex[i].name}</b> <span class="mono muted">${ex[i].date}</span><div class="tip-total">${fmt(totals[i])} net</div>${Object.keys(e2).map((k) => `<div class="tip-row"><span>${L[k]}</span><span class="mono">${fmt(e2[k])}</span></div>`).join("")}`;
        const left = x(i) + 14 + 170 > W ? x(i) - 14 - 170 : x(i) + 14;
        tip.style.left = left + "px";
        tip.style.top = "8px";
      });
      hit.addEventListener("mouseleave", () => { tip.hidden = true; $("#xh").setAttribute("visibility", "hidden"); $("#ph").setAttribute("visibility", "hidden"); });
    }

    function drawTable(ex, totals) {
      const keys = Object.keys(ex[0][type]);
      $("#line").innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Deneme</th>${keys.map((k) => `<th>${L[k]}</th>`).join("")}<th>Toplam</th></tr></thead>
        <tbody>${ex.map((e, i) => `<tr><td>${e.name} <span class="muted">${e.date}</span></td>${keys.map((k) => `<td class="mono">${fmt(e[type][k])}</td>`).join("")}<td class="mono"><b>${fmt(totals[i])}</b></td></tr>`).join("")}</tbody></table></div>`;
    }

    /* Isı haritası — tek renk (sıralı) */
    const m = DB.mastery;
    $("#heat").innerHTML = `
      <div class="hrow head-r"><span></span>${m.weeks.map((w) => `<span class="mono muted">${w}</span>`).join("")}</div>
      ${m.rows.map((r) => `<div class="hrow"><span class="hl"><i style="background:${hue(course(r.course))}"></i>${r.topic}</span>${r.v.map((v, i) => `<span class="cell" style="--v:${v}" title="${r.topic} · ${m.weeks[i]}: %${Math.round(v * 100)}"><em class="mono">${Math.round(v * 100)}</em></span>`).join("")}</div>`).join("")}`;

    $$("#type button").forEach((b) => (b.onclick = () => { type = b.dataset.t; $$("#type button").forEach((x) => x.classList.toggle("on", x === b)); draw(); }));
    $("#tbl").onclick = () => { table = !table; $("#tbl").classList.toggle("on", table); draw(); };
    const onResize = () => { if (!table) draw(); };
    window.addEventListener("resize", onResize);
    Router.onLeave(() => window.removeEventListener("resize", onResize));
    draw();
  }

  Router.add("analiz", render);
})();
