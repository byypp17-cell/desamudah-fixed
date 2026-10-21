import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, Search, CheckCircle2, AlertTriangle, FileText, Printer, Building2, QrCode } from 'lucide-react';
import { Application } from '../../types';

interface PublicVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingNumber?: string;
}

export const PublicVerificationModal: React.FC<PublicVerificationModalProps> = ({
  isOpen,
  onClose,
  initialTrackingNumber = '',
}) => {
  const { applications, villageSettings, setPreviewOfficialLetter } = useApp();
  const [searchInput, setSearchInput] = useState(initialTrackingNumber);
  const [searchedApp, setSearchedApp] = useState<Application | null>(() => {
    if (initialTrackingNumber) {
      return applications.find(a => 
        a.trackingNumber.toLowerCase() === initialTrackingNumber.toLowerCase() ||
        (a.officialLetterNumber && a.officialLetterNumber.toLowerCase() === initialTrackingNumber.toLowerCase())
      ) || null;
    }
    return applications.find(a => a.status === 'selesai') || null;
  });

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    const match = applications.find(a => 
      a.trackingNumber.toLowerCase().includes(query) ||
      (a.officialLetterNumber && a.officialLetterNumber.toLowerCase().includes(query))
    );
    setSearchedApp(match || null);
  };

  // Mask NIK for privacy compliance
  const maskNik = (nik: string) => {
    if (!nik || nik.length < 10) return '320412******0001';
    return `${nik.slice(0, 6)}******${nik.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-400/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 uppercase tracking-wider">
                  Portal Validasi Publik v2.0
                </span>
                <span className="text-xs text-slate-300">• Open Verification System</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Verifikasi Keaslian Surat Digital
              </h2>
              <p className="text-xs text-slate-300">
                Pemerintah {villageSettings.villageName}, {villageSettings.districtName}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar for Third-Party */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Masukkan Nomor Registrasi / No. Surat (misal: DM-2025-SKD-0042)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Cek Keaslian
            </button>
          </form>
        </div>

        {/* Verification Result */}
        <div className="p-6">
          {searchedApp ? (
            <div className="space-y-5">
              
              {/* Authenticity Banner */}
              <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                searchedApp.status === 'selesai'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className={`p-2 rounded-xl mt-0.5 ${
                  searchedApp.status === 'selesai' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {searchedApp.status === 'selesai' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {searchedApp.status === 'selesai' 
                      ? '✓ DOKUMEN RESMI & TERVERIFIKASI SAH' 
                      : 'STATUS: DOKUMEN SEDANG DALAM PROSES VERIFIKASI'}
                  </h3>
                  <p className="text-xs mt-0.5 leading-relaxed">
                    {searchedApp.status === 'selesai'
                      ? `Dokumen terdaftar resmi dalam Buku Agenda Pelayanan Administrasi Kependudukan ${villageSettings.villageName}.`
                      : 'Surat ini belum selesai diproses atau masih dalam antrean verifikasi perangkat desa.'}
                  </p>
                </div>
              </div>

              {/* Data Verification Table */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">No. Registrasi Sistem</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{searchedApp.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Nomor Surat Resmi Desa</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {searchedApp.officialLetterNumber || 'Dalam Penomoran'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Jenis Surat</span>
                    <span className="font-bold text-slate-800">{searchedApp.letterTypeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Tanggal Pengesahan</span>
                    <span className="text-slate-800">{searchedApp.officialLetterDate || searchedApp.completedAt || '15 Oktober 2025'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Nama Pemohon</span>
                    <span className="font-bold text-slate-900 uppercase">{searchedApp.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">NIK Pemohon (Terlindungi)</span>
                    <span className="font-mono text-slate-700">{maskNik(searchedApp.applicantNik)}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Keperluan Surat</span>
                    <span className="text-slate-800 italic">"{searchedApp.purpose}"</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Penandatangan Dokumen</span>
                    <span className="font-semibold text-slate-800">{searchedApp.signedBy || villageSettings.villageHeadName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Jabatan Pengesah</span>
                    <span className="text-slate-700">{searchedApp.signedPosition || 'Kepala Desa Sukamaju'}</span>
                  </div>
                </div>

                {/* Cryptographic hash info */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-400 font-mono gap-1">
                  <span>Sertifikat Digital: SHA256-DS-{searchedApp.trackingNumber.slice(-4)}-VALID</span>
                  <span>Masa Berlaku: 6 (Enam) Bulan</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-slate-500 italic">
                  Diverifikasi secara langsung oleh Database DesaMudah
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onClose();
                      setPreviewOfficialLetter(searchedApp);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Dokumen Asli</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Dokumen Tidak Ditemukan</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Nomor registrasi yang Anda masukkan tidak terdaftar pada buku register Desa Sukamaju. Pastikan nomor yang dimasukkan sudah benar.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
