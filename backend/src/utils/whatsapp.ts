export const createWhatsAppUrl = (phone: string, message: string) => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const buildOrderMessage = (payload: {
  orderNumber: string;
  status: string;
  total: number;
  items: Array<{ name: string; quantity: number; subtotal: number }>;
}) => {
  const lines = payload.items.map(
    (item) => `• ${item.name} x${item.quantity} = $${item.subtotal.toFixed(2)}`
  );
  return [
    `Pedido #${payload.orderNumber}`,
    `Estado: ${payload.status}`,
    "Detalle:",
    ...lines,
    `Total: $${payload.total.toFixed(2)}`
  ].join("\n");
};
