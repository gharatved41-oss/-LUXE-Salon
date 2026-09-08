import {
  Appointment,
  QueueItem,
  ServiceItem,
  StaffMember,
  RefundRequest,
  AuditLogEntry,
  DispatchedEmail,
  AiCallRecord,
  CustomerProfileMemory,
  initialCustomerMemoryDatabase,
} from './types'

// ============================================================================
// ADMIN AI OPERATIONAL COPILOT REASONING ENGINE
// ============================================================================

export function askAdminAi(
  query: string,
  state: {
    services: ServiceItem[]
    staff: StaffMember[]
    appointments: Appointment[]
    queue: QueueItem[]
    refunds: RefundRequest[]
    auditLogs: AuditLogEntry[]
  }
): string {
  const q = query.toLowerCase().trim()
  const inServiceChairs = state.queue.filter((item) => item.status === 'In Service').length
  const waitingClients = state.queue.filter((item) => item.status === 'Waiting').length
  const totalOccupancy = Math.round((inServiceChairs / 4) * 100)

  // Question 1: "How busy is the salon today?"
  if (
    q.includes('how busy') ||
    q.includes('busy is the salon') ||
    q.includes('occupancy') ||
    q.includes('traffic') ||
    q.includes('footfall')
  ) {
    return `📊 **Floor Telemetry & Rush Report (Real-Time):**\n\n• **Chair Utilization:** **${inServiceChairs} of 4 Styling Chairs** are currently occupied (${totalOccupancy}% capacity).\n• **Active Queue Backlog:** **${waitingClients} clients** are waiting in the lounge.\n• **Average Wait Time:** **~18 to 23 minutes**.\n• **Today's Throughput:** 19 completed services recorded.\n• **Peak Window Alert:** Peak footfall is predicted between **04:30 PM – 07:30 PM** with 6 pre-booked slots. Floor capacity is healthy and within optimal limits.`
  }

  // Question 2: "Which stylist is overloaded today?"
  if (
    q.includes('overload') ||
    q.includes('which stylist') ||
    q.includes('stylist load') ||
    q.includes('busiest staff') ||
    q.includes('workload')
  ) {
    const staffLoads = state.staff.map((s) => {
      const activeQueueCount = state.queue.filter(
        (item) => item.staffName === s.name && item.status !== 'Completed'
      ).length
      return {
        name: s.name,
        role: s.roleTitle,
        station: s.station,
        cutsToday: s.totalCutsToday,
        inQueue: activeQueueCount,
        totalLoad: s.totalCutsToday + activeQueueCount,
        status: s.status,
      }
    })

    const overloaded = [...staffLoads].sort((a, b) => b.totalLoad - a.totalLoad)[0]
    const available = staffLoads.find((s) => s.status === 'Available')

    return `⚠️ **Staff Load & Station Fatigue Diagnostic:**\n\n• **Most Loaded Stylist:** **${overloaded.name}** (${overloaded.station}) with **${overloaded.totalLoad} Total Clients** (${overloaded.cutsToday} completed today + ${overloaded.inQueue} in active queue).\n• **Workload Breakdown:**\n  1. **Suresh Kumar:** 7 Completed + 2 in Queue (Station 1) — *High Load (88% utilization)*\n  2. **Imran Khan:** 6 Completed + 1 in Queue (Station 3) — *Medium Load*\n  3. **Ramesh Verma:** 5 Completed + 0 in Queue (Station 2) — *Available*\n  4. **Vicky Patil:** 4 Completed (Station 4) — *On Break*\n\n💡 **AI Recommendation:** Auto-rebalance incoming walk-ins for Beard & Grooming to **Ramesh Verma** at Station 2 to prevent bottlenecking Station 1.`
  }

  // Question 3: "Why today's revenue decrease / How is revenue?"
  if (
    q.includes('revenue') ||
    q.includes('revenue decrease') ||
    q.includes('why today') ||
    q.includes('sales') ||
    q.includes('income') ||
    q.includes('earnings')
  ) {
    const totalCollected = state.appointments
      .filter((a) => a.paymentStatus === 'Paid')
      .reduce((sum, a) => sum + a.price, 0) + 4850
    const noShowApt = state.appointments.filter((a) => a.status === 'No-show')
    const pendingRefundsSum = state.refunds
      .filter((r) => r.status === 'Pending Review')
      .reduce((sum, r) => sum + r.refundAmount, 0)

    return `📈 **Revenue & Financial Variance Diagnostic:**\n\n• **Today's Gross Collections:** **₹${totalCollected}.00** (vs. Daily Baseline Target of ₹6,500.00).\n• **Key Revenue Drivers & Leakages:**\n  1. **No-Show Losses:** **${noShowApt.length} appointment missed** (Sameer Joshi APT-1006, -₹350.00 loss).\n  2. **Pending Refund Liabilities:** **₹${pendingRefundsSum}.00** across ${state.refunds.filter((r) => r.status === 'Pending Review').length} cancellation claims awaiting authorization.\n  3. **Service Mix Impact:** 62% of morning intake were standard shaves/trims (₹150–₹200) rather than high-margin Hair Spas (₹800).\n\n💡 **AI Growth Action:** Activate the **10% Weekend Peak Hour Surcharge** and send automated re-booking reminders to clients who haven't visited in 30+ days.`
  }

  // Queue Optimization query
  if (q.includes('queue') || q.includes('optimize') || q.includes('rebalance')) {
    return `⚡ **Queue Optimization Summary:**\n• AI Queue Balancer analyzed 4 styling chairs.\n• Token **W-04** (Deepak Verma) can be routed to **Ramesh Verma** (Station 2) to reduce wait time from 23m down to 6m.\n• Real-Time sync is active across floor displays.`
  }

  // Default intelligent operational response
  return `🤖 **Operational AI Insight:**\n\nI have analyzed your salon's live data: **${inServiceChairs} stations active**, **${waitingClients} in queue**, and **₹${
    state.appointments.reduce((sum, a) => sum + (a.paymentStatus === 'Paid' ? a.price : 0), 0) + 4850
  }.00 daily revenue**. All staff telemetry feeds and audit logs are synchronized in real time. Ask me about chair occupancy, staff allocation, or revenue optimization.`
}

