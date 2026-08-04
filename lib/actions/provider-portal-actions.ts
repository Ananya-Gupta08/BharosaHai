"use server";

import {BookingStatus, LeadStatus, ServiceOfferingStatus, SupportTicketStatus, TaskPriority, TaskStatus} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {z} from "zod";

import {requireProviderAccount} from "@/lib/auth/provider-account";
import {prisma} from "@/lib/db/prisma";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const taskSchema = z.object({
  title: z.string().trim().min(2).max(120),
  notes: z.string().trim().max(600).optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: z.string().trim().optional(),
  dueTime: z.string().trim().optional()
});

async function requireOwnedProvider() {
  const account = await requireProviderAccount();
  return account.provider.id;
}

async function requireApprovedProvider() {
  const account = await requireProviderAccount();

  if (account.provider.status !== "APPROVED") {
    throw new Error("This provider module is available after verification.");
  }

  return account.provider.id;
}

export async function updateLeadStatus(formData: FormData) {
  const providerId = await requireApprovedProvider();
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
  const providerId = await requireApprovedProvider();
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
  const providerId = await requireApprovedProvider();
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

export async function createProviderTask(formData: FormData) {
  const providerId = await requireApprovedProvider();
  const parsed = parseTask(formData);

  const task = await prisma.providerTask.create({
    data: {
      providerId,
      title: parsed.title,
      notes: parsed.notes || null,
      priority: parsed.priority,
      dueAt: taskDueAt(parsed.dueDate, parsed.dueTime)
    }
  });

  await writeTaskAudit("PROVIDER_TASK_CREATED", task.id, providerId, {title: task.title});
  revalidateProviderWorkspace();
}

export async function updateProviderTask(formData: FormData) {
  const providerId = await requireApprovedProvider();
  const taskId = text(formData, "taskId");
  const parsed = parseTask(formData);

  if (!taskId) {
    throw new Error("Task is required.");
  }

  const existing = await prisma.providerTask.findFirstOrThrow({where: {id: taskId, providerId, deletedAt: null}});
  const task = await prisma.providerTask.update({
    where: {id: existing.id},
    data: {
      title: parsed.title,
      notes: parsed.notes || null,
      priority: parsed.priority,
      dueAt: taskDueAt(parsed.dueDate, parsed.dueTime)
    }
  });

  await writeTaskAudit("PROVIDER_TASK_UPDATED", task.id, providerId, {title: task.title});
  revalidateProviderWorkspace();
}

export async function updateProviderTaskStatus(formData: FormData) {
  const providerId = await requireApprovedProvider();
  const taskId = text(formData, "taskId");
  const status = text(formData, "status") as TaskStatus;

  if (!taskId || !Object.values(TaskStatus).includes(status)) {
    throw new Error("Invalid task status request.");
  }

  const existing = await prisma.providerTask.findFirstOrThrow({where: {id: taskId, providerId, deletedAt: null}});
  const task = await prisma.providerTask.update({
    where: {id: existing.id},
    data: {
      status,
      completedAt: status === TaskStatus.COMPLETED ? new Date() : null
    }
  });

  await writeTaskAudit("PROVIDER_TASK_STATUS_UPDATED", task.id, providerId, {status});
  revalidateProviderWorkspace();
}

export async function duplicateProviderTask(formData: FormData) {
  const providerId = await requireApprovedProvider();
  const taskId = text(formData, "taskId");

  if (!taskId) {
    throw new Error("Task is required.");
  }

  const task = await prisma.providerTask.findFirstOrThrow({
    where: {id: taskId, providerId, deletedAt: null}
  });

  const duplicate = await prisma.providerTask.create({
    data: {
      providerId,
      title: `${task.title} copy`,
      notes: task.notes,
      priority: task.priority,
      dueAt: task.dueAt
    }
  });

  await writeTaskAudit("PROVIDER_TASK_DUPLICATED", duplicate.id, providerId, {sourceTaskId: task.id});
  revalidateProviderWorkspace();
}

export async function deleteProviderTask(formData: FormData) {
  const providerId = await requireApprovedProvider();
  const taskId = text(formData, "taskId");

  if (!taskId) {
    throw new Error("Task is required.");
  }

  const existing = await prisma.providerTask.findFirstOrThrow({where: {id: taskId, providerId, deletedAt: null}});
  const task = await prisma.providerTask.update({
    where: {id: existing.id},
    data: {deletedAt: new Date()}
  });

  await writeTaskAudit("PROVIDER_TASK_DELETED", task.id, providerId, {title: task.title});
  revalidateProviderWorkspace();
}

function parseTask(formData: FormData) {
  const parsed = taskSchema.safeParse({
    title: text(formData, "title"),
    notes: text(formData, "notes"),
    priority: text(formData, "priority") || TaskPriority.MEDIUM,
    dueDate: text(formData, "dueDate"),
    dueTime: text(formData, "dueTime")
  });

  if (!parsed.success) {
    throw new Error("Invalid task details.");
  }

  return parsed.data;
}

function taskDueAt(dueDate?: string, dueTime?: string) {
  if (!dueDate) {
    return null;
  }

  const value = new Date(`${dueDate}T${dueTime || "09:00"}:00`);
  return Number.isNaN(value.getTime()) ? null : value;
}

async function writeTaskAudit(action: string, entityId: string, providerId: string, details: Record<string, unknown>) {
  await prisma.auditLog.create({
    data: {
      action,
      entityType: "ProviderTask",
      entityId,
      details: {...details, providerId}
    }
  });
}

function revalidateProviderWorkspace() {
  revalidatePath("/[locale]/provider/dashboard", "page");
  revalidatePath("/[locale]/provider/leads", "page");
  revalidatePath("/[locale]/provider/bookings", "page");
  revalidatePath("/[locale]/provider/messages", "page");
  revalidatePath("/[locale]/provider/support", "page");
  revalidatePath("/[locale]/provider/services-offered", "page");
}
