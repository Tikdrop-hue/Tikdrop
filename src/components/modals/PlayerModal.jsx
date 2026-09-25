import React, { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';

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
  const [localVideoUrl, setLocalVideoUrl] = useState(null);
  const [mediaStatus, setMediaStatus] = useState('Checking...');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const dropdownRef = useRef(null);

  // Ambil URL dari database
  const directVideoSrc = activeVideo?.video_url || activeVideo?.videoUrl || activeVideo?.thumbnail;
  
  // Deteksi otomatis seperti di Streaming.jsx
  const isDirectVideo = directVideoSrc && typeof directVideoSrc === 'string' && (
    directVideoSrc.toLowerCase().includes('.mp4') || 
    directVideoSrc.toLowerCase().includes('.webm') || 
    directVideoSrc.toLowerCase().includes('.ogg')
  );

  const isPinned = activeVideo?.is_pinned ?? activeVideo?.isPinned ?? false;

  useEffect(() => {
    if (activeVideo) {
      setNote(activeVideo.note || '');
      setMediaError(false);
    }
  }, [activeVideo]);

  useEffect(() => {
    let currentObjectUrl = null;
    const checkOfflineMedia = async () => {
      if (activeVideo) {
        setMediaStatus('Checking...');
        try {
          const blob = await localforage.getItem(`video_blob_${activeVideo.id}`);
          if (blob) {
            currentObjectUrl = URL.createObjectURL(blob);
            setLocalVideoUrl(currentObjectUrl);
            setMediaStatus('True Offline (Aman)');
          } else {
            setLocalVideoUrl(null);
            setMediaStatus(isDirectVideo ? 'Online Cloud' : 'Embed Mode');
          }
        } catch (err) {
          console.error("Gagal memeriksa video offline:", err);
          setLocalVideoUrl(null);
          setMediaStatus(isDirectVideo ? 'Online Cloud' : 'Embed Mode');
        }
      }
    };
    checkOfflineMedia();
    return () => {
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    };
  }, [activeVideo, isDirectVideo]);

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

  const handleDownloadPhysical = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    onShowToast(lang === 'id' ? 'Menyiapkan file video...' : 'Preparing video file...', 'fa-spinner fa-spin');
    
    try {
      let blob = await localforage.getItem(`video_blob_${activeVideo.id}`);
      let targetUrl = directVideoSrc;

      // Jika URL qu.ax bukan raw file, kita coba tambahkan .mp4 khusus untuk download
      if (!isDirectVideo && targetUrl.includes('qu.ax')) {
        targetUrl += '.mp4';
      }

      if (!blob && targetUrl) {
         const proxyUrl = `/api/download-video?videoUrl=${encodeURIComponent(targetUrl)}`;
         const response = await fetch(proxyUrl);
         if (!response.ok) throw new Error('Gagal dari proxy');
         blob = await response.blob();
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeCreator = activeVideo.creator ? activeVideo.creator.replace(/[^a-zA-Z0-9]/g, '') : 'creator';
        a.download = `Vault_${safeCreator}_${activeVideo.id}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onShowToast(lang === 'id' ? 'Video berhasil diunduh ke perangkat!' : 'Video downloaded to device!', 'fa-check');
      } else {
        throw new Error("Blob tidak ditemukan");
      }
    } catch (err) {
      console.error(err);
      onShowToast(lang === 'id' ? 'Gagal mengunduh video.' : 'Failed to download video.', 'fa-triangle-exclamation');
    } finally {
      setIsDownloading(false);
    }
  };

  const currentFolderIdentifier = activeVideo.folder_id || activeVideo.folder;

  const activeFolderObj = userFolders.find(f => {
    const fId = typeof f === 'object' ? f.id : f;
    const fName = typeof f === 'object' ? f.name : f;
    return fId === currentFolderIdentifier || fName === currentFolderIdentifier;
  });

  const activeFolderName = activeFolderObj 
    ? (typeof activeFolderObj === 'object' ? activeFolderObj.name : activeFolderObj)
    : (currentFolderIdentifier && currentFolderIdentifier !== 'All' ? currentFolderIdentifier : (lang === 'id' ? 'Semua Video (Tanpa Folder)' : 'All Videos (No Folder)'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 w-full max-w-4xl h-[90vh] md:h-[660px] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative border border-zinc-800/80">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-zinc-800/80 backdrop-blur-sm text-zinc-300 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-zinc-950 transition-all duration-300 shadow-lg cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="w-full aspect-[9/16] md:aspect-auto md:w-[371px] bg-black relative flex items-center justify-center shrink-0 overflow-hidden">
          
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-white font-bold flex gap-1.5 items-center shadow-lg">
            {mediaStatus === 'True Offline (Aman)' && <i className="fa-solid fa-lock text-emerald-400"></i>}
            {mediaStatus === 'Online Cloud' && !mediaError && <i className="fa-solid fa-cloud text-blue-400"></i>}
            {mediaStatus === 'Embed Mode' && !mediaError && <i className="fa-solid fa-window-restore text-purple-400"></i>}
            {mediaError && <i className="fa-solid fa-skull-crossbones text-red-500"></i>}
            <span>{mediaError ? 'Source Dead' : mediaStatus}</span>
          </div>

          {!mediaError && directVideoSrc ? (
            isDirectVideo || localVideoUrl ? (
              <video 
                src={localVideoUrl || directVideoSrc} 
                controls 
                autoPlay 
                loop
                playsInline
                referrerPolicy="no-referrer"
                onError={() => { setMediaError(true); setMediaStatus('Source Blocked / Dead'); }} 
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <iframe
                src={directVideoSrc}
                title={activeVideo.title || 'Video Player'}
                className="w-full h-full object-contain border-none bg-black"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 p-6 text-center">
                <i className="fa-solid fa-video-slash text-4xl mb-3"></i>
                <p className="text-sm font-medium">Media tidak tersedia.</p>
                {directVideoSrc && (
                  <a
                    href={directVideoSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 px-3 py-1.5 bg-zinc-800 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-zinc-700 transition flex items-center gap-1.5"
                  >
                    <span>Buka Tautan Langsung</span>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 bg-zinc-900 p-6 sm:p-7 flex flex-col overflow-y-auto">
          
          <div className="mb-5">
            <h2 className="text-xl font-black text-white leading-snug tracking-tight mb-2 pr-10 line-clamp-2">
              {activeVideo.title || (lang === 'id' ? 'Tanpa Judul' : 'Untitled Video')}
            </h2>
            <div className="flex items-center gap-2">
              <span className="bg-zinc-800/60 border border-zinc-700/30 text-emerald-400 px-3 py-1 rounded-lg text-sm font-semibold tracking-wide">
                {activeVideo.creator?.startsWith('@') ? activeVideo.creator : `@${activeVideo.creator || 'unknown'}`}
              </span>
              {directVideoSrc && (
                <a 
                  href={directVideoSrc} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors cursor-pointer"
                  title={lang === 'id' ? 'Buka tautan asli' : 'Open original link'}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              )}
            </div>
          </div>

          <div className="mb-5 relative" ref={dropdownRef}>
            <label className="flex items-center text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-folder-tree mr-2"></i> 
              {lang === 'id' ? 'Pindah Folder' : 'Move Folder'}
            </label>
            
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-zinc-800/50 border border-zinc-700/40 text-zinc-200 text-sm font-medium rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-zinc-800/80 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer outline-none shadow-sm"
            >
              <span className="truncate">{activeFolderName}</span>
              <i className={`fa-solid fa-chevron-down text-zinc-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-[105%] bg-zinc-800 border border-zinc-700/50 rounded-2xl shadow-xl overflow-hidden z-30 flex flex-col p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleSelectFolder('All')}
                  className={`text-left px-4 py-2.5 text-sm rounded-xl transition-all cursor-pointer ${
                    !currentFolderIdentifier || currentFolderIdentifier === 'All'
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold' 
                      : 'text-zinc-300 hover:bg-zinc-700/50'
                  }`}
                >
                  {lang === 'id' ? 'Semua Video (Tanpa Folder)' : 'All Videos (No Folder)'}
                </button>
                
                {userFolders.length > 0 && <div className="h-px w-full bg-zinc-700/50 my-1"></div>}
                
                <div className="max-h-40 overflow-y-auto hide-scrollbar flex flex-col gap-0.5">
                  {userFolders.map(folder => {
                    const fId = typeof folder === 'object' ? folder.id : folder;
                    const fName = typeof folder === 'object' ? folder.name : folder;
                    const isSelected = currentFolderIdentifier === fId || currentFolderIdentifier === fName;
                    
                    return (
                      <button
                        key={fId}
                        onClick={() => handleSelectFolder(fId)}
                        className={`text-left px-4 py-2.5 text-sm rounded-xl transition-all cursor-pointer ${
                          isSelected ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-zinc-300 hover:bg-zinc-700/50'
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

          <div className="flex-1 flex flex-col mb-5">
            <label className="flex items-center text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-pen-to-square mr-2"></i> 
              {lang === 'id' ? 'Catatan Pribadi' : 'Personal Note'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={lang === 'id' ? 'Tulis ide, hashtag, atau catatan penting...' : 'Write ideas, hashtags, or notes...'}
              className="w-full flex-1 min-h-[90px] bg-zinc-800/50 border border-zinc-700/40 text-zinc-200 text-sm rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:bg-zinc-800/80 focus:ring-1 focus:ring-emerald-500 resize-none transition-all duration-300 shadow-sm"
            ></textarea>
          </div>

          <div className="mt-auto shrink-0 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onTogglePin(activeVideo.id)}
                className={`py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                  isPinned 
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-inner' 
                    : 'bg-zinc-800/50 border border-zinc-700/40 text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <i className={`fa-solid fa-thumbtack ${isPinned ? '-rotate-45' : ''} transition-transform`}></i> 
                {isPinned ? (lang === 'id' ? 'Lepas Sematan' : 'Unpin') : (lang === 'id' ? 'Sematkan Video' : 'Pin Video')}
              </button>
              <button
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <i className="fa-solid fa-floppy-disk"></i> {lang === 'id' ? 'Simpan Catatan' : 'Save Note'}
              </button>
            </div>
            
            <button
              onClick={handleDownloadPhysical}
              disabled={isDownloading}
              className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer border 
                ${isDownloading 
                  ? 'bg-zinc-800/40 border border-zinc-800/50 text-zinc-500 cursor-not-allowed' 
                  : 'bg-zinc-800/50 border-zinc-700/40 text-zinc-300 hover:bg-zinc-800/80 hover:text-white'}`}
            >
              <i className={`fa-solid ${isDownloading ? 'fa-spinner fa-spin' : 'fa-download'}`}></i> 
              {isDownloading ? (lang === 'id' ? 'Mengunduh...' : 'Downloading...') : (lang === 'id' ? 'Unduh ke Perangkat' : 'Download to Device')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
