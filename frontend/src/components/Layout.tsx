import { Link, Outlet } from "react-router-dom";
import logo from "../assets/logo-se.svg";

export const Layout = () => (
  <div className="min-h-screen bg-brand-light text-brand-dark">
    <header className="sticky top-0 z-30 border-b border-red-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link className="flex items-center gap-2" to="/">
          <img src={logo} alt="Soluciones Eléctricas" className="h-10 w-10 rounded-md object-cover" />
          <span className="text-sm font-extrabold leading-tight sm:text-base">Soluciones Eléctricas</span>
        </Link>
        <div className="flex gap-2 text-xs sm:text-sm">
          <Link to="/productos" className="rounded-full bg-brand-red px-3 py-2 font-semibold text-white">Productos</Link>
          <Link to="/servicios" className="rounded-full border border-brand-red px-3 py-2 font-semibold text-brand-red">Servicios</Link>
        </div>
      </nav>
    </header>
    <main className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4"><Outlet /></main>
  </div>
);
