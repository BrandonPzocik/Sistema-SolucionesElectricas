import { useState } from "react";
import { api } from "../../lib/api";
import { useCartStore } from "../cart/cart.store";

export const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const submitOrder = async (payment_method: "mercado_pago" | "cash") => {
    setLoading(true);
    try {
      const response = await api.post("/orders", {
        payment_method,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }

      if (response.data.whatsapp_url) {
        clear();
        window.location.href = response.data.whatsapp_url;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {items.map((item) => (
        <div key={item.product_id} className="rounded border bg-white p-3 text-sm">
          {item.name} x{item.quantity} — ${item.price * item.quantity}
        </div>
      ))}
      <p className="text-lg font-semibold">Total: ${total}</p>
      <div className="flex gap-2">
        <button disabled={loading || items.length === 0} className="rounded bg-brand-500 px-4 py-2 text-white" onClick={() => submitOrder("mercado_pago")}>Pagar con Mercado Pago</button>
        <button disabled={loading || items.length === 0} className="rounded border px-4 py-2" onClick={() => submitOrder("cash")}>Pagar en efectivo</button>
      </div>
    </section>
  );
};
