import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Printer, Download, Calendar, Filter, FileText, CheckCircle2 } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const { applications, letterTypes, villageSettings } = useApp();
  const [period, setPeriod] = useState<string>('Okt 2025');

  const total = applications.length;
  const completed = applications.filter(a => a.status === 'selesai').length;
  const inProgress = applications.filter(a => a.status !== 'selesai' && a.status !== 'perlu_perbaikan').length;
  const rejected = applications.filter(a => a.status === 'perlu_perbaikan').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Laporan & Rekapitulasi Pelayanan Desa
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Rekapitulasi berkala kinerja penerbitan surat administrasi desa
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none"
            >
              <option value="Okt 2025">Bulan Oktober 2025</option>
              <option value="Sep 2025">Bulan September 2025</option>
              <option value="Tahun 2025">Tahun 2025 (Tahunan)</option>
            </select>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekapitulasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Pemohon Masuk</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{total}</div>
          <span className="text-[11px] text-slate-400">100% dari total antrean</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800 uppercase">Tuntas Diterbitkan</span>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600">{completed}</div>
          <span className="text-[11px] text-emerald-700">Tingkat keberhasilan tinggi</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm">
          <span className="text-xs font-semibold text-blue-800 uppercase">Sedang Berjalan</span>
          <div className="mt-2 text-3xl font-extrabold text-blue-600">{inProgress}</div>
          <span className="text-[11px] text-blue-600">Dalam batas SLA 1-2 hari</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <span className="text-xs font-semibold text-amber-800 uppercase">Perlu Perbaikan</span>
          <div className="mt-2 text-3xl font-extrabold text-amber-600">{rejected}</div>
          <span className="text-[11px] text-amber-700">Menunggu respons warga</span>
        </div>
      </div>

      {/* Detailed Table breakdown per letter type */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Rincian Berkas per Jenis Surat ({period})
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Statistik penerbitan berdasarkan kategori permohonan kependudukan
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Jenis Surat</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-center">Total Masuk</th>
                <th className="py-3 px-4 text-center">Selesai</th>
                <th className="py-3 px-4 text-center">Perbaikan</th>
                <th className="py-3 px-4 text-right">Rata-rata Waktu Layanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {letterTypes.map((lt) => {
                const totalForType = applications.filter(a => a.letterTypeId === lt.id).length;
                const completedForType = applications.filter(a => a.letterTypeId === lt.id && a.status === 'selesai').length;
                const repairForType = applications.filter(a => a.letterTypeId === lt.id && a.status === 'perlu_perbaikan').length;

                return (
                  <tr key={lt.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{lt.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{lt.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{lt.category}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{totalForType}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{completedForType}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-600">{repairForType}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600">{lt.estimatedDays}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
