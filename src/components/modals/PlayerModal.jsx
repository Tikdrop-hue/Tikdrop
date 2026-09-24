import React, { useState, useEffect, useRef } from 'react';
import localforage from 'localforage'; // Tambahan import untuk mengambil blob

export default function PlayerModal({ 
  activeVideo, 
  t, 
  lang, 
  userFolders = [], 
  onClose, 
  onTogglePin, 
  onSaveNote, 
  onMoveFolder,
  onShowToast 
}) {
  const [note, setNote] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mediaError, setMediaError] = useState(false); 
  
  // -- TAMBAHAN STATE UNTUK VAULT GUARD & OFFLINE VIDEO --
  const [localVideoUrl, setLocalVideoUrl] = useState(null);
  const [mediaStatus, setMediaStatus] = useState('Checking...');
  // -------------------------------------------------------
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (activeVideo) {
      setNote(activeVideo.note || '');
      setMediaError(false); // Reset state error saat membuka video baru
    }
  }, [activeVideo]);

  // -- TAMBAHAN LOGIKA PENGECEKAN BLOB DI INDEXEDDB --
  useEffect(() => {
    let currentObjectUrl = null;
    
    const checkOfflineMedia = async () => {
        if (activeVideo) {
            setMediaStatus('Checking...');
            try {
                // Cari blob video berdasarkan ID
                const blob = await localforage.getItem(`video_blob_${activeVideo.id}`);
                
                if (blob) {
                    // Buat link lokal untuk diputar dari blob
                    currentObjectUrl = URL.createObjectURL(blob);
                    setLocalVideoUrl(currentObjectUrl);
                    setMediaStatus('True Offline (Aman)');
                } else {
                    setLocalVideoUrl(null);
                    setMediaStatus('Online Cloud');
                }
            } catch (err) {
                console.error("Gagal memeriksa video offline:", err);
                setLocalVideoUrl(null);
                setMediaStatus('Online Cloud');
            }
        }
    };
    
    checkOfflineMedia();
    
    // Cleanup memory saat tutup modal atau ganti video agar tidak memori leak
    return () => {
        if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    };
  }, [activeVideo]);
  // ----------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!activeVideo) return null;

  const handleSave = () => {
    onSaveNote(activeVideo.id, note);
    onShowToast(lang === 'id' ? 'Catatan disimpan!' : 'Note saved!', 'fa-floppy-disk');
  };

  const handleSelectFolder = (folderId) => {
    onMoveFolder(activeVideo.id, folderId);
    setIsDropdownOpen(false);
  };

  // Mencari nama folder aktif
  const activeFolderObj = userFolders.find(f => {
    const fId = typeof f === 'object' ? f.id : f;
    const fName = typeof f === 'object' ? f.name : f;
    return fId === activeVideo.folder || fName === activeVideo.folder;
  });

  const activeFolderName = activeFolderObj 
    ? (typeof activeFolderObj === 'object' ? activeFolderObj.name : activeFolderObj)
    : (activeVideo.folder && activeVideo.folder !== 'All' ? activeVideo.folder : (lang === 'id' ? 'Semua Video (Tanpa Folder)' : 'All Videos (No Folder)'));

  let embedVideoId = activeVideo.id;
  if (activeVideo.url && activeVideo.url.includes('/video/')) {
    const match = activeVideo.url.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      embedVideoId = match[1];
    }
  }

  const directVideoSrc = activeVideo.videoUrl || activeVideo.playUrl || activeVideo.src;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 w-full max-w-5xl h-[90vh] md:h-[620px] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative border border-zinc-800/80">
        
        {/* Tombol Tutup */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-zinc-800/80 backdrop-blur-sm text-zinc-300 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-zinc-950 transition-all shadow-lg cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Pemutar Video */}
        <div className="w-full aspect-[9/16] md:aspect-auto md:w-[349px] bg-black relative flex items-center justify-center shrink-0">
          
          {/* TAMBAHAN: Indikator Vault Status Guard */}
          <div className="absolute top-4 left-4 z-20 px-2 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-white font-bold flex gap-1.5 items-center shadow-lg">
            {mediaStatus === 'True Offline (Aman)' && <i className="fa-solid fa-lock text-emerald-400"></i>}
            {mediaStatus === 'Online Cloud' && !mediaError && <i className="fa-solid fa-cloud text-blue-400"></i>}
            {mediaError && <i className="fa-solid fa-skull-crossbones text-red-500"></i>}
            <span>{mediaError ? 'Source Dead' : mediaStatus}</span>
          </div>
          {/* -------------------------------------- */}

          {/* Fallback cerdas: Jika direct video error, langsung alihkan ke Iframe */}
          {/* Memprioritaskan localVideoUrl jika ada, jika tidak, pakai directVideoSrc CDN */}
          {(localVideoUrl || directVideoSrc) && !mediaError ? (
            <video 
              src={localVideoUrl || directVideoSrc} 
              controls 
              autoPlay 
              loop
              onError={() => {
                setMediaError(true);
                setMediaStatus('Source Dead');
              }} // Deteksi jika URL video mati/403
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe 
              src={`https://www.tiktok.com/embed/v2/${embedVideoId}`} 
              className="w-full h-full"
              allowFullScreen 
              scrolling="no" 
              allow="encrypted-media;"
              title={activeVideo.title || "TikTok Video Player"}
            ></iframe>
          )}
        </div>

        {/* Informasi & Catatan */}
        <div className="flex-1 bg-zinc-900 p-6 sm:p-8 flex flex-col overflow-y-auto">
          
          <div className="mb-6">
            <h2 className="text-xl font-black text-white leading-snug tracking-tight mb-2 pr-10">
              {activeVideo.title || (lang === 'id' ? 'Tanpa Judul' : 'Untitled Video')}
            </h2>
            <div className="flex items-center gap-2">
              <span className="bg-zinc-800 text-emerald-400 px-3 py-1 rounded-lg text-sm font-semibold tracking-wide">
                @{activeVideo.creator || 'unknown'}
              </span>
              <a 
                href={activeVideo.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors cursor-pointer"
                title={lang === 'id' ? 'Buka tautan asli' : 'Open original link'}
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>

          {/* Selector Folder Modal */}
          <div className="mb-5 relative" ref={dropdownRef}>
            <label className="flex items-center text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-folder-tree mr-2"></i> 
              {lang === 'id' ? 'Pindah Folder' : 'Move Folder'}
            </label>
            
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm font-medium rounded-2xl px-5 py-3.5 flex items-center justify-between hover:border-emerald-500/50 hover:bg-black transition-all cursor-pointer outline-none shadow-inner"
            >
              <span className="truncate">{activeFolderName}</span>
              <i className={`fa-solid fa-chevron-down text-zinc-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-[105%] bg-zinc-800 border border-zinc-700/50 rounded-2xl shadow-xl overflow-hidden z-30 flex flex-col p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleSelectFolder('All')}
                  className={`text-left px-4 py-3 text-sm rounded-xl transition-all cursor-pointer ${
                    activeVideo.folder === 'All' || !activeVideo.folder 
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
                      : 'text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {lang === 'id' ? 'Semua Video (Tanpa Folder)' : 'All Videos (No Folder)'}
                </button>
                
                {userFolders.length > 0 && <div className="h-px w-full bg-zinc-700/50 my-1"></div>}
                
                <div className="max-h-48 overflow-y-auto hide-scrollbar flex flex-col gap-0.5">
                  {userFolders.map(folder => {
                    const fId = typeof folder === 'object' ? folder.id : folder;
                    const fName = typeof folder === 'object' ? folder.name : folder;
                    const isSelected = activeVideo.folder === fId || activeVideo.folder === fName;
                    
                    return (
                      <button
                        key={fId}
                        onClick={() => handleSelectFolder(fId)}
                        className={`text-left px-4 py-3 text-sm rounded-xl transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
                            : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {fName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Catatan Pribadi */}
          <div className="flex-1 flex flex-col mb-6">
            <label className="flex items-center text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-pen-to-square mr-2"></i> 
              {lang === 'id' ? 'Catatan Pribadi' : 'Personal Note'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={lang === 'id' ? 'Tulis ide, hashtag, atau catatan penting...' : 'Write ideas, hashtags, or notes...'}
              className="w-full flex-1 min-h-[120px] bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition-all shadow-inner"
            ></textarea>
          </div>

          {/* Tombol Aksi */}
          <div className="grid grid-cols-2 gap-3 mt-auto shrink-0">
            <button
              onClick={() => onTogglePin(activeVideo.id)}
              className={`py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeVideo.isPinned 
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-inner' 
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <i className={`fa-solid fa-thumbtack ${activeVideo.isPinned ? '-rotate-45' : ''} transition-transform`}></i> 
              {activeVideo.isPinned ? (lang === 'id' ? 'Lepas Sematan' : 'Unpin') : (lang === 'id' ? 'Sematkan Video' : 'Pin Video')}
            </button>
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <i className="fa-solid fa-floppy-disk"></i> {lang === 'id' ? 'Simpan Catatan' : 'Save Note'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}