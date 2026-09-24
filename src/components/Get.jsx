import React, { useState } from 'react';

export default function Get({ onComplete, lang = 'id', onToggleLang }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Data langkah-langkah penjelasan (Mendukung ID dan EN di dalam komponen)
  const steps = lang === 'en' ? [
    {
      title: "Welcome to TikDrop Vault",
      description: "Your personal vault to store, manage, and secure your favorite video collection directly on your device without relying on public clouds.",
      icon: "fa-solid fa-vault text-emerald-400",
    },
    {
      title: "Download & Watch Offline",
      description: "Physically save videos to your browser's memory (LocalForage). Watch anytime smoothly, purely offline without consuming your data limit.",
      icon: "fa-solid fa-cloud-arrow-down text-sky-400",
    },
    {
      title: "Folder & Notes Management",
      description: "Don't let your videos get messy. Create custom folders, group videos, and add personal notes or hashtags to every video you save.",
      icon: "fa-solid fa-folder-tree text-amber-400",
    },
    {
      title: "Full Privacy & Backup (ZIP/JSON)",
      description: "100% secure. All data is stored on your local device. You can export your entire video collection and notes to ZIP or JSON format with a single click.",
      icon: "fa-solid fa-shield-halved text-purple-400",
    },
    {
      title: "Important: Data Storage Warning",
      description: "All your videos and data are stored locally in this browser. If you clear your browser data/cache or uninstall the browser, your Vault will be permanently deleted. Always remember to backup your data regularly!",
      icon: "fa-solid fa-triangle-exclamation text-rose-400",
    }
  ] : [
    {
      title: "Selamat Datang di TikDrop Vault",
      description: "Vault pribadi Anda untuk menyimpan, mengelola, dan mengamankan koleksi video favorit langsung di perangkat Anda tanpa perlu bergantung pada cloud publik.",
      icon: "fa-solid fa-vault text-emerald-400",
    },
    {
      title: "Unduh & Tonton Offline",
      description: "Simpan video secara fisik ke dalam memori peramban (LocalForage). Tonton kapan saja dengan lancar, murni secara offline tanpa menghabiskan kuota internet Anda.",
      icon: "fa-solid fa-cloud-arrow-down text-sky-400",
    },
    {
      title: "Manajemen Folder & Catatan",
      description: "Jangan biarkan video Anda berantakan. Buat folder khusus, kelompokkan video, dan tambahkan catatan pribadi atau hashtag pada setiap video yang Anda simpan.",
      icon: "fa-solid fa-folder-tree text-amber-400",
    },
    {
      title: "Privasi Penuh & Backup (ZIP/JSON)",
      description: "100% aman. Semua data tersimpan di perangkat lokal Anda. Anda dapat mengekspor seluruh koleksi video beserta catatannya ke dalam format ZIP atau JSON dengan sekali klik.",
      icon: "fa-solid fa-shield-halved text-purple-400",
    },
    {
      title: "Penting: Peringatan Penyimpanan",
      description: "Semua video dan data Anda disimpan secara lokal di peramban ini. Jika Anda menghapus data peramban (clear cache/data) atau mencopot peramban, isi Vault Anda akan hilang permanen. Selalu ingat untuk rutin melakukan Backup!",
      icon: "fa-solid fa-triangle-exclamation text-rose-400",
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(); // Fungsi untuk menutup Get.jsx dan masuk ke aplikasi utama
    }
  };

  return (
    // Mengganti bg-zinc-950 menjadi bg-zinc-900 agar lebih soft dan senada dengan website
    <div className="fixed inset-0 z-[100] w-full h-full bg-zinc-900 flex flex-col md:flex-row overflow-hidden selection:bg-emerald-500 selection:text-zinc-950">
      
      {/* TOMBOL BAHASA - DI KANAN ATAS (Tanpa Border) */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <button 
          onClick={onToggleLang}
          className="bg-zinc-800/80 backdrop-blur-md hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 text-xs md:text-sm cursor-pointer border-none outline-none"
        >
          <i className="fa-solid fa-globe text-emerald-400"></i>
          {lang === 'id' ? 'EN' : 'ID'}
        </button>
      </div>

      {/* Kolom Kiri: Cover / Visual Logo (Tanpa Border) */}
      <div className="w-full md:w-5/12 h-1/3 md:h-full bg-zinc-800/30 relative flex flex-col items-center justify-center p-8">
        {/* Latar Belakang Gradien Halus */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
        
        {/* Gambar Logo */}
        <div className="relative z-10 w-28 h-28 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-2xl mb-6 bg-zinc-900/50 flex items-center justify-center">
          <img 
            src="https://simp6.cuckcapital.cr/images4/2c19ebc4-a731-486d-ace9-f9a73266cdd6.webp" 
            alt="TikDrop Cover" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="relative z-10 font-black text-3xl md:text-5xl tracking-tighter text-white">
          Tik<span className="text-emerald-400">Drop</span>
        </h1>
        <p className="relative z-10 text-emerald-400/80 font-bold uppercase tracking-[0.3em] text-xs mt-2">
          Personal Vault
        </p>
      </div>

      {/* Kolom Kanan: Konten Penjelasan Bertahap */}
      <div className="w-full md:w-7/12 h-2/3 md:h-full flex flex-col p-8 md:p-16 lg:p-24 relative">
        
        {/* Indikator Langkah (Dots) yang kini bisa di-klik */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentStep 
                  ? 'w-8 bg-emerald-400' 
                  : index < currentStep 
                    ? 'w-4 bg-emerald-400/40 hover:bg-emerald-400/70' 
                    : 'w-4 bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>

        {/* Konten Penjelasan (Berganti dengan Animasi Key untuk trigger re-render) */}
        <div key={currentStep} className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 flex items-center justify-center text-3xl mb-8 shadow-sm">
            <i className={steps[currentStep].icon}></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
            {steps[currentStep].title}
          </h2>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="mt-8 pt-8 flex items-center justify-between">
          <button 
            onClick={onComplete}
            className="text-zinc-500 font-bold text-sm hover:text-white transition-colors cursor-pointer border-none bg-transparent outline-none"
          >
            {lang === 'id' ? 'Lewati' : 'Skip'}
          </button>
          
          <button 
            onClick={handleNext}
            className={`text-zinc-950 px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-lg cursor-pointer border-none outline-none ${
              currentStep === steps.length - 1 
                ? 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20' 
                : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {currentStep === steps.length - 1 
              ? (lang === 'id' ? 'Saya Mengerti, Mulai' : 'I Understand, Start') 
              : (lang === 'id' ? 'Lanjut' : 'Next')
            } 
            <i className={currentStep === steps.length - 1 ? "fa-solid fa-check" : "fa-solid fa-arrow-right"}></i>
          </button>
        </div>

      </div>
    </div>
  );
}