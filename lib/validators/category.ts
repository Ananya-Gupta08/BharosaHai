import {z} from "zod";

import {slugSchema} from "@/lib/validators/common";

export const categorySeedSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: slugSchema,
  description: z.string().trim().max(300).optional(),
  subCategories: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(80),
        slug: slugSchema
      })
    )
    .min(1)
});

export type CategorySeedInput = z.infer<typeof categorySeedSchema>;
