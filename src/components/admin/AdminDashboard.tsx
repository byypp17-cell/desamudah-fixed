import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar, 
  FileCheck2,
  ChevronRight,
  Eye,
  CheckSquare
} from 'lucide-react';
import { ApplicationStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    applications, 
    letterTypes, 
    setActiveTab, 
    setSelectedApplicationId,
    villageSettings 
  } = useApp();

  // Statistics calculation as requested in Section 4.A
  const totalCount = applications.length;
  const newCount = applications.filter(a => a.status === 'diajukan').length;
  const inVerificationCount = applications.filter(a => a.status === 'sedang_diperiksa').length;
  const needsRepairCount = applications.filter(a => a.status === 'perlu_perbaikan').length;
  const inProcessCount = applications.filter(a => a.status === 'diproses' || a.status === 'diverifikasi').length;
  const completedCount = applications.filter(a => a.status === 'selesai').length;

  // Status breakdown percentages
  const getPercentage = (count: number) => {
    return totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'selesai':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Selesai
          </span>
        );
      case 'perlu_perbaikan':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            Perlu Perbaikan
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1 text-blue-600" />
            Diproses
          </span>
        );
      case 'diverifikasi':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Terverifikasi
          </span>
        );
      case 'sedang_diperiksa':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
            <Clock className="w-3 h-3 mr-1 text-indigo-600" />
            Sedang Diverifikasi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
            <Clock className="w-3 h-3 mr-1 text-slate-500" />
            Baru Masuk
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/20">
              <span>🏛️ Dashboard Pelayanan Administrasi Desa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Verifikasi & Penerbitan Surat
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-1 max-w-xl">
              Kelola antrean permohonan surat masyarakat, verifikasi kelengkapan berkas, dan tandatangani surat resmi secara digital.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('admin-verifikasi')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md flex items-center space-x-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mulai Verifikasi Berkas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Metric Statistics Cards as per Section 4.A */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Pengajuan */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Pengajuan</span>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalCount}</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Semua berkas masuk</span>
        </div>

        {/* Pengajuan Baru */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pengajuan Baru</span>
          <div className="mt-2 text-2xl font-black text-indigo-600">{newCount}</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Menunggu antrean</span>
        </div>

        {/* Sedang Diverifikasi */}
        <div className="p-4 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Diverifikasi</span>
          <div className="mt-2 text-2xl font-black text-blue-700">{inVerificationCount}</div>
          <span className="text-[10px] text-blue-600 mt-0.5 block">Pemeriksaan berkas</span>
        </div>

        {/* Perlu Perbaikan */}
        <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Perlu Perbaikan</span>
          <div className="mt-2 text-2xl font-black text-amber-600">{needsRepairCount}</div>
          <span className="text-[10px] text-amber-700 mt-0.5 block">Ditolak sementara</span>
        </div>

        {/* Sedang Diproses */}
        <div className="p-4 bg-white rounded-2xl border border-teal-200 bg-teal-50/20 shadow-sm">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">Sedang Diproses</span>
          <div className="mt-2 text-2xl font-black text-teal-700">{inProcessCount}</div>
          <span className="text-[10px] text-teal-700 mt-0.5 block">Penyusunan draf</span>
        </div>

        {/* Selesai */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Surat Selesai</span>
          <div className="mt-2 text-2xl font-black text-emerald-600">{completedCount}</div>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">Sudah diterbitkan</span>
        </div>
      </div>

      {/* Visual Chart & Status Distribution as required in Section 4.A */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Breakdown Progress Bars */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Distribusi Status Pengajuan Administrasi</h2>
              <p className="text-xs text-slate-500">Persentase dan komposisi berkas yang sedang ditangani</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Real-time Tracker
            </span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner mb-6">
            <div style={{ width: `${getPercentage(completedCount)}%` }} className="bg-emerald-500 transition-all" title={`Selesai: ${completedCount}`} />
            <div style={{ width: `${getPercentage(inProcessCount)}%` }} className="bg-teal-500 transition-all" title={`Diproses: ${inProcessCount}`} />
            <div style={{ width: `${getPercentage(inVerificationCount)}%` }} className="bg-blue-500 transition-all" title={`Diverifikasi: ${inVerificationCount}`} />
            <div style={{ width: `${getPercentage(needsRepairCount)}%` }} className="bg-amber-400 transition-all" title={`Perlu Perbaikan: ${needsRepairCount}`} />
            <div style={{ width: `${getPercentage(newCount)}%` }} className="bg-indigo-400 transition-all" title={`Baru: ${newCount}`} />
          </div>

          {/* Breakdown Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Surat Selesai & Terbit', count: completedCount, color: 'bg-emerald-500', pct: getPercentage(completedCount) },
              { label: 'Sedang Diproses & Draf', count: inProcessCount, color: 'bg-teal-500', pct: getPercentage(inProcessCount) },
              { label: 'Sedang Pemeriksaan Berkas', count: inVerificationCount, color: 'bg-blue-500', pct: getPercentage(inVerificationCount) },
              { label: 'Membutuhkan Perbaikan Warga', count: needsRepairCount, color: 'bg-amber-400', pct: getPercentage(needsRepairCount) },
              { label: 'Pengajuan Baru Masuk', count: newCount, color: 'bg-indigo-400', pct: getPercentage(newCount) },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="font-medium text-slate-700">{stat.label}</span>
                </div>
                <div className="font-bold text-slate-900">
                  {stat.count} berkas <span className="text-slate-400 font-normal">({stat.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Letters by Type distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Permohonan Terbanyak</h2>
            <p className="text-xs text-slate-500 mb-4">Jenis surat yang paling banyak diajukan</p>

            <div className="space-y-3">
              {letterTypes.slice(0, 5).map((lt) => {
                const count = applications.filter(a => a.letterTypeId === lt.id).length;
                return (
                  <div key={lt.id} className="flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <span className="font-semibold text-slate-800">{lt.name}</span>
                      <span className="block text-[10px] text-slate-400 uppercase">{lt.code}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700 flex-shrink-0">
                      {count} pemohon
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('admin-pengajuan')}
            className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
          >
            <span>Buka Semua Daftar Surat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Applications Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Antrean Verifikasi Terbaru</h2>
            <p className="text-xs text-slate-500">Berkas yang baru masuk dan menunggu tindakan petugas</p>
          </div>

          <button
            onClick={() => setActiveTab('admin-pengajuan')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Lihat Semua Antrean ({applications.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">No. Registrasi</th>
                <th className="pb-3">Pemohon</th>
                <th className="pb-3">Jenis Surat</th>
                <th className="pb-3">Tanggal</th>
                <th className="pb-3">Status Berkas</th>
                <th className="pb-3 text-right pr-2">Aksi Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 pl-2 font-mono text-xs font-bold text-slate-800">
                    {app.trackingNumber}
                  </td>
                  <td className="py-3.5">
                    <div className="font-semibold text-xs text-slate-900">{app.applicantName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">NIK: {app.applicantNik}</div>
                  </td>
                  <td className="py-3.5 text-xs text-slate-800 font-medium">
                    {app.letterTypeName}
                  </td>
                  <td className="py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {app.createdAt}
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="py-3.5 text-right pr-2 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApplicationId(app.id);
                          setActiveTab('admin-verifikasi');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center space-x-1"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Verifikasi</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
