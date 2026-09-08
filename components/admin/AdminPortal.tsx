'use client'

import React, { useState } from 'react'
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Tag,
  Activity,
  BarChart3,
  RotateCcw,
  ShieldCheck,
  FileText,
  Database,
  Settings,
  User,
  LogOut,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Shield,
  Search,
  Bot,
  Mail,
  Zap,
  Crown,
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
  AuditLogEntry,
  UserAccountItem,
  DispatchedEmail,
  MembershipPass,
  initialUserAccounts,
  initialMembershipPasses,
} from '@/lib/types'
import { runSmartQueueOptimizer } from '@/lib/aiEngine'

interface AdminPortalProps {
  services: ServiceItem[]
  staff: StaffMember[]
  appointments: Appointment[]
  queue: QueueItem[]
  refunds: RefundRequest[]
  auditLogs: AuditLogEntry[]
  dispatchedEmails: DispatchedEmail[]
  onApproveRefund: (refundId: string) => void
  onRejectRefund: (refundId: string) => void
  onAddService: (service: ServiceItem) => void
  onToggleService: (serviceId: string) => void
  onOpenAiChat: () => void
  onOpenEmailPreview: (email: DispatchedEmail) => void
  onApplyQueueOptimization: (rebalancedQueue: QueueItem[]) => void
}

