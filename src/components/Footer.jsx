import React, { useRef } from 'react';

export default function Footer({ t, onExportJSON, onImportJSON }) {
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
        alert("File JSON tidak valid atau rusak.");
      }
    };
    reader.readAsText(file);
    // Reset input agar bisa memilih file yang sama lagi jika diperlukan
    e.target.value = null;
  };

  return (
    <footer className="mt-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 bg-zinc-800 rounded-3xl shadow-md px-8">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg overflow-hidden bg-zinc-900 flex items-center justify-center">
          <img 
            src="https://simp6.cuckcapital.cr/images4/2c19ebc4-a731-486d-ace9-f9a73266cdd6.webp" 
            alt="Logo Footer" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-zinc-300">Tik<span className="text-emerald-400">Drop</span> Vault &copy; {new Date().getFullYear()}</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Hidden File Input untuk Import */}
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="hover:text-sky-400 transition-all flex items-center gap-2 cursor-pointer bg-zinc-900 px-5 py-2.5 rounded-2xl shadow-inner font-bold text-zinc-300 hover:bg-zinc-950"
        >
          <i className="fa-solid fa-cloud-arrow-up text-sky-400"></i> Import JSON
        </button>

        <button 
          onClick={onExportJSON} 
          className="hover:text-emerald-400 transition-all flex items-center gap-2 cursor-pointer bg-zinc-900 px-5 py-2.5 rounded-2xl shadow-inner font-bold text-zinc-300 hover:bg-zinc-950"
        >
          <i className="fa-solid fa-cloud-arrow-down text-emerald-400"></i> {t.footerBackupJson}
        </button>
      </div>
    </footer>
  );
}