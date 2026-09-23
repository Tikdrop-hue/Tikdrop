import React from 'react';

export default function StatsModal({ isOpen, t, archives, userFolders, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between bg-zinc-850 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-chart-simple text-emerald-400"></i>
              <span>{t.analyticsTitle}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{t.analyticsSub}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-6 space-y-6 bg-zinc-800">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900 p-4 rounded-2xl shadow-inner text-center">
              <div className="text-2xl font-black text-emerald-400 mb-1">{archives.length}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{t.statTotal}</div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-2xl shadow-inner text-center">
              <div className="text-2xl font-black text-amber-400 mb-1">{archives.filter(i => i.isFavorite).length}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{t.statLiked}</div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-2xl shadow-inner text-center">
              <div className="text-2xl font-black text-sky-400 mb-1">{userFolders.length}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{t.statFolders}</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-300 mb-3 px-1">Distribusi Video</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
              {userFolders.map(folder => {
                const count = archives.filter(a => a.folder === folder.name).length;
                const percent = archives.length > 0 ? Math.round((count / archives.length) * 100) : 0;
                return (
                  <div key={folder.id} className="bg-zinc-900 p-3.5 rounded-2xl shadow-inner">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-zinc-300">{folder.name}</span>
                      <span className="text-zinc-400">{count} video</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button onClick={onClose} className="bg-zinc-900 hover:bg-zinc-750 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all cursor-pointer">
              {t.btnClose}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}