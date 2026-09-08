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

export interface ServiceItem {
  id: string
  name: string
  category: 'Hair' | 'Grooming' | 'Spa' | 'Facial'
  durationMinutes: number
  bufferMinutes: number
  price: number
  description: string
  active: boolean
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
  type: 'Monthly Pass' | 'Annual VIP Pass'
  price: number
  billingPeriod: string
  features: string[]
  activeCustomersCount: number
  status: 'Active' | 'Featured'
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
  {
    id: 'srv-1',
    name: 'Executive Haircut & Styling',
    category: 'Hair',
    durationMinutes: 40,
    bufferMinutes: 5,
    price: 350,
    description: 'Precision scissor cut, styling, hair wash and blow dry',
    active: true,
  },
  {
    id: 'srv-2',
    name: 'Royal Hot Towel Shave',
    category: 'Grooming',
    durationMinutes: 25,
    bufferMinutes: 5,
    price: 200,
    description: 'Pre-shave oil, hot towel wrap, straight razor shave, and cooling balm',
    active: true,
  },
  {
    id: 'srv-3',
    name: 'Beard Sculpting & Razor Line',
    category: 'Grooming',
    durationMinutes: 20,
    bufferMinutes: 5,
    price: 150,
    description: 'Beard trimming, shaping, straight razor edge definition',
    active: true,
  },
  {
    id: 'srv-4',
    name: 'Ayurvedic Champi Head Massage',
    category: 'Spa',
    durationMinutes: 20,
    bufferMinutes: 5,
    price: 180,
    description: 'Herbal Brahmi oil pressure-point head and shoulder massage',
    active: true,
  },
  {
    id: 'srv-5',
    name: 'Anti-Pollution Charcoal Facial',
    category: 'Facial',
    durationMinutes: 45,
    bufferMinutes: 10,
    price: 650,
    description: 'Deep pore cleansing, exfoliation, steam, and charcoal mask',
    active: true,
  },
  {
    id: 'srv-6',
    name: 'Intense Repair Hair Spa',
    category: 'Spa',
    durationMinutes: 50,
    bufferMinutes: 10,
    price: 800,
    description: 'Keratin protein infusion, ozone steam therapy, and deep conditioning',
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
    serviceName: 'Executive Haircut & Styling',
    staffId: 'stf-1',
    staffName: 'Suresh Kumar',
    date: '2026-09-08',
    time: '09:30 AM',
    durationMinutes: 40,
    price: 350,
    preferredStylistFee: 50,
    finalPrice: 400,
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
    serviceId: 'srv-3',
    serviceName: 'Beard Sculpting & Razor Line',
    staffId: 'stf-3',
    staffName: 'Imran Khan',
    date: '2026-09-08',
    time: '10:00 AM',
    durationMinutes: 20,
    price: 150,
    finalPrice: 150,
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
    serviceId: 'srv-6',
    serviceName: 'Intense Repair Hair Spa',
    staffId: 'stf-2',
    staffName: 'Ramesh Verma',
    date: '2026-09-08',
    time: '10:30 AM',
    durationMinutes: 50,
    price: 800,
    finalPrice: 800,
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
    serviceId: 'srv-5',
    serviceName: 'Anti-Pollution Charcoal Facial',
    staffId: 'stf-4',
    staffName: 'Vicky Patil',
    date: '2026-09-08',
    time: '11:15 AM',
    durationMinutes: 45,
    price: 650,
    finalPrice: 650,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    status: 'Confirmed',
    createdAt: '2026-09-08',
  },
  {
    id: 'APT-1005',
    customerName: 'Amit Desai',
    customerPhone: '+91 98905 56789',
    serviceId: 'srv-2',
    serviceName: 'Royal Hot Towel Shave',
    staffId: 'stf-1',
    staffName: 'Suresh Kumar',
    date: '2026-09-08',
    time: '11:30 AM',
    durationMinutes: 25,
    price: 200,
    finalPrice: 200,
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
    serviceName: 'Executive Haircut & Styling',
    staffName: 'Suresh Kumar',
    assignedStation: 'Station 1',
    estimatedWaitMinutes: 0,
    waitBreakdown: 'Currently in chair at Station 1',
    status: 'In Service',
    isWalkIn: false,
    joinedAt: '09:25 AM',
  },
  {
    token: 'T-02',
    appointmentId: 'APT-1002',
    customerName: 'Rohan Kapoor',
    customerPhone: '+91 98902 23456',
    serviceName: 'Beard Sculpting',
    staffName: 'Imran Khan',
    assignedStation: 'Station 3',
    estimatedWaitMinutes: 0,
    waitBreakdown: 'Currently in chair at Station 3',
    status: 'In Service',
    isWalkIn: false,
    joinedAt: '09:55 AM',
  },
  {
    token: 'T-03',
    appointmentId: 'APT-1003',
    customerName: 'Ishita Shah',
    customerPhone: '+91 98903 34567',
    serviceName: 'Hair Spa',
    staffName: 'Ramesh Verma',
    assignedStation: 'Station 2',
    estimatedWaitMinutes: 5,
    waitBreakdown: 'Next in queue (Station 2 sanitization 5m buffer)',
    status: 'Called',
    isWalkIn: false,
    joinedAt: '10:15 AM',
  },
  {
    token: 'W-04',
    customerName: 'Deepak Verma',
    customerPhone: '+91 98911 22334',
    serviceName: 'Royal Shave',
    staffName: 'Suresh Kumar',
    assignedStation: 'Station 1',
    estimatedWaitMinutes: 23,
    waitBreakdown: 'Queue #2 • 18m remaining on T-01 + 5m buffer',
    status: 'Waiting',
    isWalkIn: true,
    joinedAt: '10:20 AM',
  },
  {
    token: 'T-05',
    appointmentId: 'APT-1004',
    customerName: 'Ananya Rao',
    customerPhone: '+91 98904 45678',
    serviceName: 'Charcoal Facial',
    staffName: 'Vicky Patil',
    assignedStation: 'Station 4',
    estimatedWaitMinutes: 35,
    waitBreakdown: 'Queue #3 • Station 4 preparing after break',
    status: 'Waiting',
    isWalkIn: false,
    joinedAt: '10:25 AM',
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
    details: 'Added walk-in Deepak Verma (Token W-04) for Royal Shave (AI estimated wait: 23 mins)',
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
    serviceName: 'Executive Haircut & Styling',
    paidAmount: 350,
    refundAmount: 350,
    reason: 'Flight delayed - cancelled 3 hours prior',
    tier: '100% Full Refund (>60m)',
    status: 'Pending Review',
    requestedAt: '08:45 AM',
  },
  {
    id: 'REF-8800',
    appointmentId: 'APT-0985',
    customerName: 'Pooja Hegde',
    serviceName: 'Intense Repair Hair Spa',
    paidAmount: 800,
    refundAmount: 640,
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
    id: 'pass-monthly-01',
    type: 'Monthly Pass',
    price: 999,
    billingPeriod: '/ Month',
    features: [
      'Unlimited Executive Scissor Haircuts',
      '2 Free Royal Shaves / Beard Trims per month',
      '20% Off all Luxury Hair Spa & Facials',
      'Free Station Espresso & Priority Slot Booking',
    ],
    activeCustomersCount: 48,
    status: 'Active',
  },
  {
    id: 'pass-annual-02',
    type: 'Annual VIP Pass',
    price: 7999,
    billingPeriod: '/ Year',
    features: [
      'All Monthly Pass benefits included for 12 months',
      'Zero Wait-Time VIP Priority Queue Skipping',
      '1 Free Intense Repair Hair Spa every month (₹9,600 value)',
      'Dedicated Star Stylist assignment with ₹0 preference fee',
      '2 Free Guest Grooming Passes per quarter',
    ],
    activeCustomersCount: 22,
    status: 'Featured',
  },
]

