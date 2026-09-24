import React, { useState } from 'react';

export default function TutorialModal({ isOpen, t, onClose }) {
  const [activeTab, setActiveTab] = useState('quickstart');

  if (!isOpen) return null;

  const tabs = [
    { id: 'quickstart', icon: 'fa-wand-magic-sparkles', title: 'Mulai Cepat' },
    { id: 'offline', icon: 'fa-box-archive', title: 'Brankas Offline' },
    { id: 'backup', icon: 'fa-cloud-arrow-down', title: 'Backup & Ekspor' },
    { id: 'privacy', icon: 'fa-shield-halved', title: 'Privasi & Data' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[750px]">
        
        {/* Header (Tetap / Tidak Ikut Scroll) */}
        <div className="p-6 flex items-center justify-between bg-zinc-850 shadow-md z-10 shrink-0">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-3">
              <i className="fa-solid fa-book-open text-emerald-400"></i>
              <span>Pusat Bantuan & Panduan</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Pelajari cara memaksimalkan fitur TikDrop Vault.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer shadow-inner"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Layout Konten Berbasis Flex (Sidebar Kiri & Konten Kanan) */}
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
                <h4 className="text-xl font-black text-white mb-4">Cara Kerja TikDrop</h4>
                <div className="space-y-4">
                  <div className="bg-zinc-800 p-5 rounded-2xl shadow-md">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                      Menyimpan Video Baru
                    </h5>
                    <p className="text-zinc-400 text-xs leading-relaxed ml-8">Tekan tombol <span className="text-white font-bold">"Tambah Video"</span> dan tempelkan tautan (URL) dari TikTok. Aplikasi akan secara otomatis mengekstrak informasi video, kreator, dan memuatnya ke dalam vault Anda tanpa *watermark*.</p>
                  </div>
                  <div className="bg-zinc-800 p-5 rounded-2xl shadow-md">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                      Manajemen Folder
                    </h5>
                    <p className="text-zinc-400 text-xs leading-relaxed ml-8">Kelompokkan video Anda. Tekan ikon folder di menu atas untuk membuat kategori (misal: "Resep Masakan", "Inspirasi Edit"). Buka video dan pilih menu *Move Folder* untuk memindahkannya.</p>
                  </div>
                  <div className="bg-zinc-800 p-5 rounded-2xl shadow-md">
                    <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
                      Mode Batch (Pilih Banyak)
                    </h5>
                    <p className="text-zinc-400 text-xs leading-relaxed ml-8">Tekan ikon centang kotak di bilah navigasi atas untuk mengaktifkan mode seleksi. Anda bisa memindahkan banyak video ke folder tertentu atau menghapusnya secara massal dengan cepat.</p>
                  </div>
                </div>
              </div>
            )}

            {/* KONTEN 2: BRANKAS OFFLINE */}
            {activeTab === 'offline' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h4 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                    Fitur True Offline 
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase px-2 py-1 rounded-lg">Premium</span>
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">Saat Anda menyimpan tautan, aplikasi secara diam-diam akan mengunduh video aslinya dan memasukkannya ke dalam memori perangkat Anda. Ini mencegah video hilang jika tautan aslinya dihapus (Anti-Link Rot).</p>
                </div>

                <div className="bg-zinc-800 p-5 rounded-3xl shadow-md space-y-4">
                  <h5 className="font-bold text-sm text-white mb-3">Memahami Indikator Status Video:</h5>
                  
                  <div className="flex items-start gap-3 p-3 bg-zinc-900 rounded-2xl">
                    <i className="fa-solid fa-cloud text-blue-400 mt-0.5 text-base w-6 text-center"></i>
                    <div>
                      <h6 className="text-white text-xs font-bold mb-1">Online Cloud</h6>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">Video belum diunduh atau proses *download* di latar belakang belum selesai. Video diputar langsung dari server aslinya. Jika kreator menghapus video tersebut, video ini tidak akan bisa diputar.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-2xl">
                    <i className="fa-solid fa-lock text-emerald-400 mt-0.5 text-base w-6 text-center"></i>
                    <div>
                      <h6 className="text-emerald-400 text-xs font-bold mb-1">True Offline (Aman)</h6>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">Sukses! File video biner (.mp4) telah tersimpan secara fisik di brankas peramban (*browser*) Anda. Video akan selalu bisa diputar kapan saja tanpa koneksi internet atau meskipun video asli dihapus.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-2xl">
                    <i className="fa-solid fa-skull-crossbones text-red-500 mt-0.5 text-base w-6 text-center"></i>
                    <div>
                      <h6 className="text-red-400 text-xs font-bold mb-1">Source Dead</h6>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">Video aslinya telah dihapus sebelum aplikasi sempat mencadangkannya secara *offline*. Video tidak bisa dipulihkan.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KONTEN 3: BACKUP & EKSPOR */}
            {activeTab === 'backup' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="text-xl font-black text-white mb-2">Ekspor & Pindah Perangkat</h4>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">Karena aplikasi ini berjalan 100% di perangkat Anda tanpa server (*Local-First*), Anda memiliki kendali penuh atas pencadangan data.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-800 p-5 rounded-3xl shadow-md flex flex-col">
                    <div className="font-bold text-white mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-file-code text-emerald-400 text-lg"></i> Export JSON
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Ringan & Cepat</span>
                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-1">
                      Hanya mengekspor teks metadata (Tautan, Judul, Folder, Catatan). Ukuran filenya sangat kecil. 
                      Sangat cocok untuk memulihkan susunan brankas. <br/><br/>
                      <strong className="text-zinc-300">Catatan:</strong> Saat diimpor ke PC baru, status video akan kembali menjadi "Online Cloud" karena file .mp4 nya tertinggal di PC lama.
                    </p>
                  </div>

                  <div className="bg-zinc-800 p-5 rounded-3xl shadow-md flex flex-col">
                    <div className="font-bold text-white mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-file-zipper text-amber-400 text-lg"></i> Export ZIP
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Arsip Menyeluruh (Besar)</span>
                    <p className="text-zinc-400 text-[11px] leading-relaxed mb-4 flex-1">
                      Mengekspor JSON sekaligus menyedot semua file video offline (.mp4) menjadi satu paket file `.zip`.
                      <br/><br/>
                      <strong className="text-zinc-300">Catatan:</strong> File unduhan bisa mencapai hitungan Gigabyte. Opsi paling aman untuk mengamankan data Anda secara permanen.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* KONTEN 4: PRIVASI & DATA */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="text-xl font-black text-white mb-4">Privasi & Keamanan Data</h4>
                
                <div className="bg-emerald-500/10 p-5 rounded-3xl shadow-inner flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-server text-emerald-400 text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-400 mb-1">Zero-Cost & Serverless Architecture</h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Kami tidak menyimpan data Anda di server kami (seperti Google Drive atau AWS). Semua video dan catatan Anda tersimpan secara eksklusif di dalam memori peramban (*browser*) perangkat yang sedang Anda gunakan saat ini. Data Anda 100% milik Anda.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 p-5 rounded-3xl shadow-inner flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-triangle-exclamation text-amber-400 text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-400 mb-1">Peringatan Penting (Clear Data)</h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Karena brankas ini terikat pada peramban, <strong className="text-zinc-200">jika Anda menghapus data situs (Clear Cache/Clear Data/Uninstall Browser)</strong>, maka seluruh arsip dan video offline Anda akan ikut musnah secara permanen.<br/><br/>
                      Biasakan untuk melakukan Export secara berkala ke tempat yang aman.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-zinc-850 flex items-center justify-between z-10 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
          <span className="text-[10px] text-zinc-500 pl-2 font-medium">TikDrop Vault Docs Version 4.0</span>
          <button 
            onClick={onClose} 
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}