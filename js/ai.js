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
    const last = messages[messages.length - 1]?.text || "";
    await sleep(420 + Math.random() * 300);
    const answer = mockAnswer(last, mode, context);
    await typeOut(answer, onToken);
    return answer;
  }

  /* Quiz üretimi: demo modunda soru havuzundan karıştırarak seçer */
  async function generateQuiz({ course, count }) {
    await sleep(900);
    const pool = [...(DB.bank[course] || DB.bank.matematik)];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(count, pool.length));
  }

  function setProvider(id) {
    config.provider = id;
    try { localStorage.setItem("derslik.provider", id); } catch (_) {}
  }

  window.AI = { config, chat, generateQuiz, setProvider, isLive: () => config.provider !== "mock" && !!config.proxyUrl };
})();
