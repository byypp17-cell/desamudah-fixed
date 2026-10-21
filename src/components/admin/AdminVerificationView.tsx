import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  User, 
  Clock, 
  ShieldCheck, 
  Download,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ApplicationStatus } from '../../types';

export const AdminVerificationView: React.FC = () => {
  const { 
    applications, 
    selectedApplicationId, 
    setActiveTab, 
    verifyDocument, 
    updateApplicationStatus, 
    setPreviewDocument,
    setPreviewOfficialLetter,
    villageSettings 
  } = useApp();

  const app = applications.find(a => a.id === selectedApplicationId) || applications[0];

  // Rejection modal state for individual document
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string>('');

  // Overall status update state
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(app ? app.status : 'sedang_diperiksa');
  const [overallNotes, setOverallNotes] = useState<string>(app?.adminNotes || '');
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string>('');

  if (!app) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">Pilih pengajuan dari daftar terlebih dahulu.</p>
        <button
          onClick={() => setActiveTab('admin-pengajuan')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Buka Daftar Pengajuan
        </button>
      </div>
    );
  }

  // Handle Approve single document
  const handleApproveDoc = (docId: string) => {
    verifyDocument(app.id, docId, 'disetujui');
  };

  // Open Rejection Prompt
  const handleOpenRejectPrompt = (docId: string) => {
    setRejectingDocId(docId);
    setRejectionReason('');
    setRejectError('');
  };

  // Submit Rejection with mandatory note
  const handleSubmitRejectDoc = () => {
    if (!rejectionReason.trim()) {
      setRejectError('Alasan penolakan / instruksi perbaikan wajib diisi agar warga mengerti!');
      return;
    }
    if (rejectingDocId) {
      verifyDocument(app.id, rejectingDocId, 'perlu_perbaiki', rejectionReason.trim());
      setRejectingDocId(null);
      setRejectionReason('');
    }
  };

  // Handle overall status update
  const handleSaveOverallStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplicationStatus(app.id, selectedStatus, overallNotes);
    setStatusSuccessMsg('Status pengajuan berhasil diperbarui!');
    setTimeout(() => setStatusSuccessMsg(''), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('admin-pengajuan')}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Kembali ke Daftar Pengajuan</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
            {app.trackingNumber}
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {app.letterTypeCode}
              </span>
              <span className="text-xs text-slate-400">• Diajukan: {app.createdAt}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Verifikasi Berkas: {app.letterTypeName}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Pemohon: <span className="font-bold text-slate-900">{app.applicantName}</span> (NIK: {app.applicantNik})
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => {
                setActiveTab('admin-proses');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <span>Lanjut Proses Surat Resmi</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Document Verification Workbench */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Verifikasi Dokumen Persyaratan ({app.documents.length} Berkas)
                </h2>
                <p className="text-xs text-slate-500">
                  Periksa tiap file. Berikan persetujuan atau tolak dengan catatan instruksi perbaikan.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Petugas: {villageSettings.villageSecretaryName}
              </span>
            </div>

            {/* List of Documents */}
            <div className="space-y-4">
              {app.documents.map((doc) => {
                const isApproved = doc.status === 'disetujui';
                const isRejected = doc.status === 'perlu_perbaiki';

                return (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-2xl border transition ${
                      isApproved 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : isRejected 
                        ? 'bg-amber-50/40 border-amber-300' 
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Document Details */}
                      <div className="flex items-start space-x-3">
                        <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                          isApproved ? 'bg-emerald-100 text-emerald-700' :
                          isRejected ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {doc.requirementName}
                            </h4>
                            {isApproved && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                                ✓ Disetujui
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-900">
                                ✕ Perlu Perbaikan
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            {doc.fileName} • {doc.fileSize}
                          </p>
                          {doc.uploadedAt && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Diunggah: {doc.uploadedAt}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Verification Action Buttons: Preview, Approve, Reject */}
                      <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewDocument({ name: doc.fileName, url: doc.fileUrl, type: doc.fileType })}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>Lihat File</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApproveDoc(doc.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                            isApproved
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300'
                          }`}
                          title="Setujui Dokumen Ini"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenRejectPrompt(doc.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                            isRejected
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-300'
                          }`}
                          title="Tolak Dokumen Ini & Beri Catatan Perbaikan"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </div>

                    {/* Display Rejection Note if Rejected */}
                    {isRejected && doc.rejectionReason && (
                      <div className="mt-3 p-3 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-950">
                        <span className="font-bold text-[10px] text-amber-800 uppercase block">
                          Alasan Penolakan yang Dikirim ke Warga:
                        </span>
                        <p className="mt-0.5 italic">"{doc.rejectionReason}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Applicant Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Ringkasan Identitas Pemohon</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase">Nama Lengkap</span>
                <span className="font-bold text-slate-900 text-sm">{app.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">NIK</span>
                <span className="font-mono font-semibold text-slate-800">{app.applicantNik}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">Nomor WhatsApp</span>
                <span className="text-slate-800">{app.applicantPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">Alamat</span>
                <span className="text-slate-800">{app.applicantAddress} ({app.applicantRtRw})</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-bold block uppercase">Keperluan Surat</span>
                <span className="text-slate-800 italic">"{app.purpose}"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Section 4.D Status Changer & Official Process Controls */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Ubah Status Pengajuan (Section 4.D)</span>
            </h2>

            <form onSubmit={handleSaveOverallStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Status Pengajuan
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="diajukan">Diterima / Baru Masuk</option>
                  <option value="sedang_diperiksa">Sedang Diverifikasi</option>
                  <option value="perlu_perbaikan">Perlu Perbaikan (Ada Dokumen Ditolak)</option>
                  <option value="diverifikasi">Berkas Terverifikasi Lengkap</option>
                  <option value="diproses">Sedang Diproses Resmi</option>
                  <option value="selesai">Selesai (Surat Siap Diunduh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Petugas untuk Pemohon
                </label>
                <textarea
                  rows={3}
                  value={overallNotes}
                  onChange={(e) => setOverallNotes(e.target.value)}
                  placeholder="Tuliskan catatan arahan, estimasi pengambilan, atau petunjuk tambahan..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {statusSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{statusSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan & Beritahu Warga</span>
              </button>
            </form>
          </div>

          {/* Quick Letter Generator Preview */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-3 text-emerald-600">
              🏛️
            </div>
            <h4 className="text-sm font-bold text-slate-800">Pratinjau Draf Surat Resmi</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Lihat pratinjau surat berkop resmi Desa Sukamaju lengkap dengan stempel dan QR Code
            </p>
            <button
              onClick={() => setPreviewOfficialLetter(app)}
              className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Pratinjau Surat Resmi</span>
            </button>
          </div>

        </div>

      </div>

      {/* Mandatory Rejection Reason Modal (Requirement 4.C) */}
      {rejectingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-rose-600 text-white">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="font-bold text-sm">Wajib Isi Alasan Penolakan Berkas</h3>
              </div>
              <button
                onClick={() => setRejectingDocId(null)}
                className="p-1 text-white hover:bg-rose-700 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Sesuai standar operasional pelayanan publik desa, petugas <strong>wajib</strong> memberikan catatan spesifik agar pemohon mengetahui bagian mana yang perlu diperbaiki.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan Penolakan / Catatan Perbaikan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Foto terlalu buram/gelap, data NIK pada KTP tidak terbaca jelas, mohon foto ulang dengan pencahayaan terang..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Sample quick reason chips */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Catatan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Foto buram / tulisan tidak terbaca jelas',
                    'KTP terpotong / sudut kartu tidak utuh',
                    'Masa berlaku berkas telah kedaluwarsa',
                    'Belum ada tanda tangan & stempel RT/RW',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectionReason(chip)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {rejectError && (
                <div className="text-xs text-rose-600 font-semibold">{rejectError}</div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingDocId(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRejectDoc}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Tolak Berkas & Kirim Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
