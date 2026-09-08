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
  AgeTier,
  PassTier,
  calculateServicePrice,
  getPassDiscountedPrice,
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

  // Category filter for service menu
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  // Membership Passes
  const [membershipPasses, setMembershipPasses] = useState<MembershipPass[]>(initialMembershipPasses)
  const [activeCustomerPass, setActiveCustomerPass] = useState<string>('Silver Pass (15% Off)')
  const [activePassTier, setActivePassTier] = useState<PassTier>('Silver')

  // Booking Form State
  const [bookServiceId, setBookServiceId] = useState(services[0]?.id || '')
  const [bookStaffId, setBookStaffId] = useState(staff[0]?.id || '')
  const [bookAgeTier, setBookAgeTier] = useState<AgeTier>('Adults')
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

  // Price Calculation with Age Tier, Stylist Preference Surcharge & Pass discount
  const selectedService = services.find((s) => s.id === bookServiceId) || services[0]
  const selectedStaff = staff.find((st) => st.id === bookStaffId) || staff[0]
  const stylistPreferenceFee = isPreferredStylistRequested && selectedStaff.preferenceFee ? selectedStaff.preferenceFee : 0

  const priceCalc = calculateServicePrice(selectedService, bookAgeTier, activePassTier)
  const baseServicePrice = priceCalc.basePrice
  const isAgeEligible = priceCalc.isEligible
  const ageIneligibleReason = priceCalc.ineligibleReason
  const membershipDiscount = priceCalc.discountAmount
  const finalCalculatedPrice = isAgeEligible ? priceCalc.finalPrice + stylistPreferenceFee : 0

  const handleSubscribePass = (passType: string, tier: PassTier) => {
    setActiveCustomerPass(passType)
    setActivePassTier(tier)
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAgeEligible) return

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
      ageTier: bookAgeTier,
      passTier: activePassTier,
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
      `Appointment ${newApt.id} confirmed for ${selectedService.name} (${bookAgeTier})! Total paid: ₹${finalCalculatedPrice}.00`
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

  const filteredServices = categoryFilter === 'All'
    ? services
    : services.filter((s) => s.category === categoryFilter)

  const CATEGORIES = ['All', 'Haircuts', 'Beard & Shave', 'Moustache', 'Facial & Skin', 'Signature Combos']

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F6EFE2] font-sans">
      {/* ================================================================
          CUSTOMER SIDEBAR NAVIGATION (Frosted Glass Sidebar)
          ================================================================ */}
      <aside className="w-full md:w-64 glass-panel p-4 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-4">
          {/* User Profile Card */}
          <div className="p-3 bg-[#FFFDF9]/80 backdrop-blur-md rounded-2xl border border-[#1C1B1A]/10 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D63927] text-white font-bold flex items-center justify-center text-sm border border-white/60 shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
              </div>
              <div className="overflow-hidden flex-1">
                <span className="text-[10px] font-mono font-bold text-[#D63927] uppercase tracking-wider block">
                  {isEn ? 'CUSTOMER' : t('roleCustomer')}
                </span>
                <h4 className="text-xs font-bold text-[#1C1B1A] truncate">{user?.name}</h4>
                <span className="text-[11px] font-mono text-[#5C564E] truncate block">
                  {activeCustomerPass}
                </span>
              </div>
            </div>

            {/* Language Switcher in Customer Sidebar */}
            <div className="mt-2.5 pt-2 border-t border-[#1C1B1A]/10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#5C564E]">{t('changeLanguage')}:</span>
              <LanguageSwitcher variant="glass" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <Scissors size={15} />
              <span>{isEn ? 'Overview' : 'डैशबोर्ड / Overview'}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'services'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <Sparkles size={15} />
              <span>{isEn ? 'Services Catalog' : 'सेवा सूची / Services'}</span>
            </button>

            <button
              onClick={() => setActiveTab('book')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'book'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <Calendar size={15} />
              <span>{isEn ? 'Instant Booking' : 'बुकिंग / Instant Book'}</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'appointments'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <Clock size={15} />
              <span>{isEn ? 'Appointments' : 'मेरी बुकिंग / Appointments'}</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'queue'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <Bell size={15} />
              <span>{isEn ? 'Live Queue Telemetry' : 'लाइव कतार / Live Queue'}</span>
            </button>

            <button
              onClick={() => setActiveTab('passes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'passes'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <Crown size={15} />
              <span>{isEn ? 'VIP Passes & Rates' : 'वीआईपी पास / VIP Passes'}</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'payments'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <CreditCard size={15} />
              <span>{isEn ? 'Invoices & Ledger' : 'भुगतान / Invoices'}</span>
            </button>

            <button
              onClick={() => setActiveTab('refunds')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'refunds'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <RotateCcw size={15} />
              <span>{isEn ? 'Refund Claims' : 'रिफंड / Refunds'}</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'notifications'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <PhoneCall size={15} />
              <span>{isEn ? 'Notifications & AI Calls' : 'सूचनाएं / AI Calls'}</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'feedback'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <MessageSquare size={15} />
              <span>{isEn ? 'Experience Feedback' : 'प्रतिक्रिया / Feedback'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'btn-kitsch-primary font-bold shadow-xs'
                  : 'text-[#1C1B1A] hover:bg-[#FFFDF9]/60'
              }`}
            >
              <User size={15} />
              <span>{isEn ? 'My Profile' : 'प्रोफ़ाइल / Profile'}</span>
            </button>
          </nav>
        </div>

        {/* Sign Out Button */}
        <div className="pt-4 border-t border-[#1C1B1A]/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#B81D1D] hover:bg-[#B81D1D]/10 rounded-xl transition-all"
          >
            <LogOut size={15} />
            <span>{isEn ? 'Sign Out' : 'लॉग आउट / Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* ================================================================
          MAIN CONTENT AREA (Glassmorphic Container)
          ================================================================ */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Banner with AI Quick Action */}
            <div className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-[#F5B82E]/40">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D63927] bg-[#FFF9E6] px-2 py-0.5 rounded border border-[#1C1B1A]/10">
                  {isEn ? 'WELCOME TO DELUXE SALON' : 'डीलक्स उस्ताद सैलून • LUXURY GROOMING'}
                </span>
                <h1 className="text-2xl font-black text-[#1C1B1A] font-hindi tracking-tight">
                  {isEn ? `Welcome back, ${customerName}!` : `नमस्ते, ${customerName}!`}
                </h1>
                <p className="text-xs text-[#5C564E] max-w-xl">
                  {isEn
                    ? 'Explore our full age-tiered service menu (Kids, Adults, Seniors), check live queue positions, or unlock up to 35% savings with VIP passes.'
                    : '16 विशेष सेवाओं की सूची, बच्चों व वरिष्ठ नागरिकों के लिए विशेष दरें एवं 35% तक वीआईपी पास छूट का लाभ उठाएं।'}
                </p>
              </div>

              <div className="flex gap-2.5 shrink-0">
                <button
                  onClick={onOpenAiChat}
                  className="btn-kitsch-haldi text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Bot size={15} /> {isEn ? 'Deluxe AI Concierge' : 'AI से पूछें'}
                </button>
                <button
                  onClick={() => setActiveTab('book')}
                  className="btn-kitsch-primary text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus size={15} /> {isEn ? 'Book Appointment' : 'नई बुकिंग'}
                </button>
              </div>
            </div>

            {/* Live Telemetry / PCO Queue Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#F5B82E] text-[#1C1B1A] border border-white flex items-center justify-center font-black text-lg shadow-xs">
                  {myQueueItem ? myQueueItem.token : 'T-01'}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#5C564E] uppercase tracking-wider block">
                    {isEn ? 'My Queue Token' : 'कतार टोकन / Token'}
                  </span>
                  <strong className="text-sm text-[#1C1B1A] block">
                    {myQueueItem ? myQueueItem.status : 'No Active Token'}
                  </strong>
                  <span className="text-[11px] text-[#D63927] font-mono font-bold">
                    {myQueueItem ? `ETA: ~${myQueueItem.estimatedWaitMinutes}m` : 'Book to get digital token'}
                  </span>
                </div>
              </div>

              <div className="glass-card p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#1E75B8] text-white border border-white flex items-center justify-center shadow-xs">
                  <Crown size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#5C564E] uppercase tracking-wider block">
                    {isEn ? 'Active Membership' : 'सक्रिय पास / Pass'}
                  </span>
                  <strong className="text-sm text-[#1C1B1A] block">{activeCustomerPass}</strong>
                  <span className="text-[11px] text-[#288D43] font-mono font-bold">
                    {activePassTier === 'None' ? 'Standard Rates' : `${activePassTier} Pass (${priceCalc.discountPercent}% Off)`}
                  </span>
                </div>
              </div>

              <div className="glass-card p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#288D43] text-white border border-white flex items-center justify-center shadow-xs">
                  <Scissors size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#5C564E] uppercase tracking-wider block">
                    {isEn ? 'Services Catalog' : 'कुल सेवाएं / Services'}
                  </span>
                  <strong className="text-sm text-[#1C1B1A] block">16 Handcrafted Services</strong>
                  <span className="text-[11px] text-[#5C564E] font-mono">
                    Hair, Beard, Moustache, Skin & Combos
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Appointments Overview */}
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1C1B1A]/10">
                <h3 className="font-bold text-sm text-[#1C1B1A] font-hindi">
                  {isEn ? 'Recent Appointments & Status' : 'हालिया बुकिंग स्थिति'}
                </h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs font-bold text-[#D63927] hover:underline flex items-center gap-1"
                >
                  {isEn ? 'View All' : 'सभी देखें'} <ChevronRight size={13} />
                </button>
              </div>

              {myAppointments.length === 0 ? (
                <p className="text-xs text-[#5C564E] italic py-4">No appointments found. Book your first appointment!</p>
              ) : (
                <div className="space-y-2.5">
                  {myAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 bg-[#FFFDF9]/70 rounded-xl border border-[#1C1B1A]/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#1C1B1A] bg-[#F6EFE2] px-1.5 py-0.5 rounded border border-[#1C1B1A]/15">{apt.id}</span>
                          <strong className="text-[#1C1B1A]">{apt.serviceName}</strong>
                          {apt.ageTier && (
                            <span className="text-[10px] font-mono font-bold text-[#1E75B8] bg-[#1E75B8]/10 px-1.5 py-0.2 rounded border border-[#1E75B8]/20">
                              {apt.ageTier}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#5C564E] font-mono block mt-0.5">
                          📅 {apt.date} at {apt.time} • Stylist: {apt.staffName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#D63927] block text-sm">
                          ₹{apt.finalPrice || apt.price}.00
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF9E6] text-[#1C1B1A] font-bold border border-[#1C1B1A]/15">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SERVICES MENU & COMPLETE PRICING MATRIX ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-5">
            <div className="glass-panel p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D63927] bg-[#F6EFE2] px-2 py-0.5 rounded border border-[#1C1B1A]/15">
                  {isEn ? 'OFFICIAL PRICING MATRIX' : 'आधिकारिक दर तालिका'}
                </span>
                <h2 className="text-xl font-bold text-[#1C1B1A] font-hindi mt-1">
                  {isEn ? 'Salon Services & Age-Tier Catalog' : 'सैलून सेवाएं एवं आयु-आधारित दर सूची'}
                </h2>
                <p className="text-xs text-[#5C564E] mt-0.5">
                  Transparent age-tiered pricing: Kids (Under 12), Adults (13–59), and Seniors (60+ courtesy discount).
                </p>
              </div>
              <button
                onClick={onOpenAiChat}
                className="btn-kitsch-haldi text-xs flex items-center gap-1.5 shrink-0"
              >
                <Bot size={14} /> {isEn ? 'Ask AI Concierge' : 'AI से सलाह लें'}
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    categoryFilter === cat
                      ? 'bg-[#D63927] text-white border-[#D63927] shadow-xs'
                      : 'bg-[#FFFDF9]/80 text-[#1C1B1A] border-[#1C1B1A]/15 hover:bg-[#F5B82E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Service Cards Grid with Age-Tier Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((srv) => {
                const silverPrice = getPassDiscountedPrice(srv.adultPrice || srv.price, 'Silver')
                const goldPrice = getPassDiscountedPrice(srv.adultPrice || srv.price, 'Gold')
                const shahiPrice = getPassDiscountedPrice(srv.adultPrice || srv.price, 'Shahi Ustaad')

                return (
                  <div
                    key={srv.id}
                    className="glass-card p-5 flex flex-col justify-between space-y-4 hover:shadow-glass-lg transition-all"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F6EFE2] text-[#1C1B1A] rounded border border-[#1C1B1A]/15">
                          {srv.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[#5C564E] font-mono">
                          <Clock size={13} className="text-[#D63927]" />
                          <span>{srv.durationMinutes} mins</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-[#1C1B1A] text-base">{srv.name}</h3>
                      <p className="text-xs text-[#5C564E] mt-1 leading-relaxed">{srv.description}</p>

                      {/* Age-Tier Rate Cards */}
                      <div className="mt-3.5 pt-3 border-t border-[#1C1B1A]/10 grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-[#F6EFE2]/70 border border-[#1C1B1A]/10">
                          <span className="text-[9px] font-mono font-bold text-[#5C564E] block uppercase">
                            Kids (&lt;12)
                          </span>
                          <strong className="text-xs font-mono font-bold text-[#1C1B1A]">
                            {srv.kidsPrice ? `₹${srv.kidsPrice}` : '—'}
                          </strong>
                        </div>
                        <div className="p-2 rounded-lg bg-[#FFF9E6] border border-[#F5B82E]/40">
                          <span className="text-[9px] font-mono font-bold text-[#D63927] block uppercase">
                            Adults (13–59)
                          </span>
                          <strong className="text-sm font-mono font-bold text-[#D63927]">
                            ₹{srv.adultPrice || srv.price}
                          </strong>
                        </div>
                        <div className="p-2 rounded-lg bg-[#F6EFE2]/70 border border-[#1C1B1A]/10">
                          <span className="text-[9px] font-mono font-bold text-[#5C564E] block uppercase">
                            Seniors (60+)
                          </span>
                          <strong className="text-xs font-mono font-bold text-[#1C1B1A]">
                            {srv.seniorPrice ? `₹${srv.seniorPrice}` : '—'}
                          </strong>
                        </div>
                      </div>

                      {/* VIP Pass Discounted Preview Tag */}
                      <div className="mt-3 p-2 bg-[#FFFDF9]/90 rounded-lg border border-[#1C1B1A]/10 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#5C564E] flex items-center gap-1">
                          <Crown size={12} className="text-[#F5B82E]" /> Pass Rates:
                        </span>
                        <div className="flex gap-2">
                          <span className="text-[#5C564E]">Sil: <b className="text-[#1C1B1A]">₹{silverPrice}</b></span>
                          <span className="text-[#5C564E]">Gld: <b className="text-[#1C1B1A]">₹{goldPrice}</b></span>
                          <span className="text-[#D63927] font-bold">Shahi: <b>₹{shahiPrice}</b></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1C1B1A]/10 flex items-center justify-between">
                      <span className="text-[10px] text-[#5C564E] font-mono">Buffer: {srv.bufferMinutes}m</span>
                      <button
                        onClick={() => {
                          setBookServiceId(srv.id)
                          setActiveTab('book')
                        }}
                        className="btn-kitsch-primary px-4 py-1.5 text-xs flex items-center gap-1 font-bold"
                      >
                        {isEn ? 'Book Now' : 'बुक करें'} <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: BOOK APPOINTMENT WITH AGE TIER & PASS PRICING ==================== */}
        {activeTab === 'book' && (
          <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 shadow-glass-lg">
            <div className="mb-5 pb-3 border-b border-[#1C1B1A]/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#D63927] uppercase tracking-wider bg-[#F6EFE2] px-2 py-0.5 rounded border border-[#1C1B1A]/15">
                  {isEn ? 'INSTANT BOOKING' : 'तुरंत बुकिंग • INSTANT BOOKING'}
                </span>
                <h2 className="text-xl font-bold text-[#1C1B1A] font-hindi mt-1">
                  {isEn ? 'Schedule Salon Appointment' : 'अपॉइंटमेंट बुक करें'}
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#F5B82E] text-[#1C1B1A] border border-[#1C1B1A]/20 shadow-2xs">
                {activeCustomerPass}
              </span>
            </div>

            {bookSuccessMsg && (
              <div className="mb-4 p-3.5 bg-[#288D43]/10 border border-[#288D43]/40 rounded-xl text-[#288D43] text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} />
                <span>{bookSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs font-medium text-[#1C1B1A]">
              {/* Service Selection */}
              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">
                  {isEn ? 'Select Service (16 Available)' : 'सेवा चुनें / Select Service'}
                </label>
                <select
                  value={bookServiceId}
                  onChange={(e) => setBookServiceId(e.target.value)}
                  className="w-full p-2.5 glass-input font-bold"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category}) — Base Adult ₹{s.adultPrice || s.price} • {s.durationMinutes} mins
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Category Selector */}
              <div>
                <label className="block text-[#1C1B1A] mb-1.5 font-bold">
                  {isEn ? 'Client Age Category' : 'ग्राहक आयु वर्ग / Age Category'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookAgeTier('Kids')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      bookAgeTier === 'Kids'
                        ? 'border-[#D63927] bg-[#D63927] text-white font-bold shadow-xs'
                        : 'border-[#1C1B1A]/15 bg-[#FFFDF9]/80 text-[#1C1B1A] hover:bg-[#F6EFE2]'
                    }`}
                  >
                    <span className="text-xs font-bold">🧒 Kids (&lt;12)</span>
                    <span className="text-[10px] opacity-90 font-mono">
                      {selectedService.kidsPrice ? `₹${selectedService.kidsPrice}` : 'Excluded'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookAgeTier('Adults')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      bookAgeTier === 'Adults'
                        ? 'border-[#D63927] bg-[#D63927] text-white font-bold shadow-xs'
                        : 'border-[#1C1B1A]/15 bg-[#FFFDF9]/80 text-[#1C1B1A] hover:bg-[#F6EFE2]'
                    }`}
                  >
                    <span className="text-xs font-bold">👨 Adults (13–59)</span>
                    <span className="text-[10px] opacity-90 font-mono">
                      ₹{selectedService.adultPrice || selectedService.price}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookAgeTier('Seniors')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      bookAgeTier === 'Seniors'
                        ? 'border-[#D63927] bg-[#D63927] text-white font-bold shadow-xs'
                        : 'border-[#1C1B1A]/15 bg-[#FFFDF9]/80 text-[#1C1B1A] hover:bg-[#F6EFE2]'
                    }`}
                  >
                    <span className="text-xs font-bold">👴 Seniors (60+)</span>
                    <span className="text-[10px] opacity-90 font-mono">
                      {selectedService.seniorPrice ? `₹${selectedService.seniorPrice}` : 'N/A'}
                    </span>
                  </button>
                </div>

                {!isAgeEligible && (
                  <div className="mt-2 p-2.5 bg-[#B81D1D]/10 border border-[#B81D1D]/30 rounded-xl text-[#B81D1D] text-xs flex items-center gap-2 font-bold">
                    <AlertCircle size={15} />
                    <span>{ageIneligibleReason}</span>
                  </div>
                )}
              </div>

              {/* Stylist Selector */}
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

              {/* Master Stylist Preference Checkbox */}
              {selectedStaff.isPreferredMaster && (
                <div className="p-3 bg-[#FFF9E6]/85 backdrop-blur-sm border border-[#F5B82E]/40 rounded-xl flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="preferredStylist"
                    checked={isPreferredStylistRequested}
                    onChange={(e) => setIsPreferredStylistRequested(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#D63927] accent-[#D63927]"
                  />
                  <label htmlFor="preferredStylist" className="text-xs text-[#1C1B1A] cursor-pointer">
                    <span className="font-bold block">Lock Dedicated Master Stylist ({selectedStaff.name})</span>
                    <span className="text-[11px] text-[#5C564E] block">
                      AI guarantees 1-on-1 priority chair reservation (+₹50 fee).
                    </span>
                  </label>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">{isEn ? 'Date' : 'तारीख'}</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full p-2.5 glass-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#1C1B1A] mb-1 font-bold">{isEn ? 'Time Slot' : 'समय'}</label>
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

              {/* Payment Mode */}
              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">
                  {isEn ? 'Payment Option' : 'भुगतान विकल्प'}
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

              {/* Itemized Price Breakdown */}
              <div className="p-4 bg-[#F6EFE2]/75 backdrop-blur-sm rounded-xl border border-[#1C1B1A]/15 text-xs space-y-2 font-mono shadow-xs">
                <div className="flex justify-between text-[#5C564E]">
                  <span>{selectedService.name} ({bookAgeTier} Rate):</span>
                  <span>{isAgeEligible ? `₹${baseServicePrice}.00` : 'Not Eligible'}</span>
                </div>
                {stylistPreferenceFee > 0 && (
                  <div className="flex justify-between text-[#B81D1D] font-bold">
                    <span>Master Stylist Custom Request Fee:</span>
                    <span>+₹{stylistPreferenceFee}.00</span>
                  </div>
                )}
                {membershipDiscount > 0 && (
                  <div className="flex justify-between text-[#288D43] font-bold">
                    <span>{activePassTier} Pass Discount ({priceCalc.discountPercent}% Off):</span>
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
                disabled={!isAgeEligible}
                className={`w-full py-3 text-sm font-bold transition-all ${
                  isAgeEligible ? 'btn-kitsch-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed rounded-xl'
                }`}
              >
                {isAgeEligible
                  ? `Confirm & Pay ₹${finalCalculatedPrice}.00`
                  : 'Selected Service Ineligible for this Age Tier'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== TAB 4: APPOINTMENTS ==================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'My Bookings History' : 'मेरी बुकिंग / Appointments'}
              </h2>
              <p className="text-xs text-[#5C564E]">Active and historical appointments with status tracking.</p>
            </div>
            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {myAppointments.map((apt) => (
                <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1C1B1A] bg-[#F6EFE2] px-1.5 py-0.5 rounded border border-[#1C1B1A]/15">{apt.id}</span>
                      <strong className="text-[#1C1B1A]">{apt.serviceName}</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFF9E6] text-[#1C1B1A] border border-[#1C1B1A]/15">
                        {apt.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C564E] block mt-0.5 font-mono">
                      📅 {apt.date} at {apt.time} • Stylist: {apt.staffName}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#D63927] text-base">₹{apt.finalPrice || apt.price}.00</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: QUEUE ==================== */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Live Queue Telemetry & Waiting List' : 'लाइव कतार स्थिति / Live Queue'}
              </h2>
              <p className="text-xs text-[#5C564E]">Track your real-time position, stylist station, and estimated wait minutes.</p>
            </div>
            <div className="glass-panel p-5 space-y-3 text-xs">
              {queue.map((q) => (
                <div key={q.token} className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-mono font-bold text-sm px-2 py-0.5 bg-[#F5B82E] border border-[#1C1B1A]/20 rounded mr-2 text-[#1C1B1A]">
                      {q.token}
                    </span>
                    <strong className="text-[#1C1B1A]">{q.customerName}</strong> — {q.serviceName}
                    <span className="text-[#5C564E] block text-[11px] font-mono">
                      Stylist: {q.staffName} ({q.assignedStation})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/90 border border-[#1C1B1A]/15 text-[#1C1B1A]">
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: VIP MEMBERSHIP PASSES & RATE MATRIX ==================== */}
        {activeTab === 'passes' && (
          <div className="space-y-6">
            <div className="glass-panel p-5">
              <div className="flex items-center gap-2">
                <Crown size={22} className="text-[#F5B82E]" />
                <h2 className="text-xl font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'VIP Membership Pass Program' : 'वीआईपी सदस्यता योजना'}
                </h2>
              </div>
              <p className="text-xs text-[#5C564E] mt-1">
                Enjoy flat discounts across all haircuts, grooming, and luxury spa treatments with priority queue allocation.
              </p>
            </div>

            {/* Active Subscription Status Banner */}
            {activeCustomerPass && (
              <div className="p-4 bg-[#FFF9E6]/90 backdrop-blur-md border border-[#F5B82E]/50 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5B82E] text-[#1C1B1A] border border-white flex items-center justify-center font-bold shadow-xs">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#D63927] uppercase tracking-wider block">
                      {isEn ? 'ACTIVE SUBSCRIPTION' : 'सक्रिय सदस्यता'}
                    </span>
                    <h4 className="text-sm font-bold text-[#1C1B1A]">{activeCustomerPass}</h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#288D43] bg-[#288D43]/10 px-3 py-1 rounded-full border border-[#288D43]/30">
                  {activePassTier !== 'None' ? `${activePassTier} Benefits Active` : 'Standard User'}
                </span>
              </div>
            )}

            {/* 3 Pass Tiers: Silver (15%), Gold (25%), Shahi Ustaad (35%) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {membershipPasses.map((pass) => (
                <div
                  key={pass.id}
                  className={`glass-card p-6 flex flex-col justify-between relative overflow-hidden ${
                    pass.tierName === 'Shahi Ustaad' ? 'bg-[#FFF9E6]/90 border-[#F5B82E]/70 shadow-glass-lg' : ''
                  }`}
                >
                  {pass.status === 'Popular' && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded bg-[#D63927] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                      MAX SAVINGS
                    </div>
                  )}
                  {pass.status === 'Featured' && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded bg-[#1E75B8] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                      POPULAR
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-mono font-bold text-[#D63927] uppercase tracking-wider block mb-1">
                      {pass.type}
                    </span>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl font-bold text-[#1C1B1A] font-mono">₹{pass.price}</span>
                      <span className="text-xs text-[#5C564E] font-mono">{pass.billingPeriod}</span>
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
                    onClick={() => handleSubscribePass(pass.type, pass.tierName)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      activePassTier === pass.tierName
                        ? 'bg-[#288D43] text-white cursor-default'
                        : pass.tierName === 'Shahi Ustaad'
                        ? 'btn-kitsch-haldi'
                        : 'btn-kitsch-primary'
                    }`}
                  >
                    {activePassTier === pass.tierName
                      ? '✓ Currently Active'
                      : `Activate ${pass.type}`}
                  </button>
                </div>
              ))}
            </div>

            {/* Pass Holders Live Rate Comparison Matrix Table */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1C1B1A]/10">
                <div>
                  <h3 className="font-bold text-base text-[#1C1B1A] font-hindi">
                    {isEn ? 'Pass Holder Rate Comparison Matrix' : 'पास धारक दर तुलना तालिका'}
                  </h3>
                  <p className="text-xs text-[#5C564E]">
                    See exact discounted pricing across our signature grooming & facial services.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#288D43] bg-[#288D43]/10 px-2 py-1 rounded border border-[#288D43]/30">
                  INSTANT SAVINGS
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-[#F6EFE2] border-b border-[#1C1B1A]/15 text-[#1C1B1A]">
                      <th className="p-3 font-bold">Service Category / Name</th>
                      <th className="p-3 font-bold">Regular Rate</th>
                      <th className="p-3 font-bold text-[#1E75B8]">Silver (15% Off)</th>
                      <th className="p-3 font-bold text-[#288D43]">Gold (25% Off)</th>
                      <th className="p-3 font-bold text-[#D63927]">Shahi Ustaad (35% Off)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1B1A]/10 text-[#1C1B1A]">
                    <tr className="hover:bg-[#FFFDF9]/60">
                      <td className="p-3 font-sans font-bold">Classic Regular Cut</td>
                      <td className="p-3">₹150</td>
                      <td className="p-3 font-bold text-[#1E75B8]">₹127</td>
                      <td className="p-3 font-bold text-[#288D43]">₹112</td>
                      <td className="p-3 font-black text-[#D63927]">₹97</td>
                    </tr>
                    <tr className="hover:bg-[#FFFDF9]/60">
                      <td className="p-3 font-sans font-bold">Ustaad Fade / Modern Crop</td>
                      <td className="p-3">₹250</td>
                      <td className="p-3 font-bold text-[#1E75B8]">₹212</td>
                      <td className="p-3 font-bold text-[#288D43]">₹187</td>
                      <td className="p-3 font-black text-[#D63927]">₹162</td>
                    </tr>
                    <tr className="hover:bg-[#FFFDF9]/60">
                      <td className="p-3 font-sans font-bold">Royal Hot Towel Shave</td>
                      <td className="p-3">₹160</td>
                      <td className="p-3 font-bold text-[#1E75B8]">₹136</td>
                      <td className="p-3 font-bold text-[#288D43]">₹120</td>
                      <td className="p-3 font-black text-[#D63927]">₹104</td>
                    </tr>
                    <tr className="hover:bg-[#FFFDF9]/60">
                      <td className="p-3 font-sans font-bold">Designer Beard Styling</td>
                      <td className="p-3">₹180</td>
                      <td className="p-3 font-bold text-[#1E75B8]">₹153</td>
                      <td className="p-3 font-bold text-[#288D43]">₹135</td>
                      <td className="p-3 font-black text-[#D63927]">₹117</td>
                    </tr>
                    <tr className="hover:bg-[#FFFDF9]/60">
                      <td className="p-3 font-sans font-bold">Herbal Glow Facial</td>
                      <td className="p-3">₹450</td>
                      <td className="p-3 font-bold text-[#1E75B8]">₹382</td>
                      <td className="p-3 font-bold text-[#288D43]">₹337</td>
                      <td className="p-3 font-black text-[#D63927]">₹292</td>
                    </tr>
                    <tr className="hover:bg-[#FFFDF9]/60 bg-[#FFF9E6]/50">
                      <td className="p-3 font-sans font-bold">The Ustaad Royal Combo</td>
                      <td className="p-3">₹850</td>
                      <td className="p-3 font-bold text-[#1E75B8]">₹722</td>
                      <td className="p-3 font-bold text-[#288D43]">₹637</td>
                      <td className="p-3 font-black text-[#D63927]">₹552</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1C1B1A] bg-[#F6EFE2] px-1.5 py-0.5 rounded border border-[#1C1B1A]/15">{apt.id}</span>
                      <strong className="text-[#1C1B1A]">{apt.serviceName}</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#288D43]/10 text-[#288D43] font-bold border border-[#288D43]/30">
                        {apt.paymentStatus}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C564E] font-mono block mt-1">
                      Stylist: {apt.staffName} • {apt.date} • Mode: {apt.paymentMethod || 'UPI'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-base text-[#D63927]">
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
                          ageTier: apt.ageTier,
                          passTier: apt.passTier,
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
                      ? `“Hello Rahul Sharma! Your appointment for Classic Regular Cut at Deluxe Salon is ready in 5 minutes. Please proceed to Station 1.”`
                      : `“नमस्ते Rahul Sharma! डीलक्स सैलून में आपकी Classic Regular Cut की बारी 5 मिनट में आने वाली है। कृपया Station 1 पर पधारें।”`}
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
                    Your appointment for Classic Regular Cut has been confirmed with Suresh Kumar.
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
