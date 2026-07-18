import {z} from "zod";

export const cuidSchema = z.string().cuid();

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const requiredTextSchema = z.string().trim().min(1).max(500);
