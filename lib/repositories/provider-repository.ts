import type {Prisma} from "@prisma/client";

import {prisma} from "@/lib/db/prisma";

export function findProviderById(id: string) {
  return prisma.provider.findUnique({
    where: {id},
    include: {
      category: true,
      subCategory: true,
      documents: true,
      verificationRequests: {
        orderBy: {createdAt: "desc"}
      }
    }
  });
}

export function listProviders(where?: Prisma.ProviderWhereInput) {
  return prisma.provider.findMany({
    where,
    orderBy: {createdAt: "desc"},
    include: {
      category: true,
      subCategory: true
    }
  });
}
