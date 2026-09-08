export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked-in'
  | 'In Service'
  | 'Completed'
  | 'Cancelled'
  | 'No-show'
  | 'Refunded'

export type QueueStatus = 'Waiting' | 'Called' | 'In Service' | 'Completed' | 'Skipped' | 'Re-queued'

export type StaffAvailability = 'Available' | 'Busy' | 'On Break' | 'On Leave'

export type ServiceCategory =
  | 'Haircuts'
  | 'Beard & Shave'
  | 'Moustache'
  | 'Facial & Skin'
  | 'Signature Combos'
  | 'Hair'
  | 'Grooming'
  | 'Spa'
  | 'Facial'

export type AgeTier = 'Adults' | 'Kids' | 'Seniors'
export type PassTier = 'None' | 'Silver' | 'Gold' | 'Shahi Ustaad'

export interface ServiceItem {
  id: string
  name: string
  category: ServiceCategory
  durationMinutes: number
  bufferMinutes: number
  price: number // Base / Adult (13–59) price
  adultPrice: number // Adults (13–59)
  kidsPrice?: number | null // Kids (Under 12)
  seniorPrice?: number | null // Seniors (60+)
  description: string
  active: boolean
}

export function getPassDiscountedPrice(basePrice: number, tier: PassTier): number {
  if (tier === 'Silver') return Math.floor(basePrice * 0.85)
  if (tier === 'Gold') return Math.floor(basePrice * 0.75)
  if (tier === 'Shahi Ustaad') return Math.floor(basePrice * 0.65)
  return basePrice
}

export function calculateServicePrice(
  service: ServiceItem,
  ageTier: AgeTier = 'Adults',
  passTier: PassTier = 'None'
): {
  basePrice: number
  isEligible: boolean
  ineligibleReason?: string
  discountAmount: number
  finalPrice: number
  discountPercent: number
} {
  let basePrice = service.adultPrice || service.price
  let isEligible = true
  let ineligibleReason = undefined

  if (ageTier === 'Kids') {
    if (service.kidsPrice === null || service.kidsPrice === undefined) {
      isEligible = false
      ineligibleReason = 'Excluded for Kids (Under 12) for safety'
      basePrice = service.adultPrice || service.price
    } else {
      basePrice = service.kidsPrice
    }
  } else if (ageTier === 'Seniors') {
    if (service.seniorPrice === null || service.seniorPrice === undefined) {
      isEligible = false
      ineligibleReason = 'Not offered for Seniors (60+)'
      basePrice = service.adultPrice || service.price
    } else {
      basePrice = service.seniorPrice
    }
  }

  let discountPercent = 0
  if (passTier === 'Silver') discountPercent = 15
  else if (passTier === 'Gold') discountPercent = 25
  else if (passTier === 'Shahi Ustaad') discountPercent = 35

  const discountAmount = isEligible && discountPercent > 0
    ? Math.round(basePrice * (discountPercent / 100))
    : 0
  
  const finalPrice = Math.max(0, basePrice - discountAmount)

  return {
    basePrice,
    isEligible,
    ineligibleReason,
    discountAmount,
    finalPrice,
    discountPercent,
  }
}

export interface StaffMember {
  id: string
  name: string
  roleTitle: string
  specialties: ('Hair' | 'Grooming' | 'Spa' | 'Facial')[]
  status: StaffAvailability
  workingHours: string
  station: string
  phone: string
  rating: number
  totalCutsToday: number
  isPreferredMaster?: boolean
  preferenceFee?: number
}

export interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  serviceId: string
  serviceName: string
  staffId: string
  staffName: string
  date: string
  time: string
  durationMinutes: number
  price: number
  ageTier?: AgeTier
  passTier?: PassTier
  preferredStylistFee?: number
  membershipDiscount?: number
  finalPrice?: number
  paymentStatus: 'Pending' | 'Paid' | 'Refunded' | 'Reversed'
  paymentMethod?: 'UPI' | 'Card' | 'Cash'
  status: AppointmentStatus
  queueToken?: string
  checkedInAt?: string
  receiptId?: string
  createdAt: string
  callNotificationSent?: boolean
}

