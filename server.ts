import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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

// Helper function to call Gemini with exponential backoff and a fallback model in case of 503 UNAVAILABLE/overload
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
        console.log(`Mencoba membuat materi menggunakan model ${model} (Upaya ${attempt}/${maxRetries})...`);
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
          console.log(`Berhasil membuat materi menggunakan model ${model}!`);
          return text;
        }
        throw new Error("Respons dari model kosong.");
      } catch (error: any) {
        lastError = error;
        console.warn(`Upaya ${attempt} dengan model ${model} gagal:`, error?.message || error);

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
          console.log(`Layanan sedang sibuk (lonjakan permintaan). Mencoba kembali dalam ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2.2; // Exponential backoff
        } else {
          // If not retryable or reached max retries for this model, break to try the fallback model
          break;
        }
      }
    }
    console.log(`Model ${model} gagal memproses permintaan setelah batas percobaan. Mencoba model berikutnya jika ada...`);
  }

  // If all models and retries fail, construct a clear and descriptive Indonesian error message
  const details = lastError?.message || JSON.stringify(lastError);
  throw new Error(
    `Asisten AI kami sedang menerima lonjakan antrean yang sangat tinggi dari Google (Layanan Sedang Sibuk / Error 503). ` +
    `Silakan coba klik tombol lagi dalam beberapa saat, atau coba persingkat topik pencarian Anda.\n\nDetail Teknis: ${details}`
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure JSON and URL-encoded body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Route: Generate Materials using Gemini 3.5 Flash
  app.post("/api/generate", async (req, res) => {
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

      // Call Gemini with exponential backoff and fallback model support
      const markdownText = await generateWithRetryAndFallback(ai, userPrompt, systemInstruction, 0.7);

      return res.json({ result: markdownText });
    } catch (error: any) {
      console.error("Kesalahan pembuatan materi:", error);
      return res.status(500).json({
        error: error.message || "Gagal menghubungi AI. Silakan periksa kunci API atau coba lagi nanti."
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support Single Page App Routing fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server GuruPintar SMP berjalan pada port ${PORT} di mode ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
