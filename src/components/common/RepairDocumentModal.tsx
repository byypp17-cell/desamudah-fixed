import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UploadCloud, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

export const RepairDocumentModal: React.FC = () => {
  const { repairingDocModal, setRepairingDocModal, reuploadDocument } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!repairingDocModal) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !previewUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate successful reupload
      const fileName = file ? file.name : `Perbaikan_${repairingDocModal.requirementName.replace(/\s+/g, '_')}.jpg`;
      const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB';
      const fileType = file ? file.type : 'image/jpeg';
      const fileUrl = previewUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';

      reuploadDocument(repairingDocModal.appId, repairingDocModal.docId, {
        fileName,
        fileSize,
        fileType,
        fileUrl,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setRepairingDocModal(null);
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-500 text-white">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-base">Perbaiki & Unggah Ulang Dokumen</h3>
          </div>
          <button
            onClick={() => setRepairingDocModal(null)}
            className="p-1 rounded-lg hover:bg-amber-600/60 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rejection Note from Admin */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
              Catatan Perbaikan dari Perangkat Desa:
            </div>
            <p className="text-sm text-amber-900 font-medium italic">
              "{repairingDocModal.rejectionReason || 'Berkas tidak jelas / buram. Silakan unggah ulang versi yang jelas.'}"
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Dokumen yang Harus Diperbaiki
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{repairingDocModal.requirementName}</span>
            </div>
          </div>

          {/* Upload Area */}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Pilih File Dokumen Baru (JPG, PNG, PDF maks. 5MB)
              </label>

              <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-emerald-50/30 hover:bg-emerald-50/70 transition">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-emerald-600 mb-2" />
                <span className="text-sm font-medium text-slate-700">
                  {file ? file.name : 'Klik untuk memilih file foto / dokumen baru'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Pastikan foto jelas, tulisan terbaca, dan pencahayaan terang
                </span>
              </label>

              {/* Sample Quick Pick for fast prototype testing */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Atau gunakan dokumen simulasi:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80');
                    setFile(new File(['dummy'], `${repairingDocModal.requirementName}_Jelas.jpg`, { type: 'image/jpeg' }));
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold underline"
                >
                  Gunakan Foto Jelas (Auto-fill Demo)
                </button>
              </div>
            </div>

            {isSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center space-x-2 text-emerald-700 font-medium text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Berkas berhasil diperbaiki dan dikirim ke perangkat desa!</span>
              </div>
            ) : (
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRepairingDocModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!file && !previewUrl)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition shadow-sm flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Mengunggah...</span>
                  ) : (
                    <span>Kirim Berkas Perbaikan</span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
