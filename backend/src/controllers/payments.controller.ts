import type { Request, Response } from "express";
import { ordersService } from "../modules/orders/orders.service.js";
import { env } from "../config/env.js";
import { buildOrderMessage, createWhatsAppUrl } from "../utils/whatsapp.js";

export const paymentsController = {
  webhook: async (req: Request, res: Response) => {
    const signature = req.headers["x-signature"] as string;
    if (!signature?.includes(env.MERCADO_PAGO_WEBHOOK_SECRET)) {
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const orderId = req.body?.data?.external_reference;
    if (!orderId) return res.status(200).json({ ok: true });

    await ordersService.markPaidAndDiscountStock(orderId, req.body?.data?.id);
    return res.status(200).json({ ok: true });
  },
  whatsappRedirectData: async (req: Request, res: Response) => {
    const order = await ordersService.getById(String(req.params.id));
    const message = buildOrderMessage({
      orderNumber: order.order_number,
      status: order.status,
      total: Number(order.total),
      items: order.order_items.map((i: any) => ({
        name: i.product.name,
        quantity: i.quantity,
        subtotal: Number(i.subtotal)
      }))
    });
    return res.json({ whatsapp_url: createWhatsAppUrl(env.WHATSAPP_PHONE, message) });
  }
};
