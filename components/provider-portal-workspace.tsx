"use client";

import type {ProviderStatus} from "@prisma/client";
import {BarChart3, BadgeCheck, Bell, BriefcaseBusiness, CalendarCheck, CheckCircle2, Clock3, CreditCard, Download, Eye, FileText, LifeBuoy, Lock, Mail, MessageSquare, RefreshCw, Search, ShieldCheck, Star, TrendingUp, UserRound, Users} from "lucide-react";
import {useLocale} from "next-intl";

import {createProviderTask, createSupportTicket, deleteProviderTask, duplicateProviderTask, toggleServiceOffering, updateBookingStatus, updateLeadStatus, updateProviderTaskStatus} from "@/lib/actions/provider-portal-actions";
import type {ProviderPortalData} from "@/lib/services/provider-portal-service";
import {Link} from "@/i18n/navigation";
import {ProviderLayout} from "@/components/provider-layout";

type PortalData = ProviderPortalData;

const card = "rounded-[26px] border border-[#e4e8f0] bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.06)]";
const mutedCard = "rounded-[22px] border border-[#e4e8f0] bg-[#f8fafc] p-4";
const primaryButton = "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#005BAC] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#004A8A]";
const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-sm font-bold text-[#005BAC] transition hover:bg-[#EAF4FF]";

export function ProviderPortalDashboard({data}: {data: PortalData}) {
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale, {dateStyle: "medium"});
  const provider = data.provider;
  const approved = provider.status === "APPROVED";
  const underReview = provider.status === "PENDING";
  const leadCounts = data.leadStatusCounts;
  const kpis = [
    ["New Leads", String(leadCounts.NEW ?? 0), Users, "/provider/leads"],
    ["Pending Leads", String((leadCounts.NEW ?? 0) + (leadCounts.ACCEPTED ?? 0)), Clock3, "/provider/leads"],
    ["Accepted Leads", String(leadCounts.ACCEPTED ?? 0), CheckCircle2, "/provider/leads"],
    ["Completed Jobs", String(data.metrics.completedJobs), BadgeCheck, "/provider/bookings"],
    ["Unread Messages", String(data.metrics.unreadMessages), MessageSquare, "/provider/messages"],
    ["Monthly Earnings", rupees(data.metrics.thisMonthEarnings), TrendingUp, "/provider/analytics"],
    ["Profile Views", String(sum(data.analyticsSnapshots, "profileViews")), Eye, "/provider/analytics"],
    ["Average Rating", data.metrics.averageRating ? data.metrics.averageRating.toFixed(1) : "0.0", Star, "/provider/reviews"]
  ] as const;
  const tasks = buildTasks(data);
  const activity = buildActivity(data, date);

  return (
    <ProviderLayout status={provider.status} providerName={provider.name} breadcrumb="Dashboard" notification={data.notifications[0]?.title ?? "Provider workspace is ready."} unreadNotifications={data.metrics.unreadNotifications}>
      <div className="grid gap-6">
        {underReview && <UnderReviewStatusBanner data={data} />}
        <div className={underReview ? "relative" : ""}>
          {underReview && <UnderReviewOverlay data={data} />}
          <div className={underReview ? "pointer-events-none opacity-40 grayscale" : ""}>
        <section className={`${card} overflow-hidden bg-[#0e355f] text-white`}>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F4A300]">Welcome back</p>
              <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">{provider.name}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#dbe7f5]">Manage profile readiness, customer opportunities, documents, communication and business performance from one secure provider workspace.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge label={approved ? "Verified Provider" : statusLabel(provider.status)} tone={approved ? "success" : "warning"} />
                <Badge label={data.metrics.subscriptionLabel} />
                <Badge label={data.metrics.profileVisibility} />
                <Badge label={data.metrics.availabilityStatus} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniStat label="Response Rate" value={`${data.metrics.responseRate}%`} />
              <MiniStat label="Visibility Score" value={`${data.metrics.visibilityScore}/100`} />
              <MiniStat label="Profile Completion" value={`${data.metrics.profileCompletion}%`} />
              <MiniStat label="Active Services" value={String(data.metrics.activeServices)} />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(([label, value, Icon, href]) => <KpiCard key={label} label={label} value={value} icon={Icon} href={href} />)}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <TaskManagerPanel data={data} date={date} />
          <Panel eyebrow="Lead status" title="Pipeline health" copy="Customer enquiries will move through these stages as your business grows.">
            <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
              <Donut counts={[leadCounts.NEW ?? 0, leadCounts.ACCEPTED ?? 0, leadCounts.IN_PROGRESS ?? 0, leadCounts.COMPLETED ?? 0, leadCounts.CANCELLED ?? 0]} />
              <div className="grid gap-2">{["New", "Accepted", "In Progress", "Completed", "Cancelled"].map((label, index) => <PipelineLegend key={label} label={label} value={[leadCounts.NEW ?? 0, leadCounts.ACCEPTED ?? 0, leadCounts.IN_PROGRESS ?? 0, leadCounts.COMPLETED ?? 0, leadCounts.CANCELLED ?? 0][index]} href={`/provider/leads?status=${label.toUpperCase().replaceAll(" ", "_")}`} />)}</div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel eyebrow="Recent enquiries" title="Latest customer enquiries" copy="Respond quickly to improve response rate and visibility score.">
            <ListEmpty items={data.leads.slice(0, 5)} emptyTitle="No recent enquiries" emptyCopy="New customer enquiries will appear here after customer launch.">
              {(lead) => <RecentLeadRow lead={lead} />}
            </ListEmpty>
          </Panel>
          <Panel eyebrow="Business attention" title="What needs action today" copy="A combined view of tasks, unread messages, new enquiries and scheduled bookings.">
            <div className="grid gap-3">
              {tasks.slice(0, 5).map((task) => <ActionRow key={task.title} {...task} />)}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel eyebrow="Alerts" title="Notification center" copy="Unread updates are stored in the backend and surfaced here.">
            <ListEmpty items={data.notifications.slice(0, 5)} emptyTitle="No alerts yet" emptyCopy="Verification, messages, reviews and subscription updates will appear here.">
              {(item) => <div className={mutedCard}><p className="font-bold text-[#111827]">{item.title}</p><p className="mt-1 text-sm leading-6 text-[#6b7280]">{item.body}</p></div>}
            </ListEmpty>
          </Panel>
          <Panel eyebrow="Upcoming bookings" title="Accepted work" copy="Accepted leads become bookings and appear in this schedule.">
            <ResponsiveTable headers={["Customer", "Service", "Date", "Status"]} rows={data.bookings.slice(0, 5).map((booking) => [booking.customerName, booking.serviceTitle, booking.scheduledAt ? date.format(booking.scheduledAt) : "Not scheduled", booking.status])} empty="No bookings yet. Accept a lead to create one." />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Panel eyebrow="Recent activity" title="Workspace timeline" copy="Provider activity and platform updates will accumulate here.">
            <div className="grid gap-3">{activity.map((item) => <ActionRow key={`${item.title}-${item.copy}`} title={item.title} copy={item.copy} href={item.href} />)}</div>
          </Panel>
          <Panel eyebrow="Earnings" title="Revenue readiness" copy="Revenue and payout data will populate from completed jobs and future billing integrations.">
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat light label="Pending Payouts" value={rupees(0)} />
              <MiniStat light label="Completed Jobs" value={String(data.metrics.completedJobs)} />
              <MiniStat light label="Average Rating" value={data.metrics.averageRating ? data.metrics.averageRating.toFixed(1) : "0.0"} />
            </div>
            <Bars values={data.analyticsSnapshots.map((item) => item.revenueAmount)} />
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel eyebrow="Quick actions" title="Run your workspace faster" copy="Actions route to real pages or server actions.">
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickAction href="/provider/services-offered" label="Add Service" icon={BriefcaseBusiness} />
              <QuickAction href="/provider/documents" label="Upload Documents" icon={FileText} />
              <QuickAction href="/provider/profile" label="Share Profile" icon={UserRound} />
              <QuickAction href="/provider/settings" label="Manage Availability" icon={CalendarCheck} />
              <QuickAction href="/provider/subscription" label="Subscription" icon={CreditCard} />
              <QuickAction href="/provider/support" label="Support" icon={LifeBuoy} />
            </div>
          </Panel>
          <Panel eyebrow="Profile completion" title={`${data.metrics.profileCompletion}% complete`} copy="This permanent widget explains what improves your public trust profile.">
            <Progress value={data.metrics.profileCompletion} />
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {data.metrics.profileChecklist.map((item) => <ChecklistItem key={item.label} label={item.label} done={item.done} />)}
            </div>
            <div className="mt-6 rounded-2xl bg-[#EAF4FF] p-4 text-sm leading-6 text-[#005BAC]"><strong>Visibility score:</strong> {data.metrics.visibilityScore}/100. Response rate, reviews, verification, subscription and profile completion all improve discoverability.</div>
          </Panel>
        </section>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}

