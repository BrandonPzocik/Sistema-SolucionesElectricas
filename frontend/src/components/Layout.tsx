import { Link, Outlet } from "react-router-dom";

export const Layout = () => (
  <div className="min-h-screen bg-slate-100 text-[#111111]">
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link className="text-lg font-bold" to="/">Soluciones Eléctricas</Link>
        <div className="flex gap-2 text-sm">
          <Link to="/productos" className="rounded-full bg-[#FFC107] px-3 py-2 font-semibold">Productos</Link>
          <Link to="/servicios" className="rounded-full border px-3 py-2 font-semibold">Servicios</Link>
        </div>
      </nav>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-4"><Outlet /></main>
  </div>
);
