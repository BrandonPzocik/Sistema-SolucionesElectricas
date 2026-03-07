import { Link } from "react-router-dom";
import { whatsappUrl } from "../../lib/whatsapp";

export const HomePage = () => (
  <section className="space-y-5 py-6">
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-extrabold">Soluciones Eléctricas</h1>
      <p className="mt-2 text-slate-600">Servicios eléctricos profesionales y venta de productos eléctricos.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link className="rounded-2xl bg-[#FFC107] p-4 text-center font-bold" to="/productos">Ver Productos</Link>
        <Link className="rounded-2xl border p-4 text-center font-bold" to="/servicios">Ver Servicios</Link>
        <a className="rounded-2xl bg-[#111111] p-4 text-center font-bold text-white" href={whatsappUrl("Hola, quiero más información sobre sus servicios eléctricos.")}>Contactar por WhatsApp</a>
      </div>
    </div>
  </section>
);
