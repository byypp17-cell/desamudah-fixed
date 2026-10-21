import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  Bell, 
  User, 
  CheckSquare, 
  Archive, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  MessageCircle,
  QrCode,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { 
    currentRole, 
    activeTab, 
    setActiveTab, 
    notifications, 
    applications,
    villageSettings,
    setLiveHelpdeskOpen,
    setPublicVerifyModalOpen,
  } = useApp();

  // Badges calculation
  const unreadNotifCount = notifications.filter(n => n.recipientRole === currentRole && !n.read).length;
  
  // Pending verification count for admin
  const pendingVerifyCount = applications.filter(a => a.status === 'diajukan' || a.status === 'sedang_diperiksa').length;
  
  // Needs repair count for citizen
  const needsRepairCount = applications.filter(a => a.status === 'perlu_perbaikan').length;

  const masyarakatNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'pilih-surat',
      label: 'Ajukan Surat Baru',
      icon: FilePlus,
      badge: 'Baru',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'pengajuan-saya',
      label: 'Pengajuan Saya',
      icon: FileText,
      badge: needsRepairCount > 0 ? `${needsRepairCount} Perlu Perbaikan` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'notifikasi',
      label: 'Notifikasi',
      icon: Bell,
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'profil',
      label: 'Profil Warga',
      icon: User,
      badge: null,
    },
  ];

  const adminNavItems = [
    {
      id: 'admin-dashboard',
      label: 'Dashboard Admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'admin-pengajuan',
      label: 'Daftar Pengajuan Surat',
      icon: FileText,
      badge: `${applications.length}`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'admin-verifikasi',
      label: 'Verifikasi Berkas',
      icon: CheckSquare,
      badge: pendingVerifyCount > 0 ? `${pendingVerifyCount} Antrean` : null,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'admin-selesai',
      label: 'Surat Selesai & Terbit',
      icon: Archive,
      badge: null,
    },
    {
      id: 'admin-warga',
      label: 'Data Masyarakat',
      icon: Users,
      badge: null,
    },
    {
      id: 'admin-laporan',
      label: 'Laporan & Rekapitulasi',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'admin-pengaturan',
      label: 'Pengaturan Desa',
      icon: Settings,
      badge: null,
    },
  ];

  const navItems = currentRole === 'admin' ? adminNavItems : masyarakatNavItems;

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed md:sticky top-0 md:top-16 z-40 h-full md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation items list */}
        <div className="p-4 overflow-y-auto">
          {/* Header on mobile */}
          <div className="md:hidden pb-4 mb-4 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              DesaMudah Mobile
            </span>
            <p className="text-sm font-bold text-slate-800">
              {currentRole === 'admin' ? 'Portal Perangkat Desa' : 'Layanan Warga'}
            </p>
          </div>

          <div className="mb-3 px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {currentRole === 'admin' ? 'Menu Administrasi Desa' : 'Menu Layanan Mandiri'}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (item.id === 'pengajuan-saya' && activeTab === 'detail-pengajuan') ||
                (item.id === 'pilih-surat' && activeTab === 'form-pengajuan');

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? currentRole === 'admin'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : (item.badgeColor || 'bg-slate-100 text-slate-600')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Village Card info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/60">
          {/* v2 Quick Action Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => { setLiveHelpdeskOpen(true); onCloseMobile(); }}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
              title="Konsultasi langsung dengan petugas desa"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tanya Petugas</span>
            </button>
            <button
              type="button"
              onClick={() => { setPublicVerifyModalOpen(true); onCloseMobile(); }}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all"
              title="Cek keaslian dokumen melalui kode QR"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Cek QR Surat</span>
            </button>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-700 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">{villageSettings.villageName}</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Jam Pelayanan: {villageSettings.serviceHours}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Bantuan Desa</span>
              <span className="font-mono text-emerald-600 font-semibold">{villageSettings.contactPhone.slice(0, 14)}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
