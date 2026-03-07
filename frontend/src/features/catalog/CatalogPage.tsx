import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../lib/api";
import { whatsappUrl } from "../../lib/whatsapp";
import { Producto } from "../../types";

type PreferenceResponse = { init_point: string };

export const CatalogPage = () => {
  const [selected, setSelected] = useState<Producto | null>(null);
  const [checkoutError, setCheckoutError] = useState<string>("");
  const { data, isLoading } = useQuery({ queryKey: ["productos"], queryFn: () => api.get<Producto[]>("/products") });

  const buyWithMercadoPago = async (producto: Producto) => {
    setCheckoutError("");
    try {
      const response = await api.post<PreferenceResponse>("/payments/create-preference", {
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });

      if (!response?.init_point) {
        throw new Error("Mercado Pago no devolvió una URL de pago válida.");
      }

      window.location.href = response.init_point;
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar el pago con Mercado Pago.";
      setCheckoutError(message);
    }
  };

  if (isLoading) return <p>Cargando productos...</p>;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Productos</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((product) => (
          <article key={product.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <img src={product.imagen} alt={product.nombre} className="aspect-square w-full rounded-xl object-cover" />
            <h3 className="mt-3 text-lg font-bold">{product.nombre}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.descripcion}</p>
            <p className="mt-2 text-xl font-extrabold text-[#111111]">${product.precio}</p>
            <button className="mt-3 w-full rounded-xl bg-[#FFC107] py-3 font-bold" onClick={() => setSelected(product)}>Comprar</button>
          </article>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <h4 className="text-lg font-bold">Elegir método de pago</h4>
            <p className="mb-4 text-sm text-slate-600">{selected.nombre} - ${selected.precio}</p>
            {checkoutError ? <p className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">{checkoutError}</p> : null}
            <div className="space-y-2">
              <button onClick={() => buyWithMercadoPago(selected)} className="w-full rounded-xl bg-[#111111] py-3 font-semibold text-white">Mercado Pago</button>
              <a href={whatsappUrl(`Hola, quiero comprar el siguiente producto:\n\nProducto: ${selected.nombre}\nPrecio: ${selected.precio}\n\nQuiero pagar en efectivo.`)} className="block w-full rounded-xl border py-3 text-center font-semibold">Efectivo</a>
              <button
                onClick={() => {
                  setCheckoutError("");
                  setSelected(null);
                }}
                className="w-full py-2 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
