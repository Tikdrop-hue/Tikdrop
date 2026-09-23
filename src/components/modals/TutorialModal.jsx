import React from 'react';

export default function TutorialModal({ isOpen, t, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="p-6 flex items-center justify-between bg-zinc-850 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <i className="fa-solid fa-book-open text-emerald-400"></i>
              <span>{t.tutHeaderTitle}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{t.tutHeaderSub}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar text-xs text-zinc-300 leading-relaxed bg-zinc-800">
          <section className="space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-emerald-400"></i> {t.tutSec1Title}
            </h4>
            <p className="text-zinc-400 pl-6">{t.tutSec1Desc}</p>
          </section>

          <section className="space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-amber-400"></i> {t.tutSec2Title}
            </h4>
            <div className="ml-6 p-4 rounded-2xl bg-zinc-900 shadow-inner space-y-2">
              <h5 className="font-bold text-amber-400 flex items-center gap-1.5"><i className="fa-solid fa-triangle-exclamation"></i> {t.tutSec2NoticeTitle}</h5>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{t.tutSec2Point1} {t.tutSec2Point2}</p>
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <i className="fa-solid fa-database text-sky-400"></i> {t.tutSec3Title}
            </h4>
            <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-900 p-4 rounded-2xl shadow-inner">
                <div className="font-bold text-white mb-1.5 flex items-center gap-2"><i className="fa-solid fa-file-export text-emerald-400"></i> Export Data</div>
                <p className="text-zinc-400 text-[11px]">{t.tutExportDesc}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-2xl shadow-inner">
                <div className="font-bold text-white mb-1.5 flex items-center gap-2"><i className="fa-solid fa-file-import text-sky-400"></i> Import Data</div>
                <p className="text-zinc-400 text-[11px]">{t.tutImportDesc}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-5 bg-zinc-850 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 pl-2">{t.tutFooterNote}</span>
          <button onClick={onClose} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-8 py-3 rounded-2xl transition-all shadow-md cursor-pointer">
            {t.tutBtnUnderstood}
          </button>
        </div>
      </div>
    </div>
  );
}