export const initialCustomerMemoryDatabase: Record<string, CustomerProfileMemory> = {
  'rahul@customer.com': {
    customerName: 'Rahul Sharma',
    email: 'rahul@customer.com',
    phone: '+91 98901 23456',
    totalVisits: 6,
    lastVisitDate: '1 month ago (Aug 8, 2026)',
    lastServiceName: 'Royal Hot Towel Shave',
    lastStaffName: 'Suresh Kumar',
    preferredCategory: 'Grooming & Hair',
    favoriteStylist: 'Suresh Kumar',
    activePass: 'Monthly Pass Active',
    lifetimeSpent: 3450,
  },
  'ishita@customer.com': {
    customerName: 'Ishita Shah',
    email: 'ishita@customer.com',
    phone: '+91 98903 34567',
    totalVisits: 4,
    lastVisitDate: '3 weeks ago (Aug 18, 2026)',
    lastServiceName: 'Anti-Pollution Charcoal Facial',
    lastStaffName: 'Ramesh Verma',
    preferredCategory: 'Spa & Facial',
    favoriteStylist: 'Ramesh Verma',
    lifetimeSpent: 2800,
  },
}

export const initialDispatchedEmails: DispatchedEmail[] = [
  {
    id: 'EML-901',
    recipientEmail: 'rahul@customer.com',
    recipientName: 'Rahul Sharma',
    subject: 'Your SalonOps Receipt & Thank You for Visiting!',
    serviceName: 'Executive Haircut & Styling',
    staffName: 'Suresh Kumar',
    amountPaid: 400,
    customerMemoryNote:
      'Thank you for returning to SalonOps, Rahul! It has been 1 month since your last visit on Aug 8 for Royal Shave. We appreciate your loyalty and hope you loved today’s haircut with Master Stylist Suresh Kumar.',
    timestamp: 'Today 09:35 AM',
    status: 'Delivered',
  },
]

export const initialAiCalls: AiCallRecord[] = [
  {
    id: 'CALL-101',
    customerName: 'Ishita Shah',
    customerPhone: '+91 98903 34567',
    serviceName: 'Intense Repair Hair Spa',
    staffName: 'Ramesh Verma',
    station: 'Station 2',
    spokenMessage:
      'Hello Ishita Shah, this is an automated update from Salon Monitoring System. Your appointment for Intense Repair Hair Spa with stylist Ramesh Verma will begin in 5 minutes at Station 2. Please proceed to the styling chair.',
    timestamp: 'Today 10:15 AM',
    status: 'Completed',
    durationSeconds: 14,
  },
]
