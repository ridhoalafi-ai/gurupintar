import React from "react";
import { motion } from "motion/react";
import {
  Settings,
  X,
  Sparkles,
  RefreshCw,
  BookOpenCheck,
  FileText,
  CheckSquare,
  Save,
  Edit2,
  Check,
  Copy,
  Download,
  Printer,
  Plus
} from "lucide-react";
import { MaterialType } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface WorkspaceViewProps {
  activeTab: string;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subj: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  handleSelectSuggestedTopic: (t: string) => void;
  aiLoading: boolean;
  loadingMessage: string;
  handleGenerate: (type: MaterialType) => void;
  generatedOutput: string | null;
  setGeneratedOutput: (val: string | null) => void;
  generatedSyllabus: string | null;
  setGeneratedSyllabus: (val: string | null) => void;
  generatedLKPD: string | null;
  setGeneratedLKPD: (val: string | null) => void;
  isEditingWork: boolean;
  setIsEditingWork: (editing: boolean) => void;
  editedWorkContent: string;
  setEditedWorkContent: (content: string) => void;
  copiedSection: string | null;
  copyToClipboard: (text: string, sectionName: string) => void;
  handleDownloadAsFile: (title: string, content: string) => void;
  handlePrint: (title: string, content: string) => void;
  handleSaveToLibrary: (type: MaterialType, contentText: string | null) => void;
  subjects: string[];
  suggestedTopics: Record<string, string[]>;
}

