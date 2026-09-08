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
    telemetryTooltip: 'Protected from evil eye • Live Telemetry 99.9% Uptime Active',
    portalSuffix: 'Portal',
    logout: 'Sign Out',
    radioTitle: 'Salon Radio 98.3 FM',
    radioTagline: 'From Tansen to Rafi Saab — Sweet melodies of Deluxe Salon',
    station: 'Station',
    verifyingSession: 'Verifying Session...',
    changeLanguage: 'Language',

    // Roles
    roleCustomer: 'Customer',
    roleStaff: 'Staff',
    roleAdmin: 'Admin',

    // Login
    loginHeading: 'Salon Monitoring System',
    loginSubheading: 'Real-time appointments, live queue tracking & AI automated operations.',
    loginTab: 'Sign In',
    registerTab: 'Customer Sign Up',
    emailOrUserLabel: 'Email or Username',
    passwordLabel: 'Password',
    rememberMe: 'Remember this device for 30 days',
    signInButton: 'Authenticate & Enter Portal',
    signingIn: 'Verifying Credentials...',
    signUpButton: 'Create Customer Account',
    registerPrompt: 'New Customer? Create an account in 10 seconds',
    backToLogin: 'Back to Sign In',
    fullNameLabel: 'Full Name',
    phoneLabel: 'Mobile Phone Number',
    quickDemoPills: 'Quick 1-Click Role Login for Evaluation:',
    demoCustomer: 'Customer Portal',
    demoStaff: 'Staff Console',
    demoAdmin: 'Admin Executive',
    secureNotice: 'Role is automatically identified upon login. Single universal gateway.',

    // AI Tools
    aiCopilot: 'AI Copilot',
    aiConcierge: 'AI Concierge',
    aiVoiceCall: 'AI Voice Call',
    aiEmailReceipt: 'AI Memory Receipt',
    aiOptimizer: 'AI Queue Optimizer',

    // Customer Portal
    customerNavHome: 'Overview & Queue',
    customerNavBook: 'Book Service',
    customerNavHistory: 'My Bookings',
    customerNavPass: 'VIP Membership',
    customerNavFeedback: 'Feedback',
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

    // Staff Portal
    staffNavQueue: 'Floor Queue',
    staffNavStations: 'Stations',
    staffNavWalkIn: 'Add Walk-In',
    staffNavBilling: 'POS & Billing',
    currentStationStatus: 'Styling Stations Floor Grid',
    toggleAvailability: 'Toggle Available / Busy',
    callNextCustomer: 'Call Customer (Trigger AI Alert)',
    completeServiceBtn: 'Complete & Collect Payment',
    walkInCustomerName: 'Walk-in Customer Name',
    walkInPhone: 'Customer Phone',
    walkInService: 'Service Requested',
    issueWalkInToken: 'Issue Token & Add to Queue',
    collectPaymentTitle: 'POS Quick Checkout',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    upi: 'UPI (GPay / PhonePe)',
    card: 'Card / POS',
    processPaymentBtn: 'Confirm & Dispatch AI Receipt',

    // Admin Portal
    adminNavOverview: 'Live Floor Ledger',
    adminNavBahiKhata: 'Bahi-Khata Ledger',
    adminNavOptimizer: 'AI Queue Optimizer',
    adminNavStaff: 'Stylist Roster',
    adminNavServices: 'Service Catalog',
    adminNavEmails: 'AI Dispatched Emails',
    adminNavAudit: 'Security Audit Logs',
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

    // Roles
    roleCustomer: 'ग्राहक',
    roleStaff: 'स्टाफ',
    roleAdmin: 'प्रबंधक',

    // Login
    loginHeading: 'सैलून मॉनिटरिंग सिस्टम',
    loginSubheading: 'रीयल-टाइम अपॉइंटमेंट, लाइव कतार ट्रैकिंग और AI स्वचालित संचालन।',
    loginTab: 'लॉग इन करें',
    registerTab: 'नया ग्राहक पंजीकरण',
    emailOrUserLabel: 'ईमेल या उपयोगकर्ता नाम',
    passwordLabel: 'पासवर्ड',
    rememberMe: 'मुझे 30 दिनों तक याद रखें',
    signInButton: 'प्रवेश करें',
    signingIn: 'पहचान सत्यापित हो रही है...',
    signUpButton: 'खाता बनाएं',
    registerPrompt: 'नए ग्राहक हैं? 10 सेकंड में खाता बनाएं',
    backToLogin: 'लॉग इन पर वापस जाएं',
    fullNameLabel: 'पूरा नाम',
    phoneLabel: 'मोबाइल फोन नंबर',
    quickDemoPills: 'मूल्यांकन के लिए त्वरित 1-क्लिक लॉगिन:',
    demoCustomer: 'ग्राहक पटल',
    demoStaff: 'स्टाफ कंसोल',
    demoAdmin: 'प्रबंधक पटल',
    secureNotice: 'लॉग इन पर भूमिका स्वतः पहचानी जाती है। एकल सुरक्षित द्वार।',

    // AI Tools
    aiCopilot: 'AI कोपायलट',
    aiConcierge: 'AI दरबान',
    aiVoiceCall: 'AI वॉयस कॉल',
    aiEmailReceipt: 'AI मेमोरी रसीद',
    aiOptimizer: 'AI कतार अनुकूलक',

    // Customer Portal
    customerNavHome: 'कतार स्थिति',
    customerNavBook: 'सेवा बुक करें',
    customerNavHistory: 'मेरी बुकिंग',
    customerNavPass: 'VIP सदस्यता',
    customerNavFeedback: 'प्रतिक्रिया',
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

    // Staff Portal
    staffNavQueue: 'सैलून कतार',
    staffNavStations: 'चेयर स्थिति',
    staffNavWalkIn: 'वॉक-इन जोड़ें',
    staffNavBilling: 'बिलिंग व POS',
    currentStationStatus: 'सैलून फ्लोर चेयर स्थिति',
    toggleAvailability: 'उपलब्ध / व्यस्त बदलें',
    callNextCustomer: 'ग्राहक को बुलाएं (AI अलर्ट कॉल)',
    completeServiceBtn: 'सेवा पूर्ण करें और भुगतान लें',
    walkInCustomerName: 'वॉक-इन ग्राहक का नाम',
    walkInPhone: 'मोबाइल नंबर',
    walkInService: 'वांछित सेवा',
    issueWalkInToken: 'टोकन जारी करें और कतार में जोड़ें',
    collectPaymentTitle: 'POS त्वरित बिलिंग',
    paymentMethod: 'भुगतान का तरीका',
    cash: 'नकद (Cash)',
    upi: 'UPI (GPay / PhonePe)',
    card: 'कार्ड / POS',
    processPaymentBtn: 'भुगतान पुष्टि करें और AI रसीद भेजें',

    // Admin Portal
    adminNavOverview: 'लाइव फ्लोर लेजर',
    adminNavBahiKhata: 'बही-खाता लेजर',
    adminNavOptimizer: 'AI कतार अनुकूलक',
    adminNavStaff: 'स्टाइलिस्ट सूची',
    adminNavServices: 'सेवा सूची',
    adminNavEmails: 'AI भेजी गई ईमेल',
    adminNavAudit: 'सुरक्षा ऑडिट लॉग्स',
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

    // Roles
    roleCustomer: 'ग्राहक',
    roleStaff: 'कर्मचारी',
    roleAdmin: 'व्यवस्थापक',

    // Login
    loginHeading: 'सलून मॉनिटरिंग प्रणाली',
    loginSubheading: 'थेट अपॉइंटमेंट, रांगेचा मागोवा आणि AI स्वयंचलित व्यवस्थापन.',
    loginTab: 'लॉग इन करा',
    registerTab: 'नवीन ग्राहक नोंदणी',
    emailOrUserLabel: 'ईमेल किंवा वापरकर्ता नाव',
    passwordLabel: 'पासवर्ड',
    rememberMe: 'मला ३० दिवस आठवणीत ठेवा',
    signInButton: 'प्रवेश करा',
    signingIn: 'सत्यापन होत आहे...',
    signUpButton: 'खाते तयार करा',
    registerPrompt: 'नवीन ग्राहक? १० सेकंदात खाते सुरू करा',
    backToLogin: 'लॉग इनकडे परत जा',
    fullNameLabel: 'पूर्ण नाव',
    phoneLabel: 'मोबाईल नंबर',
    quickDemoPills: 'चाचणीसाठी १-क्लिक थेट लॉगिन:',
    demoCustomer: 'ग्राहक विभाग',
    demoStaff: 'कर्मचारी विभाग',
    demoAdmin: 'व्यवस्थापक विभाग',
    secureNotice: 'लॉग इन करताच भूमिका आपोआप ओळखली जाईल.',

    // AI Tools
    aiCopilot: 'AI सहाय्यक',
    aiConcierge: 'AI सल्लागार',
    aiVoiceCall: 'AI व्हॉइस कॉल',
    aiEmailReceipt: 'AI पावती ईमेल',
    aiOptimizer: 'AI रांग व्यवस्थापक',

    // Customer Portal
    customerNavHome: 'रांग स्थिती',
    customerNavBook: 'सेवा बुक करा',
    customerNavHistory: 'माझ्या बुकिंग्स',
    customerNavPass: 'VIP सभासदत्व',
    customerNavFeedback: 'अभिप्राय',
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

    // Staff Portal
    staffNavQueue: 'सलून रांग',
    staffNavStations: 'खुर्ची स्थिती',
    staffNavWalkIn: 'थेट ग्राहक जोडा',
    staffNavBilling: 'बिलिंग व POS',
    currentStationStatus: 'सलून खुर्ची स्थिती',
    toggleAvailability: 'उपलब्ध / व्यस्त बदला',
    callNextCustomer: 'पुढील ग्राहकाला बोलवा (AI कॉल)',
    completeServiceBtn: 'सेवा पूर्ण करा आणि बिल घ्या',
    walkInCustomerName: 'थेट ग्राहकाचे नाव',
    walkInPhone: 'मोबाईल नंबर',
    walkInService: 'हवी असलेली सेवा',
    issueWalkInToken: 'टोकन द्या व रांगेत जोडा',
    collectPaymentTitle: 'POS जलद बिलिंग',
    paymentMethod: 'पेमेंट पद्धत',
    cash: 'रोख (Cash)',
    upi: 'UPI (GPay / PhonePe)',
    card: 'कार्ड / POS',
    processPaymentBtn: 'पेमेंट जमा करा व AI पावती पाठवा',

    // Admin Portal
    adminNavOverview: 'थेट हिशोब खतावणी',
    adminNavBahiKhata: 'वही-खाते लेजर',
    adminNavOptimizer: 'AI रांग व्यवस्थापक',
    adminNavStaff: 'कारागीर यादी',
    adminNavServices: 'सेवा मेनू',
    adminNavEmails: 'AI पाठवलेले ईमेल',
    adminNavAudit: 'सुरक्षा नोंदी',
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

    // Roles
    roleCustomer: 'ગ્રાહક',
    roleStaff: 'સ્ટાફ',
    roleAdmin: 'મેનેજર',

    // Login
    loginHeading: 'સલૂન મોનિટરિંગ સિસ્ટમ',
    loginSubheading: 'રીઅલ-ટાઇમ અપોઇન્ટમેન્ટ, લાઈવ લાઇન ટ્રેકિંગ અને AI સ્વચાલિત કામગીરી.',
    loginTab: 'સાઇન ઇન',
    registerTab: 'નવા ગ્રાહક નોંધણી',
    emailOrUserLabel: 'ઈમેલ અથવા યુઝરનેમ',
    passwordLabel: 'પાસવર્ડ',
    rememberMe: 'મને ૩૦ દિવસ યાદ રાખો',
    signInButton: 'પ્રવેશ કરો',
    signingIn: 'ચકાસણી ચાલુ છે...',
    signUpButton: 'ખાતું બનાવો',
    registerPrompt: 'નવા ગ્રાહક? ૧૦ સેકન્ડમાં ખાતું બનાવો',
    backToLogin: 'સાઇન ઇન પર પાછા જાઓ',
    fullNameLabel: 'પૂરું નામ',
    phoneLabel: 'મોબાઇલ નંબર',
    quickDemoPills: 'મૂલ્યાંકન માટે ૧-ક્લિક લૉગિન:',
    demoCustomer: 'ગ્રાહક વિભાગ',
    demoStaff: 'સ્ટાફ વિભાગ',
    demoAdmin: 'મેનેજર વિભાગ',
    secureNotice: 'લૉગિન પર ભૂમિકા આપમેળે ઓળખાય છે.',

    // AI Tools
    aiCopilot: 'AI કોપાયલટ',
    aiConcierge: 'AI સહાયક',
    aiVoiceCall: 'AI વૉઇસ કૉલ',
    aiEmailReceipt: 'AI રસીદ ઈમેલ',
    aiOptimizer: 'AI લાઇન મેનેજર',

    // Customer Portal
    customerNavHome: 'લાઇન સ્થિતિ',
    customerNavBook: 'સેવા બુક કરો',
    customerNavHistory: 'મારી બુકિંગ',
    customerNavPass: 'VIP સભ્યપદ',
    customerNavFeedback: 'પ્રતિભાવ',
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

    // Staff Portal
    staffNavQueue: 'સલૂન લાઇન',
    staffNavStations: 'ખુરશી સ્થિતિ',
    staffNavWalkIn: 'નવા ગ્રાહક ઉમેરો',
    staffNavBilling: 'બિલિંગ અને POS',
    currentStationStatus: 'સલૂન ખુરશી સ્થિતિ',
    toggleAvailability: 'ઉપલબ્ધ / વ્યસ્ત બદલો',
    callNextCustomer: 'આગલા ગ્રાહકને બોલાવો (AI કૉલ)',
    completeServiceBtn: 'સેવા પૂર્ણ કરો અને બિલ લો',
    walkInCustomerName: 'ગ્રાહકનું નામ',
    walkInPhone: 'મોબાઇલ નંબર',
    walkInService: 'જરૂરી સેવા',
    issueWalkInToken: 'ટોકન આપો અને લાઇનમાં ઉમેરો',
    collectPaymentTitle: 'POS ઝડપી બિલિંગ',
    paymentMethod: 'ચુકવણી પદ્ધતિ',
    cash: 'રોકડ (Cash)',
    upi: 'UPI (GPay / PhonePe)',
    card: 'કાર્ડ / POS',
    processPaymentBtn: 'પેમેન્ટ કન્ફર્મ કરો અને AI રસીદ મોકલો',

    // Admin Portal
    adminNavOverview: 'લાઈવ હિસાબ વહી',
    adminNavBahiKhata: 'વહી-ખાતા લેજર',
    adminNavOptimizer: 'AI લાઇન મેનેજર',
    adminNavStaff: 'કલાકારોની યાદી',
    adminNavServices: 'સેવા મેનૂ',
    adminNavEmails: 'AI મોકલેલ ઈમેઈલ',
    adminNavAudit: 'સુરક્ષા લૉગ્સ',
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
  const [language, setLanguageState] = useState<LanguageCode>('hi') // Default to Hindi for authentic saloon vibe, easily switchable

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
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[1]

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
