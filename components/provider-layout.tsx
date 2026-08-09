"use client";

import {SignOutButton, UserButton} from "@clerk/nextjs";
import type {ProviderStatus} from "@prisma/client";
import {AnimatePresence, motion} from "framer-motion";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarCheck,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LifeBuoy,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  X
} from "lucide-react";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {type ReactNode, useState} from "react";

import {Link} from "@/i18n/navigation";

type ProviderLayoutProps = {
  children: ReactNode;
  status: ProviderStatus;
  providerName: string;
  breadcrumb: string;
  notification?: string;
  unreadNotifications?: number;
};

const navItems = [
  {href: "/provider/dashboard", label: "Dashboard", icon: Home, always: true},
  {href: "/provider/profile", label: "My Profile", icon: UserRound, always: false},
  {href: "/provider/services-offered", label: "Services Offered", icon: BriefcaseBusiness, always: false},
  {href: "/provider/leads", label: "Leads", icon: Users, always: false},
  {href: "/provider/bookings", label: "Bookings", icon: CalendarCheck, always: false},
  {href: "/provider/messages", label: "Messages", icon: MessageSquare, always: false},
  {href: "/provider/documents", label: "Documents", icon: FileText, always: true},
  {href: "/provider/verification", label: "Verification Status", icon: ShieldCheck, always: true},
  {href: "/provider/subscription", label: "Subscription", icon: CreditCard, always: false},
  {href: "/provider/analytics", label: "Analytics", icon: BarChart3, always: false},
  {href: "/provider/reviews", label: "Reviews", icon: Star, always: false},
  {href: "/provider/support", label: "Support", icon: LifeBuoy, always: true},
  {href: "/provider/settings", label: "Settings", icon: Settings, always: true}
] as const;

const bottomItems = [
  {href: "/provider/dashboard", label: "Dashboard", icon: Home},
  {href: "/provider/leads", label: "Leads", icon: Users},
  {href: "/provider/messages", label: "Messages", icon: MessageSquare},
  {href: "/provider/profile", label: "Profile", icon: UserRound}
] as const;

export function ProviderLayout({children, status, providerName, breadcrumb, notification, unreadNotifications = 0}: ProviderLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const approved = status === "APPROVED";

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <DesktopSidebar collapsed={collapsed} approved={approved} pathname={pathname} status={status} onToggle={() => setCollapsed((value) => !value)} />
      <MobileDrawer open={drawerOpen} approved={approved} pathname={pathname} status={status} onClose={() => setDrawerOpen(false)} />

      <div className={collapsed ? "lg:pl-24" : "lg:pl-[19rem]"}>
        <header className="sticky top-0 z-30 border-b border-[#e4e8f0] bg-[#f8fafc]/92 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e4e8f0] bg-white text-[#005BAC] lg:hidden" aria-label="Open provider navigation">
              <Menu size={20} aria-hidden />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">Provider Portal / {breadcrumb}</p>
              <h1 className="mt-1 truncate font-heading text-xl font-bold text-[#111827]">Welcome, {providerName}</h1>
            </div>

            <label className="hidden min-h-11 w-full max-w-md items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-4 shadow-sm xl:flex">
              <Search className="text-[#005BAC]" size={18} aria-hidden />
              <input className="w-full bg-transparent text-sm font-semibold text-[#172033] outline-none placeholder:text-[#8b95a7]" placeholder="Search leads, bookings, documents..." aria-label="Search provider portal" />
            </label>

            <Link href="/provider/support" className="hidden h-11 items-center gap-2 rounded-2xl border border-[#e4e8f0] bg-white px-4 text-sm font-bold text-[#1f2937] transition hover:bg-[#EAF4FF] hover:text-[#005BAC] md:inline-flex">
              <HelpCircle size={18} aria-hidden />
              Help
            </Link>

            <Link href="/provider/messages" className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e4e8f0] bg-white text-[#005BAC]" aria-label="Notifications">
              <Bell size={19} aria-hidden />
              {unreadNotifications > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">{unreadNotifications}</span>}
            </Link>

            <UserButton />
          </div>
          {notification && <p className="mt-3 rounded-2xl border border-[#dbeafe] bg-[#EAF4FF] px-4 py-2 text-sm font-semibold text-[#005BAC]">{notification}</p>}
        </header>

        <AnimatePresence mode="wait">
          <motion.main key={pathname} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -8}} transition={{duration: 0.22}} className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e4e8f0] bg-white px-2 py-2 shadow-[0_-12px_35px_rgba(15,23,42,0.08)] lg:hidden" aria-label="Provider bottom navigation">
        <div className="grid grid-cols-5 gap-1">
          {bottomItems.map((item) => <BottomNavItem key={item.href} item={item} pathname={pathname} approved={approved} />)}
          <button type="button" onClick={() => setDrawerOpen(true)} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-[#4b5563]">
            <Menu size={18} aria-hidden />
            More
          </button>
        </div>
      </nav>
    </div>
  );
}

