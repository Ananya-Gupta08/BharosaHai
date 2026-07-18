import {ProviderStatus} from "@prisma/client";
import {z} from "zod";

import {cuidSchema, slugSchema} from "@/lib/validators/common";

export const providerSearchSchema = z.object({
  status: z.enum(ProviderStatus).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  categorySlug: slugSchema.optional(),
  subCategorySlug: slugSchema.optional()
});

export const providerRegistrationDraftSchema = z.object({
  userId: cuidSchema,
  name: z.string().trim().min(2).max(120),
  mobile: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(160),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(80),
  categoryId: cuidSchema,
  subCategoryId: cuidSchema.optional(),
  experienceYears: z.coerce.number().int().min(0).max(60),
  languages: z.array(z.string().trim().min(2).max(40)).min(1),
  officeAddress: z.string().trim().min(5).max(300),
  bio: z.string().trim().min(20).max(1200)
});

export const providerApplicationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  mobile: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(160),
  fatherOrHusbandName: z.string().trim().max(120).optional(),
  dateOfBirth: z.string().trim().max(40).optional(),
  gender: z.string().trim().max(40).optional(),
  profileType: z.string().trim().min(2).max(80),
  address: z.string().trim().min(5).max(300),
  state: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  tehsil: z.string().trim().max(80).optional(),
  city: z.string().trim().min(2).max(80),
  area: z.string().trim().max(80).optional(),
  pincode: z.string().trim().min(4).max(12),
  category: slugSchema,
  subCategory: slugSchema.optional(),
  specialization: z.string().trim().max(120).optional(),
  services: z
    .string()
    .trim()
    .max(600)
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().min(2).max(80)).min(1)),
  highestQualification: z.string().trim().min(2).max(120),
  professionalQualification: z.string().trim().min(2).max(160),
  professionalMembership: z.string().trim().max(180).optional(),
  awards: z.string().trim().max(300).optional(),
  industriesServed: z.string().trim().max(300).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60),
  languages: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().min(2).max(40)).min(1)),
  availability: z
    .string()
    .trim()
    .max(300)
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean))
    .pipe(z.array(z.string().min(2).max(80)).min(1)),
  workingDays: z
    .string()
    .trim()
    .max(200)
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean))
    .pipe(z.array(z.string().min(2).max(40)).min(1)),
  officeTiming: z.string().trim().min(2).max(120),
  officeName: z.string().trim().min(2).max(160),
  officeAddress: z.string().trim().min(5).max(300),
  officeLandmark: z.string().trim().max(160).optional(),
  googleMapLocation: z.string().trim().max(300).optional(),
  registrationNumber: z.string().trim().max(120).optional(),
  registrationAuthority: z.string().trim().max(160).optional(),
  registrationValidity: z.string().trim().max(80).optional(),
  serviceAreas: z
    .string()
    .trim()
    .max(300)
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean))
    .pipe(z.array(z.string().min(2).max(80)).min(1)),
  feeType: z.string().trim().min(2).max(40),
  minimumFee: z.coerce.number().int().min(0).max(1000000).optional(),
  maximumFee: z.coerce.number().int().min(0).max(1000000).optional(),
  bankName: z.string().trim().max(120).optional(),
  bankAccountNumber: z.string().trim().max(40).optional(),
  bankIfsc: z.string().trim().max(20).optional(),
  upiId: z.string().trim().max(100).optional(),
  websiteUrl: z.string().trim().max(200).optional(),
  googleBusinessUrl: z.string().trim().max(200).optional(),
  facebookUrl: z.string().trim().max(200).optional(),
  instagramUrl: z.string().trim().max(200).optional(),
  linkedinUrl: z.string().trim().max(200).optional(),
  youtubeUrl: z.string().trim().max(200).optional(),
  bio: z.string().trim().min(20).max(1200),
  declaration: z.literal("on")
});

export type ProviderSearchInput = z.infer<typeof providerSearchSchema>;
export type ProviderRegistrationDraftInput = z.infer<
  typeof providerRegistrationDraftSchema
>;
export type ProviderApplicationInput = z.infer<typeof providerApplicationSchema>;
