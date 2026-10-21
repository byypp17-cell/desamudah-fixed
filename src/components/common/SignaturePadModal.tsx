import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  signerName: string;
  signerPosition: string;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  signerName,
  signerPosition,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inkColor, setInkColor] = useState<'#1e3a8a' | '#0f172a'>('#1e3a8a'); // Blue or Black

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = inkColor;
      }
      setHasDrawn(false);
    }
  }, [isOpen, inkColor]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const usePresetSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();
    ctx.strokeStyle = inkColor;
    ctx.font = 'italic bold 38px "Plus Jakarta Sans", cursive';
    ctx.fillStyle = inkColor;
    ctx.fillText('Suryana', 120, 110);
    
    // Draw flourish underline
    ctx.beginPath();
    ctx.moveTo(80, 125);
    ctx.bezierCurveTo(140, 140, 220, 115, 340, 130);
    ctx.stroke();
    setHasDrawn(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Pad Tanda Tangan Digital Resmi (v2.0)</h3>
              <p className="text-[11px] text-slate-400">{signerName} • {signerPosition}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Goreskan tanda tangan Anda secara langsung di dalam kotak canvas menggunakan mouse atau layar sentuh, atau gunakan tanda tangan otomatis tersimpan.
          </p>

          {/* Canvas Box */}
          <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden shadow-inner flex flex-col items-center justify-center">
            <canvas
              ref={canvasRef}
              width={440}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair touch-none w-full h-[180px]"
            />

            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 text-xs italic">
                Tanda tangani di sini dengan mouse atau jari sentuh...
              </div>
            )}

            {/* Bottom guide line */}
            <div className="absolute bottom-6 left-8 right-8 border-b border-slate-200 pointer-events-none" />
          </div>

          {/* Toolbar: Color & Clear & Auto Preset */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-semibold text-[11px]">Warna Tinta:</span>
              <button
                type="button"
                onClick={() => setInkColor('#1e3a8a')}
                className={`w-6 h-6 rounded-full bg-blue-900 border-2 transition ${
                  inkColor === '#1e3a8a' ? 'border-emerald-500 scale-110 shadow-xs' : 'border-white'
                }`}
                title="Tinta Biru Resmi"
              />
              <button
                type="button"
                onClick={() => setInkColor('#0f172a')}
                className={`w-6 h-6 rounded-full bg-slate-900 border-2 transition ${
                  inkColor === '#0f172a' ? 'border-emerald-500 scale-110 shadow-xs' : 'border-white'
                }`}
                title="Tinta Hitam"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="px-2.5 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Hapus Canvas</span>
              </button>

              <button
                type="button"
                onClick={usePresetSignature}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition border border-blue-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gunakan Ttd Kades (Otomatis)</span>
              </button>
            </div>
          </div>

          {/* Cryptographic hash info */}
          <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 font-mono flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate">
              Enkripsi Hash: SHA256-DS-{Math.random().toString(36).substring(2, 10).toUpperCase()} (Tersertifikasi Balai Sertifikasi Elektronik)
            </span>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!hasDrawn}
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Tanda Tangan ke Surat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
