import type {Prisma} from "@prisma/client";

import {prisma} from "@/lib/db/prisma";

type CreateAuditLogInput = {
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Prisma.InputJsonValue;
};

export function createAuditLog(input: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      details: input.details
    }
  });
}