export function ProviderPortalFeaturePage({data, feature}: {data: PortalData; feature: string}) {
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale, {dateStyle: "medium"});
  const approved = data.provider.status === "APPROVED";
  const locked = !approved && !["documents", "support", "settings", "profile", "verification"].includes(feature);

  if (locked) {
    return (
      <ProviderLayout status={data.provider.status} providerName={data.provider.name} breadcrumb={featureTitle(feature)} notification="Complete verification to unlock this workspace." unreadNotifications={data.metrics.unreadNotifications}>
        <Panel eyebrow="Locked module" title={`${featureTitle(feature)} unlocks after verification`} copy="Your account is active, but business modules stay locked until admin approval is complete. Continue verification to open the full workspace.">
          <Link href="/provider/verification" className={primaryButton}>View verification status</Link>
        </Panel>
      </ProviderLayout>
    );
  }

  return (
    <ProviderLayout status={data.provider.status} providerName={data.provider.name} breadcrumb={featureTitle(feature)} notification={data.notifications[0]?.title ?? "Workspace ready"} unreadNotifications={data.metrics.unreadNotifications}>
      {feature === "profile" && <ProfilePage data={data} />}
      {feature === "services" && <ServicesPage data={data} />}
      {feature === "leads" && <LeadsPage data={data} />}
      {feature === "bookings" && <BookingsPage data={data} date={date} />}
      {feature === "messages" && <MessagesPage data={data} date={date} />}
      {feature === "documents" && <DocumentsPage data={data} date={date} />}
      {feature === "subscription" && <SubscriptionPage data={data} date={date} />}
      {feature === "analytics" && <AnalyticsPage data={data} />}
      {feature === "reviews" && <ReviewsPage data={data} date={date} />}
      {feature === "support" && <SupportPage data={data} date={date} />}
      {feature === "settings" && <SettingsPage />}
      {feature === "verification" && <VerificationPage data={data} date={date} />}
    </ProviderLayout>
  );
}

