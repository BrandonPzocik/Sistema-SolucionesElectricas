import { supabase } from "../../services/supabase.js";

export const ordersService = {
  createPending: async (payload: { payment_method: string; items: Array<{ product_id: string; quantity: number }> }) => {
    const { data, error } = await supabase.rpc("create_order_with_validation", {
      p_payment_method: payload.payment_method,
      p_items: payload.items
    });
    if (error) throw error;
    return data;
  },
  markPaidAndDiscountStock: async (orderId: string, externalPaymentId?: string) => {
    const { data, error } = await supabase.rpc("confirm_order_payment", {
      p_order_id: orderId,
      p_external_payment_id: externalPaymentId ?? null
    });
    if (error) throw error;
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, status, total, order_items(quantity, unit_price, subtotal, product:products(name))")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }
};
