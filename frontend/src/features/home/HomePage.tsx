import { Link } from "react-router-dom";
import logo from "../../assets/logo-se.svg";
import { whatsappUrl } from "../../lib/whatsapp";

export const HomePage = () => (
  <section className="space-y-4 py-4">
    <div className="rounded-3xl border border-red-100 bg-white p-4 shadow-sm sm:p-6">
      <img src={logo} alt="Logo Soluciones Eléctricas" className="mx-auto mb-4 w-36 sm:w-44" />
      <h1 className="text-center text-2xl font-extrabold sm:text-3xl">Soluciones Eléctricas</h1>
      <p className="mt-2 text-center text-sm text-slate-600 sm:text-base">Servicios eléctricos profesionales y venta de productos eléctricos.</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-3">
        <Link className="rounded-2xl bg-brand-red px-4 py-3 text-center font-bold text-white" to="/productos">Ver Productos</Link>
        <Link className="rounded-2xl border border-brand-red px-4 py-3 text-center font-bold text-brand-red" to="/servicios">Ver Servicios</Link>
        <a className="rounded-2xl bg-brand-dark px-4 py-3 text-center font-bold text-white" href={whatsappUrl("Hola, quiero más información sobre sus servicios eléctricos.")}>Contactar por WhatsApp</a>
      </div>
    </div>
  </section>
);
