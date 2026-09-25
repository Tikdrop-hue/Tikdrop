import React, { useState } from 'react';

export default function VideoCard({ item, viewMode, isBatchMode, isSelected, onClick }) {
  // State untuk mendeteksi apakah gambar thumbnail gagal dimuat
  const [imageError, setImageError] = useState(false);

  // Mode Tampilan List
  if (viewMode === 'list') {
    return (
      <article
        onClick={() => onClick(item.id)}
        className={`glass-card p-3.5 rounded-2xl cursor-pointer flex items-center justify-between gap-4 group border transition-all duration-300 ${
          isSelected ? 'border-brand bg-dark-800/80 shadow-glow-brand/20' : 'border-transparent hover:bg-dark-800/50'
        }`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {isBatchMode && (
            <div className="flex-shrink-0">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-xs transition-colors ${isSelected ? 'bg-brand text-slate-950' : 'bg-dark-900 text-transparent border border-dark-700'}`}>
                <i className="fa-solid fa-check"></i>
              </div>
            </div>
          )}
          
          <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-dark-950 flex-shrink-0 shadow-md">
            {/* Fallback Image & Video Handler List View */}
            {item.thumbnail && !imageError ? (
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            ) : item.videoUrl ? (
              <video 
                src={`${item.videoUrl}#t=0.1`} 
                preload="metadata"
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
              />
            ) : (
              <div className="w-full h-full bg-dark-800 flex items-center justify-center text-slate-600">
                 <i className="fa-solid fa-video-slash"></i>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
            {item.isPinned && (
              <div className="absolute top-1 left-1 bg-brand text-slate-950 p-1 rounded-md text-[9px] shadow-sm">
                <i className="fa-solid fa-thumbtack"></i>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 py-0.5">
            <h3 className="font-bold text-sm text-slate-100 truncate group-hover:text-brand transition-colors mb-1.5">
              {item.title}
            </h3>
            <div className="flex items-center gap-2.5 mb-1.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <i className={`fa-brands ${item.platform === 'instagram' ? 'fa-instagram' : 'fa-tiktok'} text-slate-500`}></i>
                {item.creator}
              </span>
              {item.folder && (
                <>
                  <span className="w-1 h-1 rounded-full bg-dark-700"></span>
                  <span className="text-[10px] text-slate-400 bg-dark-900 px-2 py-0.5 rounded-md border border-dark-800">
                    <i className="fa-solid fa-folder text-brand mr-1"></i>{item.folder}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate leading-relaxed">{item.caption || 'Tanpa deskripsi'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
          <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-slate-500 group-hover:bg-brand group-hover:text-slate-950 transition-colors">
            <i className="fa-solid fa-play text-[10px] ml-0.5"></i>
          </div>
        </div>
      </article>
    );
  }

  // Mode Tampilan Grid (Default)
  return (
    <article
      onClick={() => onClick(item.id)}
      className={`glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col group relative transition-all duration-300 border ${
        isSelected ? 'border-brand bg-dark-800/80 scale-[0.98] shadow-glow-brand/20' : 'border-transparent hover:-translate-y-1 hover:shadow-xl'
      }`}
    >
      <div className="relative w-full aspect-tiktok overflow-hidden bg-dark-950">
        
        {/* Fallback Image & Video Handler Grid View */}
        {item.thumbnail && !imageError ? (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
          />
        ) : item.videoUrl ? (
          <video 
            src={`${item.videoUrl}#t=0.1`} 
            preload="metadata"
            muted
            playsInline
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-dark-900 flex flex-col items-center justify-center text-slate-600 gap-2">
             <i className="fa-solid fa-image text-3xl opacity-50"></i>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
        
        {isBatchMode && (
          <div className="absolute top-2.5 left-2.5 z-30">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shadow-lg transition-colors ${isSelected ? 'bg-brand text-slate-950' : 'bg-dark-950/80 text-transparent border border-dark-700 backdrop-blur-md'}`}>
              <i className="fa-solid fa-check"></i>
            </div>
          </div>
        )}

        {item.isPinned && (
          <div className={`absolute top-2.5 ${isBatchMode ? 'left-10' : 'left-2.5'} bg-brand text-slate-950 p-1 px-2 rounded-md text-[9px] font-black z-10 flex items-center gap-1.5 shadow-md`}>
            <i className="fa-solid fa-thumbtack"></i> PIN
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md w-7 h-7 flex items-center justify-center rounded-lg text-white z-10 border border-white/10 shadow-sm">
          <i className={`fa-brands ${item.platform === 'instagram' ? 'fa-instagram' : 'fa-tiktok'} text-[13px]`}></i>
        </div>

        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full bg-brand text-slate-950 flex items-center justify-center font-bold shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
            <i className="fa-solid fa-play ml-1 text-base"></i>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow bg-dark-900/40 group-hover:bg-dark-900/80 transition-colors">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {item.folder && (
              <span className="text-[9px] text-brand font-extrabold truncate">
                <i className="fa-solid fa-folder mr-1"></i>{item.folder}
              </span>
            )}
          </div>
          <h3 className="font-bold text-[13px] text-slate-100 line-clamp-2 leading-relaxed group-hover:text-brand transition-colors">
            {item.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dark-800/60">
          {/* Avatar Area dengan Fallback Warna Brand (Fill Penuh, Tanpa Border) */}
          <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-[9px] text-slate-950 flex-shrink-0 overflow-hidden">
            {item.avatar ? (
              <img src={item.avatar} alt={item.creator} className="w-full h-full object-cover" />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>
          <span className="truncate font-semibold text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
            {item.creator}
          </span>
        </div>
      </div>
    </article>
  );
}