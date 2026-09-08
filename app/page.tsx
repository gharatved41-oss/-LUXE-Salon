'use client'

import React, { useState } from 'react'
import {
  Scissors,
  Bell,
  LogOut,
  Shield,
  CheckCircle2,
  Sparkles,
  GitBranch,
  X,
  AlertTriangle,
  User,
  Bot,
  PhoneCall,
  Mail,
  Radio,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { AuthProvider, useAuth, RoleGuard } from '@/lib/auth'
import { LanguageProvider, useLanguage } from '@/lib/language'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import CommonLoginPage from '@/components/auth/CommonLoginPage'
import CustomerPortal from '@/components/customer/CustomerPortal'
import StaffPortal from '@/components/staff/StaffPortal'
import AdminPortal from '@/components/admin/AdminPortal'
import { PaymentReceiptModal } from '@/components/shared/CommonModals'
import AdminAiChatModal from '@/components/ai/AdminAiChatModal'
import CustomerAiChatModal from '@/components/ai/CustomerAiChatModal'
import AiVoiceCallModal from '@/components/ai/AiVoiceCallModal'
import AiEmailViewerModal from '@/components/ai/AiEmailViewerModal'
import {
  Appointment,
  QueueItem,
  ServiceItem,
  StaffMember,
  RefundRequest,
  AuditLogEntry,
  ReceiptData,
  StaffAvailability,
  DispatchedEmail,
  AiCallRecord,
  initialServices,
  initialStaff,
  initialAppointments,
  initialQueue,
  initialAuditLogs,
  initialRefunds,
  initialDispatchedEmails,
  initialAiCalls,
} from '@/lib/types'
import {
  generateAiCallScript,
  generateAiCustomerMemoryEmail,
  predictQueueWaitTime,
} from '@/lib/aiEngine'

function MainAppContent() {
  const { user, isLoading, logout } = useAuth()
  const { t, language } = useLanguage()

  // Real-Time Core Domain Data
  const [services, setServices] = useState<ServiceItem[]>(initialServices)
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs)
  const [refunds, setRefunds] = useState<RefundRequest[]>(initialRefunds)
  const [dispatchedEmails, setDispatchedEmails] = useState<DispatchedEmail[]>(initialDispatchedEmails)

  // AI & Modals States
  const [isAdminAiModalOpen, setIsAdminAiModalOpen] = useState(false)
  const [isCustomerAiModalOpen, setIsCustomerAiModalOpen] = useState(false)
  const [activeAiCallRecord, setActiveAiCallRecord] = useState<AiCallRecord | null>(null)
  const [previewEmail, setPreviewEmail] = useState<DispatchedEmail | null>(null)
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null)
  const [toastMessage, setToastMessage] = useState<string>('')

  // Deluxe Saloon Retro Radio Ambience Bar (deluxesalonmusic.in inspiration)
  const [isRadioPlaying, setIsRadioPlaying] = useState(true)
  const [activeRadioStation, setActiveRadioStation] = useState('Vividh Bharati 90s Hits')

  const radioStations = [
    'Vividh Bharati 90s Hits',
    'Chai Tapri Classic Ghazals',
    'Barber Chair Lo-Fi Beats',
    'Old Saloon Radio Mirchi',
  ]

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(''), 3000)
  }

  // Audit Logger
  const logAudit = (
    action: string,
    category: AuditLogEntry['category'],
    details: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: user?.name || 'System User',
      role: user?.role === 'admin' ? 'Admin' : user?.role === 'staff' ? 'Staff' : 'Customer',
      action,
      category,
      details,
    }
    setAuditLogs((prev) => [newLog, ...prev])
  }

  // 1. Handle Booking with AI prediction
  const handleBookAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev])
    logAudit('Appointment Booked', 'Booking', `Booked ${newApt.serviceName} for ${newApt.customerName} (₹${newApt.finalPrice || newApt.price})`)
    showToast(`Appointment ${newApt.id} scheduled successfully!`)
  }

  // 2. Handle Check-in and queue token issuance with AI Wait Time breakdown
  const handleCheckIn = (aptId: string) => {
    const apt = appointments.find((a) => a.id === aptId)
    if (!apt) return

    const token = `T-${Math.floor(10 + Math.random() * 90)}`
    const waitPred = predictQueueWaitTime(queue, staff, token)

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId
          ? {
              ...a,
              status: 'Checked-in',
              queueToken: token,
              checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : a
      )
    )

    const newQueueItem: QueueItem = {
      token,
      appointmentId: apt.id,
      customerName: apt.customerName,
      customerPhone: apt.customerPhone,
      serviceName: apt.serviceName,
      staffName: apt.staffName,
      assignedStation: staff.find((s) => s.id === apt.staffId)?.station || 'Station 1',
      estimatedWaitMinutes: waitPred.estimatedMinutes,
      waitBreakdown: waitPred.breakdown,
      status: 'Waiting',
      isWalkIn: false,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setQueue((prev) => [...prev, newQueueItem])
    logAudit('Customer Check-In', 'Queue', `Assigned Token ${token} to ${apt.customerName} (AI ETA: ~${waitPred.estimatedMinutes}m)`)
    showToast(`Checked in! Token #${token} issued (AI ETA: ~${waitPred.estimatedMinutes}m).`)
  }

  // 3. Handle Walk-in with AI estimation
  const handleAddWalkIn = (walkIn: QueueItem) => {
    setQueue((prev) => [...prev, walkIn])
    logAudit('Walk-In Added', 'Queue', `Issued ${walkIn.token} to ${walkIn.customerName} (AI ETA: ~${walkIn.estimatedWaitMinutes}m)`)
    showToast(`Walk-in Token ${walkIn.token} added to queue.`)
  }

  // 4. Trigger Automated AI Voice Call (Feature 3!)
  const handleTriggerAiVoiceCall = (item: QueueItem) => {
    const script = generateAiCallScript(
      item.customerName,
      item.serviceName,
      item.staffName,
      item.assignedStation,
      5
    )

    const callRec: AiCallRecord = {
      id: `CALL-${Date.now().toString().slice(-3)}`,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      serviceName: item.serviceName,
      staffName: item.staffName,
      station: item.assignedStation,
      spokenMessage: script,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Connected',
      durationSeconds: 12,
    }

    setActiveAiCallRecord(callRec)
    logAudit('Automated AI Call', 'AI Call', `Placed voice call to ${item.customerName} (${item.customerPhone}) — 5 min arrival alert for ${item.assignedStation}`)
    showToast(`AI Automated Call placed to ${item.customerName}!`)
  }

  // 5. Update Appointment Status
  const handleUpdateAppointmentStatus = (aptId: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status } : a))
    )
    logAudit('Appointment Status Updated', 'Booking', `Apt ${aptId} status set to ${status}`)
    showToast(`Appointment status changed to ${status}`)
  }

  // 6. Update Queue Status
  const handleUpdateQueueStatus = (token: string, status: QueueItem['status']) => {
    setQueue((prev) =>
      prev.map((q) => (q.token === token ? { ...q, status } : q))
    )

    const item = queue.find((q) => q.token === token)
    if (status === 'Called' && item) {
      // Auto-trigger voice call on call if not already called
      handleTriggerAiVoiceCall(item)
    }

    logAudit('Queue Status Updated', 'Queue', `Token ${token} updated to ${status}`)
    showToast(`Token #${token} is now ${status}`)
  }

  // 7. Update Staff Availability
  const handleUpdateStaffStatus = (staffId: string, status: StaffAvailability) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status } : s))
    )
    logAudit('Staff Availability Changed', 'Staff', `Staff ${staffId} set to ${status}`)
    showToast(`Stylist availability updated to ${status}`)
  }

  // 8. Request / Approve / Reject Refund
  const handleRequestRefund = (req: RefundRequest) => {
    setRefunds((prev) => [req, ...prev])
    logAudit('Refund Requested', 'Refund', `Refund ${req.id} created for ${req.customerName}`)
    showToast(`Refund request ${req.id} submitted for review.`)
  }

  const handleApproveRefund = (refundId: string) => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: 'Approved',
              processedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : r
      )
    )
    logAudit('Refund Approved', 'Refund', `Manager authorized reversal for ${refundId}`)
    showToast(`Refund ${refundId} approved and reversed!`)
  }

  const handleRejectRefund = (refundId: string) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === refundId ? { ...r, status: 'Rejected' } : r))
    )
    logAudit('Refund Rejected', 'Refund', `Manager rejected request ${refundId}`)
    showToast(`Refund ${refundId} marked as rejected.`)
  }

  // 9. Catalog Management
  const handleAddService = (service: ServiceItem) => {
    setServices((prev) => [...prev, service])
    logAudit('Service Created', 'Admin', `Added new catalog service: ${service.name}`)
    showToast(`Service "${service.name}" added to menu!`)
  }

  const handleToggleService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, active: !s.active } : s))
    )
    logAudit('Service Toggled', 'Admin', `Service ${serviceId} availability toggled`)
  }

  // 10. Process Payment, Generate Receipt & Dispatch AI Customer Memory Email (Feature 5!)
  const handleProcessPayment = (
    aptId: string,
    method: 'Cash' | 'UPI' | 'Card',
    phone?: string
  ) => {
    const apt = appointments.find((a) => a.id === aptId)
    if (!apt) return

    const receiptNumber = `REC-${Math.floor(100 + Math.random() * 900)}`
    const finalAmount = apt.finalPrice || apt.price
    const finalPhone = phone || apt.customerPhone

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId
          ? {
              ...a,
              paymentStatus: 'Paid',
              paymentMethod: method,
              receiptId: receiptNumber,
              customerPhone: finalPhone,
            }
          : a
      )
    )

    // Generate AI Transactional Email with Customer Memory
    const customerEmail =
      apt.customerName.toLowerCase() === 'rahul sharma'
        ? 'rahul@customer.com'
        : `${apt.customerName.toLowerCase().replace(/\s+/g, '')}@example.com`

    const aiEmail = generateAiCustomerMemoryEmail(
      apt.customerName,
      customerEmail,
      apt.serviceName,
      apt.staffName,
      finalAmount,
      apt.preferredStylistFee || 0,
      'Monthly Pass'
    )

    setDispatchedEmails((prev) => [aiEmail, ...prev])

    logAudit('Payment Collected', 'Payment', `Collected ₹${finalAmount} via ${method} for ${apt.id} (Receipt #${receiptNumber})`)
    logAudit('AI Email Dispatched', 'AI Email', `Sent personalized Customer Memory receipt to ${customerEmail}`)

    showToast(`Payment collected! Automated AI email dispatched to ${customerEmail}.`)

    setActiveReceipt({
      receiptNumber,
      appointmentId: apt.id,
      customerName: apt.customerName,
      customerPhone: finalPhone,
      serviceName: apt.serviceName,
      staffName: apt.staffName,
      amount: finalAmount,
      preferredStylistFee: apt.preferredStylistFee,
      membershipDiscount: apt.membershipDiscount,
      paymentMethod: method,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }

  // 11. AI Queue Rebalancing
  const handleApplyQueueOptimization = (rebalancedQueue: QueueItem[]) => {
    setQueue(rebalancedQueue)
    logAudit('AI Queue Optimizer', 'Queue', 'Floor styling stations rebalanced by AI optimizer')
    showToast('AI Queue optimization applied to floor!')
  }

  // Session loading check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center text-[#1C1B1A] text-xs font-mono font-bold">
        <div className="flex items-center gap-2.5 p-4 glass-card rounded-2xl shadow-glass">
          <div className="w-5 h-5 border-2 border-[#D63927] border-t-transparent rounded-full animate-spin" />
          <span>{t('verifyingSession')}</span>
        </div>
      </div>
    )
  }

  // 1. Unauthenticated: Render Common Login Page
  if (!user) {
    return <CommonLoginPage />
  }

  // Get role translation
  const roleDisplay =
    user.role === 'admin'
      ? t('roleAdmin')
      : user.role === 'staff'
      ? t('roleStaff')
      : t('roleCustomer')

  // 2. Authenticated: Render Header + Retro Radio Ambience Bar + Role-Guarded Portal
  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      {/* ================================================================
          TOPBAR: VINTAGE INDIAN SALOON BRANDING, NIMBU CHARM & ROLE TELEMETRY
          ================================================================ */}
      <header className="bg-[#1C1B1A] text-[#FFFDF9] border-b-2 border-[#1C1B1A] sticky top-0 z-30 shadow-kitsch">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Hanging Nimbu-Mirchi Telemetry Charm */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D63927] border-2 border-white overflow-hidden flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/images/salon_logo.jpg"
                alt="डिLUXE Salon Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-hindi font-bold text-[#F5B82E] text-base tracking-wide">
                  {t('salonTitle')}
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-[#E8DAC1]">
                  • {t('salonSubtitle')}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                    user.role === 'admin'
                      ? 'bg-[#F5B82E] text-[#1C1B1A] border-white'
                      : user.role === 'staff'
                      ? 'bg-[#288D43] text-white border-white'
                      : 'bg-[#D63927] text-white border-white'
                  }`}
                >
                  {roleDisplay} {t('portalSuffix')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {/* Nimbu-Mirchi Hanging Charm Tooltip */}
                <div
                  className="nimbu-charm cursor-pointer flex items-center gap-1 text-[11px] font-mono text-[#E8DAC1]"
                  title={t('telemetryTooltip')}
                >
                  <span className="text-sm">🍋🌶️</span>
                  <span className="text-[10px] text-[#288D43] font-bold">{t('telemetry')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Session, Language Switcher & AI Quick Launchers */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Global Language Switcher Dropdown */}
            <LanguageSwitcher variant="header" />

            {user.role === 'admin' && (
              <button
                onClick={() => setIsAdminAiModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5B82E] text-[#1C1B1A] border-2 border-white text-xs font-bold shadow-xs hover:bg-[#e5a820] transition-colors"
                title="Open AI Operational Copilot"
              >
                <Bot size={14} className="text-[#D63927]" />
                <span>{t('aiCopilot')}</span>
              </button>
            )}

            {user.role === 'customer' && (
              <button
                onClick={() => setIsCustomerAiModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5B82E] text-[#1C1B1A] border-2 border-white text-xs font-bold shadow-xs hover:bg-[#e5a820] transition-colors"
                title="Open AI Concierge"
              >
                <Sparkles size={14} className="text-[#D63927]" />
                <span>{t('aiConcierge')}</span>
              </button>
            )}

            <div className="hidden md:flex flex-col text-right font-mono">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <span className="text-[10px] text-[#E8DAC1]">{user.email}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B81D1D] hover:bg-[#961717] text-white border-2 border-white/30 text-xs font-bold transition-colors shadow-xs"
              title={t('logout')}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================
          DELUXE SALOON RETRO RADIO AMBIENCE BAR (Inspiration: deluxesalonmusic.in)
          ================================================================ */}
      <div className="bg-[#FFF9E6] border-b-2 border-[#1C1B1A] px-4 py-2 flex flex-wrap items-center justify-between text-xs text-[#1C1B1A] shadow-xs">
        <div className="flex items-center gap-2 font-mono">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#D63927] text-white rounded font-bold border border-[#1C1B1A]">
            <Radio size={12} className={isRadioPlaying ? 'animate-pulse' : ''} />
            <span>{t('radioTitle')}</span>
          </div>
          <span className="font-serif italic hidden md:inline">
            &ldquo;{t('radioTagline')}&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1 sm:mt-0 font-mono">
          <span className="text-[11px] text-[#5C564E] hidden sm:inline">{t('station')}:</span>
          <select
            value={activeRadioStation}
            onChange={(e) => setActiveRadioStation(e.target.value)}
            className="p-1 bg-white border border-[#1C1B1A] rounded text-[11px] font-bold outline-none"
          >
            {radioStations.map((st) => (
              <option key={st} value={st}>
                📻 {st}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsRadioPlaying(!isRadioPlaying)}
            className="p-1 bg-[#1C1B1A] text-[#F5B82E] rounded border border-white/40 shadow-xs"
            title={isRadioPlaying ? 'Mute Radio' : 'Unmute Radio'}
          >
            {isRadioPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>
      </div>

      {/* Global Toast Alert (Matchbox Pill Style) */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1C1B1A] text-[#FFFDF9] text-xs font-bold px-4 py-2.5 rounded-xl shadow-kitsch-lg border-2 border-[#F5B82E] flex items-center gap-2 animate-fadeIn font-mono">
          <CheckCircle2 size={16} className="text-[#288D43]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================================================================
          ROLE-BASED REDIRECTION & ROUTE GUARDING
          ================================================================ */}
      {user.role === 'customer' && (
        <RoleGuard allowedRoles={['customer']}>
          <CustomerPortal
            services={services}
            staff={staff}
            appointments={appointments}
            queue={queue}
            refunds={refunds}
            onBookAppointment={handleBookAppointment}
            onCheckIn={handleCheckIn}
            onRequestRefund={handleRequestRefund}
            onOpenReceipt={(rec) => setActiveReceipt(rec)}
            onOpenAiChat={() => setIsCustomerAiModalOpen(true)}
          />
        </RoleGuard>
      )}

      {user.role === 'staff' && (
        <RoleGuard allowedRoles={['staff', 'admin']}>
          <StaffPortal
            services={services}
            staff={staff}
            appointments={appointments}
            queue={queue}
            refunds={refunds}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onAddWalkIn={handleAddWalkIn}
            onUpdateQueueStatus={handleUpdateQueueStatus}
            onUpdateStaffStatus={handleUpdateStaffStatus}
            onOpenReceipt={(rec) => setActiveReceipt(rec)}
            onProcessPayment={handleProcessPayment}
            onTriggerAiVoiceCall={handleTriggerAiVoiceCall}
          />
        </RoleGuard>
      )}

      {user.role === 'admin' && (
        <RoleGuard allowedRoles={['admin']}>
          <AdminPortal
            services={services}
            staff={staff}
            appointments={appointments}
            queue={queue}
            refunds={refunds}
            auditLogs={auditLogs}
            dispatchedEmails={dispatchedEmails}
            onApproveRefund={handleApproveRefund}
            onRejectRefund={handleRejectRefund}
            onAddService={handleAddService}
            onToggleService={handleToggleService}
            onOpenAiChat={() => setIsAdminAiModalOpen(true)}
            onOpenEmailPreview={(eml) => setPreviewEmail(eml)}
            onApplyQueueOptimization={handleApplyQueueOptimization}
          />
        </RoleGuard>
      )}

      {/* Perforated Railway Ticket Receipt Modal */}
      {activeReceipt && (
        <PaymentReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {/* Admin AI Copilot Modal */}
      <AdminAiChatModal
        isOpen={isAdminAiModalOpen}
        onClose={() => setIsAdminAiModalOpen(false)}
        services={services}
        staff={staff}
        appointments={appointments}
        queue={queue}
        refunds={refunds}
        auditLogs={auditLogs}
      />

      {/* Customer AI Concierge Modal */}
      <CustomerAiChatModal
        isOpen={isCustomerAiModalOpen}
        onClose={() => setIsCustomerAiModalOpen(false)}
        services={services}
        staff={staff}
        queue={queue}
        customerName={user.name}
      />

      {/* AI Voice Call Telephony Modal */}
      <AiVoiceCallModal
        callRecord={activeAiCallRecord}
        onClose={() => setActiveAiCallRecord(null)}
      />

      {/* AI Dispatched Email Viewer Modal */}
      <AiEmailViewerModal
        email={previewEmail}
        onClose={() => setPreviewEmail(null)}
      />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}

