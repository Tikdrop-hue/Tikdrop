import React, { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
import Navbar from './components/Navbar';
import Toolbar from './components/Toolbar';
import VideoCard from './components/VideoCard';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';
import BatchBar from './components/BatchBar';
import Toast from './components/Toast';
import PlayerModal from './components/modals/PlayerModal';
import AddModal from './components/modals/AddModal';
import FolderModal from './components/modals/FolderModal';
import StatsModal from './components/modals/StatsModal';
import TutorialModal from './components/modals/TutorialModal';

import { i18nDict } from './constants/i18n';

// Konfigurasi IndexedDB via localforage
localforage.config({
  name: 'TikDropVault',
  storeName: 'tikdrop_data'
});

// Helper untuk menormalisasi format folder (string -> object)
const normalizeFolders = (folders) => {
  if (!Array.isArray(folders)) return [];
  return folders.map(f => {
    if (typeof f === 'string') {
      return { id: f, name: f };
    }
    return f;
  });
};

export default function App() {
  // State dasar yang awalnya kosong
  const [archives, setArchives] = useState([]);
  const [userFolders, setUserFolders] = useState([]);
  const [lang, setLang] = useState('id');

  // State untuk melacak apakah data sudah selesai dimuat dari IndexedDB
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [activeFolder, setActiveFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState(new Set());
  
  const [activeVideoId, setActiveVideoId] = useState(null);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', icon: 'fa-check' });
  const toastTimeoutRef = useRef(null);

  const t = i18nDict[lang];

  // 1. MEMUAT DATA DARI INDEXEDDB SAAT APLIKASI DIBUKA
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedArchives = await localforage.getItem('tikdrop_archives_v4');
        const savedFolders = await localforage.getItem('tikdrop_folders_v4');
        const savedLang = await localforage.getItem('tikdrop_lang_v1');

        if (savedArchives) setArchives(savedArchives);
        if (savedFolders) setUserFolders(normalizeFolders(savedFolders));
        if (savedLang) setLang(savedLang);
      } catch (error) {
        console.error("Gagal memuat data dari IndexedDB:", error);
      } finally {
        setIsDataLoaded(true); // Tandai data sudah dimuat
      }
    };

    loadData();
  }, []);

  // 2. MENYIMPAN DATA KE INDEXEDDB SETIAP KALI STATE BERUBAH
  useEffect(() => {
    if (!isDataLoaded) return; // Cegah overwrite data kosong sebelum dimuat

    const saveData = async () => {
      try {
        await localforage.setItem('tikdrop_archives_v4', archives);
      } catch (error) {
        console.error("Gagal menyimpan archives ke IndexedDB:", error);
      }
    };
    saveData();
  }, [archives, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;

    const saveFolders = async () => {
      try {
        await localforage.setItem('tikdrop_folders_v4', userFolders);
      } catch (error) {
        console.error("Gagal menyimpan folders ke IndexedDB:", error);
      }
    };
    saveFolders();
  }, [userFolders, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;

    const saveLang = async () => {
      try {
        await localforage.setItem('tikdrop_lang_v1', lang);
      } catch (error) {
        console.error("Gagal menyimpan bahasa ke IndexedDB:", error);
      }
    };
    saveLang();
  }, [lang, isDataLoaded]);


  const showToast = (message, icon = 'fa-check') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, icon });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '', icon: 'fa-check' });
    }, 3000);
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'id' ? 'en' : 'id';
    setLang(nextLang);
    showToast(nextLang === 'id' ? 'Bahasa diubah ke Indonesia' : 'Language switched to English', 'fa-globe');
  };

  // Tampilan Loading selama data diambil dari IndexedDB
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-emerald-400">
        <i className="fa-solid fa-circle-notch animate-spin text-4xl"></i>
        <p className="text-zinc-400 text-sm font-semibold">Memuat Vault...</p>
      </div>
    );
  }

  // Filter & Sort Logic (Mendukung ID dan Nama Folder)
  const filteredArchives = archives.filter(item => {
    let matchesFolder = activeFolder === 'All';
    if (!matchesFolder) {
      const activeObj = userFolders.find(f => f.id === activeFolder || f.name === activeFolder);
      const targetIdentifier = activeObj ? activeObj.id : activeFolder;
      const targetName = activeObj ? activeObj.name : activeFolder;

      matchesFolder = item.folder === targetIdentifier || item.folder === targetName;
    }

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFav = !showFavoritesOnly || item.isFavorite;
    return matchesFolder && matchesSearch && matchesFav;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
    return 0;
  });

  const handleCardClick = (id) => {
    if (isBatchMode) {
      setSelectedBatchIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      setActiveVideoId(id);
    }
  };

  const handleSaveVideo = (newEntry) => {
    setArchives(prev => [newEntry, ...prev]);
    setIsAddOpen(false);
    showToast(lang === 'id' ? 'Video TikTok berhasil diarsipkan!' : 'TikTok video archived successfully!', 'fa-circle-check');
  };

  const handleTogglePin = (id) => {
    setArchives(prev => prev.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item));
    const target = archives.find(i => i.id === id);
    if (target) {
      showToast(!target.isPinned ? (lang === 'id' ? 'Video disematkan di atas' : 'Video pinned to top') : (lang === 'id' ? 'Sematkan dilepas' : 'Unpinned video'), 'fa-thumbtack');
    }
  };

  const handleSaveNote = (id, note) => {
    setArchives(prev => prev.map(item => item.id === id ? { ...item, note } : item));
  };

  const handleMoveFolder = (id, newFolderId) => {
    setArchives(prev => prev.map(item => 
      item.id === id ? { ...item, folder: newFolderId } : item
    ));
    showToast(
      lang === 'id' ? 'Video berhasil dipindahkan!' : 'Video moved successfully!', 
      'fa-folder-tree'
    );
  };

  const handleBatchMoveFolder = (targetFolderId) => {
    setArchives(prev => prev.map(item => 
      selectedBatchIds.has(item.id) ? { ...item, folder: targetFolderId } : item
    ));
    setSelectedBatchIds(new Set());
    setIsBatchMode(false);
    showToast(
      lang === 'id' ? 'Video terpilih berhasil dipindahkan!' : 'Selected videos moved successfully!', 
      'fa-folder-tree'
    );
  };

  // LOGIKA RENAME FOLDER
  const handleRenameFolder = (folderId, newName) => {
    if (!newName.trim()) return;
    
    setUserFolders(prev => prev.map(f => 
      f.id === folderId ? { ...f, name: newName } : f
    ));
    
    setArchives(prev => prev.map(item => 
      item.folder === folderId || item.folder === userFolders.find(f => f.id === folderId)?.name
        ? { ...item, folder: folderId } 
        : item
    ));

    showToast(lang === 'id' ? 'Nama folder diubah!' : 'Folder renamed!', 'fa-pen-to-square');
  };

  // Export / Backup JSON 
  const handleExportJSON = () => {
    const backupData = {
      archives,
      userFolders
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TikDrop_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(lang === 'id' ? 'Backup JSON beserta folder berhasil diunduh!' : 'JSON backup with folders downloaded!', 'fa-download');
  };

  // Import JSON 
  const handleImportJSON = (importedData) => {
    if (Array.isArray(importedData)) {
      setArchives((prev) => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = importedData.filter(item => !existingIds.has(item.id));
        return [...newItems, ...prev];
      });
      showToast(lang === 'id' ? 'Data berhasil dipulihkan!' : 'Data restored successfully!', 'fa-cloud-arrow-up');
    } else if (importedData && typeof importedData === 'object' && Array.isArray(importedData.archives)) {
      setArchives((prev) => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = importedData.archives.filter(item => !existingIds.has(item.id));
        return [...newItems, ...prev];
      });
      if (Array.isArray(importedData.userFolders)) {
        setUserFolders(prev => {
          const normalized = normalizeFolders(importedData.userFolders);
          const existingIds = new Set(prev.map(f => f.id));
          const newFolders = normalized.filter(f => !existingIds.has(f.id));
          return [...prev, ...newFolders];
        });
      }
      showToast(lang === 'id' ? 'Data & Folder berhasil dipulihkan!' : 'Data & Folders restored successfully!', 'fa-cloud-arrow-up');
    } else {
      showToast(lang === 'id' ? 'Format JSON tidak valid!' : 'Invalid JSON format!', 'fa-triangle-exclamation');
    }
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden">
      <Navbar
        t={t}
        lang={lang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        archives={archives}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        onResetFilter={() => { setActiveFolder('All'); setShowFavoritesOnly(false); setSearchQuery(''); }}
        onOpenAdd={() => setIsAddOpen(true)}
        onOpenFolder={() => setIsFolderOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onToggleLang={handleToggleLang}
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between">
        <div>
          <Toolbar
            t={t}
            userFolders={userFolders}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            showFavoritesOnly={showFavoritesOnly}
            filteredCount={filteredArchives.length}
            isBatchMode={isBatchMode}
            setIsBatchMode={(val) => { setIsBatchMode(val); setSelectedBatchIds(new Set()); }}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onResetFilters={() => { setActiveFolder('All'); setShowFavoritesOnly(false); setSearchQuery(''); }}
          />

          {filteredArchives.length === 0 ? (
            <EmptyState t={t} onOpenAdd={() => setIsAddOpen(true)} />
          ) : (
            <section className={viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'}>
              {filteredArchives.map(item => (
                <VideoCard
                  key={item.id}
                  item={item}
                  viewMode={viewMode}
                  isBatchMode={isBatchMode}
                  isSelected={selectedBatchIds.has(item.id)}
                  onClick={handleCardClick}
                />
              ))}
            </section>
          )}
        </div>

        <Footer 
          t={t} 
          onExportJSON={handleExportJSON} 
          onImportJSON={handleImportJSON} 
        />
      </main>

      <BatchBar
        count={selectedBatchIds.size}
        t={t}
        userFolders={userFolders}
        onMoveFolder={handleBatchMoveFolder}
        onDelete={() => {
          setArchives(prev => prev.filter(i => !selectedBatchIds.has(i.id)));
          setSelectedBatchIds(new Set());
          setIsBatchMode(false);
          showToast(lang === 'id' ? 'Video berhasil dihapus!' : 'Videos deleted!', 'fa-trash-can');
        }}
        onCancel={() => { setIsBatchMode(false); setSelectedBatchIds(new Set()); }}
      />

      {/* Modals */}
      <PlayerModal
        activeVideo={archives.find(i => i.id === activeVideoId)}
        t={t}
        lang={lang}
        userFolders={userFolders}
        onClose={() => setActiveVideoId(null)}
        onTogglePin={handleTogglePin}
        onSaveNote={handleSaveNote}
        onMoveFolder={handleMoveFolder}
        onShowToast={showToast}
      />

      <AddModal
        isOpen={isAddOpen}
        t={t}
        lang={lang}
        userFolders={userFolders}
        onClose={() => setIsAddOpen(false)}
        onSave={handleSaveVideo}
        onShowToast={showToast}
      />

      <FolderModal
        isOpen={isFolderOpen}
        t={t}
        userFolders={userFolders}
        setUserFolders={(folders) => setUserFolders(normalizeFolders(folders))}
        onRenameFolder={handleRenameFolder}
        onClose={() => setIsFolderOpen(false)}
        onShowToast={showToast}
      />

      <StatsModal
        isOpen={isStatsOpen}
        t={t}
        archives={archives}
        userFolders={userFolders}
        onClose={() => setIsStatsOpen(false)}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        t={t}
        onClose={() => setIsTutorialOpen(false)}
      />

      <Toast toast={toast} />
    </div>
  );
}