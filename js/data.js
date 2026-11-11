/* Mock veri — gerçek bir backend bağlandığında bu dosya API çağrılarıyla değiştirilir. */
window.DB = {
  student: {
    name: "Elif",
    fullName: "Elif Kaya",
    grade: "11. sınıf",
    track: "Sayısal",
    streak: 12,
    goalMinutes: 90,
    week: [
      { d: "Pzt", m: 74 },
      { d: "Sal", m: 102 },
      { d: "Çar", m: 48 },
      { d: "Per", m: 95 },
      { d: "Cum", m: 61 },
      { d: "Cmt", m: 128 },
      { d: "Paz", m: 37 },
    ],
  },

  courses: [
    {
      id: "matematik",
      name: "Matematik",
      code: "MAT-11",
      hue: "#2F6B5A",
      progress: 0.64,
      teacher: "Murat Demir",
      art: "curve",
      topics: [
        { id: "limit", name: "Limit ve süreklilik", done: true, mins: 40 },
        { id: "turev", name: "Türev: tanım ve kurallar", done: false, mins: 55, current: true },
        { id: "turev-uyg", name: "Türevin uygulamaları", done: false, mins: 60 },
        { id: "integral", name: "Belirsiz integral", done: false, mins: 50 },
      ],
    },
    {
      id: "fizik",
      name: "Fizik",
      code: "FİZ-11",
      hue: "#3B5B8C",
      progress: 0.42,
      teacher: "Selin Aydın",
      art: "wave",
      topics: [
        { id: "vektor", name: "Vektörler", done: true, mins: 30 },
        { id: "elektrik", name: "Elektriksel kuvvet ve alan", done: false, mins: 45, current: true },
        { id: "potansiyel", name: "Elektriksel potansiyel", done: false, mins: 45 },
        { id: "kondansator", name: "Sığaçlar", done: false, mins: 35 },
      ],
    },
    {
      id: "kimya",
      name: "Kimya",
      code: "KİM-11",
      hue: "#9A5B2E",
      progress: 0.55,
      teacher: "Can Yıldız",
      art: "molecule",
      topics: [
        { id: "mol", name: "Mol kavramı", done: true, mins: 35 },
        { id: "gazlar", name: "Gazlar", done: true, mins: 50 },
        { id: "cozeltiler", name: "Sıvı çözeltiler", done: false, mins: 45, current: true },
        { id: "hiz", name: "Tepkime hızları", done: false, mins: 40 },
      ],
    },
    {
      id: "biyoloji",
      name: "Biyoloji",
      code: "BİY-11",
      hue: "#5F6E2A",
      progress: 0.31,
      teacher: "Deniz Koç",
      art: "cell",
      topics: [
        { id: "sinir", name: "Sinir sistemi", done: true, mins: 50 },
        { id: "endokrin", name: "Endokrin sistem", done: false, mins: 40, current: true },
        { id: "duyu", name: "Duyu organları", done: false, mins: 45 },
      ],
    },
    {
      id: "edebiyat",
      name: "Türk Dili ve Edebiyatı",
      short: "Edebiyat",
      code: "TDE-11",
      hue: "#8A3F4A",
      progress: 0.48,
      teacher: "Ayşe Polat",
      art: "lines",
      topics: [
        { id: "tanzimat", name: "Tanzimat edebiyatı", done: true, mins: 40 },
        { id: "servet", name: "Servet-i Fünun", done: false, mins: 40, current: true },
        { id: "milli", name: "Millî edebiyat", done: false, mins: 45 },
      ],
    },
    {
      id: "tarih",
      name: "Tarih",
      code: "TAR-11",
      hue: "#5A4E7A",
      progress: 0.22,
      teacher: "Oğuz Şahin",
      art: "timeline",
      topics: [
        { id: "degisim", name: "Değişen dünya dengeleri", done: true, mins: 35 },
        { id: "sanayi", name: "Sanayi devrimi", done: false, mins: 40, current: true },
        { id: "ulus", name: "Uluslararası ilişkiler", done: false, mins: 40 },
      ],
    },
  ],

  /* Konu notları: yalnızca demoda açılan konular için dolu */
  notes: {
    turev: {
      title: "Türev: tanım ve kurallar",
      lead: "Bir fonksiyonun bir noktadaki türevi, o noktadaki anlık değişim hızıdır; grafikte teğet doğrusunun eğimine karşılık gelir.",
      blocks: [
        { h: "Tanım", f: "f′(a) = lim h→0 [ f(a+h) − f(a) ] / h", p: "Limit varsa fonksiyon a noktasında türevlenebilirdir. Türevlenebilen her fonksiyon o noktada süreklidir; tersi her zaman doğru değildir (örnek: |x|, x = 0)." },
        { h: "Temel kurallar", list: ["(c)′ = 0", "(xⁿ)′ = n·xⁿ⁻¹", "(f ± g)′ = f′ ± g′", "(f·g)′ = f′g + fg′", "(f / g)′ = (f′g − fg′) / g²"] },
        { h: "Zincir kuralı", f: "(f ∘ g)′(x) = f′(g(x)) · g′(x)", p: "İç içe fonksiyonlarda önce dıştakinin türevi alınır, içteki aynen yazılır, sonra içtekinin türeviyle çarpılır." },
      ],
    },
    elektrik: {
      title: "Elektriksel kuvvet ve alan",
      lead: "Yüklü cisimler birbirine uzaklığın karesiyle ters orantılı bir kuvvet uygular.",
      blocks: [
        { h: "Coulomb yasası", f: "F = k · q₁q₂ / d²", p: "k ≈ 9·10⁹ N·m²/C². Aynı işaretli yükler iter, zıt işaretliler çeker." },
        { h: "Elektrik alan", f: "E = F / q = k · Q / d²", p: "Alan çizgileri pozitif yükten çıkar, negatif yüke girer." },
      ],
    },
  },

  weak: [
    { course: "matematik", topic: "Zincir kuralı", score: 0.48 },
    { course: "fizik", topic: "Elektrik alan çizgileri", score: 0.55 },
    { course: "kimya", topic: "Derişim birimleri", score: 0.61 },
  ],

  agenda: [
    { when: "Bugün 17:30", title: "Türev — 10 soruluk tekrar", course: "matematik", kind: "Quiz" },
    { when: "Yarın", title: "Sığaçlar ödev teslimi", course: "fizik", kind: "Ödev" },
    { when: "Cuma", title: "Servet-i Fünun okuma notu", course: "edebiyat", kind: "Okuma" },
  ],

  dailyQuestion: {
    course: "matematik",
    q: "f(x) = (3x − 1)⁴ ise f′(1) kaçtır?",
    options: ["32", "48", "96", "128"],
    answer: 2,
    why: "Zincir kuralı: f′(x) = 4(3x − 1)³ · 3 = 12(3x − 1)³. x = 1 için 12 · 2³ = 96.",
  },

  /* Quiz soru havuzu — "üretme" isteğinde buradan karıştırılarak seçilir */
  bank: {
    matematik: [
      { q: "f(x) = x³ − 2x ise f′(2) kaçtır?", o: ["8", "10", "12", "14"], a: 1, why: "f′(x) = 3x² − 2 → 3·4 − 2 = 10." },
      { q: "f(x) = sin(2x) için f′(0) kaçtır?", o: ["0", "1", "2", "−2"], a: 2, why: "f′(x) = 2cos(2x) → 2·cos0 = 2." },
      { q: "f(x) = √x fonksiyonunun x = 4'teki türevi kaçtır?", o: ["1/2", "1/4", "2", "1/8"], a: 1, why: "f′(x) = 1/(2√x) → 1/(2·2) = 1/4." },
      { q: "f(x) = x² · eˣ ise f′(0) kaçtır?", o: ["0", "1", "2", "e"], a: 0, why: "Çarpım kuralı: 2x·eˣ + x²·eˣ; x = 0 için 0." },
      { q: "y = (x² + 1)³ ise dy/dx, x = 1 için kaçtır?", o: ["12", "24", "36", "48"], a: 1, why: "3(x²+1)²·2x → 3·4·2 = 24." },
      { q: "f(x) = ln(x²) için f′(e) kaçtır?", o: ["1/e", "2/e", "2e", "e²"], a: 1, why: "ln(x²) = 2ln x → f′ = 2/x → 2/e." },
    ],
    fizik: [
      { q: "Yükler sabitken aradaki uzaklık 2 katına çıkarsa Coulomb kuvveti nasıl değişir?", o: ["2 katına çıkar", "Yarıya iner", "4'te 1'ine iner", "Değişmez"], a: 2, why: "F ∝ 1/d²; d → 2d iken F → F/4." },
      { q: "Elektrik alanın SI birimi aşağıdakilerden hangisidir?", o: ["N/C", "C/N", "J/C", "N·m"], a: 0, why: "E = F/q olduğundan birimi N/C'dir (V/m ile eşdeğer)." },
      { q: "Pozitif bir noktasal yükün alan çizgileri için hangisi doğrudur?", o: ["Yüke doğru yönelir", "Yükten dışarı doğru yönelir", "Yükün etrafında döner", "Alan oluşmaz"], a: 1, why: "Alan çizgileri pozitif yükten çıkar." },
      { q: "q yüklü cisim E şiddetli alanda F kuvvetini hissediyor. Yük 3q olursa kuvvet?", o: ["F/3", "F", "3F", "9F"], a: 2, why: "F = qE; yük 3 katına çıkınca kuvvet de 3 katına çıkar." },
    ],
    kimya: [
      { q: "0,5 mol NaOH 250 mL çözeltide çözülürse derişim kaç M olur?", o: ["0,5", "1", "2", "4"], a: 2, why: "M = n / V = 0,5 / 0,25 = 2 M." },
      { q: "Hangisi koligatif bir özellik değildir?", o: ["Donma noktası alçalması", "Kaynama noktası yükselmesi", "Ozmotik basınç", "Renk"], a: 3, why: "Koligatif özellikler tanecik sayısına bağlıdır; renk değildir." },
      { q: "Kütlece %20'lik 200 g şekerli suda kaç g şeker vardır?", o: ["20", "40", "80", "160"], a: 1, why: "200 · 0,20 = 40 g." },
    ],
  },

  providers: [
    { id: "mock", name: "Demo (çevrimdışı)", note: "Yerel örnek yanıtlar" },
    { id: "gemini", name: "Gemini", note: "Google AI Studio anahtarı gerekir" },
    { id: "openai", name: "ChatGPT", note: "OpenAI API anahtarı gerekir" },
    { id: "claude", name: "Claude", note: "Anthropic API anahtarı gerekir" },
  ],
};
