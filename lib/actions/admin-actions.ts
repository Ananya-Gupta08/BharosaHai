"use server";

import {DocumentStatus, ProviderStatus, VerificationStatus} from "@prisma/client";
import {revalidatePath} from "next/cache";

import {hasAdminAccess} from "@/lib/auth/admin-session";
import {prisma} from "@/lib/db/prisma";
import {cuidSchema} from "@/lib/validators/common";

type AdminDecisionState = {
  status: "idle" | "success" | "error";
  messageKey?: string;
};

const decisionMap = {
  approve: {
    providerStatus: ProviderStatus.APPROVED,
    verificationStatus: VerificationStatus.APPROVED,
    action: "provider.approved"
  },
  more: {
    providerStatus: ProviderStatus.NEEDS_MORE_DOCUMENTS,
    verificationStatus: VerificationStatus.NEEDS_MORE_DOCUMENTS,
    action: "provider.more_documents_requested"
  },
  reject: {
    providerStatus: ProviderStatus.REJECTED,
    verificationStatus: VerificationStatus.REJECTED,
    action: "provider.rejected"
  }
} as const;

export async function updateProviderStatus(
  _previousState: AdminDecisionState,
  formData: FormData
): Promise<AdminDecisionState> {
  if (!(await hasAdminAccess())) {
    return {status: "error", messageKey: "actions.unauthorized"};
  }

  const providerId = cuidSchema.safeParse(formData.get("providerId"));
  const decision = formData.get("decision");
  const note = formData.get("note");

  if (!providerId.success || typeof decision !== "string" || !(decision in decisionMap)) {
    return {status: "error", messageKey: "actions.validationError"};
  }

  const mappedDecision = decisionMap[decision as keyof typeof decisionMap];
  const adminNote = typeof note === "string" && note.trim().length > 0 ? note.trim().slice(0, 800) : mappedDecision.action;

  try {
    await prisma.$transaction(async (tx) => {
      const provider = await tx.provider.update({
        where: {id: providerId.data},
        data: {
          status: mappedDecision.providerStatus,
          verifiedAt:
            mappedDecision.providerStatus === ProviderStatus.APPROVED
              ? new Date()
              : null
        }
      });

      await tx.verificationRequest.create({
        data: {
          providerId: provider.id,
          status: mappedDecision.verificationStatus,
          message: adminNote
        }
      });

      if (mappedDecision.providerStatus === ProviderStatus.APPROVED) {
        await tx.providerDocument.updateMany({
          where: {providerId: provider.id},
          data: {
            status: DocumentStatus.APPROVED,
            verified: true,
            reviewedAt: new Date()
          }
        });
      }

      await tx.auditLog.create({
        data: {
          action: mappedDecision.action,
          entityType: "Provider",
          entityId: provider.id,
          details: {
            source: "admin-dashboard",
            note: adminNote
          }
        }
      });
    });

    revalidatePath("/[locale]/admin", "page");
    revalidatePath("/[locale]/admin/providers/[id]", "page");

    return {status: "success", messageKey: "actions.success"};
  } catch (error) {
    console.error(error);

    return {status: "error", messageKey: "actions.error"};
  }
}
