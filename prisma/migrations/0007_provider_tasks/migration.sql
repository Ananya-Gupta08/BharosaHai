CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'COMPLETED');

CREATE TABLE "ProviderTask" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderTask_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProviderTask_providerId_status_idx" ON "ProviderTask"("providerId", "status");

CREATE INDEX "ProviderTask_providerId_dueAt_idx" ON "ProviderTask"("providerId", "dueAt");

CREATE INDEX "ProviderTask_providerId_deletedAt_idx" ON "ProviderTask"("providerId", "deletedAt");

ALTER TABLE "ProviderTask" ADD CONSTRAINT "ProviderTask_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
