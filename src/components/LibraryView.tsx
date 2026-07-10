import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Search,
  Eye,
  Trash2,
  X,
  FileEdit,
  Save,
  Check,
  Copy,
  Download,
  Printer
} from "lucide-react";
import { SavedMaterial, MaterialType } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface LibraryViewProps {
  savedMaterials: SavedMaterial[];
  filteredMaterials: SavedMaterial[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterSubject: string;
  setFilterSubject: (subject: string) => void;
  selectedLibraryItem: SavedMaterial | null;
  setSelectedLibraryItem: (item: SavedMaterial | null) => void;
  isEditingLibraryItem: boolean;
  setIsEditingLibraryItem: (editing: boolean) => void;
  editedLibraryContent: string;
  setEditedLibraryContent: (content: string) => void;
  handleDeleteSavedItem: (id: string, e: React.MouseEvent) => void;
  copyToClipboard: (text: string, sectionName: string) => void;
  handleDownloadAsFile: (title: string, content: string) => void;
  handlePrint: (title: string, content: string) => void;
  copiedSection: string | null;
  syncToStorage: (updatedList: SavedMaterial[]) => void;
  subjects: string[];
}

export default function LibraryView({
  savedMaterials,
  filteredMaterials,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterSubject,
  setFilterSubject,
  selectedLibraryItem,
  setSelectedLibraryItem,
  isEditingLibraryItem,
  setIsEditingLibraryItem,
  editedLibraryContent,
  setEditedLibraryContent,
  handleDeleteSavedItem,
  copyToClipboard,
  handleDownloadAsFile,
  handlePrint,
  copiedSection,
  syncToStorage,
  subjects
}: LibraryViewProps) {
  return (
    <div className="space-y-6">
      
      {/* Search & Filter panel (Bento card) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-teal-600" />
            <span>Pustaka Materi Saya</span>
          </h3>
          
          {/* Search box */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, subjek, atau konten..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 pl-10 pr-4 py-3 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all font-sans"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-display">Tipe Dokumen:</span>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                { id: "all", label: "Semua" },
                { id: "curriculum", label: "CP-TP" },
                { id: "syllabus", label: "Modul" },
                { id: "lkpd", label: "LKPD" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors ${
                    filterType === t.id ? "bg-white text-teal-800 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] hidden sm:inline font-display">Mata Pelajaran:</span>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="text-xs bg-slate-100 border-none rounded-xl p-2.5 font-semibold text-slate-600 focus:outline-none shadow-xs font-sans"
            >
              <option value="all">Semua Mata Pelajaran</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Library Cards (Bento cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`material-card-${item.id}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedLibraryItem(item);
                  setIsEditingLibraryItem(false);
                  setEditedLibraryContent(item.content);
                }}
                className="bg-white border border-slate-200 hover:border-teal-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border font-display ${
                      item.type === "curriculum" ? "bg-teal-50 text-teal-800 border-teal-200/50" :
                      item.type === "syllabus" ? "bg-emerald-50 text-emerald-800 border-emerald-200/50" :
                      "bg-blue-50 text-blue-800 border-blue-200/50"
                    }`}>
                      {item.type === "curriculum" ? "CP-TP-ATP" :
                       item.type === "syllabus" ? "Modul Ajar" : "LKPD Siswa"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">{item.date}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-base sm:text-lg font-display line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-0.5 font-sans">
                    <p><span className="font-bold text-slate-400">Mapel:</span> {item.subject}</p>
                    <p><span className="font-bold text-slate-400">Kelas:</span> {item.classLevel}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 pt-2.5 border-t border-slate-100 font-sans">
                    {item.content.replace(/[#*`|_-]/g, "").trim()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-display">
                  <span className="text-teal-600 font-bold flex items-center gap-1.5 hover:text-teal-700 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>Buka Dokumen</span>
                  </span>

                  <button
                    onClick={(e) => handleDeleteSavedItem(item.id, e)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus dari pustaka"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="max-w-sm mx-auto space-y-2">
                <h4 className="font-bold text-slate-700 font-display">Pustaka Kosong</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                  {searchQuery || filterType !== "all" || filterSubject !== "all"
                    ? "Tidak ada materi yang cocok dengan pencarian atau filter Anda."
                    : "Anda belum menyimpan modul atau lembar kerja apa pun. Mulai susun rencana ajar Anda di tab Rencana, Modul, atau LKPD!"}
                </p>
                
                {(searchQuery || filterType !== "all" || filterSubject !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                      setFilterSubject("all");
                    }}
                    className="mt-2 text-xs text-teal-600 font-bold hover:underline font-display"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* LIGHTWEIGHT MODAL VIEW / FULLSCREEN READER FOR LIBRARY ITEMS */}
      <AnimatePresence>
        {selectedLibraryItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => {
              setSelectedLibraryItem(null);
              setIsEditingLibraryItem(false);
            }}
          >
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                    <span>{selectedLibraryItem.classLevel}</span>
                    <span>•</span>
                    <span>{selectedLibraryItem.subject}</span>
                    <span>•</span>
                    <span>{selectedLibraryItem.date}</span>
                  </div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-800 font-display">
                    {selectedLibraryItem.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedLibraryItem(null);
                    setIsEditingLibraryItem(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-xl transition-colors shadow-xs"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Toolbar */}
              <div className="bg-slate-50/50 border-b border-slate-100 p-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm px-5 font-display">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      if (isEditingLibraryItem) {
                        const updated = savedMaterials.map(m => 
                          m.id === selectedLibraryItem.id ? { ...m, content: editedLibraryContent } : m
                        );
                        syncToStorage(updated);
                        setSelectedLibraryItem({
                          ...selectedLibraryItem,
                          content: editedLibraryContent
                        });
                      }
                      setIsEditingLibraryItem(!isEditingLibraryItem);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      isEditingLibraryItem
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isEditingLibraryItem ? (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Simpan Perubahan</span>
                      </>
                    ) : (
                      <>
                        <FileEdit className="h-3.5 w-3.5" />
                        <span>Edit Teks</span>
                      </>
                    )}
                  </button>

                  {isEditingLibraryItem && (
                    <button
                      onClick={() => {
                        setIsEditingLibraryItem(false);
                        setEditedLibraryContent(selectedLibraryItem.content);
                      }}
                      className="px-2 py-1 text-slate-500 hover:text-slate-700 font-sans"
                    >
                      Batalkan
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => copyToClipboard(selectedLibraryItem.content, `lib-${selectedLibraryItem.id}`)}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center space-x-1 text-slate-700 transition-colors"
                  >
                    {copiedSection === `lib-${selectedLibraryItem.id}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="hidden sm:inline text-emerald-600 font-bold">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Salin</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadAsFile(selectedLibraryItem.title, selectedLibraryItem.content)}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center space-x-1 text-slate-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Unduh</span>
                  </button>

                  <button
                    onClick={() => {
                      const title = `GuruPintar - ${selectedLibraryItem.title}`;
                      handlePrint(title, selectedLibraryItem.content);
                    }}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center space-x-1 text-slate-700 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Cetak</span>
                  </button>

                  <button
                    onClick={(e) => {
                      handleDeleteSavedItem(selectedLibraryItem.id, e);
                    }}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center space-x-1 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/15">
                {isEditingLibraryItem ? (
                  <textarea
                    value={editedLibraryContent}
                    onChange={(e) => setEditedLibraryContent(e.target.value)}
                    className="w-full h-[50vh] p-4 font-mono text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                ) : (
                  <MarkdownRenderer content={selectedLibraryItem.content} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
