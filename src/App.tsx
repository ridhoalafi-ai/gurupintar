import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Menu,
  X,
  Layers,
  BookOpenCheck,
  FileText,
  CheckSquare,
  BookOpen,
  AlertCircle
} from "lucide-react";

import { SUBJECTS, SUGGESTED_TOPICS, INITIAL_MATERIALS } from "./constants";
import { SavedMaterial, MaterialType } from "./types";
import DashboardView from "./components/DashboardView";
import WorkspaceView from "./components/WorkspaceView";
import LibraryView from "./components/LibraryView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [selectedClass, setSelectedClass] = useState("Kelas VII");
  const [selectedSubject, setSelectedSubject] = useState("IPA (Ilmu Pengetahuan Alam)");
  const [topic, setTopic] = useState("");

  // Storage states
  const [savedMaterials, setSavedMaterials] = useState<SavedMaterial[]>([]);

  // Generator states
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);

  // Output workspace states
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [generatedSyllabus, setGeneratedSyllabus] = useState<string | null>(null);
  const [generatedLKPD, setGeneratedLKPD] = useState<string | null>(null);

  // Editing state for active workspaces
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [editedWorkContent, setEditedWorkContent] = useState("");

  // Clipboard states
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Library read / edit states
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<SavedMaterial | null>(null);
  const [isEditingLibraryItem, setIsEditingLibraryItem] = useState(false);
  const [editedLibraryContent, setEditedLibraryContent] = useState("");

  // Search and Filter states for Library
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const loadingPhrases = [
    "Menganalisis Kompetensi Dasar dan Alur Pembelajaran...",
    "Merumuskan Tujuan Pembelajaran (TP) yang terukur...",
    "Menyelaraskan dengan dimensi Profil Pelajar Pancasila...",
    "Menyusun langkah pembelajaran interaktif & bermakna...",
    "Mendesain asesmen formatif dan rubrik penilaian HOTS...",
    "Menyempurnakan tata bahasa Indonesia Kurikulum Merdeka..."
  ];

  // Load saved items from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gurupintar_materials");
      if (stored) {
        setSavedMaterials(JSON.parse(stored));
      } else {
        setSavedMaterials(INITIAL_MATERIALS);
        localStorage.setItem("gurupintar_materials", JSON.stringify(INITIAL_MATERIALS));
      }
    } catch (e) {
      console.error("Gagal membaca localStorage:", e);
      setSavedMaterials(INITIAL_MATERIALS);
    }
  }, []);

  // Sync saved items to localStorage
  const syncToStorage = (updatedList: SavedMaterial[]) => {
    setSavedMaterials(updatedList);
    try {
      localStorage.setItem("gurupintar_materials", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage:", e);
    }
  };

  // Rotate loading phrases during AI generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiLoading) {
      setLoadingMessage(loadingPhrases[0]);
      let idx = 1;
      interval = setInterval(() => {
        setLoadingMessage(loadingPhrases[idx % loadingPhrases.length]);
        idx++;
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [aiLoading]);

  // Handle auto-selected suggestion topic
  const handleSelectSuggestedTopic = (t: string) => {
    setTopic(t);
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedSection(sectionName);
        setTimeout(() => setCopiedSection(null), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin teks:", err);
      });
  };

  const handleGenerate = async (type: MaterialType) => {
    const activeTopic = topic.trim();
    if (!activeTopic) {
      setAiError("Silakan pilih salah satu topik yang disarankan atau masukkan topik kustom Anda!");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setIsEditingWork(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          classLevel: selectedClass,
          topic: activeTopic,
          type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghasilkan materi dari server.");
      }

      const resultText = data.result;

      if (type === "curriculum") {
        setGeneratedOutput(resultText);
      } else if (type === "syllabus") {
        setGeneratedSyllabus(resultText);
      } else if (type === "lkpd") {
        setGeneratedLKPD(resultText);
      }
    } catch (err: any) {
      setAiError(err.message || "Koneksi terputus. Silakan periksa kunci API Anda atau coba lagi.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveToLibrary = (type: MaterialType, contentText: string | null) => {
    if (!contentText) return;
    const activeTopic = topic.trim() || "Materi Tanpa Judul";
    
    let typeLabel = "CP-TP-ATP";
    if (type === "syllabus") typeLabel = "Modul Ajar";
    if (type === "lkpd") typeLabel = "LKPD";

    const titleText = `${typeLabel} ${activeTopic} - ${selectedClass}`;
    
    const newItem: SavedMaterial = {
      id: Date.now().toString(),
      title: titleText,
      subject: selectedSubject,
      classLevel: selectedClass,
      type,
      content: contentText,
      date: new Date().toISOString().split("T")[0]
    };

    const updated = [newItem, ...savedMaterials];
    syncToStorage(updated);
    alert(`Berhasil menyimpan "${titleText}" ke Pustaka Saya!`);
  };

  const handleDeleteSavedItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghapus materi ini dari pustaka Anda?")) {
      const updated = savedMaterials.filter(item => item.id !== id);
      syncToStorage(updated);
      if (selectedLibraryItem?.id === id) {
        setSelectedLibraryItem(null);
        setIsEditingLibraryItem(false);
      }
    }
  };

  const handleDownloadAsFile = (title: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = (title: string, content: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup terblokir! Harap izinkan popup untuk mencetak materi.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Inter', system-ui, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              font-family: 'Space Grotesk', sans-serif;
              color: #0f766e;
              border-bottom: 2px solid #ccfbf1;
              padding-bottom: 12px;
              margin-top: 30px;
              font-size: 24pt;
            }
            h2 {
              font-family: 'Space Grotesk', sans-serif;
              color: #065f46;
              margin-top: 24px;
              font-size: 18pt;
            }
            h3 {
              font-family: 'Space Grotesk', sans-serif;
              color: #1e293b;
              margin-top: 20px;
              font-size: 14pt;
            }
            p, li {
              font-size: 11pt;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 10px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #f1f5f9;
              font-weight: bold;
              color: #0f766e;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 30px; text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
            <p style="font-size: 10pt; color: #64748b; margin: 0; text-transform: uppercase; tracking: 1px;">Dicetak via GuruPintar SMP - Asisten Kurikulum Merdeka</p>
          </div>
          <div id="content"></div>
          <script>
            const raw = ${JSON.stringify(content)};
            let html = raw
              .replace(/\\n/g, '<br>')
              .replace(/# (.*?)(<br>|$)/g, '<h1>$1</h1>')
              .replace(/## (.*?)(<br>|$)/g, '<h2>$1</h2>')
              .replace(/### (.*?)(<br>|$)/g, '<h3>$1</h3>')
              .replace(/\\*\\*(.*?)\\*\\/g, '<strong>$1</strong>')
              .replace(/\\*(.*?)\\*/g, '<em>$1</em>');
            
            document.getElementById('content').innerHTML = html;
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredMaterials = savedMaterials.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesSubject = filterSubject === "all" || item.subject === filterSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* MOBILE HEADER (hidden on desktop) */}
      <header className="md:hidden bg-slate-900 text-white border-b border-slate-850 shadow-sm sticky top-0 z-30">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight font-display">
              GuruPintar <span className="text-teal-300 font-medium text-xs px-1.5 py-0.5 rounded-md bg-teal-950/60">SMP</span>
            </span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-800 bg-slate-900 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  { id: "dashboard", label: "Dashboard", icon: Layers },
                  { id: "curriculum", label: "Rencana CP-TP-ATP", icon: BookOpenCheck },
                  { id: "syllabus", label: "Modul Ajar", icon: FileText },
                  { id: "lkpd", label: "LKPD Siswa", icon: CheckSquare },
                  { id: "library", label: "Pustaka Saya", icon: BookOpen }
                ].map(tab => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                        setAiError(null);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <IconComp className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* DESKTOP SIDEBAR (hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-slate-900 flex-col h-screen sticky top-0 shrink-0 border-r border-slate-850">
        {/* Sidebar Header / Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight font-display flex items-baseline gap-1">
                GuruPintar <span className="text-teal-300 font-medium text-[10px] px-1.5 py-0.5 rounded-md bg-teal-950/60">SMP</span>
              </span>
              <p className="text-[10px] text-slate-400 font-sans">Kurikulum Merdeka AI</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: Layers },
            { id: "curriculum", label: "Rencana CP-TP-ATP", icon: BookOpenCheck },
            { id: "syllabus", label: "Modul Ajar", icon: FileText },
            { id: "lkpd", label: "LKPD Siswa", icon: CheckSquare },
            { id: "library", label: "Pustaka Saya", icon: BookOpen }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setAiError(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-800 text-white shadow-md shadow-slate-950/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <IconComp className={`h-5 w-5 ${isActive ? "text-teal-400" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Upgrade Pro Panel */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-teal-950/40 p-4 rounded-xl border border-teal-800/40">
            <p className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-1.5 font-display">Upgrade Pro</p>
            <p className="text-slate-400 text-[11px] mb-3 leading-normal font-sans">Dapatkan akses ke model AI terbaru tanpa batas.</p>
            <button className="w-full bg-teal-600 hover:bg-teal-500 py-2 rounded-lg text-white text-xs font-bold shadow-md transition-colors font-display">
              Langganan Sekarang
            </button>
          </div>
        </div>
      </aside>

      {/* DESKTOP CONTENT AREA */}
      <div className="flex-1 min-h-screen flex flex-col overflow-y-auto bg-slate-100">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Global AI Error Banner */}
            {aiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start space-x-3 shadow-sm font-sans"
              >
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold">Gagal Pembuatan: </span>
                  {aiError}
                </div>
              </motion.div>
            )}

            {/* TAB 1: DASHBOARD */}
            {activeTab === "dashboard" && (
              <DashboardView
                savedMaterials={savedMaterials}
                setActiveTab={setActiveTab}
                setSelectedLibraryItem={setSelectedLibraryItem}
              />
            )}

            {/* TAB 2, 3, 4: ACTIVE CONTENT WORKSPACES */}
            {activeTab !== "dashboard" && activeTab !== "library" && (
              <WorkspaceView
                activeTab={activeTab}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                topic={topic}
                setTopic={setTopic}
                handleSelectSuggestedTopic={handleSelectSuggestedTopic}
                aiLoading={aiLoading}
                loadingMessage={loadingMessage}
                handleGenerate={handleGenerate}
                generatedOutput={generatedOutput}
                setGeneratedOutput={setGeneratedOutput}
                generatedSyllabus={generatedSyllabus}
                setGeneratedSyllabus={setGeneratedSyllabus}
                generatedLKPD={generatedLKPD}
                setGeneratedLKPD={setGeneratedLKPD}
                isEditingWork={isEditingWork}
                setIsEditingWork={setIsEditingWork}
                editedWorkContent={editedWorkContent}
                setEditedWorkContent={setEditedWorkContent}
                copiedSection={copiedSection}
                copyToClipboard={copyToClipboard}
                handleDownloadAsFile={handleDownloadAsFile}
                handlePrint={handlePrint}
                handleSaveToLibrary={handleSaveToLibrary}
                subjects={SUBJECTS}
                suggestedTopics={SUGGESTED_TOPICS}
              />
            )}

            {/* TAB 5: LIBRARY */}
            {activeTab === "library" && (
              <LibraryView
                savedMaterials={savedMaterials}
                filteredMaterials={filteredMaterials}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                filterSubject={filterSubject}
                setFilterSubject={setFilterSubject}
                selectedLibraryItem={selectedLibraryItem}
                setSelectedLibraryItem={setSelectedLibraryItem}
                isEditingLibraryItem={isEditingLibraryItem}
                setIsEditingLibraryItem={setIsEditingLibraryItem}
                editedLibraryContent={editedLibraryContent}
                setEditedLibraryContent={setEditedLibraryContent}
                handleDeleteSavedItem={handleDeleteSavedItem}
                copyToClipboard={copyToClipboard}
                handleDownloadAsFile={handleDownloadAsFile}
                handlePrint={handlePrint}
                copiedSection={copiedSection}
                syncToStorage={syncToStorage}
                subjects={SUBJECTS}
              />
            )}

          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-850 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-xs">
            <div className="text-left font-display">
              <p className="font-semibold text-slate-300 text-sm">GuruPintar SMP</p>
              <p className="mt-1 text-slate-400 text-xs font-sans">Penyusunan Perencanaan Kurikulum Merdeka yang Praktis, Kreatif, dan Terbimbing AI.</p>
            </div>
            <div>
              <p className="font-sans">© 2026 GuruPintar SMP. Semua data pustaka disinkronkan secara lokal di peramban Anda.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
