import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Clock, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';

export const NotificationView: React.FC = () => {
  const { 
    currentRole, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    setSelectedApplicationId, 
    setActiveTab 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const roleNotifs = notifications.filter(n => n.recipientRole === currentRole);
  const filteredNotifs = filter === 'unread' ? roleNotifs.filter(n => !n.read) : roleNotifs;

  const handleItemClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.applicationId) {
      setSelectedApplicationId(notif.applicationId);
      setActiveTab(currentRole === 'admin' ? 'admin-verifikasi' : 'detail-pengajuan');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Pusat Pemberitahuan</h1>
            <p className="text-xs text-slate-500 mt-1">
              Semua info status pengajuan dan instruksi dari perangkat desa
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 transition"
            >
              {filter === 'all' ? 'Tampilkan Belum Dibaca Saja' : 'Tampilkan Semua'}
            </button>

            <button
              onClick={markAllNotificationsAsRead}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center space-x-1"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Tandai Semua Dibaca</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Tidak ada notifikasi</h4>
            <p className="text-xs text-slate-400 mt-1">Anda sudah melihat semua pembaruan status terkini.</p>
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`p-5 hover:bg-slate-50/80 cursor-pointer transition flex items-start space-x-4 ${
                !item.read ? 'bg-emerald-50/30' : ''
              }`}
            >
              <div className={`p-2.5 rounded-2xl flex-shrink-0 mt-0.5 ${
                item.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                item.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                item.type === 'danger' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {item.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                 item.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 font-sans whitespace-nowrap pl-2">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.message}
                </p>

                {item.applicationId && (
                  <div className="mt-2 flex items-center space-x-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                    <span>Lihat Rincian Pengajuan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {!item.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
