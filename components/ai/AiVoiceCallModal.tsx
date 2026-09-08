'use client'

import React, { useEffect, useState } from 'react'
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  Bot,
  RotateCcw,
} from 'lucide-react'
import { AiCallRecord } from '@/lib/types'
import { speakAiVoice } from '@/lib/aiEngine'
import { useLanguage } from '@/lib/language'

interface AiVoiceCallModalProps {
  callRecord: AiCallRecord | null
  onClose: () => void
  onAcknowledge?: (callId: string) => void
}

export default function AiVoiceCallModal({
  callRecord,
  onClose,
  onAcknowledge,
}: AiVoiceCallModalProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'
  const [isPlayingVoice, setIsPlayingVoice] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    if (!callRecord) return

    setCallDuration(0)
    setIsPlayingVoice(true)

    // Trigger Web Speech synthesis
    speakAiVoice(callRecord.spokenMessage, () => {
      setIsPlayingVoice(false)
    })

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [callRecord])

  if (!callRecord) return null

  const handleReplayVoice = () => {
    setIsPlayingVoice(true)
    speakAiVoice(callRecord.spokenMessage, () => {
      setIsPlayingVoice(false)
    })
  }

  const handleEndCall = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (onAcknowledge) onAcknowledge(callRecord.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-[#1C1B1A]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-body">
      <div className="neo-modal max-w-md w-full p-6 sm:p-8 text-[#1C1B1A] text-center relative overflow-hidden">
        {/* Top Telemetry Header (PCO Style) */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#1C1B1A]/30 text-xs">
          <span className="flex items-center gap-1.5 text-[#288D43] font-extrabold uppercase tracking-wider font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-[#288D43] animate-ping" />
            AI Voice Call Active (STD/PCO)
          </span>
          <span className="font-mono bg-[#F5B82E] border-2 border-[#1C1B1A] px-2.5 py-0.5 rounded text-[#1C1B1A] font-extrabold shadow-xs">
            00:{callDuration < 10 ? `0${callDuration}` : callDuration}
          </span>
        </div>

        {/* Dynamic Voice Call Avatar & Waveform */}
        <div className="my-6 space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-2xl bg-[#D63927] border-2 border-[#1C1B1A] text-white flex items-center justify-center shadow-kitsch mx-auto">
              <Bot size={36} />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#288D43] border-2 border-[#1C1B1A] text-white flex items-center justify-center shadow-xs">
              <PhoneCall size={14} className="animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-[#1C1B1A] font-hindi tracking-tight">
              Calling {callRecord.customerName}
            </h3>
            <span className="text-xs text-[#5C564E] font-mono font-bold block mt-0.5">
              {callRecord.customerPhone}
            </span>
          </div>

          {/* Animated Audio Waveform */}
          <div className="flex items-center justify-center gap-1.5 h-8">
            {[40, 75, 90, 60, 100, 80, 50, 95, 70, 45].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 bg-[#D63927] border border-[#1C1B1A] rounded-full transition-all ${
                  isPlayingVoice ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: isPlayingVoice ? `${height}%` : '20%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Spoken Voice Script Card */}
        <div className="p-4 bg-[#FFF9E6] border-2 border-[#1C1B1A] rounded-xl text-left space-y-2 text-xs shadow-kitsch-sm">
          <div className="flex items-center justify-between text-[#5C564E] text-[10px] font-extrabold uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1">
              <Volume2 size={13} className="text-[#D63927]" />
              <span>AI Voice Spoken Transcript</span>
            </span>
            <span className="text-[#1E75B8] font-bold">Station {callRecord.station}</span>
          </div>
          <p className="text-[#1C1B1A] leading-relaxed italic text-xs font-semibold font-serif">
            &ldquo;{callRecord.spokenMessage}&rdquo;
          </p>
        </div>

        {/* Appointment & Service Tags */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-left font-semibold">
          <div className="p-2.5 bg-[#FFFDF9] rounded-lg border-2 border-[#1C1B1A] shadow-xs">
            <span className="text-[#5C564E] text-[10px] uppercase block font-bold font-mono">Service</span>
            <strong className="text-[#1C1B1A] truncate block">{callRecord.serviceName}</strong>
          </div>
          <div className="p-2.5 bg-[#FFFDF9] rounded-lg border-2 border-[#1C1B1A] shadow-xs">
            <span className="text-[#5C564E] text-[10px] uppercase block font-bold font-mono">Barber Stylist</span>
            <strong className="text-[#1C1B1A] truncate block">{callRecord.staffName} ({callRecord.station})</strong>
          </div>
        </div>

        {/* Call Action Controls */}
        <div className="mt-6 flex items-center justify-center gap-3 pt-4 border-t-2 border-dashed border-[#1C1B1A]/30">
          <button
            onClick={handleReplayVoice}
            className="px-4 py-2.5 btn-kitsch-haldi text-xs flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Replay Voice
          </button>
          <button
            onClick={handleEndCall}
            className="px-5 py-2.5 bg-[#B81D1D] hover:bg-[#8F1616] text-white border-2 border-[#1C1B1A] shadow-kitsch-sm rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <PhoneOff size={14} /> {isEn ? 'End Call' : 'End Call (कॉल समाप्त)'}
          </button>
        </div>
      </div>
    </div>
  )
}
