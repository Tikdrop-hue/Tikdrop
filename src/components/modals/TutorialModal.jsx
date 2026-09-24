import React, { useState } from 'react';

export default function TutorialModal({ isOpen, t, onClose }) {
  const [activeTab, setActiveTab] = useState('quickstart');

  if (!isOpen) return null;

  const tabs = [
    { id: 'quickstart', icon: 'fa-wand-magic-sparkles', title: t.tutTabQuickstart },
    { id: 'offline', icon: 'fa-box-archive', title: t.tutTabOffline },
    { id: 'backup', icon: 'fa-cloud-arrow-down', title: t.tutTabBackup },
    { id: 'privacy', icon: 'fa-shield-halved', title: t.tutTabPrivacy }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[750px]">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-zinc-850 shadow-md z-10 shrink-0">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-3">
              <i className="fa-solid fa-book-open text-emerald-400"></i>
              <span>{t.tutHelpCenterTitle}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">{t.tutHelpCenterSub}</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer shadow-inner"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Layout Konten Berbasis Flex */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Sidebar Navigasi Kiri */}
          <div className="md:w-60 bg-zinc-850/50 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto hide-scrollbar shrink-0 shadow-inner">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap md:whitespace-normal text-left ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-zinc-950' : 'text-zinc-500'} w-5 text-center`}></i>
                {tab.title}
              </button>
            ))}
          </div>

          {/* Area Konten Kanan */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto hide-scrollbar bg-zinc-900 shadow-inner">
            
            {/* KONTEN 1: MULAI CEPAT */}
            {activeTab === 'quickstart' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="text-xl font-black text-white mb-4">{t.tutHowItWorksTitle}</h4>
                <div className="space-y-4">
                  <div className="bg-zinc-800 p-5 rounded-2xl shadow-md">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                      {t.tutStep1Title}
                    </h5>
                    <p className="text-zinc-400 text-xs leading-relaxed ml-8">{t.tutStep1Desc}</p>
                  </div>
                  <div className="bg-zinc-800 p-5 rounded-2xl shadow-md">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                      {t.tutStep2Title}
                    </h5>
                    <p className="text-zinc-400 text-xs leading-relaxed ml-8">{t.tutStep2Desc}</p>
                  </div>
                  <div className="bg-zinc-800 p-5 rounded-2xl shadow-md">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
                      {t.tutStep3Title}
                    </h5>
                    <p className="text-zinc-400 text-xs leading-relaxed ml-8">{t.tutStep3Desc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* KONTEN 2: BRANKAS OFFLINE */}
            {activeTab === 'offline' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h4 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                    {t.tutOfflineTitle} 
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase px-2 py-1 rounded-lg">{t.tutPremiumBadge}</span>
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">{t.tutOfflineDesc}</p>
                </div>

                <div className="bg-zinc-800 p-5 rounded-3xl shadow-md space-y-4">
                  <h5 className="font-bold text-sm text-white mb-3">{t.tutIndicatorTitle}</h5>
                  
                  <div className="flex items-start gap-3 p-3 bg-zinc-900 rounded-2xl">
                    <i className="fa-solid fa-cloud text-blue-400 mt-0.5 text-base w-6 text-center"></i>
                    <div>
                      <h6 className="text-white text-xs font-bold mb-1">{t.tutIndCloudTitle}</h6>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">{t.tutIndCloudDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-2xl">
                    <i className="fa-solid fa-lock text-emerald-400 mt-0.5 text-base w-6 text-center"></i>
                    <div>
                      <h6 className="text-emerald-400 text-xs font-bold mb-1">{t.tutIndOfflineTitle}</h6>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">{t.tutIndOfflineDesc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-2xl">
                    <i className="fa-solid fa-skull-crossbones text-red-500 mt-0.5 text-base w-6 text-center"></i>
                    <div>
                      <h6 className="text-red-400 text-xs font-bold mb-1">{t.tutIndDeadTitle}</h6>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">{t.tutIndDeadDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KONTEN 3: BACKUP & EKSPOR */}
            {activeTab === 'backup' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="text-xl font-black text-white mb-2">{t.tutBackupTitle}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">{t.tutBackupDesc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-800 p-5 rounded-3xl shadow-md flex flex-col">
                    <div className="font-bold text-white mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-file-code text-emerald-400 text-lg"></i> Export JSON
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{t.tutExportJsonBadge}</span>
                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-1">
                      {t.tutExportJsonDesc} <br/><br/>
                      <strong className="text-zinc-300">{t.tutNoteLabel}</strong> {t.tutExportJsonNote}
                    </p>
                  </div>

                  <div className="bg-zinc-800 p-5 rounded-3xl shadow-md flex flex-col">
                    <div className="font-bold text-white mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-file-zipper text-amber-400 text-lg"></i> Export ZIP
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{t.tutExportZipBadge}</span>
                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-1">
                      {t.tutExportZipDesc}
                      <br/><br/>
                      <strong className="text-zinc-300">{t.tutNoteLabel}</strong> {t.tutExportZipNote}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* KONTEN 4: PRIVASI & DATA */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="text-xl font-black text-white mb-4">{t.tutPrivacyTitle}</h4>
                
                <div className="bg-emerald-500/10 p-5 rounded-3xl shadow-inner flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-server text-emerald-400 text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-400 mb-1">{t.tutPrivacy1Title}</h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {t.tutPrivacy1Desc}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 p-5 rounded-3xl shadow-inner flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-triangle-exclamation text-amber-400 text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-400 mb-1">{t.tutPrivacy2Title}</h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {t.tutPrivacy2Desc1}
                      <strong className="text-zinc-200">{t.tutPrivacy2Desc2}</strong>
                      {t.tutPrivacy2Desc3}
                      <br/><br/>
                      {t.tutPrivacy2Desc4}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-zinc-850 flex items-center justify-between z-10 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
          <span className="text-[10px] text-zinc-500 pl-2 font-medium">{t.tutDocsVersion}</span>
          <button 
            onClick={onClose} 
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {t.tutBtnUnderstood}
          </button>
        </div>
      </div>
    </div>
  );
}