export interface QueueItem {
  token: string
  appointmentId?: string
  customerName: string
  customerPhone: string
  serviceName: string
  staffName: string
  assignedStation: string
  estimatedWaitMinutes: number
  waitBreakdown?: string
  status: QueueStatus
  isWalkIn: boolean
  joinedAt: string
  ageTier?: AgeTier
  passTier?: PassTier
  calculatedPrice?: number
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  role: 'Customer' | 'Staff' | 'Admin'
  action: string
  category: 'Booking' | 'Queue' | 'Payment' | 'Refund' | 'Staff' | 'Admin' | 'AI Call' | 'AI Email'
  details: string
}

export interface RefundRequest {
  id: string
  appointmentId: string
  customerName: string
  serviceName: string
  paidAmount: number
  refundAmount: number
  reason: string
  tier: '100% Full Refund (>60m)' | '80% Tier 2 (30-60m)' | '50% Credit (<30m)'
  status: 'Pending Review' | 'Approved' | 'Rejected'
  requestedAt: string
  processedAt?: string
}

export interface ReceiptData {
  receiptNumber: string
  appointmentId: string
  customerName: string
  customerPhone: string
  serviceName: string
  staffName: string
  amount: number
  ageTier?: AgeTier
  passTier?: PassTier
  preferredStylistFee?: number
  membershipDiscount?: number
  paymentMethod: string
  timestamp: string
}

export interface UserAccountItem {
  userId: string
  name: string
  email: string
  username: string
  phone: string
  role: 'customer' | 'staff' | 'admin'
  status: 'active' | 'inactive'
  joinedDate: string
}

// AI & Automation Specific Types
export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
  quickActions?: { label: string; action: string; payload?: unknown }[]
}

export interface AiCallRecord {
  id: string
  customerName: string
  customerPhone: string
  serviceName: string
  staffName: string
  station: string
  spokenMessage: string
  timestamp: string
  status: 'Initiated' | 'Connected' | 'Completed' | 'Acknowledged'
  durationSeconds: number
}

export interface DispatchedEmail {
  id: string
  recipientEmail: string
  recipientName: string
  subject: string
  serviceName: string
  staffName: string
  amountPaid: number
  customerMemoryNote: string
  timestamp: string
  status: 'Sent' | 'Delivered'
}

export interface MembershipPass {
  id: string
  type: string
  tierName: PassTier
  discountPercent: number
  price: number
  billingPeriod: string
  features: string[]
  activeCustomersCount: number
  status: 'Active' | 'Featured' | 'Popular'
}

export interface CustomerProfileMemory {
  customerName: string
  email: string
  phone: string
  totalVisits: number
  lastVisitDate: string
  lastServiceName: string
  lastStaffName: string
  preferredCategory: string
  favoriteStylist: string
  activePass?: string
  lifetimeSpent: number
}

