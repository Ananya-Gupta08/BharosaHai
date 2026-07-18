"use server";

import {ProviderStatus, VerificationStatus} from "@prisma/client";
import {revalidatePath} from "next/cache";

import {requireProviderAccount} from "@/lib/auth/provider-account";
import {prisma} from "@/lib/db/prisma";
import {uploadProviderDocument} from "@/lib/storage/provider-documents";
import {providerApplicationSchema} from "@/lib/validators/provider";

type ProviderApplicationState = {
  status: "idle" | "success" | "error";
  messageKey?: string;
  errors?: string[];
  providerId?: string;
};

const requiredDocuments = [
  "Passport Size Photo",
  "Aadhaar Card",
  "PAN Card",
  "Professional Certificate",
  "Qualification Certificate",
  "Office Front Photo",
  "Office Interior Photo",
  "Office Name Board Photo",
  "Office Proof",
  "GST Certificate",
  "Cancelled Cheque",
  "Visiting Card"
];

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function submitProviderApplication(
  _previousState: ProviderApplicationState,
  formData: FormData
): Promise<ProviderApplicationState> {
  const account = await requireProviderAccount();

  if (!account.user.emailVerified || !account.user.mobile) {
    return {
      status: "error",
      messageKey: "submission.verificationRequired"
    };
  }

  const parsed = providerApplicationSchema.safeParse({
    name: text(formData, "name"),
    mobile: text(formData, "mobile"),
    email: text(formData, "email"),
    fatherOrHusbandName: text(formData, "fatherOrHusbandName"),
    dateOfBirth: text(formData, "dateOfBirth"),
    gender: text(formData, "gender"),
    profileType: text(formData, "profileType"),
    address: text(formData, "address"),
    state: text(formData, "state"),
    district: text(formData, "district"),
    tehsil: text(formData, "tehsil"),
    city: text(formData, "city"),
    area: text(formData, "area"),
    pincode: text(formData, "pincode"),
    category: text(formData, "category"),
    subCategory: text(formData, "subCategory"),
    specialization: text(formData, "specialization"),
    services: text(formData, "services"),
    highestQualification: text(formData, "highestQualification"),
    professionalQualification: text(formData, "professionalQualification"),
    professionalMembership: text(formData, "professionalMembership"),
    awards: text(formData, "awards"),
    industriesServed: text(formData, "industriesServed"),
    experienceYears: text(formData, "experienceYears"),
    languages: text(formData, "languages"),
    availability: text(formData, "availability"),
    workingDays: text(formData, "workingDays"),
    officeTiming: text(formData, "officeTiming"),
    officeName: text(formData, "officeName"),
    officeAddress: text(formData, "officeAddress"),
    officeLandmark: text(formData, "officeLandmark"),
    googleMapLocation: text(formData, "googleMapLocation"),
    registrationNumber: text(formData, "registrationNumber"),
    registrationAuthority: text(formData, "registrationAuthority"),
    registrationValidity: text(formData, "registrationValidity"),
    serviceAreas: text(formData, "serviceAreas"),
    feeType: text(formData, "feeType"),
    minimumFee: text(formData, "minimumFee"),
    maximumFee: text(formData, "maximumFee"),
    bankName: text(formData, "bankName"),
    bankAccountNumber: text(formData, "bankAccountNumber"),
    bankIfsc: text(formData, "bankIfsc"),
    upiId: text(formData, "upiId"),
    websiteUrl: text(formData, "websiteUrl"),
    googleBusinessUrl: text(formData, "googleBusinessUrl"),
    facebookUrl: text(formData, "facebookUrl"),
    instagramUrl: text(formData, "instagramUrl"),
    linkedinUrl: text(formData, "linkedinUrl"),
    youtubeUrl: text(formData, "youtubeUrl"),
    bio: text(formData, "bio"),
    declaration: text(formData, "declaration")
  });

  if (!parsed.success) {
    return {
      status: "error",
      messageKey: "submission.validationError",
      errors: parsed.error.issues.map((issue) => {
        const field = issue.path.join(".");

        return field ? `${field}: ${issue.message}` : issue.message;
      })
    };
  }

  const input = parsed.data;

  try {
    const provider = await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: {slug: input.category}
      });

      if (!category) {
        throw new Error(`Missing category seed: ${input.category}`);
      }

      const subCategory = input.subCategory
        ? await tx.subCategory.findUnique({
            where: {
              categoryId_slug: {
                categoryId: category.id,
                slug: input.subCategory
              }
            }
          })
        : null;

      const user = await tx.user.update({
        where: {id: account.user.id},
        data: {
          name: input.name,
          mobile: account.user.mobile ?? input.mobile,
          role: "PROVIDER"
        }
      });

      const existingProvider = await tx.provider.findUnique({
        where: {userId: user.id}
      });

      const providerData = {
        name: input.name,
        mobile: account.user.mobile ?? input.mobile,
        email: account.user.email,
        profilePhotoUrl: account.user.profilePhotoUrl,
        fatherOrHusbandName: input.fatherOrHusbandName || null,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        gender: input.gender || null,
        profileType: input.profileType,
        address: input.address,
        state: input.state,
        district: input.district,
        tehsil: input.tehsil || null,
        city: input.city,
        area: input.area || null,
        pincode: input.pincode,
        categoryId: category.id,
        subCategoryId: subCategory?.id,
        specialization: input.specialization || null,
        services: input.services,
        highestQualification: input.highestQualification,
        professionalQualification: input.professionalQualification,
        professionalMembership: input.professionalMembership || null,
        awards: input.awards || null,
        industriesServed: input.industriesServed || null,
        experienceYears: input.experienceYears,
        languages: input.languages,
        availability: input.availability,
        workingDays: input.workingDays,
        officeTiming: input.officeTiming,
        officeName: input.officeName,
        officeAddress: input.officeAddress,
        officeLandmark: input.officeLandmark || null,
        googleMapLocation: input.googleMapLocation || null,
        registrationNumber: input.registrationNumber || null,
        registrationAuthority: input.registrationAuthority || null,
        registrationValidity: input.registrationValidity || null,
        serviceAreas: input.serviceAreas,
        feeType: input.feeType,
        minimumFee: input.minimumFee ?? null,
        maximumFee: input.maximumFee ?? null,
        bankName: input.bankName || null,
        bankAccountNumber: input.bankAccountNumber || null,
        bankIfsc: input.bankIfsc || null,
        upiId: input.upiId || null,
        websiteUrl: input.websiteUrl || null,
        googleBusinessUrl: input.googleBusinessUrl || null,
        facebookUrl: input.facebookUrl || null,
        instagramUrl: input.instagramUrl || null,
        linkedinUrl: input.linkedinUrl || null,
        youtubeUrl: input.youtubeUrl || null,
        bio: input.bio,
        declarationAcceptedAt: new Date(),
        status: ProviderStatus.PENDING,
        verifiedAt: null
      };

      const savedProvider = existingProvider
        ? await tx.provider.update({
            where: {id: existingProvider.id},
            data: providerData
          })
        : await tx.provider.create({
            data: {
              userId: user.id,
              ...providerData
            }
          });

      await tx.verificationRequest.create({
        data: {
          providerId: savedProvider.id,
          status: VerificationStatus.PENDING,
          message: "Provider application submitted."
        }
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "provider.application.submitted",
          entityType: "Provider",
          entityId: savedProvider.id,
          details: {
            category: category.slug,
            source: "provider-registration"
          }
        }
      });

      return savedProvider;
    });
    const uploadedDocuments = await Promise.all(
      requiredDocuments.map((documentType) =>
        uploadProviderDocument(provider.id, provider.name, documentType, formData.get(`document:${documentType}`))
      )
    );

    await prisma.$transaction(async (tx) => {
      await tx.providerDocument.createMany({
        data: uploadedDocuments.map((document) => ({
          providerId: provider.id,
          documentType: document.documentType,
          fileName: document.fileName,
          originalFileName: document.originalFileName,
          storagePath: document.storagePath,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          status: document.status
        }))
      });
    });

    revalidatePath("/[locale]/admin", "page");
    revalidatePath("/[locale]/provider/dashboard", "page");

    return {
      status: "success",
      messageKey: "submission.success",
      providerId: provider.id
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      messageKey: "submission.error",
      errors: [error instanceof Error ? error.message : "Unknown server error"]
    };
  }
}
