'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu'

export interface LanguageOption {
  code: LanguageCode
  label: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🚩' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', flag: '✨' },
]

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    salonTitle: 'Deluxe Ustaad Salon',
    salonSubtitle: 'Deluxe Salon Ops',
    telemetry: 'LIVE TELEMETRY',
    telemetryTooltip: 'Live Telemetry 99.9% Uptime Active • Protected System',
    portalSuffix: 'Portal',
    logout: 'Sign Out',
    radioTitle: 'Salon Radio 98.3 FM',
    radioTagline: 'From Classic Nostalgia to Retro Lo-Fi — Melodies of Deluxe Salon',
    station: 'Station',
    verifyingSession: 'Verifying Session...',
    changeLanguage: 'Language',
    selectLanguage: 'Select Language',
    languageSelection: 'Language Selection',

    // Roles
    roleCustomer: 'Customer',
    roleStaff: 'Staff Stylist',
    roleAdmin: 'General Manager',
    executiveAdmin: 'Executive Admin',

    // Login
    loginHeading: 'Salon Monitoring System',
    loginSubheading: 'Real-time appointments, live queue tracking & AI automated operations.',
    loginTab: 'Sign In',
    registerTab: 'Customer Sign Up',
    emailOrUserLabel: 'Email or Username',
    passwordLabel: 'Password',
    rememberMe: 'Remember me on this station',
    signInButton: 'Sign In',
    signingIn: 'Signing In & Identifying Role...',
    signUpButton: 'Create Customer Account',
    registerPrompt: 'New client to Ustaad Salon?',
    backToLogin: 'Back to Sign In',
    fullNameLabel: 'Full Name',
    phoneLabel: 'Mobile Phone Number',
    quickDemoPills: 'Demo 1-Click Role Login:',
    demoCustomer: 'Customer',
    demoStaff: 'Staff Barber',
    demoAdmin: 'Admin',
    secureNotice: 'Role is automatically identified upon login. Single universal gateway.',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Password Reset',
    resetInstructionsSent: 'Reset Instructions Sent',
    sendResetLink: 'Send Reset Link',
    cancel: 'Cancel',

    // AI Tools
    aiCopilot: 'AI Copilot',
    aiConcierge: 'AI Concierge',
    aiVoiceCall: 'AI Voice Call',
    aiEmailReceipt: 'AI Memory Receipt',
    aiOptimizer: 'AI Queue Optimizer',
    askAi: 'Ask AI',

    // Customer Portal Navigation & Headings
    customerNavHome: 'Overview & Queue',
    customerNavMenu: 'Service Menu',
    customerNavBook: 'Book Slot',
    customerNavHistory: 'My Bookings',
    customerNavQueue: 'Live Queue',
    customerNavPass: 'VIP Membership',
    customerNavReceipts: 'Receipts',
    customerNavRefunds: 'Refunds',
    customerNavFeedback: 'Feedback',
    customerNavProfile: 'Profile',

    yourQueueToken: 'Your Queue Token',
    estimatedWaitTime: 'Estimated Wait Time',
    activeStylist: 'Active Stylist',
    assignedStation: 'Assigned Station',
    bookAppointmentTitle: 'Book an Appointment',
    selectService: 'Select Service',
    selectStylist: 'Preferred Stylist',
    masterStylistAddon: 'Master Stylist Guarantee (+₹50 surcharge)',
    vipDiscountApplied: 'VIP Pass 15% Discount Applied!',
    checkInButton: 'Check In Now (Get Token)',
    checkedInStatus: 'Checked-in & Waiting',
    cancelBooking: 'Cancel Booking',
    requestRefund: 'Request Refund',
    viewReceipt: 'View Invoice',
    talkToAi: 'Ask AI Concierge for Style Advice',

    // Staff Portal Navigation & Headings
    staffNavDashboard: 'Stylist Floor Console',
    staffNavAppointments: "Today's Appointments",
    staffNavCheckin: 'Fast Check-In',
    staffNavWalkIn: 'Add Walk-In',
    staffNavQueue: 'Floor Queue',
    staffNavCustomers: 'Search Records',
    staffNavStations: 'Station Schedule',
    staffNavBilling: 'POS & Billing',
    staffNavRefunds: 'Refund Tickets',
    staffNavShift: 'Shift Availability',
    staffNavProfile: 'Profile',

    currentStationStatus: 'Styling Stations Floor Grid',
    toggleAvailability: 'Toggle Available / Busy',
    callNextCustomer: 'Call Customer',
    completeServiceBtn: 'Complete & Checkout',
    walkInCustomerName: 'Customer Full Name',
    walkInPhone: 'Phone Number (For AI Arrival Call)',
    walkInService: 'Select Service',
    assignStylist: 'Assign Stylist',
    issueWalkInToken: 'Issue Token & Add to Queue',
    collectPaymentTitle: 'POS Quick Checkout',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    upi: 'UPI (GPay / PhonePe)',
    card: 'Card / POS',
    processPaymentBtn: 'Confirm & Dispatch AI Receipt',
    printReceipt: 'Print Receipt',
    seatCustomer: 'Seat Customer',
    serviceCompleted: 'Service Completed',
    noShow: 'Mark No-Show',
    call: 'Call',
    start: 'Start',
    checkout: 'Checkout',

    // Status dropdown options
    statusAvailableOption: '🟢 Available',
    statusBusyOption: '🔵 Busy (In Chair)',
    statusBreakOption: '🟡 On Break',
    statusLeaveOption: '⚪ On Leave',

    // Metric Badges
    stationLabel: 'STATION',
    completedLabel: 'COMPLETED',
    inQueueLabel: 'IN QUEUE',
    ratingLabel: 'RATING',
    statusLabel: 'Status',

    // Admin Portal Navigation & Headings
    adminNavOverview: 'Floor Control Room',
    adminNavBahiKhata: 'Business Summary Ledger',
    adminNavOptimizer: 'AI Queue Optimizer',
    adminNavEmails: 'AI Dispatched Emails',
    adminNavPasses: 'VIP Passes',
    adminNavAppointments: 'Master Bookings',
    adminNavStaff: 'Stylist Roster',
    adminNavServices: 'Service Catalog',
    adminNavUsers: 'User Accounts',
    adminNavRefunds: 'Refund Approvals',
    adminNavAudit: 'Security Audit Logs',
    adminNavSettings: 'Salon Settings',

    totalRevenue: "Today's Total Revenue",
    activeQueueCount: 'Active Floor Queue',
    stylistUtilization: 'Average Stylist Load',
    customerSatisfaction: 'Customer Satisfaction',
    rebalanceStations: 'Run AI Station Rebalance',
    approveRefund: 'Authorize Refund',
    rejectRefund: 'Decline Refund',
    addNewService: 'Add New Service to Menu',
    serviceName: 'Service Name',
    servicePrice: 'Base Price (₹)',
    serviceDuration: 'Duration (Mins)',
    saveService: 'Save to Catalog',

    // Common
    statusWaiting: 'Waiting',
    statusInService: 'In Service',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    statusAvailable: 'Available',
    statusBusy: 'Busy',
    statusBreak: 'On Break',
    paid: 'PAID',
    unpaid: 'UNPAID',
    close: 'Close',
    minutes: 'mins',
  },

  hi: {
    // Brand & Header
    salonTitle: 'डीलक्स उस्ताद सैलून',
    salonSubtitle: 'डीलक्स सैलून ऑप्स',
    telemetry: 'लाइव टेलीमेट्री',
    telemetryTooltip: 'बुरी नज़र से रक्षा • 99.9% लाइव अपटाइम सक्रिय',
    portalSuffix: 'पटल',
    logout: 'लॉग आउट',
    radioTitle: 'सैलून रेडियो 98.3 FM',
    radioTagline: 'तानसेन से लेकर रफी साहब तक — डीलक्स सैलून की मीठी धुनें',
    station: 'स्टेशन',
    verifyingSession: 'सत्यापन जारी है...',
    changeLanguage: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    languageSelection: 'भाषा चयन',

    // Roles
    roleCustomer: 'ग्राहक',
    roleStaff: 'स्टाफ हेयर स्टाइलिस्ट',
    roleAdmin: 'मुख्य प्रबंधक',
    executiveAdmin: 'कार्यकारी प्रबंधक',

    // Login
    loginHeading: 'सैलून मॉनिटरिंग सिस्टम',
    loginSubheading: 'रीयल-टाइम अपॉइंटमेंट, लाइव कतार ट्रैकिंग और AI स्वचालित संचालन।',
    loginTab: 'लॉग इन करें',
    registerTab: 'नया ग्राहक पंजीकरण',
    emailOrUserLabel: 'ईमेल या उपयोगकर्ता नाम',
    passwordLabel: 'पासवर्ड',
    rememberMe: 'मुझे इस स्टेशन पर याद रखें',
    signInButton: 'प्रवेश करें',
    signingIn: 'पहचान सत्यापित हो रही है...',
    signUpButton: 'खाता बनाएं',
    registerPrompt: 'सैलून में नए ग्राहक हैं?',
    backToLogin: 'लॉग इन पर वापस जाएं',
    fullNameLabel: 'पूरा नाम',
    phoneLabel: 'मोबाइल फोन नंबर',
    quickDemoPills: 'मूल्यांकन के लिए 1-क्लिक लॉगिन:',
    demoCustomer: 'ग्राहक',
    demoStaff: 'स्टाफ नाई',
    demoAdmin: 'प्रबंधक',
    secureNotice: 'लॉग इन पर भूमिका स्वतः पहचानी जाती है। एकल सुरक्षित द्वार।',
    forgotPassword: 'पासवर्ड भूल गए?',
    resetPassword: 'पासवर्ड रीसेट',
    resetInstructionsSent: 'रीसेट निर्देश भेज दिए गए हैं',
    sendResetLink: 'रीसेट लिंक भेजें',
    cancel: 'रद्द करें',

    // AI Tools
    aiCopilot: 'AI कोपायलट',
    aiConcierge: 'AI दरबान',
    aiVoiceCall: 'AI वॉयस कॉल',
    aiEmailReceipt: 'AI मेमोरी रसीद',
    aiOptimizer: 'AI कतार अनुकूलक',
    askAi: 'AI से पूछें',

    // Customer Portal Navigation & Headings
    customerNavHome: 'कतार स्थिति',
    customerNavMenu: 'सेवा सूची',
    customerNavBook: 'सेवा बुक करें',
    customerNavHistory: 'मेरी बुकिंग',
    customerNavQueue: 'लाइव कतार',
    customerNavPass: 'VIP सदस्यता',
    customerNavReceipts: 'रसीदें',
    customerNavRefunds: 'रिफंड',
    customerNavFeedback: 'प्रतिक्रिया',
    customerNavProfile: 'प्रोफ़ाइल',

    yourQueueToken: 'आपका कतार टोकन',
    estimatedWaitTime: 'अनुमानित प्रतीक्षा समय',
    activeStylist: 'सक्रिय हेयर स्टाइलिस्ट',
    assignedStation: 'आवंटित चेयर / स्टेशन',
    bookAppointmentTitle: 'अपॉइंटमेंट बुक करें',
    selectService: 'सेवा चुनें',
    selectStylist: 'पसंदीदा स्टाइलिस्ट',
    masterStylistAddon: 'उस्ताद नाई गारंटी (+₹50 अतिरिक्त)',
    vipDiscountApplied: 'VIP पास 15% छूट लागू!',
    checkInButton: 'अभी चेक-इन करें (टोकन लें)',
    checkedInStatus: 'चेक-इन हो गया (प्रतीक्षारत)',
    cancelBooking: 'बुकिंग रद्द करें',
    requestRefund: 'रिफंड का अनुरोध',
    viewReceipt: 'बिल देखें',
    talkToAi: 'स्टाइल सलाह के लिए AI से पूछें',

    // Staff Portal Navigation & Headings
    staffNavDashboard: 'कारीगर नियंत्रण कंसोल',
    staffNavAppointments: 'आज की बुकिंग',
    staffNavCheckin: 'तुरंत हाजिरी',
    staffNavWalkIn: 'वॉक-इन जोड़ें',
    staffNavQueue: 'सैलून कतार',
    staffNavCustomers: 'ग्राहक खोज',
    staffNavStations: 'चेयर स्थिति',
    staffNavBilling: 'बिलिंग व POS',
    staffNavRefunds: 'रिफंड टिकट',
    staffNavShift: 'शिफ्ट उपस्थिति',
    staffNavProfile: 'प्रोफ़ाइल',

    currentStationStatus: 'सैलून फ्लोर चेयर स्थिति',
    toggleAvailability: 'उपलब्ध / व्यस्त बदलें',
    callNextCustomer: 'ग्राहक को बुलाएं',
    completeServiceBtn: 'सेवा पूर्ण करें और बिल लें',
    walkInCustomerName: 'ग्राहक का पूरा नाम',
    walkInPhone: 'फ़ोन नंबर (AI कॉल के लिए)',
    walkInService: 'सेवा चुनें',
    assignStylist: 'कारीगर आवंटित करें',
    issueWalkInToken: 'टोकन जारी करें और कतार में जोड़ें',
    collectPaymentTitle: 'POS त्वरित बिलिंग',
    paymentMethod: 'भुगतान का तरीका',
    cash: 'नकद (Cash)',
    upi: 'UPI (GPay / PhonePe)',
    card: 'कार्ड / POS',
    processPaymentBtn: 'भुगतान पुष्टि करें और AI रसीद भेजें',
    printReceipt: 'रसीद प्रिंट करें',
    seatCustomer: 'कुर्सी पर बैठाएं',
    serviceCompleted: 'सेवा पूरी हुई',
    noShow: 'गैर-हाजिर करें',
    call: 'बुलाएं',
    start: 'शुरू करें',
    checkout: 'संपन्न',

    // Status dropdown options
    statusAvailableOption: '🟢 उपलब्ध (Available)',
    statusBusyOption: '🔵 व्यस्त (कुर्सी पर)',
    statusBreakOption: '🟡 चाय अवकाश (On Break)',
    statusLeaveOption: '⚪ छुट्टी पर (On Leave)',

    // Metric Badges
    stationLabel: 'कुर्सी',
    completedLabel: 'आज संपन्न',
    inQueueLabel: 'प्रतीक्षारत',
    ratingLabel: 'कारीगर रेटिंग',
    statusLabel: 'स्थिति',

    // Admin Portal Navigation & Headings
    adminNavOverview: 'कंट्रोल रूम',
    adminNavBahiKhata: 'बही-खाता लेजर',
    adminNavOptimizer: 'AI कतार अनुकूलक',
    adminNavEmails: 'AI डाक बही',
    adminNavPasses: 'वीआईपी पास',
    adminNavAppointments: 'मास्टर बुकिंग',
    adminNavStaff: 'स्टाइलिस्ट सूची',
    adminNavServices: 'सेवा सूची',
    adminNavUsers: 'उपयोगकर्ता खाते',
    adminNavRefunds: 'रिफंड स्वीकृति',
    adminNavAudit: 'सुरक्षा ऑडिट लॉग्स',
    adminNavSettings: 'सैलून सेटिंग्स',

    totalRevenue: 'आज का कुल राजस्व',
    activeQueueCount: 'सैलून में कुल कतार',
    stylistUtilization: 'औसत स्टाइलिस्ट लोड',
    customerSatisfaction: 'ग्राहक संतुष्टि',
    rebalanceStations: 'AI चेयर पुनर्संतुलन चलाएं',
    approveRefund: 'रिफंड स्वीकृत करें',
    rejectRefund: 'रिफंड अस्वीकार करें',
    addNewService: 'मेनू में नई सेवा जोड़ें',
    serviceName: 'सेवा का नाम',
    servicePrice: 'मूल्य (₹)',
    serviceDuration: 'अवधि (मिनट)',
    saveService: 'मेनू में सुरक्षित करें',

    // Common
    statusWaiting: 'प्रतीक्षारत',
    statusInService: 'सेवा चालू',
    statusCompleted: 'पूर्ण',
    statusCancelled: 'रद्द',
    statusAvailable: 'उपलब्ध',
    statusBusy: 'व्यस्त',
    statusBreak: 'अवकाश पर',
    paid: 'भुगतान पूर्ण',
    unpaid: 'अदत्त',
    close: 'बंद करें',
    minutes: 'मिनट',
  },

  mr: {
    // Brand & Header
    salonTitle: 'डीलक्स उस्ताद सलून',
    salonSubtitle: 'डीलक्स सलून ऑप्स',
    telemetry: 'थेट टेलिमेट्री',
    telemetryTooltip: 'दृष्ट न लागो • ९९.९% थेट अपटाइम सुरू आहे',
    portalSuffix: 'विभाग',
    logout: 'लॉग आऊट',
    radioTitle: 'सलून रेडिओ ९८.३ FM',
    radioTagline: 'तानसेन ते रफी साहेब — डीलक्स सलूनच्या सुरेल धून',
    station: 'स्थानक',
    verifyingSession: 'सत्यापन चालू आहे...',
    changeLanguage: 'भाषा',
    selectLanguage: 'भाषा निवडा',
    languageSelection: 'भाषा निवड',

    // Roles
    roleCustomer: 'ग्राहक',
    roleStaff: 'स्टाफ कारागीर',
    roleAdmin: 'मुख्य व्यवस्थापक',
    executiveAdmin: 'कार्यकारी व्यवस्थापक',

    // Login
    loginHeading: 'सलून मॉनिटरिंग प्रणाली',
    loginSubheading: 'थेट अपॉइंटमेंट, रांगेचा मागोवा आणि AI स्वयंचलित व्यवस्थापन.',
    loginTab: 'लॉग इन करा',
    registerTab: 'नवीन ग्राहक नोंदणी',
    emailOrUserLabel: 'ईमेल किंवा वापरकर्ता नाव',
    passwordLabel: 'पासवर्ड',
    rememberMe: 'मला या डिव्हाइसवर आठवणीत ठेवा',
    signInButton: 'प्रवेश करा',
    signingIn: 'सत्यापन होत आहे...',
    signUpButton: 'खाते तयार करा',
    registerPrompt: 'सलूनमध्ये नवीन ग्राहक आहात?',
    backToLogin: 'लॉग इनकडे परत जा',
    fullNameLabel: 'पूर्ण नाव',
    phoneLabel: 'मोबाईल नंबर',
    quickDemoPills: 'चाचणीसाठी १-क्लिक थेट लॉगिन:',
    demoCustomer: 'ग्राहक',
    demoStaff: 'कर्मचारी नाई',
    demoAdmin: 'व्यवस्थापक',
    secureNotice: 'लॉग इन करताच भूमिका आपोआप ओळखली जाईल.',
    forgotPassword: 'पासवर्ड विसरलात?',
    resetPassword: 'पासवर्ड रीसेट',
    resetInstructionsSent: 'रीसेट सूचना पाठवल्या आहेत',
    sendResetLink: 'रीसेट लिंक पाठवा',
    cancel: 'रद्द करा',

    // AI Tools
    aiCopilot: 'AI सहाय्यक',
    aiConcierge: 'AI सल्लागार',
    aiVoiceCall: 'AI व्हॉइस कॉल',
    aiEmailReceipt: 'AI पावती ईमेल',
    aiOptimizer: 'AI रांग व्यवस्थापक',
    askAi: 'AI ला विचारा',

    // Customer Portal Navigation & Headings
    customerNavHome: 'रांग स्थिती',
    customerNavMenu: 'सेवा मेनू',
    customerNavBook: 'सेवा बुक करा',
    customerNavHistory: 'माझ्या बुकिंग्स',
    customerNavQueue: 'थेट रांग',
    customerNavPass: 'VIP सभासदत्व',
    customerNavReceipts: 'पावत्या',
    customerNavRefunds: 'परतावा',
    customerNavFeedback: 'अभिप्राय',
    customerNavProfile: 'प्रोफाइल',

    yourQueueToken: 'तुमचा रांग टोकन',
    estimatedWaitTime: 'अंदाजे प्रतीक्षा वेळ',
    activeStylist: 'केस कारागीर',
    assignedStation: 'दिलेली खुर्ची',
    bookAppointmentTitle: 'अपॉइंटमेंट बुक करा',
    selectService: 'सेवा निवडा',
    selectStylist: 'पसंत कारागीर',
    masterStylistAddon: 'उस्ताद कारागीर हमी (+₹५० जादा)',
    vipDiscountApplied: 'VIP पास १५% सूट लागू!',
    checkInButton: 'आता चेक-इन करा (टोकन मिळवा)',
    checkedInStatus: 'चेक-इन झाले (प्रतीक्षेत)',
    cancelBooking: 'बुकिंग रद्द करा',
    requestRefund: 'परतावा मागणी',
    viewReceipt: 'पावती पहा',
    talkToAi: 'स्टाइलिंग सल्ल्यासाठी AI ला विचारा',

    // Staff Portal Navigation & Headings
    staffNavDashboard: 'कारागीर नियंत्रण कन्सोल',
    staffNavAppointments: 'आजचे बुकिंग',
    staffNavCheckin: 'जलद हजेरी',
    staffNavWalkIn: 'थेट ग्राहक जोडा',
    staffNavQueue: 'सलून रांग',
    staffNavCustomers: 'ग्राहक शोध',
    staffNavStations: 'खुर्ची वेळापत्रक',
    staffNavBilling: 'बिलिंग व POS',
    staffNavRefunds: 'परतावा तिकीट',
    staffNavShift: 'शिफ्ट उपस्थिती',
    staffNavProfile: 'प्रोफाइल',

    currentStationStatus: 'सलून खुर्ची स्थिती',
    toggleAvailability: 'उपलब्ध / व्यस्त बदला',
    callNextCustomer: 'पुढील ग्राहकाला बोलवा',
    completeServiceBtn: 'सेवा पूर्ण करा आणि बिल घ्या',
    walkInCustomerName: 'ग्राहकाचे पूर्ण नाव',
    walkInPhone: 'मोबाईल नंबर (AI कॉलसाठी)',
    walkInService: 'सेवा निवडा',
    assignStylist: 'कारागीर नियुक्त करा',
    issueWalkInToken: 'टोकन द्या व रांगेत जोडा',
    collectPaymentTitle: 'POS जलद बिलिंग',
    paymentMethod: 'पेमेंट पद्धत',
    cash: 'रोख (Cash)',
    upi: 'UPI (GPay / PhonePe)',
    card: 'कार्ड / POS',
    processPaymentBtn: 'पेमेंट जमा करा व AI पावती पाठवा',
    printReceipt: 'पावती प्रिंट करा',
    seatCustomer: 'खुर्चीवर बसवा',
    serviceCompleted: 'सेवा पूर्ण झाली',
    noShow: 'गैरहजर नोंदवा',
    call: 'बोलवा',
    start: 'सुरू करा',
    checkout: 'बिल घ्या',

    // Status dropdown options
    statusAvailableOption: '🟢 उपलब्ध (Available)',
    statusBusyOption: '🔵 व्यस्त (खुर्चीवर)',
    statusBreakOption: '🟡 चहा सुट्टी (On Break)',
    statusLeaveOption: '⚪ सुट्टीवर (On Leave)',

    // Metric Badges
    stationLabel: 'खुर्ची',
    completedLabel: 'पूर्ण झालेले',
    inQueueLabel: 'रांगेत',
    ratingLabel: 'कारागीर रेटिंग',
    statusLabel: 'स्थिती',

    // Admin Portal Navigation & Headings
    adminNavOverview: 'कंट्रोल रूम',
    adminNavBahiKhata: 'वही-खाते लेजर',
    adminNavOptimizer: 'AI रांग व्यवस्थापक',
    adminNavEmails: 'AI पाठवलेले ईमेल',
    adminNavPasses: 'व्हीआयपी पासेस',
    adminNavAppointments: 'मास्टर बुकिंग्स',
    adminNavStaff: 'कारागीर यादी',
    adminNavServices: 'सेवा मेनू',
    adminNavUsers: 'वापरकर्ता खाती',
    adminNavRefunds: 'परतावा मंजुरी',
    adminNavAudit: 'सुरक्षा नोंदी',
    adminNavSettings: 'सलून सेटिंग्ज',

    totalRevenue: 'आजचा एकूण गल्ला',
    activeQueueCount: 'रांगेत एकूण ग्राहक',
    stylistUtilization: 'सरासरी कामाचा भार',
    customerSatisfaction: 'ग्राहक समाधान',
    rebalanceStations: 'AI खुर्ची पुनर्संतुलन करा',
    approveRefund: 'परतावा मंजूर करा',
    rejectRefund: 'परतावा नाकारा',
    addNewService: 'मेनूमध्ये नवीन सेवा जोडा',
    serviceName: 'सेवेचे नाव',
    servicePrice: 'किंमत (₹)',
    serviceDuration: 'वेळ (मिनिटे)',
    saveService: 'मेनूमध्ये जतन करा',

    // Common
    statusWaiting: 'प्रतीक्षेत',
    statusInService: 'सेवा चालू',
    statusCompleted: 'पूर्ण झाले',
    statusCancelled: 'रद्द',
    statusAvailable: 'उपलब्ध',
    statusBusy: 'व्यस्त',
    statusBreak: 'सुट्टीवर',
    paid: 'जमा झाले',
    unpaid: 'बाकी',
    close: 'बंद करा',
    minutes: 'मिनिटे',
  },

  gu: {
    // Brand & Header
    salonTitle: 'ડીલક્સ ઉસ્તાદ સલૂન',
    salonSubtitle: 'ડીલક્સ સલૂન ઓપ્સ',
    telemetry: 'લાઈવ ટેલિમેટ્રી',
    telemetryTooltip: 'નજરથી સુરક્ષા • ૯૯.૯% લાઈવ અપટાઇમ સક્રિય',
    portalSuffix: 'વિભાગ',
    logout: 'લૉગ આઉટ',
    radioTitle: 'સલૂન રેડિયો ૯૮.૩ FM',
    radioTagline: 'તાનસેનથી રફી સાહેબ સુધી — ડીલક્સ સલૂનની મધુર ધૂનો',
    station: 'સ્ટેશન',
    verifyingSession: 'ચકાસણી ચાલુ છે...',
    changeLanguage: 'ભાષા',
    selectLanguage: 'ભાષા પસંદ કરો',
    languageSelection: 'ભાષા પસંદગી',

    // Roles
    roleCustomer: 'ગ્રાહક',
    roleStaff: 'સ્ટાફ હેર સ્ટાઈલિસ્ટ',
    roleAdmin: 'મુખ્ય મેનેજર',
    executiveAdmin: 'કાર્યકારી મેનેજર',

    // Login
    loginHeading: 'સલૂન મોનિટરિંગ સિસ્ટમ',
    loginSubheading: 'રીઅલ-ટાઇમ અપોઇન્ટમેન્ટ, લાઈવ લાઇન ટ્રેકિંગ અને AI સ્વચાલિત કામગીરી.',
    loginTab: 'સાઇન ઇન',
    registerTab: 'નવા ગ્રાહક નોંધણી',
    emailOrUserLabel: 'ઈમેલ અથવા યુઝરનેમ',
    passwordLabel: 'પાસવર્ડ',
    rememberMe: 'મને આ ઉપકરણ પર યાદ રાખો',
    signInButton: 'પ્રવેશ કરો',
    signingIn: 'ચકાસણી ચાલુ છે...',
    signUpButton: 'ખાતું બનાવો',
    registerPrompt: 'સલૂનમાં નવા ગ્રાહક છો?',
    backToLogin: 'સાઇન ઇન પર પાછા જાઓ',
    fullNameLabel: 'પૂરું નામ',
    phoneLabel: 'મોબાઇલ નંબર',
    quickDemoPills: 'મૂલ્યાંકન માટે ૧-ક્લિક લૉગિન:',
    demoCustomer: 'ગ્રાહક',
    demoStaff: 'સ્ટાફ વાણંદ',
    demoAdmin: 'મેનેજર',
    secureNotice: 'લૉગિન પર ભૂમિકા આપમેળે ઓળખાય છે.',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
    resetPassword: 'પાસવર્ડ રીસેટ',
    resetInstructionsSent: 'રીસેટ સૂચનાઓ મોકલવામાં આવી છે',
    sendResetLink: 'રીસેટ લિંક મોકલો',
    cancel: 'રદ કરો',

    // AI Tools
    aiCopilot: 'AI કોપાયલટ',
    aiConcierge: 'AI સહાયક',
    aiVoiceCall: 'AI વૉઇસ કૉલ',
    aiEmailReceipt: 'AI રસીદ ઈમેલ',
    aiOptimizer: 'AI લાઇન મેનેજર',
    askAi: 'AI ને પૂછો',

    // Customer Portal Navigation & Headings
    customerNavHome: 'લાઇન સ્થિતિ',
    customerNavMenu: 'સેવા મેનૂ',
    customerNavBook: 'સેવા બુક કરો',
    customerNavHistory: 'મારી બુકિંગ',
    customerNavQueue: 'લાઇવ લાઇન',
    customerNavPass: 'VIP સભ્યપદ',
    customerNavReceipts: 'રસીદો',
    customerNavRefunds: 'રીફંડ',
    customerNavFeedback: 'પ્રતિભાવ',
    customerNavProfile: 'પ્રોફાઇલ',

    yourQueueToken: 'તમારો લાઇન ટોકન',
    estimatedWaitTime: 'અંદાજિત પ્રતીક્ષા સમય',
    activeStylist: 'વાળ કલાકાર',
    assignedStation: 'આપેલ ખુરશી',
    bookAppointmentTitle: 'અપોઇન્ટમેન્ટ બુક કરો',
    selectService: 'સેવા પસંદ કરો',
    selectStylist: 'પસંદગીના કલાકાર',
    masterStylistAddon: 'ઉસ્તાદ કલાકાર ગેરંટી (+₹૫૦ વધારાના)',
    vipDiscountApplied: 'VIP પાસ ૧૫% ડિસ્કાઉન્ટ લાગુ!',
    checkInButton: 'હમણાં ચેક-ઇન કરો (ટોકન મેળવો)',
    checkedInStatus: 'ચેક-ઇન થયું (રાહ જુઓ)',
    cancelBooking: 'બુકિંગ રદ કરો',
    requestRefund: 'રીફંડ માટે વિનંતી',
    viewReceipt: 'બિલ જુઓ',
    talkToAi: 'સ્ટાઇલિંગ સલાહ માટે AI ને પૂછો',

    // Staff Portal Navigation & Headings
    staffNavDashboard: 'સ્ટાઈલિસ્ટ ફ્લોર કન્સોલ',
    staffNavAppointments: 'આજનું બુકિંગ',
    staffNavCheckin: 'ઝડપી હાજરી',
    staffNavWalkIn: 'નવા ગ્રાહક ઉમેરો',
    staffNavQueue: 'સલૂન લાઇન',
    staffNavCustomers: 'ગ્રાહક શોધ',
    staffNavStations: 'ખુરશી સમયપત્રક',
    staffNavBilling: 'બિલિંગ અને POS',
    staffNavRefunds: 'રીફંડ ટિકિટ',
    staffNavShift: 'શિફ્ટ હાજરી',
    staffNavProfile: 'પ્રોફાઇલ',

    currentStationStatus: 'સલૂન ખુરશી સ્થિતિ',
    toggleAvailability: 'ઉપલબ્ધ / વ્યસ્ત બદલો',
    callNextCustomer: 'આગલા ગ્રાહકને બોલાવો',
    completeServiceBtn: 'સેવા પૂર્ણ કરો અને બિલ લો',
    walkInCustomerName: 'ગ્રાહકનું પૂરું નામ',
    walkInPhone: 'મોબાઇલ નંબર (AI કૉલ માટે)',
    walkInService: 'સેવા પસંદ કરો',
    assignStylist: 'સ્ટાઈલિસ્ટ ફાળવો',
    issueWalkInToken: 'ટોકન આપો અને લાઇનમાં ઉમેરો',
    collectPaymentTitle: 'POS ઝડપી બિલિંગ',
    paymentMethod: 'ચુકવણી પદ્ધતિ',
    cash: 'રોકડ (Cash)',
    upi: 'UPI (GPay / PhonePe)',
    card: 'કાર્ડ / POS',
    processPaymentBtn: 'પેમેન્ટ કન્ફર્મ કરો અને AI રસીદ મોકલો',
    printReceipt: 'રસીદ પ્રિન્ટ કરો',
    seatCustomer: 'ખુરશી પર બેસાડો',
    serviceCompleted: 'સેવા પૂર્ણ થઈ',
    noShow: 'ગેરહાજર નોંધો',
    call: 'બોલાવો',
    start: 'શરૂ કરો',
    checkout: 'બિલ લો',

    // Status dropdown options
    statusAvailableOption: '🟢 ઉપલબ્ધ (Available)',
    statusBusyOption: '🔵 વ્યસ્ત (ખુરશી પર)',
    statusBreakOption: '🟡 ચા રજા (On Break)',
    statusLeaveOption: '⚪ રજા પર (On Leave)',

    // Metric Badges
    stationLabel: 'ખુરશી',
    completedLabel: 'પૂર્ણ થયેલ',
    inQueueLabel: 'લાઇનમાં',
    ratingLabel: 'રેટિંગ',
    statusLabel: 'સ્થિતિ',

    // Admin Portal Navigation & Headings
    adminNavOverview: 'કંટ્રોલ રૂમ',
    adminNavBahiKhata: 'વહી-ખાતા લેજર',
    adminNavOptimizer: 'AI લાઇન મેનેજર',
    adminNavEmails: 'AI મોકલેલ ઈમેઈલ',
    adminNavPasses: 'વીઆઈપી પાસ',
    adminNavAppointments: 'માસ્ટર બુકિંગ',
    adminNavStaff: 'કલાકારોની યાદી',
    adminNavServices: 'સેવા મેનૂ',
    adminNavUsers: 'યુઝર એકાઉન્ટ્સ',
    adminNavRefunds: 'રીફંડ મંજૂરી',
    adminNavAudit: 'સુરક્ષા લૉગ્સ',
    adminNavSettings: 'સલૂન સેટિંગ્સ',

    totalRevenue: 'આજની કુલ આવક',
    activeQueueCount: 'લાઇનમાં કુલ ગ્રાહકો',
    stylistUtilization: 'સરેરાશ કામનો બોજ',
    customerSatisfaction: 'ગ્રાહક સંતોષ',
    rebalanceStations: 'AI ખુરશી સંતુલન કરો',
    approveRefund: 'રીફંડ મંજૂર કરો',
    rejectRefund: 'રીફંડ નકારો',
    addNewService: 'મેનૂમાં નવી સેવા ઉમેરો',
    serviceName: 'સેવાનું નામ',
    servicePrice: 'કિંમત (₹)',
    serviceDuration: 'સમય (મિનિટ)',
    saveService: 'મેનૂમાં સાચવો',

    // Common
    statusWaiting: 'પ્રતીક્ષામાં',
    statusInService: 'સેવા ચાલુ',
    statusCompleted: 'પૂર્ણ થયું',
    statusCancelled: 'રદ',
    statusAvailable: 'ઉપલબ્ધ',
    statusBusy: 'વ્યસ્ત',
    statusBreak: 'રજા પર',
    paid: 'ચૂકવેલ',
    unpaid: 'બાકી',
    close: 'બંધ કરો',
    minutes: 'મિનિટ',
  },
}

export type TranslationKey = keyof typeof TRANSLATIONS.en

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: TranslationKey, fallback?: string) => string
  currentLanguageOption: LanguageOption
  supportedLanguages: LanguageOption[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = 'salonops_user_language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en') // Default to clean pure English

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode
      if (savedLang && ['en', 'hi', 'mr', 'gu'].includes(savedLang)) {
        setLanguageState(savedLang)
      }
    } catch {
      // Storage unavailable
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    } catch {
      // Storage unavailable
    }
  }

  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en
    return langDict[key] || TRANSLATIONS.en[key] || fallback || key
  }

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