// Seed Data
export const initialServices: ServiceItem[] = [
  // 1. Haircuts
  {
    id: 'srv-1',
    name: 'Classic Regular Cut',
    category: 'Haircuts',
    durationMinutes: 20,
    bufferMinutes: 5,
    price: 150,
    adultPrice: 150,
    kidsPrice: 100,
    seniorPrice: 120,
    description: 'Precision scissor and clipper cut, neat neckline taper and blow dry',
    active: true,
  },
  {
    id: 'srv-2',
    name: 'Ustaad Fade / Modern Crop',
    category: 'Haircuts',
    durationMinutes: 30,
    bufferMinutes: 5,
    price: 250,
    adultPrice: 250,
    kidsPrice: 150,
    seniorPrice: null,
    description: 'High/mid skin fade, textured crop, sharp temple alignment',
    active: true,
  },
  {
    id: 'srv-3',
    name: 'Scissor Cut & Layering',
    category: 'Haircuts',
    durationMinutes: 30,
    bufferMinutes: 5,
    price: 220,
    adultPrice: 220,
    kidsPrice: 140,
    seniorPrice: 180,
    description: 'Full handcrafted scissor cut, volume layering & texturizing',
    active: true,
  },
  {
    id: 'srv-4',
    name: 'Head Shave (Blade / Razor)',
    category: 'Haircuts',
    durationMinutes: 25,
    bufferMinutes: 5,
    price: 160,
    adultPrice: 160,
    kidsPrice: null,
    seniorPrice: 130,
    description: 'Smooth precision straight razor head shave with warm lather & cooling lotion',
    active: true,
  },

  // 2. Beard & Shave
  {
    id: 'srv-5',
    name: 'Classic Straight-Razor Shave',
    category: 'Beard & Shave',
    durationMinutes: 15,
    bufferMinutes: 5,
    price: 90,
    adultPrice: 90,
    kidsPrice: null,
    seniorPrice: 80,
    description: 'Traditional warm lather straight razor shave & alum block finish',
    active: true,
  },
  {
    id: 'srv-6',
    name: 'Royal Foam & Hot Towel Shave',
    category: 'Beard & Shave',
    durationMinutes: 25,
    bufferMinutes: 5,
    price: 160,
    adultPrice: 160,
    kidsPrice: null,
    seniorPrice: 140,
    description: 'Pre-shave essential oil, double hot towel wrap, razor shave & soothing balm',
    active: true,
  },
  {
    id: 'srv-7',
    name: 'Beard Trim & Outline (Machine)',
    category: 'Beard & Shave',
    durationMinutes: 15,
    bufferMinutes: 5,
    price: 100,
    adultPrice: 100,
    kidsPrice: null,
    seniorPrice: 90,
    description: 'Clipper length graduation and crisp cheek/neckline definition',
    active: true,
  },
  {
    id: 'srv-8',
    name: 'Designer Beard Styling & Shape',
    category: 'Beard & Shave',
    durationMinutes: 25,
    bufferMinutes: 5,
    price: 180,
    adultPrice: 180,
    kidsPrice: null,
    seniorPrice: null,
    description: 'Sharp precision razor sculpt, gradient beard fade, organic beard butter',
    active: true,
  },

  // 3. Moustache
  {
    id: 'srv-9',
    name: 'Classic Trim & Clean-up',
    category: 'Moustache',
    durationMinutes: 10,
    bufferMinutes: 5,
    price: 40,
    adultPrice: 40,
    kidsPrice: null,
    seniorPrice: 40,
    description: 'Precise scissors trim, upper lip alignment & styling',
    active: true,
  },
  {
    id: 'srv-10',
    name: 'Royal Handlebar Styling & Wax',
    category: 'Moustache',
    durationMinutes: 15,
    bufferMinutes: 5,
    price: 80,
    adultPrice: 80,
    kidsPrice: null,
    seniorPrice: 70,
    description: 'Traditional moustache shaping with organic beeswax twist & hold',
    active: true,
  },

  // 4. Facial & Skin
  {
    id: 'srv-11',
    name: 'Classic De-Tan & Scrub',
    category: 'Facial & Skin',
    durationMinutes: 20,
    bufferMinutes: 5,
    price: 250,
    adultPrice: 250,
    kidsPrice: null,
    seniorPrice: 200,
    description: 'Sun damage de-tan pack, gentle walnut scrub & skin tone refresher',
    active: true,
  },
  {
    id: 'srv-12',
    name: 'Herbal Glow Facial',
    category: 'Facial & Skin',
    durationMinutes: 35,
    bufferMinutes: 5,
    price: 450,
    adultPrice: 450,
    kidsPrice: null,
    seniorPrice: 400,
    description: 'Ayurvedic herbal extract massage, steam, clay mask & radiance serum',
    active: true,
  },
  {
    id: 'srv-13',
    name: 'Deluxe Gold Radiance Facial',
    category: 'Facial & Skin',
    durationMinutes: 45,
    bufferMinutes: 10,
    price: 750,
    adultPrice: 750,
    kidsPrice: null,
    seniorPrice: 650,
    description: '24K gold foil infused massage cream, deep steam, peel-off mask & hydration',
    active: true,
  },
  {
    id: 'srv-14',
    name: 'Charcoal Blackhead Clean-up',
    category: 'Facial & Skin',
    durationMinutes: 25,
    bufferMinutes: 5,
    price: 300,
    adultPrice: 300,
    kidsPrice: null,
    seniorPrice: 250,
    description: 'Ozone steam, blackhead extraction, active bamboo charcoal pore mask',
    active: true,
  },

  // 5. Signature Combos
  {
    id: 'srv-15',
    name: 'Haircut + Beard Groom + Wash',
    category: 'Signature Combos',
    durationMinutes: 40,
    bufferMinutes: 10,
    price: 320,
    adultPrice: 320,
    kidsPrice: null,
    seniorPrice: 260,
    description: 'Classic regular cut, beard outline trim, deep clarifying hair wash and styling',
    active: true,
  },
  {
    id: 'srv-16',
    name: 'The Ustaad Royal (Cut + Shave + Facial + Champi)',
    category: 'Signature Combos',
    durationMinutes: 60,
    bufferMinutes: 10,
    price: 850,
    adultPrice: 850,
    kidsPrice: null,
    seniorPrice: 750,
    description: 'Complete royal grooming experience: Haircut + Hot Towel Shave + Herbal Facial + 15m Champi',
    active: true,
  },
]

