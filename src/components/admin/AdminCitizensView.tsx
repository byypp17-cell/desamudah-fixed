import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Phone, MapPin, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';

export const AdminCitizensView: React.FC = () => {
  const { applications, setActiveTab, setSelectedApplicationId } = useApp();
  const [search, setSearch] = useState('');

  const citizens = INITIAL_USERS.filter(u => u.role === 'masyarakat');

  const filtered = citizens.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nik.includes(search) ||
    c.noKK.includes(search) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Data Penduduk Terdaftar</h1>
            <p className="text-xs text-slate-500 mt-1">
              Basis data warga desa yang terhubung dengan layanan pengajuan surat digital
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama warga, NIK, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((warga) => {
          const wargaApps = applications.filter(a => a.applicantId === warga.id || a.applicantNik === warga.nik);

          return (
            <div key={warga.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start space-x-4">
                <img
                  src={warga.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={warga.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{warga.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0">
                      Aktif
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    NIK: {warga.nik}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{warga.address} ({warga.rtRw})</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{warga.phone}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {wargaApps.length} Pengajuan Diajukan
                </span>
                <span className="text-blue-600 font-semibold">
                  {warga.occupation}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
