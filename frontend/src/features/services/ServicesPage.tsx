import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { whatsappUrl } from "../../lib/whatsapp";
import { Servicio } from "../../types";

export const ServicesPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ["servicios"], queryFn: () => api.get<Servicio[]>("/services") });

  if (isLoading) return <p>Cargando servicios...</p>;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Servicios</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data?.map((service) => (
          <article key={service.id} className="rounded-2xl border border-red-100 bg-white p-3 shadow-sm sm:p-4">
            <img src={service.imagen} alt={service.nombre} className="aspect-video w-full rounded-xl object-cover" />
            <h3 className="mt-3 font-bold">{service.nombre}</h3>
            <p className="text-sm text-slate-600">{service.descripcion}</p>
            <a className="mt-3 block rounded-xl bg-brand-red py-3 text-center font-bold text-white" href={whatsappUrl(`Hola, quiero solicitar el servicio: ${service.nombre}. ¿Podemos coordinar?`)}>
              Solicitar por WhatsApp
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};
