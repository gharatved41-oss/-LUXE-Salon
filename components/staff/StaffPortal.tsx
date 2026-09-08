'use client'

import React, { useState } from 'react'
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  UserCheck,
  UserPlus,
  Clock,
  Search,
  BookOpen,
  CreditCard,
  RotateCcw,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Receipt,
  Printer,
  ChevronRight,
  ShieldCheck,
  Activity,
  Filter,
  Phone,
  PhoneCall,
  Volume2,
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
  StaffAvailability,
  AgeTier,
  PassTier,
  calculateServicePrice,
  getPassDiscountedPrice,
} from '@/lib/types'

interface StaffPortalProps {
  services: ServiceItem[]
  staff: StaffMember[]
  appointments: Appointment[]
  queue: QueueItem[]
  refunds: RefundRequest[]
  onUpdateAppointmentStatus: (aptId: string, status: Appointment['status']) => void
  onAddWalkIn: (walkIn: QueueItem) => void
  onUpdateQueueStatus: (token: string, status: QueueItem['status']) => void
  onUpdateStaffStatus: (staffId: string, status: StaffAvailability) => void
  onOpenReceipt: (receipt: ReceiptData) => void
  onProcessPayment: (aptId: string, method: 'Cash' | 'UPI' | 'Card', phone?: string) => void
  onTriggerAiVoiceCall: (item: QueueItem) => void
}