function DesktopSidebar({collapsed, approved, pathname, status, onToggle}: {collapsed: boolean; approved: boolean; pathname: string; status: ProviderStatus; onToggle: () => void}) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-[#e4e8f0] bg-[#0e355f] px-4 py-5 text-white shadow-[12px_0_35px_rgba(15,23,42,0.12)] transition-all duration-300 lg:block ${collapsed ? "w-24" : "w-[19rem]"}`}>
      <div className="flex items-center justify-between gap-3">
        <Link href="/provider/dashboard" className="flex min-w-0 items-center gap-3" aria-label="Provider portal home">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
            <Image src="/brand/kaunbatayega-logo.png" alt="KaunBatayega" width={735} height={385} className="h-10 w-10 object-contain" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block font-heading text-lg font-bold">Provider Portal</span>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8c7d9]">{statusLabel(status)}</span>
            </span>
          )}
        </Link>
        <button type="button" onClick={onToggle} className="rounded-xl p-2 text-[#dbe7f5] transition hover:bg-white/10" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeftOpen size={18} aria-hidden /> : <PanelLeftClose size={18} aria-hidden />}
        </button>
      </div>

      <nav className="mt-8 grid gap-1" aria-label="Provider navigation">
        {navItems.map((item) => <SidebarItem key={item.href} item={item} approved={approved} collapsed={collapsed} pathname={pathname} />)}
      </nav>

      <SignOutButton>
        <button type="button" className="absolute bottom-5 left-4 right-4 flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#0e355f]">
          <LogOut size={17} aria-hidden />
          {!collapsed && "Logout"}
        </button>
      </SignOutButton>
    </aside>
  );
}

function MobileDrawer({open, approved, pathname, status, onClose}: {open: boolean; approved: boolean; pathname: string; status: ProviderStatus; onClose: () => void}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button aria-label="Close navigation overlay" className="fixed inset-0 z-50 bg-slate-950/45 lg:hidden" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={onClose} />
          <motion.aside initial={{x: "-100%"}} animate={{x: 0}} exit={{x: "-100%"}} transition={{duration: 0.24}} className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-sm overflow-y-auto bg-[#0e355f] p-5 text-white shadow-2xl lg:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-lg font-bold">Provider Portal</p>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8c7d9]">{statusLabel(status)}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl p-2 text-white hover:bg-white/10" aria-label="Close provider navigation">
                <X size={20} aria-hidden />
              </button>
            </div>
            <nav className="mt-8 grid gap-1">
              {navItems.map((item) => <SidebarItem key={item.href} item={item} approved={approved} collapsed={false} pathname={pathname} onClick={onClose} />)}
            </nav>
            <SignOutButton>
              <button type="button" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-bold text-white">
                <LogOut size={17} aria-hidden />
                Logout
              </button>
            </SignOutButton>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SidebarItem({item, approved, collapsed, pathname, onClick}: {item: (typeof navItems)[number]; approved: boolean; collapsed: boolean; pathname: string; onClick?: () => void}) {
  const Icon = item.icon;
  const active = pathname.includes(item.href);
  const locked = !approved && !item.always;
  const unavailable = locked;
  const className = `group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${
    active ? "bg-white text-[#0e355f]" : unavailable ? "cursor-not-allowed text-[#8aa0ba]" : "text-[#dbe7f5] hover:bg-white/10 hover:text-white"
  } ${collapsed ? "justify-center" : ""}`;

  if (unavailable) {
    return (
      <span className={className} title="Available after verification." aria-disabled="true">
        <Icon size={19} aria-hidden />
        {!collapsed && <span className="flex-1">{item.label}</span>}
        <Lock size={14} className="text-[#8aa0ba]" aria-label="Available after verification" />
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={className}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={19} aria-hidden />
      {!collapsed && <span className="flex-1">{item.label}</span>}
      {locked && !collapsed && <Lock size={14} className={active ? "text-[#0e355f]" : "text-[#b8c7d9]"} aria-label="Locked until verification" />}
    </Link>
  );
}

function BottomNavItem({item, pathname, approved}: {item: (typeof bottomItems)[number]; pathname: string; approved: boolean}) {
  const Icon = item.icon;
  const active = pathname.includes(item.href);
  const locked = !approved && !["/provider/dashboard", "/provider/profile"].includes(item.href);

  if (locked) {
    return (
      <span className="flex cursor-not-allowed flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-[#9ca3af]" title="Available after verification." aria-disabled="true">
        <Lock size={18} aria-hidden />
        {item.label}
      </span>
    );
  }

  return (
    <Link href={item.href} className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold ${active ? "bg-[#EAF4FF] text-[#005BAC]" : "text-[#4b5563]"}`}>
      <Icon size={18} aria-hidden />
      {item.label}
    </Link>
  );
}

function statusLabel(status: ProviderStatus) {
  const labels: Record<ProviderStatus, string> = {
    DRAFT: "Draft",
    PENDING: "Pending Verification",
    APPROVED: "Verified",
    REJECTED: "Rejected",
    NEEDS_MORE_DOCUMENTS: "Needs Documents"
  };

  return labels[status];
}
