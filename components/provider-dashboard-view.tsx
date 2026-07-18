"use client";

import type {DocumentStatus, ProviderStatus, VerificationStatus} from "@prisma/client";
import {BadgeCheck, BarChart3, Clock3, FileCheck2, LayoutDashboard, Lock, MessageSquare, PencilLine, Star, Users} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {MotionSection} from "@/components/motion-section";
import {Card, Checklist, SectionHeader, Timeline, container, pageY} from "@/components/premium-ui";
import {ProviderLayout} from "@/components/provider-layout";
import {ProviderProfileForm} from "@/components/provider-profile-form";
import {Link} from "@/i18n/navigation";

type ProviderDashboardViewProps = {
  status: ProviderStatus;
  documentCount: number;
  hasSubmittedApplication: boolean;
  provider: {
    name: string;
    email: string;
    mobile: string;
    city: string;
    address: string;
    specialization: string;
    experienceYears: number;
    languages: string[];
    officeAddress: string;
    bio: string;
    createdAt: Date;
    declarationAcceptedAt: Date | null;
    verifiedAt: Date | null;
    emailVerifiedAt: Date | null;
    phoneVerifiedAt: Date | null;
  };
  documents: Array<{
    id: string;
    documentType: string;
    originalFileName: string | null;
    fileName: string;
    status: DocumentStatus;
    uploadedAt: Date;
    reviewedAt: Date | null;
    storagePath: string;
  }>;
  verificationRequests: Array<{
    id: string;
    status: VerificationStatus;
    message: string | null;
    createdAt: Date;
  }>;
};

const statIcons = [Clock3, LayoutDashboard, FileCheck2, BadgeCheck];
const moduleIcons = [Users, Star, BarChart3, BadgeCheck, MessageSquare, PencilLine, FileCheck2];
const contentByStatus: Record<ProviderStatus, string> = {
  DRAFT: "draft",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  NEEDS_MORE_DOCUMENTS: "needsMoreDocuments"
};

function systemMessageKey(message: string | null) {
  if (message === "provider.application.submitted.") return "applicationSubmitted";
  if (message === "provider.approved") return "applicationApproved";
  if (message === "provider.rejected") return "applicationRejected";
  if (message === "provider.more_documents_requested") return "moreDocumentsRequested";

  return null;
}

