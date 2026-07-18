"use client";

import type {DocumentStatus, ProviderStatus, VerificationLevel, VerificationStatus} from "@prisma/client";
import {BarChart3, BadgeCheck, Bell, CalendarClock, CheckCircle2, Clock3, CreditCard, Download, Eye, FileText, Globe2, Lock, MessageSquare, Phone, ShieldCheck, Sparkles, Star, TrendingUp, UserRound, Users} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {Card, SectionHeader} from "@/components/premium-ui";
import {ProviderLayout} from "@/components/provider-layout";
import {Link} from "@/i18n/navigation";

type ProviderRecord = {
  id?: string;
  status: ProviderStatus;
  verificationLevel?: VerificationLevel;
  name: string;
  email?: string;
  mobile?: string | null;
  profilePhotoUrl?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  address?: string | null;
  officeName?: string | null;
  officeAddress?: string | null;
  officeTiming?: string | null;
  specialization?: string | null;
  services?: string[];
  highestQualification?: string | null;
  professionalQualification?: string | null;
  experienceYears?: number | null;
  languages?: string[];
  availability?: string[];
  workingDays?: string[];
  serviceAreas?: string[];
  feeType?: string | null;
  minimumFee?: number | null;
  maximumFee?: number | null;
  bio?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankIfsc?: string | null;
  upiId?: string | null;
  websiteUrl?: string | null;
  googleBusinessUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  verifiedAt?: Date | null;
  createdAt?: Date;
};

type ProviderDocumentRecord = {
  id: string;
  documentType: string;
  originalFileName: string | null;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  storagePath: string;
  status: DocumentStatus;
  uploadedAt: Date;
  reviewedAt: Date | null;
};