export default function WorkspaceView({
  activeTab,
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  topic,
  setTopic,
  handleSelectSuggestedTopic,
  aiLoading,
  loadingMessage,
  handleGenerate,
  generatedOutput,
  setGeneratedOutput,
  generatedSyllabus,
  setGeneratedSyllabus,
  generatedLKPD,
  setGeneratedLKPD,
  isEditingWork,
  setIsEditingWork,
  editedWorkContent,
  setEditedWorkContent,
  copiedSection,
  copyToClipboard,
  handleDownloadAsFile,
  handlePrint,
  handleSaveToLibrary,
  subjects,
  suggestedTopics
}: WorkspaceViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      
      {/* Side parameters (Span 1) */}
      <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 font-display">
          <Settings className="h-5 w-5 text-teal-600" />
          <h2 className="font-bold text-slate-800">Pengaturan Materi</h2>
        </div>

        {/* Class selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display">Tingkat Kelas</label>
          <div className="grid grid-cols-3 gap-1.5 font-display">
            {["Kelas VII", "Kelas VIII", "Kelas IX"].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedClass(lvl)}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition-all ${
                  selectedClass === lvl
                    ? "border-teal-600 bg-teal-50 text-teal-800 font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-500"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Subject selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display">Mata Pelajaran</label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setTopic(""); // Clear topic when subject shifts to show new suggestions
            }}
            className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs text-slate-700 font-sans font-medium"
          >
            {subjects.map(subj => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
        </div>

        {/* Topic input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display">Topik Pembahasan</label>
          <div className="relative font-sans">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ketik topik kustom..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-slate-700 shadow-xs"
            />
            {topic && (
              <button
                onClick={() => setTopic("")}
                className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Suggested Topic badges */}
        <div className="space-y-2.5">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">Rekomendasi Topik</span>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 font-sans">
            {suggestedTopics[selectedSubject]?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestedTopic(item)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                  topic === item
                    ? "bg-teal-600 text-white border-teal-600 font-semibold"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            )) || <p className="text-xs text-slate-400 italic font-sans">Pilih mata pelajaran untuk melihat usulan topik.</p>}
          </div>
        </div>

        {/* Generate button inside card */}
        <div className="pt-3 border-t border-slate-100 font-display">
          <button
            onClick={() => handleGenerate(activeTab as MaterialType)}
            disabled={aiLoading}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4.5 w-4.5 text-yellow-300 fill-yellow-300 animate-pulse" />
            )}
            <span>
              {aiLoading ? "Memproses..." : 
               activeTab === "curriculum" ? "Susun CP-TP" :
               activeTab === "syllabus" ? "Buat Modul Ajar" : "Buat LKPD"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Span 3) */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[550px]">
        {/* Inner Workspace Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 font-display">
            <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center">
              {activeTab === "curriculum" ? <BookOpenCheck className="h-5 w-5" /> :
               activeTab === "syllabus" ? <FileText className="h-5 w-5" /> : <CheckSquare className="h-5 w-5" />}
            </div>
            <h3 className="font-extrabold text-slate-800">
              {activeTab === "curriculum" && "Workspace Rencana CP-TP-ATP"}
              {activeTab === "syllabus" && "Workspace Modul Ajar / RPP"}
              {activeTab === "lkpd" && "Workspace LKPD Siswa"}
            </h3>
          </div>
          <div className="flex gap-2 text-xs font-display">
              <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-semibold">{selectedClass}</span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-semibold">{selectedSubject.split(" ")[0]}</span>
          </div>
        </div>

        {/* Core display */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          {aiLoading ? (
            /* Loading block */
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin" />
                <Sparkles className="h-6 w-6 text-teal-500 absolute animate-pulse" />
              </div>
              <div className="space-y-2 max-w-md">
                <h4 className="font-bold text-slate-800 text-lg font-display">GuruPintar AI Sedang Merancang...</h4>
                <p className="text-xs sm:text-sm text-teal-700 font-medium font-mono h-8 animate-pulse leading-normal">
                  {loadingMessage}
                </p>
              </div>
            </div>
          ) : (
            /* Display or empty state */
            <div className="flex-1 flex flex-col h-full">
              {((activeTab === "curriculum" && generatedOutput) ||
                (activeTab === "syllabus" && generatedSyllabus) ||
                (activeTab === "lkpd" && generatedLKPD)) ? (
                
                <div className="space-y-6 flex-1 flex flex-col">
                  
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-xs sm:text-sm font-display">
                    
                    {/* Edit triggers */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          if (!isEditingWork) {
                            const textToEdit = activeTab === "curriculum" ? generatedOutput :
                                               activeTab === "syllabus" ? generatedSyllabus : generatedLKPD;
                            setEditedWorkContent(textToEdit || "");
                          } else {
                            if (activeTab === "curriculum") setGeneratedOutput(editedWorkContent);
                            if (activeTab === "syllabus") setGeneratedSyllabus(editedWorkContent);
                            if (activeTab === "lkpd") setGeneratedLKPD(editedWorkContent);
                          }
                          setIsEditingWork(!isEditingWork);
                        }}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                          isEditingWork
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-white border border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        {isEditingWork ? (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Simpan Editan</span>
                          </>
                        ) : (
                          <>
                            <Edit2 className="h-4 w-4" />
                            <span>Tulis Kustomisasi</span>
                          </>
                        )}
                      </button>

                      {isEditingWork && (
                        <button
                          onClick={() => setIsEditingWork(false)}
                          className="px-3 py-2 text-slate-500 hover:text-slate-800 font-sans font-semibold"
                        >
                          Batalkan
                        </button>
                      )}
                    </div>

                    {/* Operations */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          const currentContent = activeTab === "curriculum" ? generatedOutput :
                                                 activeTab === "syllabus" ? generatedSyllabus : generatedLKPD;
                          copyToClipboard(currentContent || "", activeTab);
                        }}
                        className="p-2 sm:px-3 sm:py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 flex items-center space-x-1 font-bold text-slate-700 transition-all"
                      >
                        {copiedSection === activeTab ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-600" />
                            <span className="hidden sm:inline text-emerald-600">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="hidden sm:inline">Salin</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          const currentContent = activeTab === "curriculum" ? generatedOutput :
                                                 activeTab === "syllabus" ? generatedSyllabus : generatedLKPD;
                          const title = `${activeTab.toUpperCase()}_${topic}_${selectedClass}`;
                          handleDownloadAsFile(title, currentContent || "");
                        }}
                        className="p-2 sm:px-3 sm:py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 flex items-center space-x-1 font-bold text-slate-700 transition-all"
                        title="Unduh berkas Markdown"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Unduh .MD</span>
                      </button>

                      <button
                        onClick={() => {
                          const currentContent = activeTab === "curriculum" ? generatedOutput :
                                                 activeTab === "syllabus" ? generatedSyllabus : generatedLKPD;
                          const title = `GuruPintar - ${activeTab.toUpperCase()} ${topic}`;
                          handlePrint(title, currentContent || "");
                        }}
                        className="p-2 sm:px-3 sm:py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 flex items-center space-x-1 font-bold text-slate-700 transition-all"
                      >
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">Cetak</span>
                      </button>

                      <button
                        onClick={() => {
                          const currentContent = activeTab === "curriculum" ? generatedOutput :
                                                 activeTab === "syllabus" ? generatedSyllabus : generatedLKPD;
                          handleSaveToLibrary(activeTab as MaterialType, currentContent);
                        }}
                        className="p-2 sm:px-3 sm:py-2 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100/60 flex items-center space-x-1 font-bold text-teal-800 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Simpan</span>
                      </button>
                    </div>
                  </div>

                  {/* Render area */}
                  <div className="border border-slate-150 rounded-2xl p-4 sm:p-6 bg-slate-50/20 shadow-inner flex-1 min-h-[400px]">
                    {isEditingWork ? (
                      <div className="space-y-2 h-full flex flex-col font-mono text-sm">
                        <span className="text-xs text-slate-400 font-mono italic block">Anda sedang mengedit draft hasil AI secara langsung sebelum diekspor.</span>
                        <textarea
                          value={editedWorkContent}
                          onChange={(e) => setEditedWorkContent(e.target.value)}
                          className="w-full flex-1 min-h-[400px] p-4 text-sm font-mono text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                    ) : (
                      <MarkdownRenderer
                        content={
                          activeTab === "curriculum" ? (generatedOutput || "") :
                          activeTab === "syllabus" ? (generatedSyllabus || "") : (generatedLKPD || "")
                        }
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* Interactive empty stage matching design HTML exactly */
                <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-3xl flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-12 min-h-[400px]">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-teal-500 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-slate-800 font-display">Apa yang ingin Anda buat hari ini?</h4>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-sm mb-8 italic leading-relaxed font-sans">
                    {activeTab === "curriculum" && "Contoh: \"Buatkan saya rancangan kurikulum lengkap untuk topik Hakikat Sains kelas VII.\""}
                    {activeTab === "syllabus" && "Contoh: \"Buatkan saya Modul Ajar Besaran dan Satuan kelas VII dengan model eksperimen.\""}
                    {activeTab === "lkpd" && "Contoh: \"Buatkan saya LKPD untuk materi Klasifikasi Makhluk Hidup kelas VII dengan observasi.\""}
                  </p>
                  <div className="w-full max-w-lg relative font-sans">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Tulis topik atau instruksi di sini..."
                      className="w-full px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 text-xs sm:text-sm pr-20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerate(activeTab as MaterialType);
                      }}
                    />
                    <button
                      onClick={() => handleGenerate(activeTab as MaterialType)}
                      className="absolute right-2 top-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
