import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FilePlus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Download,
  AlertTriangle,
  Search,
  ExternalLink
} from 'lucide-react';
import { ApplicationStatus } from '../../types';

export const MasyarakatDashboard: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    setActiveTab, 
    setSelectedLetterTypeId, 
    setSelectedApplicationId,
    setPreviewOfficialLetter,
    setRepairingDocModal,
    letterTypes,
    villageSettings 
  } = useApp();

  // Metrics calculation
  const userApplications = applications.filter(a => a.applicantId === currentUser.id);
  const activeCount = userApplications.filter(a => a.status === 'diajukan' || a.status === 'sedang_diperiksa' || a.status === 'diverifikasi' || a.status === 'diproses').length;
  const finishedCount = userApplications.filter(a => a.status === 'selesai').length;
  const needRepairCount = userApplications.filter(a => a.status === 'perlu_perbaikan').length;

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'selesai':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Selesai & Siap Diunduh
          </span>
        );
      case 'perlu_perbaikan':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Perlu Perbaikan Berkas
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Sedang Diproses
          </span>
        );
      case 'diverifikasi':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Berkas Terverifikasi
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

  const handleStartLetter = (letterId: string) => {
    setSelectedLetterTypeId(letterId);
    setActiveTab('form-pengajuan');
  };

  const handleOpenDetail = (appId: string) => {
    setSelectedApplicationId(appId);
    setActiveTab('detail-pengajuan');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-600/60 text-emerald-100 text-xs font-semibold mb-3 backdrop-blur-sm border border-emerald-400/30">
            <span>🏛️ Portal Resmi Pelayanan Administrasi {villageSettings.villageName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {getGreeting()}, {currentUser.name}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Ajukan surat administrasi kependudukan Anda secara online dari rumah tanpa perlu antre di kantor desa. Pantau status pengajuan secara real-time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('pilih-surat')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
            >
              <FilePlus className="w-4 h-4 text-emerald-700" />
              <span>Ajukan Surat Baru Sekarang</span>
            </button>

            <button
              onClick={() => setActiveTab('pengajuan-saya')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600/50 hover:bg-emerald-600/70 text-white font-semibold text-sm backdrop-blur-sm border border-emerald-400/30 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Lihat Semua Pengajuan ({userApplications.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Aktif */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pengajuan Aktif
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeCount}</span>
            <span className="text-xs text-slate-500">dalam proses</span>
          </div>
        </div>

        {/* Metric 2: Selesai */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surat Selesai
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-600">{finishedCount}</span>
            <span className="text-xs text-slate-500">siap diunduh</span>
          </div>
        </div>

        {/* Metric 3: Butuh Perbaikan */}
        <div className={`p-5 rounded-2xl border shadow-sm transition ${
          needRepairCount > 0 
            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30' 
            : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              needRepairCount > 0 ? 'text-amber-800' : 'text-slate-500'
            }`}>
              Perlu Perbaikan
            </span>
            <div className={`p-2 rounded-xl ${
              needRepairCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'
            }`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold ${needRepairCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
              {needRepairCount}
            </span>
            <span className="text-xs text-slate-500">berkas buram/ditolak</span>
          </div>
        </div>

        {/* Metric 4: Total Pengajuan */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Permohonan
            </span>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{userApplications.length}</span>
            <span className="text-xs text-slate-500">sepanjang masa</span>
          </div>
        </div>
      </div>

      {/* Alert Banner if there are documents needing repair */}
      {needRepairCount > 0 && (
        <div className="p-4 sm:p-5 bg-amber-500/10 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Pemberitahuan Mendesak: Ada Berkas yang Harus Diperbaiki
              </h4>
              <p className="text-xs text-amber-900 mt-0.5">
                Perangkat desa menolak berkas Anda karena tidak terbaca / buram. Segera unggah ulang dokumen yang jelas agar proses verifikasi dapat dilanjutkan.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const target = userApplications.find(a => a.status === 'perlu_perbaikan');
              if (target) {
                setSelectedApplicationId(target.id);
                setActiveTab('detail-pengajuan');
              }
            }}
            className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center space-x-1 flex-shrink-0"
          >
            <span>Perbaiki Berkas Sekarang</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Popular Letter Types Catalog Shortcuts */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Jenis Surat Populer</h2>
            <p className="text-xs text-slate-500">Pilih jenis surat yang paling sering diajukan warga</p>
          </div>
          <button
            onClick={() => setActiveTab('pilih-surat')}
            className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            <span>Lihat Semua ({letterTypes.length} Surat)</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {letterTypes.slice(0, 4).map((lt) => (
            <div
              key={lt.id}
              onClick={() => handleStartLetter(lt.id)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition group bg-slate-50/50 hover:bg-emerald-50/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 uppercase">
                    {lt.category}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700">
                    ⏱️ {lt.estimatedDays}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition line-clamp-1">
                  {lt.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {lt.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                <span>{lt.requirements.length} Berkas Syarat</span>
                <span className="inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Ajukan <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengajuan Surat Terbaru</h2>
            <p className="text-xs text-slate-500">Status dan histori berkas permohonan Anda</p>
          </div>
          <button
            onClick={() => setActiveTab('pengajuan-saya')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            Lihat Riwayat Lengkap
          </button>
        </div>

        {userApplications.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">Belum Ada Pengajuan Surat</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Anda belum pernah mengajukan surat administrasi online. Klik tombol di bawah untuk membuat permohonan pertama Anda.
            </p>
            <button
              onClick={() => setActiveTab('pilih-surat')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Ajukan Surat Sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">No. Registrasi</th>
                  <th className="pb-3">Jenis Surat</th>
                  <th className="pb-3">Tanggal Dibuat</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 pl-2">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {app.trackingNumber}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {app.letterTypeName}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {app.purpose}
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {app.createdAt}
                    </td>
                    <td className="py-3.5 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 text-right pr-2 whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {app.status === 'selesai' && (
                          <button
                            onClick={() => setPreviewOfficialLetter(app)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition shadow-sm flex items-center space-x-1"
                            title="Unduh / Cetak Surat Resmi"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh</span>
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
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center space-x-1"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Perbaiki</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenDetail(app.id)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          Detail
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
