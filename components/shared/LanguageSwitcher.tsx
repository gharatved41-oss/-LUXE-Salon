'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/language'

interface LanguageSwitcherProps {
  variant?: 'header' | 'glass' | 'card' | 'minimal'
  className?: string
}

export default function LanguageSwitcher({
  variant = 'header',
  className = '',
}: LanguageSwitcherProps) {
  const { language, setLanguage, currentLanguageOption, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code)
    setIsOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 bg-[#1C1B1A]/5 p-1 rounded-xl border border-[#1C1B1A]/10 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
              language === lang.code
                ? 'bg-[#1C1B1A] text-[#F5B82E] shadow-xs'
                : 'text-[#1C1B1A]/70 hover:text-[#1C1B1A] hover:bg-white/50'
            }`}
            title={`Switch to ${lang.label}`}
          >
            <span className="mr-1">{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'glass') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 text-xs font-bold text-[#1C1B1A] hover:bg-white/90 transition-all cursor-pointer shadow-kitsch-sm"
          title={t('changeLanguage')}
        >
          <Globe size={14} className="text-[#D63927]" />
          <span>{currentLanguageOption.flag}</span>
          <span className="font-bold">{currentLanguageOption.nativeName}</span>
          <ChevronDown size={12} className={`text-[#1C1B1A] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-48 rounded-2xl glass-modal z-50 py-2 shadow-kitsch-lg animate-fadeIn overflow-hidden">
            <div className="px-3.5 py-1 border-b border-black/10 text-[10px] font-mono uppercase text-[#5C564E] font-bold">
              {t('selectLanguage')}
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-left transition-all ${
                  language === lang.code
                    ? 'bg-gradient-to-r from-[#E04230] to-[#D63927] text-white shadow-xs'
                    : 'text-[#1C1B1A] hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <div>
                    <div className="font-bold leading-none">{lang.nativeName}</div>
                    <div className={`text-[10px] font-mono leading-none mt-0.5 ${language === lang.code ? 'text-white/80' : 'text-[#5C564E]'}`}>{lang.label}</div>
                  </div>
                </div>
                {language === lang.code && <Check size={14} className="text-white" />}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default 'header' variant (Dark Topbar styling with gold accent)
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFDF9] border border-white/25 text-xs font-bold transition-all shadow-xs cursor-pointer backdrop-blur-md"
        title={t('changeLanguage')}
      >
        <Globe size={13} className="text-[#F5B82E]" />
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        <span className="font-mono text-xs">{currentLanguageOption.nativeName}</span>
        <ChevronDown size={11} className={`text-[#E8DAC1] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-black/80 backdrop-blur-2xl text-[#FFFDF9] z-50 py-2 shadow-kitsch-lg border border-white/30 animate-fadeIn font-sans overflow-hidden">
          <div className="px-3.5 py-1 border-b border-white/10 text-[9px] font-mono uppercase text-[#E8DAC1] font-bold">
            {t('languageSelection')}
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-left transition-all ${
                language === lang.code
                  ? 'bg-gradient-to-r from-[#FAC446] to-[#F5B82E] text-[#1C1B1A] shadow-xs'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <div>
                  <div className="font-bold leading-none">{lang.nativeName}</div>
                  <div className={`text-[10px] font-mono leading-none mt-0.5 ${language === lang.code ? 'text-[#1C1B1A]/80' : 'text-[#E8DAC1]'}`}>
                    {lang.label}
                  </div>
                </div>
              </div>
              {language === lang.code && <Check size={13} className="text-[#1C1B1A]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
