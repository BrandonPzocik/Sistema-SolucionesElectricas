import { z } from "zod";

export const ProductUpsertSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  technical_specs: z.string().min(3),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  min_stock: z.coerce.number().int().nonnegative(),
  image_url: z.string().url()
});

export const ProductStockUpdateSchema = z.object({
  stock: z.coerce.number().int().nonnegative(),
  min_stock: z.coerce.number().int().nonnegative().optional()
});
