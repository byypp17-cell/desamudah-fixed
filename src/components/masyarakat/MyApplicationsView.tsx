import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ArrowRight,
  FilePlus,
  ShieldCheck
} from 'lucide-react';
import { ApplicationStatus } from '../../types';

export const MyApplicationsView: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    setActiveTab, 
    setSelectedApplicationId,
    setPreviewOfficialLetter,
    setRepairingDocModal 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const userApplications = applications.filter(a => a.applicantId === currentUser.id);

  const filteredApps = userApplications.filter(app => {
    const matchesSearch = app.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.letterTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'aktif') return matchesSearch && (app.status === 'diajukan' || app.status === 'sedang_diperiksa' || app.status === 'diverifikasi' || app.status === 'diproses');
    if (statusFilter === 'perbaikan') return matchesSearch && app.status === 'perlu_perbaikan';
    if (statusFilter === 'selesai') return matchesSearch && app.status === 'selesai';
    return matchesSearch;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'selesai':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Selesai
          </span>
        );
      case 'perlu_perbaikan':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Perlu Perbaikan
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Diproses
          </span>
        );
      case 'diverifikasi':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Terverifikasi
          </span>
        );
      case 'sedang_diperiksa':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
            <Clock className="w-3.5 h-3.5 mr-1 text-indigo-600" />
            Sedang Diperiksa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Diajukan
          </span>
        );
    }
  };

  const handleOpenDetail = (id: string) => {
    setSelectedApplicationId(id);
    setActiveTab('detail-pengajuan');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Riwayat Pengajuan Surat Saya
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pantau seluruh berkas administrasi desa yang pernah Anda ajukan
            </p>
          </div>

          <button
            onClick={() => setActiveTab('pilih-surat')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm self-start sm:self-auto"
          >
            <FilePlus className="w-4 h-4" />
            <span>Ajukan Surat Baru</span>
          </button>
        </div>

        {/* Search & Filter pills */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan No. Registrasi atau jenis surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `Semua (${userApplications.length})` },
              { id: 'aktif', label: 'Sedang Berjalan' },
              { id: 'perbaikan', label: 'Perlu Perbaikan' },
              { id: 'selesai', label: 'Selesai' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  statusFilter === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications list */}
      {filteredApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Tidak ada pengajuan yang sesuai</h3>
          <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {app.trackingNumber}
                  </span>
                  <span className="text-xs text-slate-400">
                    {app.createdAt}
                  </span>
                  {getStatusBadge(app.status)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {app.letterTypeName}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    Keperluan: "{app.purpose}"
                  </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center space-x-4 pt-1">
                  <span>📄 {app.documents.length} Berkas Diunggah</span>
                  {app.officialLetterNumber && (
                    <span className="font-mono text-emerald-700 font-semibold">
                      No. Surat: {app.officialLetterNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-auto">
                {app.status === 'selesai' && (
                  <button
                    onClick={() => setPreviewOfficialLetter(app)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Surat</span>
                  </button>
                )}

                {app.status === 'perlu_perbaikan' && (
                  <button
                    onClick={() => {
                      const rejectedDoc = app.documents.find(d => d.status === 'perlu_perbaiki');
                      if (rejectedDoc) {
                        setRepairingDocModal({
                          appId: app.id,
                          docId: rejectedDoc.id,
                          requirementName: rejectedDoc.requirementName,
                          rejectionReason: rejectedDoc.rejectionReason,
                        });
                      } else {
                        handleOpenDetail(app.id);
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Perbaiki Berkas</span>
                  </button>
                )}

                <button
                  onClick={() => handleOpenDetail(app.id)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
