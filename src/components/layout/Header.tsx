import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Bell, 
  UserCheck, 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  Menu,
  ExternalLink,
  LogOut,
  MessageSquare,
  QrCode,
  Sparkles
} from 'lucide-react';
import { Role } from '../../types';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebarMobile }) => {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    logout,
    isMobileView, 
    setIsMobileView, 
    notifications, 
    activeTab, 
    setActiveTab, 
    resetToMockData,
    villageSettings,
    setSelectedApplicationId,
    setPublicVerifyModalOpen,
    setLiveHelpdeskOpen
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Filter notifications for current role
  const roleNotifications = notifications.filter(n => n.recipientRole === currentRole);
  const unreadCount = roleNotifications.filter(n => !n.read).length;

  const handleRoleSelect = (role: Role) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebarMobile}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => setActiveTab(currentRole === 'admin' ? 'admin-dashboard' : 'dashboard')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Desa<span className="text-emerald-600">Mudah</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider flex items-center shadow-xs">
                    <Sparkles className="w-3 h-3 mr-1 text-emerald-200" />
                    <span>v2.0 Pro</span>
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
                  Pelayanan Administrasi Digital {villageSettings.villageName}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions, Role Switcher, Mobile Toggle, Notifications & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live Helpdesk Trigger (v2) */}
            <button
              onClick={() => setLiveHelpdeskOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition shadow-xs"
              title="Konsultasi Langsung dengan Petugas Loket Desa"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tanya Petugas</span>
            </button>

            {/* Public QR Verification Portal Trigger (v2) */}
            <button
              onClick={() => setPublicVerifyModalOpen(true)}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 transition shadow-xs"
              title="Cek Keaslian Dokumen Resmi via QR Publik"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Cek QR Dokumen</span>
            </button>

            {/* Mobile Viewframe Toggle Simulator */}
            <button
              onClick={() => setIsMobileView(!isMobileView)}
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                isMobileView 
                  ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Simulasi Tampilan Smartphone Mobile"
            >
              {isMobileView ? (
                <>
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span>Mode Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span>Mode HP (Mobile Frame)</span>
                </>
              )}
            </button>

            {/* Instant Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition shadow-sm ${
                  currentRole === 'admin'
                    ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  currentRole === 'admin' ? 'bg-blue-600' : 'bg-emerald-600'
                }`} />
                <span className="hidden sm:inline">Peran:</span>
                <span className="font-bold">
                  {currentRole === 'admin' ? 'Perangkat Desa' : 'Masyarakat'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Ganti Peran Pengguna (Simulasi)
                    </p>
                  </div>

                  <button
                    onClick={() => handleRoleSelect('masyarakat')}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition ${
                      currentRole === 'masyarakat' ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        BS
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Budi Santoso (Masyarakat)</div>
                        <div className="text-[11px] text-slate-500">Ajukan surat & upload berkas</div>
                      </div>
                    </div>
                    {currentRole === 'masyarakat' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition ${
                      currentRole === 'admin' ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        HK
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Hendra Kurniawan (Sekretaris Desa)</div>
                        <div className="text-[11px] text-slate-500">Verifikasi berkas & proses surat</div>
                      </div>
                    </div>
                    {currentRole === 'admin' && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  <div className="p-2 border-t border-slate-100 mt-1 space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg font-medium flex items-center space-x-1.5 transition"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kembali ke Halaman Login (Keluar)</span>
                    </button>

                    <button
                      onClick={() => {
                        resetToMockData();
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium flex items-center space-x-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Data Demo ke Semula</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                title="Pemberitahuan"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Pemberitahuan</h4>
                      <p className="text-xs text-slate-500">
                        {unreadCount} pesan belum dibaca
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab(currentRole === 'admin' ? 'admin-dashboard' : 'notifikasi');
                        setShowNotifMenu(false);
                      }}
                      className="text-xs text-emerald-600 font-semibold hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {roleNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Tidak ada notifikasi saat ini
                      </div>
                    ) : (
                      roleNotifications.slice(0, 4).map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (item.applicationId) {
                              setSelectedApplicationId(item.applicationId);
                              setActiveTab(currentRole === 'admin' ? 'admin-verifikasi' : 'detail-pengajuan');
                            }
                            setShowNotifMenu(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start space-x-3 ${
                            !item.read ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            item.type === 'success' ? 'bg-emerald-500' :
                            item.type === 'warning' ? 'bg-amber-500' :
                            item.type === 'danger' ? 'bg-rose-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{item.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{item.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div 
              onClick={() => setActiveTab(currentRole === 'admin' ? 'admin-pengaturan' : 'profil')}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer group"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-emerald-500 transition"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 font-mono">
                  {currentRole === 'admin' ? currentUser.adminPosition : `NIK: ${currentUser.nik.slice(0, 6)}...`}
                </div>
              </div>
            </div>

            {/* Logout Button in Header */}
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Keluar / Kembali ke Halaman Login"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
