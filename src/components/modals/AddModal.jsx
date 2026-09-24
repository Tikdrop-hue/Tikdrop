import React, { useState, useEffect } from 'react';

export default function AddModal({ isOpen, t, lang, userFolders, onClose, onSave, onShowToast }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState([]); // State untuk menyimpan riwayat
  const [showHistory, setShowHistory] = useState(false); // State untuk menampilkan/menyembunyikan riwayat
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    folder: '',
    note: '',
    thumbnail: '',
    videoUrl: '',
    sound: 'Original Sound',
    caption: ''
  });

  // Muat riwayat dari localStorage saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const savedHistory = localStorage.getItem('tikDropUrlHistory');
      if (savedHistory) {
        try {
          setUrlHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Gagal memuat riwayat:", e);
        }
      }
    } else {
        setShowHistory(false); // Sembunyikan dropdown saat modal ditutup
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFetch = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      onShowToast('Masukkan URL TikTok terlebih dahulu!', 'fa-triangle-exclamation');
      return;
    }
    
    // Simpan URL ke riwayat (maksimal 5, hilangkan duplikat)
    const newHistory = [url.trim(), ...urlHistory.filter(h => h !== url.trim())].slice(0, 5);
    setUrlHistory(newHistory);
    localStorage.setItem('tikDropUrlHistory', JSON.stringify(newHistory));
    setShowHistory(false); // Sembunyikan riwayat saat mulai fetch

    setLoading(true);

    try {
      // PERUBAHAN NOMOR 1: Tembak ke Serverless Function internal Vercel kita
      // bukan lagi langsung ke https://www.tikwm.com/api/
      const apiUrl = `/api/fetch-video?url=${encodeURIComponent(url.trim())}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }

      const result = await response.json();

      // Validasi response (code === 0 menandakan ekstraksi sukses)
      if (result && result.code === 0 && result.data) {
        const data = result.data;

        // Helper untuk menyambung path jika TikWM mengembalikan URL relatif (diawali '/')
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

        // Update form state dengan data asli dari TikWM
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
      folder: '',
      note: '',
      thumbnail: '',
      videoUrl: '',
      sound: '',
      caption: ''
    });
  };

  const handleHistoryClick = (historyUrl) => {
      setUrl(historyUrl);
      setShowHistory(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-zinc-850 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-cloud-arrow-down text-emerald-400"></i>
              <span>{t?.addTitle || 'Fetch & Extract TikTok'}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{t?.addSub || 'Automatic extraction of metadata & MP4 media'}</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto no-scrollbar bg-zinc-800">
          {/* TikTok URL + Fetch Button */}
          <div className="relative">
            <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addUrlLabel || 'TikTok Video URL'}</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                  <input 
                    type="url" 
                    value={url} 
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setShowHistory(true); // Tampilkan riwayat saat mengetik
                    }}
                    onFocus={() => setShowHistory(true)} // Tampilkan riwayat saat input difokuskan
                    placeholder="https://www.tiktok.com/@user/video/..." 
                    className="w-full bg-zinc-900 text-xs text-white p-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-inner" 
                  />
                  {/* Dropdown Riwayat */}
                  {showHistory && urlHistory.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-zinc-900 rounded-xl shadow-lg border border-zinc-700/50 overflow-hidden z-10">
                          {urlHistory.map((item, index) => (
                              <div 
                                  key={index} 
                                  onClick={() => handleHistoryClick(item)}
                                  className="px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer truncate border-b border-zinc-800 last:border-b-0"
                              >
                                  {item}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
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
              className="w-full bg-zinc-900 text-xs text-white p-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-inner" 
              required 
            />
          </div>

          {/* Creator & Folder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addCreatorLabel || 'Creator'}</label>
              <input 
                type="text" 
                value={formData.creator} 
                onChange={(e) => setFormData({ ...formData, creator: e.target.value })} 
                placeholder={t?.inputCreatorPlaceholder || '@username'} 
                className="w-full bg-zinc-900 text-xs text-white p-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-inner" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2">{t?.addFolderLabel || 'Collection Folder'}</label>
              <select 
                value={formData.folder} 
                onChange={(e) => setFormData({ ...formData, folder: e.target.value })} 
                className="w-full bg-zinc-900 text-xs text-zinc-200 p-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-inner appearance-none cursor-pointer"
              >
                <option value="Umum">Umum</option>
                {userFolders && userFolders.map(f => (
                  <option key={f.id} value={f.name}>{f.name}</option>
                ))}
              </select>
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
              className="w-full bg-zinc-900 text-xs text-white p-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-inner resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-zinc-900 hover:bg-zinc-750 text-zinc-300 px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer"
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