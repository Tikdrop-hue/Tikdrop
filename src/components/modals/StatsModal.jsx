import React from 'react';

export default function StatsModal({ isOpen, t, archives = [], userFolders = [], onClose }) {
  if (!isOpen) return null;

  const totalArchives = archives.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Modal */}
        <div className="p-6 flex items-center justify-between bg-zinc-800/80 shadow-sm">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-chart-simple text-emerald-400"></i>
              <span>{t.analyticsTitle || 'Statistik & Analisis'}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">{t.analyticsSub || 'Ringkasan koleksi arsip media Anda'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-6 space-y-6 bg-zinc-800">
          
          {/* Ringkasan Statistik (2 Kartu Tanpa Status Liked) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 p-4 rounded-2xl shadow-sm hover:bg-zinc-900/80 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-film"></i>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">{totalArchives}</div>
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{t.statTotal || 'Total Video'}</div>
              </div>
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-2xl shadow-sm hover:bg-zinc-900/80 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-folder"></i>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">{userFolders.length}</div>
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{t.statFolders || 'Total Folder'}</div>
              </div>
            </div>
          </div>

          {/* Distribusi Video per Folder */}
          <div>
            <h4 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-emerald-400 text-xs"></i>
              <span>Distribusi Video</span>
            </h4>

            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
              {userFolders.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8 bg-zinc-900/30 rounded-2xl">
                  Belum ada folder untuk menampilkan distribusi.
                </p>
              ) : (
                userFolders.map(folder => {
                  const count = archives.filter(a => a.folder === folder.name).length;
                  const percent = totalArchives > 0 ? Math.round((count / totalArchives) * 100) : 0;
                  
                  // Perhitungan SVG Ring Progress
                  const radius = 18;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (percent / 100) * circumference;

                  return (
                    <div key={folder.id} className="bg-zinc-900/50 p-4 rounded-2xl shadow-sm hover:bg-zinc-900/80 transition-all flex items-center justify-between gap-4">
                      
                      {/* Informasi Folder & Progress Bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="fa-solid fa-folder text-emerald-400 text-xs"></i>
                          <span className="text-sm font-bold text-zinc-200 truncate">{folder.name}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium">
                          {count} video ({percent}%)
                        </p>
                        
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                          <div 
                            className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Statistik Lingkaran (Circular Progress) */}
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            className="text-zinc-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="transparent"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            className="text-emerald-400 transition-all duration-700 ease-out"
                            strokeWidth="3.5"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-extrabold text-zinc-200">
                          {percent}%
                        </span>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tombol Tutup */}
          <div className="pt-4 flex justify-end mt-4">
            <button onClick={onClose} className="bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer">
              {t.btnClose || 'Tutup'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}