export const initialStaff: StaffMember[] = [
  {
    id: 'stf-1',
    name: 'Suresh Kumar',
    roleTitle: 'Master Stylist',
    specialties: ['Hair', 'Grooming'],
    status: 'Busy',
    workingHours: '09:00 - 18:00',
    station: 'Station 1',
    phone: '+91 98112 23344',
    rating: 4.9,
    totalCutsToday: 7,
    isPreferredMaster: true,
    preferenceFee: 50,
  },
  {
    id: 'stf-2',
    name: 'Ramesh Verma',
    roleTitle: 'Beard Specialist',
    specialties: ['Grooming', 'Spa'],
    status: 'Available',
    workingHours: '09:00 - 18:00',
    station: 'Station 2',
    phone: '+91 98223 34455',
    rating: 4.8,
    totalCutsToday: 5,
    isPreferredMaster: false,
    preferenceFee: 0,
  },
  {
    id: 'stf-3',
    name: 'Imran Khan',
    roleTitle: 'Senior Hair Stylist',
    specialties: ['Hair', 'Facial'],
    status: 'Busy',
    workingHours: '10:00 - 19:00',
    station: 'Station 3',
    phone: '+91 98334 45566',
    rating: 4.9,
    totalCutsToday: 6,
    isPreferredMaster: true,
    preferenceFee: 50,
  },
  {
    id: 'stf-4',
    name: 'Vicky Patil',
    roleTitle: 'Grooming & Spa Karigar',
    specialties: ['Spa', 'Grooming'],
    status: 'On Break',
    workingHours: '11:00 - 20:00',
    station: 'Station 4',
    phone: '+91 98445 56677',
    rating: 4.7,
    totalCutsToday: 4,
    isPreferredMaster: false,
    preferenceFee: 0,
  },
]

export const initialAppointments: Appointment[] = [
  {
    id: 'APT-1001',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98901 23456',
    serviceId: 'srv-1',
    serviceName: 'Classic Regular Cut',
    staffId: 'stf-1',
    staffName: 'Suresh Kumar',
    date: '2026-09-08',
    time: '09:30 AM',
    durationMinutes: 20,
    price: 150,
    ageTier: 'Adults',
    passTier: 'Silver',
    membershipDiscount: 23,
    preferredStylistFee: 50,
    finalPrice: 177,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    status: 'In Service',
    queueToken: 'T-01',
    checkedInAt: '09:25 AM',
    receiptId: 'REC-901',
    createdAt: '2026-09-07',
    callNotificationSent: true,
  },
  {
    id: 'APT-1002',
    customerName: 'Rohan Kapoor',
    customerPhone: '+91 98902 23456',
    serviceId: 'srv-8',
    serviceName: 'Designer Beard Styling & Shape',
    staffId: 'stf-3',
    staffName: 'Imran Khan',
    date: '2026-09-08',
    time: '10:00 AM',
    durationMinutes: 25,
    price: 180,
    ageTier: 'Adults',
    passTier: 'None',
    finalPrice: 180,
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    status: 'In Service',
    queueToken: 'T-02',
    checkedInAt: '09:55 AM',
    receiptId: 'REC-902',
    createdAt: '2026-09-07',
    callNotificationSent: true,
  },
  {
    id: 'APT-1003',
    customerName: 'Ishita Shah',
    customerPhone: '+91 98903 34567',
    serviceId: 'srv-13',
    serviceName: 'Deluxe Gold Radiance Facial',
    staffId: 'stf-2',
    staffName: 'Ramesh Verma',
    date: '2026-09-08',
    time: '10:30 AM',
    durationMinutes: 45,
    price: 750,
    ageTier: 'Adults',
    passTier: 'Gold',
    membershipDiscount: 188,
    finalPrice: 562,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    status: 'Checked-in',
    queueToken: 'T-03',
    checkedInAt: '10:15 AM',
    createdAt: '2026-09-08',
    callNotificationSent: false,
  },
  {
    id: 'APT-1004',
    customerName: 'Ananya Rao',
    customerPhone: '+91 98904 45678',
    serviceId: 'srv-14',
    serviceName: 'Charcoal Blackhead Clean-up',
    staffId: 'stf-4',
    staffName: 'Vicky Patil',
    date: '2026-09-08',
    time: '11:15 AM',
    durationMinutes: 25,
    price: 300,
    ageTier: 'Adults',
    passTier: 'None',
    finalPrice: 300,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    status: 'Confirmed',
    createdAt: '2026-09-08',
  },
  {
    id: 'APT-1005',
    customerName: 'Amit Desai',
    customerPhone: '+91 98905 56789',
    serviceId: 'srv-6',
    serviceName: 'Royal Foam & Hot Towel Shave',
    staffId: 'stf-1',
    staffName: 'Suresh Kumar',
    date: '2026-09-08',
    time: '11:30 AM',
    durationMinutes: 25,
    price: 160,
    ageTier: 'Adults',
    passTier: 'None',
    finalPrice: 160,
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: '2026-09-08',
  },
]

