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

export default function CommonLoginPage() {
  const { login, registerCustomer, isSigningIn, authError, clearError } = useAuth()

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
    <div className="min-h-screen bg-[#F6EFE2] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-body selection:bg-[#F5B82E] selection:text-[#1C1B1A]">
      {/* Ambient Lighting Diffusers for Glass Depth */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D63927]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#F5B82E]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Street Pop Tag (Frosted Glass Pill) */}
      <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/80 backdrop-blur-md border border-[#1C1B1A]/15 shadow-sm text-xs font-bold text-[#1C1B1A]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#D63927] animate-ping" />
        <span className="font-hindi tracking-wide text-sm">डीलक्स सैलून</span>
        <span className="text-[#1E75B8] font-mono">• USTAAD SALON OPS</span>
      </div>

      {/* Main Centered Frosted Glass Matchbox Card */}
      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="bg-[#FFFDF9]/85 backdrop-blur-xl border border-[#1C1B1A]/15 rounded-2xl shadow-kitsch-lg p-6 sm:p-8 relative">
          
          {/* Header Branding */}
          <div className="text-center mb-6 pb-4 border-b border-dashed border-[#1C1B1A]/20">
            <div className="w-14 h-14 rounded-2xl bg-[#D63927] border border-white/40 text-white flex items-center justify-center shadow-md mx-auto mb-3">
              <Scissors size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1B1A] font-hindi tracking-tight leading-tight">
              डीलक्स उस्ताद सैलून
            </h1>
            <span className="text-xs font-bold text-[#D63927] uppercase tracking-wider block font-mono mt-0.5">
              USTAAD SALON OPS & MONITOR
            </span>
            <p className="text-[11px] text-[#5C564E] mt-1 font-medium">
              Traditional Karigari meets Precision Real-Time Automation
            </p>
          </div>

          {/* Error Message Alert */}
          {authError && (
            <div className="mb-5 p-3.5 bg-[#B81D1D]/10 backdrop-blur-sm border border-[#B81D1D]/40 rounded-xl text-[#B81D1D] text-xs flex items-start gap-2.5 animate-fadeIn shadow-xs">
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
                className="block text-[#1C1B1A] mb-1.5 font-bold"
              >
                Email / Username
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
                  className="w-full pl-9 pr-3 py-2.5 glass-input text-[#1C1B1A] text-xs font-medium placeholder:text-[#5C564E]/60 focus:outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[#1C1B1A] font-bold"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-[#1E75B8] hover:text-[#D63927] underline font-bold transition-colors"
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
                  className="w-full pl-9 pr-10 py-2.5 glass-input text-[#1C1B1A] text-xs font-medium placeholder:text-[#5C564E]/60 focus:outline-none transition-all disabled:opacity-50"
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
                  className="w-4 h-4 rounded border-[#1C1B1A]/30 text-[#D63927] focus:ring-[#D63927] accent-[#D63927]"
                />
                <span className="text-xs text-[#1C1B1A] font-medium">Remember me on this station</span>
              </label>
            </div>

            {/* Primary CTA: Sign In Button */}
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full py-3 px-4 btn-kitsch-primary text-sm flex items-center justify-center gap-2 mt-2 group"
            >
              {isSigningIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In & Identifying Role...</span>
                </>
              ) : (
                <>
                  <span>Sign In / प्रवेश करें</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Secondary Option: Customer Registration */}
          <div className="mt-6 pt-5 border-t border-dashed border-[#1C1B1A]/20 text-center">
            <p className="text-xs text-[#1C1B1A]/80 font-medium">
              New client to Ustaad Salon?{' '}
              <button
                type="button"
                onClick={() => {
                  setRegError(null)
                  setIsRegisterModalOpen(true)
                }}
                className="text-[#D63927] hover:text-[#1C1B1A] font-bold underline underline-offset-4 decoration-2 transition-all"
              >
                Create Customer Account
              </button>
            </p>
            <span className="text-[10px] text-[#5C564E] block mt-1">
              Staff and Admin credentials are provisioned by salon management.
            </span>
          </div>

          {/* Quick-Fill Demonstration Accounts Box (Frosted Glass Container) */}
          <div className="mt-5 p-3.5 bg-[#F5B82E]/15 backdrop-blur-md border border-[#F5B82E]/40 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#1C1B1A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <KeyRound size={13} className="text-[#D63927]" />
                <span>Demo 1-Click Login</span>
              </span>
              <span className="text-[9px] font-bold text-[#5C564E] font-mono">Auto Role Check</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleQuickFill('rahul@customer.com')}
                className="p-2 bg-[#FFFDF9]/90 hover:bg-[#1E75B8] hover:text-white border border-[#1C1B1A]/15 rounded-lg text-[#1C1B1A] transition-all shadow-xs text-center group"
                title="Rahul Sharma (Customer)"
              >
                <span className="block text-[#1E75B8] group-hover:text-white">Customer</span>
                <span className="text-[9px] opacity-75 truncate block font-mono">rahul@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('suresh@salonops.com')}
                className="p-2 bg-[#FFFDF9]/90 hover:bg-[#288D43] hover:text-white border border-[#1C1B1A]/15 rounded-lg text-[#1C1B1A] transition-all shadow-xs text-center group"
                title="Suresh Kumar (Staff Stylist)"
              >
                <span className="block text-[#288D43] group-hover:text-white">Staff Barber</span>
                <span className="text-[9px] opacity-75 truncate block font-mono">suresh@...</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@salonops.com')}
                className="p-2 bg-[#FFFDF9]/90 hover:bg-[#D63927] hover:text-white border border-[#1C1B1A]/15 rounded-lg text-[#1C1B1A] transition-all shadow-xs text-center group"
                title="Aarav Patel (Admin / Manager)"
              >
                <span className="block text-[#D63927] group-hover:text-white">Admin</span>
                <span className="text-[9px] opacity-75 truncate block font-mono">admin@...</span>
              </button>
            </div>
          </div>

        </div>

        {/* Security & Authenticity Footer Badge */}
        <div className="mt-4 text-center text-[11px] text-[#5C564E] flex items-center justify-center gap-1.5 font-mono">
          <ShieldCheck size={14} className="text-[#288D43]" />
          <span>Encrypted Glass Session • Ustaad Precision Engine v2.8</span>
        </div>
      </div>

      {/* ================================================================
          MODAL: CUSTOMER ACCOUNT REGISTRATION (Frosted Glass Modal)
          ================================================================ */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass-modal max-w-md w-full p-6 text-[#1C1B1A]">
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#1C1B1A]/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D63927] text-white flex items-center justify-center shadow-xs">
                  <User size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C1B1A] font-hindi">नया ग्राहक खाता (New Client)</h3>
                  <p className="text-[10px] text-[#5C564E]">Register for instant queue tokens & VIP booking</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-[#5C564E] hover:text-[#1C1B1A] p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {regError && (
              <div className="mt-3 p-2.5 bg-[#B81D1D]/10 border border-[#B81D1D]/40 rounded-lg text-[#B81D1D] text-xs flex items-center gap-2 font-bold">
                <AlertCircle size={14} className="shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">Full Name / पूरा नाम</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-2.5 text-[#5C564E]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 glass-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-2.5 text-[#5C564E]" />
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 glass-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">Phone Number (For AI Arrival Calls)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-2.5 text-[#5C564E]" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 glass-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">Confirm</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-[#1C1B1A]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-3.5 py-1.5 text-[#5C564E] hover:text-[#1C1B1A] rounded-lg font-bold"
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
          MODAL: FORGOT PASSWORD (Frosted Glass Modal)
          ================================================================ */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="glass-modal max-w-sm w-full p-6 text-[#1C1B1A]">
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#1C1B1A]/20">
              <h3 className="text-sm font-bold text-[#1C1B1A] font-hindi">पासवर्ड रीसेट (Password Reset)</h3>
              <button
                onClick={() => {
                  setIsForgotPasswordOpen(false)
                  setForgotSubmitted(false)
                }}
                className="text-[#5C564E] hover:text-[#1C1B1A] p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="my-5 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#288D43]/20 border border-[#288D43] text-[#288D43] mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="font-bold text-[#1C1B1A] text-xs">Reset Instructions Sent</h4>
                <p className="text-[11px] text-[#5C564E]">
                  If an account exists for <span className="font-bold text-[#1C1B1A]">{forgotEmail}</span>, a secure password link has been dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-3 text-xs font-semibold">
                <p className="text-[#5C564E] text-[11px] leading-relaxed">
                  Enter your registered account email and we will send you password reset instructions.
                </p>
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 glass-input text-[#1C1B1A] focus:outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-1.5 text-[#5C564E] hover:text-[#1C1B1A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 btn-kitsch-haldi text-xs"
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
