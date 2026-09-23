import React, { useState, useRef, useEffect } from 'react';

export default function BatchBar({ 
  count, 
  t, 
  userFolders = [], 
  onDelete, 
  onMoveFolder, 
  onCancel 
}) {
  const [isFolderMenuOpen, setIsFolderMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsFolderMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-800/95 backdrop-blur-md border border-zinc-700/80 text-white px-6 py-3.5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <span className="text-xs font-extrabold bg-emerald-500 text-zinc-950 px-3 py-1 rounded-full">
        {count} {t.batchSelected || 'terpilih'}
      </span>

      <div className="h-4 w-px bg-zinc-700"></div>

      {/* Dropdown Move Folder */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsFolderMenuOpen(!isFolderMenuOpen)}
          className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-xs font-bold text-zinc-200 bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-700/50 cursor-pointer"
        >
          <i className="fa-solid fa-folder-tree text-emerald-400"></i>
          <span>{t.moveFolder || 'Pindah Folder'}</span>
          <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isFolderMenuOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {isFolderMenuOpen && (
          <div className="absolute bottom-full mb-3 left-0 w-56 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-xl p-1.5 z-50 flex flex-col gap-1">
            <button
              onClick={() => { onMoveFolder('All'); setIsFolderMenuOpen(false); }}
              className="text-left px-3.5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 rounded-xl transition-colors cursor-pointer"
            >
              Semua Video (Tanpa Folder)
            </button>
            {userFolders.length > 0 && <div className="h-px bg-zinc-800 my-0.5" />}
            {userFolders.map(f => {
              const folderId = typeof f === 'object' ? f.id : f;
              const folderName = typeof f === 'object' ? f.name : f;
              return (
                <button
                  key={folderId}
                  onClick={() => { onMoveFolder(folderId); setIsFolderMenuOpen(false); }}
                  className="text-left px-3.5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 rounded-xl transition-colors cursor-pointer truncate"
                >
                  {folderName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tombol Hapus */}
      <button
        onClick={onDelete}
        className="hover:text-red-400 transition-colors flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-2xl border border-red-500/20 cursor-pointer"
      >
        <i className="fa-solid fa-trash-can"></i>
        <span>{t.delete || 'Hapus'}</span>
      </button>

      <div className="h-4 w-px bg-zinc-700"></div>

      {/* Tombol Batal */}
      <button
        onClick={onCancel}
        className="hover:text-zinc-300 text-zinc-400 text-xs font-bold cursor-pointer"
      >
        {t.cancel || 'Batal'}
      </button>
    </div>
  );
}