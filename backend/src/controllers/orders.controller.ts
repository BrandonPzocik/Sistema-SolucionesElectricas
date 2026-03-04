import type { Request, Response } from "express";
import { CreateOrderSchema } from "../modules/orders/orders.schemas.js";
import { ordersService } from "../modules/orders/orders.service.js";
import { paymentsService } from "../modules/payments/payments.service.js";
import { env } from "../config/env.js";
import { buildOrderMessage, createWhatsAppUrl } from "../utils/whatsapp.js";

export const ordersController = {
  create: async (req: Request, res: Response) => {
    const payload = CreateOrderSchema.parse(req.body);
    const order = await ordersService.createPending(payload);

    if (payload.payment_method === "cash") {
      const message = buildOrderMessage({
        orderNumber: order.order_number,
        status: "PENDING_CASH",
        total: order.total,
        items: order.items
      });
      return res.status(201).json({ order, whatsapp_url: createWhatsAppUrl(env.WHATSAPP_PHONE, message) });
    }

    const preference = await paymentsService.createPreference({
      orderId: order.id,
      items: order.items.map((item: any) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    });

    return res.status(201).json({ order, checkout_url: preference.init_point, preference_id: preference.id });
  }
};
