import { SavedMaterial } from "./types";

export const SUBJECTS = [
  'IPA (Ilmu Pengetahuan Alam)',
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPS (Ilmu Pengetahuan Sosial)',
  'Informatika',
  'Pendidikan Pancasila',
  'Seni & Budaya'
];

export const SUGGESTED_TOPICS: Record<string, string[]> = {
  'IPA (Ilmu Pengetahuan Alam)': [
    'Hakikat Sains dan Metode Ilmiah',
    'Zat dan Perubahannya',
    'Suhu, Kalor, dan Pemuaian',
    'Gaya dan Gerak',
    'Klasifikasi Makhluk Hidup',
    'Ekologi dan Keanekaragaman Hayati'
  ],
  'Matematika': [
    'Bilangan Bulat dan Bilangan Pecahan',
    'Aljabar dan Persamaan Linier',
    'Rasio dan Proporsi',
    'Geometri Bidang dan Ruang',
    'Statistika Dasar dan Penyajian Data'
  ],
  'Bahasa Indonesia': [
    'Teks Deskripsi dan Teks Fantasi',
    'Puisi, Rakyat, dan Prosa',
    'Teks Prosedur dan Teks Berita',
    'Berita, Opini, dan Fakta',
    'Teks Eksposisi dan Buku Fiksi'
  ],
  'Bahasa Inggris': [
    'Greeting, Introducing, and Self Description',
    'Describing People, Animals, and Places',
    'Daily Activities and Simple Present Tense',
    'Recount Text & Past Experience',
    'Procedure Text & Giving Instructions'
  ],
  'IPS (Ilmu Pengetahuan Sosial)': [
    'Kondisi Geografis dan Keberagaman Alam Indonesia',
    'Interaksi Sosial dan Sosialisasi Masyarakat',
    'Aktivitas Manusia dalam Memenuhi Kebutuhan',
    'Kehidupan Masyarakat Masa Praaksara dan Hindu-Buddha',
    'Perubahan Sosial Budaya dan Globalisasi'
  ],
  'Informatika': [
    'Berpikir Komputasional dan Pemecahan Masalah',
    'Teknologi Informasi dan Komunikasi (TIK)',
    'Sistem Komputer dan Arsitektur Perangkat',
    'Jaringan Komputer dan Internet (JKI)',
    'Algoritma dan Pemrograman Dasar'
  ],
  'Pendidikan Pancasila': [
    'Sejarah Kelahiran Pancasila',
    'Penerapan Nilai Pancasila dalam Kehidupan Sehari-hari',
    'UUD NRI Tahun 1945 sebagai Konstitusi Negara',
    'Keberagaman Suku, Agama, Ras, dan Antargolongan'
  ],
  'Seni & Budaya': [
    'Menggambar Alam Benda dan Seni Rupa Nusantara',
    'Bernyanyi Lagu Daerah dan Teknik Vokal',
    'Gerak Tari Tradisional Berdasarkan Pola Lantai',
    'Apresiasi Teater Tradisional Nusantara'
  ]
};

