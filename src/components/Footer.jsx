import React, { useRef } from 'react';

export default function Footer({ t, lang, onExportJSON, onImportJSON, onExportZIP }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (onImportJSON) {
          onImportJSON(parsedData);
        }
      } catch (error) {
        console.error("Invalid JSON file", error);
        alert(lang === 'id' ? "File JSON tidak valid atau rusak." : "Invalid or corrupted JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input agar bisa memilih file yang sama lagi jika diperlukan
    e.target.value = null;
  };

  return (
    <footer className="mt-12 py-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-zinc-400 bg-zinc-800 rounded-3xl shadow-md px-8">
      <div className="flex items-center gap-3">
        {/* Latar ikon logo disesuaikan menjadi soft */}
        <div className="w-6 h-6 rounded-lg overflow-hidden bg-zinc-900/50 flex items-center justify-center">
          <img 
            src="https://simp6.cuckcapital.cr/images4/2c19ebc4-a731-486d-ace9-f9a73266cdd6.webp" 
            alt="Logo Footer" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-zinc-300">Tik<span className="text-emerald-400">Drop</span> Vault &copy; {new Date().getFullYear()}</span>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Hidden File Input untuk Import */}
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        
        {/* Tombol-tombol diubah menjadi bg-zinc-900/50 dan hover:bg-zinc-900/80 */}
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="flex items-center gap-2 cursor-pointer bg-zinc-900/50 px-5 py-2.5 rounded-2xl shadow-sm font-bold text-zinc-300 hover:text-sky-400 hover:bg-zinc-900/80 transition-all duration-300"
        >
          <i className="fa-solid fa-cloud-arrow-up text-sky-400"></i> {lang === 'id' ? 'Import JSON' : 'Import JSON'}
        </button>

        <button 
          onClick={onExportJSON} 
          className="flex items-center gap-2 cursor-pointer bg-zinc-900/50 px-5 py-2.5 rounded-2xl shadow-sm font-bold text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900/80 transition-all duration-300"
        >
          <i className="fa-solid fa-file-code text-emerald-400"></i> {t.footerBackupJson || (lang === 'id' ? 'Export Data (JSON)' : 'Export Data (JSON)')}
        </button>
        
        <button 
          onClick={onExportZIP} 
          className="flex items-center gap-2 cursor-pointer bg-zinc-900/50 px-5 py-2.5 rounded-2xl shadow-sm font-bold text-zinc-300 hover:text-amber-400 hover:bg-zinc-900/80 transition-all duration-300"
          title={lang === 'id' ? 'Backup seluruh data beserta file video offline' : 'Backup all data including offline video files'}
        >
          <i className="fa-solid fa-file-zipper text-amber-400"></i> {lang === 'id' ? 'Export Full Vault (ZIP)' : 'Export Full Vault (ZIP)'}
        </button>
      </div>
    </footer>
  );
}