export default function AdminPortal({
  services,
  staff,
  appointments,
  queue,
  refunds,
  auditLogs,
  dispatchedEmails,
  onApproveRefund,
  onRejectRefund,
  onAddService,
  onToggleService,
  onOpenAiChat,
  onOpenEmailPreview,
  onApplyQueueOptimization,
}: AdminPortalProps) {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'appointments'
    | 'queue'
    | 'staff'
    | 'services'
    | 'pricing'
    | 'availability'
    | 'reports'
    | 'ai-optimizer'
    | 'emails'
    | 'passes'
    | 'refunds'
    | 'users'
    | 'audit'
    | 'backup'
    | 'settings'
    | 'profile'
  >('dashboard')

  // Multi-Period Reporting Tab (Daily / Monthly / Yearly)
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily')

  // User accounts list state
  const [userAccounts, setUserAccounts] = useState<UserAccountItem[]>(initialUserAccounts)
  const [membershipPasses, setMembershipPasses] = useState<MembershipPass[]>(initialMembershipPasses)
  const [newServiceName, setNewServiceName] = useState('')
  const [newServicePrice, setNewServicePrice] = useState(400)
  const [newServiceDuration, setNewServiceDuration] = useState(30)
  const [newServiceCategory, setNewServiceCategory] = useState<'Hair' | 'Grooming' | 'Spa' | 'Facial'>('Hair')
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState('')

  // AI Optimizer State
  const [optimizerNotes, setOptimizerNotes] = useState<string[]>([])
  const [isOptimizerApplied, setIsOptimizerApplied] = useState(false)

  // Toggle user status
  const handleToggleUserStatus = (userId: string) => {
    setUserAccounts((prev) =>
      prev.map((u) =>
        u.userId === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    )
  }

  // Handle Add Service
  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newServiceName.trim()) return

    const newSrv: ServiceItem = {
      id: `srv-${Date.now().toString().slice(-3)}`,
      name: newServiceName,
      category: newServiceCategory,
      durationMinutes: Number(newServiceDuration),
      bufferMinutes: 5,
      price: Number(newServicePrice),
      description: 'Custom salon treatment added by administrator',
      active: true,
    }

    onAddService(newSrv)
    setServiceSuccessMsg(`Service "${newSrv.name}" added successfully!`)
    setNewServiceName('')
    setTimeout(() => setServiceSuccessMsg(''), 2500)
  }

  // Run AI Queue Optimizer
  const handleRunOptimizer = () => {
    const { rebalancedQueue, optimizationNotes } = runSmartQueueOptimizer(queue, staff)
    setOptimizerNotes(optimizationNotes)
    onApplyQueueOptimization(rebalancedQueue)
    setIsOptimizerApplied(true)
    setTimeout(() => setIsOptimizerApplied(false), 4000)
  }

  // Multi-Period Financial Calculation
  const dailyRevenue = appointments
    .filter((a) => a.paymentStatus === 'Paid')
    .reduce((sum, a) => sum + (a.finalPrice || a.price), 0) + 4850
  const monthlyRevenue = 148750
  const yearlyRevenue = 1842600

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F6EFE2] font-sans">
      {/* ================================================================
          ADMIN SIDEBAR NAVIGATION (Frosted Dark Glass Sidebar)
          ================================================================ */}
      <aside className="w-full md:w-64 glass-dark text-[#FFFDF9] p-4 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-5">
          {/* Admin Profile Frosted Pill */}
          <div className="p-3 bg-white/10 backdrop-blur-md border border-[#F5B82E]/40 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5B82E] text-[#1C1B1A] font-bold flex items-center justify-center text-sm border border-white/60 shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="overflow-hidden flex-1">
                <span className="text-[10px] font-mono font-bold text-[#F5B82E] uppercase tracking-wider block">
                  {isEn ? 'ADMIN • EXECUTIVE ADMIN' : `${t('roleAdmin')} • EXECUTIVE ADMIN`}
                </span>
                <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
                <span className="text-[11px] font-mono text-[#E8DAC1] truncate block">General Manager</span>
              </div>
            </div>

            {/* Language Switcher in Admin Sidebar */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#E8DAC1]">{t('changeLanguage')}:</span>
              <LanguageSwitcher variant="header" />
            </div>
          </div>

          {/* AI Copilot Launcher Button */}
          <button
            onClick={onOpenAiChat}
            className="w-full p-2.5 btn-kitsch-primary flex items-center justify-center gap-2 group text-xs font-bold"
          >
            <Bot size={16} className="text-[#F5B82E] group-hover:rotate-12 transition-transform" />
            <span className="font-hindi tracking-wide text-sm">{t('aiCopilot')}</span>
          </button>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-xs font-bold max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <LayoutDashboard size={15} />
              <span>{t('adminNavOverview')}</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'reports'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <BarChart3 size={15} />
              <span>{t('adminNavBahiKhata')}</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-optimizer')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'ai-optimizer'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Zap size={15} className="text-[#F5B82E]" />
              <span>{t('adminNavOptimizer')}</span>
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'emails'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Mail size={15} />
              <span>{t('adminNavEmails')}</span>
              <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] bg-[#D63927] text-white font-mono font-bold">
                {dispatchedEmails.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('passes')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'passes'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Crown size={15} />
              <span>{isEn ? 'VIP Passes' : 'वीआईपी पास / VIP Passes'}</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'appointments'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Calendar size={15} />
              <span>{isEn ? 'Bookings' : 'अपॉइंटमेंट्स / Bookings'}</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'queue'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Clock size={15} />
              <span>{isEn ? 'Queue Monitor' : 'कतार निगरानी / Queue Monitor'}</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'staff'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Users size={15} />
              <span>{isEn ? 'Staff Roster' : 'कारीगर रोस्टर / Staff Roster'}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'services'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Sparkles size={15} />
              <span>{isEn ? 'Services Catalog' : 'सेवा प्रबंधन / Services'}</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'pricing'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Tag size={15} />
              <span>{isEn ? 'Pricing & Surcharges' : 'दर एवं सरचार्ज / Pricing'}</span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'availability'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Activity size={15} />
              <span>{isEn ? 'Staff Shifts' : 'कारीगर उपस्थिति / Shifts'}</span>
            </button>

            <button
              onClick={() => setActiveTab('refunds')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'refunds'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <RotateCcw size={15} />
              <span>{isEn ? 'Refund Requests' : 'रिफंड स्वीकृति / Refunds'}</span>
              {refunds.filter((r) => r.status === 'Pending Review').length > 0 && (
                <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] bg-[#B81D1D] text-white font-mono font-bold">
                  {refunds.filter((r) => r.status === 'Pending Review').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'users'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <ShieldCheck size={15} />
              <span>{isEn ? 'User Roles' : 'उपयोगकर्ता खाते / User Roles'}</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'audit'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <FileText size={15} />
              <span>{isEn ? 'Audit Trail' : 'ऑडिट लॉग / Audit Trail'}</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'backup'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Database size={15} />
              <span>{isEn ? 'Data Backup' : 'डेटा बैकअप / Backup'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'settings'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Settings size={15} />
              <span>{isEn ? 'System Settings' : 'सिस्टम सेटिंग्स / Settings'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${
                activeTab === 'profile'
                  ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#F5B82E] shadow-xs'
                  : 'bg-transparent text-[#E8DAC1] border-transparent hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <User size={15} />
              <span>{isEn ? 'Profile' : 'प्रोफ़ाइल / Profile'}</span>
            </button>
          </nav>
        </div>

        {/* Logout Action Button */}
        <div className="pt-4 border-t border-white/15">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#B81D1D]/25 hover:bg-[#B81D1D] text-white font-bold text-xs border border-white/25 transition-colors"
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
                  {isEn ? 'Executive Operations Center' : 'डीलक्स मुख्य नियंत्रण कक्ष / Executive Center'}
                </h2>
                <p className="text-xs text-[#5C564E]">
                  Salon-wide live telemetry, revenue metrics, and floor performance indicators.
                </p>
              </div>
              <button
                onClick={onOpenAiChat}
                className="btn-kitsch-haldi text-xs flex items-center gap-1.5"
              >
                <Bot size={15} /> {isEn ? 'Launch AI Assistant' : 'AI सहायक शुरू करें'}
              </button>
            </div>

            {/* High-Level Financial & Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'DAILY REVENUE' : 'आज की आय / DAILY REVENUE'}
                </span>
                <strong className="block text-xl font-bold text-[#288D43] mt-1 font-mono">
                  ₹{dailyRevenue}.00
                </strong>
                <span className="text-[10px] text-[#288D43] font-bold font-mono">↑ 14% vs baseline</span>
              </div>
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'STATION OCCUPANCY' : 'कुर्सी अधिभोग / OCCUPANCY'}
                </span>
                <strong className="block text-xl font-bold text-[#1E75B8] mt-1 font-mono">
                  {queue.filter((q) => q.status === 'In Service').length} / 4 Stations
                </strong>
                <span className="text-[10px] text-[#5C564E] font-mono">Active styling seats</span>
              </div>
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'QUEUE BACKLOG' : 'कतार ग्राहक / QUEUE BACKLOG'}
                </span>
                <strong className="block text-xl font-bold text-[#D63927] mt-1 font-mono">
                  {queue.filter((q) => q.status === 'Waiting').length} Clients
                </strong>
                <span className="text-[10px] text-[#D63927] font-mono">Avg wait ~18 to 23 mins</span>
              </div>
              <div className="glass-card p-4">
                <span className="text-[11px] text-[#5C564E] font-bold font-mono uppercase">
                  {isEn ? 'PENDING REFUNDS' : 'लंबित रिफंड / REFUNDS'}
                </span>
                <strong className="block text-xl font-bold text-[#B81D1D] mt-1 font-mono">
                  {refunds.filter((r) => r.status === 'Pending Review').length} Tickets
                </strong>
                <span className="text-[10px] text-[#B81D1D] font-mono">Requires authorization</span>
              </div>
            </div>

            {/* Live Station Load Monitor */}
            <div className="glass-panel p-5">
              <h3 className="text-sm font-bold text-[#1C1B1A] mb-4 font-hindi">
                {isEn ? 'Real-Time Station Telemetry' : 'लाइव सैलून कुर्सी स्थिति / Real-Time Station Telemetry'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {staff.map((st) => (
                  <div key={st.id} className="p-4 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl space-y-2 text-xs shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1C1B1A] font-mono">{st.station}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#1C1B1A]/15 ${
                          st.status === 'Available'
                            ? 'bg-[#288D43]/20 text-[#288D43]'
                            : st.status === 'Busy'
                            ? 'bg-[#1E75B8]/20 text-[#1E75B8]'
                            : 'bg-[#F5B82E]/30 text-[#1C1B1A]'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                    <p className="text-[#1C1B1A] font-bold">{st.name}</p>
                    <span className="text-[11px] text-[#5C564E] font-mono block">
                      Served: {st.totalCutsToday} clients • Rating: ⭐{st.rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: BUSINESS SUMMARY (BAHI-KHATA DAILY, MONTHLY, YEARLY) ==================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4">
              <div>
                <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'Business Ledger & Revenue Statements' : 'पारंपरिक बही-खाता एवं आय विवरण / Business Ledger'}
                </h2>
                <p className="text-xs text-[#5C564E]">
                  Comprehensive performance analytics across daily floor intake, monthly ledger, and annual revenue.
                </p>
              </div>

              {/* Period Switcher (Daily, Monthly, Yearly) */}
              <div className="bg-[#F6EFE2]/80 backdrop-blur-md border border-[#1C1B1A]/15 p-1 rounded-xl flex items-center gap-1 text-xs font-bold shadow-xs">
                <button
                  onClick={() => setAnalyticsPeriod('daily')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    analyticsPeriod === 'daily'
                      ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                      : 'border-transparent text-[#1C1B1A] hover:bg-white/60'
                  }`}
                >
                  {isEn ? '📅 Daily' : '📅 दैनिक / Daily'}
                </button>
                <button
                  onClick={() => setAnalyticsPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    analyticsPeriod === 'monthly'
                      ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                      : 'border-transparent text-[#1C1B1A] hover:bg-white/60'
                  }`}
                >
                  {isEn ? '📊 Monthly' : '📊 मासिक / Monthly'}
                </button>
                <button
                  onClick={() => setAnalyticsPeriod('yearly')}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    analyticsPeriod === 'yearly'
                      ? 'bg-[#1C1B1A] text-[#F5B82E] border-[#1C1B1A] shadow-xs'
                      : 'border-transparent text-[#1C1B1A] hover:bg-white/60'
                  }`}
                >
                  {isEn ? '📈 Yearly' : '📈 वार्षिक / Yearly'}
                </button>
              </div>
            </div>

            {/* DAILY VIEW */}
            {analyticsPeriod === 'daily' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'GROSS REVENUE TODAY' : 'आज की कुल आय / GROSS REVENUE'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#288D43] mt-1 font-mono">
                      ₹{dailyRevenue}.00
                    </strong>
                    <span className="text-[11px] text-[#5C564E] font-mono mt-0.5 block">19 Services Completed</span>
                  </div>
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'OCCUPANCY RATE' : 'कुर्सी उपयोग / OCCUPANCY RATE'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#1E75B8] mt-1 font-mono">
                      75.0%
                    </strong>
                    <span className="text-[11px] text-[#5C564E] font-mono mt-0.5 block">Peak time: 04:30 PM - 07:30 PM</span>
                  </div>
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'NO-SHOW LOSS' : 'अनुपस्थिति नुकसान / NO-SHOW LOSS'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#D63927] mt-1 font-mono">
                      -₹350.00
                    </strong>
                    <span className="text-[11px] text-[#D63927] font-mono mt-0.5 block">1 Client Missed Slot</span>
                  </div>
                </div>

                <div className="glass-panel p-6 text-xs space-y-3">
                  <h3 className="font-bold text-[#1C1B1A] text-sm font-hindi">
                    {isEn ? 'Hourly Demand Distribution' : 'आज का समय अनुसार ग्राहक प्रवाह / Hourly Demand Distribution'}
                  </h3>
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between items-center text-[#1C1B1A]">
                      <span>09:00 AM – 12:00 PM (Morning Rush)</span>
                      <span className="font-bold text-[#1C1B1A]">8 Clients (₹2,150)</span>
                    </div>
                    <div className="w-full bg-[#F6EFE2] rounded-full h-3 border border-[#1C1B1A]/20 overflow-hidden">
                      <div className="bg-[#1E75B8] h-full rounded-full w-[65%]" />
                    </div>

                    <div className="flex justify-between items-center text-[#1C1B1A] pt-2">
                      <span>12:00 PM – 04:00 PM (Afternoon Flow)</span>
                      <span className="font-bold text-[#1C1B1A]">6 Clients (₹1,850)</span>
                    </div>
                    <div className="w-full bg-[#F6EFE2] rounded-full h-3 border border-[#1C1B1A]/20 overflow-hidden">
                      <div className="bg-[#F5B82E] h-full rounded-full w-[48%]" />
                    </div>

                    <div className="flex justify-between items-center text-[#1C1B1A] pt-2">
                      <span>04:00 PM – 08:00 PM (Evening Peak Surcharge)</span>
                      <span className="font-bold text-[#1C1B1A]">11 Clients (₹3,200)</span>
                    </div>
                    <div className="w-full bg-[#F6EFE2] rounded-full h-3 border border-[#1C1B1A]/20 overflow-hidden">
                      <div className="bg-[#288D43] h-full rounded-full w-[90%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MONTHLY VIEW */}
            {analyticsPeriod === 'monthly' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'Monthly Gross Revenue (September)' : 'मासिक सकल आय (सितंबर)'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#288D43] mt-1 font-mono">
                      ₹{monthlyRevenue.toLocaleString()}.00
                    </strong>
                    <span className="text-[11px] text-[#288D43] font-mono mt-0.5 block">↑ 18.4% growth vs August</span>
                  </div>
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'ACTIVE VIP MEMBERS' : 'सक्रिय वीआईपी सदस्य / VIP PASSES'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#F5B82E] mt-1 font-mono">
                      70 Members
                    </strong>
                    <span className="text-[11px] text-[#5C564E] font-mono mt-0.5 block">₹69,930 recurring revenue</span>
                  </div>
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'CLIENT RETENTION RATE' : 'ग्राहक ठहराव दर / RETENTION'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#1E75B8] mt-1 font-mono">
                      84.2%
                    </strong>
                    <span className="text-[11px] text-[#1E75B8] font-mono mt-0.5 block">AI Memory triggered 42 re-bookings</span>
                  </div>
                </div>

                <div className="glass-panel p-6 text-xs space-y-3">
                  <h3 className="font-bold text-[#1C1B1A] text-sm font-hindi">
                    {isEn ? 'Top 5 Revenue Services' : 'शीर्ष 5 लाभदायक सेवाएं / Top 5 Revenue Services'}
                  </h3>
                  <div className="divide-y divide-[#1C1B1A]/10 text-[#1C1B1A] font-mono">
                    <div className="py-2.5 flex justify-between">
                      <span>1. Intense Repair Hair Spa (₹800)</span>
                      <b className="text-[#1C1B1A]">₹44,800 (56 sessions)</b>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>2. Executive Haircut & Master Styling (₹350 + ₹50)</span>
                      <b className="text-[#1C1B1A]">₹39,200 (98 sessions)</b>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>3. Anti-Pollution Charcoal Facial (₹650)</span>
                      <b className="text-[#1C1B1A]">₹27,300 (42 sessions)</b>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>4. Royal Hot Towel Shave (₹200)</span>
                      <b className="text-[#1C1B1A]">₹18,400 (92 sessions)</b>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>5. VIP Membership Subscriptions</span>
                      <b className="text-[#288D43]">₹19,050</b>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* YEARLY VIEW */}
            {analyticsPeriod === 'yearly' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'Annual Gross Revenue (2026)' : 'वार्षिक कुल आय (2026)'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#288D43] mt-1 font-mono">
                      ₹{yearlyRevenue.toLocaleString()}.00
                    </strong>
                    <span className="text-[11px] text-[#288D43] font-mono mt-0.5 block">↑ 26% YoY Annual Surge</span>
                  </div>
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'TOTAL CLIENTS SERVED' : 'कुल संपन्न सेवाएं / TOTAL CLIENTS'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#1C1B1A] mt-1 font-mono">
                      4,820 Clients
                    </strong>
                    <span className="text-[11px] text-[#5C564E] font-mono mt-0.5 block">Zero data loss with automated backups</span>
                  </div>
                  <div className="glass-card p-5">
                    <span className="text-xs text-[#5C564E] font-bold font-mono uppercase">
                      {isEn ? 'AVERAGE TICKET' : 'औसत बिल राशि / AVG TICKET'}
                    </span>
                    <strong className="block text-2xl font-bold text-[#1E75B8] mt-1 font-mono">
                      ₹382.00
                    </strong>
                    <span className="text-[11px] text-[#1E75B8] font-mono mt-0.5 block">+₹45 from Master Stylist add-ons</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: AI SMART QUEUE & STAFF OPTIMIZER ==================== */}
        {activeTab === 'ai-optimizer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4">
              <div>
                <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'AI Smart Queue & Floor Optimizer' : 'AI कतार एवं कारीगर भार संतुलन / AI Optimizer'}
                </h2>
                <p className="text-xs text-[#5C564E]">
                  Automated floor load balancing to eliminate bottlenecking and minimize client wait times.
                </p>
              </div>
              <button
                onClick={handleRunOptimizer}
                className="btn-kitsch-primary text-xs flex items-center gap-1.5"
              >
                <Zap size={15} /> {isEn ? 'Run AI Balancing Algorithm' : 'AI संतुलन एल्गोरिदम चलाएं'}
              </button>
            </div>

            {isOptimizerApplied && (
              <div className="p-4 bg-[#288D43]/10 border border-[#288D43]/40 rounded-2xl text-[#288D43] text-xs flex items-center gap-2.5 font-bold backdrop-blur-sm">
                <CheckCircle2 size={20} className="shrink-0" />
                <div>
                  <h4>Optimization Algorithm Applied Successfully!</h4>
                  <p className="text-[11px] text-[#1C1B1A]">Styling stations rebalanced across all floor displays.</p>
                </div>
              </div>
            )}

            {optimizerNotes.length > 0 && (
              <div className="p-5 glass-dark text-[#FFFDF9] rounded-2xl text-xs space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-[#F5B82E] font-bold">
                  <Bot size={16} />
                  <span className="font-hindi tracking-wide text-sm">
                    {isEn ? 'AI Optimization Actions Applied:' : 'AI द्वारा की गई अनुकूलन कार्रवाइयां:'}
                  </span>
                </div>
                <ul className="space-y-1.5 text-[11px] font-mono text-[#E8DAC1]">
                  {optimizerNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#288D43]">✓</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="glass-panel p-5 space-y-3">
                <h3 className="font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'Stylist Floor Load' : 'कारीगर भार स्थिति / Stylist Floor Load'}
                </h3>
                {staff.map((st) => (
                  <div key={st.id} className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl flex justify-between items-center shadow-xs">
                    <div>
                      <strong className="text-[#1C1B1A] block">{st.name} ({st.station})</strong>
                      <span className="text-[#5C564E] text-[11px] font-mono">Today: {st.totalCutsToday} Cuts • ⭐{st.rating}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#1C1B1A]/15 ${
                        st.status === 'Available'
                          ? 'bg-[#288D43]/20 text-[#288D43]'
                          : st.status === 'Busy'
                          ? 'bg-[#1E75B8]/20 text-[#1E75B8]'
                          : 'bg-[#F5B82E]/30 text-[#1C1B1A]'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-5 space-y-3">
                <h3 className="font-bold text-[#1C1B1A] font-hindi">
                  {isEn ? 'Rebalanced Queue' : 'पुनर्संतुलित कतार / Rebalanced Queue'}
                </h3>
                {queue.map((q) => (
                  <div key={q.token} className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl flex justify-between items-center shadow-xs">
                    <div>
                      <span className="font-mono font-bold mr-1.5 px-1.5 py-0.5 bg-[#F5B82E] rounded border border-[#1C1B1A]/20 text-[#1C1B1A]">{q.token}</span>
                      <strong className="text-[#1C1B1A]">{q.customerName}</strong>
                      <span className="text-[#5C564E] block text-[11px] font-mono">{q.serviceName} → {q.staffName}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/90 border border-[#1C1B1A]/15 rounded text-[#1C1B1A]">
                      ~{q.estimatedWaitMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: DISPATCHED AI EMAILS WITH CUSTOMER MEMORY ==================== */}
        {activeTab === 'emails' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Dispatched AI Emails Ledger' : 'प्रेषित AI डाक बही / Dispatched AI Emails Ledger'}
              </h2>
              <p className="text-xs text-[#5C564E]">
                Log of all automated post-service invoices sent with personalized historical customer memory notes.
              </p>
            </div>

            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {dispatchedEmails.map((eml) => (
                <div key={eml.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#D63927] bg-[#F6EFE2] px-1.5 py-0.5 rounded border border-[#1C1B1A]/15">{eml.id}</span>
                      <strong className="text-[#1C1B1A] font-bold">{eml.recipientName}</strong>
                      <span className="text-[#5C564E] font-mono">({eml.recipientEmail})</span>
                      <span className="px-2 py-0.5 rounded bg-[#288D43]/10 text-[#288D43] font-mono font-bold border border-[#288D43]/30 text-[10px]">
                        {eml.status}
                      </span>
                    </div>
                    <p className="text-[#1C1B1A] text-[11px] mt-1 italic font-serif max-w-xl truncate">
                      &ldquo;{eml.customerMemoryNote}&rdquo;
                    </p>
                    <span className="text-[10px] text-[#5C564E] block mt-0.5 font-mono">
                      Service: {eml.serviceName} • Amount: ₹{eml.amountPaid}.00 • Sent: {eml.timestamp}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenEmailPreview(eml)}
                    className="btn-kitsch-secondary px-3.5 py-1.5 text-xs font-bold shrink-0"
                  >
                    {isEn ? 'Preview Email' : 'ईमेल देखें / Preview'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: MEMBERSHIP PASSES ==================== */}
        {activeTab === 'passes' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'VIP Membership Program' : 'वीआईपी सदस्यता योजना / VIP Membership Program'}
              </h2>
              <p className="text-xs text-[#5C564E]">Configure recurring customer passes and active member benefits.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {membershipPasses.map((p) => (
                <div key={p.id} className="glass-card p-5 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm font-bold text-[#1C1B1A] font-hindi">{p.type}</strong>
                    <span className="font-mono text-base font-bold text-[#D63927]">₹{p.price}{p.billingPeriod}</span>
                  </div>
                  <div className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm rounded-xl border border-[#1C1B1A]/10 space-y-1.5 text-[11px] text-[#1C1B1A]">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-[#288D43] font-bold">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#1C1B1A]/10 flex justify-between text-[#5C564E] font-mono">
                    <span>Active Subscribers:</span>
                    <b className="text-[#1C1B1A] font-bold">{p.activeCustomersCount} Members</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: APPOINTMENTS ==================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Master Appointments Ledger' : 'मास्टर बुकिंग बही / Master Appointments Ledger'}
              </h2>
              <p className="text-xs text-[#5C564E]">All scheduled bookings across all chairs.</p>
            </div>
            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 flex items-center justify-between">
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
                      {apt.serviceName} • {apt.time} • Stylist: {apt.staffName}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#D63927] text-base">₹{apt.finalPrice || apt.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: QUEUE MONITORING ==================== */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Live Queue Monitor' : 'लाइव कतार निगरानी / Queue Monitor'}
              </h2>
              <p className="text-xs text-[#5C564E]">Real-time queue across all salon stations.</p>
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
                      Assigned: {q.staffName} ({q.assignedStation})
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

        {/* ==================== TAB 8: STAFF MANAGEMENT ==================== */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Salon Staff Roster' : 'कारीगर रोस्टर एवं दल / Salon Staff Roster'}
              </h2>
              <p className="text-xs text-[#5C564E]">Manage master barbers, stations, and shift hours.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staff.map((st) => (
                <div key={st.id} className="glass-card p-5 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-[#1C1B1A]">{st.name}</h3>
                    <span className="font-mono text-[10px] bg-[#F5B82E] text-[#1C1B1A] px-2 py-0.5 rounded font-bold border border-[#1C1B1A]/15">{st.station}</span>
                  </div>
                  <p className="text-[#5C564E] font-semibold">{st.roleTitle}</p>
                  <div className="pt-2 border-t border-[#1C1B1A]/10 flex justify-between text-[#5C564E] text-[11px] font-mono">
                    <span>Shift: {st.workingHours}</span>
                    <span className="font-bold text-[#D63927]">⭐ {st.rating} Rating</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 9: SERVICE MANAGEMENT ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Service Catalog Management' : 'सेवा सूची प्रबंधन / Service Catalog'}
              </h2>
              <p className="text-xs text-[#5C564E]">Add treatments, update pricing, and adjust buffer durations.</p>
            </div>

            {serviceSuccessMsg && (
              <div className="p-3 bg-[#288D43]/10 text-[#288D43] border border-[#288D43]/30 rounded-xl text-xs font-bold">
                {serviceSuccessMsg}
              </div>
            )}

            {/* Add Service Form */}
            <form onSubmit={handleAddServiceSubmit} className="glass-panel p-5 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[#1C1B1A] mb-1 font-bold">
                  {isEn ? 'Service Name' : 'सेवा का नाम / Service Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keratin Glow Treatment"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full p-2 glass-input font-bold"
                />
              </div>
              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">
                  {isEn ? 'Price (₹)' : 'मूल्य / Price (₹)'}
                </label>
                <input
                  type="number"
                  required
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(Number(e.target.value))}
                  className="w-full p-2 glass-input font-bold"
                />
              </div>
              <div>
                <label className="block text-[#1C1B1A] mb-1 font-bold">
                  {isEn ? 'Duration (mins)' : 'अवधि / Duration (m)'}
                </label>
                <input
                  type="number"
                  required
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                  className="w-full p-2 glass-input font-bold"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 btn-kitsch-primary text-xs font-bold"
                >
                  {isEn ? 'Add Service' : 'सेवा जोड़ें / Add Service'}
                </button>
              </div>
            </form>

            {/* Services List */}
            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {services.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <div>
                    <strong className="text-[#1C1B1A] font-bold">{s.name}</strong>
                    <span className="text-[#5C564E] ml-2 font-mono">({s.category} • {s.durationMinutes} mins)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#D63927] text-base">₹{s.price}</span>
                    <button
                      onClick={() => onToggleService(s.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                        s.active ? 'bg-[#288D43]/10 text-[#288D43] border-[#288D43]/40' : 'bg-[#F6EFE2] text-[#5C564E] border-[#1C1B1A]/20'
                      }`}
                    >
                      {s.active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 10: PRICING ==================== */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Pricing & Stylist Surcharge Rules' : 'दर एवं उस्ताद सरचार्ज नीति / Pricing Rules'}
              </h2>
              <p className="text-xs text-[#5C564E]">Configure dynamic pricing and master barber request surcharges.</p>
            </div>
            <div className="p-5 glass-panel text-xs space-y-3">
              <div className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl flex justify-between items-center shadow-xs">
                <div>
                  <strong className="text-[#1C1B1A] block">
                    {isEn ? 'Master Stylist Request Fee' : 'उस्ताद कारीगर विशेष शुल्क / Master Stylist Fee'}
                  </strong>
                  <span className="text-[#5C564E] text-[11px]">Applied when client specifically locks a Master Stylist</span>
                </div>
                <span className="font-mono font-bold text-[#D63927] text-sm">+₹50.00 Fixed</span>
              </div>
              <div className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl flex justify-between items-center shadow-xs">
                <div>
                  <strong className="text-[#1C1B1A] block">
                    {isEn ? 'Weekend Peak Surcharge' : 'सप्ताहांत भीड़ सरचार्ज / Weekend Peak Surcharge'}
                  </strong>
                  <span className="text-[#5C564E] text-[11px]">Applied on Saturdays & Sundays (04:00 PM - 08:00 PM)</span>
                </div>
                <span className="font-mono font-bold text-[#1E75B8] text-sm">+10% Auto-Applied</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 11: AVAILABILITY ==================== */}
        {activeTab === 'availability' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Staff Shifts & Availability' : 'कारीगर उपस्थिति एवं शिफ्ट / Staff Availability'}
              </h2>
              <p className="text-xs text-[#5C564E]">Active shifts and salon schedule.</p>
            </div>
            <div className="glass-panel p-5 space-y-2 text-xs font-mono">
              {staff.map((st) => (
                <div key={st.id} className="p-3 bg-[#F6EFE2]/75 backdrop-blur-sm border border-[#1C1B1A]/15 rounded-xl flex justify-between items-center shadow-xs">
                  <span className="font-bold text-[#1C1B1A]">{st.name} ({st.station})</span>
                  <span className="text-[#5C564E]">{st.workingHours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 12: REFUND AUTHORIZATION ==================== */}
        {activeTab === 'refunds' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Refund Authorization Console' : 'रिफंड मंजूरी पटल / Refund Authorization'}
              </h2>
              <p className="text-xs text-[#5C564E]">Approve or reject cancellation refund requests.</p>
            </div>
            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {refunds.map((ref) => (
                <div key={ref.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#1C1B1A] font-mono">{ref.id}</strong>
                      <span className="text-[#1C1B1A] font-bold">{ref.customerName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFF9E6] text-[#1C1B1A] font-mono font-bold border border-[#1C1B1A]/15">
                        {ref.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C564E] block mt-0.5 font-mono">
                      Service: {ref.serviceName} • Reason: {ref.reason} • Tier: {ref.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#D63927] font-mono text-base mr-2">
                      ₹{ref.refundAmount}.00
                    </span>
                    {ref.status === 'Pending Review' && (
                      <>
                        <button
                          onClick={() => onApproveRefund(ref.id)}
                          className="btn-kitsch-limca px-3 py-1.5 text-xs font-bold"
                        >
                          {isEn ? 'Approve' : 'मंजूर करें / Approve'}
                        </button>
                        <button
                          onClick={() => onRejectRefund(ref.id)}
                          className="px-3 py-1.5 bg-[#B81D1D]/10 text-[#B81D1D] hover:bg-[#B81D1D] hover:text-white border border-[#B81D1D]/30 rounded-xl text-xs font-bold transition-colors"
                        >
                          {isEn ? 'Reject' : 'अस्वीकार / Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 13: USER & ROLE MANAGEMENT ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'User Accounts & Roles' : 'उपयोगकर्ता खाते एवं भूमिकाएं / User Accounts'}
              </h2>
              <p className="text-xs text-[#5C564E]">
                Manage Staff and Admin credentials, assign RBAC permissions, and toggle active/inactive account status.
              </p>
            </div>

            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs">
              {userAccounts.map((acc) => (
                <div key={acc.userId} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#1C1B1A] font-bold">{acc.name}</strong>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                          acc.role === 'admin'
                            ? 'bg-[#F5B82E] text-[#1C1B1A] border-[#1C1B1A]/20'
                            : acc.role === 'staff'
                            ? 'bg-[#288D43]/20 text-[#288D43] border-[#288D43]/30'
                            : 'bg-[#1E75B8]/20 text-[#1E75B8] border-[#1E75B8]/30'
                        }`}
                      >
                        {acc.role}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          acc.status === 'active'
                            ? 'text-[#288D43]'
                            : 'text-[#B81D1D]'
                        }`}
                      >
                        {acc.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[#5C564E] block text-[11px] mt-0.5 font-mono">
                      Email: {acc.email} • Phone: {acc.phone} • Joined: {acc.joinedDate}
                    </span>
                  </div>

                  <div>
                    <button
                      onClick={() => handleToggleUserStatus(acc.userId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        acc.status === 'active'
                          ? 'bg-[#B81D1D]/10 text-[#B81D1D] hover:bg-[#B81D1D] hover:text-white border-[#B81D1D]/30'
                          : 'btn-kitsch-limca'
                      }`}
                    >
                      {acc.status === 'active'
                        ? isEn
                          ? 'Deactivate'
                          : 'खाता रोकें / Deactivate'
                        : isEn
                        ? 'Activate'
                        : 'सक्रिय करें / Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 14: AUDIT LOGS ==================== */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'System Audit Trail' : 'सिस्टम ऑडिट ट्रेल / System Audit Trail'}
              </h2>
              <p className="text-xs text-[#5C564E]">Immutable ledger of all salon operations, AI calls, and automated emails.</p>
            </div>

            <div className="glass-panel divide-y divide-[#1C1B1A]/10 text-xs font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#5C564E] text-[11px]">{log.timestamp}</span>
                      <strong className="text-[#1C1B1A] font-bold">{log.action}</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#F6EFE2] text-[#1C1B1A] font-bold border border-[#1C1B1A]/15">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-[#5C564E] text-[11px] mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[11px] text-[#5C564E]">By {log.user} ({log.role})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 15: BACKUP & RECOVERY ==================== */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Data Backup & Security' : 'डेटा बैकअप एवं सुरक्षा / Backup & Recovery'}
              </h2>
              <p className="text-xs text-[#5C564E]">Automated snapshots of salon ledger and customer history.</p>
            </div>
            <div className="p-6 glass-panel text-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-[#1C1B1A] block">
                    {isEn ? 'Daily Automated Snapshot' : 'दैनिक स्वचालित स्नैपशॉट / Daily Snapshot'}
                  </strong>
                  <span className="text-[#5C564E] text-[11px] font-mono">Last encrypted backup completed today at 04:00 AM</span>
                </div>
                <button className="btn-kitsch-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5">
                  <Download size={14} /> {isEn ? 'Download Backup' : 'बैकअप डाउनलोड करें'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 16: SYSTEM SETTINGS ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="glass-panel p-4">
              <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
                {isEn ? 'Salon System Settings' : 'सैलून सिस्टम विन्यास / System Settings'}
              </h2>
              <p className="text-xs text-[#5C564E]">Operational parameters and AI engine configuration.</p>
            </div>
            <div className="p-6 glass-panel text-xs space-y-4 font-mono">
              <div className="flex justify-between items-center pb-3 border-b border-[#1C1B1A]/10">
                <span className="font-bold text-[#1C1B1A]">
                  {isEn ? 'Salon Operating Hours:' : 'सैलून समय / Salon Hours:'}
                </span>
                <span className="text-[#1C1B1A] font-bold">09:00 AM – 09:00 PM</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#1C1B1A]/10">
                <span className="font-bold text-[#1C1B1A]">
                  {isEn ? 'Max Daily Tokens:' : 'अधिकतम दैनिक टोकन / Max Tokens:'}
                </span>
                <span className="text-[#1C1B1A] font-bold">25 Tokens / Day</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#1C1B1A]/10">
                <span className="font-bold text-[#1C1B1A]">
                  {isEn ? 'AI Voice Engine:' : 'AI वॉयस इंजन / AI Voice Engine:'}
                </span>
                <span className="text-[#288D43] font-bold">Web Speech Synthesis Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1C1B1A]">
                  {isEn ? 'Default Buffer Time:' : 'डिफ़ॉल्ट बफर समय / Buffer Time:'}
                </span>
                <span className="text-[#1C1B1A] font-bold">5 Minutes per service</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 17: PROFILE ==================== */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto glass-panel p-6 shadow-glass-lg space-y-4 text-xs font-mono">
            <h2 className="text-lg font-bold text-[#1C1B1A] font-hindi">
              {isEn ? 'Administrator Profile' : 'प्रबंधक प्रोफ़ाइल / Admin Profile'}
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 flex justify-between">
                <span className="text-[#5C564E]">Name:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.name}</span>
              </div>
              <div className="p-3 bg-[#F6EFE2]/80 rounded-xl border border-[#1C1B1A]/15 flex justify-between">
                <span className="text-[#5C564E]">Email:</span>
                <span className="font-bold text-[#1C1B1A]">{user?.email}</span>
              </div>
              <div className="p-3 bg-[#FFF9E6]/90 rounded-xl border border-[#F5B82E]/40 flex justify-between">
                <span className="text-[#5C564E]">Role Authority:</span>
                <span className="font-bold text-[#D63927] uppercase">Master Administrator / General Manager</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