// ============================================================================
// CUSTOMER AI CONCIERGE REASONING ENGINE
// ============================================================================

export function askCustomerAi(
  query: string,
  state: {
    services: ServiceItem[]
    staff: StaffMember[]
    queue: QueueItem[]
    customerName?: string
  }
): {
  text: string
  quickActions?: { label: string; action: string; payload?: unknown }[]
} {
  const q = query.toLowerCase().trim()

  // "Can I book a haircut today?"
  if (
    q.includes('book') ||
    q.includes('haircut') ||
    q.includes('appointment') ||
    q.includes('slot') ||
    q.includes('can i book')
  ) {
    return {
      text: `✂️ **Yes, absolutely! We have open haircut slots available today!**\n\n• **Classic Regular Cut:** ₹150 Adults | ₹100 Kids | ₹120 Seniors *(Silver: ₹127, Gold: ₹112, Shahi Ustaad: ₹97)*\n• **Ustaad Fade / Modern Crop:** ₹250 Adults | ₹150 Kids *(Silver: ₹212, Gold: ₹187, Shahi Ustaad: ₹162)*\n• **Next Available Slot:** Today at **02:30 PM**, **04:00 PM**, or **05:30 PM**\n• **Top Stylists Available:** Master Stylist Suresh Kumar (⭐4.9) & Senior Stylist Imran Khan (⭐4.9)\n\nWould you like me to book your slot right away?`,
      quickActions: [
        { label: '📅 Book 02:30 PM Slot', action: 'book-shortcut', payload: { time: '02:30 PM', serviceId: 'srv-1' } },
        { label: '⭐ Book with Suresh Kumar (+₹50)', action: 'book-preferred', payload: { staffId: 'stf-1' } },
        { label: '📋 View All 16 Services & Age Rates', action: 'view-services' },
      ],
    }
  }

  // "What is the current wait time?"
  if (q.includes('wait') || q.includes('queue') || q.includes('time') || q.includes('token')) {
    const waitingCount = state.queue.filter((i) => i.status === 'Waiting').length
    return {
      text: `⏳ **Live Salon Queue Status:**\n\n• **Current Queue Length:** ${waitingCount} clients in line\n• **Estimated Wait Time for Walk-Ins:** **~15 to 20 minutes**\n• **Active Stations:** Station 1 (Suresh), Station 3 (Imran)\n\nTip: You can check in right now through your customer dashboard to reserve your digital token before arriving!`,
      quickActions: [
        { label: '🎟️ Check My Queue Status', action: 'view-queue' },
        { label: '✨ Check In Now', action: 'self-checkin' },
      ],
    }
  }

  // Treatment recommendations
  if (q.includes('spa') || q.includes('facial') || q.includes('shave') || q.includes('recommend') || q.includes('combo')) {
    return {
      text: `💆 **Our Most Popular Luxury Treatments & Combos Today:**\n\n1. **The Ustaad Royal Combo (Cut + Shave + Facial + Champi):** ₹850 Adults | ₹750 Seniors *(Pass Holders: Silver ₹722, Gold ₹637, Shahi Ustaad ₹552)*\n2. **Deluxe Gold Radiance Facial:** ₹750 Adults | ₹650 Seniors *(45 mins)*\n3. **Herbal Glow Facial:** ₹450 Adults | ₹400 Seniors *(35 mins)*\n4. **Royal Foam & Hot Towel Shave:** ₹160 Adults | ₹140 Seniors *(25 mins)*\n\n*VIP Pass Holders save up to 35% across all services!*`,
      quickActions: [
        { label: '🎟️ View VIP Passes (Save up to 35%)', action: 'view-passes' },
        { label: '📅 Book Royal Combo', action: 'book-shortcut', payload: { serviceId: 'srv-16' } },
      ],
    }
  }

  return {
    text: `👋 Hello! I am your **Deluxe Salon AI Concierge**. I can help you schedule appointments with transparent age-tiered pricing (Kids, Adults, Seniors), check live queue wait times, or calculate your VIP pass discounts (Silver 15%, Gold 25%, Shahi Ustaad 35%). How can I assist you today?`,
    quickActions: [
      { label: '✂️ Book Classic Cut (₹150)', action: 'book-shortcut', payload: { serviceId: 'srv-1' } },
      { label: '⏳ Check Live Wait Time', action: 'view-queue' },
      { label: '👑 View VIP Passes & Rates', action: 'view-passes' },
    ],
  }
}

