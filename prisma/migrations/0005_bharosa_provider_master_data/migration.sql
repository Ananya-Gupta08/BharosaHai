CREATE TYPE "VerificationLevel" AS ENUM (
  'NOT_VERIFIED',
  'BASIC_VERIFIED',
  'PROFESSIONAL_VERIFIED',
  'BHAROSA_HAI_VERIFIED',
  'BHAROSA_HAI_TRUSTED'
);

ALTER TABLE "Provider"
  ADD COLUMN IF NOT EXISTS "fatherOrHusbandName" TEXT,
  ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "gender" TEXT,
  ADD COLUMN IF NOT EXISTS "profileType" TEXT,
  ADD COLUMN IF NOT EXISTS "state" TEXT,
  ADD COLUMN IF NOT EXISTS "district" TEXT,
  ADD COLUMN IF NOT EXISTS "tehsil" TEXT,
  ADD COLUMN IF NOT EXISTS "area" TEXT,
  ADD COLUMN IF NOT EXISTS "pincode" TEXT,
  ADD COLUMN IF NOT EXISTS "services" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "highestQualification" TEXT,
  ADD COLUMN IF NOT EXISTS "professionalQualification" TEXT,
  ADD COLUMN IF NOT EXISTS "professionalMembership" TEXT,
  ADD COLUMN IF NOT EXISTS "awards" TEXT,
  ADD COLUMN IF NOT EXISTS "industriesServed" TEXT,
  ADD COLUMN IF NOT EXISTS "availability" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "workingDays" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "officeTiming" TEXT,
  ADD COLUMN IF NOT EXISTS "officeName" TEXT,
  ADD COLUMN IF NOT EXISTS "officeLandmark" TEXT,
  ADD COLUMN IF NOT EXISTS "googleMapLocation" TEXT,
  ADD COLUMN IF NOT EXISTS "registrationNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "registrationAuthority" TEXT,
  ADD COLUMN IF NOT EXISTS "registrationValidity" TEXT,
  ADD COLUMN IF NOT EXISTS "serviceAreas" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "feeType" TEXT,
  ADD COLUMN IF NOT EXISTS "minimumFee" INTEGER,
  ADD COLUMN IF NOT EXISTS "maximumFee" INTEGER,
  ADD COLUMN IF NOT EXISTS "bankName" TEXT,
  ADD COLUMN IF NOT EXISTS "bankAccountNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "bankIfsc" TEXT,
  ADD COLUMN IF NOT EXISTS "upiId" TEXT,
  ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "googleBusinessUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "verificationLevel" "VerificationLevel" NOT NULL DEFAULT 'NOT_VERIFIED';

CREATE INDEX IF NOT EXISTS "Provider_state_idx" ON "Provider"("state");
CREATE INDEX IF NOT EXISTS "Provider_district_idx" ON "Provider"("district");

CREATE TABLE IF NOT EXISTS "Service" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "subCategoryId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Service_categoryId_slug_key" ON "Service"("categoryId", "slug");
CREATE INDEX IF NOT EXISTS "Service_slug_idx" ON "Service"("slug");
CREATE INDEX IF NOT EXISTS "Service_subCategoryId_idx" ON "Service"("subCategoryId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Service_categoryId_fkey'
  ) THEN
    ALTER TABLE "Service"
      ADD CONSTRAINT "Service_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Service_subCategoryId_fkey'
  ) THEN
    ALTER TABLE "Service"
      ADD CONSTRAINT "Service_subCategoryId_fkey"
      FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