export default function StaffPortal({
  services,
  staff,
  appointments,
  queue,
  refunds,
  onUpdateAppointmentStatus,
  onAddWalkIn,
  onUpdateQueueStatus,
  onUpdateStaffStatus,
  onOpenReceipt,
  onProcessPayment,
  onTriggerAiVoiceCall,
}: StaffPortalProps) {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'appointments'
    | 'checkin'
    | 'walkins'
    | 'queue'
    | 'customers'
    | 'bookings'
    | 'payments'
    | 'refunds'
    | 'availability'
    | 'profile'
  >('dashboard')

  // Walk-in form states
  const [walkInName, setWalkInName] = useState('')
  const [walkInPhone, setWalkInPhone] = useState('')
  const [walkInService, setWalkInService] = useState(services[0]?.name || '')
  const [walkInStaff, setWalkInStaff] = useState(staff[0]?.name || '')
  const [walkInAgeTier, setWalkInAgeTier] = useState<AgeTier>('Adults')
  const [walkInPassTier, setWalkInPassTier] = useState<PassTier>('None')
  const [walkInSuccessMsg, setWalkInSuccessMsg] = useState('')
  const [walkInErrorMsg, setWalkInErrorMsg] = useState('')

  // Search state for check-in / customer search
  const [searchQuery, setSearchQuery] = useState('')

  // Checkout phone intake state
  const [checkoutPhoneInput, setCheckoutPhoneInput] = useState<Record<string, string>>({})

  // Current staff member identification
  const currentStaff =
    staff.find(
      (s) =>
        s.name.toLowerCase() === user?.name?.toLowerCase() ||
        s.phone === user?.phone
    ) || staff[0]

  const selectedWalkInSrv = services.find((s) => s.name === walkInService) || services[0]
  const walkInBasePrice = selectedWalkInSrv ? calculateServicePrice(selectedWalkInSrv, walkInAgeTier) : 0
  const walkInFinalPrice = walkInBasePrice !== null ? getPassDiscountedPrice(walkInBasePrice, walkInPassTier) : null

  // Handlers
  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!walkInName.trim() || !walkInPhone.trim()) return
    if (walkInBasePrice === null || walkInFinalPrice === null) {
      setWalkInErrorMsg(`Safety Alert: "${walkInService}" is restricted/excluded for ${walkInAgeTier}.`)
      return
    }

    const duration = selectedWalkInSrv?.durationMinutes || 20
    const newWalkIn: QueueItem = {
      token: `W-${Math.floor(10 + Math.random() * 90)}`,
      customerName: walkInName,
      customerPhone: walkInPhone,
      serviceName: walkInService,
      staffName: walkInStaff,
      assignedStation: staff.find((s) => s.name === walkInStaff)?.station || 'Station 1',
      estimatedWaitMinutes: duration + 5,
      waitBreakdown: `Calculated by AI (${duration}m service + 5m buffer)`,
      status: 'Waiting',
      isWalkIn: true,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ageTier: walkInAgeTier,
      passTier: walkInPassTier,
      calculatedPrice: walkInFinalPrice,
    }

    onAddWalkIn(newWalkIn)
    setWalkInSuccessMsg(`Token ${newWalkIn.token} issued to ${newWalkIn.customerName} (₹${walkInFinalPrice} • ${walkInAgeTier} • ${walkInPassTier !== 'None' ? walkInPassTier + ' Pass' : 'Regular'})! AI wait: ~${newWalkIn.estimatedWaitMinutes}m`)
    setWalkInName('')
    setWalkInPhone('')
    setWalkInErrorMsg('')
    setTimeout(() => setWalkInSuccessMsg(''), 4000)
  }

  // Filtered Appointments for Quick Check-In
  const filteredAppointments = appointments.filter(
    (a) =>
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerPhone.includes(searchQuery) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F6EFE2] font-sans">
      {/* ================================================================
          STAFF SIDEBAR NAVIGATION (Frosted Glass Sidebar)
          ================================================================ */}
      <aside className="w-full md:w-64 bg-[#FFFDF9]/80 backdrop-blur-xl border-r border-[#1C1B1A]/12 p-4 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-5">
          {/* Staff Member Frosted Pill */}
          <div className="p-3 bg-[#FFF9E6]/85 backdrop-blur-md border border-[#F5B82E]/40 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#288D43] text-white font-bold flex items-center justify-center text-sm border border-white/40 shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="overflow-hidden flex-1">
                <span className="text-[10px] font-mono font-bold text-[#288D43] uppercase tracking-wider block">
                  {t('roleStaff')} {t('portalSuffix')}
                </span>
                <h4 className="text-xs font-bold text-[#1C1B1A] truncate">{user?.name}</h4>
                <span className="text-[11px] font-mono text-[#5C564E] truncate block">
                  {currentStaff?.roleTitle} • {currentStaff?.station}
                </span>
              </div>
            </div>

            {/* Language Switcher in Staff Sidebar */}
            <div className="mt-2.5 pt-2 border-t border-[#1C1B1A]/10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#5C564E]">{t('changeLanguage')}:</span>
              <LanguageSwitcher variant="glass" />
            </div>
          </div>

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
              <LayoutDashboard size={15} />
              <span>{isEn ? 'Station Dashboard' : t('staffNavStations')}</span>
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
              <span>{isEn ? "Today's Appointments" : 'आज की बुकिंग / Appointments'}</span>
            </button>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'checkin'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <UserCheck size={15} />
              <span>{isEn ? 'Fast Check-In' : 'ग्राहक हाजिरी / Fast Check-In'}</span>
            </button>

            <button
              onClick={() => setActiveTab('walkins')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'walkins'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <UserPlus size={15} />
              <span>{isEn ? 'Walk-In Intake' : t('staffNavWalkIn')}</span>
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
              <span>{isEn ? 'Live Queue' : t('staffNavQueue')}</span>
              <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] bg-[#D63927] text-white font-mono font-bold">
                {queue.filter((q) => q.status !== 'Completed').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'customers'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Search size={15} />
              <span>{isEn ? 'Search Records' : 'ग्राहक खोज / Search Records'}</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'bookings'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <BookOpen size={15} />
              <span>{isEn ? 'Station Schedule' : 'कुर्सी आवंटन / Station Schedule'}</span>
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
              <span>{isEn ? 'POS Billing' : 'बिलिंग & पीओएस / POS Billing'}</span>
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
              <span>{isEn ? 'Refund Tickets' : 'रिफंड टिकट / Refund Tickets'}</span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                activeTab === 'availability'
                  ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                  : 'bg-transparent text-[#1C1B1A] border-transparent hover:bg-[#FFFDF9]/70 hover:border-[#1C1B1A]/15'
              }`}
            >
              <Activity size={15} />
              <span>{isEn ? 'Shift Availability' : 'शिफ्ट उपस्थिति / Availability'}</span>
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
              <span>{isEn ? 'Profile' : 'प्रोफ़ाइल / Profile'}</span>
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
            <span>{isEn ? 'Sign Out' : 'लॉग आउट / Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* ================================================================
          MAIN CONTENT AREA
          ================================================================ */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl">
        {/* ==================== TAB 1: DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4">
              <div>
                <h2 className="text-xl font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'Stylist Floor Console' : 'कारीगर नियंत्रण कंसोल / Stylist Floor Console'}
                </h2>
                <p className="text-xs text-[#5C564E]">
                  Real-time operational dashboard for chair management & appointments.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1C1B1A]">
                  {isEn ? 'Status:' : 'आपकी स्थिति / Status:'}
                </span>
                <select
                  value={currentStaff.status}
                  onChange={(e) => onUpdateStaffStatus(currentStaff.id, e.target.value as StaffAvailability)}
                  className="p-2 bg-[#FFF9E6]/90 border border-[#1C1B1A]/20 rounded-xl text-xs font-mono font-bold text-[#1C1B1A] outline-none shadow-xs"
                >
                  <option value="Available">{isEn ? '🟢 Available' : '🟢 Available (उपलब्ध)'}</option>
                  <option value="Busy">{isEn ? '🔵 Busy' : '🔵 Busy (कुर्सी पर व्यस्त)'}</option>
                  <option value="On Break">{isEn ? '🟡 On Break' : '🟡 On Break (चाय अवकाश)'}</option>
                  <option value="On Leave">{isEn ? '⚪ On Leave' : '⚪ On Leave (छुट्टी पर)'}</option>
                </select>
              </div>
            </div>

            {/* Quick Metrics (Glass Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'STATION' : 'कुर्सी / STATION'}
                </span>
                <strong className="block text-lg font-bold text-[#1C1B1A] mt-1 font-mono">{currentStaff.station}</strong>
              </div>
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'COMPLETED TODAY' : 'आज संपन्न / COMPLETED'}
                </span>
                <strong className="block text-lg font-bold text-[#288D43] mt-1 font-mono">
                  {currentStaff.totalCutsToday} Clients
                </strong>
              </div>
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'IN QUEUE' : 'प्रतीक्षारत / IN QUEUE'}
                </span>
                <strong className="block text-lg font-bold text-[#D63927] mt-1 font-mono">
                  {queue.filter((q) => q.status === 'Waiting').length} Waiting
                </strong>
              </div>
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'STYLIST RATING' : 'कारीगर रेटिंग / RATING'}
                </span>
                <strong className="block text-lg font-bold text-[#1C1B1A] mt-1 font-mono">
                  ⭐ {currentStaff.rating} / 5.0
                </strong>
              </div>
            </div>

            {/* Live Queue Operations Box */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1C1B1A]/10">
                <h3 className="text-sm font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'Floor Action Board' : 'सैलून कतार एक्शन बोर्ड / Floor Action Board'}
                </h3>
                <button
                  onClick={() => setActiveTab('walkins')}
                  className="btn-kitsch-haldi text-xs flex items-center gap-1"
                >
                  <Plus size={13} /> {isEn ? 'Add Walk-In' : 'नया वॉक-इन जोड़ें'}
                </button>
              </div>

              <div className="divide-y divide-[#1C1B1A]/10">
                {queue.map((item) => (
                  <div key={item.token} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#F5B82E] border border-[#1C1B1A]/20 text-[#1C1B1A] shadow-2xs">
                          {item.token}
                        </span>
                        <strong className="text-[#1C1B1A]">{item.customerName}</strong>
                        <span className="text-[#5C564E] font-mono">({item.customerPhone})</span>
                        {item.isWalkIn && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#D63927] text-white font-mono font-bold">
                            WALK-IN
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#5C564E] block mt-0.5 font-mono">
                        {item.serviceName} • {isEn ? 'Stylist:' : 'उस्ताद:'} {item.staffName} ({item.assignedStation})
                      </span>
                      {item.waitBreakdown && (
                        <span className="text-[10px] text-[#1E75B8] font-mono font-bold block mt-0.5">
                          🤖 AI Prediction: {item.waitBreakdown} (~{item.estimatedWaitMinutes}m)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 text-[#1C1B1A] border border-[#1C1B1A]/15">
                        {item.status}
                      </span>
                      {item.status === 'Waiting' && (
                        <>
                          <button
                            onClick={() => onTriggerAiVoiceCall(item)}
                            className="px-2.5 py-1 bg-[#F5B82E] hover:bg-[#e5a820] text-[#1C1B1A] font-bold rounded-lg border border-[#1C1B1A]/20 flex items-center gap-1 shadow-2xs transition-all"
                            title="Place Automated AI Voice Call"
                          >
                            <PhoneCall size={12} className="text-[#D63927]" /> AI Call
                          </button>
                          <button
                            onClick={() => onUpdateQueueStatus(item.token, 'Called')}
                            className="btn-kitsch-secondary px-2.5 py-1 text-xs"
                          >
                            {isEn ? 'Call' : 'बुलाएं / Call'}
                          </button>
                        </>
                      )}
                      {(item.status === 'Waiting' || item.status === 'Called') && (
                        <button
                          onClick={() => onUpdateQueueStatus(item.token, 'In Service')}
                          className="btn-kitsch-limca px-2.5 py-1 text-xs font-bold"
                        >
                          {isEn ? 'Start' : 'शुरू करें / Start'}
                        </button>
                      )}
                      {item.status === 'In Service' && (
                        <button
                          onClick={() => onUpdateQueueStatus(item.token, 'Completed')}
                          className="btn-kitsch-primary px-2.5 py-1 text-xs font-bold"
                        >
                          {isEn ? 'Checkout' : 'संपन्न / Checkout'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: TODAY'S APPOINTMENTS ==================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? "Today's Appointments Ledger" : 'आज का बही-खाता / Today\'s Appointments Ledger'}
              </h2>
              <p className="text-xs text-[#5C564E]">Active schedule of booked customer visits for the day.</p>
            </div>
            <div className="glass-panel divide-y divide-[#1C1B1A]/10">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1C1B1A] bg-[#F6EFE2] px-1.5 py-0.5 rounded border border-[#1C1B1A]/15">{apt.id}</span>
                      <strong className="text-[#1C1B1A]">{apt.customerName}</strong>
                      <span className="text-[#5C564E] font-mono">({apt.customerPhone})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFF9E6] text-[#1C1B1A] border border-[#1C1B1A]/15">
                        {apt.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C564E] block mt-0.5 font-mono">
                      Service: {apt.serviceName} • Time: {apt.time} • Stylist: {apt.staffName} • Amount: ₹{apt.finalPrice || apt.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'In Service')}
                        className="btn-kitsch-limca px-2.5 py-1 text-xs"
                      >
                        {isEn ? 'Seat Client' : 'कुर्सी पर बैठाएं'}
                      </button>
                    )}
                    {apt.status === 'In Service' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'Completed')}
                        className="btn-kitsch-primary px-2.5 py-1 text-xs"
                      >
                        {isEn ? 'Complete Service' : 'सेवा पूरी हुई'}
                      </button>
                    )}
                    {apt.status === 'Pending' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'No-show')}
                        className="px-2.5 py-1 bg-[#B81D1D]/10 text-[#B81D1D] hover:bg-[#B81D1D] hover:text-white border border-[#B81D1D]/30 rounded-xl text-xs font-bold transition-colors"
                      >
                        {isEn ? 'No-Show' : 'गैर-हाजिर / No-Show'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: CHECK-IN ==================== */}
        {activeTab === 'checkin' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Fast Check-In' : 'तुरंत ग्राहक हाजिरी / Fast Check-In'}
              </h2>
              <p className="text-xs text-[#5C564E]">
                Search by customer phone number, booking ID, or name to issue immediate floor queue token.
              </p>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#5C564E]" />
              <input
                type="text"
                placeholder="Search by customer name, phone (+91...), or APT-1001..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-input text-xs outline-none font-mono font-bold"
              />
            </div>

            <div className="glass-panel divide-y divide-[#1C1B1A]/10">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#1C1B1A] font-bold">{apt.customerName}</strong>
                    <span className="text-[#5C564E] ml-2 font-mono">{apt.customerPhone}</span>
                    <span className="text-[11px] text-[#5C564E] block mt-0.5 font-mono">
                      {apt.serviceName} • {apt.time} • Stylist: {apt.staffName}
                    </span>
                  </div>

                  <div>
                    {apt.status === 'Confirmed' ? (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'In Service')}
                        className="btn-kitsch-limca px-3.5 py-1.5 text-xs font-bold"
                      >
                        {isEn ? 'Check-In & Issue Token' : 'हाजिरी & टोकन दें'}
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F6EFE2] text-[#1C1B1A] border border-[#1C1B1A]/15">
                        {apt.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: WALK-IN REGISTRATION ==================== */}
        {activeTab === 'walkins' && (
          <div className="max-w-xl mx-auto glass-panel p-6 shadow-glass-lg">
            <div className="mb-4 pb-3 border-b border-[#1C1B1A]/15">
              <span className="text-[10px] font-mono font-bold text-[#D63927] uppercase tracking-wider bg-[#F6EFE2] px-2 py-0.5 rounded border border-[#1C1B1A]/15">
                {isEn ? 'WALK-IN FAST INTAKE' : 'रिसेप्शन पर्ची • WALK-IN FAST INTAKE'}
              </span>
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi mt-1.5">
                {isEn ? 'Register Walk-In Customer' : 'वॉक-इन ग्राहक पर्ची बनाएं / Register Walk-In'}
              </h2>
              <p className="text-xs text-[#5C564E] mt-0.5">
                Fast counter intake with automated age-tiered pricing matrix, pass holder rates, and AI slot buffer sync.
              </p>
            </div>

            {walkInSuccessMsg && (
              <div className="mb-4 p-3 bg-[#288D43]/10 text-[#288D43] border border-[#288D43]/30 rounded-xl text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} />
                <span>{walkInSuccessMsg}</span>
              </div>
            )}

            {walkInErrorMsg && (
              <div className="mb-4 p-3 bg-[#D63927]/10 text-[#D63927] border border-[#D63927]/30 rounded-xl text-xs flex items-center gap-2 font-bold">
                <AlertCircle size={16} />
                <span>{walkInErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleWalkInSubmit} className="space-y-4 text-xs font-bold text-[#1C1B1A]">
              <div>
                <label className="block text-[#1C1B1A] mb-1">
                  {isEn ? 'Customer Full Name' : 'ग्राहक का पूरा नाम / Customer Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deepak Verma"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full p-2.5 glass-input"
                />
              </div>

              <div>
                <label className="block text-[#1C1B1A] mb-1">
                  {isEn ? 'Phone Number (for AI Arrival Call)' : 'फ़ोन नंबर (AI कॉल के लिए) / Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full p-2.5 glass-input font-mono"
                />
              </div>

              {/* Age Tier Segmented Selector */}
              <div>
                <label className="block text-[#1C1B1A] mb-1.5">
                  {isEn ? 'Select Customer Age Category' : 'आयु वर्ग चुनें / Age Category'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Adults', 'Kids', 'Seniors'] as AgeTier[]).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        setWalkInAgeTier(tier)
                        setWalkInErrorMsg('')
                      }}
                      className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        walkInAgeTier === tier
                          ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                          : 'bg-[#F6EFE2]/80 text-[#1C1B1A] border-[#1C1B1A]/20 hover:bg-white'
                      }`}
                    >
                      <span className="block font-bold">
                        {tier === 'Kids' ? 'Kids' : tier === 'Adults' ? 'Adults' : 'Seniors'}
                      </span>
                      <span className="text-[10px] font-mono opacity-80 block">
                        {tier === 'Kids' ? '< 12 Yrs' : tier === 'Adults' ? '13–59 Yrs' : '60+ Yrs'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-[#1C1B1A] mb-1">
                  {isEn ? 'Select Service' : 'सेवा चुनें / Select Service'}
                </label>
                <select
                  value={walkInService}
                  onChange={(e) => {
                    setWalkInService(e.target.value)
                    setWalkInErrorMsg('')
                  }}
                  className="w-full p-2.5 glass-input"
                >
                  {services.map((s) => {
                    const priceForCurrentTier = calculateServicePrice(s, walkInAgeTier)
                    return (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.category} • {s.durationMinutes}m) — {priceForCurrentTier !== null ? `₹${priceForCurrentTier}` : 'N/A for ' + walkInAgeTier}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* VIP Membership Pass Selection */}
              <div>
                <label className="block text-[#1C1B1A] mb-1.5">
                  {isEn ? 'Customer VIP Pass Status' : 'वीआईपी सदस्यता पास / VIP Membership Pass'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['None', 'Silver', 'Gold', 'Shahi Ustaad'] as PassTier[]).map((pass) => (
                    <button
                      key={pass}
                      type="button"
                      onClick={() => setWalkInPassTier(pass)}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                        walkInPassTier === pass
                          ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                          : 'bg-[#F6EFE2]/80 text-[#1C1B1A] border-[#1C1B1A]/20 hover:bg-white'
                      }`}
                    >
                      <span className="block font-bold">{pass}</span>
                      <span className="text-[10px] font-mono text-[#288D43] block">
                        {pass === 'None' ? 'Standard' : pass === 'Silver' ? '15% Off' : pass === 'Gold' ? '25% Off' : '35% Off'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stylist Selection */}
              <div>
                <label className="block text-[#1C1B1A] mb-1">
                  {isEn ? 'Assign Stylist' : 'कारीगर आवंटित करें / Assign Stylist'}
                </label>
                <select
                  value={walkInStaff}
                  onChange={(e) => setWalkInStaff(e.target.value)}
                  className="w-full p-2.5 glass-input"
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name} ({st.station} • {st.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Duration Summary Box */}
              {walkInBasePrice === null ? (
                <div className="p-3 bg-[#D63927]/10 border border-[#D63927]/30 rounded-xl text-[#D63927] text-xs font-mono font-bold flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>
                    ⚠️ Safety Policy: &ldquo;{walkInService}&rdquo; is excluded for {walkInAgeTier}. Please pick an alternative service.
                  </span>
                </div>
              ) : (
                <div className="p-3.5 bg-[#FFF9E6]/90 border border-[#F5B82E]/40 rounded-xl space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-[#5C564E]">
                    <span>Base {walkInAgeTier} Rate:</span>
                    <span>₹{walkInBasePrice}.00</span>
                  </div>
                  {walkInPassTier !== 'None' && (
                    <div className="flex justify-between text-[#288D43]">
                      <span>{walkInPassTier} Pass Discount:</span>
                      <span>-₹{(walkInBasePrice - (walkInFinalPrice || 0))}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#1C1B1A] pt-1.5 border-t border-[#1C1B1A]/10">
                    <span>Final Walk-In Bill:</span>
                    <span className="text-[#D63927] text-base">₹{walkInFinalPrice}.00</span>
                  </div>
                  <div className="text-[10px] text-[#1E75B8] pt-1">
                    ⏱️ Duration: {selectedWalkInSrv?.durationMinutes} mins (+ 5m buffer sync with slot algorithm)
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={walkInBasePrice === null}
                className={`w-full py-3 text-xs font-bold ${
                  walkInBasePrice === null ? 'bg-gray-300 text-gray-500 cursor-not-allowed rounded-xl' : 'btn-kitsch-haldi'
                }`}
              >
                {isEn ? 'Issue Token & Add to Queue' : 'टोकन जारी करें एवं कतार में जोड़ें / Issue Token'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== TAB 5: QUEUE MANAGEMENT ==================== */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Queue Controller & AI Auto-Caller' : 'कतार नियंत्रक एवं AI ऑटो-कॉलर / Queue Controller'}
              </h2>
              <p className="text-xs text-[#5C564E]">Trigger automated voice announcements and seat clients.</p>
            </div>
            <div className="glass-panel p-5 space-y-3">
              {queue.map((item) => (
                <div
                  key={item.token}
                  className="p-3.5 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold px-2.5 py-1 bg-[#F5B82E] border border-[#1C1B1A]/20 rounded-lg text-[#1C1B1A]">
                      {item.token}
                    </span>
                    <div>
                      <strong className="text-[#1C1B1A] text-sm">{item.customerName}</strong>
                      <span className="text-[#5C564E] block text-[11px] font-mono">
                        {item.serviceName} • {item.staffName} ({item.assignedStation})
                      </span>
                      {item.waitBreakdown && (
                        <span className="text-[10px] text-[#1E75B8] font-mono font-bold block">
                          🤖 {item.waitBreakdown} (~{item.estimatedWaitMinutes}m)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'Waiting' && (
                      <button
                        onClick={() => onTriggerAiVoiceCall(item)}
                        className="px-2.5 py-1.5 bg-[#F5B82E] hover:bg-[#e5a820] border border-[#1C1B1A]/20 text-[#1C1B1A] rounded-lg font-bold flex items-center gap-1 shadow-2xs transition-all"
                        title="Call customer via AI automated voice system"
                      >
                        <PhoneCall size={13} className="text-[#D63927]" /> AI Call
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateQueueStatus(item.token, 'Called')}
                      className="btn-kitsch-secondary px-2.5 py-1.5 text-xs"
                    >
                      {isEn ? 'Call' : 'बुलाएं'}
                    </button>
                    <button
                      onClick={() => onUpdateQueueStatus(item.token, 'In Service')}
                      className="btn-kitsch-limca px-2.5 py-1.5 text-xs font-bold"
                    >
                      {isEn ? 'Start' : 'शुरू'}
                    </button>
                    <button
                      onClick={() => onUpdateQueueStatus(item.token, 'Completed')}
                      className="btn-kitsch-primary px-2.5 py-1.5 text-xs font-bold"
                    >
                      {isEn ? 'Complete' : 'संपन्न'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: CUSTOMER SEARCH ==================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Customer Records Search' : 'ग्राहक रिकॉर्ड खोज / Customer Records'}
              </h2>
              <p className="text-xs text-[#5C564E]">Lookup past service history and customer contacts.</p>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#5C564E]" />
              <input
                type="text"
                placeholder="Search customers by name or contact number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-input text-xs outline-none font-mono font-bold"
              />
            </div>
            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-3.5 flex items-center justify-between">
                  <div>
                    <strong className="text-[#1C1B1A] font-bold">{apt.customerName}</strong>
                    <span className="text-[#5C564E] ml-2 font-mono">{apt.customerPhone}</span>
                    <span className="text-[#5C564E] block text-[11px] mt-0.5 font-mono">
                      Last visit: {apt.date} for {apt.serviceName}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#FFF9E6] text-[#1C1B1A] font-mono font-bold border border-[#1C1B1A]/15">
                    ₹{apt.finalPrice || apt.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: BOOKINGS MANAGEMENT ==================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Station & Shift Schedule' : 'कुर्सी एवं शिफ्ट समय सारिणी / Station Schedule'}
              </h2>
              <p className="text-xs text-[#5C564E]">Manage appointment assignments and buffer times for active salon stations.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staff.map((st) => (
                <div key={st.id} className="glass-card p-4 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-[#1C1B1A] block text-sm font-bold">{st.name}</strong>
                    <span className="px-2 py-0.5 rounded bg-[#F5B82E] text-[#1C1B1A] font-mono font-bold border border-[#1C1B1A]/15 text-[10px]">
                      {st.station}
                    </span>
                  </div>
                  <span className="text-[#5C564E] font-mono text-[11px] block">
                    Hours: {st.workingHours} • Status: {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 8: PAYMENT & BILLING WITH PHONE NUMBER INTAKE ==================== */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'POS Billing & Receipt Counter' : 'पीओएस बिलिंग एवं रसीद काउंटर / POS Billing Counter'}
              </h2>
              <p className="text-xs text-[#5C564E]">
                Collect payments, verify customer phone number for automated AI voice calls, and trigger automated AI email receipts.
              </p>
            </div>

            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <strong className="text-[#1C1B1A] font-bold">{apt.customerName}</strong>
                    <span className="text-[#5C564E] ml-2 font-mono">{apt.serviceName}</span>
                    <span className="text-[#D63927] font-mono font-bold block text-base mt-0.5">
                      ₹{apt.finalPrice || apt.price}.00
                    </span>
                    <span className="text-[10px] text-[#5C564E] block mt-0.5 font-mono">
                      Phone on file: {apt.customerPhone}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    {apt.paymentStatus === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          placeholder="Confirm phone (+91...)"
                          value={checkoutPhoneInput[apt.id] !== undefined ? checkoutPhoneInput[apt.id] : apt.customerPhone}
                          onChange={(e) =>
                            setCheckoutPhoneInput({ ...checkoutPhoneInput, [apt.id]: e.target.value })
                          }
                          className="px-2 py-1.5 glass-input text-xs w-36 font-mono"
                        />
                        <button
                          onClick={() => onProcessPayment(apt.id, 'UPI', checkoutPhoneInput[apt.id] || apt.customerPhone)}
                          className="btn-kitsch-haldi px-2.5 py-1.5 text-xs font-bold"
                        >
                          Collect UPI
                        </button>
                        <button
                          onClick={() => onProcessPayment(apt.id, 'Cash', checkoutPhoneInput[apt.id] || apt.customerPhone)}
                          className="btn-kitsch-secondary px-2.5 py-1.5 text-xs font-bold"
                        >
                          Collect Cash
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          onOpenReceipt({
                            receiptNumber: apt.receiptId || 'REC-101',
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
                        className="btn-kitsch-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Printer size={13} /> {isEn ? 'Print Receipt' : 'रसीद प्रिंट करें / Print'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 9: REFUND PROCESSING ==================== */}
        {activeTab === 'refunds' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Customer Refund Tickets' : 'ग्राहक रिफंड दावे / Customer Refund Tickets'}
              </h2>
              <p className="text-xs text-[#5C564E]">Review and process cancellation refunds.</p>
            </div>
            <div className="glass-panel p-5 divide-y divide-[#1C1B1A]/10 text-xs">
              {refunds.map((ref) => (
                <div key={ref.id} className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="text-[#1C1B1A]">{ref.customerName}</strong> — {ref.serviceName}
                    <span className="text-[#5C564E] block text-[11px] font-mono">Reason: {ref.reason}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-[#D63927] text-sm">₹{ref.refundAmount}.00</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F6EFE2] text-[#1C1B1A] font-mono font-bold border border-[#1C1B1A]/15 block mt-0.5">
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 10: AVAILABILITY ==================== */}
        {activeTab === 'availability' && (
          <div className="max-w-xl mx-auto glass-panel p-6 shadow-glass-lg space-y-4 text-xs font-mono">
            <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
              {isEn ? 'Staff Shift & Attendance' : 'कारीगर उपस्थिति एवं शिफ्ट / Staff Shift'}
            </h2>
            <div className="p-4 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 space-y-3">
              <div className="flex justify-between">
                <span className="text-[#5C564E]">Stylist Name:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C564E]">Working Station:</span>
                <span className="font-bold text-[#1C1B1A]">{currentStaff.station}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C564E]">Daily Working Hours:</span>
                <span className="font-bold text-[#1C1B1A]">{currentStaff.workingHours}</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 11: PROFILE ==================== */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto glass-panel p-6 shadow-glass-lg space-y-4 text-xs font-mono">
            <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
              {isEn ? 'Staff Profile' : 'कारीगर प्रोफ़ाइल / Staff Profile'}
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 flex justify-between">
                <span className="text-[#5C564E]">Name:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.name}</span>
              </div>
              <div className="p-3 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 flex justify-between">
                <span className="text-[#5C564E]">Account Email:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.email}</span>
              </div>
              <div className="p-3 bg-[#FFF9E6]/90 rounded-xl border border-[#F5B82E]/40 flex justify-between">
                <span className="text-[#5C564E]">Operational Role:</span>
                <span className="font-bold text-[#288D43] uppercase">Staff Stylist / Technician</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
