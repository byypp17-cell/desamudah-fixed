import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, FilePlus, FileText, Bell, User, CheckSquare, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, notifications, applications } = useApp();

  const unreadCount = notifications.filter(n => n.recipientRole === currentRole && !n.read).length;
  const needsAttentionCount = currentRole === 'masyarakat' 
    ? applications.filter(a => a.status === 'perlu_perbaikan').length
    : applications.filter(a => a.status === 'diajukan' || a.status === 'sedang_diperiksa').length;

  if (currentRole === 'masyarakat') {
    const items = [
      { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
      { id: 'pilih-surat', label: 'Ajukan', icon: FilePlus },
      { 
        id: 'pengajuan-saya', 
        label: 'Surat Saya', 
        icon: FileText,
        badge: needsAttentionCount > 0 ? needsAttentionCount : null 
      },
      { 
        id: 'notifikasi', 
        label: 'Notif', 
        icon: Bell, 
        badge: unreadCount > 0 ? unreadCount : null 
      },
      { id: 'profil', label: 'Akun', icon: User },
    ];

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
        <div className="flex justify-around items-center h-14">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'pengajuan-saya' && activeTab === 'detail-pengajuan') ||
              (item.id === 'pilih-surat' && activeTab === 'form-pengajuan');

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 transition ${
                  isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Admin bottom navigation
  const adminItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-pengajuan', label: 'Pengajuan', icon: FileText },
    { 
      id: 'admin-verifikasi', 
      label: 'Verifikasi', 
      icon: CheckSquare,
      badge: needsAttentionCount > 0 ? needsAttentionCount : null 
    },
    { id: 'admin-pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center h-14">
        {adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
