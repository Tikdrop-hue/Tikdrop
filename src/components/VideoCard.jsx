import React from 'react';

export default function VideoCard({ item, viewMode, isBatchMode, isSelected, onClick }) {
  if (viewMode === 'list') {
    return (
      <article
        onClick={() => onClick(item.id)}
        className={`glass-card p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-4 group ${
          isSelected ? 'ring-2 ring-brand bg-dark-800' : ''
        }`}
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {isBatchMode && (
            <div className="p-1">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-xs ${isSelected ? 'bg-brand text-slate-950 shadow-glow-brand' : 'bg-dark-750 text-transparent border border-dark-700'}`}>
                <i className="fa-solid fa-check"></i>
              </div>
            </div>
          )}
          <div className="relative w-14 h-18 rounded-xl overflow-hidden bg-dark-950 flex-shrink-0">
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            {item.isPinned && (
              <div className="absolute top-1 left-1 bg-brand text-slate-950 p-1 rounded-md text-[9px]">
                <i className="fa-solid fa-thumbtack"></i>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] text-slate-300 font-bold">{item.creator}</span>
              {item.folder && (
                <span className="text-[10px] text-slate-400 bg-dark-900 px-2 py-0.5 rounded-md border border-dark-800">
                  <i className="fa-solid fa-folder text-brand mr-1"></i>{item.folder}
                </span>
              )}
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-brand transition-colors">{item.title}</h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.caption || 'Tanpa deskripsi'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <i className="fa-solid fa-chevron-right text-slate-600 text-xs mr-2"></i>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onClick(item.id)}
      className={`glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col group relative ${
        isSelected ? 'ring-2 ring-brand bg-dark-800 scale-[0.98]' : ''
      }`}
    >
      <div className="relative w-full aspect-tiktok overflow-hidden bg-dark-950">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        
        {isBatchMode && (
          <div className="absolute top-2.5 left-2.5 z-30">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shadow-lg ${isSelected ? 'bg-brand text-slate-950 scale-110 shadow-glow-brand' : 'bg-dark-950/80 text-transparent border border-dark-700 backdrop-blur-md'}`}>
              <i className="fa-solid fa-check"></i>
            </div>
          </div>
        )}

        {item.isPinned && (
          <div className={`absolute top-2.5 ${isBatchMode ? 'left-10' : 'left-2.5'} bg-brand text-slate-950 p-1 px-2 rounded-md text-[9px] font-black z-10 flex items-center gap-1 shadow-md`}>
            <i className="fa-solid fa-thumbtack"></i> PIN
          </div>
        )}

        <div className="absolute bottom-2.5 right-2.5 bg-dark-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-bold text-white z-10 border border-dark-800">
          {item.duration || '0:30'}
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-brand text-slate-950 flex items-center justify-center font-bold shadow-glow-brand transform scale-90 group-hover:scale-100 transition-transform">
            <i className="fa-solid fa-play ml-0.5 text-sm"></i>
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {item.folder && (
              <span className="text-[9px] text-brand font-extrabold truncate">
                <i className="fa-solid fa-folder mr-1"></i>{item.folder}
              </span>
            )}
          </div>
          <h3 className="font-bold text-xs text-white line-clamp-2 leading-snug group-hover:text-brand transition-colors">
            {item.title}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-dark-800 text-[10px] text-slate-400">
          <span className="truncate font-semibold text-slate-300">{item.creator}</span>
        </div>
      </div>
    </article>
  );
}