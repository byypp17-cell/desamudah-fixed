import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ZoomIn, ZoomOut, RotateCw, Download, FileText, ExternalLink } from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { previewDocument, setPreviewDocument } = useApp();
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  if (!previewDocument) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const isImage = previewDocument.url.includes('unsplash.com') || 
                  previewDocument.name.endsWith('.jpg') || 
                  previewDocument.name.endsWith('.jpeg') || 
                  previewDocument.name.endsWith('.png');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-1">
                {previewDocument.name}
              </h3>
              <p className="text-xs text-slate-500">
                Pratinjau Dokumen Persyaratan Digital
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isImage && (
              <div className="hidden sm:flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-1 mr-2">
                <button
                  onClick={handleZoomOut}
                  title="Perkecil"
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-slate-600 px-2">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  title="Perbesar"
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                <button
                  onClick={handleRotate}
                  title="Putar 90°"
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            <a
              href={previewDocument.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Asli</span>
            </a>

            <button
              onClick={() => setPreviewDocument(null)}
              className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-slate-100 p-4 sm:p-8 overflow-auto flex items-center justify-center">
          {isImage ? (
            <div className="transition-transform duration-200 ease-out flex items-center justify-center">
              <img
                src={previewDocument.url}
                alt={previewDocument.name}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  maxHeight: '65vh',
                  maxWidth: '100%',
                }}
                className="rounded-lg shadow-lg object-contain bg-white border border-slate-200"
              />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow border border-slate-200 max-w-lg text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-1">{previewDocument.name}</h4>
              <p className="text-sm text-slate-500 mb-6">
                Dokumen format PDF resmi tersimpan dengan enkripsi aman di cloud storage desa.
              </p>
              <a
                href={previewDocument.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Dokumen Berkas</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Keamanan: Dokumen ini terverifikasi secara internal oleh sistem DesaMudah</span>
          <button
            onClick={() => setPreviewDocument(null)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
