import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient } from './supabaseClient';

// Import Komponen
import Navbar from './components/Navbar';
import Toolbar from './components/Toolbar';
import VideoCard from './components/VideoCard';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import PlayerModal from './components/modals/PlayerModal';
import AddModal from './components/modals/AddModal';
import FolderModal from './components/modals/FolderModal';
import StatsModal from './components/modals/StatsModal';
import TutorialModal from './components/modals/TutorialModal';
import ModalLogin from './components/modals/ModalLogin';
import { i18nDict } from './constants/i18n';

export default function App() {
  const [session, setSession] = useState(null);
  const [archives, setArchives] = useState([]);
  const [userFolders, setUserFolders] = useState([]);
  const [lang, setLang] = useState('id');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // UI & Filter States
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', icon: 'fa-check' });
  const toastTimeoutRef = useRef(null);

  const t = i18nDict ? i18nDict[lang] : {};

  // Cek Sesi Auth
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load Data Publik
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: videosData } = await supabaseClient
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (videosData) {
            const mappedVideos = videosData.map(v => ({
                ...v,
                videoUrl: v.video_url,
                thumbnail: v.thumbnail_url || v.video_url, // fallback thumbnail jika tidak ada
                isFavorite: v.is_favorite,
                isPinned: v.is_pinned,
                date: v.created_at
            }));
            setArchives(mappedVideos);
        }

        const { data: foldersData } = await supabaseClient.from('folders').select('*');
        if (foldersData) setUserFolders(foldersData);

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadData();
  }, [session]);

  const showToast = (message, icon = 'fa-check') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, icon });
    toastTimeoutRef.current = setTimeout(() => setToast({ show: false, message: '', icon: '' }), 3000);
  };

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    showToast('Anda telah keluar', 'fa-right-from-bracket');
  };

  // Penjaga Tombol Add
  const handleOpenAdd = () => {
    if (!session?.user) {
      setIsAuthModalOpen(true);
      showToast('Silakan login terlebih dahulu untuk menambah video', 'fa-lock');
    } else {
      setIsAddOpen(true);
    }
  };

  // PENTING: Fungsi ini sudah diperbaiki untuk menyesuaikan tabel DB baru
  const handleSaveVideo = async (newEntry) => {
    if (!session?.user) return;
    
    // Payload BERSiH (Hanya mengirim kolom yang terdaftar di database baru)
    // Jangan mengirimkan 'id' karena kita menggunakan uuid auto-generate dari Supabase
    const dbPayload = {
        user_id: session.user.id,
        title: newEntry.title,
        creator: newEntry.creator || null,
        folder_id: newEntry.folder !== 'Umum' ? newEntry.folder : null,
        note: newEntry.note || null,
        video_url: newEntry.videoUrl || newEntry.video_url,
        is_favorite: false,
        is_pinned: false
    };

    // Gunakan .select() agar Supabase mengembalikan data yang berhasil diinput (lengkap dengan id UUID baru)
    const { data, error } = await supabaseClient
        .from('videos')
        .insert([dbPayload])
        .select();

    if (error) {
        console.error("Supabase Error:", error);
        showToast('Gagal menyimpan!', 'fa-circle-xmark');
        return;
    }

    // Jika berhasil, tambahkan data kembalian (yang sudah punya id asli) ke state lokal
    if (data && data.length > 0) {
      const insertedData = data[0];
      setArchives(prev => [{
          ...insertedData, 
          videoUrl: insertedData.video_url, 
          thumbnail: insertedData.video_url, // Menggunakan video_url sebagai fallback
          isFavorite: insertedData.is_favorite,
          isPinned: insertedData.is_pinned,
          date: insertedData.created_at
      }, ...prev]);
    }
    
    setIsAddOpen(false);
    showToast('Video berhasil ditambahkan!', 'fa-cloud-arrow-up');
  };

  const handleTogglePin = async (id) => {
    if (!session?.user) {
      showToast('Login diperlukan untuk pin video', 'fa-lock');
      return;
    }
    const target = archives.find(i => i.id === id);
    if(!target) return;
    const newValue = !target.isPinned;
    setArchives(prev => prev.map(item => item.id === id ? { ...item, isPinned: newValue } : item));
    await supabaseClient.from('videos').update({ is_pinned: newValue }).eq('id', id);
  };

  const handleSaveNote = async (id, note) => {
    if (!session?.user) return;
    setArchives(prev => prev.map(item => item.id === id ? { ...item, note } : item));
    await supabaseClient.from('videos').update({ note: note }).eq('id', id);
  };

  const handleMoveFolder = async (id, newFolderId) => {
    if (!session?.user) return;
    setArchives(prev => prev.map(item => item.id === id ? { ...item, folder_id: newFolderId } : item));
    await supabaseClient.from('videos').update({ folder_id: newFolderId === 'Umum' ? null : newFolderId }).eq('id', id);
    showToast('Video dipindahkan', 'fa-folder-tree');
  };

  const handleRenameFolder = async (folderId, newName) => {
    if (!session?.user) return;
    setUserFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f));
    await supabaseClient.from('folders').update({ name: newName }).eq('id', folderId);
  };

  // Filter & Sort
  const filteredArchives = archives.filter(item => {
    let matchesFolder = activeFolder === 'All';
    if (!matchesFolder) matchesFolder = item.folder_id === activeFolder || item.folder === activeFolder;

    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch = (item.title?.toLowerCase().includes(query)) || (item.note?.toLowerCase().includes(query));
    }
    return matchesFolder && matchesSearch && (!showFavoritesOnly || item.isFavorite);
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return sortOrder === 'newest' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at);
  });

  const handleCardClick = (id) => {
    if (isBatchMode) {
      setSelectedBatchIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
    } else {
      setActiveVideoId(id);
    }
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-emerald-400">
        <i className="fa-solid fa-circle-notch animate-spin text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen flex flex-col relative selection:bg-emerald-500">
      
      {/* Navbar */}
      <Navbar
        t={t}
        lang={lang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        archives={archives}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        onResetFilter={() => { setActiveFolder('All'); setShowFavoritesOnly(false); setSearchQuery(''); }}
        onOpenAdd={handleOpenAdd}
        onOpenFolder={() => setIsFolderOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onToggleLang={() => setLang(lang === 'id' ? 'en' : 'id')}
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-6 flex flex-col justify-between">
        <div>
          {/* Status Login */}
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs text-zinc-400">Mode Publik Vault</span>
            {session?.user ? (
               <div className="flex items-center gap-3">
                 <span className="text-xs text-emerald-400 font-medium">{session.user.email}</span>
                 <button onClick={handleLogout} className="text-xs bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition">
                   Keluar
                 </button>
               </div>
            ) : (
               <button onClick={() => setIsAuthModalOpen(true)} className="text-xs bg-emerald-500 text-zinc-950 font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition shadow">
                 Login / Daftar untuk Berkontribusi
               </button>
            )}
          </div>

          {/* Toolbar */}
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
          />

          {filteredArchives.length === 0 ? (
            <EmptyState t={t} onOpenAdd={handleOpenAdd} />
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
      </main>

      {/* Modal Login Terpisah */}
      <ModalLogin
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onShowToast={showToast}
        t={t}
      />

      {/* Modal Lainnya */}
      {activeVideoId && (
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
      )}

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
        setUserFolders={setUserFolders}
        onRenameFolder={handleRenameFolder}
        onClose={() => setIsFolderOpen(false)}
        onShowToast={showToast}
      />

      {isStatsOpen && <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} archives={archives} t={t} />}
      {isTutorialOpen && <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} lang={lang} t={t} />}

      <Toast toast={toast} />
    </div>
  );
}