import type {
  BookingStatus,
  LeadStatus,
  Prisma,
  ProviderStatus,
  VerificationLevel
} from "@prisma/client";

import {prisma} from "@/lib/db/prisma";

export type ProviderPortalData = Awaited<ReturnType<typeof getProviderPortalData>>;

const providerSelect = {
  id: true,
  status: true,
  verificationLevel: true,
  name: true,
  email: true,
  mobile: true,
  profilePhotoUrl: true,
  city: true,
  district: true,
  state: true,
  address: true,
  officeName: true,
  officeAddress: true,
  officeTiming: true,
  specialization: true,
  services: true,
  highestQualification: true,
  professionalQualification: true,
  experienceYears: true,
  languages: true,
  availability: true,
  workingDays: true,
  serviceAreas: true,
  feeType: true,
  minimumFee: true,
  maximumFee: true,
  bio: true,
  verifiedAt: true,
  createdAt: true,
  declarationAcceptedAt: true
} satisfies Prisma.ProviderSelect;

export async function getProviderPortalData(providerId: string) {
  const [
    provider,
    documents,
    verificationRequests,
    serviceOfferings,
    leads,
    leadStatusCounts,
    bookings,
    bookingStatusCounts,
    messageThreads,
    notifications,
    reviews,
    subscription,
    analyticsSnapshots,
    supportTickets
  ] = await Promise.all([
    prisma.provider.findUniqueOrThrow({
      where: {id: providerId},
      select: providerSelect
    }),
    prisma.providerDocument.findMany({
      where: {providerId},
      orderBy: {uploadedAt: "desc"}
    }),
    prisma.verificationRequest.findMany({
      where: {providerId},
      orderBy: {createdAt: "desc"},
      take: 12
    }),
    prisma.providerServiceOffering.findMany({
      where: {providerId},
      orderBy: [{status: "asc"}, {updatedAt: "desc"}]
    }),
    prisma.lead.findMany({
      where: {providerId},
      orderBy: {createdAt: "desc"},
      take: 30
    }),
    prisma.lead.groupBy({
      by: ["status"],
      where: {providerId},
      _count: {_all: true}
    }),
    prisma.booking.findMany({
      where: {providerId},
      orderBy: [{scheduledAt: "asc"}, {createdAt: "desc"}],
      take: 30
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where: {providerId},
      _count: {_all: true}
    }),
    prisma.messageThread.findMany({
      where: {providerId},
      orderBy: [{lastMessageAt: "desc"}, {createdAt: "desc"}],
      take: 20,
      include: {
        messages: {
          orderBy: {createdAt: "desc"},
          take: 1
        }
      }
    }),
    prisma.providerNotification.findMany({
      where: {providerId},
      orderBy: {createdAt: "desc"},
      take: 20
    }),
    prisma.providerReview.findMany({
      where: {providerId},
      orderBy: {createdAt: "desc"},
      take: 30
    }),
    prisma.providerSubscription.findFirst({
      where: {providerId},
      orderBy: {createdAt: "desc"}
    }),
    prisma.providerAnalyticsSnapshot.findMany({
      where: {providerId},
      orderBy: {date: "asc"},
      take: 30
    }),
    prisma.supportTicket.findMany({
      where: {providerId},
      orderBy: {createdAt: "desc"},
      take: 20
    })
  ]);

  return {
    provider,
    documents,
    verificationRequests,
    serviceOfferings,
    leads,
    leadStatusCounts: toCountMap<LeadStatus>(leadStatusCounts),
    bookings,
    bookingStatusCounts: toCountMap<BookingStatus>(bookingStatusCounts),
    messageThreads,
    notifications,
    reviews,
    subscription,
    analyticsSnapshots,
    supportTickets,
    metrics: buildMetrics({
      provider,
      documents,
      serviceOfferings,
      leads,
      leadStatusCounts: toCountMap<LeadStatus>(leadStatusCounts),
      bookings,
      bookingStatusCounts: toCountMap<BookingStatus>(bookingStatusCounts),
      messageThreads,
      notifications,
      reviews,
      subscription,
      analyticsSnapshots
    })
  };
}