export const initialQueue: QueueItem[] = [
  {
    token: 'T-01',
    appointmentId: 'APT-1001',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98901 23456',
    serviceName: 'Classic Regular Cut',
    staffName: 'Suresh Kumar',
    assignedStation: 'Station 1',
    estimatedWaitMinutes: 0,
    waitBreakdown: 'Currently in chair at Station 1',
    status: 'In Service',
    isWalkIn: false,
    joinedAt: '09:25 AM',
    ageTier: 'Adults',
    passTier: 'Silver',
    calculatedPrice: 127,
  },
  {
    token: 'T-02',
    appointmentId: 'APT-1002',
    customerName: 'Rohan Kapoor',
    customerPhone: '+91 98902 23456',
    serviceName: 'Designer Beard Styling',
    staffName: 'Imran Khan',
    assignedStation: 'Station 3',
    estimatedWaitMinutes: 0,
    waitBreakdown: 'Currently in chair at Station 3',
    status: 'In Service',
    isWalkIn: false,
    joinedAt: '09:55 AM',
    ageTier: 'Adults',
    passTier: 'None',
    calculatedPrice: 180,
  },
  {
    token: 'T-03',
    appointmentId: 'APT-1003',
    customerName: 'Ishita Shah',
    customerPhone: '+91 98903 34567',
    serviceName: 'Deluxe Gold Facial',
    staffName: 'Ramesh Verma',
    assignedStation: 'Station 2',
    estimatedWaitMinutes: 5,
    waitBreakdown: 'Next in queue (Station 2 sanitization 5m buffer)',
    status: 'Called',
    isWalkIn: false,
    joinedAt: '10:15 AM',
    ageTier: 'Adults',
    passTier: 'Gold',
    calculatedPrice: 562,
  },
  {
    token: 'W-04',
    customerName: 'Deepak Verma',
    customerPhone: '+91 98911 22334',
    serviceName: 'Royal Hot Towel Shave',
    staffName: 'Suresh Kumar',
    assignedStation: 'Station 1',
    estimatedWaitMinutes: 20,
    waitBreakdown: 'Queue #2 • 15m remaining on T-01 + 5m buffer',
    status: 'Waiting',
    isWalkIn: true,
    joinedAt: '10:20 AM',
    ageTier: 'Adults',
    passTier: 'None',
    calculatedPrice: 160,
  },
  {
    token: 'T-05',
    appointmentId: 'APT-1004',
    customerName: 'Ananya Rao',
    customerPhone: '+91 98904 45678',
    serviceName: 'Charcoal Blackhead Clean-up',
    staffName: 'Vicky Patil',
    assignedStation: 'Station 4',
    estimatedWaitMinutes: 30,
    waitBreakdown: 'Queue #3 • Station 4 preparing after break',
    status: 'Waiting',
    isWalkIn: false,
    joinedAt: '10:25 AM',
    ageTier: 'Adults',
    passTier: 'None',
    calculatedPrice: 300,
  },
]

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'LOG-503',
    timestamp: '10:25 AM',
    user: 'AI Automation Engine',
    role: 'Admin',
    category: 'AI Call',
    action: 'Automated Call Dispatched',
    details: 'AI Voice call placed to Ishita Shah (+91 98903 34567) — Appointment starting in 5 minutes at Station 2',
  },
  {
    id: 'LOG-502',
    timestamp: '10:21 AM',
    user: 'AI Email Engine',
    role: 'Admin',
    category: 'AI Email',
    action: 'Transactional Email Sent',
    details: 'Dispatched payment receipt + Customer Memory note to rahul@customer.com',
  },
  {
    id: 'LOG-501',
    timestamp: '10:20 AM',
    user: 'Suresh Kumar',
    role: 'Staff',
    category: 'Queue',
    action: 'Walk-In Registered',
    details: 'Added walk-in Deepak Verma (Token W-04) for Royal Shave (AI estimated wait: 20 mins)',
  },
  {
    id: 'LOG-500',
    timestamp: '10:15 AM',
    user: 'Ishita Shah',
    role: 'Customer',
    category: 'Booking',
    action: 'Self Check-In',
    details: 'Checked in for APT-1003 (Assigned Token T-03)',
  },
]

