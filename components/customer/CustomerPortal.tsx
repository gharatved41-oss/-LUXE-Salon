'use client'

import React, { useState } from 'react'
import {
  Scissors,
  Calendar,
  Clock,
  CreditCard,
  RotateCcw,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Receipt,
  Download,
  Star,
  ShieldCheck,
  Send,
  Eye,
  Check,
  Bot,
  Crown,
  Heart,
  Award,
  PhoneCall,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/lib/language'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import {
  Appointment,
  QueueItem,
  ServiceItem,
  StaffMember,
  RefundRequest,
  ReceiptData,
  MembershipPass,
  initialMembershipPasses,
  initialCustomerMemoryDatabase,
} from '@/lib/types'

interface CustomerPortalProps {
  services: ServiceItem[]
  staff: StaffMember[]
  appointments: Appointment[]
  queue: QueueItem[]
  refunds: RefundRequest[]
  onBookAppointment: (newApt: Appointment) => void
  onCheckIn: (aptId: string) => void
  onRequestRefund: (req: RefundRequest) => void
  onOpenReceipt: (receipt: ReceiptData) => void
  onOpenAiChat: () => void
}

export default function CustomerPortal({
  services,
  staff,
  appointments,
  queue,
  refunds,
  onBookAppointment,
  onCheckIn,
  onRequestRefund,
  onOpenReceipt,
  onOpenAiChat,
}: CustomerPortalProps) {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'services'
    | 'book'
    | 'appointments'
    | 'queue'
    | 'payments'
    | 'refunds'
    | 'passes'
    | 'notifications'
    | 'feedback'
    | 'profile'
  >('dashboard')

  // Membership Passes
  const [membershipPasses, setMembershipPasses] = useState<MembershipPass[]>(initialMembershipPasses)
  const [activeCustomerPass, setActiveCustomerPass] = useState<string>('Monthly Pass Active')

  // Booking Form State
  const [bookServiceId, setBookServiceId] = useState(services[0]?.id || '')
  const [bookStaffId, setBookStaffId] = useState(staff[0]?.id || '')
  const [isPreferredStylistRequested, setIsPreferredStylistRequested] = useState(false)
  const [bookDate, setBookDate] = useState('2026-09-08')
  const [bookTime, setBookTime] = useState('02:30 PM')
  const [bookPaymentMethod, setBookPaymentMethod] = useState<'UPI' | 'Card'>('UPI')
  const [bookSuccessMsg, setBookSuccessMsg] = useState('')

  // Refund Form State
  const [refundAptId, setRefundAptId] = useState('')
  const [refundReason, setRefundReason] = useState('Schedule conflict — need to cancel')
  const [refundSuccessMsg, setRefundSuccessMsg] = useState('')

  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Filter appointments specifically for this customer
  const customerName = user?.name || 'Rahul Sharma'
  const customerEmail = user?.email || 'rahul@customer.com'
  const myAppointments = appointments.filter(
    (a) => a.customerName.toLowerCase() === customerName.toLowerCase()
  )
  const myQueueItem = queue.find(
    (q) => q.customerName.toLowerCase() === customerName.toLowerCase() && q.status !== 'Completed'
  )
  const myRefunds = refunds.filter(
    (r) => r.customerName.toLowerCase() === customerName.toLowerCase()
  )
  const customerMemory = initialCustomerMemoryDatabase[customerEmail.toLowerCase()]

  // Price Calculation with Stylist Preference Surcharge & Pass discount
  const selectedService = services.find((s) => s.id === bookServiceId) || services[0]
  const selectedStaff = staff.find((st) => st.id === bookStaffId) || staff[0]
  const stylistPreferenceFee = isPreferredStylistRequested && selectedStaff.preferenceFee ? selectedStaff.preferenceFee : 0
  const baseServicePrice = selectedService?.price || 350
  const membershipDiscount = activeCustomerPass && (selectedService?.category === 'Spa' || selectedService?.category === 'Facial')
    ? Math.round(baseServicePrice * 0.2)
    : 0
  const finalCalculatedPrice = baseServicePrice + stylistPreferenceFee - membershipDiscount

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newApt: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: user?.name || 'Rahul Sharma',
      customerPhone: user?.phone || '+91 98901 23456',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      date: bookDate,
      time: bookTime,
      durationMinutes: selectedService.durationMinutes,
      price: baseServicePrice,
      preferredStylistFee: stylistPreferenceFee,
      membershipDiscount,
      finalPrice: finalCalculatedPrice,
      paymentStatus: 'Paid',
      paymentMethod: bookPaymentMethod,
      status: 'Confirmed',
      receiptId: `REC-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: '2026-09-08',
    }

    onBookAppointment(newApt)
    setBookSuccessMsg(
      `Appointment ${newApt.id} confirmed for ${selectedService.name}! Total paid: ₹${finalCalculatedPrice}.00`
    )
    setTimeout(() => {
      setBookSuccessMsg('')
      setActiveTab('appointments')
    }, 1600)
  }

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetApt = appointments.find((a) => a.id === refundAptId) || myAppointments[0]
    if (!targetApt) return

    const newRefund: RefundRequest = {
      id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      appointmentId: targetApt.id,
      customerName: user?.name || 'Rahul Sharma',
      serviceName: targetApt.serviceName,
      paidAmount: targetApt.finalPrice || targetApt.price,
      refundAmount: Math.round((targetApt.finalPrice || targetApt.price) * 0.8),
      reason: refundReason,
      tier: '80% Tier 2 (30-60m)',
      status: 'Pending Review',
      requestedAt: 'Just Now',
    }

    onRequestRefund(newRefund)
    setRefundSuccessMsg(`Refund request ${newRefund.id} submitted for review!`)
    setTimeout(() => {
      setRefundSuccessMsg('')
    }, 3000)
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedbackSubmitted(false)
      setFeedbackComment('')
    }, 3000)
  }

  const handleSubscribePass = (passType: string) => {
    setActiveCustomerPass(`${passType} Active`)
    alert(`🎉 Successfully subscribed to ${passType}! VIP perks are now active on your account.`)
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F6EFE2] font-sans">
      {/* ================================================================
          CUSTOMER SIDEBAR NAVIGATION (Frosted Glass Sidebar)
          ================================================================ */}
      <aside className="w-full md:w-64 bg-[#FFFDF9]/80 backdrop-blur-xl border-r border-[#1C1B1A]/12 p-4 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-5">
          {/* Customer Profile Frosted Pill */}
          <div className="p-3 bg-[#FFF9E6]/85 backdrop-blur-md border border-[#F5B82E]/40 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D63927] text-white font-bold flex items-center justify-center text-sm border border-white/40 shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
              </div>
              <div className="overflow-hidden flex-1">
                <span className="text-[10px] font-mono font-bold text-[#D63927] uppercase tracking-wider block">
                  {t('roleCustomer')} {t('portalSuffix')}
                </span>
                <h4 className="text-xs font-bold text-[#1C1B1A] truncate">{user?.name}</h4>
                <span className="text-[11px] font-mono text-[#5C564E] truncate block">{user?.email}</span>
              </div>
            </div>

            {/* Language Switcher in Customer Sidebar */}
            <div className="mt-2.5 pt-2 border-t border-[#1C1B1A]/10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#5C564E]">{t('changeLanguage')}:</span>
              <LanguageSwitcher variant="glass" />
            </div>
          </div>

          {/* AI Concierge Quick Trigger Button */}
          <button
            onClick={onOpenAiChat}
            className="w-full p-2.5 btn-kitsch-haldi flex items-center justify-center gap-2 group text-xs font-bold"
          >
            <Bot size={16} className="text-[#D63927] group-hover:rotate-12 transition-transform" />
            <span className="font-hindi tracking-wide text-sm">{t('aiConcierge')}</span>
          </button>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Scissors size={15} />
              <span>{t('customerNavHome')}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'services'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Sparkles size={15} />
              <span>{isEn ? 'Service Menu' : t('customerNavMenu')}</span>
            </button>

            <button
              onClick={() => setActiveTab('book')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'book'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Plus size={15} />
              <span>{isEn ? 'Book Slot' : t('customerNavBook')}</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'appointments'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Calendar size={15} />
              <span>{isEn ? 'My Bookings' : t('customerNavHistory')}</span>
              {myAppointments.length > 0 && (
                <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] bg-[#D63927] text-white font-mono font-bold">
                  {myAppointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'queue'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Clock size={15} />
              <span>{isEn ? 'Live Queue' : t('yourQueueToken')}</span>
              {myQueueItem && (
                <span className="ml-auto w-2.5 h-2.5 rounded-full bg-[#288D43] animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('passes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'passes'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Crown size={15} className="text-[#F5B82E]" />
              <span>{isEn ? 'VIP Passes' : t('customerNavPass')}</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'payments'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <CreditCard size={15} />
              <span>{isEn ? 'Receipts' : t('customerNavReceipts')}</span>
            </button>

            <button
              onClick={() => setActiveTab('refunds')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'refunds'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <RotateCcw size={15} />
              <span>{isEn ? 'Refunds' : t('customerNavRefunds')}</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'notifications'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Bell size={15} />
              <span>{isEn ? 'Alerts' : 'सूचनाएं'}</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'feedback'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <MessageSquare size={15} />
              <span>{isEn ? 'Feedback' : t('customerNavFeedback')}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'profile'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <User size={15} />
              <span>{isEn ? 'Profile' : t('customerNavProfile')}</span>
            </button>
          </nav>
        </div>

        {/* Logout Action Button */}
        <div className="pt-4 border-t border-[#1C1B1A]/15">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#B81D1D]/10 hover:bg-[#B81D1D] text-[#B81D1D] hover:text-white font-bold text-xs border border-[#B81D1D]/25 transition-colors"
          >
            <LogOut size={15} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* ================================================================
          MAIN CONTENT AREA
          ================================================================ */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl">
        {/* ==================== TAB 1: DASHBOARD / HOME ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* AI Customer Memory Greeting Banner (Frosted Glass Card) */}
            {customerMemory && (
              <div className="p-4 bg-[#FFF9E6]/85 backdrop-blur-md border border-[#F5B82E]/40 rounded-2xl flex items-start gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#D63927] text-white flex items-center justify-center shrink-0 border border-white/30 shadow-xs">
                  <Heart size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#1C1B1A]">
                      {isEn ? `Welcome back, ${user?.name}! (VIP Member • ${customerMemory.totalVisits} Visits)` : `नमस्ते ${user?.name}! (VIP Member • ${customerMemory.totalVisits} Visits)`}
                    </h4>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#F5B82E] text-[#1C1B1A] border border-[#1C1B1A]/20">
                      AI MEMORY RECOGNIZED
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C564E] mt-1 font-serif">
                    Your last service was <b className="text-[#1C1B1A]">{customerMemory.lastServiceName}</b> with <b className="text-[#1C1B1A]">{customerMemory.lastStaffName}</b> ({customerMemory.lastVisitDate}). Ready for your next styling session?
                  </p>
                </div>
              </div>
            )}

            {/* Welcome Banner (Glass Terracotta Hero) */}
            <div className="glass-terracotta rounded-2xl p-6 text-white shadow-glass relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[#F5B82E] text-xs font-mono font-bold tracking-wider uppercase bg-[#1C1B1A]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20">
                  {isEn ? 'DELUXE USTAAD SALON • OPERATIONS' : 'डीलक्स उस्ताद सैलून • DELUXE SALON OPS'}
                </span>
                <h2 className="text-2xl font-bold font-hindi mt-2 text-white">
                  {isEn ? `Welcome, ${user?.name}!` : `स्वागतम्, ${user?.name}!`}
                </h2>
                <p className="text-[#FFFDF9]/90 text-xs max-w-lg mt-1 font-sans">
                  Track live token queues, enjoy transparent Master Barber booking, and experience real-time AI salon management.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab('book')}
                    className="btn-kitsch-haldi text-xs flex items-center gap-1.5"
                  >
                    <Plus size={14} /> {isEn ? 'Book Slot' : 'नई बुकिंग'}
                  </button>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="btn-kitsch-secondary text-xs"
                  >
                    {isEn ? 'View Menu' : 'सेवा सूची'}
                  </button>
                  <button
                    onClick={onOpenAiChat}
                    className="btn-kitsch-shutter text-xs flex items-center gap-1.5"
                  >
                    <Bot size={14} /> {isEn ? 'Ask AI' : 'AI से बात करें'}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Queue Tracker Card (Frosted Yellow STD PCO Token Card) */}
            {myQueueItem ? (
              <div className="bg-[#FFF9E6]/85 backdrop-blur-md border border-[#F5B82E]/50 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#1C1B1A]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#288D43] animate-ping" />
                    <h3 className="text-sm font-bold text-[#1C1B1A] font-hindi">
                      {isEn ? 'Your Turn • Live Queue Status' : 'आपकी बारी • Live Queue Status'}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-[#F5B82E] text-[#1C1B1A] text-xs font-mono font-bold border border-[#1C1B1A]/20 shadow-xs">
                    TOKEN #{myQueueItem.token}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
                  <div className="p-3 bg-[#FFFDF9]/90 backdrop-blur-sm rounded-xl border border-[#1C1B1A]/10 shadow-2xs">
                    <span className="text-[10px] text-[#5C564E] uppercase font-bold font-mono">
                      {isEn ? 'SERVICE' : 'सेवा / SERVICE'}
                    </span>
                    <strong className="block text-xs text-[#1C1B1A] mt-0.5">{myQueueItem.serviceName}</strong>
                  </div>
                  <div className="p-3 bg-[#FFFDF9]/90 backdrop-blur-sm rounded-xl border border-[#1C1B1A]/10 shadow-2xs">
                    <span className="text-[10px] text-[#5C564E] uppercase font-bold font-mono">
                      {isEn ? 'STYLIST' : 'कारीगर / STYLIST'}
                    </span>
                    <strong className="block text-xs text-[#1C1B1A] mt-0.5">{myQueueItem.staffName} ({myQueueItem.assignedStation})</strong>
                  </div>
                  <div className="p-3 bg-[#288D43]/10 backdrop-blur-sm rounded-xl border border-[#288D43]/30">
                    <span className="text-[10px] text-[#288D43] uppercase font-bold font-mono">
                      {isEn ? 'STATUS' : 'स्थिति / STATUS'}
                    </span>
                    <strong className="block text-xs text-[#288D43] mt-0.5 font-bold">{myQueueItem.status}</strong>
                  </div>
                </div>

                {myQueueItem.waitBreakdown && (
                  <div className="mt-4 p-2.5 bg-[#1E75B8]/10 border border-[#1E75B8]/30 rounded-xl text-center text-xs text-[#1E75B8] font-mono font-bold">
                    🤖 <b>AI WAIT PREDICTOR:</b> {myQueueItem.waitBreakdown} (~{myQueueItem.estimatedWaitMinutes}m wait)
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-panel p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1C1B1A]">
                    {isEn ? 'No Active Queue Token' : 'कोई सक्रिय टोकन नहीं'}
                  </h4>
                  <p className="text-[11px] text-[#5C564E] mt-0.5">
                    Check in for today&apos;s booking to receive your live digital token and automated arrival call.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="btn-kitsch-secondary text-xs"
                >
                  {isEn ? 'View Appointments →' : 'बुकिंग देखें →'}
                </button>
              </div>
            )}

            {/* Upcoming Appointments Summary */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1C1B1A]/10">
                <h3 className="text-sm font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'Upcoming Bookings' : 'आपकी आगामी बुकिंग'}
                </h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs font-bold text-[#D63927] hover:underline"
                >
                  {isEn ? `View All (${myAppointments.length}) →` : `सभी देखें (${myAppointments.length}) →`}
                </button>
              </div>
              {myAppointments.length === 0 ? (
                <div className="text-center py-8 text-[#5C564E] text-xs font-mono">
                  No appointments booked yet. Click &quot;Book Slot&quot; to get started.
                </div>
              ) : (
                <div className="divide-y divide-[#1C1B1A]/10">
                  {myAppointments.map((apt) => (
                    <div key={apt.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-[#1C1B1A]">{apt.serviceName}</strong>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FFF9E6] text-[#1C1B1A] rounded border border-[#1C1B1A]/15">
                            {apt.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5C564E] block mt-0.5 font-mono">
                          📅 {apt.date} at {apt.time} • {isEn ? 'Stylist:' : 'उस्ताद:'} {apt.staffName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {apt.status === 'Confirmed' && (
                          <button
                            onClick={() => onCheckIn(apt.id)}
                            className="btn-kitsch-limca px-3 py-1 text-xs"
                          >
                            {isEn ? 'Check-In' : 'हाजिरी'}
                          </button>
                        )}
                        {apt.receiptId && (
                          <button
                            onClick={() =>
                              onOpenReceipt({
                                receiptNumber: apt.receiptId!,
                                appointmentId: apt.id,
                                customerName: apt.customerName,
                                customerPhone: apt.customerPhone,
                                serviceName: apt.serviceName,
                                staffName: apt.staffName,
                                amount: apt.finalPrice || apt.price,
                                preferredStylistFee: apt.preferredStylistFee,
                                membershipDiscount: apt.membershipDiscount,
                                paymentMethod: apt.paymentMethod || 'UPI',
                                timestamp: 'Today 10:00 AM',
                              })
                            }
                            className="p-1.5 bg-[#FFFDF9]/90 hover:bg-[#F5B82E] text-[#1C1B1A] border border-[#1C1B1A]/15 rounded-lg transition-colors shadow-2xs"
                            title={isEn ? 'View Receipt' : 'रसीद देखें'}
                          >
                            <Receipt size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SERVICES MENU ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="glass-panel p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'Salon Services Catalog' : 'डीलक्स सेवा सूची'}
                </h2>
                <p className="text-xs text-[#5C564E]">
                  Explore our luxury hair, grooming, and spa services with transparent pricing.
                </p>
              </div>
              <button
                onClick={onOpenAiChat}
                className="btn-kitsch-haldi text-xs flex items-center gap-1.5"
              >
                <Bot size={14} /> {isEn ? 'Ask AI' : 'AI से सलाह लें'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="glass-card p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F6EFE2]/80 text-[#1C1B1A] rounded border border-[#1C1B1A]/15">
                        {srv.category}
                      </span>
                      <span className="text-lg font-bold text-[#D63927] font-mono">
                        ₹{srv.price}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1C1B1A] text-sm">{srv.name}</h3>
                    <p className="text-xs text-[#5C564E] mt-1 leading-relaxed">{srv.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-[#5C564E] font-mono font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {srv.durationMinutes} mins
                      </span>
                      <span>• Buffer: {srv.bufferMinutes}m</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C1B1A]/10 flex justify-end">
                    <button
                      onClick={() => {
                        setBookServiceId(srv.id)
                        setActiveTab('book')
                      }}
                      className="btn-kitsch-primary px-3.5 py-1.5 text-xs flex items-center gap-1"
                    >
                      {isEn ? 'Book Now' : 'बुक करें'} <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: BOOK APPOINTMENT WITH PREFERRED STYLIST SURCHARGE ==================== */}
        {activeTab === 'book' && (
          <div className="max-w-xl mx-auto glass-panel p-6 shadow-glass-lg">
            <div className="mb-5 pb-3 border-b border-[#1C1B1A]/15">
              <span className="text-[10px] font-mono font-bold text-[#D63927] uppercase tracking-wider bg-[#F6EFE2] px-2 py-0.5 rounded border border-[#1C1B1A]/15">
                {isEn ? 'INSTANT BOOKING' : 'तुरंत बुकिंग • INSTANT BOOKING'}
              </span>
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi mt-1.5">
                {isEn ? 'Schedule Appointment' : 'अपॉइंटमेंट बुक करें / Schedule Visit'}
              </h2>
            </div>

            {bookSuccessMsg && (
              <div className="mb-4 p-3 bg-[#288D43]/10 border border-[#288D43]/40 rounded-xl text-[#288D43] text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} />
                <span>{bookSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs font-medium text-[#1C1B1A]">
              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">
                  {isEn ? 'Select Service' : 'सेवा चुनें / Select Service'}
                </label>
                <select
                  value={bookServiceId}
                  onChange={(e) => setBookServiceId(e.target.value)}
                  className="w-full p-2.5 glass-input font-bold"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ₹{s.price} ({s.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#1C1B1A] font-bold">
                    {isEn ? 'Preferred Stylist' : 'पसंदीदा उस्ताद / Preferred Stylist'}
                  </label>
                  <span className="text-[10px] text-[#D63927] font-mono font-bold">
                    ⭐ Master Stylists have +₹50 custom request fee
                  </span>
                </div>
                <select
                  value={bookStaffId}
                  onChange={(e) => setBookStaffId(e.target.value)}
                  className="w-full p-2.5 glass-input font-bold"
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.roleTitle} • Rating: ⭐{st.rating}) {st.isPreferredMaster ? '— Master Stylist (+₹50)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific Star Stylist Preference Selection Checkbox */}
              {selectedStaff.isPreferredMaster && (
                <div className="p-3 bg-[#FFF9E6]/85 backdrop-blur-sm border border-[#F5B82E]/40 rounded-xl flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="preferredStylist"
                    checked={isPreferredStylistRequested}
                    onChange={(e) => setIsPreferredStylistRequested(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#D63927] accent-[#D63927]"
                  />
                  <label htmlFor="preferredStylist" className="text-xs text-[#1C1B1A] cursor-pointer font-sans">
                    <span className="font-bold block">Lock Dedicated Master Stylist ({selectedStaff.name})</span>
                    <span className="text-[11px] text-[#5C564E] block">
                      AI guarantees 1-on-1 priority chair reservation. Adds a transparent +₹50 preference fee.
                    </span>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">{isEn ? 'Date' : 'तारीख / Date'}</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full p-2.5 glass-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">{isEn ? 'Time Slot' : 'समय / Time Slot'}</label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full p-2.5 glass-input font-bold"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">
                  {isEn ? 'Payment Option' : 'भुगतान विकल्प / Payment Option'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookPaymentMethod('UPI')}
                    className={`p-2.5 border rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                      bookPaymentMethod === 'UPI'
                        ? 'border-[#1C1B1A] bg-[#F5B82E] text-[#1C1B1A] shadow-xs'
                        : 'border-[#1C1B1A]/20 bg-[#FFFDF9]/80 text-[#5C564E]'
                    }`}
                  >
                    <span>Instant UPI (GPay/PhonePe)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookPaymentMethod('Card')}
                    className={`p-2.5 border rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                      bookPaymentMethod === 'Card'
                        ? 'border-[#1C1B1A] bg-[#F5B82E] text-[#1C1B1A] shadow-xs'
                        : 'border-[#1C1B1A]/20 bg-[#FFFDF9]/80 text-[#5C564E]'
                    }`}
                  >
                    <span>Debit / Credit Card</span>
                  </button>
                </div>
              </div>

              {/* AI Itemized Price Breakdown (Frosted Glass Card) */}
              <div className="p-3.5 bg-[#F6EFE2]/75 backdrop-blur-sm rounded-xl border border-[#1C1B1A]/15 text-xs space-y-1.5 font-mono shadow-xs">
                <div className="flex justify-between text-[#5C564E]">
                  <span>Base Service Fee:</span>
                  <span>₹{baseServicePrice}.00</span>
                </div>
                {stylistPreferenceFee > 0 && (
                  <div className="flex justify-between text-[#B81D1D] font-bold">
                    <span>Master Stylist Custom Request Fee:</span>
                    <span>+₹{stylistPreferenceFee}.00</span>
                  </div>
                )}
                {membershipDiscount > 0 && (
                  <div className="flex justify-between text-[#288D43] font-bold">
                    <span>VIP Member Spa Perk (20% Off):</span>
                    <span>-₹{membershipDiscount}.00</span>
                  </div>
                )}
                <div className="pt-2 border-t border-dashed border-[#1C1B1A]/20 flex justify-between items-center text-sm font-bold text-[#1C1B1A]">
                  <span>Total Payable:</span>
                  <span className="text-[#D63927] text-base font-black">₹{finalCalculatedPrice}.00</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 btn-kitsch-primary text-sm font-bold"
              >
                {isEn
                  ? `Confirm & Pay ₹${finalCalculatedPrice}.00`
                  : `पुष्टि करें और भुगतान करें / Pay ₹${finalCalculatedPrice}.00`}
              </button>
            </form>
          </div>
        )}

        {/* ==================== TAB 4: MY APPOINTMENTS ==================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="glass-panel p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'My Appointments' : 'मेरी बुकिंग / My Appointments'}
                </h2>
                <p className="text-xs text-[#5C564E]">View and manage your upcoming & past bookings.</p>
              </div>
              <button
                onClick={() => setActiveTab('book')}
                className="btn-kitsch-primary text-xs flex items-center gap-1"
              >
                <Plus size={14} /> {isEn ? 'New Booking' : 'नई बुकिंग / New Booking'}
              </button>
            </div>

            <div className="glass-panel overflow-hidden divide-y divide-[#1C1B1A]/10">
              {myAppointments.map((apt) => (
                <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1C1B1A] bg-[#F6EFE2] px-1.5 py-0.5 rounded border border-[#1C1B1A]/20">{apt.id}</span>
                      <span className="text-xs font-bold text-[#1C1B1A]">{apt.serviceName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF9E6] text-[#1C1B1A] font-bold border border-[#1C1B1A]/15">
                        {apt.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C564E] block mt-1 font-mono">
                      📅 {apt.date} at {apt.time} • Stylist: {apt.staffName} • Amount: ₹{apt.finalPrice || apt.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => onCheckIn(apt.id)}
                        className="btn-kitsch-limca px-3 py-1.5 text-xs font-bold"
                      >
                        {isEn ? 'Self Check-In' : 'हाजिरी / Self Check-In'}
                      </button>
                    )}
                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => {
                          setRefundAptId(apt.id)
                          setActiveTab('refunds')
                        }}
                        className="px-3 py-1.5 bg-[#B81D1D]/10 text-[#B81D1D] hover:bg-[#B81D1D] hover:text-white border border-[#B81D1D]/30 rounded-xl text-xs font-bold transition-colors"
                      >
                        {isEn ? 'Cancel / Refund' : 'रद्द / Refund'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: QUEUE STATUS WITH AI PREDICTION ==================== */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Live Queue Telemetry' : 'लाइव कतार एवं AI गणना / Live Queue Telemetry'}
              </h2>
              <p className="text-xs text-[#5C564E]">
                Real-time queue tracking showing token progression across salon styling stations.
              </p>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-xs font-mono font-bold text-[#5C564E] uppercase tracking-wider mb-4">
                {isEn ? 'Active Tokens in Queue' : 'सक्रिय टोकन / Active Tokens in Queue'}
              </h3>
              <div className="space-y-2.5">
                {queue.map((item) => {
                  const isMine = item.customerName.toLowerCase() === customerName.toLowerCase()
                  return (
                    <div
                      key={item.token}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isMine
                          ? 'bg-[#FFF9E6]/90 border-[#F5B82E] font-bold text-[#1C1B1A] shadow-xs'
                          : 'bg-[#F6EFE2]/70 border-[#1C1B1A]/10 text-[#1C1B1A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-[#F5B82E] text-[#1C1B1A] border border-[#1C1B1A]/20 shadow-2xs">
                          {item.token}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{item.serviceName}</span>
                            {item.isWalkIn && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#D63927] text-white rounded font-bold">
                                WALK-IN
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#5C564E] block font-mono">
                            Station: {item.assignedStation} • Stylist: {item.staffName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/90 border border-[#1C1B1A]/15">
                          {item.status}
                        </span>
                        <span className="text-[10px] text-[#D63927] block mt-1 font-mono font-bold">
                          AI ETA: ~{item.estimatedWaitMinutes}m
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: MEMBERSHIP PASSES (Monthly & Annual Pass) ==================== */}
        {activeTab === 'passes' && (
          <div className="space-y-6">
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2">
                <Crown size={22} className="text-[#F5B82E]" />
                <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'VIP Membership Club' : 'डीलक्स उस्ताद वीआईपी क्लब / VIP Membership Club'}
                </h2>
              </div>
              <p className="text-xs text-[#5C564E]">
                Unlock unlimited scissor cuts, complimentary monthly hair spas, and zero wait-time VIP priority.
              </p>
            </div>

            {activeCustomerPass && (
              <div className="p-4 bg-[#FFF9E6]/90 backdrop-blur-md border border-[#F5B82E]/50 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5B82E] text-[#1C1B1A] border border-white flex items-center justify-center font-bold shadow-xs">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#D63927] uppercase tracking-wider block">
                      {isEn ? 'ACTIVE SUBSCRIPTION' : 'सक्रिय सदस्यता • ACTIVE SUBSCRIPTION'}
                    </span>
                    <h4 className="text-sm font-bold text-[#1C1B1A]">{activeCustomerPass}</h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#288D43] bg-[#288D43]/10 px-3 py-1 rounded-full border border-[#288D43]/30">
                  ALL PERKS ACTIVE
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {membershipPasses.map((pass) => (
                <div
                  key={pass.id}
                  className={`glass-card p-6 flex flex-col justify-between relative overflow-hidden ${
                    pass.type === 'Annual VIP Pass' ? 'bg-[#FFF9E6]/85 border-[#F5B82E]/60' : ''
                  }`}
                >
                  {pass.status === 'Featured' && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded bg-[#D63927] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                      {isEn ? 'MOST POPULAR' : 'MOST POPULAR / लोकप्रिय'}
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-mono font-bold text-[#D63927] uppercase tracking-wider block mb-1">
                      {pass.type}
                    </span>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl font-bold text-[#1C1B1A] font-mono">₹{pass.price}</span>
                      <span className="text-xs text-[#5C564E] font-mono">/{pass.billingPeriod}</span>
                    </div>

                    <div className="space-y-2.5 my-5 text-xs text-[#1C1B1A]">
                      {pass.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-[#288D43] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSubscribePass(pass.type)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      pass.type === 'Annual VIP Pass'
                        ? 'btn-kitsch-haldi'
                        : 'btn-kitsch-primary'
                    }`}
                  >
                    {isEn ? `Activate ${pass.type}` : `सदस्यता लें / Activate ${pass.type}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: PAYMENTS / RECEIPTS ==================== */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Payments & Invoices' : 'भुगतान एवं रसीदें / Payments & Invoices'}
              </h2>
              <p className="text-xs text-[#5C564E]">Download digital invoices and inspect payment history.</p>
            </div>

            <div className="glass-panel divide-y divide-[#1C1B1A]/10">
              {myAppointments.map((apt) => (
                <div key={apt.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[#5C564E] block text-[10px]">
                      INVOICE #{apt.receiptId || 'REC-000'}
                    </span>
                    <strong className="text-[#1C1B1A] font-bold">{apt.serviceName}</strong>
                    <span className="text-[#5C564E] block text-[11px] font-mono">
                      Paid via {apt.paymentMethod || 'UPI'} on {apt.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#D63927] font-mono text-base">
                      ₹{apt.finalPrice || apt.price}.00
                    </span>
                    <button
                      onClick={() =>
                        onOpenReceipt({
                          receiptNumber: apt.receiptId || 'REC-000',
                          appointmentId: apt.id,
                          customerName: apt.customerName,
                          customerPhone: apt.customerPhone,
                          serviceName: apt.serviceName,
                          staffName: apt.staffName,
                          amount: apt.finalPrice || apt.price,
                          preferredStylistFee: apt.preferredStylistFee,
                          membershipDiscount: apt.membershipDiscount,
                          paymentMethod: apt.paymentMethod || 'UPI',
                          timestamp: `${apt.date} 10:00 AM`,
                        })
                      }
                      className="p-2 bg-[#FFF9E6]/90 border border-[#1C1B1A]/20 rounded-xl hover:bg-[#F5B82E] text-[#1C1B1A] shadow-2xs transition-colors"
                      title={isEn ? 'Download Receipt' : 'रसीद डाउनलोड करें / View Ticket'}
                    >
                      <Download size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 8: REFUND STATUS ==================== */}
        {activeTab === 'refunds' && (
          <div className="space-y-6">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Refunds & Protection Policy' : 'रिफंड एवं सुरक्षा नीति / Refunds & Protection'}
              </h2>
              <p className="text-xs text-[#5C564E]">
                Transparent cancellation policies with automatic tiered refund processing.
              </p>
            </div>

            {/* Refund Policy Tiers Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#288D43]/10 border border-[#288D43]/30 rounded-xl text-xs backdrop-blur-sm">
                <span className="font-bold text-[#288D43] block">Tier 1: 100% Full Refund</span>
                <span className="text-[11px] text-[#1C1B1A] mt-1 block">
                  Cancelled &gt; 60 mins before appointment slot
                </span>
              </div>
              <div className="p-3.5 bg-[#F5B82E]/20 border border-[#F5B82E]/40 rounded-xl text-xs backdrop-blur-sm">
                <span className="font-bold text-[#1C1B1A] block">Tier 2: 80% Reversal</span>
                <span className="text-[11px] text-[#5C564E] mt-1 block">
                  Cancelled 30 - 60 mins prior to appointment
                </span>
              </div>
              <div className="p-3.5 bg-[#1E75B8]/10 border border-[#1E75B8]/30 rounded-xl text-xs backdrop-blur-sm">
                <span className="font-bold text-[#1E75B8] block">Tier 3: 50% Salon Credit</span>
                <span className="text-[11px] text-[#1C1B1A] mt-1 block">
                  Cancelled &lt; 30 mins prior to service
                </span>
              </div>
            </div>

            {/* Submit Refund Form */}
            <div className="glass-panel p-5">
              <h3 className="text-sm font-bold text-[#1C1B1A] mb-3 font-hindi">
                {isEn ? 'Request Cancellation / Refund' : 'रद्द या रिफंड अनुरोध / Request Cancellation'}
              </h3>
              {refundSuccessMsg && (
                <div className="mb-3 p-2.5 bg-[#288D43]/10 text-[#288D43] border border-[#288D43]/30 rounded-xl text-xs font-bold">
                  {refundSuccessMsg}
                </div>
              )}
              <form onSubmit={handleRefundSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">
                    {isEn ? 'Select Booking' : 'अपॉइंटमेंट चुनें / Select Booking'}
                  </label>
                  <select
                    value={refundAptId}
                    onChange={(e) => setRefundAptId(e.target.value)}
                    className="w-full p-2 glass-input font-bold"
                  >
                    {myAppointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id} — {a.serviceName} (₹{a.finalPrice || a.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">
                    {isEn ? 'Reason for Cancellation' : 'कारण / Reason'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full p-2 glass-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-kitsch-primary px-4 py-2 text-xs"
                >
                  {isEn ? 'Submit Refund Claim' : 'अनुरोध भेजें / Submit Refund Claim'}
                </button>
              </form>
            </div>

            {/* Existing Refund Requests */}
            <div className="glass-panel p-5">
              <h3 className="text-xs font-mono font-bold text-[#5C564E] uppercase tracking-wider mb-3">
                {isEn ? 'Your Refund Claims History' : 'रिफंड इतिहास / Your Refund Claims History'}
              </h3>
              {myRefunds.length === 0 ? (
                <p className="text-xs text-[#5C564E] font-mono">No refund requests on record.</p>
              ) : (
                <div className="divide-y divide-[#1C1B1A]/10 text-xs">
                  {myRefunds.map((ref) => (
                    <div key={ref.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <strong className="text-[#1C1B1A]">{ref.id}</strong> — {ref.serviceName}
                        <span className="text-[10px] text-[#5C564E] block font-mono">
                          Reason: {ref.reason} • Tier: {ref.tier}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#288D43] font-mono">₹{ref.refundAmount}.00</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#F6EFE2] text-[#1C1B1A] font-bold border border-[#1C1B1A]/20 block mt-0.5">
                          {ref.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 9: NOTIFICATIONS ==================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Notifications & AI Voice Calls' : 'सूचनाएं एवं AI फोन कॉल / Notifications & AI Calls'}
              </h2>
              <p className="text-xs text-[#5C564E]">Live operational alerts regarding your bookings and queue position.</p>
            </div>
            <div className="glass-panel p-5 space-y-3 text-xs">
              <div className="p-3 bg-[#FFF9E6]/90 backdrop-blur-sm border border-[#F5B82E]/40 rounded-xl flex items-start gap-3 shadow-2xs">
                <div className="p-1.5 bg-[#D63927] text-white rounded-lg shadow-xs">
                  <PhoneCall size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1B1A]">
                    {isEn ? 'AI Voice Call Alert' : 'AI स्वचालित कॉल / AI Voice Call Alert'}
                  </h4>
                  <p className="text-[#1C1B1A] text-[11px] mt-0.5 font-serif italic">
                    {isEn
                      ? `“Hello Rahul Sharma! Your Executive Haircut appointment at Deluxe Salon is ready in 5 minutes. Please proceed to Station 1.”`
                      : `“नमस्ते Rahul Sharma! डीलक्स सैलून में आपकी Executive Haircut की बारी 5 मिनट में आने वाली है। कृपया Station 1 पर पधारें।”`}
                  </p>
                  <span className="text-[10px] text-[#5C564E] font-mono mt-1 block">10 minutes ago</span>
                </div>
              </div>
              <div className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/10 rounded-xl flex items-start gap-3">
                <div className="p-1.5 bg-[#288D43] text-white rounded-lg shadow-xs">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1C1B1A]">
                    {isEn ? 'Booking Confirmed' : 'बुकिंग पक्की हुई / Booking Confirmed'}
                  </h4>
                  <p className="text-[#5C564E] text-[11px] mt-0.5">
                    Your appointment for Executive Haircut & Styling has been confirmed with Suresh Kumar.
                  </p>
                  <span className="text-[10px] text-[#5C564E] font-mono mt-1 block">Today 09:20 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 10: FEEDBACK ==================== */}
        {activeTab === 'feedback' && (
          <div className="max-w-xl mx-auto glass-panel p-6 shadow-glass-lg">
            <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
              {isEn ? 'Share Salon Experience' : 'अपनी राय साझा करें / Share Salon Experience'}
            </h2>
            <p className="text-xs text-[#5C564E] mt-0.5 mb-4">
              Help us maintain exceptional service standards by rating your stylist.
            </p>

            {feedbackSubmitted ? (
              <div className="p-4 bg-[#288D43]/10 border border-[#288D43]/40 rounded-xl text-center text-[#288D43] text-xs">
                <CheckCircle2 size={24} className="mx-auto mb-1" />
                <h4 className="font-bold text-sm">
                  {isEn ? 'Thank you! Your feedback has been recorded.' : 'धन्यवाद! आपकी समीक्षा दर्ज कर ली गई है।'}
                </h4>
                <p className="text-[11px] text-[#1C1B1A] mt-1">Your review helps improve our styling services.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs font-medium text-[#1C1B1A]">
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">
                    {isEn ? 'Rating' : 'रेटिंग / Rating'}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`p-2 rounded-xl border flex items-center gap-1 font-bold transition-all ${
                          feedbackRating >= star
                            ? 'bg-[#F5B82E] border-[#1C1B1A]/20 text-[#1C1B1A] shadow-xs'
                            : 'bg-[#F6EFE2]/80 border-[#1C1B1A]/15 text-[#5C564E]'
                        }`}
                      >
                        <Star size={16} fill={feedbackRating >= star ? 'currentColor' : 'none'} />
                        <span>{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">
                    {isEn ? 'Your Comments' : 'आपकी टिप्पणी / Your Comments'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share details about your hair styling or treatment..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full p-2.5 glass-input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 btn-kitsch-primary text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> {isEn ? 'Submit Feedback' : 'राय भेजें / Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ==================== TAB 11: PROFILE ==================== */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto glass-panel p-6 shadow-glass-lg space-y-4">
            <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
              {isEn ? 'Profile & Membership' : 'ग्राहक प्रोफ़ाइल / Profile & Membership'}
            </h2>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 flex justify-between">
                <span className="text-[#5C564E]">Full Name:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.name}</span>
              </div>
              <div className="p-3 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 flex justify-between">
                <span className="text-[#5C564E]">Email Address:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.email}</span>
              </div>
              <div className="p-3 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 flex justify-between">
                <span className="text-[#5C564E]">Phone:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.phone || '+91 98901 23456'}</span>
              </div>
              <div className="p-3 bg-[#FFF9E6]/90 rounded-xl border border-[#F5B82E]/40 flex justify-between">
                <span className="text-[#5C564E]">VIP Membership:</span>
                <span className="font-bold text-[#D63927]">{activeCustomerPass || 'Standard Client'}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