function toCountMap<TStatus extends string>(rows: Array<{status: TStatus; _count: {_all: number}}>) {
  return rows.reduce<Record<TStatus, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {} as Record<TStatus, number>);
}

function buildMetrics(input: {
  provider: {
    status: ProviderStatus;
    verificationLevel: VerificationLevel;
    city: string | null;
    officeAddress: string | null;
    officeTiming: string | null;
    services: string[];
    languages: string[];
    bio: string | null;
    experienceYears: number | null;
  };
  documents: Array<{status: string}>;
  serviceOfferings: Array<{status: string}>;
  leads: Array<{status: LeadStatus}>;
  leadStatusCounts: Partial<Record<LeadStatus, number>>;
  bookings: Array<{status: BookingStatus}>;
  bookingStatusCounts: Partial<Record<BookingStatus, number>>;
  messageThreads: Array<{unreadCount: number}>;
  notifications: Array<{readAt: Date | null}>;
  reviews: Array<{rating: number}>;
  subscription: {planName: string; status: string} | null;
  analyticsSnapshots: Array<{
    profileViews: number;
    searchAppearances: number;
    revenueAmount: number;
    completedJobs: number;
    responseTimeMinutes: number;
  }>;
}) {
  const profileChecklist = [
    Boolean(input.provider.bio && input.provider.bio.length >= 40),
    Boolean(input.provider.officeAddress),
    Boolean(input.provider.officeTiming),
    input.provider.languages.length > 0,
    input.provider.services.length > 0,
    input.documents.length > 0,
    Boolean(input.provider.experienceYears)
  ];
  const profileCompletion = Math.round((profileChecklist.filter(Boolean).length / profileChecklist.length) * 100);
  const approvedDocuments = input.documents.filter((item) => item.status === "APPROVED").length;
  const responseRate = input.leads.length ? Math.round(((input.leads.length - (input.leadStatusCounts.NEW ?? 0)) / input.leads.length) * 100) : 0;
  const averageRating = input.reviews.length ? input.reviews.reduce((sum, review) => sum + review.rating, 0) / input.reviews.length : 0;
  const revenue = input.analyticsSnapshots.reduce((sum, row) => sum + row.revenueAmount, 0);
  const completedJobs = (input.bookingStatusCounts.COMPLETED ?? 0) + input.analyticsSnapshots.reduce((sum, row) => sum + row.completedJobs, 0);
  const visibilityScore = Math.min(
    100,
    Math.round(
      profileCompletion * 0.35 +
        responseRate * 0.2 +
        (averageRating ? averageRating * 10 : 0) +
        (input.provider.status === "APPROVED" ? 20 : 0) +
        (approvedDocuments ? 10 : 0)
    )
  );

  return {
    profileCompletion,
    visibilityScore,
    responseRate,
    averageRating,
    completedJobs,
    unreadMessages: input.messageThreads.reduce((sum, thread) => sum + thread.unreadCount, 0),
    unreadNotifications: input.notifications.filter((notification) => !notification.readAt).length,
    thisMonthEarnings: revenue,
    activeServices: input.serviceOfferings.filter((service) => service.status === "ENABLED").length,
    subscriptionLabel: input.subscription ? `${input.subscription.planName} (${input.subscription.status})` : "Launch Access",
    profileVisibility: input.provider.status === "APPROVED" ? "Visible after public launch" : "Hidden until verification",
    availabilityStatus: input.provider.officeTiming ? "Available during office hours" : "Add working hours",
    profileChecklist: [
      {label: "Business bio", done: profileChecklist[0]},
      {label: "Office address", done: profileChecklist[1]},
      {label: "Business hours", done: profileChecklist[2]},
      {label: "Languages", done: profileChecklist[3]},
      {label: "Services", done: profileChecklist[4]},
      {label: "Documents", done: profileChecklist[5]},
      {label: "Experience", done: profileChecklist[6]}
    ]
  };
}
