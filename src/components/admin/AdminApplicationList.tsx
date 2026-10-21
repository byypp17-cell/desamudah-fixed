import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckSquare, 
  Eye, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { ApplicationStatus } from '../../types';

export const AdminApplicationList: React.FC = () => {
  const { 
    applications, 
    letterTypes, 
    setActiveTab, 
    setSelectedApplicationId,
    setPreviewOfficialLetter 
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [letterTypeFilter, setLetterTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'nameAsc' | 'status'>('newest');

  // Filtering logic
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.applicantNik.includes(searchQuery) ||
                          app.letterTypeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesLetterType = letterTypeFilter === 'all' || app.letterTypeId === letterTypeFilter;

    // Date filtering (simulation)
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = app.createdAt.includes('2025-10-15') || app.createdAt.includes('Hari ini');
    } else if (dateFilter === 'week') {
      matchesDate = true; // all demo items are within the week
    }

    return matchesSearch && matchesStatus && matchesLetterType && matchesDate;
  });

  // Sorting logic
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
    if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt);
    if (sortBy === 'nameAsc') return a.applicantName.localeCompare(b.applicantName);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

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
            Terverifikasi
          </span>
        );
      case 'sedang_diperiksa':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
            <Clock className="w-3 h-3 mr-1 text-indigo-600" />
            Sedang Diperiksa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
            Diajukan
          </span>
        );
    }
  };

  const handleOpenVerify = (appId: string) => {
    setSelectedApplicationId(appId);
    setActiveTab('admin-verifikasi');
  };

  const handleOpenProcess = (appId: string) => {
    setSelectedApplicationId(appId);
    setActiveTab('admin-proses');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Daftar Seluruh Pengajuan Surat Masuk
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pemeriksaan berkas, validasi dokumen persyaratan, dan penerbitan nomor surat
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setLetterTypeFilter('all');
                setDateFilter('all');
                setSortBy('newest');
              }}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 flex items-center space-x-1 transition"
              title="Reset Filter"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Search, Filter status, Filter jenis surat, Filter tanggal, Sorting) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No. Registrasi, Nama Pemohon, NIK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="diajukan">Diajukan (Baru)</option>
              <option value="sedang_diperiksa">Sedang Diperiksa</option>
              <option value="perlu_perbaikan">Perlu Perbaikan</option>
              <option value="diverifikasi">Berkas Terverifikasi</option>
              <option value="diproses">Sedang Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          {/* Filter Jenis Surat */}
          <div>
            <select
              value={letterTypeFilter}
              onChange={(e) => setLetterTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Semua Jenis Surat</option>
              {letterTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>{lt.code} - {lt.name}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="newest">Urutkan: Terbaru</option>
              <option value="oldest">Urutkan: Terlama</option>
              <option value="nameAsc">Nama Pemohon (A - Z)</option>
              <option value="status">Status Pengajuan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {sortedApplications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada pengajuan yang cocok</h3>
            <p className="text-xs text-slate-400 mt-1">Sesuaikan kriteria filter atau pencarian Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 pl-6">No. Pengajuan</th>
                  <th className="py-3.5 px-4">Nama Pemohon</th>
                  <th className="py-3.5 px-4">Jenis Surat</th>
                  <th className="py-3.5 px-4">Tanggal Masuk</th>
                  <th className="py-3.5 px-4">Kelengkapan Dokumen</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedApplications.map((app) => {
                  const approvedCount = app.documents.filter(d => d.status === 'disetujui').length;
                  const rejectedCount = app.documents.filter(d => d.status === 'perlu_perbaiki').length;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 pl-6 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                        {app.trackingNumber}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-xs text-slate-900">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">NIK: {app.applicantNik}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs font-semibold text-slate-800 line-clamp-1">{app.letterTypeName}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 italic">"{app.purpose}"</div>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {app.createdAt}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <span className="font-semibold text-slate-700">
                            {approvedCount}/{app.documents.length} Disetujui
                          </span>
                          {rejectedCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                              {rejectedCount} Ditolak
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>

                      <td className="py-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {app.status === 'selesai' ? (
                            <button
                              onClick={() => setPreviewOfficialLetter(app)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center space-x-1"
                              title="Cetak Surat Sah"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Cetak</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenVerify(app.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center space-x-1"
                              title="Periksa dan Verifikasi Berkas"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Verifikasi Berkas</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenProcess(app.id)}
                            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition"
                            title="Proses Surat"
                          >
                            Proses
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
