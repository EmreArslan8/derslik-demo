/*
 * Sağlayıcıdan bağımsız yapay zekâ katmanı.
 *
 * Arayüz her zaman AI.chat({ messages, mode, context, onToken }) çağırır.
 * Gerçek sağlayıcılar (Gemini, ChatGPT, Claude) için istekler tarayıcıdan
 * doğrudan değil, API anahtarlarını saklayan küçük bir sunucu üzerinden
 * (AI.config.proxyUrl) gönderilmelidir. proxyUrl boşsa demo yanıtları kullanılır.
 */
(function () {
  const config = {
    provider: localStorage.getItem("derslik.provider") || "mock",
    proxyUrl: "", // örn. "/api/ai" — bkz. README
  };

  const MODES = {
    acikla: "Konuyu adım adım, lise seviyesinde, kısa örneklerle açıkla.",
    sokratik: "Cevabı doğrudan verme; öğrenciyi sorularla yönlendir.",
    ozet: "Konuyu en fazla 5 maddede, sınav odaklı özetle.",
  };

  function systemPrompt(mode, context) {
    return [
      "Sen Derslik adlı platformda Türkçe konuşan bir ders asistanısın.",
      MODES[mode] || MODES.acikla,
      context ? `Öğrencinin çalıştığı konu: ${context}.` : "",
      "Emin olmadığın bilgiyi uydurma; gerekirse öğretmenine sormasını öner.",
    ].join(" ");
  }

  /* --- Gerçek sağlayıcılar için istek gövdeleri (proxy bunları ilgili API'ye iletir) --- */
  const adapters = {
    gemini: (sys, msgs) => ({
      systemInstruction: { parts: [{ text: sys }] },
      contents: msgs.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] })),
    }),
    openai: (sys, msgs) => ({
      messages: [{ role: "system", content: sys }, ...msgs.map((m) => ({ role: m.role, content: m.text }))],
    }),
    claude: (sys, msgs) => ({
      system: sys,
      messages: msgs.map((m) => ({ role: m.role, content: m.text })),
    }),
  };

  async function remote({ messages, mode, context, onToken }) {
    const body = adapters[config.provider](systemPrompt(mode, context), messages);
    const res = await fetch(config.proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: config.provider, body }),
    });
    if (!res.ok) throw new Error("Sağlayıcıya ulaşılamadı (" + res.status + ")");
    const { text } = await res.json();
    await typeOut(text, onToken);
    return text;
  }

  /* --- Demo yanıtları --- */
  const KB = [
    {
      k: ["zincir"],
      acikla: "Zincir kuralı iç içe fonksiyonlar içindir.\n\n1. Dıştaki fonksiyonun türevini al, içi olduğu gibi bırak.\n2. Sonucu içteki fonksiyonun türeviyle çarp.\n\nÖrnek: f(x) = (3x − 1)⁴\nDış: u⁴ → 4u³, iç: 3x − 1 → 3\nf′(x) = 4(3x − 1)³ · 3 = 12(3x − 1)³\n\nSık hata: içtekinin türevini çarpmayı unutmak. Sınavda şıklar genelde tam bu hatayı yakalamak için yazılır.",
      sokratik: "Önce şunu düşünelim: (3x − 1)⁴ ifadesinde \"dış\" fonksiyon hangisi, \"iç\" fonksiyon hangisi?\n\nİkisini ayırabildiğinde, dıştakinin türevini yazmayı dene. Sonra bana yaz, birlikte bakalım.",
      ozet: "• Kullanım: f(g(x)) biçimindeki fonksiyonlar\n• Formül: (f∘g)′ = f′(g(x)) · g′(x)\n• Sıra: dış → iç\n• Sık hata: g′(x) çarpanını unutmak\n• Kontrol: sonucu küçük bir x değeriyle sayısal olarak dene",
    },
    {
      k: ["türev", "turev", "eğim", "teğet"],
      acikla: "Türev, bir fonksiyonun ne kadar hızlı değiştiğini ölçer.\n\nGrafikte düşün: eğrinin üzerinde bir noktaya teğet çiz. O teğetin eğimi, o noktadaki türevdir.\n\nf(x) = x² için:\n• x = 1'de eğim 2\n• x = 3'te eğim 6\nYani f′(x) = 2x. Eğri sağa gittikçe dikleşiyor.\n\nİstersen kuvvet kuralıyla 3 kısa örnek çözelim.",
      sokratik: "Bir arabanın 2. saniyede nerede olduğunu biliyorsun. Peki tam o anda ne kadar hızlı gittiğini nasıl bulursun?\n\nİpucu: 2. saniye ile 2,001. saniye arasında ne olduğuna bakmak işe yarar mı?",
      ozet: "• Türev = anlık değişim hızı = teğetin eğimi\n• Tanım: f′(a) = lim h→0 [f(a+h) − f(a)] / h\n• Kuvvet: (xⁿ)′ = n·xⁿ⁻¹\n• Çarpım: (fg)′ = f′g + fg′\n• Bölüm: (f/g)′ = (f′g − fg′) / g²",
    },
    {
      k: ["coulomb", "elektrik", "yük", "alan"],
      acikla: "Coulomb yasası iki noktasal yük arasındaki kuvveti verir:\n\nF = k · q₁ · q₂ / d²\n\nÖnemli olan d²: uzaklık 2 katına çıkarsa kuvvet 4'te 1'ine düşer, 3 katına çıkarsa 9'da 1'ine.\n\nElektrik alan ise \"bu noktaya 1 C yük koysam ne kadar kuvvet hisseder?\" sorusunun cevabıdır: E = k · Q / d².",
      sokratik: "İki yük arasındaki uzaklığı yarıya indirdiğini düşün. Formülde paydada d² var. Sence kuvvet 2 katına mı çıkar, yoksa daha fazlasına mı?",
      ozet: "• F = k·q₁q₂/d², k ≈ 9·10⁹\n• Aynı işaret iter, zıt işaret çeker\n• E = F/q = kQ/d² (birim N/C)\n• Alan çizgileri + yükten çıkar, − yüke girer\n• Uzaklık ×2 → kuvvet ÷4",
    },
    {
      k: ["mol", "derişim", "molarite", "çözelti"],
      acikla: "Molarite (M), 1 litre çözeltide kaç mol madde çözündüğünü söyler:\n\nM = n / V(L)\n\nÖrnek: 0,5 mol NaOH, 250 mL çözeltide.\n250 mL = 0,25 L → M = 0,5 / 0,25 = 2 M\n\nDikkat: hacim çözücünün değil, çözeltinin hacmidir.",
      sokratik: "Elinde 0,5 mol madde ve 250 mL çözelti var. Formüle koymadan önce hacmi hangi birime çevirmen gerekiyor?",
      ozet: "• M = n / V (L)\n• Kütlece % = (çözünen / çözelti) · 100\n• Seyreltme: M₁V₁ = M₂V₂\n• Koligatif özellikler tanecik sayısına bağlı",
    },
  ];

  const FALLBACK = {
    acikla: (q, ctx) => `Bu soruyu ${ctx ? `"${ctx}" konusuyla` : "konuyla"} ilişkilendirerek açıklayayım.\n\n1. Önce kavramın tanımını netleştirelim.\n2. Sonra basit bir örnek üzerinden ilerleyelim.\n3. En sonda sınavda nasıl karşına çıkabileceğine bakalım.\n\nDemo modundayım, bu yüzden yanıtlarım sınırlı. Türev, zincir kuralı, Coulomb yasası veya molarite hakkında sorarsan örnek bir anlatım görebilirsin.`,
    sokratik: () => "Güzel soru. Cevaplamadan önce: bu konuda şu an bildiğin en son şey ne? Oradan başlayıp bir sonraki adımı birlikte bulalım.",
    ozet: (q, ctx) => `• Konu: ${ctx || "genel"}\n• Demo modunda ayrıntılı özet yalnızca örnek konular için hazır\n• Gerçek bir sağlayıcı bağlandığında bu alan model tarafından doldurulur`,
  };

  function mockAnswer(text, mode, context) {
    const t = (text + " " + (context || "")).toLocaleLowerCase("tr");
    const hit = KB.find((e) => e.k.some((k) => t.includes(k)));
    if (hit) return hit[mode] || hit.acikla;
    return FALLBACK[mode] ? FALLBACK[mode](text, context) : FALLBACK.acikla(text, context);
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  async function typeOut(text, onToken) {
    const parts = text.split(/(\s+)/);
    let out = "";
    for (const p of parts) {
      out += p;
      onToken && onToken(out);
      if (p.trim()) await sleep(14 + Math.random() * 22);
    }
  }

  async function chat({ messages, mode = "acikla", context, onToken }) {
    if (config.provider !== "mock" && config.proxyUrl) return remote({ messages, mode, context, onToken });
    const lastMsg = messages[messages.length - 1] || {};
    const last = lastMsg.text || "";
    if (lastMsg.image) {
      await sleep(900);
      const a = "Görselde el yazısıyla bir türev sorusu görüyorum: f(x) = (x² + 3x)⁴ için f′(1) isteniyor.\n\n1. Dış fonksiyon u⁴, iç fonksiyon x² + 3x.\n2. f′(x) = 4(x² + 3x)³ · (2x + 3)\n3. x = 1 → 4 · 64 · 5 = 1280\n\nAdım adım ve şıklarla görmek istersen **Soru Çöz** ekranını kullanabilirsin.";
      await typeOut(a, onToken);
      return a;
    }
    await sleep(420 + Math.random() * 300);
    const answer = mockAnswer(last, mode, context);
    await typeOut(answer, onToken);
    return answer;
  }

  /* Quiz üretimi: demo modunda soru havuzundan karıştırarak seçer */
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  async function generateQuiz({ course, count }) {
    await sleep(900);
    return shuffle(DB.bank[course] || DB.bank.matematik).slice(0, count);
  }

  /* Fotoğraftan soru çözme: demo modunda örnek soruyu "tanır" */
  async function solve({ sampleId }) {
    await sleep(1600);
    return DB.solveSamples.find((s) => s.id === sampleId) || DB.solveSamples[0];
  }

  /* Konu notundan kart üretimi */
  const GEN_CARDS = {
    matematik: [
      { f: "(cos x)′ = ?", b: "−sin x" },
      { f: "(tan x)′ = ?", b: "1 + tan²x  (= 1 / cos²x)" },
      { f: "|x| fonksiyonu x = 0'da türevlenebilir mi?", b: "Hayır — sürekli ama sivri nokta var" },
    ],
    fizik: [
      { f: "Yükler arası uzaklık yarıya inerse kuvvet?", b: "4 katına çıkar" },
      { f: "Alan çizgileri birbirini keser mi?", b: "Hayır, hiçbir zaman" },
    ],
    kimya: [
      { f: "Seyreltmede değişmeyen nicelik", b: "Çözünenin mol sayısı" },
      { f: "1 L = ? mL", b: "1000 mL" },
    ],
    edebiyat: [
      { f: "Servet-i Fünun'un dağılma nedeni", b: "1901'de dergide çıkan bir çeviri yazı nedeniyle kapatılması" },
      { f: "Aşk-ı Memnu'nun yazarı", b: "Halit Ziya Uşaklıgil" },
    ],
  };
  async function generateCards({ course }) {
    await sleep(1300);
    return GEN_CARDS[course] || GEN_CARDS.matematik;
  }

  /* Haftalık plan üretimi: zayıf konular + günlük süreye göre */
  async function generatePlan({ hours, focus, weekendOff }) {
    await sleep(1400);
    const pick = focus.length ? focus : ["matematik", "fizik", "kimya"];
    const tasks = {
      matematik: ["Zincir kuralı — tekrar", "Türev quiz (10 soru)", "Türevin uygulamaları — video", "Deneme yanlış analizi", "İntegral giriş"],
      fizik: ["Elektrik alan çizgileri", "Coulomb — 20 soru", "Potansiyel — video", "Sığaçlar soru çözümü"],
      kimya: ["Seyreltme problemleri", "Derişim birimleri kartları", "Tepkime hızları — video"],
      biyoloji: ["Endokrin sistem — not", "Dolaşım sistemi — video", "Hormon kartları"],
      edebiyat: ["Servet-i Fünun kartları", "Millî edebiyat okuma"],
      tarih: ["Sanayi devrimi — video", "Uluslararası ilişkiler — not"],
    };
    const perDay = Math.max(1, Math.round(hours * 60 / 45));
    const out = [];
    const used = {};
    for (let d = 0; d < 7; d++) {
      if (weekendOff && d === 6) continue;
      if (d === 5) { out.push({ day: 5, start: "10:00", mins: 120, course: "matematik", title: "TYT deneme sınavı", done: false, exam: true }); }
      let t = d >= 5 ? 14 * 60 : 16 * 60 + 30;
      const n = d === 5 ? Math.max(1, perDay - 2) : perDay;
      for (let i = 0; i < n; i++) {
        const c = pick[(d + i) % pick.length];
        const list = tasks[c];
        const k = (used[c] = (used[c] ?? -1) + 1) % list.length;
        const mins = [40, 45, 50, 30][(d + i) % 4];
        out.push({ day: d, start: String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"), mins, course: c, title: list[k], done: false });
        t += mins + 10;
      }
    }
    return out;
  }

  function setProvider(id) {
    config.provider = id;
    try { localStorage.setItem("derslik.provider", id); } catch (_) {}
  }

  window.AI = { config, chat, generateQuiz, generateCards, generatePlan, solve, setProvider, isLive: () => config.provider !== "mock" && !!config.proxyUrl };
})();
