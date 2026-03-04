import { preferenceClient } from "../../services/mercadoPago.js";
import { env } from "../../config/env.js";

export const paymentsService = {
  createPreference: async (payload: { orderId: string; items: Array<{ title: string; quantity: number; unit_price: number }> }) => {
    const result = await preferenceClient.create({
      body: {
        items: payload.items,
        external_reference: payload.orderId,
        notification_url: `${env.BACKEND_ORIGIN}/api/payments/webhook`,
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
