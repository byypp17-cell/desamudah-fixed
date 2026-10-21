import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeGet, safeSet, safeRemove, loadJSON, saveJSON } from '../utils/storage';
import { 
  Application, 
  ApplicationStatus, 
  LetterType, 
  NotificationItem, 
  Role, 
  SubmittedDocument, 
  User, 
  VillageSettings,
  StatusHistoryItem,
  WhatsAppMessage,
  ChatMessage,
  AccessibilitySettings 
} from '../types';
import { LETTER_TYPES } from '../data/letterTypes';
import { 
  INITIAL_APPLICATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USERS, 
  INITIAL_VILLAGE_SETTINGS 
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: Role;
  switchRole: (role: Role) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (role: Role, user?: User) => void;
  logout: () => void;
  isMobileView: boolean;
  setIsMobileView: (isMobile: boolean) => void;
  applications: Application[];
  letterTypes: LetterType[];
  villageSettings: VillageSettings;
  updateVillageSettings: (settings: Partial<VillageSettings>) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  createApplication: (data: {
    letterTypeId: string;
    purpose: string;
    additionalData: Record<string, string>;
    documents: SubmittedDocument[];
    applicantData?: Partial<User>;
  }) => Application;
  updateApplicationStatus: (
    appId: string, 
    status: ApplicationStatus, 
    notes?: string, 
    officialLetterNumber?: string
  ) => void;
  verifyDocument: (
    appId: string, 
    docId: string, 
    status: 'disetujui' | 'perlu_perbaiki', 
    rejectionReason?: string
  ) => void;
  reuploadDocument: (
    appId: string, 
    docId: string, 
    file: { fileName: string; fileSize: string; fileType: string; fileUrl: string }
  ) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;
  selectedLetterTypeId: string | null;
  setSelectedLetterTypeId: (id: string | null) => void;
  previewOfficialLetter: Application | null;
  setPreviewOfficialLetter: (app: Application | null) => void;
  previewDocument: { name: string; url: string; type: string } | null;
  setPreviewDocument: (doc: { name: string; url: string; type: string } | null) => void;
  repairingDocModal: { appId: string; docId: string; requirementName: string; rejectionReason?: string } | null;
  setRepairingDocModal: (item: { appId: string; docId: string; requirementName: string; rejectionReason?: string } | null) => void;
  resetToMockData: () => void;
  quickNavigateToDetail: (appId: string) => void;
  quickNavigateToVerify: (appId: string) => void;
  
  // v2 additions
  whatsappMessages: WhatsAppMessage[];
  chatMessages: ChatMessage[];
  addChatMessage: (msg: { text: string; senderRole: Role }) => void;
  accessibilitySettings: AccessibilitySettings;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  publicVerifyModalOpen: boolean;
  setPublicVerifyModalOpen: (open: boolean) => void;
  publicVerifyTrackingNumber: string;
  setPublicVerifyTrackingNumber: (no: string) => void;
  liveHelpdeskOpen: boolean;
  setLiveHelpdeskOpen: (open: boolean) => void;
  signatureModalOpen: boolean;
  setSignatureModalOpen: (open: boolean) => void;
  customSignatureUrl: string | null;
  setCustomSignatureUrl: (url: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return ((safeGet('desamudah_role') === 'admin' ? 'admin' : 'masyarakat') as Role);
  });

  const [users] = useState<User[]>(() => {
    return loadJSON('desamudah_users', INITIAL_USERS);
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return currentRole === 'admin' 
      ? users.find(u => u.role === 'admin') || users[2]
      : users.find(u => u.id === 'user-budi') || users[0];
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    return loadJSON('desamudah_applications', INITIAL_APPLICATIONS);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return loadJSON('desamudah_notifications', INITIAL_NOTIFICATIONS);
  });

  const [villageSettings, setVillageSettings] = useState<VillageSettings>(() => {
    return loadJSON('desamudah_settings', INITIAL_VILLAGE_SETTINGS);
  });

  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedLetterTypeId, setSelectedLetterTypeId] = useState<string | null>(null);
  const [previewOfficialLetter, setPreviewOfficialLetter] = useState<Application | null>(null);
  const [previewDocument, setPreviewDocument] = useState<{ name: string; url: string; type: string } | null>(null);
  const [repairingDocModal, setRepairingDocModal] = useState<{ appId: string; docId: string; requirementName: string; rejectionReason?: string } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    safeSet('desamudah_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    saveJSON('desamudah_applications', applications);
  }, [applications]);

  useEffect(() => {
    saveJSON('desamudah_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveJSON('desamudah_settings', villageSettings);
  }, [villageSettings]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return safeGet('desamudah_auth') === 'true';
  });

  // v2 WhatsApp & Chat & Accessibility States
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'wm-1',
      sender: 'Pemerintah Desa Sukamaju',
      recipientPhone: '081298765432',
      message: '🎉 *SURAT SELESAI DITERBITKAN*\n\nYth. Bpk/Ibu Budi Santoso,\nSurat Keterangan Domisili Anda (No. Registrasi: DM-2025-SKD-0042) telah selesai diproses dan ditandatangani sah secara digital oleh Kepala Desa.\n\nDokumen resmi dapat langsung diunduh dan dicetak:',
      timestamp: '13 Okt 2025, 14:30 WIB',
      applicationId: 'app-001',
      trackingNumber: 'DM-2025-SKD-0042',
      actionButton: {
        label: 'Unduh Dokumen Surat Sah',
        actionType: 'download_pdf',
      },
      read: false,
    },
    {
      id: 'wm-2',
      sender: 'Pemerintah Desa Sukamaju',
      recipientPhone: '081298765432',
      message: '⚠️ *PERHATIAN: BERKAS PERLU PERBAIKAN*\n\nYth. Bpk/Ibu Budi Santoso,\nPengajuan SKU No. DM-2025-SKU-0089 memerlukan perbaikan dokumen: "Foto tempat usaha terlalu gelap/buram dan plang spanduk tidak terbaca".\n\nSilakan unggah ulang berkas yang jelas:',
      timestamp: '14 Okt 2025, 13:45 WIB',
      applicationId: 'app-002',
      trackingNumber: 'DM-2025-SKU-0089',
      actionButton: {
        label: 'Perbaiki Berkas Sekarang',
        actionType: 'repair_doc',
      },
      read: false,
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'cm-1',
      senderId: 'user-budi',
      senderName: 'Budi Santoso',
      senderRole: 'masyarakat',
      text: 'Selamat pagi bapak petugas loket pelayanan, saya mau bertanya apakah untuk pengajuan SK Domisili surat pengantar RT/RW harus ditandatangani RW juga atau cukup RT saja?',
      timestamp: '14 Okt, 08:30 WIB',
    },
    {
      id: 'cm-2',
      senderId: 'admin-hendra',
      senderName: 'Hendra Kurniawan, S.AP (Sekdes)',
      senderRole: 'admin',
      text: 'Selamat pagi Pak Budi. Sesuai regulasi kependudukan desa, diwajibkan ada tanda tangan dan stempel dari Ketua RT dan Ketua RW setempat ya pak agar berkas valid saat diverifikasi.',
      timestamp: '14 Okt, 08:35 WIB',
    }
  ]);

  const addChatMessage = ({ text, senderRole }: { text: string; senderRole: Role }) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole,
      text,
      timestamp: `${time} WIB`,
    };
    setChatMessages(prev => [...prev, newMsg]);

    if (senderRole === 'masyarakat') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `cm-${Date.now() + 1}`,
          senderId: 'admin-hendra',
          senderName: 'Hendra Kurniawan, S.AP (Sekdes)',
          senderRole: 'admin',
          text: `Halo ${currentUser.name}, terima kasih telah menghubungi loket layanan desa. Pesan Anda telah diterima oleh petugas jaga kami dan segera kami tindaklanjuti.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        };
        setChatMessages(prev => [...prev, autoReply]);
      }, 1000);
    }
  };

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    speechEnabled: false,
  });

  const updateAccessibilitySettings = (settings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...settings }));
  };

  const [publicVerifyModalOpen, setPublicVerifyModalOpen] = useState(false);
  const [publicVerifyTrackingNumber, setPublicVerifyTrackingNumber] = useState('');
  const [liveHelpdeskOpen, setLiveHelpdeskOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [customSignatureUrl, setCustomSignatureUrl] = useState<string | null>(null);

  const login = (role: Role, user?: User) => {
    setIsAuthenticated(true);
    safeSet('desamudah_auth', 'true');
    setCurrentRole(role);
    if (user) {
      setCurrentUser(user);
    } else {
      if (role === 'admin') {
        const adminUser = users.find(u => u.role === 'admin') || users[2];
        setCurrentUser(adminUser);
        setActiveTab('admin-dashboard');
      } else {
        const citizenUser = users.find(u => u.role === 'masyarakat') || users[0];
        setCurrentUser(citizenUser);
        setActiveTab('dashboard');
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    safeRemove('desamudah_auth');
    setActiveTab('dashboard');
  };

  // Switch Role
  const switchRole = (newRole: Role) => {
    setCurrentRole(newRole);
    if (newRole === 'admin') {
      const adminUser = users.find(u => u.role === 'admin') || users[2];
      setCurrentUser(adminUser);
      setActiveTab('admin-dashboard');
    } else {
      const citizenUser = users.find(u => u.role === 'masyarakat') || users[0];
      setCurrentUser(citizenUser);
      setActiveTab('dashboard');
    }
  };

  const updateVillageSettings = (newSettings: Partial<VillageSettings>) => {
    setVillageSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Create Application
  const createApplication = ({
    letterTypeId,
    purpose,
    additionalData,
    documents,
    applicantData,
  }: {
    letterTypeId: string;
    purpose: string;
    additionalData: Record<string, string>;
    documents: SubmittedDocument[];
    applicantData?: Partial<User>;
  }): Application => {
    const letterType = LETTER_TYPES.find(l => l.id === letterTypeId) || LETTER_TYPES[0];
    const timestamp = new Date();
    const dateStr = timestamp.toISOString().split('T')[0];
    const timeStr = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${dateStr} ${timeStr}`;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `DM-2025-${letterType.code}-${randomSuffix}`;
    const newId = `app-${Date.now()}`;

    const newApp: Application = {
      id: newId,
      trackingNumber,
      letterTypeId: letterType.id,
      letterTypeCode: letterType.code,
      letterTypeName: letterType.name,
      applicantId: currentUser.id,
      applicantName: applicantData?.name || currentUser.name,
      applicantNik: applicantData?.nik || currentUser.nik,
      applicantKk: applicantData?.noKK || currentUser.noKK,
      applicantTtl: `${applicantData?.birthPlace || currentUser.birthPlace}, ${applicantData?.birthDate || currentUser.birthDate}`,
      applicantAddress: applicantData?.address || currentUser.address,
      applicantRtRw: applicantData?.rtRw || currentUser.rtRw,
      applicantPhone: applicantData?.phone || currentUser.phone,
      applicantEmail: applicantData?.email || currentUser.email,
      applicantOccupation: applicantData?.occupation || currentUser.occupation,
      purpose,
      additionalData,
      documents: documents.map(d => ({
        ...d,
        status: 'sedang_diverifikasi',
        uploadedAt: formattedTimestamp,
      })),
      status: 'diajukan',
      createdAt: formattedTimestamp,
      updatedAt: formattedTimestamp,
      history: [
        {
          id: `h-${Date.now()}-1`,
          status: 'diajukan',
          title: 'Pengajuan Dibuat',
          description: `Pengajuan ${letterType.name} berhasil didaftarkan ke sistem pelayanan online.`,
          timestamp: `${formattedTimestamp} WIB`,
          actor: `${currentUser.name} (Pemohon)`,
        },
        {
          id: `h-${Date.now()}-2`,
          status: 'sedang_diperiksa',
          title: 'Menunggu Verifikasi Berkas',
          description: 'Berkas masuk ke antrean verifikasi perangkat desa.',
          timestamp: `${formattedTimestamp} WIB`,
          actor: 'Sistem DesaMudah',
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);

    // Add notification for Citizen
    const citizenNotif: NotificationItem = {
      id: `notif-${Date.now()}-c`,
      userId: currentUser.id,
      recipientRole: 'masyarakat',
      title: 'Pengajuan Berhasil Dibuat',
      message: `Permohonan ${letterType.name} (${trackingNumber}) berhasil dikirim. Menunggu verifikasi berkas oleh perangkat desa.`,
      type: 'info',
      timestamp: `${formattedTimestamp} WIB`,
      read: false,
      applicationId: newId,
    };

    // Add WhatsApp message for Citizen (v2)
    const citizenWa: WhatsAppMessage = {
      id: `wa-${Date.now()}`,
      sender: 'Pemerintah Desa Sukamaju',
      recipientPhone: currentUser.phone,
      message: `🏛️ *PENGAJUAN BERHASIL DIBUAT*\n\nYth. Bpk/Ibu ${currentUser.name},\nPermohonan *${letterType.name}* (No. Registrasi: *${trackingNumber}*) telah berhasil kami terima.\n\nPetugas loket desa akan memverifikasi berkas persyaratan Anda. Pantau status pengajuan Anda melalui tombol di bawah:`,
      timestamp: `${formattedTimestamp} WIB`,
      applicationId: newId,
      trackingNumber,
      actionButton: {
        label: 'Pantau Status Pengajuan',
        actionType: 'view_detail',
      },
      read: false,
    };
    setWhatsappMessages(prev => [citizenWa, ...prev]);

    // Add notification for Admin
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}-a`,
      recipientRole: 'admin',
      title: 'Pengajuan Baru Masuk',
      message: `${currentUser.name} mengajukan ${letterType.name} (${trackingNumber}). Silakan verifikasi dokumen.`,
      type: 'info',
      timestamp: `${formattedTimestamp} WIB`,
      read: false,
      applicationId: newId,
    };

    setNotifications(prev => [citizenNotif, adminNotif, ...prev]);
    return newApp;
  };

  // Update Application Status (Admin action)
  const updateApplicationStatus = (
    appId: string, 
    newStatus: ApplicationStatus, 
    notes?: string, 
    officialLetterNumber?: string
  ) => {
    const timestamp = new Date();
    const dateStr = timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${dateStr}, ${timeStr} WIB`;

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const titlesByStatus: Record<ApplicationStatus, string> = {
        diajukan: 'Pengajuan Dibuat',
        sedang_diperiksa: 'Berkas Sedang Diperiksa',
        diverifikasi: 'Berkas Selesai Diverifikasi',
        perlu_perbaikan: 'Berkas Perlu Diperbaiki',
        diproses: 'Pengajuan Sedang Diproses',
        selesai: 'Surat Selesai & Dapat Diunduh',
      };

      const descByStatus: Record<ApplicationStatus, string> = {
        diajukan: 'Permohonan surat didaftarkan kembali.',
        sedang_diperiksa: 'Perangkat desa sedang meneliti keabsahan berkas.',
        diverifikasi: 'Seluruh berkas persyaratan telah disetujui dan dinyatakan lengkap.',
        perlu_perbaikan: notes || 'Terdapat berkas yang tidak sesuai/buram dan membutuhkan perbaikan oleh pemohon.',
        diproses: 'Draf surat resmi sedang dibuat dan diajukan untuk penandatanganan kepala desa.',
        selesai: 'Surat resmi telah ditandatangani dan siap diunduh secara online atau dicetak.',
      };

      const newHistoryItem: StatusHistoryItem = {
        id: `h-${Date.now()}`,
        status: newStatus,
        title: titlesByStatus[newStatus],
        description: descByStatus[newStatus],
        timestamp: formattedTimestamp,
        actor: `${villageSettings.villageSecretaryName} (Perangkat Desa)`,
        notes,
      };

      return {
        ...app,
        status: newStatus,
        adminNotes: notes !== undefined ? notes : app.adminNotes,
        officialLetterNumber: officialLetterNumber || app.officialLetterNumber || (newStatus === 'selesai' || newStatus === 'diproses' ? `470/${Math.floor(100 + Math.random() * 899)}/Ds-SKM/X/2025` : undefined),
        officialLetterDate: newStatus === 'selesai' ? dateStr : app.officialLetterDate,
        signedBy: newStatus === 'selesai' ? villageSettings.villageHeadName : app.signedBy,
        signedPosition: newStatus === 'selesai' ? 'Kepala Desa Sukamaju' : app.signedPosition,
        completedAt: newStatus === 'selesai' ? formattedTimestamp : app.completedAt,
        updatedAt: formattedTimestamp,
        history: [...app.history, newHistoryItem],
      };
    }));

    // Trigger notification
    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
      let notifType: 'info' | 'warning' | 'success' | 'danger' = 'info';
      let notifTitle = `Status Pengajuan Diperbarui`;
      let notifMsg = `Pengajuan ${targetApp.letterTypeName} (${targetApp.trackingNumber}) berstatus: ${newStatus}`;

      if (newStatus === 'perlu_perbaikan') {
        notifType = 'warning';
        notifTitle = 'Perhatian: Berkas Perlu Perbaikan!';
        notifMsg = `Pengajuan ${targetApp.letterTypeName} (${targetApp.trackingNumber}) memerlukan perbaikan berkas: ${notes || 'Periksa catatan petugas'}`;

        const rejectWa: WhatsAppMessage = {
          id: `wa-${Date.now()}`,
          sender: 'Pemerintah Desa Sukamaju',
          recipientPhone: targetApp.applicantPhone,
          message: `⚠️ *PERHATIAN: DOKUMEN PERLU PERBAIKAN*\n\nYth. Bpk/Ibu ${targetApp.applicantName},\nPengajuan *${targetApp.letterTypeName}* (No: ${targetApp.trackingNumber}) membutuhkan perbaikan dokumen:\n\n*Catatan Petugas:* "${notes || 'Ada dokumen yang buram / tidak sesuai'}"\n\nSilakan klik tombol di bawah untuk mengunggah ulang:`,
          timestamp: formattedTimestamp,
          applicationId: targetApp.id,
          trackingNumber: targetApp.trackingNumber,
          actionButton: {
            label: 'Perbaiki Berkas Sekarang',
            actionType: 'repair_doc',
          },
          read: false,
        };
        setWhatsappMessages(prev => [rejectWa, ...prev]);

      } else if (newStatus === 'selesai') {
        notifType = 'success';
        notifTitle = 'Selamat! Surat Selesai & Siap Diunduh';
        notifMsg = `Surat ${targetApp.letterTypeName} (${targetApp.trackingNumber}) telah selesai dan dapat langsung Anda unduh/cetak.`;

        const finishWa: WhatsAppMessage = {
          id: `wa-${Date.now()}`,
          sender: 'Pemerintah Desa Sukamaju',
          recipientPhone: targetApp.applicantPhone,
          message: `🎉 *SURAT SELESAI DITERBITKAN*\n\nYth. Bpk/Ibu ${targetApp.applicantName},\nSurat *${targetApp.letterTypeName}* (No. Surat: ${officialLetterNumber || targetApp.officialLetterNumber || '470/142/Ds-SKM/X/2025'}) telah selesai ditandatangani sah secara digital oleh Kepala Desa dan distempel resmi.\n\nDokumen resmi dapat langsung diunduh dan dicetak secara mandiri:`,
          timestamp: formattedTimestamp,
          applicationId: targetApp.id,
          trackingNumber: targetApp.trackingNumber,
          actionButton: {
            label: 'Unduh Surat PDF Resmi',
            actionType: 'download_pdf',
          },
          read: false,
        };
        setWhatsappMessages(prev => [finishWa, ...prev]);

      } else if (newStatus === 'diproses') {
        notifType = 'info';
        notifTitle = 'Surat Sedang Diproses Resmi';
        notifMsg = `Berkas ${targetApp.letterTypeName} telah lengkap dan draf surat sedang ditandatangani.`;

        const processWa: WhatsAppMessage = {
          id: `wa-${Date.now()}`,
          sender: 'Pemerintah Desa Sukamaju',
          recipientPhone: targetApp.applicantPhone,
          message: `ℹ️ *BERKAS TERVERIFIKASI & DIPROSES*\n\nYth. Bpk/Ibu ${targetApp.applicantName},\nSeluruh berkas *${targetApp.letterTypeName}* (${targetApp.trackingNumber}) telah disetujui petugas dan draf surat resmi sedang diajukan penomoran agenda desa.`,
          timestamp: formattedTimestamp,
          applicationId: targetApp.id,
          trackingNumber: targetApp.trackingNumber,
          actionButton: {
            label: 'Pantau Status Pengajuan',
            actionType: 'view_detail',
          },
          read: false,
        };
        setWhatsappMessages(prev => [processWa, ...prev]);
      }

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: targetApp.applicantId,
        recipientRole: 'masyarakat',
        title: notifTitle,
        message: notifMsg,
        type: notifType,
        timestamp: formattedTimestamp,
        read: false,
        applicationId: targetApp.id,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Verify single document (Approve or Reject with note)
  const verifyDocument = (
    appId: string, 
    docId: string, 
    status: 'disetujui' | 'perlu_perbaiki', 
    rejectionReason?: string
  ) => {
    const timestamp = new Date();
    const dateStr = timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${dateStr}, ${timeStr} WIB`;

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const updatedDocs = app.documents.map(doc => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          status,
          rejectionReason: status === 'perlu_perbaiki' ? rejectionReason : undefined,
          verifiedAt: formattedTimestamp,
          verifiedBy: villageSettings.villageSecretaryName,
        };
      });

      // Check if any doc is rejected
      const hasRejected = updatedDocs.some(d => d.status === 'perlu_perbaiki');
      const allApproved = updatedDocs.every(d => d.status === 'disetujui');

      let newStatus = app.status;
      let newHistory = [...app.history];

      if (hasRejected && app.status !== 'perlu_perbaikan') {
        newStatus = 'perlu_perbaikan';
        newHistory.push({
          id: `h-${Date.now()}`,
          status: 'perlu_perbaikan',
          title: 'Ada Berkas Perlu Perbaikan',
          description: `Petugas menandai dokumen yang perlu diperbaiki: ${rejectionReason || ''}`,
          timestamp: formattedTimestamp,
          actor: villageSettings.villageSecretaryName,
          notes: rejectionReason,
        });

        // Notify citizen
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: app.applicantId,
          recipientRole: 'masyarakat',
          title: 'Perbaikan Berkas Dibutuhkan',
          message: `Dokumen pada pengajuan ${app.trackingNumber} perlu diperbaiki: "${rejectionReason || 'Silakan cek detail'}"`,
          type: 'warning',
          timestamp: formattedTimestamp,
          read: false,
          applicationId: app.id,
        };
        setNotifications(nPrev => [notif, ...nPrev]);
      } else if (allApproved && app.status === 'sedang_diperiksa') {
        newStatus = 'diverifikasi';
        newHistory.push({
          id: `h-${Date.now()}`,
          status: 'diverifikasi',
          title: 'Semua Berkas Terverifikasi',
          description: 'Seluruh dokumen persyaratan telah disetujui oleh perangkat desa.',
          timestamp: formattedTimestamp,
          actor: villageSettings.villageSecretaryName,
        });
      }

      return {
        ...app,
        documents: updatedDocs,
        status: newStatus,
        updatedAt: formattedTimestamp,
        history: newHistory,
      };
    }));
  };

  // Re-upload document by citizen (when status was perlu_perbaiki)
  const reuploadDocument = (
    appId: string, 
    docId: string, 
    file: { fileName: string; fileSize: string; fileType: string; fileUrl: string }
  ) => {
    const timestamp = new Date();
    const dateStr = timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${dateStr}, ${timeStr} WIB`;

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const updatedDocs = app.documents.map(doc => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          fileName: file.fileName,
          fileSize: file.fileSize,
          fileType: file.fileType,
          fileUrl: file.fileUrl,
          uploadedAt: formattedTimestamp,
          status: 'sedang_diverifikasi' as const,
          rejectionReason: undefined,
        };
      });

      // Check if all rejected docs have been reuploaded
      const stillHasRejected = updatedDocs.some(d => d.status === 'perlu_perbaiki');
      const newStatus: ApplicationStatus = stillHasRejected ? 'perlu_perbaikan' : 'sedang_diperiksa';

      const newHistoryItem: StatusHistoryItem = {
        id: `h-${Date.now()}`,
        status: newStatus,
        title: 'Berkas Perbaikan Diunggah',
        description: `Pemohon telah mengunggah ulang dokumen perbaikan (${file.fileName}). Menunggu pemeriksaan ulang petugas.`,
        timestamp: formattedTimestamp,
        actor: `${app.applicantName} (Pemohon)`,
      };

      return {
        ...app,
        documents: updatedDocs,
        status: newStatus,
        updatedAt: formattedTimestamp,
        history: [...app.history, newHistoryItem],
      };
    }));

    // Notify Admin
    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
      const adminNotif: NotificationItem = {
        id: `notif-${Date.now()}-adm`,
        recipientRole: 'admin',
        title: 'Berkas Perbaikan Telah Diunggah',
        message: `${targetApp.applicantName} telah mengunggah ulang berkas perbaikan untuk pengajuan ${targetApp.trackingNumber}. Silakan periksa kembali.`,
        type: 'info',
        timestamp: formattedTimestamp,
        read: false,
        applicationId: targetApp.id,
      };
      setNotifications(prev => [adminNotif, ...prev]);
    }
  };

  const quickNavigateToDetail = (appId: string) => {
    setSelectedApplicationId(appId);
    if (currentRole === 'masyarakat') {
      setActiveTab('detail-pengajuan');
    } else {
      setActiveTab('admin-verifikasi');
    }
  };

  const quickNavigateToVerify = (appId: string) => {
    setSelectedApplicationId(appId);
    setActiveTab('admin-verifikasi');
  };

  const resetToMockData = () => {
    safeRemove('desamudah_applications');
    safeRemove('desamudah_notifications');
    safeRemove('desamudah_settings');
    setApplications(INITIAL_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setVillageSettings(INITIAL_VILLAGE_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentRole,
        switchRole,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        isMobileView,
        setIsMobileView,
        applications,
        letterTypes: LETTER_TYPES,
        villageSettings,
        updateVillageSettings,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createApplication,
        updateApplicationStatus,
        verifyDocument,
        reuploadDocument,
        activeTab,
        setActiveTab,
        selectedApplicationId,
        setSelectedApplicationId,
        selectedLetterTypeId,
        setSelectedLetterTypeId,
        previewOfficialLetter,
        setPreviewOfficialLetter,
        previewDocument,
        setPreviewDocument,
        repairingDocModal,
        setRepairingDocModal,
        resetToMockData,
        quickNavigateToDetail,
        quickNavigateToVerify,
        
        // v2 additions
        whatsappMessages,
        chatMessages,
        addChatMessage,
        accessibilitySettings,
        updateAccessibilitySettings,
        publicVerifyModalOpen,
        setPublicVerifyModalOpen,
        publicVerifyTrackingNumber,
        setPublicVerifyTrackingNumber,
        liveHelpdeskOpen,
        setLiveHelpdeskOpen,
        signatureModalOpen,
        setSignatureModalOpen,
        customSignatureUrl,
        setCustomSignatureUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