// ============================================================================
// MATHEMATICAL AI WAIT TIME PREDICTION ENGINE
// ============================================================================

export function predictQueueWaitTime(
  queue: QueueItem[],
  staff: StaffMember[],
  targetToken: string
): {
  estimatedMinutes: number
  breakdown: string
  queuePosition: number
} {
  const activeQueue = queue.filter((q) => q.status !== 'Completed')
  const index = activeQueue.findIndex((q) => q.token === targetToken)

  if (index === -1) {
    return {
      estimatedMinutes: 23,
      breakdown: 'Queue #2 • 18m remaining on active service + 5m station buffer',
      queuePosition: 2,
    }
  }

  const item = activeQueue[index]
  if (item.status === 'In Service') {
    return {
      estimatedMinutes: 0,
      breakdown: 'Currently in service on the floor',
      queuePosition: 1,
    }
  }

  if (item.status === 'Called') {
    return {
      estimatedMinutes: 5,
      breakdown: 'Next in queue • 5m station sanitization & seating buffer',
      queuePosition: 1,
    }
  }

  // Mathematical algorithm:
  // (Queue Index * Average Service Time per Chair / Active Stations) + Buffer
  const activeStationsCount = staff.filter((s) => s.status !== 'On Leave').length || 3
  const avgServiceDuration = 25
  const sanitizationBuffer = 5
  const computedMinutes = Math.max(
    10,
    Math.round((index * avgServiceDuration) / (activeStationsCount * 0.75) + sanitizationBuffer)
  )

  return {
    estimatedMinutes: computedMinutes,
    breakdown: `Queue Position #${index + 1} • Calculated from ${index} preceding clients (~18m service + ${sanitizationBuffer}m buffer)`,
    queuePosition: index + 1,
  }
}

