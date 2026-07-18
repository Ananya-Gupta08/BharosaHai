import {listProviders} from "@/lib/repositories/provider-repository";
import {providerSearchSchema} from "@/lib/validators/provider";

export async function searchProviders(input: unknown) {
  const filters = providerSearchSchema.parse(input);

  return listProviders({
    status: filters.status,
    city: filters.city,
    category: filters.categorySlug ? {slug: filters.categorySlug} : undefined,
    subCategory: filters.subCategorySlug ? {slug: filters.subCategorySlug} : undefined
  });
}