export const initialRefunds: RefundRequest[] = [
  {
    id: 'REF-8801',
    appointmentId: 'APT-0992',
    customerName: 'Gaurav Mehta',
    serviceName: 'Classic Regular Cut',
    paidAmount: 150,
    refundAmount: 150,
    reason: 'Flight delayed - cancelled 3 hours prior',
    tier: '100% Full Refund (>60m)',
    status: 'Pending Review',
    requestedAt: '08:45 AM',
  },
  {
    id: 'REF-8800',
    appointmentId: 'APT-0985',
    customerName: 'Pooja Hegde',
    serviceName: 'The Ustaad Royal Combo',
    paidAmount: 850,
    refundAmount: 680,
    reason: 'Emergency meeting - cancelled 40m prior',
    tier: '80% Tier 2 (30-60m)',
    status: 'Approved',
    requestedAt: 'Yesterday 06:10 PM',
    processedAt: 'Yesterday 06:30 PM',
  },
]

export const initialUserAccounts: UserAccountItem[] = [
  {
    userId: 'usr-cust-101',
    name: 'Rahul Sharma',
    email: 'rahul@customer.com',
    username: 'rahul',
    phone: '+91 98901 23456',
    role: 'customer',
    status: 'active',
    joinedDate: '2026-01-15',
  },
  {
    userId: 'usr-stf-201',
    name: 'Suresh Kumar',
    email: 'suresh@salonops.com',
    username: 'suresh',
    phone: '+91 98112 23344',
    role: 'staff',
    status: 'active',
    joinedDate: '2025-06-10',
  },
  {
    userId: 'usr-adm-301',
    name: 'Aarav Patel',
    email: 'admin@salonops.com',
    username: 'admin',
    phone: '+91 98000 11223',
    role: 'admin',
    status: 'active',
    joinedDate: '2024-03-01',
  },
  {
    userId: 'usr-inact-401',
    name: 'Pooja Verma',
    email: 'inactive@salonops.com',
    username: 'inactive',
    phone: '+91 98777 66554',
    role: 'customer',
    status: 'inactive',
    joinedDate: '2026-02-20',
  },
]

