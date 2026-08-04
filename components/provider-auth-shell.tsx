"use client";

import {motion} from "framer-motion";
import {BarChart3, CalendarCheck, CheckCircle2, LockKeyhole, MessageSquare, ShieldCheck, Users, type LucideIcon} from "lucide-react";
import type {ReactNode} from "react";

import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {Link} from "@/i18n/navigation";

type ProviderAuthShellProps = {
  mode: "sign-in" | "sign-up";
  children: ReactNode;
};

const trustItems = [
  {label: "Verified Platform", icon: ShieldCheck},
  {label: "Secure Login", icon: LockKeyhole},
  {label: "Encrypted Data", icon: CheckCircle2},
  {label: "24x7 Support", icon: MessageSquare}
];

const signInBenefits = [
  {title: "View customer leads", icon: Users},
  {title: "Respond to messages", icon: MessageSquare},
  {title: "Manage bookings", icon: CalendarCheck},
  {title: "Track business growth", icon: BarChart3}
];

const signUpJourney = [
  "Create secure account",
  "Complete profile",
  "Upload documents",
  "Submit for review",
  "Track approval"
];

export function ProviderAuthShell({mode, children}: ProviderAuthShellProps) {
  const signIn = mode === "sign-in";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <HeroBackgroundCarousel align="left">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <motion.div initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} transition={{duration: 0.34}}>
            <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)] shadow-[var(--shadow-soft)]">
              Bharosa Hai Provider Network
            </span>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-tight text-[var(--primary)] sm:text-5xl lg:text-[54px]">
              {signIn ? "Welcome Back" : "Start Your Provider Journey"}
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--foreground)]">
              {signIn ? "Continue managing your business, enquiries, documents and customer communication from your secure provider workspace." : "Create your secure account and begin joining a trusted professional network built for verified local experts."}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {trustItems.map((item) => <TrustCard key={item.label} {...item} />)}
            </div>
            <div className="mt-7 rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
              {signIn ? <ProviderWorkPreview /> : <SignupJourney />}
            </div>
          </motion.div>

          <motion.div initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} transition={{duration: 0.34, delay: 0.08}} className="rounded-[30px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-lift)] sm:p-6">
            <div className="mb-5">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{signIn ? "Secure login" : "Provider registration"}</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-[var(--primary)]">{signIn ? "Sign in to your dashboard" : "Create your provider account"}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{signIn ? "Use the email and password linked to your Bharosa Hai account." : "Email verification is handled securely before profile onboarding."}</p>
            </div>
            <div className="provider-clerk-card">{children}</div>
            <div className="mt-5 rounded-2xl bg-[var(--background)] p-4 text-sm font-semibold text-[var(--secondary-text)]">
              {signIn ? (
                <p>Do not have an account? <Link href="/provider/sign-up" className="font-bold text-[var(--primary)]">Register Now</Link></p>
              ) : (
                <p>Already registered? <Link href="/provider/sign-in" className="font-bold text-[var(--primary)]">Login to Dashboard</Link></p>
              )}
            </div>
          </motion.div>
        </div>
      </HeroBackgroundCarousel>
    </section>
  );
}

export const providerClerkAppearance = {
  variables: {
    colorPrimary: "#005BAC",
    colorBackground: "#FFFFFF",
    colorText: "#1F2937",
    colorTextSecondary: "#6B7280",
    borderRadius: "18px",
    fontFamily: "Inter, sans-serif"
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full border-0 shadow-none p-0",
    headerTitle: "font-heading text-[#005BAC]",
    formButtonPrimary: "rounded-2xl bg-[#005BAC] hover:bg-[#004A8A]",
    formFieldInput: "rounded-2xl border-[#E5E7EB] focus:border-[#005BAC]",
    footerActionLink: "text-[#005BAC]"
  }
} as const;

function TrustCard({label, icon: Icon}: {label: string; icon: LucideIcon}) {
  return <motion.div whileHover={{y: -2}} className="rounded-2xl border border-[var(--border)] bg-white px-3 py-3 text-xs font-bold text-[var(--primary)] shadow-[var(--shadow-soft)]"><Icon className="mb-2" size={17} aria-hidden />{label}</motion.div>;
}

function ProviderWorkPreview() {
  return (
    <div>
      <h3 className="font-heading text-xl font-bold text-[var(--primary)]">Continue managing your business</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {signInBenefits.map(({title, icon: Icon}) => <div key={title} className="flex items-center gap-3 rounded-2xl bg-[var(--background)] p-3 text-sm font-bold text-[var(--foreground)]"><Icon className="text-[var(--primary)]" size={18} aria-hidden />{title}</div>)}
      </div>
    </div>
  );
}

function SignupJourney() {
  return (
    <div>
      <h3 className="font-heading text-xl font-bold text-[var(--primary)]">Guided onboarding after signup</h3>
      <div className="mt-4 grid gap-3">
        {signUpJourney.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-[var(--background)] p-3 text-sm font-bold text-[var(--foreground)]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-white">{index + 1}</span>{item}</div>)}
      </div>
    </div>
  );
}
