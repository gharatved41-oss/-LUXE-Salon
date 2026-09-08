'use client'

import React from 'react'
import { X, Printer, CheckCircle2, Scissors } from 'lucide-react'
import { ReceiptData } from '@/lib/types'
import { useLanguage } from '@/lib/language'

export function PaymentReceiptModal({
  receipt,
  onClose,
}: {
  receipt: ReceiptData
  onClose: () => void
}) {
  const { language } = useLanguage()
  const isEn = language === 'en'

  return (
    <div className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-body">
      <div className="glass-modal max-w-md w-full p-6 text-[#1C1B1A]">
        <div className="flex justify-between items-center pb-3 border-b border-dashed border-[#1C1B1A]/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#288D43] text-white flex items-center justify-center shadow-xs">
              <Scissors size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#288D43] uppercase tracking-wider block font-mono">
                Official Tax Invoice
              </span>
              <h3 className="text-base font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Deluxe Salon Receipt' : 'डीलक्स उस्ताद रसीद'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#5C564E] hover:text-[#1C1B1A] rounded"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Vintage Perforated Railway/Matchbox Ticket Card with Glass Substrate */}
        <div className="p-5 ticket-perforated rounded-xl my-4 text-xs font-mono space-y-3 relative shadow-inner">
          {/* Stamped Red Rubber Seal */}
          <div className="absolute right-4 top-4 stamped-seal text-xs">
            {isEn ? '[ P A I D ]' : '[ P A I D / भुगतान ]'}
          </div>

          <div className="text-center pb-3 border-b border-dashed border-[#1C1B1A]/20">
            <h4 className="font-extrabold text-[#1C1B1A] text-sm font-hindi">
              {isEn ? 'DELUXE SALON OPERATIONS' : 'डीलक्स उस्ताद सैलून (DELUXE SALON OPS)'}
            </h4>
            <span className="text-[10px] text-[#5C564E] font-mono">
              TAX INVOICE #{receipt.receiptNumber}
            </span>
          </div>

          <div className="space-y-1.5 text-[#1C1B1A] text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#5C564E]">Customer:</span>
              <b className="text-[#1C1B1A]">{receipt.customerName}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C564E]">Phone:</span>
              <span>{receipt.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C564E]">Service Rendered:</span>
              <b>{receipt.serviceName}</b>
            </div>
            {receipt.ageTier && (
              <div className="flex justify-between text-[#5C564E]">
                <span>Age Category:</span>
                <b className="text-[#1C1B1A]">{receipt.ageTier}</b>
              </div>
            )}
            {receipt.passTier && receipt.passTier !== 'None' && (
              <div className="flex justify-between text-[#1E75B8]">
                <span>VIP Pass Tier:</span>
                <b className="font-bold">{receipt.passTier} Pass</b>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#5C564E]">{isEn ? 'Stylist:' : 'Stylist / Karigar:'}</span>
              <b>{receipt.staffName}</b>
            </div>
            {receipt.preferredStylistFee ? (
              <div className="flex justify-between text-[#D63927]">
                <span>Master Stylist Custom Request:</span>
                <b>+₹{receipt.preferredStylistFee}.00</b>
              </div>
            ) : null}
            {receipt.membershipDiscount ? (
              <div className="flex justify-between text-[#288D43]">
                <span>VIP Pass Discount:</span>
                <b>-₹{receipt.membershipDiscount}.00</b>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-[#5C564E]">Payment Mode:</span>
              <b className="text-[#288D43]">{receipt.paymentMethod}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C564E]">Timestamp:</span>
              <span>{receipt.timestamp}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-dashed border-[#1C1B1A]/20 flex justify-between items-center text-sm font-bold text-[#1C1B1A]">
            <span>TOTAL COLLECTED:</span>
            <span className="text-[#D63927] font-mono text-base">₹{receipt.amount}.00</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-dashed border-[#1C1B1A]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-[#5C564E] hover:text-[#1C1B1A] rounded-lg font-bold text-xs"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 btn-kitsch-primary text-xs flex items-center gap-1.5"
          >
            <Printer size={14} /> {isEn ? 'Print Receipt' : 'Print Receipt (रसीद प्रिंट)'}
          </button>
        </div>
      </div>
    </div>
  )
}
