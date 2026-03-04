import { z } from "zod";

export const CreateOrderSchema = z.object({
  payment_method: z.enum(["mercado_pago", "cash"]),
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive()
    })
  ).min(1)
});