export const INITIAL_MATERIALS: SavedMaterial[] = [
  {
    id: '1',
    title: 'Modul Ajar Besaran dan Satuan',
    subject: 'IPA (Ilmu Pengetahuan Alam)',
    classLevel: 'Kelas VII',
    type: 'syllabus',
    date: '2026-07-01',
    content: `# MODUL AJAR: BESARAN DAN SATUAN (KURIKULUM MERDEKA)

## I. IDENTITAS MODUL
- **Mata Pelajaran:** IPA (Ilmu Pengetahuan Alam)
- **Kelas/Semester:** VII / Ganjil
- **Alokasi Waktu:** 2 JP (2 x 40 Menit)
- **Topik:** Besaran dan Satuan

## II. KOMPETENSI AWAL
Siswa telah memahami konsep dasar pengukuran secara intuitif dalam kehidupan sehari-hari (misal: sejengkal, semeter, atau sekilo).

## III. PROFIL PELAJAR PANCASILA
- **Mandiri:** Bertanggung jawab atas proses dan hasil belajarnya dalam melakukan eksperimen pengukuran.
- **Gotong Royong:** Bekerja sama secara aktif dalam kelompok untuk melakukan aktivitas pengukuran.
- **Bernalar Kritis:** Menganalisis perbedaan hasil pengukuran dengan satuan baku dan tidak baku.

## IV. MODEL PEMBELAJARAN
Discovery Learning (Pembelajaran Penemuan) secara tatap muka dengan metode eksperimen dan diskusi kelompok.

## V. TUJUAN PEMBELAJARAN
Siswa mampu membedakan besaran pokok dan besaran turunan, serta menggunakan satuan baku (SI) dalam aktivitas pengukuran secara tepat.

## VI. KEGIATAN PEMBELAJARAN
### A. Pendahuluan (10 Menit)
1. Guru menyapa siswa dengan ramah dan melakukan presensi.
2. **Apersepsi:** Guru meminta dua orang siswa dengan tinggi badan berbeda untuk mengukur panjang meja guru menggunakan jengkal tangan mereka masing-masing.
3. **Pertanyaan Pemantik:** "Mengapa hasil jengkal Budi dan jengkal Siti berbeda? Bagaimana cara agar kita mendapatkan hasil pengukuran yang adil dan sama di seluruh dunia?"
4. Guru menyampaikan tujuan pembelajaran hari ini.

### B. Kegiatan Inti (60 Menit)
1. **Stimulasi:** Siswa mengamati berbagai alat ukur yang disiapkan guru (mistar, jangka sorong, timbangan).
2. **Identifikasi Masalah:** Siswa merumuskan pertanyaan mengenai apa yang membedakan besaran pokok dan besaran turunan.
3. **Pengumpulan Data:** Siswa berkelompok melakukan pengukuran panjang buku tulis dengan penggaris (satuan cm) dan jengkal (satuan tidak baku), serta mencatat hasilnya ke tabel kerja.
4. **Pengolahan Data:** Siswa mendiskusikan mengapa satuan baku penting dalam sains dan perdagangan internasional.
5. **Pembuktian:** Perwakilan kelompok mempresentasikan hasil pengukuran dan membandingkan variabilitas jengkal vs konsistensi cm.
6. **Generalisasi:** Bersama guru, siswa menyimpulkan besaran pokok (panjang, massa, waktu, dll.) beserta satuan baku SI-nya.

### C. Penutup (10 Menit)
1. Guru bersama siswa melakukan refleksi pembelajaran hari ini.
2. Guru memberikan kuis singkat (asesmen formatif).
3. Guru menutup pembelajaran dengan doa bersama.`
  },
  {
    id: '2',
    title: 'LKPD Klasifikasi Makhluk Hidup',
    subject: 'IPA (Ilmu Pengetahuan Alam)',
    classLevel: 'Kelas VII',
    type: 'lkpd',
    date: '2026-07-04',
    content: `# LEMBAR KERJA PESERTA DIDIK (LKPD)
## TOPIK: KLASIFIKASI MAKHLUK HIDUP (5 KINGDOM)

### Nama Kelompok: ____________________
### Anggota Kelompok:
1. ____________________
2. ____________________
3. ____________________
4. ____________________

---

### A. TUJUAN PEMBELAJARAN
Siswa dapat mengidentifikasi ciri-ciri makhluk hidup di lingkungan sekolah dan mengelompokkannya berdasarkan prinsip klasifikasi makhluk hidup secara kritis dan kolaboratif.

### B. PETUNJUK KERJA
1. Bacalah LKPD ini bersama anggota kelompokmu secara saksama.
2. Lakukan pengamatan terhadap 5 objek (bisa hewan, tumbuhan, atau benda mati) di halaman sekolah.
3. Isilah tabel pengamatan di bawah ini berdasarkan ciri-ciri yang teramati.
4. Diskusikan pertanyaan analisis bersama kelompok dan tuliskan kesimpulanmu.

---

### C. AKTIVITAS UTAMA: OBSERVASI LAPANGAN
Amatilah lingkungan sekolahmu dan catat hasilnya pada tabel berikut!

| No | Nama Objek | Apakah Bernapas? (Y/T) | Apakah Bergerak? (Y/T) | Apakah Tumbuh? (Y/T) | Kategori (Makhluk Hidup / Benda Mati) |
|----|------------|------------------------|------------------------|----------------------|---------------------------------------|
| 1  |            |                        |                        |                      |                                       |
| 2  |            |                        |                        |                      |                                       |
| 3  |            |                        |                        |                      |                                       |
| 4  |            |                        |                        |                      |                                       |
| 5  |            |                        |                        |                      |                                       |

---

### D. PERTANYAAN ANALISIS (HOTS)
1. Dari objek yang telah kalian amati, sebutkan minimal 3 perbedaan mendasar antara tanaman mangga (makhluk hidup) dengan tiang bendera (benda mati).
   *Jawaban:* __________________________________________________________________________
   
2. Mengapa sepeda motor yang dapat bergerak dan mengeluarkan asap sisa pembakaran tidak dikelompokkan sebagai makhluk hidup? Berikan argumen ilmiah kelompokmu!
   *Jawaban:* __________________________________________________________________________

3. Berdasarkan sistem klasifikasi 5 Kingdom, ke dalam kingdom manakah semut dan lumut dikelompokkan? Jelaskan alasannya!
   *Jawaban:* __________________________________________________________________________

---

### E. RUBRIK PENILAIAN
- **Kelengkapan Observasi:** 40% (Semua kolom terisi secara logis sesuai objek pengamatan)
- **Kualitas Analisis:** 40% (Jawaban pertanyaan HOTS berlandaskan argumentasi ilmiah yang kuat)
- **Sikap Kolaboratif:** 20% (Semua anggota kelompok aktif terlibat dalam diskusi)`
  }
];
