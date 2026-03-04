import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useProducts } from "../../hooks/useProducts";

export const CatalogPage = () => {
  const { data, isLoading } = useProducts();

  if (isLoading) return <p>Cargando productos...</p>;

  return (
    <>
      <Helmet>
        <title>Catálogo | Soluciones Eléctricas</title>
        <meta name="description" content="Compra protectores de tensión, térmicas y disyuntores con stock real." />
      </Helmet>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {data?.map((product: any) => (
          <article key={product.id} className="rounded-xl border bg-white p-3 shadow-sm">
            <img loading="lazy" src={product.image_url} alt={product.name} className="mb-2 aspect-square w-full rounded object-cover" />
            <h2 className="line-clamp-2 text-sm font-semibold">{product.name}</h2>
            <p className="mt-1 text-xs text-slate-500">Stock: {product.stock}</p>
            <p className="mt-1 font-bold text-brand-900">${product.price}</p>
            <Link className="mt-3 block rounded bg-brand-500 px-2 py-2 text-center text-sm text-white" to={`/producto/${product.slug}`}>
              Ver producto
            </Link>
          </article>
        ))}
      </section>
    </>
  );
};
