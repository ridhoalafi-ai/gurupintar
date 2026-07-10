import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY tidak ditemukan di environment. Silakan tambahkan API Key Anda di panel Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper function to call Gemini with exponential backoff and a fallback model in case of 503/429/UNAVAILABLE
async function generateWithRetryAndFallback(
  ai: GoogleGenAI,
  userPrompt: string,
  systemInstruction: string,
  temperature: number = 0.7
): Promise<string> {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    let delay = 1500; // Start with 1.5s delay
    const maxRetries = model === "gemini-3.5-flash" ? 3 : 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Vercel Serverless] Mencoba membuat materi menggunakan model ${model} (Upaya ${attempt}/${maxRetries})...`);
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature,
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          console.log(`[Vercel Serverless] Berhasil membuat materi menggunakan model ${model}!`);
          return text;
        }
        throw new Error("Respons dari model kosong.");
      } catch (error: any) {
        lastError = error;
        console.warn(`[Vercel Serverless] Upaya ${attempt} dengan model ${model} gagal:`, error?.message || error);

        // Check if error is due to high demand / overloaded / rate limit / 503 / 429
        const errorMsg = String(error?.message || "").toLowerCase();
        const errorStatus = String(error?.status || "").toUpperCase();
        const errorCode = error?.code;

        const isRetryable =
          errorStatus === "UNAVAILABLE" ||
          errorStatus === "RESOURCE_EXHAUSTED" ||
          errorCode === 503 ||
          errorCode === 429 ||
          errorMsg.includes("503") ||
          errorMsg.includes("429") ||
          errorMsg.includes("demand") ||
          errorMsg.includes("temporary") ||
          errorMsg.includes("unavailable") ||
          errorMsg.includes("overloaded") ||
          errorMsg.includes("exhausted") ||
          errorMsg.includes("limit");

        if (isRetryable && attempt < maxRetries) {
          console.log(`[Vercel Serverless] Layanan sedang sibuk. Mencoba kembali dalam ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2.2; // Exponential backoff
        } else {
          break;
        }
      }
    }
    console.log(`[Vercel Serverless] Model ${model} gagal memproses permintaan setelah batas percobaan. Mencoba model berikutnya...`);
  }

  const details = lastError?.message || JSON.stringify(lastError);
  throw new Error(
    `Asisten AI kami sedang menerima lonjakan antrean yang sangat tinggi dari Google (Layanan Sedang Sibuk / Error 503). ` +
    `Silakan coba klik tombol lagi dalam beberapa saat, atau coba persingkat topik pencarian Anda.\n\nDetail Teknis: ${details}`
  );
}

export default async function handler(req: any, res: any) {
  // Support CORS if needed, and handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Metode tidak diizinkan. Gunakan POST." });
  }

  try {
    const { subject, classLevel, topic, type } = req.body;

    if (!subject || !classLevel || !topic || !type) {
      return res.status(400).json({
        error: "Parameter tidak lengkap. Harap tentukan mata pelajaran, kelas, topik, dan tipe materi."
      });
    }

    let systemInstruction = "";
    let userPrompt = "";

    switch (type) {
      case "curriculum":
        systemInstruction = "Anda adalah konsultan Kurikulum Merdeka Kemendikbudristek RI untuk jenjang SMP. Anda sangat ahli dalam menganalisis Capaian Pembelajaran (CP), merumuskan Tujuan Pembelajaran (TP), menyusun Alur Tujuan Pembelajaran (ATP), dan mendesain Kriteria Ketercapaian Tujuan Pembelajaran (KKTP). Berikan draf lengkap yang terstruktur dengan rapi menggunakan bahasa Indonesia yang baik, formal, dan mudah dipahami.";
        userPrompt = `Buatkan rancangan kurikulum lengkap berdasarkan Kurikulum Merdeka untuk:\n- Mata Pelajaran: ${subject}\n- Tingkat: ${classLevel}\n- Topik Pembahasan: ${topic}\n\nHarap sertakan komponen berikut secara detail:\n1. Capaian Pembelajaran (CP) terkait\n2. Rumusan Tujuan Pembelajaran (TP)\n3. Alur Tujuan Pembelajaran (ATP) langkah demi langkah\n4. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) beserta rubrik penilaiannya. Format respons menggunakan Markdown yang indah dengan tabel dan daftar terstruktur.`;
        break;
      case "syllabus":
        systemInstruction = "Anda adalah pakar penyusun RPP dan Modul Ajar Kurikulum Merdeka untuk jenjang SMP. Anda ahli menyusun metode pembelajaran yang interaktif, student-centered (berpusat pada murid), serta mengintegrasikan Profil Pelajar Pancasila secara kontekstual.";
        userPrompt = `Buatkan Modul Ajar (RPP) Kurikulum Merdeka yang inovatif, praktis, dan siap pakai untuk:\n- Mata Pelajaran: ${subject}\n- Tingkat: ${classLevel}\n- Topik Pembahasan: ${topic}\n\nHarap sertakan komponen-komponen berikut secara terperinci:\n1. Identitas Modul (Mata Pelajaran, Kelas, Alokasi Waktu)\n2. Kompetensi Awal & Profil Pelajar Pancasila yang berkaitan\n3. Sarana Prasarana & Model Pembelajaran yang digunakan\n4. Komponen Inti: Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik\n5. Kegiatan Pembelajaran (Pendahuluan, Inti dengan sintaks model pembelajaran, Penutup)\n6. Asesmen Formatif/Sumatif & Refleksi Guru dan Peserta Didik. Format respons menggunakan Markdown yang lengkap, menarik, dan detail.`;
        break;
      case "lkpd":
        systemInstruction = "Anda adalah ahli kurikulum SMP yang sangat berpengalaman dalam menyusun Lembar Kerja Peserta Didik (LKPD) yang mendidik, menyenangkan, interaktif, serta merangsang kemampuan berpikir tingkat tinggi (HOTS - Higher Order Thinking Skills).";
        userPrompt = `Buatkan draf Lembar Kerja Peserta Didik (LKPD) yang interaktif dan siap cetak untuk:\n- Mata Pelajaran: ${subject}\n- Tingkat: ${classLevel}\n- Topik Pembahasan: ${topic}\n\nHarap sertakan komponen berikut secara lengkap:\n1. Judul LKPD & Petunjuk Belajar yang ramah siswa\n2. Tujuan Pembelajaran yang ingin dicapai\n3. Aktivitas Utama / Eksperimen / Diskusi Kelompok yang kontekstual dan menantang\n4. Pertanyaan Analisis berbasis HOTS\n5. Latihan Mandiri / Tantangan Kreatif\n6. Rubrik Penilaian Kinerja kelompok atau individu. Format respons menggunakan Markdown terstruktur agar mudah dibaca dan digunakan langsung.`;
        break;
      default:
        return res.status(400).json({ error: "Tipe materi tidak dikenal." });
    }

    // Initialize client lazily and safely
    const ai = getGeminiClient();

    // Call Gemini with retry and fallback logic
    const markdownText = await generateWithRetryAndFallback(ai, userPrompt, systemInstruction, 0.7);

    // Set header for CORS compatibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ result: markdownText });
  } catch (error: any) {
    console.error("[Vercel Serverless] Kesalahan pembuatan materi:", error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      error: error.message || "Gagal menghubungi AI. Silakan periksa kunci API atau coba lagi nanti."
    });
  }
}
