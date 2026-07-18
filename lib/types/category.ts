import type {Category, SubCategory} from "@prisma/client";

export type CategoryWithSubCategories = Category & {
  subCategories: SubCategory[];
};
