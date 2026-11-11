/* Kartlar — basitleştirilmiş SM-2 aralıklı tekrar, ilerleme localStorage'da */
(function () {
  const { $, $$, esc, course, icon, Router, toast, hue, tag, store } = UI;

  const RATES = [
    { k: 0, label: "Tekrar", key: "1" },
    { k: 1, label: "Zor", key: "2" },
    { k: 2, label: "İyi", key: "3" },
    { k: 3, label: "Kolay", key: "4" },
  ];
  /* Demo için birkaç kart "öğrenilmiş" başlar */
  const far = Date.now() + 3 * 864e5;
  const SEED = Object.fromEntries(["turev:0", "turev:1", "turev:4", "elektrik:0", "elektrik:4", "cozelti:0", "servet:1", "servet:2"].map((k) => [k, { ease: 2.5, ivl: 4, due: far }]));
  const state = () => store.get("cards", SEED);
  const extra = () => store.get("extraCards", {});
  const cardsOf = (d) => [...d.cards, ...(extra()[d.id] || [])];

  function interval(prev, r) {
    const ease = prev?.ease ?? 2.5, ivl = prev?.ivl ?? 0;
    if (r === 0) return { ease: Math.max(1.3, ease - 0.2), ivl: 0, label: "1 dk" };
    const nextEase = Math.max(1.3, ease + [-0.2, -0.15, 0, 0.15][r]);
    const n = ivl === 0 ? [1, 1, 1, 4][r] : Math.round(ivl * (r === 1 ? 1.2 : r === 2 ? nextEase : nextEase * 1.3));
    return { ease: nextEase, ivl: n, label: n + " gün" };
  }
  const dueCount = (d) => cardsOf(d).filter((_, i) => { const s = state()[d.id + ":" + i]; return !s || s.due <= Date.now(); }).length;

  UI.dueCards = () => DB.decks.reduce((a, d) => a + dueCount(d), 0);

  function list(view) {
    const total = DB.decks.reduce((a, d) => a + dueCount(d), 0);
    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono">aralıklı tekrar</p><h1>Kartlar</h1></div>
        <a class="btn" href="#/kartlar/${DB.decks[0].id}">${icon("play")} ${total} kartı tekrar et</a>
      </header>
      <section class="grid decks">
        ${DB.decks.map((d) => {
          const c = course(d.course), n = cardsOf(d).length, due = dueCount(d);
          return `
          <a class="glass card deck" href="#/kartlar/${d.id}" style="--c:${hue(c)}">
            <div class="deck-vis"><span></span><span></span><span class="front">${esc(d.cards[0].f)}</span></div>
            <div class="card-top">${tag(c)}<span class="mono muted">${n} kart</span></div>
            <h2>${d.name}</h2>
            <div class="deck-meta">
              <span><b>${due}</b> bugün</span>
              <span class="bar"><i style="width:${Math.round(((n - due) / n) * 100)}%"></i></span>
              <span class="mono muted">${n - due} öğrenildi</span>
            </div>
          </a>`;
        }).join("")}
        <button class="card deck new" id="newDeck">
          <span class="drop-ic">${icon("spark")}</span>
          <b>Nottan deste oluştur</b>
          <span class="muted small">Bir ders notunu ya da video dökümünü seç, kartları yapay zekâ hazırlasın.</span>
        </button>
      </section>`;
    $("#newDeck").onclick = () => toast("Bir konu açıp “Karta dönüştür” ile deste oluşturabilirsin.", { href: "#/ders/matematik?v=1", label: "Türev videosu" });
  }

  function study(view, params, [id]) {
    const d = DB.decks.find((x) => x.id === id);
    if (!d) return list(view);
    const c = course(d.course);
    let cards = cardsOf(d).map((card, i) => ({ ...card, i }));
    let queue = cards.filter((x) => { const s = state()[d.id + ":" + x.i]; return !s || s.due <= Date.now(); });
    if (!queue.length) queue = cards.slice();
    let total = queue.length;
    let done = 0, flipped = false;
    const tally = [0, 0, 0, 0];

    view.innerHTML = `
      <header class="head">
        <div><p class="eyebrow mono"><a href="#/kartlar">kartlar</a> / ${c.short || c.name}</p><h1>${d.name}</h1></div>
        <button class="btn ghost" id="genCards">${icon("spark")} Yapay zekâ ile kart ekle</button>
      </header>
      <section class="study" style="--c:${hue(c)}">
        <div class="study-top"><span class="mono muted" id="sCount"></span><div class="steps" id="sSteps"></div></div>
        <div class="flip-wrap" id="flipWrap"></div>
        <div class="rate" id="rate"></div>
        <p class="muted small center kb">Kartı çevirmek için <kbd class="mono">boşluk</kbd>, puanlamak için <kbd class="mono">1–4</kbd></p>
      </section>`;

    const draw = () => {
      $("#sCount").textContent = `${Math.min(done + 1, total)} / ${total}`;
      $("#sSteps").innerHTML = Array.from({ length: total }, (_, k) => `<i class="${k < done ? "ok" : k === done ? "cur" : ""}"></i>`).join("");
      if (!queue.length) return finish();
      const card = queue[0];
      const prev = state()[d.id + ":" + card.i];
      $("#flipWrap").innerHTML = `
        <button class="flip ${flipped ? "on" : ""}" id="flip" aria-label="Kartı çevir">
          <span class="face front"><small class="mono">soru</small><b>${esc(card.f)}</b><em class="mono muted">çevirmek için dokun</em></span>
          <span class="face back"><small class="mono">cevap</small><b>${esc(card.b)}</b></span>
        </button>`;
      $("#flip").onclick = () => { flipped = !flipped; $("#flip").classList.toggle("on", flipped); drawRate(); };
      const drawRate = () => {
        $("#rate").innerHTML = flipped ? RATES.map((r) => `<button data-r="${r.k}" class="r${r.k}"><b>${r.label}</b><small class="mono">${interval(prev, r.k).label}</small></button>`).join("") : `<button class="wide" id="show">Cevabı göster</button>`;
        $$("#rate [data-r]").forEach((b) => (b.onclick = () => rate(+b.dataset.r)));
        $("#show") && ($("#show").onclick = () => $("#flip").click());
      };
      drawRate();
    };

    const rate = (r) => {
      const card = queue.shift();
      const key = d.id + ":" + card.i;
      const all = state();
      const nx = interval(all[key], r);
      all[key] = { ease: nx.ease, ivl: nx.ivl, due: Date.now() + (nx.ivl === 0 ? 60e3 : nx.ivl * 864e5) };
      store.set("cards", all);
      tally[r]++;
      if (r === 0) queue.push(card); else done++;
      flipped = false;
      draw();
    };

    const finish = () => {
      $("#rate").innerHTML = "";
      $(".kb").hidden = true;
      $("#flipWrap").innerHTML = `
        <div class="glass card study-done">
          <p class="mono muted">oturum bitti</p>
          <h2>${total} kart tekrar edildi.</h2>
          <div class="tally">${RATES.map((r) => `<div class="r${r.k}"><b>${tally[r.k]}</b><span>${r.label}</span></div>`).join("")}</div>
          <p class="muted small">Bir sonraki tekrar en erken yarın. “Tekrar” dediğin kartlar listenin sonuna eklendi ve bitirildi.</p>
          <div class="row"><a class="btn" href="#/kartlar">Destelere dön</a><a class="btn ghost" href="#/quiz?c=${c.id}">Quiz ile pekiştir</a></div>
        </div>`;
      UI.toast(`+${total * 5} XP · ${d.name}`);
    };

    const onKey = (e) => {
      if (e.target.matches("input,textarea")) return;
      if (e.code === "Space" && $("#flip")) { e.preventDefault(); $("#flip").click(); }
      if (flipped && ["1", "2", "3", "4"].includes(e.key)) rate(+e.key - 1);
    };
    document.addEventListener("keydown", onKey);
    Router.onLeave(() => document.removeEventListener("keydown", onKey));

    $("#genCards").onclick = async (e) => {
      const b = e.currentTarget;
      b.disabled = true;
      b.innerHTML = `<span class="typing"><i></i><i></i><i></i></span> Not okunuyor…`;
      const fresh = await AI.generateCards({ course: d.course });
      const ex = extra();
      ex[d.id] = [...(ex[d.id] || []), ...fresh];
      store.set("extraCards", ex);
      const base = cards.length;
      fresh.forEach((f, k) => queue.push({ ...f, i: base + k }));
      cards = cardsOf(d).map((card, i) => ({ ...card, i }));
      b.disabled = false;
      b.innerHTML = `${icon("spark")} Yapay zekâ ile kart ekle`;
      toast(`${fresh.length} yeni kart eklendi ve sıraya alındı.`);
      total += fresh.length;
      if (queue.length === fresh.length) { $(".kb").hidden = false; }
      draw();
    };
    draw();
  }

  Router.add("kartlar", (v, p, parts) => (parts[0] ? study(v, p, parts) : list(v)));
})();
