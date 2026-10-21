import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Download, 
  UploadCloud, 
  ShieldCheck, 
  Send,
  Eye,
  AlertCircle,
  PenTool
} from 'lucide-react';

export const AdminProcessLetterView: React.FC = () => {
  const { 
    applications, 
    selectedApplicationId, 
    setActiveTab, 
    updateApplicationStatus, 
    setPreviewOfficialLetter,
    villageSettings,
    setSignatureModalOpen,
    customSignatureUrl
  } = useApp();

  const app = applications.find(a => a.id === selectedApplicationId) || applications[0];

  const defaultNumber = app?.officialLetterNumber || `470/${Math.floor(100 + Math.random() * 899)}/Ds-SKM/X/2025`;

  const [letterNumber, setLetterNumber] = useState<string>(defaultNumber);
  const [signer, setSigner] = useState<string>(villageSettings.villageHeadName);
  const [signerPosition, setSignerPosition] = useState<string>('Kepala Desa Sukamaju');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!app) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-sm text-slate-500">Pilih pengajuan terlebih dahulu.</p>
        <button
          onClick={() => setActiveTab('admin-pengajuan')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Buka Daftar Pengajuan
        </button>
      </div>
    );
  }

  const handleFinishApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinishing(true);

    setTimeout(() => {
      updateApplicationStatus(
        app.id, 
        'selesai', 
        'Surat resmi telah diterbitkan secara sah dan ditandatangani digital oleh Kepala Desa. Dokumen dapat langsung diunduh dan dicetak.',
        letterNumber
      );
      setIsFinishing(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('admin-pengajuan')}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Kembali ke Daftar Pengajuan</span>
        </button>

        <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
          {app.trackingNumber}
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Langkah 4: Proses Surat & Penerbitan Dokumen Resmi
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              Penerbitan {app.letterTypeName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pemohon: <span className="font-bold text-slate-900">{app.applicantName}</span> • NIK: {app.applicantNik}
            </p>
          </div>

          <button
            onClick={() => setPreviewOfficialLetter(app)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Pratinjau Format Surat</span>
          </button>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-sm text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Surat Resmi Berhasil Diterbitkan & Selesai!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Status pengajuan telah diubah menjadi <strong>Selesai</strong>. Warga ({app.applicantName}) telah menerima notifikasi real-time bahwa surat siap diunduh dan dicetak secara mandiri.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setPreviewOfficialLetter(app)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Cetak / Unduh Dokumen Sekarang</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-pengajuan')}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition"
            >
              Kembali ke Antrean Pengajuan
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFinishApplication} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Formulir Penomoran & Pengesahan Surat</h2>
            <p className="text-xs text-slate-500">Isi nomor surat resmi buku agenda register desa dan tentukan pejabat pengesah</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Surat Resmi Desa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                placeholder="470/123/Ds-SKM/X/2025"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Format baku: [Kode Klasifikasi]/[No. Urut]/Ds-[Kode Desa]/[Bulan Romawi]/[Tahun]
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pejabat Penandatangan
              </label>
              <select
                value={signer}
                onChange={(e) => {
                  setSigner(e.target.value);
                  if (e.target.value === villageSettings.villageHeadName) {
                    setSignerPosition('Kepala Desa Sukamaju');
                  } else {
                    setSignerPosition('Sekretaris Desa Sukamaju (a.n Kepala Desa)');
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={villageSettings.villageHeadName}>{villageSettings.villageHeadName} (Kepala Desa)</option>
                <option value={villageSettings.villageSecretaryName}>{villageSettings.villageSecretaryName} (Sekretaris Desa)</option>
              </select>
            </div>

            {/* Signature Pad Section (v2) */}
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Tanda Tangan Digital Resmi (Canvas Pad v2.0):
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  {customSignatureUrl 
                    ? '✓ Tanda tangan digital khusus telah digoreskan dan siap disematkan pada surat.'
                    : 'Gunakan tanda tangan digital standar atau buka pad untuk membuat tanda tangan langsung dengan mouse/touchscreen.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSignatureModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5 flex-shrink-0"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{customSignatureUrl ? 'Ubah Tanda Tangan Canvas' : 'Goreskan Tanda Tangan (Canvas)'}</span>
              </button>
            </div>
          </div>

          {/* Option to Upload Completed Scanned Document or use Auto-Generator */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Pilihan Dokumen Akhir untuk Warga:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Digital Auto Generator (Default) */}
              <div className="p-4 bg-white rounded-xl border-2 border-emerald-500 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Dokumen Digital Resmi DesaMudah (Rekomendasi)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sistem otomatis mengompilasi surat berkop resmi, nomor registrasi, QR Code verifikasi keaslian, dan stempel basah desa.
                  </p>
                </div>
                <span className="mt-3 text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded w-fit">
                  ✓ Aktif Otomatis
                </span>
              </div>

              {/* Option B: Upload Manual Scanned File */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs mb-1">
                    <UploadCloud className="w-4 h-4 text-slate-500" />
                    <span>Unggah File Scan Fisik (Opsional)</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Jika ada surat fisik hasil tanda tangan basah dan cap stempel manual di atas kertas segel desa.
                  </p>
                </div>

                <label className="mt-3 cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 underline">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCustomFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  {customFile ? `Dipilih: ${customFile.name}` : '+ Pilih File Scan PDF'}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('admin-verifikasi')}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition"
            >
              Kembali ke Verifikasi Berkas
            </button>

            <button
              type="submit"
              disabled={isFinishing}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-extrabold transition shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
            >
              {isFinishing ? (
                <span>Menerbitkan Dokumen...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Selesaikan & Terbitkan Surat Sah</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
