'use client'

import React from 'react'
import {
  Mail,
  X,
  CheckCircle2,
  Sparkles,
  Scissors,
  Receipt,
  Heart,
  Clock,
  Printer,
} from 'lucide-react'
import { DispatchedEmail } from '@/lib/types'
import { useLanguage } from '@/lib/language'

interface AiEmailViewerModalProps {
  email: DispatchedEmail | null
  onClose: () => void
}

export default function AiEmailViewerModal({
  email,
  onClose,
}: AiEmailViewerModalProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'

  if (!email) return null

  return (
    <div className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
      <div className="glass-modal max-w-lg w-full overflow-hidden text-[#1C1B1A] flex flex-col">
        {/* Email Client Header Bar */}
        <div className="p-3.5 bg-[#D63927]/90 backdrop-blur-md text-white flex items-center justify-between border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F5B82E] text-[#1C1B1A] border border-white/40 shadow-xs flex items-center justify-center font-bold">
              <Mail size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold bg-[#1C1B1A] text-[#F5B82E] px-1.5 py-0.2 rounded uppercase">
                  {isEn ? 'AI DISPATCH' : 'डाक • AI DISPATCH'}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white truncate max-w-xs">{email.subject}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#1C1B1A]/80 text-white hover:bg-[#B81D1D] rounded-lg border border-white/30 transition-colors"
            aria-label="Close email modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Email Meta Bar */}
        <div className="p-3.5 bg-[#F6EFE2]/70 backdrop-blur-sm border-b border-[#1C1B1A]/10 text-xs space-y-1.5 font-mono">
          <div className="flex justify-between text-[#5C564E] text-[11px]">
            <span>To: <b className="text-[#1C1B1A]">{email.recipientName}</b> &lt;{email.recipientEmail}&gt;</span>
            <span className="font-bold text-[#1C1B1A]">{email.timestamp}</span>
          </div>
          <div className="flex justify-between text-[11px] text-[#5C564E]">
            <span>From: <b className="text-[#1C1B1A]">DELUXE AI NOTIFICATIONS</b> &lt;receipts@deluxesalon.in&gt;</span>
            <span className="text-[#288D43] font-bold flex items-center gap-1 bg-[#288D43]/10 px-1.5 py-0.5 rounded border border-[#288D43]/30">
              <CheckCircle2 size={12} /> DELIVERED
            </span>
          </div>
        </div>

        {/* Rendered HTML Email Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[440px] bg-transparent">
          {/* Email Branding Hero */}
          <div className="p-4 bg-[#1C1B1A] rounded-xl text-white text-center space-y-1.5 border border-white/20 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#F5B82E] text-[#1C1B1A] border border-white flex items-center justify-center mx-auto shadow-xs">
              <Scissors size={20} />
            </div>
            <h2 className="text-lg font-hindi font-bold tracking-wide text-[#F5B82E]">
              {isEn ? 'DELUXE SALON & SPA' : 'डीलक्स उस्ताद सैलून & स्पा'}
            </h2>
            <p className="text-[11px] font-mono text-[#E8DAC1]">
              ESTD. 1994 • OFFICIAL TAX INVOICE & AI SUMMARY
            </p>
          </div>

          {/* AI Customer Memory Note Card (The requested core feature!) */}
          <div className="p-4 bg-[#FFF9E6]/85 backdrop-blur-sm border border-[#F5B82E]/40 rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#B81D1D] font-bold text-xs">
              <Sparkles size={15} className="text-[#D63927]" />
              <span className="font-hindi tracking-wide text-sm">
                {isEn ? 'Personalized AI Customer Memory Note' : 'ग्राहक स्मृति • Personalized AI Customer Memory Note'}
              </span>
            </div>
            <p className="text-[#1C1B1A] text-xs leading-relaxed italic bg-white/90 p-2.5 rounded-lg border border-[#F5B82E]/40 font-serif">
              &ldquo;{email.customerMemoryNote}&rdquo;
            </p>
          </div>

          {/* Itemized Service & Payment Summary */}
          <div className="p-4 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl space-y-2.5 font-mono shadow-xs">
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-dashed border-[#1C1B1A]/20">
              <span className="text-[#5C564E]">{isEn ? 'Service:' : 'सेवा / Service:'}</span>
              <strong className="text-[#1C1B1A]">{email.serviceName}</strong>
            </div>
            <div className="flex justify-between items-center text-xs pb-1.5 border-b border-dashed border-[#1C1B1A]/20">
              <span className="text-[#5C564E]">{isEn ? 'Stylist:' : 'कारीगर / Stylist:'}</span>
              <strong className="text-[#1C1B1A]">{email.staffName}</strong>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-[#1C1B1A] pt-1">
              <span>{isEn ? 'Total Paid:' : 'कुल राशि / Total Paid:'}</span>
              <span className="text-[#D63927] text-base font-black">₹{email.amountPaid}.00</span>
            </div>
          </div>

          {/* Post-Care Advice */}
          <div className="p-3 bg-[#288D43]/10 border border-[#288D43]/30 rounded-xl text-[11px] text-[#1C1B1A] space-y-1">
            <span className="font-bold text-[#288D43] flex items-center gap-1">
              {isEn ? '✨ Stylist Aftercare Advice:' : '✨ उस्ताद सलाह / Stylist Aftercare Advice:'}
            </span>
            <p className="text-[#1C1B1A] leading-normal font-sans">
              For best styling longevity, avoid direct heat treatments for 24 hours. Book your next maintenance trim in 3 to 4 weeks!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-[#F6EFE2]/70 backdrop-blur-md border-t border-[#1C1B1A]/15 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="btn-kitsch-primary px-4 py-1.5 text-xs"
          >
            {isEn ? 'Close Email' : 'बंद करें / Close Email'}
          </button>
        </div>
      </div>
    </div>
  )
}
