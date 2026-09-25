import React, { useState } from 'react';
import { supabaseClient } from '../../supabaseClient';

// Tambahkan prop 't' di sini untuk menerima dictionary bahasa dari komponen parent (App.jsx)
export default function ModalLogin({ isOpen, onClose, onShowToast, t }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' atau 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    if (authMode === 'register') {
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) {
        onShowToast(error.message, 'fa-circle-xmark');
      } else {
        onShowToast(t.toastRegisterSuccess, 'fa-user-check');
        setAuthMode('login');
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        onShowToast(error.message, 'fa-circle-xmark');
      } else {
        onShowToast(t.toastLoginSuccess, 'fa-unlock-keyhole');
        onClose();
      }
    }
    setAuthLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-[2rem] w-full max-w-sm relative shadow-2xl shadow-black/50">
        
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-zinc-500 hover:text-white cursor-pointer transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        
        <div className="flex justify-center mb-6 mt-2">
           <img 
             src="https://simp6.cuckcapital.cr/images4/2c19ebc4-a731-486d-ace9-f9a73266cdd6.webp" 
             alt="Logo" 
             className="w-16 h-16 object-contain drop-shadow-lg rounded-2xl"
           />
        </div>

        {/* Menggunakan string dari variabel 't' untuk bahasa */}
        <h2 className="text-2xl font-bold text-center mb-1 tracking-tight">
          {authMode === 'login' ? t.authLoginTitle : t.authRegisterTitle}
        </h2>
        <p className="text-zinc-400 text-xs text-center mb-8">
          {authMode === 'login' ? t.authLoginSub : t.authRegisterSub}
        </p>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">
              {t.authEmailLabel}
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder={t.authEmailPlaceholder} 
              required 
              className="w-full bg-zinc-950/80 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">
              {t.authPasswordLabel}
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder={t.authPasswordPlaceholder} 
              required 
              className="w-full bg-zinc-950/80 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={authLoading} 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold p-4 rounded-2xl transition-all mt-4 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          >
            {authLoading ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              authMode === 'login' ? t.authBtnLogin : t.authBtnRegister
            )}
          </button>
        </form>

        <p 
          className="text-center text-xs text-zinc-500 mt-8 cursor-pointer hover:text-emerald-400 transition-colors font-medium" 
          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        >
          {authMode === 'login' ? t.authToggleToRegister : t.authToggleToLogin}
        </p>
      </div>
    </div>
  );
}