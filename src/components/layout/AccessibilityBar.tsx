import React from 'react';
import { useApp } from '../../context/AppContext';
import { Type, Eye, Volume2, ShieldCheck, Sparkles } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { accessibilitySettings, updateAccessibilitySettings } = useApp();

  const handleFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    updateAccessibilitySettings({ fontSize: size });
  };

  const handleToggleContrast = () => {
    updateAccessibilitySettings({ highContrast: !accessibilitySettings.highContrast });
  };

  const handleSpeechGuide = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Selamat datang di DesaMudah versi 2.0. Layanan administrasi desa resmi. Silakan pilih jenis surat atau hubungi bantuan desa jika Anda memerlukan pendampingan.'
      );
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Fitur suara tidak didukung pada browser ini.');
    }
  };

  return (
    <div className="bg-slate-900 text-white text-xs px-4 py-1.5 border-b border-slate-800 flex items-center justify-between select-none">
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wider hidden sm:inline-block">
          Aksesibilitas Ramah Lansia (v2.0)
        </span>
        <span className="text-[11px] text-slate-300">Ukuran Huruf:</span>
        <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={() => handleFontSize('normal')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
              accessibilitySettings.fontSize === 'normal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Ukuran Standar"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => handleFontSize('large')}
            className={`px-2 py-0.5 rounded text-xs font-bold transition ${
              accessibilitySettings.fontSize === 'large' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Ukuran Besar"
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => handleFontSize('xlarge')}
            className={`px-2 py-0.5 rounded text-sm font-bold transition ${
              accessibilitySettings.fontSize === 'xlarge' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Ukuran Ekstra Besar (Lansia)"
          >
            A++
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleToggleContrast}
          className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold transition flex items-center space-x-1 ${
            accessibilitySettings.highContrast
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Mode Kontras Tinggi untuk Keterbacaan Maksimal"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kontras Tinggi</span>
        </button>

        <button
          type="button"
          onClick={handleSpeechGuide}
          className="px-2.5 py-0.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold transition flex items-center space-x-1"
          title="Dengarkan Panduan Suara Bahasa Indonesia"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Bantuan Suara</span>
        </button>
      </div>
    </div>
  );
};
