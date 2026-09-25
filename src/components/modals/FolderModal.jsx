import React, { useState } from 'react';
// Sesuaikan path import supabaseClient dengan struktur folder Anda
import { supabaseClient } from '../../supabaseClient'; 

// PERBAIKAN: Tambahkan t = {} dan userFolders = [] sebagai fallback
export default function FolderModal({ isOpen, t = {}, userFolders = [], setUserFolders, onClose, onShowToast }) {
  const [folderName, setFolderName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    const trimmed = folderName.trim();
    if (!trimmed) return;
    if (userFolders.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session?.user) {
      onShowToast('Silakan login terlebih dahulu!', 'fa-lock');
      return;
    }
    
    const newId = Date.now().toString();
    
    // Optimistic UI Update
    setUserFolders([...userFolders, { id: newId, name: trimmed }]);
    setFolderName('');
    
    const { error } = await supabaseClient.from('folders').insert([
      { id: newId, user_id: session.user.id, name: trimmed }
    ]);

    if (error) {
      onShowToast('Gagal menyimpan ke database', 'fa-circle-xmark');
      setUserFolders(prev => prev.filter(f => f.id !== newId));
    } else {
      onShowToast(`Folder "${trimmed}" dibuat!`, 'fa-folder-plus');
    }
  };

  const handleDeleteFolder = async (id) => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session?.user) return;

    setUserFolders(userFolders.filter(f => f.id !== id));
    
    const { error } = await supabaseClient.from('folders').delete().eq('id', id);
    if (error) {
      onShowToast('Gagal menghapus folder', 'fa-circle-xmark');
    } else {
      onShowToast('Folder dihapus', 'fa-trash-can');
    }
  };

  const startEditing = (folder) => {
    setEditingId(folder.id);
    setEditName(folder.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleUpdateFolder = async (id) => {
    const trimmed = editName.trim();
    if (!trimmed) {
      cancelEditing();
      return;
    }
    
    if (userFolders.some(f => f.id !== id && f.name.toLowerCase() === trimmed.toLowerCase())) {
      onShowToast(`Nama folder sudah digunakan!`, 'fa-triangle-exclamation');
      return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session?.user) return;

    setUserFolders(userFolders.map(f => f.id === id ? { ...f, name: trimmed } : f));
    cancelEditing();

    const { error } = await supabaseClient.from('folders').update({ name: trimmed }).eq('id', id);
    if (error) {
      onShowToast('Gagal memperbarui nama folder', 'fa-circle-xmark');
    } else {
      onShowToast(`Nama folder diperbarui!`, 'fa-pen-to-square');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Modal */}
        <div className="p-6 flex items-center justify-between bg-zinc-800/80 shadow-sm">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-folder-plus text-emerald-400"></i>
              <span>{t.folderModalTitle || 'Kelola Folder'}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">{t.folderModalSub || 'Buat atau ubah folder koleksi Anda'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-6 space-y-5 bg-zinc-800">
          {/* Form Buat Folder Baru */}
          <form onSubmit={handleCreateFolder} className="flex gap-3">
            <input 
              type="text" 
              value={folderName} 
              onChange={(e) => setFolderName(e.target.value)} 
              placeholder={t.folderInputPlaceholder || 'Nama folder baru...'} 
              className="flex-1 bg-zinc-900/50 text-sm text-white p-3.5 rounded-2xl outline-none focus:bg-zinc-900/80 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-sm" 
            />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md cursor-pointer flex items-center gap-2">
              <i className="fa-solid fa-plus"></i>
              <span className="hidden sm:inline">{t.folderBtnCreate || 'Buat'}</span>
            </button>
          </form>

          {/* List Folder */}
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pt-2 pr-1">
            {userFolders.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8 bg-zinc-900/30 rounded-2xl">
                {t.folderEmptyList || 'Belum ada folder yang dibuat.'}
              </p>
            ) : (
              userFolders.map(folder => (
                <div key={folder.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 shadow-sm min-h-[64px] hover:bg-zinc-900/80 transition-all">
                  {editingId === folder.id ? (
                    // Tampilan Mode Edit
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        className="flex-1 bg-zinc-900/80 text-sm text-white p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500/40 shadow-sm transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateFolder(folder.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <button onClick={() => handleUpdateFolder(folder.id)} className="w-9 h-9 flex shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 transition-all cursor-pointer">
                        <i className="fa-solid fa-check text-sm"></i>
                      </button>
                      <button onClick={cancelEditing} className="w-9 h-9 flex shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer">
                        <i className="fa-solid fa-xmark text-sm"></i>
                      </button>
                    </div>
                  ) : (
                    // Tampilan Mode Normal
                    <>
                      <span className="text-sm font-bold text-zinc-200 flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center shadow-sm">
                          <i className="fa-solid fa-folder text-emerald-400"></i>
                        </div>
                        <span className="truncate pr-4">{folder.name}</span>
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => startEditing(folder)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-sky-400 hover:bg-zinc-800 transition-all cursor-pointer">
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onClick={() => handleDeleteFolder(folder.id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-all cursor-pointer">
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Tombol Selesai Bawah */}
          <div className="pt-4 flex justify-end mt-4">
            <button onClick={onClose} className="bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer">
              {t.btnDone || 'Selesai'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}