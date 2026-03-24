import type { Metadata } from "next";
import { Cinzel, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins" 
});
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  metadataBase: new URL('https://jsrsports.in'),
  title: "Best Betting Site in India | Fast UPI Deposit & Withdrawal | JSR Sports",
  description: "Join JSR Sports for premium betting access in India. Fast UPI deposits, quick withdrawals, instant account support, and 24/7 assistance.",
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: "Best Betting Site in India | Fast UPI Deposit & Withdrawal | JSR Sports",
    description: "Join JSR Sports for premium betting access in India. Fast UPI deposits, quick withdrawals, instant account support, and 24/7 assistance.",
    url: "https://jsrsports.in",
    siteName: "JSR Sports",
    images: [
      {
        url: "/hero_premium.png",
        width: 1200,
        height: 630,
        alt: "JSR Sports Betting Access",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Betting Site in India | Fast UPI Deposit & Withdrawal | JSR Sports",
    description: "Join JSR Sports for premium betting access in India. Fast UPI deposits, quick withdrawals, instant account support, and 24/7 assistance.",
    images: ["/hero_premium.png"],
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "JSR Sports",
                  "url": "https://jsrsports.in",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://jsrsports.in/?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "name": "JSR Sports",
                  "url": "https://jsrsports.in",
                  "logo": "https://jsrsports.in/logo.jpg"
                },
                {
                  "@type": "Service",
                  "name": "Online Betting Support Service",
                  "provider": {
                    "@type": "Organization",
                    "name": "JSR Sports"
                  },
                  "areaServed": {
                     "@type": "Country",
                     "name": "India"
                  },
                  "description": "Premium betting access, fast UPI deposits, and immediate 24/7 account support in India."
                }
              ]
            })
          }}
        />
      </head>
        <body className={`${inter.variable} ${poppins.variable} ${cinzel.variable} font-poppins antialiased bg-background text-foreground`}>
            <AuthProvider>
              <Navbar />
              <div className="flex pt-20">
                <Sidebar />
                <main className="flex-1 lg:pl-72 min-h-[calc(100vh-80px)] overflow-x-hidden flex flex-col">
                  <div className="p-4 md:p-8 mesh-bg flex-1">
                    {children}
                  </div>
                  <Footer />
                </main>
                <WhatsAppButton />
              </div>
              <Toaster 
                position="top-right" 
                reverseOrder={false}
                containerStyle={{
                  top: 100,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#0b0b0b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    zIndex: 999999,
                  },
                }}
              />

            </AuthProvider>

        </body>
      </html>
  );
}
