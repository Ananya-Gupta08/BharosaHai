import {prisma} from "@/lib/db/prisma";

export function listCategoriesWithSubCategories() {
  return prisma.category.findMany({
    orderBy: {name: "asc"},
    include: {
      subCategories: {
        orderBy: {name: "asc"}
      }
    }
  });
}

export function findCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: {slug},
    include: {
      subCategories: {
        orderBy: {name: "asc"}
      }
    }
  });
}
