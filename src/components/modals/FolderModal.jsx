import React, { useState } from 'react';

export default function FolderModal({ isOpen, t, userFolders, setUserFolders, onClose, onShowToast }) {
  const [folderName, setFolderName] = useState('');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between bg-zinc-850 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-folder-plus text-emerald-400"></i>
              <span>{t.folderModalTitle}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{t.folderModalSub}</p>
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
              placeholder={t.folderInputPlaceholder} 
              className="flex-1 bg-zinc-900 text-xs text-white p-3.5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-inner" 
            />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-5 py-3.5 rounded-2xl transition-all shadow-md cursor-pointer">
              {t.folderBtnCreate}
            </button>
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pt-2">
            {userFolders.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">{t.folderEmptyList}</p>
            ) : (
              userFolders.map(folder => (
                <div key={folder.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 shadow-inner">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <i className="fa-solid fa-folder text-emerald-400"></i>
                    </div>
                    {folder.name}
                  </span>
                  <button onClick={() => handleDeleteFolder(folder.id)} className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer">
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button onClick={onClose} className="bg-zinc-900 hover:bg-zinc-750 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all cursor-pointer">
              {t.btnDone}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}