function UnderReviewStatusBanner({data}: {data: PortalData}) {
  return (
    <section className="rounded-[28px] border border-[#fde68a] bg-[#fffbeb] p-5 shadow-[0_14px_45px_rgba(245,158,11,0.12)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fef3c7] text-[#b45309]">
            <ShieldCheck size={24} aria-hidden />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-2xl font-bold text-[#92400e]">Your Verification is in Progress</h2>
              <Badge label="Under Review" tone="warning" />
            </div>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-[#78350f]">
              Thank you for submitting your application. Our verification team is currently reviewing your documents.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#92400e]">
              <span>Estimated Review Time: 24-48 Hours</span>
              <span>Application ID: {applicationReference(data.provider.id)}</span>
            </div>
          </div>
        </div>
        <Link href="/provider/verification" className={secondaryButton}>View Verification Status</Link>
      </div>
    </section>
  );
}

function UnderReviewOverlay({data}: {data: PortalData}) {
  return (
    <div className="absolute inset-x-0 top-16 z-20 mx-auto max-w-3xl px-2 sm:px-4">
      <div className="rounded-[32px] border border-[#e4e8f0] bg-white p-5 text-center shadow-[0_28px_90px_rgba(15,23,42,0.18)] sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#EAF4FF] text-[#005BAC]">
          <Lock size={26} aria-hidden />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#F4A300]">Verification In Progress</p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[#111827]">Thank you for completing your registration.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#64748b]">
          Your documents have been submitted successfully. Our verification specialists are reviewing your application. Once approved, your complete Provider Dashboard will unlock automatically.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]">Estimated Verification</p>
            <p className="mt-2 font-heading text-2xl font-bold text-[#005BAC]">24-48 Hours</p>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]">Current Status</p>
            <p className="mt-2 font-heading text-2xl font-bold text-[#005BAC]">UNDER REVIEW</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/provider/verification" className={primaryButton}>View Application Status</Link>
          <button type="button" onClick={() => window.location.reload()} className={secondaryButton}><RefreshCw size={16} aria-hidden />Refresh Status</button>
        </div>
        <div className="mt-6 rounded-[24px] border border-[#e4e8f0] bg-[#f8fafc] p-5 text-left">
          <div className="flex gap-3">
            <Mail className="mt-1 shrink-0 text-[#005BAC]" size={20} aria-hidden />
            <div>
              <h3 className="font-heading text-lg font-bold text-[#111827]">Need Assistance?</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">If you have questions regarding your verification, please contact our support team.</p>
              <a href="mailto:bharosahai.india@gmail.com" className="mt-2 inline-flex text-sm font-bold text-[#005BAC]">bharosahai.india@gmail.com</a>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]">Average response time: Within 24 hours</p>
            </div>
          </div>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]">Application ID: {applicationReference(data.provider.id)}</p>
      </div>
    </div>
  );
}

function ProfilePage({data}: {data: PortalData}) {
  const provider = data.provider;
  const rows = [
    ["Personal Information", `${provider.name} • ${provider.mobile ?? "Mobile not added"} • ${provider.email}`],
    ["Professional Information", provider.services.join(", ") || "No services added"],
    ["Qualifications", [provider.highestQualification, provider.professionalQualification].filter(Boolean).join(" • ") || "Not added"],
    ["Experience", provider.experienceYears ? `${provider.experienceYears} years` : "Not added"],
    ["Languages", provider.languages.join(", ") || "Not added"],
    ["Working Hours", [provider.workingDays.join(", "), provider.officeTiming].filter(Boolean).join(" • ") || "Not added"],
    ["Office Information", [provider.officeName, provider.officeAddress, provider.city].filter(Boolean).join(" • ") || "Not added"],
    ["Fee Range", provider.feeType ? `${provider.feeType} ${provider.minimumFee ?? ""}${provider.maximumFee ? ` - ${provider.maximumFee}` : ""}` : "Not added"],
    ["Gallery & Certificates", `${data.documents.length} uploaded documents and media records`]
  ];

  return <PageScaffold icon={UserRound} eyebrow="My Profile" title="Professional profile" copy="Keep your provider identity, business details and trust assets ready for customer discovery."><CardGrid rows={rows} /></PageScaffold>;
}