export function ProviderDashboardView({status, documentCount, hasSubmittedApplication, provider, documents, verificationRequests}: ProviderDashboardViewProps) {
  const t = useTranslations("provider.dashboard");
  const locale = useLocale();
  const statusKey = contentByStatus[status];
  const approved = status === "APPROVED";
  const dateFormatter = new Intl.DateTimeFormat(locale, {dateStyle: "medium"});
  const latestAdminRequest = verificationRequests.find((request) => request.status === "NEEDS_MORE_DOCUMENTS" || request.status === "REJECTED");
  const latestAdminMessageKey = systemMessageKey(latestAdminRequest?.message ?? null);
  const latestAdminNote = latestAdminMessageKey ? t(`systemMessages.${latestAdminMessageKey}`) : latestAdminRequest?.message ?? t("adminNotes.empty");
  const missingDocuments = documents.filter((document) => document.status === "REJECTED" || document.storagePath.startsWith("pending://"));
  const statusContent = t.raw(`states.${statusKey}`) as {
    eyebrow: string;
    title: string;
    copy: string;
    items: string[];
    cta?: string;
  };
  const stats = [
    {label: t("stats.verification"), value: t(`statusValue.${status}`)},
    {label: t("stats.profile"), value: hasSubmittedApplication ? t("profileValue.submitted") : t("profileValue.incomplete")},
    {label: t("stats.documents"), value: t("documentValue", {count: documentCount})},
    {label: t("stats.access"), value: approved ? t("accessValue.full") : t("accessValue.limited")}
  ];
  const timeline = [
    {title: t("timeline.accountCreated"), copy: dateFormatter.format(provider.createdAt)},
    {title: t("timeline.emailVerified"), copy: provider.emailVerifiedAt ? dateFormatter.format(provider.emailVerifiedAt) : t("timeline.pending")},
    {title: t("timeline.phoneAdded"), copy: provider.phoneVerifiedAt ? dateFormatter.format(provider.phoneVerifiedAt) : t("timeline.pending")},
    {title: t("timeline.documentsUploaded"), copy: documents[0] ? dateFormatter.format(documents[0].uploadedAt) : t("timeline.pending")},
    {title: t("timeline.submitted"), copy: provider.declarationAcceptedAt ? dateFormatter.format(provider.declarationAcceptedAt) : t("timeline.pending")},
    {title: t("timeline.underReview"), copy: hasSubmittedApplication ? t("timeline.active") : t("timeline.pending")},
    {title: t("timeline.moreDocuments"), copy: verificationRequests.find((request) => request.status === "NEEDS_MORE_DOCUMENTS") ? dateFormatter.format(verificationRequests.find((request) => request.status === "NEEDS_MORE_DOCUMENTS")!.createdAt) : t("timeline.notRequested")},
    {title: t("timeline.approved"), copy: provider.verifiedAt ? dateFormatter.format(provider.verifiedAt) : t("timeline.pending")}
  ];
  const notifications = verificationRequests.slice(0, 4).map((request) => {
    const key = systemMessageKey(request.message);

    return {
      title: key ? t(`notifications.${key}.title`) : t(`notifications.generic.title`),
      copy: key ? t(`notifications.${key}.copy`) : request.message ?? t("notifications.generic.copy"),
      date: dateFormatter.format(request.createdAt)
    };
  });

  return (
    <ProviderLayout status={status} providerName={provider.name} breadcrumb={t("breadcrumb")} notification={notifications[0]?.title ?? t("notifications.empty")}>
      <section>
        <div className="mb-8 rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.06)]">
          <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#2f5d50]">{t("hero.eyebrow")}</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-[#111827]">{t("hero.title", {name: provider.name})}</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#6b7280]">{t("hero.copy")}</p>
        </div>

        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = statIcons[index];

              return <Card key={item.label}><Icon className="text-[#2f5d50]" size={26} aria-hidden /><p className="mt-5 text-sm font-semibold text-[#6b7280]">{item.label}</p><h2 className="mt-2 font-heading text-2xl font-bold text-[#111827]">{item.value}</h2></Card>;
            })}
          </div>
        </MotionSection>

        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <SectionHeader eyebrow={statusContent.eyebrow} title={statusContent.title} copy={statusContent.copy} />
              <div className="mt-8"><Checklist items={statusContent.items} /></div>
              {statusContent.cta && <Link href="/provider/register" className="mt-8 inline-flex rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#264c42]">{statusContent.cta}</Link>}
            </Card>
            <div className="grid gap-5">
              <Card><BadgeCheck className={approved ? "text-[#2f5d50]" : "text-[#c6922e]"} size={28} aria-hidden /><h2 className="mt-5 font-heading text-2xl font-bold text-[#111827]">{t(`statusCards.${statusKey}.title`)}</h2><p className="mt-3 text-base leading-7 text-[#6b7280]">{t(`statusCards.${statusKey}.copy`)}</p></Card>
              {(status === "NEEDS_MORE_DOCUMENTS" || status === "REJECTED") && <Card><FileCheck2 className="text-[#991b1b]" size={28} aria-hidden /><h2 className="mt-5 font-heading text-2xl font-bold text-[#111827]">{t("adminNotes.title")}</h2><p className="mt-3 text-base leading-7 text-[#6b7280]">{latestAdminNote}</p>{missingDocuments.length > 0 && <p className="mt-4 text-sm font-bold text-[#991b1b]">{t("adminNotes.missing", {count: missingDocuments.length})}</p>}</Card>}
            </div>
          </div>
        </MotionSection>

        <MotionSection className={`${container} ${pageY}`}>
          <SectionHeader eyebrow={t("modules.eyebrow")} title={approved ? t("modules.unlockedTitle") : t("modules.lockedTitle")} copy={approved ? t("modules.unlockedCopy") : t("modules.lockedCopy")} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(t.raw("modules.items") as string[]).map((item, index) => {
              const Icon = moduleIcons[index] ?? Lock;

              return <Card key={item}><Icon className={approved ? "text-[#2f5d50]" : "text-[#6b7280]"} size={26} aria-hidden /><h3 className="mt-5 font-heading text-xl font-bold text-[#111827]">{item}</h3><p className="mt-2 text-sm font-semibold text-[#6b7280]">{approved ? t("modules.available") : t("modules.locked")}</p></Card>;
            })}
          </div>
        </MotionSection>

        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <Card>
              <SectionHeader eyebrow={t("documents.eyebrow")} title={t("documents.title")} copy={t("documents.copy")} />
              <div className="mt-8 grid gap-4">
                {documents.length === 0 && <p className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4 text-sm font-semibold text-[#6b7280]">{t("documents.empty")}</p>}
                {documents.map((document) => (
                  <div key={document.id} className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4">
                    <div className="grid gap-2">
                      <p className="font-heading text-base font-bold text-[#111827]">{document.documentType}</p>
                      <p className="break-all text-sm font-semibold text-[#6b7280]">{document.originalFileName ?? document.fileName}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("documents.uploaded", {date: dateFormatter.format(document.uploadedAt)})}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2f5d50]">{t(`documentStatus.${document.status}`)}</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      {!document.storagePath.startsWith("pending://") && <a href={`/api/provider/documents/${document.id}/preview`} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-center text-xs font-bold text-[#2f5d50] transition hover:text-[#c6922e]">{t("documents.preview")}</a>}
                      {!document.storagePath.startsWith("pending://") && <a href={`/api/provider/documents/${document.id}/download`} className="rounded-full bg-white px-4 py-2 text-center text-xs font-bold text-[#2f5d50] transition hover:text-[#c6922e]">{t("documents.download")}</a>}
                      {(status === "DRAFT" || status === "NEEDS_MORE_DOCUMENTS" || status === "REJECTED") && <Link href="/provider/register" className="rounded-full bg-white px-4 py-2 text-center text-xs font-bold text-[#2f5d50] transition hover:text-[#c6922e]">{t("documents.replace")}</Link>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionHeader eyebrow={t("notifications.eyebrow")} title={t("notifications.title")} copy={t("notifications.copy")} />
              <div className="mt-8 grid gap-4">
                {notifications.length === 0 && <p className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4 text-sm font-semibold text-[#6b7280]">{t("notifications.empty")}</p>}
                {notifications.map((item) => <div key={`${item.title}-${item.date}`} className="rounded-2xl border border-[#eae4da] bg-[#f7f4ee] p-4"><p className="font-heading text-base font-bold text-[#111827]">{item.title}</p><p className="mt-2 text-sm leading-6 text-[#6b7280]">{item.copy}</p><p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#2f5d50]">{item.date}</p></div>)}
              </div>
            </Card>
          </div>
        </MotionSection>

        <MotionSection className={`${container} ${pageY}`}>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <Card>
              <SectionHeader eyebrow={t("timeline.eyebrow")} title={t("timeline.title")} />
              <div className="mt-8"><Timeline items={timeline} /></div>
            </Card>
            <Card>
              <SectionHeader eyebrow={t("profile.eyebrow")} title={t("profile.title")} copy={t("profile.copy")} />
              <ProviderProfileForm profile={provider} />
            </Card>
          </div>
        </MotionSection>
      </section>
    </ProviderLayout>
  );
}
