export type Role = 'masyarakat' | 'admin';

export type ApplicationStatus = 
  | 'diajukan'           // 1. Pengajuan dibuat
  | 'sedang_diperiksa'   // 2. Berkas sedang diperiksa
  | 'diverifikasi'       // 3. Berkas diverifikasi (Semua berkas valid)
  | 'perlu_perbaikan'    // Ada berkas yang ditolak/kurang
  | 'diproses'           // 4. Pengajuan diproses (Pembuatan draf surat resmi)
  | 'selesai';           // 5. Surat selesai & 6. Surat dapat diunduh

export type DocumentStatus = 
  | 'belum_diunggah'
  | 'sudah_diunggah'
  | 'sedang_diverifikasi'
  | 'disetujui'
  | 'perlu_perbaiki';

export interface User {
  id: string;
  name: string;
  nik: string;
  noKK: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  religion: string;
  occupation: string;
  phone: string;
  email: string;
  address: string;
  rtRw: string;
  role: Role;
  avatar?: string;
  adminPosition?: string; // e.g. "Kasi Pelayanan", "Sekretaris Desa"
}

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[]; // ['PDF', 'JPG', 'PNG']
  maxSizeMB: number;
}

export interface LetterType {
  id: string;
  code: string;
  name: string;
  category: 'Kependudukan' | 'Usaha & Ekonomi' | 'Kesejahteraan' | 'Catatan Sipil' | 'Umum';
  description: string;
  estimatedDays: string; // e.g. "1-2 Hari Kerja"
  icon: string;
  legalBasis: string;
  requirements: DocumentRequirement[];
  extraFields?: {
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'number' | 'date' | 'textarea' | 'select';
    options?: string[];
    required: boolean;
  }[];
}

export interface SubmittedDocument {
  id: string;
  requirementId: string;
  requirementName: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface StatusHistoryItem {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  notes?: string;
}

export interface Application {
  id: string;
  trackingNumber: string; // e.g. "DM-2025-SKD-0042"
  letterTypeId: string;
  letterTypeCode: string;
  letterTypeName: string;
  
  // Applicant Data
  applicantId: string;
  applicantName: string;
  applicantNik: string;
  applicantKk: string;
  applicantTtl: string;
  applicantAddress: string;
  applicantRtRw: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantOccupation?: string;
  
  // Application details
  purpose: string;
  additionalData: Record<string, string>;
  documents: SubmittedDocument[];
  
  // Processing info
  status: ApplicationStatus;
  officialLetterNumber?: string; // e.g. "470/142/Ds-SKM/X/2025"
  officialLetterDate?: string;
  signedBy?: string;
  signedPosition?: string;
  signatureDataUrl?: string;
  digitalCertHash?: string;
  officialFileUrl?: string;
  adminNotes?: string;
  
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  history: StatusHistoryItem[];
}

export interface NotificationItem {
  id: string;
  userId?: string;
  recipientRole: Role;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  timestamp: string;
  read: boolean;
  applicationId?: string;
  actionUrl?: string;
}

export interface VillageSettings {
  villageName: string;
  districtName: string;
  regencyName: string;
  provinceName: string;
  officeAddress: string;
  postalCode: string;
  contactPhone: string;
  contactEmail: string;
  villageHeadName: string;
  villageHeadNip: string;
  villageSecretaryName: string;
  serviceHours: string;
  enableDigitalStamp: boolean;
  defaultSignatureUrl?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  recipientPhone: string;
  message: string;
  timestamp: string;
  applicationId?: string;
  trackingNumber?: string;
  actionButton?: {
    label: string;
    actionType: 'view_detail' | 'repair_doc' | 'download_pdf';
    payload?: string;
  };
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  timestamp: string;
  applicationId?: string;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  speechEnabled: boolean;
}

