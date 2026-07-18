import {
  findCategoryBySlug,
  listCategoriesWithSubCategories
} from "@/lib/repositories/category-repository";
import {slugSchema} from "@/lib/validators/common";

export async function getServiceCategories() {
  return listCategoriesWithSubCategories();
}

export async function getServiceCategoryBySlug(slug: string) {
  const parsedSlug = slugSchema.parse(slug);

  return findCategoryBySlug(parsedSlug);
}
