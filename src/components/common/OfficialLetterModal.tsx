import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, CheckCircle, ShieldCheck, Share2, ExternalLink } from 'lucide-react';

export const OfficialLetterModal: React.FC = () => {
  const { 
    previewOfficialLetter, 
    setPreviewOfficialLetter, 
    villageSettings,
    setPublicVerifyModalOpen,
    setPublicVerifyTrackingNumber,
    customSignatureUrl 
  } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!previewOfficialLetter) return null;

  const app = previewOfficialLetter;

  const handlePrint = () => {
    window.print();
  };

  // Generate dynamic letter content based on letter type
  const renderLetterBody = () => {
    switch (app.letterTypeCode) {
      case 'SKD':
        return (
          <>
            <p className="mb-4 text-justify leading-relaxed">
              Bahwa nama tersebut di atas adalah benar-benar warga yang bertempat tinggal dan berdomisili tetap di alamat <strong>{app.applicantAddress} ({app.applicantRtRw})</strong>, {villageSettings.villageName}, {villageSettings.districtName}, {villageSettings.regencyName}, selama kurang lebih <strong>{app.additionalData.lamaMenetap || 'beberapa tahun'}</strong> dengan status tempat tinggal <strong>{app.additionalData.statusTempatTinggal || 'Milik Sendiri'}</strong>.
            </p>
            <p className="mb-4 text-justify leading-relaxed">
              Surat Keterangan Domisili ini diberikan kepada yang bersangkutan untuk keperluan:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-medium text-slate-800 mb-4">
              "{app.purpose}"
            </div>
            <p className="text-justify leading-relaxed">
              Surat keterangan ini berlaku selama 6 (enam) bulan terhitung sejak tanggal diterbitkan.
            </p>
          </>
        );

      case 'SKU':
        return (
          <>
            <p className="mb-4 text-justify leading-relaxed">
              Bahwa nama tersebut di atas adalah benar-benar penduduk desa kami yang memiliki dan menjalankan kegiatan usaha aktif sebagai berikut:
            </p>
            <table className="w-full mb-4 text-sm">
              <tbody>
                <tr>
                  <td className="w-48 py-1 font-semibold text-slate-700">Nama Usaha</td>
                  <td className="py-1">: <strong>{app.additionalData.namaUsaha || 'Usaha Mandiri'}</strong></td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Bidang / Jenis Usaha</td>
                  <td className="py-1">: {app.additionalData.bidangUsaha || 'Perdagangan / UMKM'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Alamat Tempat Usaha</td>
                  <td className="py-1">: {app.additionalData.alamatUsaha || app.applicantAddress}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold text-slate-700">Lama Usaha Berdiri</td>
                  <td className="py-1">: {app.additionalData.lamaBerdiri || '1 Tahun'}</td>
                </tr>
              </tbody>
            </table>
            <p className="mb-4 text-justify leading-relaxed">
              Surat Keterangan Usaha ini diterbitkan untuk keperluan:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-medium text-slate-800 mb-4">
              "{app.purpose}"
            </div>
          </>
        );

      case 'SKTM':
        return (
          <>
            <p className="mb-4 text-justify leading-relaxed">
              Bahwa nama tersebut di atas adalah benar penduduk {villageSettings.villageName} dan berdasarkan data kependudukan serta hasil verifikasi lapangan, keluarga yang bersangkutan tergolong dalam <strong>Keluarga Berpenghasilan Rendah / Tidak Mampu (Prasejahtera)</strong> dengan rata-rata penghasilan {app.additionalData.estimasiPenghasilan || 'kurang dari UMR'}.
            </p>
            <p className="mb-4 text-justify leading-relaxed">
              Surat Keterangan Tidak Mampu ini diterbitkan untuk kepentingan pengajuan:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-medium text-slate-800 mb-4">
              "{app.purpose} ({app.additionalData.tujuanSktm || 'Beasiswa Pendidikan'})" atas nama: <strong>{app.additionalData.namaSiswa || app.applicantName}</strong>
            </div>
          </>
        );

      case 'SKP':
        return (
          <>
            <p className="mb-4 text-justify leading-relaxed">
              Bahwa nama tersebut di atas adalah benar warga kami yang berkelakuan baik, tidak sedang menjalani proses hukum pidana maupun perdata, dan surat pengantar ini diberikan untuk pengurusan:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-medium text-slate-800 mb-4">
              "{app.purpose || app.additionalData.tujuanPengantar || 'Pengurusan Administrasi Kedinasan'}"
            </div>
          </>
        );

      default:
        return (
          <>
            <p className="mb-4 text-justify leading-relaxed">
              Bahwa nama tersebut di atas adalah benar warga kami yang tercatat dalam buku induk kependudukan {villageSettings.villageName}. Surat keterangan ini diterbitkan secara sah untuk keperluan:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-medium text-slate-800 mb-4">
              "{app.purpose}"
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      {/* Container */}
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-slate-100 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Toolbar (Non-printable) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">
                Surat Resmi Terverifikasi Digital
              </h3>
              <p className="text-xs text-slate-300">
                No. Registrasi: {app.officialLetterNumber || app.trackingNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={() => setPreviewOfficialLetter(null)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Document */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/60">
          <div 
            ref={printRef}
            className="w-full max-w-3xl bg-white p-8 sm:p-12 shadow-xl border border-slate-300 text-slate-900 font-serif leading-normal"
            style={{ minHeight: '1050px' }}
          >
            {/* Kop Surat Resmi */}
            <div className="text-center pb-3 border-b-4 border-double border-slate-900 relative">
              {/* Logo Pemda / Garuda */}
              <div className="absolute left-2 top-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-amber-50 flex items-center justify-center text-amber-800 font-bold text-2xl shadow-sm">
                  🏛️
                </div>
              </div>

              <div className="pl-14 sm:pl-0">
                <h4 className="text-base sm:text-lg font-bold tracking-wider uppercase text-slate-900">
                  PEMERINTAH {villageSettings.regencyName.toUpperCase()}
                </h4>
                <h4 className="text-base sm:text-lg font-bold tracking-wider uppercase text-slate-900">
                  {villageSettings.districtName.toUpperCase()}
                </h4>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-widest uppercase text-emerald-950 mt-0.5">
                  {villageSettings.villageName.toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 italic font-sans mt-1">
                  {villageSettings.officeAddress} • Kodepos: {villageSettings.postalCode}
                </p>
                <p className="text-xs text-slate-600 font-sans">
                  Telp: {villageSettings.contactPhone} | Email: {villageSettings.contactEmail}
                </p>
              </div>
            </div>

            {/* Letter Title & Number */}
            <div className="text-center my-6">
              <h2 className="text-lg sm:text-xl font-bold uppercase underline decoration-2 underline-offset-4 tracking-wide text-slate-900">
                {app.letterTypeName.toUpperCase()}
              </h2>
              <p className="text-sm font-sans font-medium text-slate-700 mt-1">
                Nomor: {app.officialLetterNumber || `470/${app.trackingNumber.slice(-4)}/Ds-SKM/X/2025`}
              </p>
            </div>

            {/* Letter Opening */}
            <p className="mb-4 text-justify leading-relaxed">
              Yang bertanda tangan di bawah ini Kepala {villageSettings.villageName}, {villageSettings.districtName}, {villageSettings.regencyName}, dengan ini menerangkan dengan sebenarnya bahwa:
            </p>

            {/* Applicant Identity Table */}
            <div className="px-4 sm:px-8 mb-5">
              <table className="w-full text-sm sm:text-base border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="w-48 py-1.5 font-medium text-slate-700">Nama Lengkap</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-bold uppercase text-slate-900">{app.applicantName}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-medium text-slate-700">NIK (Nomor Induk Kependudukan)</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 font-mono tracking-wider font-semibold text-slate-900">{app.applicantNik}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-medium text-slate-700">No. Kartu Keluarga</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 font-mono tracking-wider text-slate-800">{app.applicantKk}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-medium text-slate-700">Tempat / Tanggal Lahir</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 text-slate-900">{app.applicantTtl}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-medium text-slate-700">Pekerjaan</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 text-slate-900">{app.applicantOccupation || 'Wiraswasta'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium text-slate-700 align-top">Alamat Domisili</td>
                    <td className="py-1.5 align-top">:</td>
                    <td className="py-1.5 text-slate-900 leading-snug">
                      {app.applicantAddress} ({app.applicantRtRw}), {villageSettings.villageName}, {villageSettings.districtName}, {villageSettings.regencyName}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Specific Body Content */}
            <div className="text-sm sm:text-base">
              {renderLetterBody()}
            </div>

            {/* Closing */}
            <p className="mt-5 mb-8 text-justify leading-relaxed text-sm sm:text-base">
              Demikian surat keterangan ini kami buat dengan sebenarnya dalam keadaan sadar dan tanpa paksaan dari pihak manapun, agar dapat dipergunakan sebagaimana mestinya oleh yang bersangkutan.
            </p>

            {/* Signature & Seal Block */}
            <div className="flex justify-between items-end mt-12 pt-4">
              {/* QR Code Verification Section (Clickable for v2 Public Verification) */}
              <div 
                onClick={() => {
                  setPublicVerifyTrackingNumber(app.trackingNumber);
                  setPublicVerifyModalOpen(true);
                }}
                className="w-48 text-center p-3 border border-slate-200 rounded-lg bg-slate-50 font-sans cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-300 transition group"
                title="Klik untuk Simulasikan Cek Keaslian Dokumen via Portal Publik (v2.0)"
              >
                <div className="w-24 h-24 mx-auto bg-white p-1 border border-slate-300 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  {/* Simulated QR Code SVG */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm12 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-6h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z"/>
                  </svg>
                </div>
                <div className="text-[10px] text-slate-600 mt-2 font-mono">
                  Scan validasi keaslian surat:
                </div>
                <div className="text-[9px] font-bold text-emerald-700 tracking-tight group-hover:underline flex items-center justify-center space-x-0.5">
                  <span>desamudah.id/v/{app.trackingNumber}</span>
                  <ExternalLink className="w-2.5 h-2.5 inline" />
                </div>
              </div>

              {/* Village Head Signature & Stamp */}
              <div className="w-64 text-center relative font-sans">
                <p className="text-sm text-slate-800">
                  {villageSettings.villageName.replace('Desa ', '')}, {app.officialLetterDate || '15 Oktober 2025'}
                </p>
                <p className="text-sm font-bold uppercase text-slate-900 mb-1">
                  KEPALA {villageSettings.villageName.toUpperCase()}
                </p>

                {/* Stempel Basah Merah Desa (Positioned over signature) */}
                <div 
                  className="absolute left-4 top-8 w-28 h-28 rounded-full border-2 border-red-600/70 text-red-600 flex flex-col items-center justify-center p-1 pointer-events-none transform -rotate-12 select-none"
                  style={{ textShadow: '0 0 1px rgba(220,38,38,0.3)' }}
                >
                  <div className="text-[8px] font-black uppercase text-center tracking-tighter leading-tight border-b border-red-500/50 pb-0.5 w-full">
                    PEMERINTAH KABUPATEN
                  </div>
                  <div className="text-[7px] font-bold text-center leading-tight my-0.5">
                    ★ DESA SUKAMAJU ★
                  </div>
                  <div className="text-[8px] font-black uppercase text-center tracking-tighter leading-tight border-t border-red-500/50 pt-0.5 w-full">
                    KEC. SUKARESMI
                  </div>
                </div>

                {/* Digital Signature line (Supports drawn canvas signature from v2) */}
                <div className="h-16 flex items-center justify-center">
                  {app.signatureDataUrl || customSignatureUrl ? (
                    <img 
                      src={app.signatureDataUrl || customSignatureUrl || ''} 
                      alt="Tanda Tangan Digital Kepala Desa" 
                      className="max-h-14 max-w-full object-contain filter contrast-125"
                    />
                  ) : (
                    <div className="text-2xl font-serif italic text-blue-900 font-bold opacity-80 transform -rotate-3 select-none">
                      Suryana
                    </div>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-900 underline uppercase tracking-wide">
                  {app.signedBy || villageSettings.villageHeadName}
                </p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  NIP. {villageSettings.villageHeadNip}
                </p>
              </div>
            </div>

            {/* Security Footer */}
            <div className="mt-12 pt-3 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-sans">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Dokumen sah diterbitkan melalui Portal Pelayanan Administrasi Digital DesaMudah</span>
              </span>
              <span>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
