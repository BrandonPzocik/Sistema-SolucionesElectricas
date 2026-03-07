import { useSearchParams } from "react-router-dom";
import { whatsappUrl } from "../../lib/whatsapp";

export const GraciasPage = () => {
  const [params] = useSearchParams();
  const producto = params.get("producto") ?? "producto de catálogo";
  const monto = params.get("monto") ?? "a confirmar";

  const message = `Tu pago fue procesado.\n\nProducto comprado: ${producto}\nMonto: ${monto}\n\nTe envío el comprobante para coordinar la entrega.`;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-extrabold">¡Gracias por tu compra!</h1>
      <p className="mt-3">Tu pago fue procesado. Envíanos el comprobante por WhatsApp para coordinar la entrega.</p>
      <a href={whatsappUrl(message)} className="mt-5 inline-block rounded-2xl bg-[#111111] px-5 py-3 font-bold text-white">
        Enviar comprobante por WhatsApp
      </a>
    </section>
  );
};
