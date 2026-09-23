import React from 'react';

export default function EmptyState({ t, onOpenAdd }) {
  return (
    <div className="bg-zinc-800 rounded-3xl p-12 md:p-16 text-center shadow-lg my-6 flex flex-col items-center justify-center min-h-[380px]">
      <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-emerald-400 text-3xl mb-6 shadow-inner">
        <i className="fa-solid fa-folder-open"></i>
      </div>
      <h3 className="text-xl font-black text-white mb-2">{t.emptyTitle || 'Vault is Empty'}</h3>
      <p className="text-xs text-zinc-400 max-w-md mb-8 leading-relaxed">
        {t.emptySub || 'No TikTok videos saved yet. Click the Fetch Video button to start archiving your first video!'}
      </p>
      <button 
        onClick={onOpenAdd} 
        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
      >
        <i className="fa-solid fa-cloud-arrow-down"></i>
        <span>{t.btnFetchFirst || 'Fetch First Video'}</span>
      </button>
    </div>
  );
}