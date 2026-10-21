import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { switchRole, setCurrentUser } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Berhasil masuk!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Pendaftaran akun berhasil! Silakan masuk.');
    setTimeout(() => {
      setSuccessMsg('');
      setTab('login');
    }, 1000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Tautan pemulihan kata sandi telah dikirim ke nomor WhatsApp/Email Anda.');
    setTimeout(() => {
      setSuccessMsg('');
      setTab('login');
    }, 1500);
  };

  // Quick demo sign-in
  const handleQuickDemo = (role: 'masyarakat' | 'admin') => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              🏛️
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Portal Akun DesaMudah</h3>
              <p className="text-xs text-slate-500">Layanan Administrasi Desa Online</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => { setTab('login'); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center transition ${
              tab === 'login' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => { setTab('register'); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center transition ${
              tab === 'register' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            Registrasi Warga
          </button>
          <button
            onClick={() => { setTab('forgot'); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center transition ${
              tab === 'forgot' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'hover:text-slate-900'
            }`}
          >
            Lupa Sandi
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Uji Coba Cepat Prototipe (1-Klik Masuk):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('masyarakat')}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs text-center"
              >
                Masuk Warga
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs text-center"
              >
                Masuk Admin Desa
              </button>
            </div>
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email atau NIK
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3204121508920001 / budi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-emerald-600 hover:underline font-semibold"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
              >
                Masuk ke DesaMudah
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap (Sesuai KTP)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Fadilah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="3204xxxxxxxxxxxx"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Buat Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm mt-2"
              >
                Daftar Akun Masyarakat
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Masukkan NIK atau nomor WhatsApp yang terdaftar untuk menerima kode verifikasi OTP reset kata sandi.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK atau WhatsApp</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 3204121508920001 / 081298765432"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
              >
                Kirim Tautan Pemulihan
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
