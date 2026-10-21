import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AccessibilityBar } from './components/layout/AccessibilityBar';

// Masyarakat components
import { MasyarakatDashboard } from './components/masyarakat/MasyarakatDashboard';
import { LetterCatalog } from './components/masyarakat/LetterCatalog';
import { ApplicationForm } from './components/masyarakat/ApplicationForm';
import { MyApplicationsView } from './components/masyarakat/MyApplicationsView';
import { ApplicationDetailView } from './components/masyarakat/ApplicationDetailView';
import { NotificationView } from './components/masyarakat/NotificationView';
import { UserProfileView } from './components/masyarakat/UserProfileView';

// Admin components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminApplicationList } from './components/admin/AdminApplicationList';
import { AdminVerificationView } from './components/admin/AdminVerificationView';
import { AdminProcessLetterView } from './components/admin/AdminProcessLetterView';
import { AdminCompletedLetters } from './components/admin/AdminCompletedLetters';
import { AdminCitizensView } from './components/admin/AdminCitizensView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

// Common Modals
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { OfficialLetterModal } from './components/common/OfficialLetterModal';
import { RepairDocumentModal } from './components/common/RepairDocumentModal';
import { AuthModal } from './components/auth/AuthModal';
import { LoginPage } from './components/auth/LoginPage';

// v2 Components
import { WhatsAppSimulatorWidget } from './components/common/WhatsAppSimulatorWidget';
import { PublicVerificationModal } from './components/common/PublicVerificationModal';
import { LiveHelpdeskModal } from './components/common/LiveHelpdeskModal';
import { SignaturePadModal } from './components/common/SignaturePadModal';

export const AppContent: React.FC = () => {
  const {
    currentRole,
    activeTab,
    isMobileView,
    isAuthenticated,
    accessibilitySettings,
    villageSettings,
    publicVerifyModalOpen,
    setPublicVerifyModalOpen,
    liveHelpdeskOpen,
    setLiveHelpdeskOpen,
    signatureModalOpen,
    setSignatureModalOpen,
    setCustomSignatureUrl,
  } = useApp();
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dynamic font size class based on accessibility settings
  const fontSizeClass =
    accessibilitySettings.fontSize === 'xlarge'
      ? 'text-xl'
      : accessibilitySettings.fontSize === 'large'
      ? 'text-lg'
      : 'text-base';

  // High contrast override class
  const contrastClass = accessibilitySettings.highContrast
    ? 'bg-black text-white contrast-more'
    : '';

  // Render main screen component based on activeTab
  const renderCurrentView = () => {
    switch (activeTab) {
      // Masyarakat views
      case 'dashboard':
        return <MasyarakatDashboard />;
      case 'pilih-surat':
        return <LetterCatalog />;
      case 'form-pengajuan':
        return <ApplicationForm />;
      case 'pengajuan-saya':
        return <MyApplicationsView />;
      case 'detail-pengajuan':
        return <ApplicationDetailView />;
      case 'notifikasi':
        return <NotificationView />;
      case 'profil':
        return <UserProfileView />;

      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-pengajuan':
        return <AdminApplicationList />;
      case 'admin-verifikasi':
        return <AdminVerificationView />;
      case 'admin-proses':
        return <AdminProcessLetterView />;
      case 'admin-selesai':
        return <AdminCompletedLetters />;
      case 'admin-warga':
        return <AdminCitizensView />;
      case 'admin-laporan':
        return <AdminReportsView />;
      case 'admin-pengaturan':
        return <AdminSettingsView />;

      default:
        return currentRole === 'admin' ? <AdminDashboard /> : <MasyarakatDashboard />;
    }
  };

  // If user is not authenticated, render LoginPage
  if (!isAuthenticated) {
    if (isMobileView) {
      return (
        <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center">
          <div className="mb-4 text-center text-white text-xs flex items-center space-x-2">
            <span className="font-bold text-emerald-400">📱 Simulasi Tampilan Smartphone:</span>
            <span className="text-slate-400">Halaman Login &amp; Registrasi</span>
          </div>
          <div className="relative w-full max-w-[420px] h-[860px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-full z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
              <div className="w-10 h-1 bg-slate-700 rounded-full" />
            </div>
            <div className="flex-1 rounded-[36px] bg-slate-50 overflow-y-auto relative pt-4 scrollbar-none flex flex-col">
              <LoginPage />
            </div>
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1.5" />
          </div>
        </div>
      );
    }
    return <LoginPage />;
  }

  // Main UI Shell — wraps everything with dynamic font-size and contrast classes
  const mainLayout = (
    <div className={`min-h-screen flex flex-col font-sans ${fontSizeClass} ${contrastClass || 'bg-slate-50'}`}>
      {/* Accessibility Bar — always on top */}
      <AccessibilityBar />

      {/* Top Header */}
      <Header onToggleSidebarMobile={() => setSidebarMobileOpen(!sidebarMobileOpen)} />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpenMobile={sidebarMobileOpen}
          onCloseMobile={() => setSidebarMobileOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* ── Global Modals ─────────────────────────────────────── */}
      <DocumentViewerModal />
      <OfficialLetterModal />
      <RepairDocumentModal />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* ── v2 Global Modals & Widgets ────────────────────────── */}

      {/* Floating WhatsApp Notification Simulator */}
      <WhatsAppSimulatorWidget />

      {/* Public QR Document Verification Portal */}
      <PublicVerificationModal
        isOpen={publicVerifyModalOpen}
        onClose={() => setPublicVerifyModalOpen(false)}
      />

      {/* Live Helpdesk Chat Modal */}
      <LiveHelpdeskModal
        isOpen={liveHelpdeskOpen}
        onClose={() => setLiveHelpdeskOpen(false)}
      />

      {/* Digital Signature Pad Modal (Kades) */}
      <SignaturePadModal
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        onSave={(dataUrl) => {
          setCustomSignatureUrl(dataUrl);
          setSignatureModalOpen(false);
        }}
        signerName={villageSettings.villageHeadName}
        signerPosition="Kepala Desa Sukamaju"
      />
    </div>
  );

  // If Mobile Simulation Frame is active
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center">
        {/* Helper Top Bar in simulation */}
        <div className="mb-4 text-center text-white text-xs flex items-center space-x-2">
          <span className="font-bold text-emerald-400">📱 Simulasi Tampilan Smartphone:</span>
          <span className="text-slate-400">Gunakan toggle di header untuk kembali ke mode desktop</span>
        </div>

        {/* Smartphone Mockup Frame */}
        <div className="relative w-full max-w-[420px] h-[860px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col">
          {/* Top Speaker / Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
            <div className="w-10 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 rounded-[36px] bg-slate-50 overflow-y-auto relative pt-4 scrollbar-none flex flex-col">
            {mainLayout}
          </div>

          {/* Bottom Home Bar */}
          <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1.5" />
        </div>
      </div>
    );
  }

  return mainLayout;
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
