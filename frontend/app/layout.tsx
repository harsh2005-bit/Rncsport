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
  title: "JSR SPORTS | Modern Betting & Casino Platform",
  description: "Experience the next level of online gaming with JSR SPORTS. Live sports, premium casino games, and instant updates.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
              <Toaster position="bottom-right" theme="dark" closeButton richColors />
            </AuthProvider>
        </body>
      </html>
  );
}
