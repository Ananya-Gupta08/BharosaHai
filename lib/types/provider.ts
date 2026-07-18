import type {
  Category,
  Provider,
  ProviderDocument,
  SubCategory,
  VerificationRequest
} from "@prisma/client";

export type ProviderProfile = Provider & {
  category: Category;
  subCategory: SubCategory | null;
  documents: ProviderDocument[];
  verificationRequests: VerificationRequest[];
};
