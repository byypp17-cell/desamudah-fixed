import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, X, Send, CheckCheck, Phone, Video, MoreVertical, ExternalLink, ShieldCheck } from 'lucide-react';
import { WhatsAppMessage } from '../../types';

export const WhatsAppSimulatorWidget: React.FC = () => {
  const { 
    whatsappMessages, 
    currentUser, 
    villageSettings, 
    setSelectedApplicationId, 
    setActiveTab, 
    setPreviewOfficialLetter,
    setRepairingDocModal,
    applications
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState<{ id: string; text: string; time: string }[]>([]);

  const unreadCount = whatsappMessages.filter(m => !m.read).length;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setLocalReplies(prev => [...prev, {
      id: `rep-${Date.now()}`,
      text: replyText.trim(),
      time,
    }]);
    setReplyText('');
  };

  const handleActionClick = (msg: WhatsAppMessage) => {
    if (!msg.applicationId) return;

    const targetApp = applications.find(a => a.id === msg.applicationId);

    if (msg.actionButton?.actionType === 'download_pdf' && targetApp) {
      setPreviewOfficialLetter(targetApp);
    } else if (msg.actionButton?.actionType === 'repair_doc' && targetApp) {
      const rejectedDoc = targetApp.documents.find(d => d.status === 'perlu_perbaiki');
      if (rejectedDoc) {
        setRepairingDocModal({
          appId: targetApp.id,
          docId: rejectedDoc.id,
          requirementName: rejectedDoc.requirementName,
          rejectionReason: rejectedDoc.rejectionReason,
        });
      } else {
        setSelectedApplicationId(targetApp.id);
        setActiveTab('detail-pengajuan');
      }
    } else {
      setSelectedApplicationId(msg.applicationId);
      setActiveTab('detail-pengajuan');
    }

    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button on bottom-right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-5 z-40 p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center group ring-4 ring-emerald-500/20"
        title="Simulasi Pesan Otomatis WhatsApp Warga (v2.0)"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
        <span className="hidden group-hover:inline-block ml-2 text-xs font-bold pr-1">
          WhatsApp Notifikasi
        </span>
      </button>

      {/* WhatsApp Chat Slide-over / Modal */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-20 right-4 md:right-6 z-50 w-full max-w-[360px] sm:max-w-[390px] h-[520px] bg-slate-900 rounded-3xl shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col animate-fadeIn">
          
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center font-bold text-sm">
                  🏛️
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075E54]" />
              </div>

              <div>
                <div className="flex items-center space-x-1">
                  <h4 className="font-bold text-xs sm:text-sm line-clamp-1">
                    Layanan {villageSettings.villageName}
                  </h4>
                  <span className="text-[10px] text-emerald-300 font-bold" title="Akun Bisnis Resmi Terverifikasi">
                    ✓
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200">Online • Layanan Notifikasi Resmi</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-emerald-100">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#128C7E] rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body (Wallpaper background pattern) */}
          <div 
            className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#E5DDD5]"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            {/* Encryption notice */}
            <div className="p-2 bg-[#FFF3C2] text-[#6E5507] rounded-lg text-[10px] text-center font-sans shadow-xs border border-amber-200/60 leading-tight">
              🔒 Pesan dan panggilan dienkripsi secara end-to-end. Nomor resmi: {villageSettings.contactPhone}
            </div>

            {/* List of auto-generated WhatsApp notifications */}
            {whatsappMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col items-start max-w-[90%]">
                <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-sm text-slate-800 text-xs space-y-2 border border-slate-200">
                  <div className="font-bold text-[11px] text-[#075E54] flex items-center space-x-1">
                    <span>🏛️ Pemerintah {villageSettings.villageName}</span>
                  </div>

                  <p className="leading-relaxed whitespace-pre-line text-slate-700">
                    {msg.message}
                  </p>

                  {/* Interactive Action Button inside WhatsApp Message */}
                  {msg.actionButton && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleActionClick(msg)}
                        className="w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-[11px] font-bold transition shadow-xs flex items-center justify-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{msg.actionButton.label}</span>
                      </button>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-400 text-right flex items-center justify-end space-x-1">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>
            ))}

            {/* Citizen local replies */}
            {localReplies.map((reply) => (
              <div key={reply.id} className="flex flex-col items-end w-full">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-xs p-2.5 shadow-sm text-slate-800 text-xs max-w-[85%] border border-emerald-200">
                  <p>{reply.text}</p>
                  <div className="text-[9px] text-slate-400 text-right flex items-center justify-end space-x-1 mt-1">
                    <span>{reply.time}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom input */}
          <form onSubmit={handleSendReply} className="p-2 bg-[#F0F0F0] border-t border-slate-300 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Balas pesan WhatsApp desa..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-2 bg-white rounded-full text-xs text-slate-800 focus:outline-none shadow-inner border border-slate-200"
            />
            <button
              type="submit"
              className="p-2 bg-[#075E54] hover:bg-[#128C7E] text-white rounded-full transition shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
