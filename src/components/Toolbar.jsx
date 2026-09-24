import React, { useState, useRef, useEffect } from 'react';

export default function Toolbar({
  t, userFolders, activeFolder, setActiveFolder,
  showFavoritesOnly, filteredCount,
  isBatchMode, setIsBatchMode,
  viewMode, setViewMode,
  sortOrder, setSortOrder,
  onResetFilters
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const folderDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(event.target)) {
        setIsFolderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-zinc-800 p-4 rounded-3xl shadow-sm">
      
      {/* Folder Dropdown Selector (Clean, Soft & Professional with Animation) */}
      <div className="relative w-full md:w-auto min-w-[220px]" ref={folderDropdownRef}>
        <button
          onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
          className="flex items-center justify-between w-full gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer outline-none"
        >
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-folder text-emerald-400"></i>
            <span className="text-zinc-200 font-medium text-sm truncate">
              {activeFolder === 'All' ? 'All' : userFolders.find(f => f.id === activeFolder)?.name || 'All'}
            </span>
          </div>
          <i className={`fa-solid fa-chevron-down text-[10px] text-zinc-500 transition-transform duration-300 ${isFolderDropdownOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {/* Animated Dropdown Menu */}
        <div 
          className={`absolute left-0 top-full mt-2 w-full bg-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 p-1 transition-all duration-300 origin-top ${
            isFolderDropdownOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <button
            onClick={() => { setActiveFolder('All'); setIsFolderDropdownOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all cursor-pointer ${
              activeFolder === 'All' ? 'bg-zinc-900/80 text-emerald-400 font-medium' : 'text-zinc-300 hover:bg-zinc-700/50'
            }`}
          >
            All
          </button>
          {userFolders.map(folder => (
            <button
              key={folder.id}
              onClick={() => { setActiveFolder(folder.id); setIsFolderDropdownOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all cursor-pointer ${
                activeFolder === folder.id ? 'bg-zinc-900/80 text-emerald-400 font-medium' : 'text-zinc-300 hover:bg-zinc-700/50'
              }`}
            >
              {folder.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Custom Dropdown Sort - Diserasikan bg-nya */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900/80 text-zinc-300 text-sm font-medium px-4 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer outline-none"
          >
            {sortOrder === 'newest' ? t.sortNewest || 'Newest' : t.sortOldest || 'Oldest'}
            <i className={`fa-solid fa-chevron-down text-xs text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-zinc-800 border border-zinc-700/50 rounded-2xl shadow-xl overflow-hidden z-50 p-1">
              <button
                onClick={() => { setSortOrder('newest'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all cursor-pointer ${
                  sortOrder === 'newest' ? 'bg-zinc-900/80 text-emerald-400 font-semibold' : 'text-zinc-300 hover:bg-zinc-700/50'
                }`}
              >
                {t.sortNewest || 'Newest'}
              </button>
              <button
                onClick={() => { setSortOrder('oldest'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all cursor-pointer ${
                  sortOrder === 'oldest' ? 'bg-zinc-900/80 text-emerald-400 font-semibold' : 'text-zinc-300 hover:bg-zinc-700/50'
                }`}
              >
                {t.sortOldest || 'Oldest'}
              </button>
            </div>
          )}
        </div>

        {/* View Mode Toggles - Diserasikan bg-nya */}
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
              viewMode === 'grid' ? 'bg-zinc-900 text-emerald-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
            }`}
          >
            <i className="fa-solid fa-border-all"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
              viewMode === 'list' ? 'bg-zinc-900 text-emerald-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
            }`}
          >
            <i className="fa-solid fa-list"></i>
          </button>
        </div>

        {/* Batch Action Toggle - Diserasikan bg-nya saat tidak aktif */}
        <button
          onClick={() => setIsBatchMode(!isBatchMode)}
          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
            isBatchMode 
              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20' 
              : 'bg-zinc-900/50 hover:bg-zinc-900/80 text-zinc-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-check-double"></i> 
          <span className="hidden sm:inline">Batch Action</span>
        </button>
        
      </div>
    </div>
  );
}