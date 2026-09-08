'use client'

import React, { useState } from 'react'
import {
  Scissors,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  X,
  Phone,
  User,
  Sparkles,
  Radio,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/lib/language'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

export default function CommonLoginPage() {
  const { login, registerCustomer, isSigningIn, authError, clearError } = useAuth()
  const { t } = useLanguage()

  // Form States
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Registration Modal State (Customer self-service only)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regError, setRegError] = useState<string | null>(null)

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  // Quick fill helper for demo testing
  const handleQuickFill = (email: string, pass = 'password123') => {
    setEmailOrUsername(email)
    setPassword(pass)
    clearError()
  }

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOrUsername.trim() || !password) return
    await login(emailOrUsername, password, rememberMe)
  }

  // Handle Customer Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError(null)

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setRegError('Please fill in all fields.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.')
      return
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.')
      return
    }

    const success = await registerCustomer(regName, regEmail, regPhone, regPassword)
    if (success) {
      setIsRegisterModalOpen(false)
      setRegName('')
      setRegEmail('')
      setRegPhone('')
      setRegPassword('')
      setRegConfirmPassword('')
    }
  }

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    setForgotSubmitted(true)
    setTimeout(() => {
      setIsForgotPasswordOpen(false)
      setForgotSubmitted(false)
      setForgotEmail('')
    }, 2800)
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-body selection:bg-[#F5B82E] selection:text-[#1C1B1A] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(28, 27, 26, 0.45), rgba(28, 27, 26, 0.65)), url('/images/homepage_bg.jpg')`,
        backgroundColor: '#F6EFE2',
      }}
    >
      {/* Decorative Retro Halftone / Vignette Overlays */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1C1B1A]/30 to-[#1C1B1A]/70 pointer-events-none" />

      {/* Top Header Row with Retro Signboard & Language Switcher */}
      <div className="mb-4 flex items-center justify-between w-full max-w-lg px-1 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFFDF9] border-2 border-[#1C1B1A] shadow-kitsch text-xs font-bold text-[#1C1B1A]">
          <span className="nimbu-charm text-base">🍋🌶️</span>
          <span className="font-hindi tracking-wide text-sm font-extrabold">{t('salonTitle')}</span>
          <span className="text-[#D63927] font-mono">• ESTD 1984</span>
        </div>
        <LanguageSwitcher variant="glass" />
      </div>

      {/* Main Centered Matchbox Neo-Brutalist Card */}
      <div className="max-w-lg w-full mx-auto relative z-10">
        <div className="bg-[#FFFDF9] border-3 border-[#1C1B1A] rounded-2xl shadow-kitsch-lg overflow-hidden relative">
          
          {/* Top Barber Pole Ribbon Stripe */}
          <div className="h-2.5 barber-stripe-accent border-b-2 border-[#1C1B1A]" />

          <div className="p-6 sm:p-8">
            {/* Header Branding & Rubber Stamp */}
            <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-[#1C1B1A]/30 relative">
              <div className="absolute -top-3 right-0 sm:right-2">
                <span className="stamped-seal text-[10px]">USTAAD APPROVED</span>
              </div>

              <div className="w-24 h-24 rounded-2xl bg-[#D63927] border-2 border-[#1C1B1A] overflow-hidden shadow-kitsch-sm mx-auto mb-3 flex items-center justify-center">
                <img
                  src="/images/salon_logo.jpg"
                  alt="डिLUXE Salon Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1B1A] font-hindi tracking-tight leading-tight">
                {t('salonTitle')}
              </h1>
              <div className="inline-block px-3 py-0.5 mt-1 bg-[#F5B82E] border-2 border-[#1C1B1A] rounded-md shadow-xs">
                <span className="text-xs font-extrabold text-[#1C1B1A] uppercase tracking-wider font-mono">
                  {t('loginHeading')}
                </span>
              </div>
              <p className="text-xs text-[#5C564E] mt-2 font-medium">
                {t('loginSubheading')}
              </p>
            </div>

            {/* Error Message Alert */}
            {authError && (
              <div className="mb-5 p-3.5 bg-[#FFF0F0] border-2 border-[#B81D1D] rounded-xl text-[#B81D1D] text-xs flex items-start gap-2.5 animate-fadeIn shadow-kitsch-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#B81D1D]" />
                <div className="flex-1">
                  <p className="font-bold">{authError}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-[#B81D1D] hover:text-[#1C1B1A] p-0.5"
                  aria-label="Dismiss error"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Form Element */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
              {/* Email / Username Field */}
              <div>
                <label
                  htmlFor="emailOrUsername"
                  className="block text-[#1C1B1A] mb-1.5 font-extrabold font-mono uppercase text-[11px]"
                >
                  {t('emailOrUserLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C564E]">
                    <Mail size={16} />
                  </div>
                  <input
                    id="emailOrUsername"
                    name="emailOrUsername"
                    type="text"
                    required
                    autoComplete="username"
                    disabled={isSigningIn}
                    value={emailOrUsername}
                    onChange={(e) => {
                      setEmailOrUsername(e.target.value)
                      if (authError) clearError()
                    }}
                    placeholder="e.g. rahul@customer.com or suresh"
                    className="w-full pl-9 pr-3 py-2.5 neo-input text-[#1C1B1A] text-xs font-medium placeholder:text-[#5C564E]/60 focus:outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-[#1C1B1A] font-extrabold font-mono uppercase text-[11px]"
                  >
                    {t('passwordLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-[#1E75B8] hover:text-[#D63927] underline font-bold transition-colors font-mono"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C564E]">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    disabled={isSigningIn}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (authError) clearError()
                    }}
                    placeholder="Enter your account password"
                    className="w-full pl-9 pr-10 py-2.5 neo-input text-[#1C1B1A] text-xs font-medium placeholder:text-[#5C564E]/60 focus:outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5C564E] hover:text-[#1C1B1A] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-[#1C1B1A] text-[#D63927] focus:ring-[#D63927] accent-[#D63927]"
                  />
                  <span className="text-xs text-[#1C1B1A] font-bold">{t('rememberMe')}</span>
                </label>
              </div>

              {/* Primary CTA: Sign In Button */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full py-3.5 px-4 btn-kitsch-primary text-sm flex items-center justify-center gap-2 mt-2 group"
              >
                {isSigningIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('signingIn')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('signInButton')}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Secondary Option: Customer Registration */}
            <div className="mt-5 pt-4 border-t-2 border-dashed border-[#1C1B1A]/20 text-center">
              <p className="text-xs text-[#1C1B1A] font-bold">
                {t('registerPrompt')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setRegError(null)
                    setIsRegisterModalOpen(true)
                  }}
                  className="text-[#D63927] hover:text-[#1C1B1A] font-extrabold underline underline-offset-4 decoration-2 transition-all"
                >
                  {t('signUpButton')}
                </button>
              </p>
              <span className="text-[10px] text-[#5C564E] block mt-1 font-mono">
                {t('secureNotice')}
              </span>
            </div>

            {/* Quick-Fill Demonstration Accounts Box (Retro PCO Signboard Style) */}
            <div className="mt-5 p-3.5 bg-[#FFF9E6] border-2 border-[#1C1B1A] rounded-xl shadow-kitsch-sm">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#1C1B1A]/20">
                <span className="text-[11px] font-extrabold text-[#1C1B1A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <KeyRound size={14} className="text-[#D63927]" />
                  <span>{t('quickDemoPills')} (STD / PCO)</span>
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#F5B82E] border border-[#1C1B1A] rounded font-mono text-[#1C1B1A]">
                  1-CLICK LOGIN
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => handleQuickFill('rahul@customer.com')}
                  className="p-2 bg-[#FFFDF9] hover:bg-[#1E75B8] hover:text-white border-2 border-[#1C1B1A] rounded-lg text-[#1C1B1A] transition-all shadow-xs text-center group active:translate-x-0.5 active:translate-y-0.5"
                  title="Rahul Sharma (Customer)"
                >
                  <span className="block font-extrabold text-[#1E75B8] group-hover:text-white">{t('demoCustomer')}</span>
                  <span className="text-[9px] opacity-80 truncate block font-mono">rahul@...</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('suresh@salonops.com')}
                  className="p-2 bg-[#FFFDF9] hover:bg-[#288D43] hover:text-white border-2 border-[#1C1B1A] rounded-lg text-[#1C1B1A] transition-all shadow-xs text-center group active:translate-x-0.5 active:translate-y-0.5"
                  title="Suresh Kumar (Staff Stylist)"
                >
                  <span className="block font-extrabold text-[#288D43] group-hover:text-white">{t('demoStaff')}</span>
                  <span className="text-[9px] opacity-80 truncate block font-mono">suresh@...</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@salonops.com')}
                  className="p-2 bg-[#FFFDF9] hover:bg-[#D63927] hover:text-white border-2 border-[#1C1B1A] rounded-lg text-[#1C1B1A] transition-all shadow-xs text-center group active:translate-x-0.5 active:translate-y-0.5"
                  title="Aarav Patel (Admin / Manager)"
                >
                  <span className="block font-extrabold text-[#D63927] group-hover:text-white">{t('demoAdmin')}</span>
                  <span className="text-[9px] opacity-80 truncate block font-mono">admin@...</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Security & Authenticity Footer Badge */}
        <div className="mt-4 text-center text-xs text-[#FFFDF9] flex items-center justify-center gap-2 font-mono bg-[#1C1B1A]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-xs">
          <ShieldCheck size={15} className="text-[#F5B82E]" />
          <span>Encrypted Session • Ustaad Precision Salon Engine v2.8</span>
        </div>
      </div>

      {/* ================================================================
          MODAL: CUSTOMER ACCOUNT REGISTRATION (Neo-Brutalist Modal)
          ================================================================ */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-[#1C1B1A]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="neo-modal max-w-md w-full p-6 text-[#1C1B1A]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#1C1B1A]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D63927] text-white flex items-center justify-center border-2 border-[#1C1B1A] shadow-xs">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1C1B1A] font-hindi">नया ग्राहक खाता (New Client)</h3>
                  <p className="text-[11px] text-[#5C564E] font-medium">Instant queue tokens & VIP booking pass</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-[#5C564E] hover:text-[#1C1B1A] p-1.5 rounded-lg border border-[#1C1B1A]/20 hover:bg-[#E8DAC1]"
              >
                <X size={18} />
              </button>
            </div>

            {regError && (
              <div className="mt-3 p-2.5 bg-[#FFF0F0] border-2 border-[#B81D1D] rounded-lg text-[#B81D1D] text-xs flex items-center gap-2 font-bold shadow-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-[#1C1B1A] mb-1 font-extrabold font-mono uppercase text-[10px]">Full Name / पूरा नाम</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-[#5C564E]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 neo-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1B1A] mb-1 font-extrabold font-mono uppercase text-[10px]">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-[#5C564E]" />
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 neo-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1B1A] mb-1 font-extrabold font-mono uppercase text-[10px]">Phone Number (For AI Arrival Calls)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-[#5C564E]" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 neo-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-extrabold font-mono uppercase text-[10px]">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2.5 neo-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-extrabold font-mono uppercase text-[10px]">Confirm</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 neo-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t-2 border-dashed border-[#1C1B1A]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 btn-kitsch-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="px-4 py-2 btn-kitsch-primary text-xs"
                >
                  {isSigningIn ? 'Registering...' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          MODAL: FORGOT PASSWORD (Neo-Brutalist Modal)
          ================================================================ */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-[#1C1B1A]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="neo-modal max-w-sm w-full p-6 text-[#1C1B1A]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#1C1B1A]/30">
              <h3 className="text-sm font-extrabold text-[#1C1B1A] font-hindi">पासवर्ड रीसेट (Password Reset)</h3>
              <button
                onClick={() => {
                  setIsForgotPasswordOpen(false)
                  setForgotSubmitted(false)
                }}
                className="text-[#5C564E] hover:text-[#1C1B1A] p-1.5 rounded-lg border border-[#1C1B1A]/20 hover:bg-[#E8DAC1]"
              >
                <X size={16} />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="my-5 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#288D43] border-2 border-[#1C1B1A] text-white mx-auto flex items-center justify-center shadow-kitsch-sm">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-extrabold text-[#1C1B1A] text-sm">Reset Instructions Sent</h4>
                <p className="text-xs text-[#5C564E] font-medium">
                  If an account exists for <span className="font-bold text-[#1C1B1A] font-mono">{forgotEmail}</span>, a secure password link has been dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3 text-xs font-semibold">
                <p className="text-[#5C564E] text-xs font-medium leading-relaxed">
                  Enter your registered account email and we will send you password reset instructions.
                </p>
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-extrabold font-mono uppercase text-[10px]">Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2.5 neo-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-4 py-2 btn-kitsch-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 btn-kitsch-haldi text-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