function TaskManagerPanel({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  return (
    <Panel eyebrow="Today's tasks" title="Task manager" copy="Add, complete, duplicate or remove provider tasks. Latest 10 active tasks appear here.">
      <form action={createProviderTask} className="grid gap-3 rounded-2xl bg-[#f8fafc] p-4">
        <input name="title" required maxLength={120} className="rounded-2xl border border-[#dbe3ef] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" placeholder="Add a task" />
        <textarea name="notes" maxLength={600} className="min-h-20 rounded-2xl border border-[#dbe3ef] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" placeholder="Notes" />
        <div className="grid gap-3 sm:grid-cols-3">
          <select name="priority" className="rounded-2xl border border-[#dbe3ef] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" defaultValue="MEDIUM" aria-label="Priority">
            {["LOW", "MEDIUM", "HIGH", "URGENT"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input name="dueDate" type="date" className="rounded-2xl border border-[#dbe3ef] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" aria-label="Due date" />
          <input name="dueTime" type="time" className="rounded-2xl border border-[#dbe3ef] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" aria-label="Due time" />
        </div>
        <button className={primaryButton}>Add Task</button>
      </form>

      <div className="mt-5 grid gap-3">
        {data.tasks.length === 0 ? (
          <EmptyState title="No tasks yet" copy="Add a task to plan follow-ups, profile improvements or customer work." />
        ) : (
          data.tasks.map((task) => <TaskCard key={task.id} task={task} date={date} />)
        )}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <MiniStat light label="Pending" value={String(data.metrics.pendingTasks)} />
        <MiniStat light label="Due Today" value={String(data.metrics.dueTodayTasks)} />
        <MiniStat light label="Completed" value={String(data.metrics.completedTasks)} />
      </div>
    </Panel>
  );
}

function TaskCard({task, date}: {task: PortalData["tasks"][number]; date: Intl.DateTimeFormat}) {
  const complete = task.status === "COMPLETED";

  return (
    <div className="rounded-2xl border border-[#e4e8f0] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-heading text-base font-bold text-[#111827]">{task.title}</h4>
            <Badge label={task.priority} tone={task.priority === "HIGH" || task.priority === "URGENT" ? "warning" : undefined} />
            {complete && <Badge label="Completed" tone="success" />}
          </div>
          {task.notes && <p className="mt-2 text-sm leading-6 text-[#64748b]">{task.notes}</p>}
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#64748b]">{task.dueAt ? `Due ${date.format(task.dueAt)}` : "No due date"}</p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <form action={updateProviderTaskStatus}>
            <input type="hidden" name="taskId" value={task.id} />
            <input type="hidden" name="status" value={complete ? "PENDING" : "COMPLETED"} />
            <button className={secondaryButton}>{complete ? "Reopen" : "Complete"}</button>
          </form>
          <form action={duplicateProviderTask}>
            <input type="hidden" name="taskId" value={task.id} />
            <button className={secondaryButton}>Duplicate</button>
          </form>
          <form action={deleteProviderTask}>
            <input type="hidden" name="taskId" value={task.id} />
            <button className="inline-flex items-center justify-center rounded-2xl border border-[#fecaca] bg-white px-4 py-2.5 text-sm font-bold text-[#DC2626] transition hover:bg-[#fff1f2]">Delete</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RecentLeadRow({lead}: {lead: PortalData["leads"][number]}) {
  return (
    <div className={mutedCard}>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading text-lg font-bold text-[#111827]">{lead.customerName}</p>
            <Badge label={lead.status} />
          </div>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#64748b]">{lead.serviceTitle} • {lead.location ?? "City not shared"} • {budget(lead.budgetMin, lead.budgetMax)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {lead.status === "NEW" && <LeadButton id={lead.id} status="ACCEPTED" label="Accept" />}
          {lead.status === "NEW" && <LeadButton id={lead.id} status="REJECTED" label="Reject" secondary />}
          <Link href="/provider/leads" className={secondaryButton}>View Details</Link>
          {lead.customerMobile && <a href={`tel:${lead.customerMobile}`} className={secondaryButton}>Call</a>}
          <Link href="/provider/messages" className={secondaryButton}>Message</Link>
        </div>
      </div>
    </div>
  );
}

function ServicesPage({data}: {data: PortalData}) {
  return (
    <PageScaffold icon={BriefcaseBusiness} eyebrow="Services Offered" title="Manage your active services" copy="Enable, disable and review service readiness. Add detailed services from registration data first, then refine pricing and coverage here.">
      {data.serviceOfferings.length === 0 ? <EmptyState title="No managed services yet" copy="Services submitted during verification will be available here after they are converted into service offerings." cta={{href: "/provider/register", label: "Update verification profile"}} /> : <div className="grid gap-5 lg:grid-cols-2">{data.serviceOfferings.map((service) => <div key={service.id} className={card}><div className="flex items-start justify-between gap-4"><div><h3 className="font-heading text-xl font-bold text-[#111827]">{service.title}</h3><p className="mt-2 text-sm leading-6 text-[#6b7280]">{service.description ?? "No description added."}</p></div><Badge label={service.status} tone={service.status === "ENABLED" ? "success" : "warning"} /></div><div className="mt-5 grid gap-2 text-sm font-semibold text-[#475569]"><p>Pricing: {service.pricingType ?? "Not set"} {service.minimumPrice ? `₹${service.minimumPrice}` : ""}</p><p>Cities: {service.cities.join(", ") || "Not set"}</p><p>Experience: {service.experienceYears ?? "Not set"} years</p></div><form action={toggleServiceOffering} className="mt-5"><input type="hidden" name="offeringId" value={service.id} /><input type="hidden" name="status" value={service.status === "ENABLED" ? "DISABLED" : "ENABLED"} /><button className={secondaryButton}>{service.status === "ENABLED" ? "Disable" : "Enable"} service</button></form></div>)}</div>}
    </PageScaffold>
  );
}

function LeadsPage({data}: {data: PortalData}) {
  return (
    <PageScaffold icon={Users} eyebrow="Leads" title="Customer enquiry pipeline" copy="Search, filter and move each enquiry through clear backend-backed status transitions.">
      <SearchBar placeholder="Search by customer, city or service" />
      {data.leads.length === 0 ? <EmptyState title="No leads yet" copy="Complete your profile and services to improve visibility before customer launch." cta={{href: "/provider/profile", label: "Improve profile"}} /> : <div className="grid gap-4">{data.leads.map((lead) => <div key={lead.id} className={card}><div className="grid gap-4 lg:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-heading text-xl font-bold text-[#111827]">{lead.customerName}</h3><Badge label={lead.status} /></div><p className="mt-2 text-sm leading-6 text-[#6b7280]">{lead.serviceTitle} • {lead.location ?? "Location not added"} • Budget {budget(lead.budgetMin, lead.budgetMax)}</p><p className="mt-2 text-sm text-[#475569]">{lead.message ?? "No message added."}</p></div><div className="flex flex-wrap gap-2 lg:justify-end">{lead.status === "NEW" && <LeadButton id={lead.id} status="ACCEPTED" label="Accept" />}{lead.status === "NEW" && <LeadButton id={lead.id} status="REJECTED" label="Reject" secondary />}{lead.status === "ACCEPTED" && <LeadButton id={lead.id} status="IN_PROGRESS" label="Start work" />}{lead.status === "IN_PROGRESS" && <LeadButton id={lead.id} status="COMPLETED" label="Complete" />}</div></div></div>)}</div>}
    </PageScaffold>
  );
}

function BookingsPage({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  return <PageScaffold icon={CalendarCheck} eyebrow="Bookings" title="Accepted work schedule" copy="Accepted leads become bookings. Manage ongoing and completed jobs from here.">{data.bookings.length === 0 ? <EmptyState title="No bookings yet" copy="Accept a customer enquiry to create your first booking." cta={{href: "/provider/leads", label: "View leads"}} /> : <div className="grid gap-4">{data.bookings.map((booking) => <div key={booking.id} className={card}><div className="grid gap-4 lg:grid-cols-[1fr_auto]"><div><h3 className="font-heading text-xl font-bold text-[#111827]">{booking.customerName}</h3><p className="mt-2 text-sm leading-6 text-[#6b7280]">{booking.serviceTitle} • {booking.scheduledAt ? date.format(booking.scheduledAt) : "Not scheduled"} • {booking.address ?? "Address not added"}</p><p className="mt-2 text-sm text-[#475569]">{booking.notes ?? "No notes."}</p></div><div className="flex flex-wrap gap-2"><BookingButton id={booking.id} status="ONGOING" label="Start" /><BookingButton id={booking.id} status="COMPLETED" label="Complete" /><BookingButton id={booking.id} status="CANCELLED" label="Cancel" secondary /></div></div></div>)}</div>}</PageScaffold>;
}

function MessagesPage({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  return <PageScaffold icon={MessageSquare} eyebrow="Messages" title="Customer conversations" copy="Conversation history, unread counts and last messages are loaded from the backend.">{data.messageThreads.length === 0 ? <EmptyState title="No conversations yet" copy="Customer conversations will appear here after enquiries start." /> : <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr]"><div className="grid gap-3">{data.messageThreads.map((thread) => <div key={thread.id} className={mutedCard}><p className="font-bold text-[#111827]">{thread.customerName}</p><p className="mt-1 text-sm text-[#6b7280]">{thread.subject}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#005BAC]">{thread.lastMessageAt ? date.format(thread.lastMessageAt) : "No messages yet"}</p></div>)}</div><div className={card}><MessageSquare className="text-[#005BAC]" /><h3 className="mt-4 font-heading text-2xl font-bold">Select a conversation</h3><p className="mt-2 text-sm leading-6 text-[#6b7280]">Conversation details and attachments will appear here.</p></div></div>}</PageScaffold>;
}

function DocumentsPage({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  return <PageScaffold icon={FileText} eyebrow="Documents" title="Verification document center" copy="Preview, download and replace documents without using the Supabase dashboard.">{data.documents.length === 0 ? <EmptyState title="No documents uploaded" copy="Upload verification documents to start review." cta={{href: "/provider/register", label: "Upload documents"}} /> : <div className="grid gap-4">{data.documents.map((document) => <div key={document.id} className={card}><div className="grid gap-4 lg:grid-cols-[1fr_auto]"><div><h3 className="font-heading text-xl font-bold text-[#111827]">{document.documentType}</h3><p className="mt-2 break-all text-sm font-semibold text-[#6b7280]">{document.originalFileName ?? document.fileName}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#64748b]">{formatBytes(document.fileSize)} • {document.mimeType ?? "Unknown type"} • Uploaded {date.format(document.uploadedAt)}</p><p className="mt-2 text-sm font-bold text-[#005BAC]">Verification status: {document.status}</p></div><div className="flex flex-wrap gap-2">{!document.storagePath.startsWith("pending://") && <a href={`/api/provider/documents/${document.id}/preview`} target="_blank" rel="noreferrer" className={secondaryButton}><Eye size={15} />Preview</a>}{!document.storagePath.startsWith("pending://") && <a href={`/api/provider/documents/${document.id}/download`} className={secondaryButton}><Download size={15} />Download</a>}<Link href="/provider/register" className={primaryButton}>Replace</Link></div></div></div>)}</div>}</PageScaffold>;
}

function SubscriptionPage({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  const subscription = data.subscription;
  return <PageScaffold icon={CreditCard} eyebrow="Subscription" title="Plan and billing" copy="Subscription records are stored in the backend and ready for billing integration."><div className="grid gap-5 lg:grid-cols-2"><Panel eyebrow="Current plan" title={subscription?.planName ?? "Launch Access"} copy={subscription ? `Status: ${subscription.status}. Started ${date.format(subscription.startedAt)}.` : "No paid plan is active yet. Launch access is available during provider onboarding."}><Badge label={subscription?.status ?? "ACTIVE"} tone="success" /></Panel><Panel eyebrow="Upgrade" title="Premium plans will activate later" copy="Upgrade, renewal, invoices and payment methods are prepared as backend records but payment collection is not enabled yet."><button type="button" disabled className="rounded-2xl bg-[#94a3b8] px-4 py-2.5 text-sm font-bold text-white">Upgrade unavailable</button></Panel></div><ResponsiveTable headers={["Benefit", "Launch", "Premium"]} rows={[["Verified profile", "Included", "Included"], ["Lead tools", "Included", "Advanced"], ["Analytics", "Basic", "Advanced"], ["Priority support", "Standard", "Included"]]} empty="No comparison available." /></PageScaffold>;
}

function AnalyticsPage({data}: {data: PortalData}) {
  return <PageScaffold icon={BarChart3} eyebrow="Analytics" title="Business performance" copy="Profile views, lead trends, revenue, acceptance rate, conversion and growth metrics are data-driven."><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><KpiCard label="Profile Views" value={String(sum(data.analyticsSnapshots, "profileViews"))} icon={Eye} /><KpiCard label="Search Appearances" value={String(sum(data.analyticsSnapshots, "searchAppearances"))} icon={Search} /><KpiCard label="Lead Conversion" value={`${data.metrics.responseRate}%`} icon={TrendingUp} /><KpiCard label="Response Time" value={`${average(data.analyticsSnapshots.map((item) => item.responseTimeMinutes))}m`} icon={Clock3} /></section><Panel eyebrow="Monthly Growth" title="Revenue and activity trend" copy="Bars populate from analytics snapshots."><Bars values={data.analyticsSnapshots.map((item) => item.profileViews + item.searchAppearances + item.revenueAmount)} /></Panel></PageScaffold>;
}

function ReviewsPage({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  return <PageScaffold icon={Star} eyebrow="Reviews" title="Reputation management" copy="Average rating, breakdown, latest reviews and provider replies are ready for verified customer reviews."><section className="grid gap-4 md:grid-cols-3"><KpiCard label="Average Rating" value={data.metrics.averageRating ? data.metrics.averageRating.toFixed(1) : "0.0"} icon={Star} /><KpiCard label="Total Reviews" value={String(data.reviews.length)} icon={MessageSquare} /><KpiCard label="Reported Reviews" value={String(data.reviews.filter((item) => item.status === "REPORTED").length)} icon={ShieldCheck} /></section>{data.reviews.length === 0 ? <EmptyState title="No reviews yet" copy="Reviews will appear after completed customer interactions." /> : <div className="grid gap-4">{data.reviews.map((review) => <div key={review.id} className={card}><h3 className="font-heading text-xl font-bold">{review.customerName}</h3><p className="mt-1 text-sm font-bold text-[#F4A300]">{review.rating}/5 • {date.format(review.createdAt)}</p><p className="mt-3 text-sm leading-6 text-[#6b7280]">{review.comment ?? "No comment added."}</p>{review.response && <p className="mt-3 rounded-2xl bg-[#EAF4FF] p-3 text-sm text-[#005BAC]">Your reply: {review.response}</p>}</div>)}</div>}</PageScaffold>;
}

function SupportPage({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  return <PageScaffold icon={LifeBuoy} eyebrow="Support" title="Help and support tickets" copy="Raise tickets, review history and use launch support channels from one place."><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><form action={createSupportTicket} className={`${card} grid gap-4`}><h3 className="font-heading text-2xl font-bold">Raise a ticket</h3><input name="subject" required className="rounded-2xl border border-[#dbe3ef] px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" placeholder="Subject" /><input name="category" className="rounded-2xl border border-[#dbe3ef] px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" placeholder="Category" /><textarea name="message" required className="min-h-32 rounded-2xl border border-[#dbe3ef] px-4 py-3 text-sm font-semibold outline-none focus:border-[#005BAC]" placeholder="Tell us what you need help with" /><button className={primaryButton}>Create support ticket</button></form><Panel eyebrow="Ticket history" title="Recent support requests" copy="Support tickets are stored in the backend.">{data.supportTickets.length === 0 ? <p className="text-sm font-semibold text-[#6b7280]">No support tickets yet.</p> : <div className="grid gap-3">{data.supportTickets.map((ticket) => <div key={ticket.id} className={mutedCard}><p className="font-bold">{ticket.subject}</p><p className="mt-1 text-sm text-[#6b7280]">{ticket.status} • {date.format(ticket.createdAt)}</p></div>)}</div>}</Panel></div></PageScaffold>;
}

function SettingsPage() {
  return <PageScaffold icon={Bell} eyebrow="Settings" title="Account controls" copy="Manage account, password, notifications, language, privacy, security and logout."><CardGrid rows={["Account", "Password", "Notifications", "Language", "Privacy", "Security", "Delete Account Request", "Logout"].map((item) => [item, `${item} controls are prepared for the provider workspace.`])} /></PageScaffold>;
}

function VerificationPage({data, date}: {data: PortalData; date: Intl.DateTimeFormat}) {
  const approved = data.provider.status === "APPROVED";
  return <PageScaffold icon={BadgeCheck} eyebrow={approved ? "Verification" : "Application Status"} title={approved ? "Trust badge lifecycle" : "Your application is under review"} copy={approved ? "Track admin review, document status, verification history and current badge." : "You will see dashboard access after approval. Track documents, remarks and next steps here."}><section className="grid gap-4 md:grid-cols-4"><KpiCard label="Current Status" value={data.provider.status.replaceAll("_", " ")} icon={BadgeCheck} /><KpiCard label="Documents Uploaded" value={String(data.documents.length)} icon={FileText} /><KpiCard label="Admin Reviews" value={String(data.verificationRequests.length)} icon={ShieldCheck} /><KpiCard label="Expected Completion" value={approved ? (data.provider.verifiedAt ? date.format(data.provider.verifiedAt) : "Approved") : "24-48 Hours"} icon={Clock3} /></section><Panel eyebrow="Review timeline" title={approved ? "Admin review timeline" : "Application progress"} copy="Every admin decision is retained for auditability.">{data.verificationRequests.length === 0 ? <p className="text-sm font-semibold text-[#6b7280]">No verification history yet.</p> : <div className="grid gap-3">{data.verificationRequests.map((request) => <div key={request.id} className={mutedCard}><p className="font-bold">{request.status}</p><p className="mt-1 text-sm text-[#6b7280]">{request.message ?? "No admin remarks"} • {date.format(request.createdAt)}</p></div>)}</div>}</Panel><Panel eyebrow="Next steps" title={approved ? "Dashboard access is active" : "What happens next"} copy={approved ? "You can now use the full provider dashboard." : "Documents are checked, your identity and professional details are reviewed, and admin remarks will appear here if anything is missing."}><div className="grid gap-3 md:grid-cols-4">{["Application Submitted", "Documents Uploaded", "Under Review", approved ? "Approved" : "Approval Pending"].map((item, index) => <ChecklistItem key={item} label={item} done={approved || index < 3} />)}</div></Panel></PageScaffold>;
}

function PageScaffold({icon: Icon, eyebrow, title, copy, children}: {icon: typeof Users; eyebrow: string; title: string; copy: string; children: React.ReactNode}) {
  return <div className="grid gap-6"><section className={`${card} bg-white`}><Icon className="text-[#005BAC]" size={32} aria-hidden /><p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-[#F4A300]">{eyebrow}</p><h2 className="mt-2 font-heading text-3xl font-bold text-[#111827]">{title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b7280]">{copy}</p></section>{children}</div>;
}

function Panel({eyebrow, title, copy, children}: {eyebrow: string; title: string; copy?: string; children: React.ReactNode}) {
  return <section className={card}><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4A300]">{eyebrow}</p><h3 className="mt-2 font-heading text-2xl font-bold text-[#111827]">{title}</h3>{copy && <p className="mt-2 text-sm leading-6 text-[#6b7280]">{copy}</p>}<div className="mt-6">{children}</div></section>;
}

function KpiCard({label, value, icon: Icon, href}: {label: string; value: string; icon: typeof Users; href?: string}) {
  const content = <><Icon className="text-[#005BAC]" size={24} aria-hidden /><p className="mt-4 text-sm font-semibold text-[#64748b]">{label}</p><h3 className="mt-2 font-heading text-2xl font-bold text-[#111827]">{value}</h3></>;
  return href ? <Link href={href} className={`${card} block transition hover:-translate-y-1 hover:border-[#005BAC] hover:bg-[#fbfdff]`}>{content}</Link> : <div className={card}>{content}</div>;
}

function MiniStat({label, value, light}: {label: string; value: string; light?: boolean}) {
  return <div className={`rounded-2xl p-4 ${light ? "bg-[#f8fafc] text-[#111827]" : "bg-white/10 text-white"}`}><p className={`text-xs font-bold uppercase tracking-[0.12em] ${light ? "text-[#64748b]" : "text-[#c8d7ea]"}`}>{label}</p><p className="mt-2 font-heading text-2xl font-bold">{value}</p></div>;
}

function Badge({label, tone}: {label: string; tone?: "success" | "warning"}) {
  const classes = tone === "success" ? "bg-[#dcfce7] text-[#166534]" : tone === "warning" ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#EAF4FF] text-[#005BAC]";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classes}`}>{label}</span>;
}

function Progress({value}: {value: number}) {
  return <div className="h-3 overflow-hidden rounded-full bg-[#e2e8f0]"><div className="h-full rounded-full bg-[#005BAC]" style={{width: `${Math.min(100, Math.max(0, value))}%`}} /></div>;
}

function ChecklistItem({label, done}: {label: string; done: boolean}) {
  return <div className="flex items-center gap-2 rounded-2xl bg-[#f8fafc] px-3 py-2 text-sm font-bold text-[#475569]">{done ? <CheckCircle2 className="text-[#22C55E]" size={17} /> : <Clock3 className="text-[#F59E0B]" size={17} />}{label}</div>;
}

function ActionRow({title, copy, href}: {title: string; copy: string; href?: string}) {
  const content = <><p className="font-bold text-[#111827]">{title}</p><p className="mt-1 text-sm leading-6 text-[#64748b]">{copy}</p></>;
  return href ? <Link href={href} className={`${mutedCard} block transition hover:border-[#005BAC] hover:bg-[#EAF4FF]`}>{content}</Link> : <div className={mutedCard}>{content}</div>;
}

function QuickAction({href, label, icon: Icon}: {href: string; label: string; icon: typeof Users}) {
  return <Link href={href} className={`${secondaryButton} justify-start`}><Icon size={17} aria-hidden />{label}</Link>;
}

function Donut({counts}: {counts: number[]}) {
  const total = counts.reduce((sum, value) => sum + value, 0);
  return <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full" style={{background: total ? "conic-gradient(#005BAC 0 30%, #F4A300 30% 48%, #22C55E 48% 68%, #7c3aed 68% 86%, #DC2626 86% 100%)" : "#e2e8f0"}}><div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-center"><span><strong className="block font-heading text-3xl">{total}</strong><span className="text-xs font-bold text-[#64748b]">Total Leads</span></span></div></div>;
}

function PipelineLegend({label, value, href}: {label: string; value: number; href?: string}) {
  const content = <><span>{label}</span><span className="text-[#005BAC]">{value}</span></>;
  return href ? <Link href={href} className="flex items-center justify-between rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-bold transition hover:bg-[#EAF4FF]">{content}</Link> : <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-bold">{content}</div>;
}

function ResponsiveTable({headers, rows, empty}: {headers: string[]; rows: string[][]; empty: string}) {
  if (!rows.length) return <p className="rounded-2xl bg-[#f8fafc] p-4 text-sm font-semibold text-[#64748b]">{empty}</p>;
  return <div className="overflow-x-auto rounded-2xl border border-[#e4e8f0]"><table className="min-w-full text-left text-sm"><thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.12em] text-[#64748b]"><tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.join("-")} className="border-t border-[#e4e8f0] bg-white">{row.map((cell) => <td key={cell} className="px-4 py-4 font-semibold text-[#334155]">{cell}</td>)}</tr>)}</tbody></table></div>;
}

function EmptyState({title, copy, cta}: {title: string; copy: string; cta?: {href: string; label: string}}) {
  return <div className={`${card} text-center`}><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#EAF4FF] text-[#005BAC]"><ShieldCheck size={26} aria-hidden /></div><h3 className="mt-5 font-heading text-2xl font-bold text-[#111827]">{title}</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#64748b]">{copy}</p>{cta && <Link href={cta.href} className={`${primaryButton} mt-6`}>{cta.label}</Link>}</div>;
}

function ListEmpty<T>({items, emptyTitle, emptyCopy, children}: {items: T[]; emptyTitle: string; emptyCopy: string; children: (item: T) => React.ReactNode}) {
  if (!items.length) return <EmptyState title={emptyTitle} copy={emptyCopy} />;
  return <div className="grid gap-3">{items.map((item, index) => <div key={index}>{children(item)}</div>)}</div>;
}

function SearchBar({placeholder}: {placeholder: string}) {
  return <label className={`${card} flex items-center gap-3`}><Search className="text-[#005BAC]" size={20} /><input className="w-full bg-transparent text-sm font-semibold outline-none" placeholder={placeholder} /></label>;
}

function LeadButton({id, status, label, secondary}: {id: string; status: string; label: string; secondary?: boolean}) {
  return <form action={updateLeadStatus}><input type="hidden" name="leadId" value={id} /><input type="hidden" name="status" value={status} /><button className={secondary ? secondaryButton : primaryButton}>{label}</button></form>;
}

function BookingButton({id, status, label, secondary}: {id: string; status: string; label: string; secondary?: boolean}) {
  return <form action={updateBookingStatus}><input type="hidden" name="bookingId" value={id} /><input type="hidden" name="status" value={status} /><button className={secondary ? secondaryButton : primaryButton}>{label}</button></form>;
}

function CardGrid({rows}: {rows: string[][]}) {
  return <div className="grid gap-5 md:grid-cols-2">{rows.map(([title, copy]) => <div key={title} className={card}><h3 className="font-heading text-xl font-bold text-[#111827]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#64748b]">{copy}</p></div>)}</div>;
}

function Bars({values}: {values: number[]}) {
  const source = values.length ? values : [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...source, 1);
  return <div className="mt-6 flex h-52 items-end gap-3 rounded-2xl bg-[#f8fafc] p-5">{source.slice(-8).map((value, index) => <div key={`${value}-${index}`} className="flex-1 rounded-t-xl bg-[#005BAC]/75" style={{height: `${Math.max(8, (value / max) * 100)}%`}} />)}</div>;
}

function buildTasks(data: PortalData) {
  return [
    {title: "Complete profile", copy: `${data.metrics.profileCompletion}% profile completion`, href: "/provider/profile"},
    {title: "Upload documents", copy: `${data.documents.length} documents uploaded`, href: "/provider/documents"},
    {title: "Respond to enquiry", copy: `${data.leadStatusCounts.NEW ?? 0} new enquiries waiting`, href: "/provider/leads"},
    {title: "Renew subscription", copy: data.subscription?.renewsAt ? "Renewal date is scheduled" : "Launch access is active", href: "/provider/subscription"},
    {title: "Manage availability", copy: data.provider.officeTiming ?? "Add office timing", href: "/provider/settings"}
  ];
}

function buildActivity(data: PortalData, date: Intl.DateTimeFormat) {
  const items = [
    ...data.notifications.slice(0, 4).map((item) => ({title: item.title, copy: date.format(item.createdAt), href: item.href ?? "/provider/dashboard"})),
    ...data.leads.slice(0, 2).map((item) => ({title: `Lead ${item.status.toLowerCase()}`, copy: item.customerName, href: "/provider/leads"}))
  ];
  return items.length ? items : [{title: "Workspace created", copy: "Activity will appear after profile, leads, bookings and document updates.", href: "/provider/profile"}];
}

function featureTitle(feature: string) {
  const titles: Record<string, string> = {services: "Services Offered"};
  return titles[feature] ?? feature.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusLabel(status: ProviderStatus) {
  return status.replaceAll("_", " ");
}

function applicationReference(providerId: string) {
  return `BH-${providerId.slice(-8).toUpperCase()}`;
}

function rupees(value: number) {
  return new Intl.NumberFormat("en-IN", {style: "currency", currency: "INR", maximumFractionDigits: 0}).format(value);
}

function budget(min: number | null, max: number | null) {
  if (!min && !max) return "Not shared";
  if (min && max) return `${rupees(min)} - ${rupees(max)}`;
  return rupees(min ?? max ?? 0);
}

function formatBytes(size: number | null) {
  if (!size) return "Not recorded";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function sum<T, K extends keyof T>(rows: T[], key: K) {
  return rows.reduce((total, row) => total + Number(row[key] ?? 0), 0);
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
