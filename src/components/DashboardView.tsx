import React from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  BookOpenCheck,
  FileText,
  CheckSquare,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { SavedMaterial, MaterialType } from "../types";

interface DashboardViewProps {
  savedMaterials: SavedMaterial[];
  setActiveTab: (tab: string) => void;
  setSelectedLibraryItem: (item: SavedMaterial | null) => void;
}

export default function DashboardView({
  savedMaterials,
  setActiveTab,
  setSelectedLibraryItem
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Hero + Status Grid row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome / Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[260px]"
        >
          <div className="absolute right-[-40px] bottom-[-40px] w-80 h-80 opacity-10 text-white pointer-events-none">
            <BookOpen className="w-full h-full" />
          </div>
          <div className="relative z-10 space-y-3">
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 mb-1">Kurikulum Merdeka • Merdeka Belajar</h2>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">Mari Rancang Pembelajaran Inovatif Hari Ini.</h1>
            <p className="text-xs sm:text-sm text-teal-50/90 leading-relaxed max-w-xl font-sans">
              Asisten digital GuruPintar memandu Anda menganalisis Capaian Pembelajaran, menyelaraskan Tujuan, serta mendesain Modul Ajar dan LKPD HOTS secara kontekstual.
            </p>
          </div>
          <div className="relative z-10 pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("syllabus")}
              className="bg-white text-teal-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              Buat Modul Ajar
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className="bg-teal-500/60 hover:bg-teal-500 text-white border border-teal-400/40 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              Panduan Kurikulum
            </button>
          </div>
        </motion.div>

        {/* Quick Stats card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Status Penggunaan</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-semibold text-slate-700">Kredit AI Bulan Ini</span>
                <span className="font-bold text-teal-600">84 / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "84%" }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
            <div>
              <p className="text-3xl font-bold text-slate-800 font-display">{savedMaterials.length}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dokumen Selesai</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 font-display">
                {Array.from(new Set(savedMaterials.map(item => item.subject))).length || 2}
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mapel Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Module Cards in Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: "curriculum",
            title: "Rencana CP-TP-ATP",
            desc: "Urutkan Alur Tujuan Pembelajaran secara runut, buat KKTP lengkap dengan rubrik pencapaian.",
            icon: BookOpenCheck,
            color: "bg-teal-50 text-teal-600 border-teal-100",
            actionLabel: "Mulai Rancang"
          },
          {
            id: "syllabus",
            title: "Modul Ajar Inovatif",
            desc: "Tentukan model pembelajaran aktif (Discovery, PBL, PJBL) lengkap beserta rincian aktivitas mengajar.",
            icon: FileText,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
            actionLabel: "Susun Modul"
          },
          {
            id: "lkpd",
            title: "LKPD Siswa Kreatif",
            desc: "Rancang Lembar Kerja Peserta Didik interaktif dengan aktivitas nyata kelompok dan kuis HOTS mendidik.",
            icon: CheckSquare,
            color: "bg-blue-50 text-blue-600 border-blue-100",
            actionLabel: "Desain LKPD"
          }
        ].map((feat) => {
          const IconComp = feat.icon;
          return (
            <motion.div
              key={feat.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveTab(feat.id)}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
            >
              <div className="space-y-3.5">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs ${feat.color}`}>
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 font-display">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">{feat.desc}</p>
              </div>
              <div className="pt-4 flex items-center text-teal-600 text-xs font-bold gap-1 group">
                <span>{feat.actionLabel}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom row: Guide + Recent History + Tip Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guide Box */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-display text-slate-800 flex items-center gap-1.5">
            <BookOpen className="h-5 w-5 text-teal-600" />
            <span>Panduan Penggunaan Cepat</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-sans">
            <li className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center mt-0.5 shrink-0 font-display">1</div>
              <span>Pilih salah satu menu penyusunan di panel samping atau tombol jalan pintas di atas.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center mt-0.5 shrink-0 font-display">2</div>
              <span>Sesuaikan kelas, mata pelajaran, dan ketik topik pembahasan yang ingin Anda ajarkan.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center mt-0.5 shrink-0 font-display">3</div>
              <span>Klik tombol AI generator di bagian bawah panel kiri untuk merancang draf materi secara instan.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center mt-0.5 shrink-0 font-display">4</div>
              <span>Gunakan editor teks langsung untuk menyunting draf hasil AI sebelum menyalin atau menyimpannya.</span>
            </li>
          </ul>
        </div>

        {/* Recent Activity history */}
        <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider font-display">Pustaka Terakhir</h3>
            <div className="space-y-3">
              {savedMaterials.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 hover:border-teal-200 transition-all cursor-pointer"
                  onClick={() => {
                    setActiveTab("library");
                    setSelectedLibraryItem(item);
                  }}
                >
                  <p className="text-xs font-bold text-slate-700 line-clamp-1 font-sans">{item.title}</p>
                  <p className={`text-[10px] font-bold uppercase mt-1 font-display ${
                    item.type === "curriculum" ? "text-teal-600" :
                    item.type === "syllabus" ? "text-emerald-600" : "text-blue-600"
                  }`}>
                    {item.type === "curriculum" ? "CP-TP-ATP" : item.type === "syllabus" ? "Modul Ajar" : "LKPD"}
                  </p>
                </div>
              ))}
              {savedMaterials.length === 0 && (
                <p className="text-xs text-slate-400 italic py-4 text-center font-sans">Belum ada dokumen tersimpan</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveTab("library")}
            className="mt-4 w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs transition-all font-display"
          >
            Buka Pustaka Lengkap
          </button>
        </div>

        {/* Tips Box */}
        <div className="lg:col-span-3 bg-emerald-50 rounded-3xl border border-emerald-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <p className="text-emerald-800 text-xs font-bold mb-1 font-display">Tip Cerdas</p>
          <p className="text-emerald-600 text-[10px] sm:text-[11px] leading-relaxed font-sans">
            Gunakan usulan kata kunci rekomendasi topik di panel samping untuk mempercepat penulisan draf modul.
          </p>
        </div>
      </div>
    </div>
  );
}
