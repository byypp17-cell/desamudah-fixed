import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  UploadCloud, 
  FileText, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { SubmittedDocument } from '../../types';

export const ApplicationForm: React.FC = () => {
  const { 
    currentUser, 
    letterTypes, 
    selectedLetterTypeId, 
    setSelectedLetterTypeId, 
    createApplication, 
    setActiveTab, 
    setSelectedApplicationId,
    setPreviewDocument
  } = useApp();

  // Active letter type
  const activeLetter = letterTypes.find(l => l.id === selectedLetterTypeId) || letterTypes[0];

  // Wizard Step: 1 = Data Pemohon, 2 = Keperluan & Detail, 3 = Upload Berkas, 4 = Konfirmasi
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State: Applicant Info
  const [applicantData, setApplicantData] = useState({
    name: currentUser.name,
    nik: currentUser.nik,
    noKK: currentUser.noKK,
    birthPlace: currentUser.birthPlace,
    birthDate: currentUser.birthDate,
    gender: currentUser.gender,
    address: currentUser.address,
    rtRw: currentUser.rtRw,
    phone: currentUser.phone,
    email: currentUser.email,
    occupation: currentUser.occupation,
  });

  // Form State: Purpose & Extra fields
  const [purpose, setPurpose] = useState('');
  const [extraFieldsData, setExtraFieldsData] = useState<Record<string, string>>({});

  // Form State: Uploaded Documents map by requirementId
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, {
    fileName: string;
    fileSize: string;
    fileType: string;
    fileUrl: string;
  }>>({});

  // Agreement checkbox on step 4
  const [agreement, setAgreement] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill initial dummy upload for smooth demo experience if requested
  const handleAutoFillDemoFiles = () => {
    const demoFiles: Record<string, { fileName: string; fileSize: string; fileType: string; fileUrl: string }> = {};
    activeLetter.requirements.forEach((req, idx) => {
      demoFiles[req.id] = {
        fileName: `${req.name.replace(/[^a-zA-Z0-9]/g, '_')}_${currentUser.name.replace(/\s+/g, '_')}.pdf`,
        fileSize: `${(1.2 + idx * 0.4).toFixed(1)} MB`,
        fileType: 'application/pdf',
        fileUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      };
    });
    setUploadedDocs(demoFiles);
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent, reqId: string, reqName: string) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedDocs(prev => ({
        ...prev,
        [reqId]: {
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: file.type || 'application/pdf',
          fileUrl: URL.createObjectURL(file),
        }
      }));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, reqId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedDocs(prev => ({
        ...prev,
        [reqId]: {
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: file.type || 'application/pdf',
          fileUrl: URL.createObjectURL(file),
        }
      }));
    }
  };

  const handleRemoveFile = (reqId: string) => {
    setUploadedDocs(prev => {
      const copy = { ...prev };
      delete copy[reqId];
      return copy;
    });
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors: string[] = [];
    if (!applicantData.name.trim()) errors.push('Nama lengkap pemohon wajib diisi');
    if (!applicantData.nik || applicantData.nik.length !== 16) errors.push('NIK harus terdiri dari 16 digit angka');
    if (!applicantData.noKK || applicantData.noKK.length !== 16) errors.push('Nomor Kartu Keluarga (KK) harus 16 digit');
    if (!applicantData.phone.trim()) errors.push('Nomor telepon / WhatsApp aktif wajib diisi');
    if (!applicantData.address.trim()) errors.push('Alamat domisili wajib diisi');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errors: string[] = [];
    if (!purpose.trim()) errors.push('Keperluan permohonan surat wajib dijelaskan secara spesifik');
    
    // Check required extra fields
    if (activeLetter.extraFields) {
      activeLetter.extraFields.forEach(field => {
        if (field.required && !extraFieldsData[field.id]) {
          errors.push(`${field.label} wajib diisi`);
        }
      });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errors: string[] = [];
    activeLetter.requirements.forEach(req => {
      if (req.required && !uploadedDocs[req.id]) {
        errors.push(`Dokumen "${req.name}" wajib diunggah`);
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handleSubmit = () => {
    if (!agreement) {
      setValidationErrors(['Anda wajib mencentang pernyataan kebenaran data dan dokumen']);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    setTimeout(() => {
      // Build submitted documents array
      const docList: SubmittedDocument[] = activeLetter.requirements
        .filter(req => uploadedDocs[req.id])
        .map(req => {
          const uploaded = uploadedDocs[req.id];
          return {
            id: `doc-${Date.now()}-${req.id}`,
            requirementId: req.id,
            requirementName: req.name,
            fileName: uploaded.fileName,
            fileSize: uploaded.fileSize,
            fileType: uploaded.fileType,
            fileUrl: uploaded.fileUrl,
            uploadedAt: new Date().toISOString(),
            status: 'sedang_diverifikasi',
          };
        });

      const newApp = createApplication({
        letterTypeId: activeLetter.id,
        purpose,
        additionalData: extraFieldsData,
        documents: docList,
        applicantData,
      });

      setIsSubmitting(false);
      setSelectedApplicationId(newApp.id);
      setActiveTab('detail-pengajuan');
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Navigation & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('pilih-surat')}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Kembali ke Katalog Surat</span>
        </button>

        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
          KODE: {activeLetter.code}
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Formulir Permohonan Online
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {activeLetter.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {activeLetter.description}
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-right flex-shrink-0">
            <span className="text-[11px] font-semibold text-emerald-700 block">Estimasi Selesai:</span>
            <span className="text-sm font-extrabold text-emerald-900">{activeLetter.estimatedDays}</span>
          </div>
        </div>

        {/* Wizard Progress Steps Indicator */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: 'Data Pemohon' },
              { num: 2, label: 'Keperluan & Detail' },
              { num: 3, label: 'Upload Berkas' },
              { num: 4, label: 'Konfirmasi' },
            ].map((step) => (
              <div 
                key={step.num}
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num);
                }}
                className={`cursor-pointer transition ${
                  currentStep === step.num 
                    ? 'text-emerald-700 font-bold' 
                    : currentStep > step.num 
                    ? 'text-slate-700 font-medium' 
                    : 'text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center mb-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    currentStep === step.num 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100' 
                      : currentStep > step.num 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {currentStep > step.num ? <CheckCircle className="w-4 h-4" /> : step.num}
                  </div>
                </div>
                <span className="text-xs hidden sm:block">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs animate-shake">
          <div className="flex items-center space-x-2 font-bold mb-1">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Mohon lengkapi data berikut sebelum melanjutkan:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 1: Data Pemohon */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Data Identitas Pemohon</h2>
              <p className="text-xs text-slate-500">Data otomatis terisi dari profil kependudukan Anda</p>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
              Terverifikasi di DTKS Desa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={applicantData.name}
                onChange={(e) => setApplicantData({ ...applicantData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIK (Nomor Induk Kependudukan - 16 Digit) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={applicantData.nik}
                onChange={(e) => setApplicantData({ ...applicantData, nik: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Kartu Keluarga (KK - 16 Digit) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={applicantData.noKK}
                onChange={(e) => setApplicantData({ ...applicantData, noKK: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp / Telepon Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={applicantData.phone}
                onChange={(e) => setApplicantData({ ...applicantData, phone: e.target.value })}
                placeholder="0812xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={applicantData.birthPlace}
                onChange={(e) => setApplicantData({ ...applicantData, birthPlace: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={applicantData.birthDate}
                onChange={(e) => setApplicantData({ ...applicantData, birthDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pekerjaan
              </label>
              <input
                type="text"
                value={applicantData.occupation}
                onChange={(e) => setApplicantData({ ...applicantData, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                RT / RW
              </label>
              <input
                type="text"
                value={applicantData.rtRw}
                onChange={(e) => setApplicantData({ ...applicantData, rtRw: e.target.value })}
                placeholder="RT 03 / RW 05"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Lengkap Tempat Tinggal <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={applicantData.address}
                onChange={(e) => setApplicantData({ ...applicantData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center space-x-2"
            >
              <span>Lanjut ke Formulir Detail</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Keperluan & Detail Surat Khusus */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 animate-fadeIn">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">2. Keperluan & Rincian Pengajuan</h2>
            <p className="text-xs text-slate-500">Tentukan alasan pembuatan dan informasi pendukung untuk surat {activeLetter.name}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Keperluan Pembuatan Surat <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Persyaratan pengajuan kredit KUR BRI / Persyaratan beasiswa KIP Kuliah / Melamar pekerjaan di BUMN..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Jelaskan secara rinci agar redaksi resmi surat sesuai dengan instansi yang dituju.
            </p>
          </div>

          {/* Render Dynamic Extra Fields according to letter type */}
          {activeLetter.extraFields && activeLetter.extraFields.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Pertanyaan Khusus untuk {activeLetter.name}:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeLetter.extraFields.map((field) => (
                  <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        value={extraFieldsData[field.id] || ''}
                        onChange={(e) => setExtraFieldsData({ ...extraFieldsData, [field.id]: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="">-- {field.placeholder} --</option>
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={2}
                        placeholder={field.placeholder}
                        value={extraFieldsData[field.id] || ''}
                        onChange={(e) => setExtraFieldsData({ ...extraFieldsData, [field.id]: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={extraFieldsData[field.id] || ''}
                        onChange={(e) => setExtraFieldsData({ ...extraFieldsData, [field.id]: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center space-x-2"
            >
              <span>Lanjut ke Upload Dokumen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Upload Berkas Persyaratan */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Upload Berkas Persyaratan</h2>
              <p className="text-xs text-slate-500">Unggah dokumen asli yang jelas (PDF, JPG, PNG maks. 5MB per file)</p>
            </div>

            {/* Quick Demo Helper Button */}
            <button
              type="button"
              onClick={handleAutoFillDemoFiles}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition border border-emerald-200 flex-shrink-0"
              title="Otomatis isi berkas contoh untuk mempermudah uji coba prototipe"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto-Upload Contoh Berkas (Demo)</span>
            </button>
          </div>

          {/* List of Document Requirements with Drag-and-drop & Status */}
          <div className="space-y-4">
            {activeLetter.requirements.map((req) => {
              const uploaded = uploadedDocs[req.id];

              return (
                <div 
                  key={req.id}
                  className={`p-4 rounded-2xl border transition ${
                    uploaded 
                      ? 'bg-emerald-50/40 border-emerald-300' 
                      : req.required 
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300' 
                      : 'bg-slate-50/50 border-dashed border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-800">{req.name}</span>
                        {req.required ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            Wajib
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                            Opsional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{req.description}</p>
                    </div>

                    {/* Document Status Indicator */}
                    <div>
                      {uploaded ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Sudah Diunggah
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-600">
                          Belum Diunggah
                        </span>
                      )}
                    </div>
                  </div>

                  {uploaded ? (
                    /* Uploaded file preview card */
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200 mt-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{uploaded.fileName}</p>
                          <p className="text-[10px] text-slate-400">{uploaded.fileSize} • Siap dikirim</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDocument({ name: uploaded.fileName, url: uploaded.fileUrl, type: uploaded.fileType })}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center space-x-1 transition"
                          title="Pratinjau File"
                        >
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs hidden sm:inline">Pratinjau</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(req.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition"
                          title="Hapus file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Dropzone & file input */
                    <label 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, req.id, req.name)}
                      className="mt-2 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-emerald-50/20 transition group"
                    >
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileInput(e, req.id)}
                        className="hidden"
                      />
                      <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-emerald-600 mb-1 transition-colors" />
                      <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800">
                        Drag & drop file di sini, atau <span className="text-emerald-600 underline">pilih dari perangkat</span>
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Format: {req.acceptedFormats.join(', ')} (Maks. {req.maxSizeMB}MB)
                      </span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center space-x-2"
            >
              <span>Lanjut ke Konfirmasi Pengajuan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Konfirmasi & Pernyataan */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">4. Konfirmasi Permohonan</h2>
            <p className="text-xs text-slate-500">Periksa kembali ringkasan data sebelum dikirimkan ke perangkat desa</p>
          </div>

          {/* Summary Box */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase">Jenis Surat</span>
                <span className="font-extrabold text-slate-900 text-sm">{activeLetter.name} ({activeLetter.code})</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">Nama Pemohon</span>
                <span className="font-bold text-slate-900">{applicantData.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">NIK</span>
                <span className="font-mono font-semibold text-slate-800">{applicantData.nik}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase">Nomor WhatsApp</span>
                <span className="font-semibold text-slate-800">{applicantData.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-bold block uppercase">Alamat Domisili</span>
                <span className="text-slate-800">{applicantData.address} ({applicantData.rtRw})</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-bold block uppercase">Keperluan Surat</span>
                <span className="font-medium text-slate-800 italic">"{purpose}"</span>
              </div>
            </div>

            {/* Document summary */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Dokumen Persyaratan yang Dilampirkan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeLetter.requirements.map((req) => (
                  <div key={req.id} className="flex items-center space-x-2 text-xs">
                    {uploadedDocs[req.id] ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0">
                        -
                      </span>
                    )}
                    <span className={uploadedDocs[req.id] ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                      {req.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Citizen Agreement Checkbox */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                Saya menyatakan bahwa data identitas dan dokumen persyaratan yang saya unggah adalah <strong>benar, sah, dan dapat dipertanggungjawabkan</strong> secara hukum. Apabila di kemudian hari ditemukan ketidaksesuaian, saya bersedia menerima sanksi sesuai ketentuan yang berlaku.
              </span>
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              Kembali
            </button>

            <button
              type="button"
              disabled={isSubmitting || !agreement}
              onClick={handleSubmit}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-extrabold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <span>Mendaftarkan Pengajuan...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kirim Pengajuan Surat Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
