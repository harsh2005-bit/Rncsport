"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/auth-context";

const adminLinks = [
  { name: "Verification", href: "/admin", icon: LayoutDashboard },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-secondary/20 hidden flex-col lg:flex">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-background">
                JSR
             </div>
             <span className="font-black text-xl tracking-tight uppercase">Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
           <div className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-3 mb-4">Menu</div>
           {adminLinks.map((link) => {
             const isActive = pathname === link.href;
             return (
               <Link
                 key={link.name}
                 href={link.href}
                 className={cn(
                   "flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all",
                   isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                 )}
               >
                 <link.icon className="w-5 h-5" />
                 {link.name}
               </Link>
             );
           })}
        </div>
        <div className="p-6 border-t border-border">
            <button 
              onClick={logout}
              className="w-full py-2 bg-destructive/10 text-destructive font-bold rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all cursor-pointer"
            >
              Sign Out
            </button>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Admin Header (Mobile / Topbar) */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="font-bold">Welcome, Super Admin</div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-muted-foreground">System Online</span>
               </div>
            </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-10 hide-scrollbar overflow-y-auto w-full h-full">
            {children}
        </div>
      </main>
    </div>
  );
}
