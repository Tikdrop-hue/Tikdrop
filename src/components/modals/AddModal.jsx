import React, { useState, useEffect } from 'react';

export default function AddModal({ isOpen, t, lang, userFolders, onClose, onSave, onShowToast }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State untuk menyimpan riwayat Creator
  const [creatorHistory, setCreatorHistory] = useState([]); 
  const [showCreatorHistory, setShowCreatorHistory] = useState(false); 

  // State untuk Custom Dropdown Folder
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    folder: 'Umum',
    note: '',
    thumbnail: '',
    videoUrl: '',
    sound: 'Original Sound',
    caption: ''
  });

  // Muat riwayat dari localStorage saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const savedHistory = localStorage.getItem('tikDropCreatorHistory');
      if (savedHistory) {
        try {
          setCreatorHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Gagal memuat riwayat:", e);
        }
      }
    } else {
        setShowCreatorHistory(false); 
        setIsFolderOpen(false); // Reset dropdown folder saat modal tutup
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFetch = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      onShowToast('Masukkan URL TikTok terlebih dahulu!', 'fa-triangle-exclamation');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `/api/fetch-video?url=${encodeURIComponent(url.trim())}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.code === 0 && result.data) {
        const data = result.data;

        const fixUrl = (path) => {
          if (!path) return '';
          return path.startsWith('/') ? `https://www.tikwm.com${path}` : path;
        };

        const extractedTitle = data.title || 'Video TikTok';
        const extractedCreator = `@${data.author?.unique_id || data.author?.nickname || 'tiktok_user'}`;
        const extractedThumbnail = fixUrl(data.cover || data.origin_cover);
        const extractedVideo = fixUrl(data.play || data.wmplay);
        const extractedSound = data.music_info?.title 
          ? `${data.music_info.title} - ${data.music_info.author}` 
          : (data.music || 'Original Sound');

        setFormData(prev => ({
          ...prev,
          title: extractedTitle,
          creator: extractedCreator,
          folder: prev.folder || (userFolders && userFolders[0]?.name) || 'Umum',
          thumbnail: extractedThumbnail,
          videoUrl: extractedVideo,
          sound: extractedSound,
          caption: extractedTitle
        }));

        onShowToast('Metadata berhasil diekstrak!', 'fa-wand-magic-sparkles');
      } else {
        throw new Error(result.msg || 'URL tidak valid atau video bersifat privat');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      onShowToast('Gagal mengambil data. Pastikan link TikTok valid.', 'fa-circle-xmark');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (formData.creator.trim()) {
        const newHistory = [formData.creator.trim(), ...creatorHistory.filter(h => h !== formData.creator.trim())].slice(0, 5);
        setCreatorHistory(newHistory);
        localStorage.setItem('tikDropCreatorHistory', JSON.stringify(newHistory));
    }

    const newVideo = { 
      ...formData, 
      id: Date.now().toString(), 
      duration: '0:30', 
      date: new Date().toLocaleDateString(), 
      isFavorite: false, 
      isPinned: false 
    };

    onSave(newVideo);
    setUrl('');
    setFormData({
      title: '',
      creator: '',
      folder: 'Umum',
      note: '',
      thumbnail: '',
      videoUrl: '',
      sound: '',
      caption: ''
    });
  };

  const handleCreatorHistoryClick = (historyCreator) => {
      setFormData({ ...formData, creator: historyCreator });
      setShowCreatorHistory(false);
  };

  const handleSelectFolder = (folderName) => {
    setFormData({ ...formData, folder: folderName });
    setIsFolderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Modal */}
        <div className="p-6 flex items-center justify-between bg-zinc-800/80 shadow-sm">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-cloud-arrow-down text-emerald-400"></i>
              <span>{t?.addTitle || 'Fetch & Extract TikTok'}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">{t?.addSub || 'Automatic extraction of metadata & MP4 media'}</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-2xl bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto no-scrollbar bg-zinc-800">
          
          {/* TikTok URL + Fetch Button */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addUrlLabel || 'TikTok Video URL'}</label>
            <div className="flex gap-2">
              <input 
                type="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/..." 
                className="flex-1 bg-zinc-900/50 text-xs text-white p-3.5 rounded-2xl outline-none focus:bg-zinc-900/80 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-sm" 
              />
              <button 
                type="button" 
                onClick={handleFetch} 
                disabled={loading} 
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
              >
                {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
              </button>
            </div>
          </div>

          {/* Video Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addTitleLabel || 'Video Title'}</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              placeholder={t?.inputTitlePlaceholder || 'TikTok video title...'} 
              className="w-full bg-zinc-900/50 text-xs text-white p-3.5 rounded-2xl outline-none focus:bg-zinc-900/80 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-sm" 
              required 
            />
          </div>

          {/* Creator & Folder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Creator Input dengan Riwayat */}
            <div className="relative">
              <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addCreatorLabel || 'Creator'}</label>
              <div className="relative">
                  <input 
                    type="text" 
                    value={formData.creator} 
                    onChange={(e) => {
                        setFormData({ ...formData, creator: e.target.value });
                        setShowCreatorHistory(true);
                    }} 
                    onFocus={() => setShowCreatorHistory(true)}
                    onBlur={() => setTimeout(() => setShowCreatorHistory(false), 200)}
                    placeholder={t?.inputCreatorPlaceholder || '@username'} 
                    className="w-full bg-zinc-900/50 text-xs text-white p-3.5 rounded-2xl outline-none focus:bg-zinc-900/80 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-sm" 
                  />
                  {/* Dropdown Riwayat Creator */}
                  {showCreatorHistory && creatorHistory.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-zinc-900 rounded-2xl shadow-xl overflow-hidden z-10 border-none">
                          {creatorHistory.map((item, index) => (
                              <div 
                                  key={index} 
                                  onClick={() => handleCreatorHistoryClick(item)}
                                  className="px-4 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer truncate transition-all"
                              >
                                  {item}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
            </div>

            {/* Custom Soft Dropdown Folder */}
            <div className="relative">
              <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addFolderLabel || 'Collection Folder'}</label>
              
              <button
                type="button"
                onClick={() => setIsFolderOpen(!isFolderOpen)}
                className="w-full bg-zinc-900/50 text-xs text-zinc-200 p-3.5 rounded-2xl outline-none focus:bg-zinc-900/80 flex items-center justify-between cursor-pointer transition-all shadow-sm"
              >
                <span className="truncate">{formData.folder || 'Umum'}</span>
                <i className={`fa-solid fa-chevron-down text-zinc-400 text-[10px] transition-transform duration-200 ${isFolderOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Menu Options Custom Dropdown */}
              {isFolderOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-full bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden z-20 border-none p-1 space-y-0.5">
                  <div 
                    onClick={() => handleSelectFolder('Umum')}
                    className={`px-4 py-2.5 text-xs rounded-xl cursor-pointer transition-all ${formData.folder === 'Umum' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'}`}
                  >
                    Umum
                  </div>
                  {userFolders && userFolders.map(f => (
                    <div 
                      key={f.id}
                      onClick={() => handleSelectFolder(f.name)}
                      className={`px-4 py-2.5 text-xs rounded-xl cursor-pointer transition-all ${formData.folder === f.name ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'}`}
                    >
                      {f.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addNoteLabel || 'Additional Note'}</label>
            <textarea 
              rows="3" 
              value={formData.note} 
              onChange={(e) => setFormData({ ...formData, note: e.target.value })} 
              placeholder={t?.inputNotePlaceholder || 'Personal notes...'} 
              className="w-full bg-zinc-900/50 text-xs text-white p-3.5 rounded-2xl outline-none focus:bg-zinc-900/80 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-sm resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              {t?.btnCancel || 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer"
            >
              {t?.btnSaveVault || 'Save to Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}