import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, User, ShieldCheck, Clock, HelpCircle, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../../types';

interface LiveHelpdeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveHelpdeskModal: React.FC<LiveHelpdeskModalProps> = ({ isOpen, onClose }) => {
  const { chatMessages, addChatMessage, currentUser, currentRole, villageSettings } = useApp();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addChatMessage({
      text: inputText.trim(),
      senderRole: currentRole,
    });
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-xl h-[560px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm sm:text-base">Helpdesk & Konsultasi Berkas (v2.0)</h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Layanan Tanya Jawab Langsung Aparatur {villageSettings.villageName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 text-center leading-relaxed">
            💬 Ruang konsultasi terbuka. Ajukan pertanyaan seputar persyaratan surat, perbaikan berkas yang ditolak, atau jadwal pengambilan surat fisik.
          </div>

          {chatMessages.map((msg) => {
            const isMe = msg.senderRole === currentRole;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-600">
                    {msg.senderName} ({msg.senderRole === 'admin' ? 'Petugas Desa' : 'Warga'})
                  </span>
                  <span className="text-[9px] text-slate-400">• {msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs shadow-xs leading-relaxed ${
                    isMe
                      ? currentRole === 'admin' 
                        ? 'bg-blue-600 text-white rounded-tr-xs' 
                        : 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder={
              currentRole === 'admin' 
                ? 'Ketik tanggapan / instruksi untuk warga...' 
                : 'Ketik pertanyaan mengenai berkas atau persyaratan surat...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
          />
          <button
            type="submit"
            className={`px-4 py-2.5 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5 ${
              currentRole === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>

      </div>
    </div>
  );
};
