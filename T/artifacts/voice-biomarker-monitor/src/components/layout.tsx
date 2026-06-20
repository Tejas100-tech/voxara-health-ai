import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity, Mic, TrendingUp, BrainCircuit, Bell, FileText,
  HeartPulse, User, Radio, History, LogOut, Moon, Sun, X, Menu, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime, useLiveVitals } from "@/lib/realtime";
import { fetchUnreadCount } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

interface LayoutProps {
  children: ReactNode;
  userType?: "patient" | "clinician";
}

function useUnreadNotifications() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const n = await fetchUnreadCount();
        if (active) setCount(n);
      } catch { /* silent */ }
    };
    poll();
    const interval = setInterval(poll, 8000);
    return () => { active = false; clearInterval(interval); };
  }, []);
  return count;
}

function LiveSparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 80}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" className="w-full h-8" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,40 ${points} 100,40`} fill="hsl(var(--primary))" fillOpacity="0.12" stroke="none" />
    </svg>
  );
}

const conditionBadgeColor = (c: string) =>
  c.toLowerCase().includes("parkinson") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
  : c.toLowerCase().includes("asthma") ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
  : c.toLowerCase().includes("depression") ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
  : "bg-muted text-muted-foreground";

export function AppLayout({ children, userType = "patient" }: LayoutProps) {
  const [location] = useLocation();
  const live = useLiveVitals();
  const unreadCount = useUnreadNotifications();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sparkHistory, setSparkHistory] = useState<number[]>([70, 75, 80, 78, 82, 85, live.signalQuality]);

  useEffect(() => {
    setSparkHistory((prev) => [...prev.slice(-11), live.signalQuality]);
  }, [live.signalQuality]);

  const effectiveRole = user?.role ?? userType;

  const patientNav = [
    { name: "Dashboard", href: "/", icon: Activity },
    { name: "Record Live", href: "/record", icon: Mic },
    { name: "History", href: "/history", icon: History },
    { name: "Trends", href: "/trends", icon: TrendingUp },
    { name: "AI Analysis", href: "/analysis", icon: BrainCircuit },
    { name: "ML Insights", href: "/ml", icon: Radio },
    { name: "Appointments", href: "/appointments", icon: HeartPulse },
  ];

  const clinicianNav = [
    { name: "Command Center", href: "/clinician", icon: User },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Live Alerts", href: "/alerts", icon: Bell },
    { name: "Medication Flow", href: "/medication", icon: FileText },
  ];

  const nav = effectiveRole === "clinician" ? clinicianNav : patientNav;
  const currentPage = nav.find((n) => n.href === location || (location.startsWith(n.href) && n.href !== "/"))?.name ?? "Dashboard";

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="shrink-0 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/30">
            <HeartPulse size={22} />
          </div>
          <div>
            <h2 className="font-extrabold text-primary text-base leading-tight tracking-tight font-[Manrope]">Voxara</h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Health AI Live</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground"
        >
          <X size={18} />
        </button>
      </div>

      {user && (
        <div className="shrink-0 mx-4 mb-4 rounded-2xl bg-muted/50 border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{user.role} · {user.patientId}</p>
            </div>
          </div>
          {user.conditions && user.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.conditions.map((c) => (
                <span key={c} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${conditionBadgeColor(c)}`}>{c}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="shrink-0 mx-4 mb-4 rounded-2xl bg-primary/5 border border-primary/15 p-4">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-primary mb-2">
          <span className="flex items-center gap-2"><Radio size={13} className="animate-pulse" /> Live Signal</span>
          <span>{formatTime(live.now)}</span>
        </div>
        <LiveSparkline values={sparkHistory} />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground font-semibold">Signal quality</p>
          <p className="text-xs font-black text-primary">{live.signalQuality}%</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto min-h-0">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
          const isAlerts = item.href === "/alerts";
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm
                ${isActive
                  ? "bg-primary/10 text-primary shadow-sm border border-primary/15"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <span className="relative">
                <Icon size={18} />
                {isAlerts && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white text-[9px] font-black rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {item.name}
              {isAlerts && unreadCount > 0 && (
                <span className="ml-auto bg-destructive text-white text-[10px] font-black rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 p-4 border-t space-y-2">
        {effectiveRole === "patient" && (
          <Link href="/record" onClick={() => setMobileOpen(false)}>
            <Button className="w-full rounded-xl py-6 shadow-lg shadow-primary/20 glow-pulse" size="lg">
              <Mic className="mr-2" size={18} />
              New Live Sample
            </Button>
          </Link>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl font-semibold transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 fixed inset-y-0 border-r bg-card z-20 flex-col">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-card border-r flex flex-col h-full z-10 overflow-y-auto">
            <Sidebar />
          </aside>
        </div>
      )}

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl border-b px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <h1 className="font-bold text-xl tracking-tight font-[Manrope] text-foreground">{currentPage}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-secondary border border-secondary/20">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Realtime Active
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all hover:text-foreground border border-transparent hover:border-border"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link href="/alerts">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="text-muted-foreground" size={19} />
                {unreadCount > 0 ? (
                  <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-destructive text-white text-[9px] font-black flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-muted-foreground/30" />
                )}
              </Button>
            </Link>

            {user && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm cursor-default select-none shadow-md">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 page-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