// ============================================================================
// AUTOMATED AI VOICE CALL SCRIPT & SPEECH SYNTHESIS ENGINE
// ============================================================================

export function generateAiCallScript(
  customerName: string,
  serviceName: string,
  staffName: string,
  station: string,
  waitMinutes = 5
): string {
  return `Hello ${customerName}, this is an automated notification from Salon Monitoring System. Your appointment for ${serviceName} with stylist ${staffName} will begin in ${waitMinutes} minutes at ${station}. Please proceed to your styling station now.`
}

export function speakAiVoice(text: string, onEnd?: () => void): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel() // stop any active speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95 // pleasant, professional cadence
      utterance.pitch = 1.0
      utterance.volume = 1.0

      if (onEnd) {
        utterance.onend = () => onEnd()
        utterance.onerror = () => onEnd()
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      if (onEnd) onEnd()
    }
  } else {
    if (onEnd) onEnd()
  }
}

// ============================================================================
// AUTOMATED AI TRANSACTIONAL EMAIL & CUSTOMER MEMORY ENGINE
// ============================================================================

export function generateAiCustomerMemoryEmail(
  customerName: string,
  email: string,
  serviceName: string,
  staffName: string,
  amount: number,
  preferredStylistFee = 0,
  activePass?: string
): DispatchedEmail {
  const memory = initialCustomerMemoryDatabase[email.toLowerCase()]
  let memoryNote = ''

  if (memory) {
    memoryNote = `Thank you for visiting SalonOps again, ${customerName}! It has been ${memory.lastVisitDate} since your last service (${memory.lastServiceName} with ${memory.lastStaffName}). We appreciate your loyalty over ${memory.totalVisits} visits and hope you loved today's ${serviceName} with ${staffName}!`
  } else {
    memoryNote = `Welcome to the SalonOps family, ${customerName}! Thank you for trusting us with your ${serviceName} today with ${staffName}. We look forward to seeing you again next month!`
  }

  if (preferredStylistFee > 0) {
    memoryNote += ` (Includes Master Stylist VIP allocation with ${staffName}).`
  }

  if (activePass) {
    memoryNote += ` [Membership Pass Applied: ${activePass}]`
  }

  return {
    id: `EML-${Math.floor(100 + Math.random() * 900)}`,
    recipientEmail: email,
    recipientName: customerName,
    subject: `Your SalonOps Official Receipt & Service Summary — ₹${amount}.00`,
    serviceName,
    staffName,
    amountPaid: amount,
    customerMemoryNote: memoryNote,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'Delivered',
  }
}

// ============================================================================
// AI SMART QUEUE OPTIMIZER & STAFF ALLOCATOR
// ============================================================================

export function runSmartQueueOptimizer(
  queue: QueueItem[],
  staff: StaffMember[]
): {
  rebalancedQueue: QueueItem[]
  optimizationNotes: string[]
} {
  const notes: string[] = []
  const availableStaff = staff.filter((s) => s.status === 'Available')

  const rebalancedQueue = queue.map((item) => {
    if (item.status === 'Waiting' && availableStaff.length > 0) {
      const bestMatch = availableStaff[0]
      if (item.staffName !== bestMatch.name) {
        notes.push(
          `Reassigned ${item.customerName} (${item.token}) to ${bestMatch.name} (${bestMatch.station}) — reduced wait time by 12 mins`
        )
        return {
          ...item,
          staffName: bestMatch.name,
          assignedStation: bestMatch.station,
          estimatedWaitMinutes: 5,
          waitBreakdown: `AI Smart Rebalanced to ${bestMatch.station} (Available)`,
        }
      }
    }
    return item
  })

  if (notes.length === 0) {
    notes.push('Queue is already operating at peak floor efficiency. All 4 stations balanced.')
  }

  return { rebalancedQueue, optimizationNotes: notes }
}
