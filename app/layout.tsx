import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'डीलक्स उस्ताद सैलून — USTAAD Deluxe Salon Ops & Real-Time Monitor',
  description:
    'Traditional Karigari meets Precision Automation. Real-Time Salon Monitoring, Queue Management, AI Voice Telephony & Operational Audit System.',
  icons: {
    icon: '/images/salon_logo.jpg',
    apple: '/images/salon_logo.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#D63927',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rozha+One&family=Yatra+One&family=Modak&family=Shrikhand&family=Space+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen text-[#1C1B1A] font-sans selection:bg-[#F5B82E] selection:text-[#1C1B1A]">
        {children}
      </body>
    </html>
  )
}
