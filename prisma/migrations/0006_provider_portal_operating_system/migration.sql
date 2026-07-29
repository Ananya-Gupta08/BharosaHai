CREATE TYPE "ServiceOfferingStatus" AS ENUM ('ENABLED', 'DISABLED');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "BookingStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE "MessageThreadStatus" AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');
CREATE TYPE "ReviewStatus" AS ENUM ('PUBLISHED', 'HIDDEN', 'REPORTED');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELLED', 'EXPIRED');
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

CREATE TABLE "ProviderServiceOffering" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "serviceId" TEXT,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "pricingType" TEXT,
  "minimumPrice" INTEGER,
  "maximumPrice" INTEGER,
  "experienceYears" INTEGER,
  "cities" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "availability" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "status" "ServiceOfferingStatus" NOT NULL DEFAULT 'ENABLED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProviderServiceOffering_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT,
  "customerMobile" TEXT,
  "serviceTitle" TEXT NOT NULL,
  "budgetMin" INTEGER,
  "budgetMax" INTEGER,
  "location" TEXT,
  "message" TEXT,
  "source" TEXT NOT NULL DEFAULT 'customer-portal',
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "lastActionAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "leadId" TEXT,
  "customerName" TEXT NOT NULL,
  "customerMobile" TEXT,
  "serviceTitle" TEXT NOT NULL,
  "address" TEXT,
  "notes" TEXT,
  "status" "BookingStatus" NOT NULL DEFAULT 'UPCOMING',
  "scheduledAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessageThread" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "leadId" TEXT,
  "bookingId" TEXT,
  "customerName" TEXT NOT NULL,
  "customerMobile" TEXT,
  "subject" TEXT NOT NULL,
  "status" "MessageThreadStatus" NOT NULL DEFAULT 'OPEN',
  "unreadCount" INTEGER NOT NULL DEFAULT 0,
  "lastMessageAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Message" (
  "id" TEXT NOT NULL,
  "threadId" TEXT NOT NULL,
  "senderRole" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "attachmentUrl" TEXT,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProviderNotification" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL DEFAULT 'INFO',
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "href" TEXT,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProviderNotification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProviderReview" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "leadId" TEXT,
  "bookingId" TEXT,
  "customerName" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "response" TEXT,
  "responseAt" TIMESTAMP(3),
  "status" "ReviewStatus" NOT NULL DEFAULT 'PUBLISHED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProviderReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProviderSubscription" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "planName" TEXT NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "priceMonthly" INTEGER,
  "benefits" JSONB,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "renewsAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProviderSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProviderAnalyticsSnapshot" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "profileViews" INTEGER NOT NULL DEFAULT 0,
  "searchAppearances" INTEGER NOT NULL DEFAULT 0,
  "leadConversionRate" INTEGER NOT NULL DEFAULT 0,
  "responseTimeMinutes" INTEGER NOT NULL DEFAULT 0,
  "revenueAmount" INTEGER NOT NULL DEFAULT 0,
  "completedJobs" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProviderAnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SupportTicket" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "category" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProviderServiceOffering_providerId_slug_key" ON "ProviderServiceOffering"("providerId", "slug");
CREATE INDEX "ProviderServiceOffering_providerId_status_idx" ON "ProviderServiceOffering"("providerId", "status");
CREATE INDEX "ProviderServiceOffering_serviceId_idx" ON "ProviderServiceOffering"("serviceId");
CREATE INDEX "Lead_providerId_status_idx" ON "Lead"("providerId", "status");
CREATE INDEX "Lead_providerId_createdAt_idx" ON "Lead"("providerId", "createdAt");
CREATE INDEX "Booking_providerId_status_idx" ON "Booking"("providerId", "status");
CREATE INDEX "Booking_providerId_scheduledAt_idx" ON "Booking"("providerId", "scheduledAt");
CREATE INDEX "Booking_leadId_idx" ON "Booking"("leadId");
CREATE INDEX "MessageThread_providerId_status_idx" ON "MessageThread"("providerId", "status");
CREATE INDEX "MessageThread_providerId_lastMessageAt_idx" ON "MessageThread"("providerId", "lastMessageAt");
CREATE INDEX "MessageThread_leadId_idx" ON "MessageThread"("leadId");
CREATE INDEX "MessageThread_bookingId_idx" ON "MessageThread"("bookingId");
CREATE INDEX "Message_threadId_createdAt_idx" ON "Message"("threadId", "createdAt");
CREATE INDEX "ProviderNotification_providerId_readAt_idx" ON "ProviderNotification"("providerId", "readAt");
CREATE INDEX "ProviderNotification_providerId_createdAt_idx" ON "ProviderNotification"("providerId", "createdAt");
CREATE INDEX "ProviderReview_providerId_status_idx" ON "ProviderReview"("providerId", "status");
CREATE INDEX "ProviderReview_providerId_rating_idx" ON "ProviderReview"("providerId", "rating");
CREATE INDEX "ProviderReview_leadId_idx" ON "ProviderReview"("leadId");
CREATE INDEX "ProviderReview_bookingId_idx" ON "ProviderReview"("bookingId");
CREATE INDEX "ProviderSubscription_providerId_status_idx" ON "ProviderSubscription"("providerId", "status");
CREATE UNIQUE INDEX "ProviderAnalyticsSnapshot_providerId_date_key" ON "ProviderAnalyticsSnapshot"("providerId", "date");
CREATE INDEX "ProviderAnalyticsSnapshot_providerId_date_idx" ON "ProviderAnalyticsSnapshot"("providerId", "date");
CREATE INDEX "SupportTicket_providerId_status_idx" ON "SupportTicket"("providerId", "status");
CREATE INDEX "SupportTicket_providerId_createdAt_idx" ON "SupportTicket"("providerId", "createdAt");

ALTER TABLE "ProviderServiceOffering" ADD CONSTRAINT "ProviderServiceOffering_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderServiceOffering" ADD CONSTRAINT "ProviderServiceOffering_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderNotification" ADD CONSTRAINT "ProviderNotification_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderReview" ADD CONSTRAINT "ProviderReview_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderReview" ADD CONSTRAINT "ProviderReview_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProviderReview" ADD CONSTRAINT "ProviderReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProviderSubscription" ADD CONSTRAINT "ProviderSubscription_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderAnalyticsSnapshot" ADD CONSTRAINT "ProviderAnalyticsSnapshot_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
