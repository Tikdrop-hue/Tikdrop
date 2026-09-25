import React from 'react';

export default function Navbar({ 
  t, lang, searchQuery, setSearchQuery, 
  onToggleLang, onOpenAdd, onOpenFolder, onOpenStats, onOpenTutorial 
}) {
  return (
    <nav className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md pt-4 pb-2">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-800 rounded-3xl shadow-md px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg bg-zinc-900">
              <img 
                src="https://simp6.cuckcapital.cr/images4/2c19ebc4-a731-486d-ace9-f9a73266cdd6.webp" 
                alt="TikDrop Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-lg tracking-tight text-white leading-none mb-0.5">
                Tik<span className="text-emerald-400">Drop</span>
              </h1>
              <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-zinc-900/50 border border-zinc-700/40 text-sm text-white pl-10 pr-4 py-2.5 rounded-2xl outline-none focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900/80 focus:ring-1 focus:ring-emerald-500/40 transition-all duration-300 shadow-sm"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            
            {/* Panduan */}
            <button 
              onClick={onOpenTutorial} 
              className="group h-10 px-3 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <i className="fa-solid fa-circle-question text-base shrink-0"></i>
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-xs font-bold">
                {lang === 'id' ? 'Panduan' : 'Tutorial'}
              </span>
            </button>

            {/* Statistik */}
            <button 
              onClick={onOpenStats} 
              className="group h-10 px-3 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <i className="fa-solid fa-chart-simple text-base shrink-0"></i>
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-xs font-bold">
                {lang === 'id' ? 'Statistik' : 'Stats'}
              </span>
            </button>

            {/* Folder */}
            <button 
              onClick={onOpenFolder} 
              className="group h-10 px-3 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <i className="fa-solid fa-folder-plus text-base shrink-0"></i>
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-xs font-bold">
                {lang === 'id' ? 'Folder' : 'Folders'}
              </span>
            </button>

            {/* Bahasa */}
            <button 
              onClick={onToggleLang} 
              className="group h-10 px-3 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 font-black text-xs transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span className="shrink-0">{lang.toUpperCase()}</span>
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out text-xs font-bold">
                {lang === 'id' ? 'Bahasa' : 'Language'}
              </span>
            </button>

            {/* Tambah Video */}
            <button 
              onClick={onOpenAdd} 
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-2.5 rounded-2xl font-black text-xs transition-all ml-2 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
            >
              <i className="fa-solid fa-plus"></i> <span className="hidden md:inline">{t.navFetch}</span>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}