type VerificationRecord = {
  id: string;
  status: VerificationStatus;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProviderFeaturePageProps = {
  status: ProviderStatus;
  providerName: string;
  featureKey: string;
  href: string;
  provider?: ProviderRecord;
  documents?: ProviderDocumentRecord[];
  verificationRequests?: VerificationRecord[];
};

const pipeline = ["New", "Contacted", "In Progress", "Completed"];
const profileSections = [
  "Personal Information",
  "Professional Information",
  "Qualifications",
  "Experience",
  "Service Categories",
  "Specializations",
  "Languages",
  "Working Hours",
  "Office Information",
  "Consultation Modes",
  "Fee Range",
  "Bank Details",
  "Social Links",
  "Portfolio Images",
  "Certificates",
  "Business Photos"
];

function formatBytes(size: number | null) {
  if (!size) return "Not recorded";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function text(value: unknown, fallback = "Not added yet") {
  if (Array.isArray(value)) return value.length ? value.join(", ") : fallback;
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function ProviderFeaturePage({status, providerName, featureKey, provider, documents = [], verificationRequests = []}: ProviderFeaturePageProps) {
  const t = useTranslations("provider.workspace");
  const locale = useLocale();
  const approved = status === "APPROVED";
  const dateFormatter = new Intl.DateTimeFormat(locale, {dateStyle: "medium"});

  if (!approved && !["verification", "settings"].includes(featureKey)) {
    return (
      <ProviderLayout status={status} providerName={providerName} breadcrumb={t(`nav.${featureKey}`)} notification={t("feature.locked")}>
        <div className="mx-auto max-w-5xl">
          <Card className="overflow-hidden p-0">
            <div className="bg-[#f7f4ee] p-8">
              <Lock className="text-[#2f5d50]" size={34} aria-hidden />
              <SectionHeader eyebrow={t("feature.lockedEyebrow")} title={t("feature.lockedTitle")} copy={t("feature.lockedCopy")} />
              <Link href="/provider/verification" className="mt-8 inline-flex rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#264c42]">{t("feature.cta")}</Link>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {(t.raw("feature.lockedItems") as string[]).map((item) => <div key={item} className="rounded-2xl border border-[#e5e7eb] bg-white p-4 text-sm font-semibold text-[#6b7280]">{item}</div>)}
            </div>
          </Card>
        </div>
      </ProviderLayout>
    );
  }

  return (
    <ProviderLayout status={status} providerName={providerName} breadcrumb={t(`nav.${featureKey}`)} notification={approved ? t("feature.available") : t("feature.locked")}>
      <div className="grid gap-8">
        {featureKey === "leads" && <LeadsWorkspace />}
        {featureKey === "reviews" && <ReviewsWorkspace />}
        {featureKey === "analytics" && <AnalyticsWorkspace provider={provider} />}
        {featureKey === "subscription" && <SubscriptionWorkspace />}
        {featureKey === "messages" && <MessagesWorkspace />}
        {featureKey === "profile" && <ProfileWorkspace provider={provider} documents={documents} />}
        {featureKey === "documents" && <DocumentsWorkspace documents={documents} dateFormatter={dateFormatter} />}
        {featureKey === "verification" && <VerificationWorkspace provider={provider} documents={documents} verificationRequests={verificationRequests} dateFormatter={dateFormatter} />}
        {featureKey === "settings" && <SettingsWorkspace />}
      </div>
    </ProviderLayout>
  );
}

function LeadsWorkspace() {
  return (
    <>
      <Hero icon={Users} eyebrow="Lead workspace" title="Get ready for customer enquiries." copy="Customer-side lead intake is not live yet. This workspace shows how new enquiries will be organized once public launch begins." />
      <Stats cards={[["New Leads", "0"], ["Contacted", "0"], ["In Progress", "0"], ["Completed", "0"]]} />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card><SectionHeader eyebrow="Recent enquiries" title="No customer enquiries yet" copy="When customers start sending requests, each enquiry will appear with service, city, contact status and next action." /><Table headers={["Customer", "Service", "City", "Status"]} rows={[["Launch queue", "No enquiry yet", "Your service area", "Waiting"]]} /></Card>
        <Card><SectionHeader eyebrow="Pipeline" title="Lead stages" copy="Move each enquiry through a simple service pipeline." /><div className="mt-6 grid gap-3">{pipeline.map((stage) => <div key={stage} className="rounded-2xl border border-[#e5e7eb] bg-[#f7f4ee] p-4 text-sm font-bold text-[#374151]">{stage}</div>)}</div></Card>
      </div>
      <Card><SectionHeader eyebrow="Response tips" title="Build trust from the first reply" copy="Keep your profile complete, reply within business hours, ask for documents clearly, and avoid quoting final fees before understanding the work." /></Card>
    </>
  );
}

function ReviewsWorkspace() {
  return (
    <>
      <Hero icon={Star} eyebrow="Reviews" title="Protect your professional reputation." copy="Reviews will appear after customer launch. Use this page to understand what will affect your public trust score." />
      <Stats cards={[["Overall Rating", "0.0"], ["Total Reviews", "0"], ["Response Rate", "0%"], ["Trust Signals", "Profile ready"]]} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><SectionHeader eyebrow="Recent reviews" title="No reviews yet" copy="Verified customer reviews will appear here after completed service interactions." /></Card>
        <Card><SectionHeader eyebrow="Response section" title="Reply with clarity and respect" copy="Thank customers, acknowledge issues, and explain the next step without sharing private details." /></Card>
      </div>
      <Card><SectionHeader eyebrow="Guidelines" title="High ratings come from predictable service" copy="Keep timelines clear, explain required documents, avoid surprise fees, and update the customer before they need to chase you." /></Card>
    </>
  );
}

function AnalyticsWorkspace({provider}: {provider?: ProviderRecord}) {
  const completion = [provider?.city, provider?.officeAddress, provider?.services?.length, provider?.languages?.length, provider?.bio].filter(Boolean).length * 20;
  return (
    <>
      <Hero icon={BarChart3} eyebrow="Analytics" title="Understand how your profile will perform." copy="Analytics will become active when public search and customer enquiries launch. The layout is ready for daily business tracking." />
      <Stats cards={[["Profile Views", "0"], ["Search Appearances", "0"], ["Profile Completion", `${completion}%`], ["Lead Conversion", "0%"], ["Customer Reach", "0 cities"], ["Weekly Activity", "No activity yet"]]} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Chart title="Weekly Activity" />
        <Chart title="Monthly Growth" />
      </div>
      <Card><SectionHeader eyebrow="Business insight" title="Complete profiles will rank better at launch" copy="Add services, office details, working hours, languages and documents before public discovery opens." /></Card>
    </>
  );
}

function SubscriptionWorkspace() {
  return (
    <>
      <Hero icon={CreditCard} eyebrow="Subscription" title="Launch plan is active." copy="Paid plans are disabled during the initial verified-provider rollout. Your current access is focused on onboarding and verification." />
      <Stats cards={[["Current Plan", "Launch Access"], ["Billing", "Disabled"], ["Upgrade", "Not available"], ["Included", "Verification workspace"]]} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><SectionHeader eyebrow="Plan benefits" title="Included during launch" copy="Provider profile, verification dashboard, document management, reputation readiness and future customer workspace access." /></Card>
        <Card><SectionHeader eyebrow="Upcoming features" title="Upgrade options will arrive later" copy="Premium visibility, advanced analytics, priority support and business tools will be evaluated after the MVP is stable." /><button disabled className="mt-6 rounded-full bg-[#9ca3af] px-5 py-3 text-sm font-bold text-white">Upgrade unavailable</button></Card>
      </div>
      <Table headers={["Feature", "Launch", "Premium later"]} rows={[["Verified profile", "Included", "Included"], ["Lead tools", "Prepared", "Advanced"], ["Analytics", "Basic", "Advanced"], ["Priority support", "Standard", "Planned"]]} />
    </>
  );
}

function MessagesWorkspace() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
      <Card><SectionHeader eyebrow="Inbox" title="Customer conversations" copy="Messages will appear after customer launch." /><div className="mt-6 grid gap-3">{["Launch updates", "Support", "Customer enquiries"].map((item) => <div key={item} className="rounded-2xl border border-[#e5e7eb] bg-[#f7f4ee] p-4 font-bold text-[#374151]">{item}</div>)}</div></Card>
      <Card><MessageSquare className="text-[#2f5d50]" size={32} aria-hidden /><SectionHeader eyebrow="Conversation preview" title="No active conversation selected" copy="When customers message you, the full thread, documents discussed and next action will be visible here." /></Card>
    </div>
  );
}

function ProfileWorkspace({provider, documents}: {provider?: ProviderRecord; documents: ProviderDocumentRecord[]}) {
  const values: Record<string, string> = {
    "Personal Information": `${text(provider?.name)} • ${text(provider?.mobile)}`,
    "Professional Information": text(provider?.services),
    Qualifications: `${text(provider?.highestQualification)} • ${text(provider?.professionalQualification)}`,
    Experience: provider?.experienceYears === null || provider?.experienceYears === undefined ? "Not added yet" : `${provider.experienceYears} years`,
    "Service Categories": text(provider?.services),
    Specializations: text(provider?.specialization),
    Languages: text(provider?.languages),
    "Working Hours": `${text(provider?.workingDays)} • ${text(provider?.officeTiming)}`,
    "Office Information": `${text(provider?.officeName)} • ${text(provider?.officeAddress)}`,
    "Consultation Modes": text(provider?.availability),
    "Fee Range": provider?.feeType ? `${provider.feeType} ${provider.minimumFee ?? ""}${provider.maximumFee ? ` - ${provider.maximumFee}` : ""}` : "Not added yet",
    "Bank Details": `${text(provider?.bankName)} • ${text(provider?.upiId)}`,
    "Social Links": [provider?.websiteUrl, provider?.googleBusinessUrl, provider?.linkedinUrl].filter(Boolean).join(", ") || "Not added yet",
    "Portfolio Images": "Not added yet",
    Certificates: `${documents.filter((item) => item.documentType.toLowerCase().includes("certificate")).length} uploaded`,
    "Business Photos": `${documents.filter((item) => item.documentType.toLowerCase().includes("office")).length} uploaded`
  };
  return (
    <>
      <Hero icon={UserRound} eyebrow="Professional profile" title="Complete business profile" copy="This page brings together the details customers and admins will rely on before trusting a provider." />
      <div className="grid gap-5 md:grid-cols-2">{profileSections.map((section) => <Card key={section}><h3 className="font-heading text-xl font-bold text-[#111827]">{section}</h3><p className="mt-3 text-sm leading-7 text-[#6b7280]">{values[section]}</p></Card>)}</div>
    </>
  );
}

function DocumentsWorkspace({documents, dateFormatter}: {documents: ProviderDocumentRecord[]; dateFormatter: Intl.DateTimeFormat}) {
  return (
    <>
      <Hero icon={FileText} eyebrow="Documents" title="Verification document center" copy="Track uploaded files, verification status, upload history and replacement actions from one secure page." />
      {documents.length === 0 ? <Card><SectionHeader eyebrow="No documents uploaded" title="Upload verification documents to start review" copy="Identity, PAN, professional certificate, qualification and office proof documents will appear here after submission." /></Card> : <div className="grid gap-5">{documents.map((document) => <Card key={document.id}><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-heading text-xl font-bold text-[#111827]">{document.documentType}</p><p className="mt-2 break-all text-sm font-semibold text-[#6b7280]">{document.originalFileName ?? document.fileName}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{formatBytes(document.fileSize)} • {document.mimeType ?? "Unknown type"} • Uploaded {dateFormatter.format(document.uploadedAt)}</p><p className="mt-2 text-sm font-bold text-[#2f5d50]">Status: {document.status}</p></div><div className="flex flex-wrap gap-2">{!document.storagePath.startsWith("pending://") && <a href={`/api/provider/documents/${document.id}/preview`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#f7f4ee] px-4 py-2 text-xs font-bold text-[#2f5d50]"><Eye size={14} />Preview</a>}{!document.storagePath.startsWith("pending://") && <a href={`/api/provider/documents/${document.id}/download`} className="inline-flex items-center gap-2 rounded-full bg-[#f7f4ee] px-4 py-2 text-xs font-bold text-[#2f5d50]"><Download size={14} />Download</a>}<Link href="/provider/register" className="rounded-full bg-[#2f5d50] px-4 py-2 text-xs font-bold text-white">Replace</Link></div></div></Card>)}</div>}
    </>
  );
}

function VerificationWorkspace({provider, documents, verificationRequests, dateFormatter}: {provider?: ProviderRecord; documents: ProviderDocumentRecord[]; verificationRequests: VerificationRecord[]; dateFormatter: Intl.DateTimeFormat}) {
  const approvedDocs = documents.filter((document) => document.status === "APPROVED").length;
  const pendingDocs = documents.filter((document) => document.status !== "APPROVED");
  return (
    <>
      <Hero icon={ShieldCheck} eyebrow="Verification" title="Trust badge and review lifecycle" copy="See your current verification level, checklist progress, admin remarks and review history." />
      <Stats cards={[["Current Badge", provider?.verificationLevel ?? "NOT_VERIFIED"], ["Approved Docs", String(approvedDocs)], ["Pending Checks", String(pendingDocs.length)], ["Approval Date", provider?.verifiedAt ? dateFormatter.format(provider.verifiedAt) : "Pending"]]} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><SectionHeader eyebrow="Completed checklist" title="Verified items" copy="Items below are complete when the related document or profile detail is approved." /><ChecklistLike items={["Account created", "Email verified", documents.length ? "Documents uploaded" : "Documents pending", provider?.verifiedAt ? "Admin approved" : "Admin approval pending"]} doneCount={provider?.verifiedAt ? 4 : documents.length ? 3 : 2} /></Card>
        <Card><SectionHeader eyebrow="Pending checklist" title="Next actions" copy={pendingDocs.length ? "Some documents still need review or replacement." : "No document replacement request is currently visible."} /><div className="mt-5 grid gap-3">{pendingDocs.map((item) => <div key={item.id} className="rounded-2xl border border-[#e5e7eb] bg-[#f7f4ee] p-4 text-sm font-bold text-[#374151]">{item.documentType}: {item.status}</div>)}</div></Card>
      </div>
      <Card><SectionHeader eyebrow="Verification history" title="Admin review timeline" copy="Every admin decision and provider submission will appear here." />{verificationRequests.length === 0 ? <p className="mt-5 rounded-2xl bg-[#f7f4ee] p-4 text-sm font-semibold text-[#6b7280]">No admin review history yet.</p> : <div className="mt-5 grid gap-3">{verificationRequests.map((item) => <div key={item.id} className="rounded-2xl border border-[#e5e7eb] bg-[#f7f4ee] p-4"><p className="font-bold text-[#111827]">{item.status}</p><p className="mt-1 text-sm text-[#6b7280]">{item.message ?? "No admin remarks"}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#2f5d50]">{dateFormatter.format(item.createdAt)}</p></div>)}</div>}</Card>
    </>
  );
}

function SettingsWorkspace() {
  const sections = ["Account", "Password", "Notifications", "Language", "Privacy", "Security", "Delete Account Request", "Logout"];
  return <><Hero icon={Bell} eyebrow="Settings" title="Account controls" copy="Manage security, preferences and account requests from one place." /><div className="grid gap-5 md:grid-cols-2">{sections.map((section) => <Card key={section}><h3 className="font-heading text-xl font-bold text-[#111827]">{section}</h3><p className="mt-3 text-sm leading-7 text-[#6b7280]">Controls for {section.toLowerCase()} will be connected as this workspace matures.</p></Card>)}</div></>;
}

function Hero({icon: Icon, eyebrow, title, copy}: {icon: typeof Sparkles; eyebrow: string; title: string; copy: string}) {
  return <Card className="bg-white"><Icon className="text-[#2f5d50]" size={34} aria-hidden /><SectionHeader eyebrow={eyebrow} title={title} copy={copy} /></Card>;
}

function Stats({cards}: {cards: Array<[string, string]>}) {
  const icons = [Clock3, TrendingUp, BadgeCheck, Globe2, Phone, CalendarClock];
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value], index) => { const Icon = icons[index] ?? Sparkles; return <Card key={label}><Icon className="text-[#2f5d50]" size={24} aria-hidden /><p className="mt-4 text-sm font-semibold text-[#6b7280]">{label}</p><h3 className="mt-2 font-heading text-2xl font-bold text-[#111827]">{value}</h3></Card>; })}</div>;
}

function Table({headers, rows}: {headers: string[]; rows: string[][]}) {
  return <div className="mt-6 overflow-hidden rounded-2xl border border-[#e5e7eb]"><table className="w-full text-left text-sm"><thead className="bg-[#f7f4ee] text-xs uppercase tracking-[0.14em] text-[#6b7280]"><tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.join("-")} className="border-t border-[#e5e7eb] bg-white">{row.map((cell) => <td key={cell} className="px-4 py-4 font-semibold text-[#374151]">{cell}</td>)}</tr>)}</tbody></table></div>;
}

function Chart({title}: {title: string}) {
  return <Card><SectionHeader eyebrow="Chart" title={title} copy="Activity will populate here after customer discovery launches." /><div className="mt-6 flex h-48 items-end gap-3 rounded-2xl bg-[#f7f4ee] p-5">{[30, 48, 35, 62, 50, 72, 58].map((height, index) => <div key={`${height}-${index}`} className="flex-1 rounded-t-xl bg-[#2f5d50]/70" style={{height: `${height}%`}} />)}</div></Card>;
}

function ChecklistLike({items, doneCount}: {items: string[]; doneCount: number}) {
  return <div className="mt-5 grid gap-3">{items.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f7f4ee] p-4 text-sm font-bold text-[#374151]">{index < doneCount ? <CheckCircle2 className="text-[#2f5d50]" size={18} /> : <Clock3 className="text-[#c6922e]" size={18} />}{item}</div>)}</div>;
}
