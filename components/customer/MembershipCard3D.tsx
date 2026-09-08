'use client'

import React, { useState } from 'react'
import {
  Crown,
  Sparkles,
  QrCode,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  Coffee,
  Zap,
  Scissors,
  Award,
} from 'lucide-react'
import { PassTier } from '@/lib/types'
import { soundFx } from '@/lib/soundEffects'

interface MembershipCard3DProps {
  memberName?: string
  memberId?: string
  initialTier?: PassTier
  onTierChange?: (tier: PassTier) => void
}

export default function MembershipCard3D({
  memberName = 'Rahul Sharma',
  memberId = '#USTAAD-8821',
  initialTier = 'Gold',
  onTierChange,
}: MembershipCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTier, setActiveTier] = useState<PassTier>(initialTier === 'None' ? 'Gold' : initialTier)

  const handleFlip = () => {
    soundFx.playBufferTick()
    setIsFlipped(!isFlipped)
  }

  const handleSelectTier = (tier: PassTier, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveTier(tier)
    if (onTierChange) onTierChange(tier)
    soundFx.playShopBell()
  }

  const tierDetails = {
    Silver: {
      name: 'Silver Pass (चांदी)',
      discount: '15% OFF ALL SERVICES',
      color: 'from-[#E8DAC1] via-[#F6EFE2] to-[#D5C7AF]',
      badgeColor: 'bg-[#1C1B1A] text-white',
      accent: 'border-[#1C1B1A]',
      validThru: '12/2027',
      tatkal: 'Standard Queue',
      monthlyPerk: 'Priority Weekend Booking',
      bgGlow: 'shadow-[0_16px_32px_rgba(28,27,26,0.2)]',
    },
    Gold: {
      name: 'Gold Pass (सोना)',
      discount: '25% OFF + 1 FREE CUT/MO',
      color: 'from-[#F5B82E] via-[#FAC446] to-[#E5A820]',
      badgeColor: 'bg-[#1C1B1A] text-[#F5B82E]',
      accent: 'border-[#1C1B1A]',
      validThru: '12/2027',
      tatkal: 'Express Queue (+5m Jump)',
      monthlyPerk: '1 Free Haircut or Shave every month',
      bgGlow: 'shadow-[0_16px_36px_rgba(245,184,46,0.35)]',
    },
    'Shahi Ustaad': {
      name: 'Shahi Ustaad (शाही उस्ताद)',
      discount: '35% OFF + TATKAL VIP PASS',
      color: 'from-[#D63927] via-[#E04230] to-[#B81D1D]',
      badgeColor: 'bg-[#F5B82E] text-[#1C1B1A]',
      accent: 'border-[#F5B82E]',
      validThru: '12/2028',
      tatkal: 'TATKAL PRIORITY (Next Available Chair)',
      monthlyPerk: 'Free Royal Combo, Cutting Chai & Head Champi',
      bgGlow: 'shadow-[0_16px_36px_rgba(214,57,39,0.35)]',
    },
  }[activeTier === 'None' ? 'Gold' : activeTier]

  return (
    <div className="flex flex-col items-center">
      {/* Interactive Tier Switcher Tabs */}
      <div className="mb-4 inline-flex items-center gap-1.5 p-1.5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-md">
        {(['Silver', 'Gold', 'Shahi Ustaad'] as PassTier[]).map((tier) => (
          <button
            key={tier}
            onClick={(e) => handleSelectTier(tier, e)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTier === tier
                ? tier === 'Shahi Ustaad'
                  ? 'bg-[#D63927] text-white shadow-sm'
                  : tier === 'Gold'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] shadow-sm'
                  : 'bg-white text-[#1C1B1A] border border-white/80 shadow-sm'
                : 'text-[#5C564E] hover:text-[#1C1B1A] hover:bg-white/40'
            }`}
          >
            {tier === 'Shahi Ustaad' ? '👑 Shahi' : tier === 'Gold' ? '⭐ Gold' : '🛡️ Silver'}
          </button>
        ))}
      </div>

      {/* 3D Perspective Card Container */}
      <div
        className="w-full max-w-[360px] sm:max-w-[390px] h-[230px] perspective-1000 cursor-pointer select-none group"
        onClick={handleFlip}
        title="Click or Tap to Flip Membership Card"
      >
        <div
          className={`relative w-full h-full transform-style-3d transition-transform duration-700 rounded-3xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================================================================
              CARD FRONT FACE (Frosted Gold / Terracotta / Parchment Glass)
              ================================================================ */}
          <div
            className={`absolute inset-0 backface-hidden w-full h-full rounded-3xl border border-white/80 p-5 flex flex-col justify-between overflow-hidden ${tierDetails.bgGlow} bg-gradient-to-br ${tierDetails.color} backdrop-blur-2xl`}
            style={{
              boxShadow:
                'inset 1.5px 1.5px 3px rgba(255,255,255,0.9), inset -1.5px -1.5px 3px rgba(255,255,255,0.25), 0 20px 40px -10px rgba(0,0,0,0.15)',
            }}
          >
            {/* Subtle frosted sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/30 pointer-events-none" />

            {/* Top Row: Wordmark Brand + Flip Icon */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/40 backdrop-blur-md border border-white/80 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/images/salon_logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-hindi font-bold text-sm tracking-wide text-[#1C1B1A] leading-tight">
                    डिLuxe Salon VIP Pass
                  </h4>
                  <span className="text-[9px] font-mono tracking-wider text-[#1C1B1A]/85 block font-bold">
                    लाइन में नहीं, ठाठ में बैठो। • ESTD 1984
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 text-[#F5B82E] text-[10px] font-mono font-bold border border-white/40 shadow-sm backdrop-blur-md">
                <RotateCw size={11} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>FLIP</span>
              </div>
            </div>

            {/* Middle Row: Holographic Tier Seal */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full ${tierDetails.badgeColor} border border-white/60 shadow-xs uppercase tracking-wider`}>
                  {tierDetails.name.split(' ')[0]} PASS
                </span>
                <p className="text-[11px] font-mono font-bold text-[#1C1B1A] mt-1 drop-shadow-xs">
                  {tierDetails.discount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/35 backdrop-blur-md border border-white/80 flex items-center justify-center shadow-inner">
                <Crown size={24} className="text-[#1C1B1A]" />
              </div>
            </div>

            {/* Bottom Row: Member Info + Expiry */}
            <div className="relative z-10 flex items-end justify-between pt-2 border-t border-white/40">
              <div>
                <span className="text-[8px] font-mono uppercase text-[#1C1B1A]/70 block">CARD HOLDER</span>
                <p className="text-xs font-extrabold text-[#1C1B1A] tracking-wide font-mono uppercase">
                  {memberName}
                </p>
                <span className="text-[10px] font-mono font-bold text-[#1C1B1A]/90">{memberId}</span>
              </div>

              <div className="text-right">
                <span className="text-[8px] font-mono uppercase text-[#1C1B1A]/70 block">VALID THRU</span>
                <span className="text-xs font-mono font-extrabold text-[#1C1B1A] block">
                  {tierDetails.validThru}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#288D43] inline-flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================
              CARD BACK FACE (Liquid Glass Frosted Surface + QR Code)
              ================================================================ */}
          <div
            className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 p-5 flex flex-col justify-between overflow-hidden shadow-xl"
            style={{
              boxShadow:
                'inset 1.5px 1.5px 3px rgba(255,255,255,1), inset -1.5px -1.5px 3px rgba(255,255,255,0.3), 0 24px 48px -10px rgba(0,0,0,0.12)',
            }}
          >
            {/* Frosted Magnetic Strip */}
            <div className="-mx-5 -mt-2 h-9 bg-black/80 backdrop-blur-md border-y border-white/20 flex items-center justify-between px-5">
              <span className="text-[9px] font-mono text-[#F5B82E] tracking-widest font-bold">
                USTAAD PASS SECURE CHIP // ENCRYPTED
              </span>
              <span className="text-[8px] font-mono text-white/70">AUTOCONNECT V3</span>
            </div>

            {/* Back Content: QR Code + Perks Matrix */}
            <div className="flex items-center gap-3.5 py-1">
              {/* Scannable Check-In QR Box */}
              <div className="p-2 bg-white/90 border border-white/80 rounded-2xl shadow-sm shrink-0 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1C1B1A] rounded-xl flex items-center justify-center text-white relative">
                  <QrCode size={46} className="text-[#F5B82E]" />
                </div>
                <span className="text-[7.5px] font-mono font-bold text-[#1C1B1A] mt-1 uppercase">
                  TAP AT CHAIR
                </span>
              </div>

              {/* VIP Entitlements List */}
              <div className="flex-1 space-y-1 text-[10.5px] font-mono text-[#1C1B1A]">
                <div className="flex items-center gap-1.5 font-bold text-[#D63927]">
                  <Zap size={11} className="shrink-0" />
                  <span className="truncate">{tierDetails.tatkal}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#288D43] font-bold">
                  <ShieldCheck size={11} className="shrink-0" />
                  <span>Zero Cancellation Hold Fee</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5C564E] font-medium">
                  <Coffee size={11} className="shrink-0 text-[#1E75B8]" />
                  <span>Unlimited Cutting Chai & Soda</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5C564E] font-medium">
                  <Scissors size={11} className="shrink-0 text-[#F5B82E]" />
                  <span className="truncate">{tierDetails.monthlyPerk}</span>
                </div>
              </div>
            </div>

            {/* Playful Micro-print Disclaimer */}
            <div className="pt-2 border-t border-dashed border-[#1C1B1A]/15 flex items-center justify-between text-[8px] font-mono text-[#5C564E]">
              <span>Terms subject to Ustaad chai break timings. Valid across all 4 Chairs.</span>
              <span className="font-bold text-[#1C1B1A]">ESTD 1984</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-[#5C564E] mt-2 flex items-center gap-1.5">
        <RotateCw size={11} className="text-[#D63927]" />
        <span>Click card to inspect Magnetic Strip & Walk-In QR Code</span>
      </p>
    </div>
  )
}
