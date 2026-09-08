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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-xs font-bold text-[#1C1B1A] hover:border-[#D63927] transition-all cursor-pointer shadow-xs"
          title={t('changeLanguage')}
        >
          <Globe size={14} className="text-[#D63927]" />
          <span>{currentLanguageOption.flag}</span>
          <span>{currentLanguageOption.nativeName}</span>
          <ChevronDown size={12} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-44 rounded-xl glass-modal z-50 py-1.5 shadow-glass-lg border border-[#1C1B1A]/20 animate-fadeIn">
            <div className="px-3 py-1 border-b border-[#1C1B1A]/10 text-[10px] font-mono uppercase text-[#5C564E] font-bold">
              {t('selectLanguage')}
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-left transition-colors ${
                  language === lang.code
                    ? 'bg-[#D63927]/10 text-[#D63927]'
                    : 'text-[#1C1B1A] hover:bg-[#1C1B1A]/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <div>
                    <div className="font-bold leading-none">{lang.nativeName}</div>
                    <div className="text-[10px] text-[#5C564E] font-mono leading-none mt-0.5">{lang.label}</div>
                  </div>
                </div>
                {language === lang.code && <Check size={14} className="text-[#D63927]" />}
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2B2927] hover:bg-[#383532] text-[#FFFDF9] border border-white/20 text-xs font-bold transition-all shadow-xs cursor-pointer"
        title={t('changeLanguage')}
      >
        <Globe size={13} className="text-[#F5B82E]" />
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        <span className="font-mono text-xs">{currentLanguageOption.nativeName}</span>
        <ChevronDown size={11} className={`text-[#E8DAC1] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[#1C1B1A] text-[#FFFDF9] z-50 py-1.5 shadow-kitsch-lg border-2 border-[#F5B82E] animate-fadeIn font-sans">
          <div className="px-3 py-1 border-b border-white/10 text-[9px] font-mono uppercase text-[#E8DAC1] font-bold">
            {t('languageSelection')}
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-left transition-colors ${
                language === lang.code
                  ? 'bg-[#F5B82E] text-[#1C1B1A]'
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
