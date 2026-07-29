"use server";

import {BookingStatus, LeadStatus, ServiceOfferingStatus, SupportTicketStatus} from "@prisma/client";
import {revalidatePath} from "next/cache";

import {requireProviderAccount} from "@/lib/auth/provider-account";
import {prisma} from "@/lib/db/prisma";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function requireOwnedProvider() {
  const account = await requireProviderAccount();
  return account.provider.id;
}

export async function updateLeadStatus(formData: FormData) {
  const providerId = await requireOwnedProvider();
  const leadId = text(formData, "leadId");
  const status = text(formData, "status") as LeadStatus;

  if (!leadId || !Object.values(LeadStatus).includes(status)) {
    throw new Error("Invalid lead status request.");
  }

  await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findFirstOrThrow({where: {id: leadId, providerId}});
    await tx.lead.update({
      where: {id: lead.id},
      data: {status, lastActionAt: new Date()}
    });

    if (status === LeadStatus.ACCEPTED) {
      await tx.booking.create({
        data: {
          providerId,
          leadId: lead.id,
          customerName: lead.customerName,
          customerMobile: lead.customerMobile,
          serviceTitle: lead.serviceTitle,
          address: lead.location,
          notes: lead.message,
          status: BookingStatus.UPCOMING
        }
      });
    }

    await tx.providerNotification.create({
      data: {
        providerId,
        type: status === LeadStatus.REJECTED ? "WARNING" : "SUCCESS",
        title: `Lead ${status.toLowerCase().replaceAll("_", " ")}`,
        body: `${lead.customerName}'s enquiry was moved to ${status.toLowerCase().replaceAll("_", " ")}.`,
        href: "/provider/leads"
      }
    });
  });

  revalidateProviderWorkspace();
}

export async function updateBookingStatus(formData: FormData) {
  const providerId = await requireOwnedProvider();
  const bookingId = text(formData, "bookingId");
  const status = text(formData, "status") as BookingStatus;

  if (!bookingId || !Object.values(BookingStatus).includes(status)) {
    throw new Error("Invalid booking status request.");
  }

  await prisma.booking.update({
    where: {id: bookingId, providerId},
    data: {
      status,
      completedAt: status === BookingStatus.COMPLETED ? new Date() : null
    }
  });

  revalidateProviderWorkspace();
}

export async function toggleServiceOffering(formData: FormData) {
  const providerId = await requireOwnedProvider();
  const offeringId = text(formData, "offeringId");
  const status = text(formData, "status") as ServiceOfferingStatus;

  if (!offeringId || !Object.values(ServiceOfferingStatus).includes(status)) {
    throw new Error("Invalid service status request.");
  }

  await prisma.providerServiceOffering.update({
    where: {id: offeringId, providerId},
    data: {status}
  });

  revalidateProviderWorkspace();
}

export async function markNotificationRead(formData: FormData) {
  const providerId = await requireOwnedProvider();
  const notificationId = text(formData, "notificationId");

  if (!notificationId) {
    return;
  }

  await prisma.providerNotification.update({
    where: {id: notificationId, providerId},
    data: {readAt: new Date()}
  });

  revalidateProviderWorkspace();
}

export async function createSupportTicket(formData: FormData) {
  const providerId = await requireOwnedProvider();
  const subject = text(formData, "subject");
  const message = text(formData, "message");
  const category = text(formData, "category") || null;

  if (!subject || !message) {
    throw new Error("Subject and message are required.");
  }

  await prisma.supportTicket.create({
    data: {
      providerId,
      subject,
      category,
      message,
      status: SupportTicketStatus.OPEN
    }
  });

  await prisma.providerNotification.create({
    data: {
      providerId,
      type: "INFO",
      title: "Support ticket created",
      body: "Your support request has been recorded.",
      href: "/provider/support"
    }
  });

  revalidateProviderWorkspace();
}

function revalidateProviderWorkspace() {
  revalidatePath("/[locale]/provider/dashboard", "page");
  revalidatePath("/[locale]/provider/leads", "page");
  revalidatePath("/[locale]/provider/bookings", "page");
  revalidatePath("/[locale]/provider/messages", "page");
  revalidatePath("/[locale]/provider/support", "page");
  revalidatePath("/[locale]/provider/services-offered", "page");
}
