import React from 'react';

export default function Toast({ toast }) {
  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-dark-850 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-500 ease-out">
      <div className="w-7 h-7 rounded-full bg-brand text-slate-950 flex items-center justify-center font-bold text-xs shadow-glow-brand">
        <i className={`fa-solid ${toast.icon}`}></i>
      </div>
      <span className="text-xs font-semibold">{toast.message}</span>
    </div>
  );
}