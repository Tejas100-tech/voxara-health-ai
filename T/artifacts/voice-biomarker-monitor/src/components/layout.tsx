import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ClipboardList, FileSearch, FileText, LayoutDashboard, LogOut, Moon, Sun,
  Menu, X, Stethoscope, ShieldCheck, User, Globe, Calendar, MessageSquare, Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

interface LayoutProps {
  children: ReactNode;
  userType?: "patient" | "clinician";
}

export function AppLayout({ children, userType = "patient" }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const effectiveRole = user?.role ?? userType;

  const patientNav = [
    { name: t("nav.dashboard"), href: "/", icon: LayoutDashboard },
    { name: t("nav.newIntake"), href: "/intake", icon: ClipboardList },
    { name: t("nav.records"), href: "/records", icon: FileText },
    { name: t("nav.appointments") || "Appointments", href: "/appointments", icon: Calendar },
    { name: t("nav.chatGeneral") || "Health Chat", href: "/chat/general", icon: MessageSquare },
    { name: t("nav.chatAyush") || "AYUSH Chat", href: "/chat/ayush", icon: Leaf },
    { name: t("nav.profile"), href: "/profile", icon: User },
  ];

  const clinicianNav = [
    { name: t("nav.clinician"), href: "/clinician", icon: LayoutDashboard },
    { name: t("nav.queue"), href: "/clinician/queue", icon: ClipboardList },
    { name: t("nav.reviews"), href: "/clinician/reviews", icon: FileSearch },
    { name: t("nav.appointments") || "Appointments", href: "/clinician/appointments", icon: Calendar },
    { name: t("nav.chatGeneral") || "Health Chat", href: "/chat/general", icon: MessageSquare },
    { name: t("nav.chatAyush") || "AYUSH Chat", href: "/chat/ayush", icon: Leaf },
  ];

  const nav = effectiveRole === "clinician" ? clinicianNav : patientNav;
  const currentPage = nav.find(
    (n) => n.href === location || (location.startsWith(n.href) && n.href !== "/")
  )?.name ?? t("nav.dashboard");

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="shrink-0 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Stethoscope size={22} />
          </div>
          <div>
            <h2 className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base leading-tight tracking-tight font-[Manrope]">
              {t("app.name")}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              {t("app.tagline")}
            </p>
          </div>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground">
          <X size={18} />
        </button>
      </div>

      {user && (
        <div className="shrink-0 mx-4 mb-4 rounded-2xl bg-muted/50 border p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                {user.role} · {user.patientId}
              </p>
            </div>
          </div>
          {user.abhaId && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck size={12} /> ABHA: {user.abhaId}
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto min-h-0">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <Icon size={18} />{item.name}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 p-4 border-t space-y-2">
        {effectiveRole === "patient" && (
          <Link href="/intake" onClick={() => setMobileOpen(false)}>
            <Button className="w-full rounded-xl py-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg shadow-emerald-500/20" size="lg">
              <ClipboardList className="mr-2" size={18} />{t("nav.startNewIntake")}
            </Button>
          </Link>
        )}
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl font-semibold transition-all">
          <LogOut size={16} />{t("nav.signOut")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 fixed inset-y-0 border-r bg-card z-20 flex-col">
        <Sidebar />
      </aside>

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
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground">
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <h1 className="font-bold text-xl tracking-tight font-[Manrope] text-foreground">{currentPage}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="h-9 rounded-lg border bg-background px-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[120px]"
              title="Change language"
            >
              {LANGUAGES.filter((l) => ["en","hi","ta","te","bn","mr","gu","kn","ml","pa","or","as","ur","sa","ne"].includes(l.code)).map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
              ))}
            </select>

            <button onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all hover:text-foreground border border-transparent hover:border-border"
              title="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm cursor-default select-none shadow-md">
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
