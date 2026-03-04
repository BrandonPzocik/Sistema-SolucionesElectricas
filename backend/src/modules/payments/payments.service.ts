import { preferenceClient } from "../../services/mercadoPago.js";
import { env } from "../../config/env.js";

export const paymentsService = {
  createPreference: async (payload: { orderId: string; items: Array<{ title: string; quantity: number; unit_price: number }> }) => {
    if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
      throw new Error("Mercado Pago no está configurado. Usá payment_method='cash' por ahora.");
    }

    const result = await preferenceClient.create({
      body: {
        items: payload.items.map((item) => ({ ...item, id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") })),
        external_reference: payload.orderId,
        notification_url: `${env.APP_ORIGIN.replace("5173", "4000")}/api/payments/webhook`,
        back_urls: {
          success: `${env.APP_ORIGIN}/checkout/success`,
          failure: `${env.APP_ORIGIN}/checkout/error`,
          pending: `${env.APP_ORIGIN}/checkout/pending`
        },
        auto_return: "approved"
      }
    });
    return result;
  }
};
