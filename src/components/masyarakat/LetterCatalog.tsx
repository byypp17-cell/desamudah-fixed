import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  FileCheck2,
  Filter
} from 'lucide-react';

export const LetterCatalog: React.FC = () => {
  const { letterTypes, setSelectedLetterTypeId, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Kependudukan',
    'Usaha & Ekonomi',
    'Kesejahteraan',
    'Catatan Sipil',
    'Umum'
  ];

  const filteredLetters = letterTypes.filter(letter => {
    const matchesSearch = letter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          letter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          letter.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || letter.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectLetter = (id: string) => {
    setSelectedLetterTypeId(id);
    setActiveTab('form-pengajuan');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Katalog Layanan Surat Desa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pilih Jenis Surat yang Ingin Diajukan
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Pilih salah satu dari 8 jenis surat administrasi resmi di bawah ini. Pastikan Anda telah menyiapkan dokumen persyaratan yang diwajibkan sebelum mengisi formulir.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari surat (contoh: Domisili, SKU, SKTM, Belum Menikah)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      {filteredLetters.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Jenis Surat Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada jenis surat yang cocok dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500/80 transition flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {letter.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {letter.category}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {letter.estimatedDays}
                  </span>
                </div>

                {/* Letter Name */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {letter.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {letter.description}
                </p>

                {/* Legal basis */}
                <div className="mt-3 px-3 py-2 bg-slate-50 rounded-xl text-[11px] text-slate-500 font-sans italic border border-slate-100">
                  ⚖️ Dasar Hukum: {letter.legalBasis}
                </div>

                {/* Requirements list */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Dokumen Persyaratan yang Wajib Diunggah ({letter.requirements.length}):
                  </span>
                  <ul className="space-y-1.5">
                    {letter.requirements.map((req) => (
                      <li key={req.id} className="text-xs text-slate-600 flex items-start space-x-2">
                        <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                          req.required ? 'text-emerald-500' : 'text-slate-400'
                        }`} />
                        <span>
                          {req.name} {req.required ? <span className="text-rose-500 font-bold">*</span> : <span className="text-slate-400">(Opsional)</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSelectLetter(letter.id)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-sm flex items-center justify-center space-x-2 group-hover:shadow-md"
                >
                  <span>Pilih & Ajukan Surat Ini</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
