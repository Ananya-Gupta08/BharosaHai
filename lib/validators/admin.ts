import {z} from "zod";

import {cuidSchema, requiredTextSchema} from "@/lib/validators/common";

export const auditLogSchema = z.object({
  actorId: cuidSchema.optional(),
  action: requiredTextSchema.max(80),
  entityType: requiredTextSchema.max(80),
  entityId: requiredTextSchema.max(120),
  details: z.record(z.string(), z.unknown()).optional()
});

export type AuditLogInput = z.infer<typeof auditLogSchema>;
