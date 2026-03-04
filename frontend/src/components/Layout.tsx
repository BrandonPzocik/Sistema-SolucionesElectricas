import { Link, Outlet } from "react-router-dom";
import { useCartStore } from "../features/cart/cart.store";

export const Layout = () => {
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link className="text-lg font-bold text-brand-900" to="/">Soluciones Eléctricas</Link>
          <Link className="rounded bg-brand-500 px-3 py-2 text-sm text-white" to="/checkout">Carrito ({count})</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4"><Outlet /></main>
    </div>
  );
};