export const initialMembershipPasses: MembershipPass[] = [
  {
    id: 'pass-silver-01',
    type: 'Silver Pass (15% Off)',
    tierName: 'Silver',
    discountPercent: 15,
    price: 499,
    billingPeriod: '/ Month',
    features: [
      '15% Flat Discount across all Hair, Shave & Skin Services',
      'Classic Regular Cut: ₹127 (Reg ₹150)',
      'Royal Hot Towel Shave: ₹136 (Reg ₹160)',
      'Herbal Glow Facial: ₹382 (Reg ₹450)',
      'Digital Priority Queue check-in from mobile',
      'Complimentary Station Espresso',
    ],
    activeCustomersCount: 38,
    status: 'Active',
  },
  {
    id: 'pass-gold-02',
    type: 'Gold Pass (25% Off)',
    tierName: 'Gold',
    discountPercent: 25,
    price: 999,
    billingPeriod: '/ Month',
    features: [
      '25% Flat Discount across ALL Services & Combos',
      'Classic Regular Cut: ₹112 (Reg ₹150)',
      'Ustaad Fade / Modern Crop: ₹187 (Reg ₹250)',
      'Designer Beard Styling: ₹135 (Reg ₹180)',
      'Herbal Glow Facial: ₹337 (Reg ₹450)',
      'The Ustaad Royal Combo: ₹637 (Reg ₹850)',
      '1 Free Beard Trim or Moustache Styling per month',
      'Zero Wait-Time Priority Queue allocation',
    ],
    activeCustomersCount: 64,
    status: 'Featured',
  },
  {
    id: 'pass-shahi-03',
    type: 'Shahi Ustaad Pass (35% Off)',
    tierName: 'Shahi Ustaad',
    discountPercent: 35,
    price: 1999,
    billingPeriod: '/ Month',
    features: [
      '35% Maximum VIP Discount on every service & combo',
      'Classic Regular Cut: ₹97 (Reg ₹150)',
      'Ustaad Fade / Modern Crop: ₹162 (Reg ₹250)',
      'Royal Hot Towel Shave: ₹104 (Reg ₹160)',
      'Designer Beard Styling: ₹117 (Reg ₹180)',
      'Herbal Glow Facial: ₹292 (Reg ₹450)',
      'The Ustaad Royal Combo: ₹552 (Reg ₹850)',
      'Dedicated Master Stylist Suresh Kumar with ₹0 preference fee',
      'VIP lounge access & complimentary head champi massage',
      '2 Free Guest Grooming Passes per month',
    ],
    activeCustomersCount: 29,
    status: 'Popular',
  },
]

export const initialCustomerMemoryDatabase: Record<string, CustomerProfileMemory> = {
  'rahul@customer.com': {
    customerName: 'Rahul Sharma',
    email: 'rahul@customer.com',
    phone: '+91 98901 23456',
    totalVisits: 6,
    lastVisitDate: '1 month ago (Aug 8, 2026)',
    lastServiceName: 'Classic Regular Cut',
    lastStaffName: 'Suresh Kumar',
    preferredCategory: 'Haircuts',
    favoriteStylist: 'Suresh Kumar',
    activePass: 'Silver Pass (15% Off)',
    lifetimeSpent: 3450,
  },
  'ishita@customer.com': {
    customerName: 'Ishita Shah',
    email: 'ishita@customer.com',
    phone: '+91 98903 34567',
    totalVisits: 4,
    lastVisitDate: '3 weeks ago (Aug 18, 2026)',
    lastServiceName: 'Deluxe Gold Radiance Facial',
    lastStaffName: 'Ramesh Verma',
    preferredCategory: 'Facial & Skin',
    favoriteStylist: 'Ramesh Verma',
    activePass: 'Gold Pass (25% Off)',
    lifetimeSpent: 2800,
  },
}

export const initialDispatchedEmails: DispatchedEmail[] = [
  {
    id: 'EML-901',
    recipientEmail: 'rahul@customer.com',
    recipientName: 'Rahul Sharma',
    subject: 'Your Deluxe Salon Receipt & Service Summary — ₹177.00',
    serviceName: 'Classic Regular Cut',
    staffName: 'Suresh Kumar',
    amountPaid: 177,
    customerMemoryNote:
      'Thank you for returning to Deluxe Salon, Rahul! It has been 1 month since your last visit on Aug 8 for Royal Shave. We appreciate your Silver Pass loyalty and hope you loved today’s Classic Regular Cut with Master Stylist Suresh Kumar.',
    timestamp: 'Today 09:35 AM',
    status: 'Delivered',
  },
]

export const initialAiCalls: AiCallRecord[] = [
  {
    id: 'CALL-101',
    customerName: 'Ishita Shah',
    customerPhone: '+91 98903 34567',
    serviceName: 'Deluxe Gold Radiance Facial',
    staffName: 'Ramesh Verma',
    station: 'Station 2',
    spokenMessage:
      'Hello Ishita Shah, this is an automated update from Salon Monitoring System. Your appointment for Deluxe Gold Radiance Facial with stylist Ramesh Verma will begin in 5 minutes at Station 2. Please proceed to the styling chair.',
    timestamp: 'Today 10:15 AM',
    status: 'Completed',
    durationSeconds: 14,
  },
]
