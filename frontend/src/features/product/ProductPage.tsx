import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useCartStore } from "../cart/cart.store";

export const ProductPage = () => {
  const { slug = "" } = useParams();
  const { data, isLoading } = useProduct(slug);
  const add = useCartStore((s) => s.add);

  if (isLoading) return <p>Cargando producto...</p>;
  if (!data) return <p>Producto no encontrado.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <img src={data.image_url} alt={data.name} className="aspect-square w-full rounded-xl object-cover" />
      <div>
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="mt-2 text-slate-600">{data.description}</p>
        <p className="mt-3 text-sm">Ficha técnica: {data.technical_specs}</p>
        <p className="mt-3 text-lg font-bold">${data.price}</p>
        <p className="text-sm text-slate-500">Stock en tiempo real: {data.stock}</p>
        <button
          disabled={data.stock < 1}
          className="mt-4 rounded bg-brand-500 px-4 py-2 text-white disabled:bg-slate-300"
          onClick={() => add({ product_id: data.id, slug: data.slug, name: data.name, price: data.price })}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};
