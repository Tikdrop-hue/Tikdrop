import React, { useState } from 'react';

export default function FolderModal({ isOpen, t, userFolders, setUserFolders, onClose, onShowToast }) {
  const [folderName, setFolderName] = useState('');
  // State baru untuk fitur edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleCreateFolder = (e) => {
    e.preventDefault();
    const trimmed = folderName.trim();
    if (!trimmed) return;
    if (userFolders.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) return;
    
    setUserFolders([...userFolders, { id: Date.now().toString(), name: trimmed }]);
    setFolderName('');
    onShowToast(`Folder "${trimmed}" dibuat!`, 'fa-folder-plus');
  };

  const handleDeleteFolder = (id) => {
    setUserFolders(userFolders.filter(f => f.id !== id));
  };

  // Fungsi untuk memulai mode edit
  const startEditing = (folder) => {
    setEditingId(folder.id);
    setEditName(folder.name);
  };

  // Fungsi untuk membatalkan edit
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  // Fungsi untuk menyimpan perubahan nama folder
  const handleUpdateFolder = (id) => {
    const trimmed = editName.trim();
    if (!trimmed) {
      cancelEditing();
      return;
    }
    
    // Cek apakah nama baru sudah dipakai oleh folder lain
    if (userFolders.some(f => f.id !== id && f.name.toLowerCase() === trimmed.toLowerCase())) {
      onShowToast(`Nama folder sudah digunakan!`, 'fa-triangle-exclamation');
      return;
    }

    setUserFolders(userFolders.map(f => f.id === id ? { ...f, name: trimmed } : f));
    onShowToast(`Nama folder diperbarui!`, 'fa-pen-to-square');
    cancelEditing();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between bg-zinc-850 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-folder-plus text-emerald-400"></i>
              <span>{t.folderModalTitle || 'Kelola Folder'}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{t.folderModalSub || 'Buat atau ubah folder koleksi Anda'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-6 space-y-5 bg-zinc-800">
          <form onSubmit={handleCreateFolder} className="flex gap-2">
            <input 
              type="text" 
              value={folderName} 
              onChange={(e) => setFolderName(e.target.value)} 
              placeholder={t.folderInputPlaceholder || 'Nama folder baru...'} 
              className="flex-1 bg-zinc-900 text-xs text-white p-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-inner" 
            />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-5 py-3.5 rounded-2xl transition-all shadow-md cursor-pointer">
              {t.folderBtnCreate || 'Buat'}
            </button>
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pt-2">
            {userFolders.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">{t.folderEmptyList || 'Belum ada folder.'}</p>
            ) : (
              userFolders.map(folder => (
                <div key={folder.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 shadow-inner min-h-[64px]">
                  {editingId === folder.id ? (
                    // Tampilan Mode Edit
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        className="flex-1 bg-zinc-800 text-xs text-white p-2.5 rounded-xl border border-zinc-700 outline-none focus:border-emerald-500/50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateFolder(folder.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <button onClick={() => handleUpdateFolder(folder.id)} className="w-8 h-8 flex shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 transition-all cursor-pointer">
                        <i className="fa-solid fa-check text-xs"></i>
                      </button>
                      <button onClick={cancelEditing} className="w-8 h-8 flex shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer">
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    </div>
                  ) : (
                    // Tampilan Mode Normal
                    <>
                      <span className="text-xs font-bold text-zinc-200 flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center">
                          <i className="fa-solid fa-folder text-emerald-400"></i>
                        </div>
                        <span className="truncate">{folder.name}</span>
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => startEditing(folder)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-sky-400 transition-all cursor-pointer">
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onClick={() => handleDeleteFolder(folder.id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer">
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button onClick={onClose} className="bg-zinc-900 hover:bg-zinc-750 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all cursor-pointer">
              {t.btnDone || 'Selesai'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}