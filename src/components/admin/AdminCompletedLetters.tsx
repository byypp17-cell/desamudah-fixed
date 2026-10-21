import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Archive, Search, Download, Printer, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminCompletedLetters: React.FC = () => {
  const { applications, setPreviewOfficialLetter } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const completedApps = applications.filter(a => a.status === 'selesai');

  const filtered = completedApps.filter(a => 
    a.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.officialLetterNumber && a.officialLetterNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.letterTypeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Buku Agenda Registrasi Surat Sah</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Arsip Surat Selesai Diterbitkan
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Daftar seluruh surat administrasi resmi yang telah ditandatangani dan dibubuhi stempel desa
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari no. surat, pemohon, NIK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Archive className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Belum Ada Surat Selesai</h3>
            <p className="text-xs text-slate-400 mt-1">Surat yang diselesaikan di menu verifikasi akan muncul di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 pl-6">No. Surat Resmi</th>
                  <th className="py-3.5 px-4">Jenis Surat</th>
                  <th className="py-3.5 px-4">Nama Pemohon</th>
                  <th className="py-3.5 px-4">Tanggal Pengesahan</th>
                  <th className="py-3.5 px-4">Penandatangan</th>
                  <th className="py-3.5 pr-6 text-right">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 pl-6 font-mono text-xs font-bold text-emerald-800">
                      {app.officialLetterNumber || `470/${app.trackingNumber.slice(-4)}/Ds-SKM/X/2025`}
                    </td>
                    <td className="py-4 px-4 font-bold text-xs text-slate-900">
                      {app.letterTypeName}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-xs text-slate-900">{app.applicantName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NIK: {app.applicantNik}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {app.officialLetterDate || app.completedAt || '15 Okt 2025'}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-700 font-medium whitespace-nowrap">
                      {app.signedBy || 'Kepala Desa Sukamaju'}
                    </td>
                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setPreviewOfficialLetter(app)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center space-x-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak / Unduh</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
