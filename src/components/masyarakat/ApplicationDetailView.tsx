import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Eye, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { ApplicationStatus, DocumentStatus } from '../../types';

export const ApplicationDetailView: React.FC = () => {
  const { 
    applications, 
    selectedApplicationId, 
    setActiveTab, 
    setPreviewOfficialLetter, 
    setPreviewDocument, 
    setRepairingDocModal,
    villageSettings,
    currentUser
  } = useApp();

  const app = applications.find(a => a.id === selectedApplicationId) || applications[0];

  if (!app) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">Pengajuan tidak ditemukan.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // 6 Tracking Milestones as specified in Section 3.F
  const milestones: {
    statusKey: ApplicationStatus;
    stepNumber: number;
    title: string;
    description: string;
  }[] = [
    {
      statusKey: 'diajukan',
      stepNumber: 1,
      title: 'Pengajuan Dibuat',
      description: 'Pemohon mengisi formulir dan mengirimkan berkas persyaratan online.',
    },
    {
      statusKey: 'sedang_diperiksa',
      stepNumber: 2,
      title: 'Berkas Sedang Diperiksa',
      description: 'Petugas loket pelayanan memeriksa keabsahan dan kelengkapan berkas fisik/scan.',
    },
    {
      statusKey: 'diverifikasi',
      stepNumber: 3,
      title: 'Berkas Diverifikasi',
      description: 'Seluruh dokumen persyaratan disetujui dan dinyatakan lengkap tanpa kekurangan.',
    },
    {
      statusKey: 'diproses',
      stepNumber: 4,
      title: 'Pengajuan Diproses',
      description: 'Draf surat resmi disusun, diverifikasi sekretaris desa, dan diberi nomor registrasi.',
    },
    {
      statusKey: 'selesai',
      stepNumber: 5,
      title: 'Surat Selesai Ditandatangani',
      description: 'Surat resmi telah ditandatangani Kepala Desa dan dibubuhi stempel sah.',
    },
    {
      statusKey: 'selesai',
      stepNumber: 6,
      title: 'Surat Dapat Diunduh',
      description: 'Dokumen surat resmi siap diunduh secara mandiri oleh pemohon dengan QR verifikasi.',
    },
  ];

  // Helper to determine step active/completed state
  const getStepState = (milestoneIndex: number) => {
    const statusOrder: Record<ApplicationStatus, number> = {
      diajukan: 1,
      sedang_diperiksa: 2,
      perlu_perbaikan: 2, // paused at verification
      diverifikasi: 3,
      diproses: 4,
      selesai: 6,
    };

    const currentLevel = statusOrder[app.status] || 1;
    const milestoneLevel = milestoneIndex + 1;

    if (app.status === 'perlu_perbaikan' && milestoneIndex === 1) {
      return 'warning';
    }
    if (milestoneLevel < currentLevel) {
      return 'completed';
    }
    if (milestoneLevel === currentLevel) {
      return 'active';
    }
    return 'upcoming';
  };

  const getDocStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Disetujui
          </span>
        );
      case 'perlu_perbaiki':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            Perlu Diperbaiki
          </span>
        );
      case 'sedang_diverifikasi':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1 text-blue-600" />
            Sedang Diverifikasi
          </span>
        );
      case 'sudah_diunggah':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-100 text-indigo-800">
            Sudah Diunggah
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
            Belum Diunggah
          </span>
        );
    }
  };

  // Check if any rejected document exists
  const rejectedDocs = app.documents.filter(d => d.status === 'perlu_perbaiki');

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('pengajuan-saya')}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Kembali ke Daftar Pengajuan Saya</span>
        </button>

        <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          ID: {app.trackingNumber}
        </span>
      </div>

      {/* Main Status Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {app.letterTypeCode}
              </span>
              <span className="text-xs text-slate-400">• Dibuat: {app.createdAt}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {app.letterTypeName}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Keperluan: <span className="font-medium text-slate-800 italic">"{app.purpose}"</span>
            </p>
          </div>

          {/* Quick Action Button in Header */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {app.status === 'selesai' && (
              <button
                onClick={() => setPreviewOfficialLetter(app)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh / Cetak Surat Resmi</span>
              </button>
            )}

            {app.status === 'perlu_perbaikan' && (
              <button
                onClick={() => {
                  const targetDoc = rejectedDocs[0] || app.documents[0];
                  setRepairingDocModal({
                    appId: app.id,
                    docId: targetDoc.id,
                    requirementName: targetDoc.requirementName,
                    rejectionReason: targetDoc.rejectionReason,
                  });
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-amber-500/20 flex items-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Perbaiki Berkas yang Ditolak</span>
              </button>
            )}
          </div>
        </div>

        {/* Perlu Perbaikan Callout if rejected */}
        {app.status === 'perlu_perbaikan' && (
          <div className="mt-6 p-4 sm:p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-950">
                  Catatan Perbaikan dari Perangkat Desa:
                </h4>
                <p className="text-xs sm:text-sm text-amber-900 mt-1 font-medium italic">
                  "{app.adminNotes || 'Terdapat dokumen yang buram atau tidak sesuai. Silakan klik tombol perbaiki berkas di bawah.'}"
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {rejectedDocs.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setRepairingDocModal({
                        appId: app.id,
                        docId: doc.id,
                        requirementName: doc.requirementName,
                        rejectionReason: doc.rejectionReason,
                      })}
                      className="px-3.5 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-lg text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                    >
                      <span>Unggah Ulang {doc.requirementName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Left Column (Tracking Timeline 3.F), Right Column (Applicant Info & Documents 3.G) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pelacakan Status Real-time (6 Milestones Timeline) */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Pelacakan Status</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Real-time
            </span>
          </div>

          {/* Timeline flow */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {milestones.map((m, idx) => {
              const state = getStepState(idx);
              const historyMatch = app.history.find(h => h.status === m.statusKey);

              return (
                <div key={idx} className="relative">
                  {/* Dot icon */}
                  <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition ${
                    state === 'completed'
                      ? 'bg-emerald-600 border-white text-white shadow-sm ring-2 ring-emerald-500/20'
                      : state === 'active'
                      ? 'bg-blue-600 border-white text-white shadow-sm ring-4 ring-blue-100 animate-pulse'
                      : state === 'warning'
                      ? 'bg-amber-500 border-white text-white shadow-sm ring-4 ring-amber-100'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {state === 'completed' ? '✓' : m.stepNumber}
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className={`text-xs font-bold leading-tight ${
                      state === 'completed' ? 'text-emerald-800' :
                      state === 'active' ? 'text-blue-700' :
                      state === 'warning' ? 'text-amber-800' : 'text-slate-400'
                    }`}>
                      {m.stepNumber}. {m.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {m.description}
                    </p>

                    {/* Timestamp & Actor if reached */}
                    {historyMatch && (
                      <div className="mt-1.5 p-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 border border-slate-100 font-sans">
                        <div className="font-semibold text-slate-700">🕒 {historyMatch.timestamp}</div>
                        <div className="text-slate-400 mt-0.5">Oleh: {historyMatch.actor}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Applicant Details & Document Checklist (3.G) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Data Pemohon */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Data Lengkap Pemohon</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase">Nama Pemohon</span>
                <span className="font-extrabold text-slate-900 text-sm">{app.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">NIK (16 Digit)</span>
                <span className="font-mono font-semibold text-slate-800">{app.applicantNik}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">Nomor KK</span>
                <span className="font-mono text-slate-800">{app.applicantKk}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">Tempat, Tanggal Lahir</span>
                <span className="text-slate-800">{app.applicantTtl}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">No. WhatsApp / Telepon</span>
                <span className="text-slate-800">{app.applicantPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">Pekerjaan</span>
                <span className="text-slate-800">{app.applicantOccupation || 'Wiraswasta'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-bold block uppercase">Alamat Domisili</span>
                <span className="text-slate-800">{app.applicantAddress} ({app.applicantRtRw})</span>
              </div>
            </div>

            {/* Extra Data if any */}
            {Object.keys(app.additionalData).length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">Informasi Pendukung Surat:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(app.additionalData).map(([key, val]) => (
                    <div key={key} className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">{key}</span>
                      <span className="text-slate-800 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Daftar Berkas Persyaratan (Upload Berkas Detail) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Daftar Berkas Persyaratan ({app.documents.length})</span>
              </h2>
              <span className="text-xs text-slate-500">Status verifikasi per file</span>
            </div>

            <div className="space-y-3">
              {app.documents.map((doc) => (
                <div 
                  key={doc.id}
                  className={`p-4 rounded-2xl border transition ${
                    doc.status === 'disetujui'
                      ? 'bg-emerald-50/20 border-emerald-200'
                      : doc.status === 'perlu_perbaiki'
                      ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${
                        doc.status === 'disetujui' ? 'bg-emerald-100 text-emerald-700' :
                        doc.status === 'perlu_perbaiki' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{doc.requirementName}</h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {doc.fileName} • {doc.fileSize}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      {getDocStatusBadge(doc.status)}

                      <button
                        onClick={() => setPreviewDocument({ name: doc.fileName, url: doc.fileUrl, type: doc.fileType })}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        Pratinjau
                      </button>

                      {doc.status === 'perlu_perbaiki' && (
                        <button
                          onClick={() => setRepairingDocModal({
                            appId: app.id,
                            docId: doc.id,
                            requirementName: doc.requirementName,
                            rejectionReason: doc.rejectionReason,
                          })}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
                        >
                          Unggah Ulang
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Rejection reason box if this doc was rejected */}
                  {doc.status === 'perlu_perbaiki' && doc.rejectionReason && (
                    <div className="mt-3 p-3 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-950">
                      <span className="font-bold block text-[10px] uppercase text-amber-800">
                        Alasan Penolakan Petugas:
                      </span>
                      <p className="mt-0.5 italic">"{doc.rejectionReason}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Action Banner if Finished */}
          {app.status === 'selesai' && (
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">Surat Resmi Telah Selesai Diterbitkan</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    No. Surat: {app.officialLetterNumber} • Ditandatangani sah secara digital oleh Kepala Desa
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewOfficialLetter(app)}
                className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-sm font-extrabold transition shadow-md flex items-center space-x-2 flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Unduh / Cetak Dokumen</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
