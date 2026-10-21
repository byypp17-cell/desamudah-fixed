import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Clock, 
  CheckCircle,
  Eye,
  EyeOff,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Role } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, villageSettings, isMobileView, setIsMobileView } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('masyarakat');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regNik, setRegNik] = useState('');
  const [regKk, setRegKk] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Forgot password form state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setLoginError('Harap isi NIK/Email dan Kata Sandi!');
      return;
    }

    login(selectedRole);
  };

  const handleManualRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regNik.length !== 16) {
      setLoginError('NIK harus 16 digit!');
      return;
    }
    setRegSuccess(`Akun warga atas nama "${regName}" berhasil didaftarkan! Silakan masuk.`);
    setTimeout(() => {
      setActiveTab('login');
      setIdentifier(regNik);
      setRegSuccess('');
    }, 1500);
  };

  const handleManualForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess('Tautan verifikasi dan instruksi reset kata sandi telah dikirim ke nomor WhatsApp Anda.');
    setTimeout(() => {
      setActiveTab('login');
      setForgotSuccess('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      
      {/* Top Bar on Login Page */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              Desa<span className="text-emerald-600">Mudah</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-500 ml-2 font-medium">
              • Pelayanan Administrasi Digital {villageSettings.villageName}
            </span>
          </div>
        </div>

        {/* Smartphone Mode Simulator Toggle */}
        <button
          onClick={() => setIsMobileView(!isMobileView)}
          className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
            isMobileView 
              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Uji coba tampilan Smartphone (HP)"
        >
          {isMobileView ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-blue-600" />
              <span>Mode Layar Desktop</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Simulasi Tampilan HP</span>
              <span className="sm:hidden">Mode HP</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fadeIn">
          
          {/* Left Hero Brand Panel (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-8 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-600/60 text-emerald-100 text-xs font-semibold mb-6 border border-emerald-400/30">
                <span>🏛️ {villageSettings.districtName}</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight leading-snug">
                Urus Surat Desa Lebih Cepat, Mudah, dan Transparan.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Platform resmi pelayanan administrasi kependudukan {villageSettings.villageName}. Pengajuan online, upload berkas mandiri, verifikasi cepat, dan unduh surat resmi ber-QR Code.
              </p>

              {/* Steps feature pill */}
              <div className="mt-8 space-y-3.5">
                {[
                  { title: '1. Pilih Surat', desc: 'Tersedia 8 jenis surat administrasi desa' },
                  { title: '2. Upload Dokumen', desc: 'Cukup foto/scan KTP, KK, dan Pengantar RT' },
                  { title: '3. Verifikasi Petugas', desc: 'Petugas memeriksa dan menyetujui berkas' },
                  { title: '4. Unduh Surat Sah', desc: 'Surat resmi ber-QR Code siap dicetak mandiri' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/40 text-emerald-200 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="font-bold text-white">{item.title}</span>
                      <p className="text-emerald-200/80 text-[11px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-emerald-600/40 text-[11px] text-emerald-200 flex items-center justify-between">
              <span>Jam Layanan Kantor:</span>
              <span className="font-semibold text-white">{villageSettings.serviceHours}</span>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
          </div>

          {/* Right Form Panel (Tabs: Login, Register, Forgot) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            
            {/* Tab Nav Buttons */}
            <div className="flex border-b border-slate-200 mb-6 text-xs sm:text-sm font-bold">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`pb-3 px-3 transition relative ${
                  activeTab === 'login' 
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setLoginError(''); }}
                className={`pb-3 px-3 transition relative ${
                  activeTab === 'register' 
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Registrasi Warga Baru
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('forgot'); setLoginError(''); }}
                className={`pb-3 px-3 transition relative ${
                  activeTab === 'forgot' 
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lupa Sandi
              </button>
            </div>

            {/* QUICK 1-CLICK DEMO ACCESS BAR (Highlighted) */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Akses Cepat Pengujian (1-Klik Langsung Masuk):</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                  Demo Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => login('masyarakat')}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center space-x-2 text-left"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <div className="leading-tight">
                    <div>Masuk sbg Warga</div>
                    <div className="text-[10px] font-normal text-emerald-100">Budi Santoso (Masyarakat)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => login('admin')}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center space-x-2 text-left"
                >
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <div className="leading-tight">
                    <div>Masuk sbg Perangkat Desa</div>
                    <div className="text-[10px] font-normal text-blue-100">Hendra Kurniawan (Sekdes)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* TAB 1: LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleManualLogin} className="space-y-4">
                
                {/* Role Switcher Pill */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pilih Peran Anda Saat Masuk:
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('masyarakat');
                        setIdentifier('3204121508920001');
                        setPassword('password123');
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition ${
                        selectedRole === 'masyarakat' 
                          ? 'bg-white text-emerald-700 shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Masyarakat (Warga)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('admin');
                        setIdentifier('sekdes@sukamaju-desa.id');
                        setPassword('admin123');
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition ${
                        selectedRole === 'admin' 
                          ? 'bg-white text-blue-700 shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Perangkat Desa (Admin)
                    </button>
                  </div>
                </div>

                {/* Input Identifier */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'masyarakat' ? 'Nomor Induk Kependudukan (NIK) atau Email' : 'NIP atau Email Dinas Petugas'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder={selectedRole === 'masyarakat' ? 'Contoh: 3204121508920001 / budi@gmail.com' : 'Contoh: sekdes@sukamaju-desa.id'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-[11px] text-emerald-600 hover:underline font-semibold"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Ingat saya di perangkat ini</span>
                  </label>
                </div>

                {loginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className={`w-full py-3 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center space-x-2 ${
                    selectedRole === 'admin' 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  <span>Masuk ke DesaMudah</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleManualRegister} className="space-y-3 animate-fadeIn">
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Daftarkan akun kependudukan Anda untuk mulai membuat permohonan surat administrasi online.
                </p>

                {regSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap (Sesuai KTP) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Hidayat"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      NIK (16 Digit) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="3204xxxxxxxxxxxx"
                      value={regNik}
                      onChange={(e) => setRegNik(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor KK (16 Digit)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="3204xxxxxxxxxxxx"
                      value={regKk}
                      onChange={(e) => setRegKk(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      No. WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxxxxxx"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Buat Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Domisili Tempat Tinggal
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kp. Sukamaju No. 12 RT 02 / RW 04"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm mt-3"
                >
                  Daftar Akun Masyarakat Sekarang
                </button>
              </form>
            )}

            {/* TAB 3: FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleManualForgot} className="space-y-4 animate-fadeIn">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Masukkan NIK atau nomor WhatsApp yang telah terdaftar di DesaMudah. Sistem akan mengirimkan tautan verifikasi atau OTP untuk mengatur ulang kata sandi Anda.
                </p>

                {forgotSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{forgotSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIK atau Nomor WhatsApp Terdaftar
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3204121508920001 / 081298765432"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Kirim Instruksi Pemulihan
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>
          © 2025 DesaMudah • Pemerintah {villageSettings.villageName}, {villageSettings.districtName}, {villageSettings.regencyName}
        </p>
      </div>

    </div>
  );
};
