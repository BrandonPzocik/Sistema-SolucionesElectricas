import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useLocation } from "react-router-dom";
import { api } from "../../lib/api";
import { Producto, Servicio } from "../../types";

const token = import.meta.env.VITE_ADMIN_TOKEN ?? "";

type ProductFormState = {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  imagen: string;
  activo: boolean;
};

type ServiceFormState = {
  nombre: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
};

const initialProductForm: ProductFormState = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: "",
  activo: true
};

const initialServiceForm: ServiceFormState = {
  nombre: "",
  descripcion: "",
  imagen: "",
  activo: true
};

const isValidHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const AdminPage = () => {
  const location = useLocation();
  const isServicesRoute = location.pathname === "/admin/services";
  const queryClient = useQueryClient();

  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(initialServiceForm);
  const [feedback, setFeedback] = useState<string>("");

  const headers = useMemo(() => ({ "x-admin-token": token }), []);

  const { data: products } = useQuery({ queryKey: ["admin-products"], queryFn: () => api.get<Producto[]>("/admin/products", headers) });
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: () => api.get<Servicio[]>("/admin/services", headers) });

  const createProduct = useMutation({
    mutationFn: () =>
      api.post("/admin/products", {
        ...productForm,
        precio: Number(productForm.precio),
        stock: Number(productForm.stock)
      }, headers),
    onSuccess: () => {
      setProductForm(initialProductForm);
      setFeedback("Producto guardado correctamente.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: Error) => setFeedback(error.message)
  });

  const createService = useMutation({
    mutationFn: () => api.post("/admin/services", serviceForm, headers),
    onSuccess: () => {
      setServiceForm(initialServiceForm);
      setFeedback("Servicio guardado correctamente.");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    },
    onError: (error: Error) => setFeedback(error.message)
  });

  const removeProduct = async (id: string) => {
    await api.delete(`/admin/products/${id}`, headers);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const removeService = async (id: string) => {
    await api.delete(`/admin/services/${id}`, headers);
    queryClient.invalidateQueries({ queryKey: ["admin-services"] });
  };

  const uploadImage = async (file: File, target: "product" | "service") => {
    const signed = await api.post<{ token: string; path: string; publicUrl: string }>("/admin/storage/upload-url", { fileName: file.name, contentType: file.type }, headers);
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable/sign/${signed.path}?token=${signed.token}`, {
      method: "PUT",
      headers: { "Content-Type": file.type, "x-upsert": "true" },
      body: file
    });

    if (!response.ok) {
      throw new Error("No se pudo subir la imagen a Supabase Storage");
    }

    if (target === "product") {
      setProductForm((prev) => ({ ...prev, imagen: signed.publicUrl }));
      setFeedback("Imagen de producto cargada.");
    } else {
      setServiceForm((prev) => ({ ...prev, imagen: signed.publicUrl }));
      setFeedback("Imagen de servicio cargada.");
    }
  };

  if (!token) return <Navigate to="/" replace />;

  const productValidationError = (() => {
    if (productForm.nombre.trim().length < 2) return "El nombre del producto debe tener al menos 2 caracteres.";
    if (productForm.descripcion.trim().length < 5) return "La descripción del producto debe tener al menos 5 caracteres.";
    if (!productForm.precio || Number(productForm.precio) <= 0) return "Ingresá un precio válido mayor a 0.";
    if (productForm.stock === "" || Number(productForm.stock) < 0) return "Ingresá un stock válido (0 o mayor).";
    if (!isValidHttpUrl(productForm.imagen)) return "Debés subir una imagen válida antes de guardar el producto.";
    return "";
  })();

  const serviceValidationError = (() => {
    if (serviceForm.nombre.trim().length < 2) return "El nombre del servicio debe tener al menos 2 caracteres.";
    if (serviceForm.descripcion.trim().length < 5) return "La descripción del servicio debe tener al menos 5 caracteres.";
    if (!isValidHttpUrl(serviceForm.imagen)) return "Debés subir una imagen válida antes de guardar el servicio.";
    return "";
  })();

  const submitProduct = (e: FormEvent) => {
    e.preventDefault();
    if (productValidationError) {
      setFeedback(productValidationError);
      return;
    }

    setFeedback("");
    createProduct.mutate();
  };

  const submitService = (e: FormEvent) => {
    e.preventDefault();
    if (serviceValidationError) {
      setFeedback(serviceValidationError);
      return;
    }

    setFeedback("");
    createService.mutate();
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Panel administrador</h2>

      <div className="flex gap-2 text-sm">
        <Link to="/admin" className={`rounded-full px-4 py-2 font-semibold ${!isServicesRoute ? "bg-[#111111] text-white" : "border"}`}>
          Productos
        </Link>
        <Link to="/admin/services" className={`rounded-full px-4 py-2 font-semibold ${isServicesRoute ? "bg-[#111111] text-white" : "border"}`}>
          Servicios
        </Link>
      </div>

      {feedback ? <p className="rounded-xl bg-white p-3 text-sm">{feedback}</p> : null}

      {!isServicesRoute ? (
        <>
          <form onSubmit={submitProduct} className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm">
            <input className="rounded border p-2" placeholder="Nombre" value={productForm.nombre} onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })} required />
            <textarea className="rounded border p-2" placeholder="Descripción" value={productForm.descripcion} onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })} required />
            <input className="rounded border p-2" type="number" placeholder="Precio" value={productForm.precio} onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })} min={1} required />
            <input className="rounded border p-2" type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} min={0} required />
            <input className="rounded border p-2" type="file" accept="image/*" onChange={async (e) => e.target.files?.[0] && (await uploadImage(e.target.files[0], "product"))} />
            <button disabled={createProduct.isPending || !!productValidationError} className="rounded bg-[#FFC107] py-2 font-bold disabled:opacity-60">Agregar producto</button>
          </form>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-bold">Productos ({products?.length ?? 0})</h3>
            {products?.map((product) => (
              <div key={product.id} className="mb-2 flex items-center justify-between rounded border p-2">
                <span>{product.nombre} - ${product.precio} - stock {product.stock}</span>
                <button className="text-red-600" onClick={() => removeProduct(product.id)}>Eliminar</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <form onSubmit={submitService} className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm">
            <input className="rounded border p-2" placeholder="Nombre del servicio" value={serviceForm.nombre} onChange={(e) => setServiceForm({ ...serviceForm, nombre: e.target.value })} required />
            <textarea className="rounded border p-2" placeholder="Descripción" value={serviceForm.descripcion} onChange={(e) => setServiceForm({ ...serviceForm, descripcion: e.target.value })} required />
            <input className="rounded border p-2" type="file" accept="image/*" onChange={async (e) => e.target.files?.[0] && (await uploadImage(e.target.files[0], "service"))} />
            <button disabled={createService.isPending || !!serviceValidationError} className="rounded bg-[#FFC107] py-2 font-bold disabled:opacity-60">Agregar servicio</button>
          </form>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-bold">Servicios ({services?.length ?? 0})</h3>
            {services?.map((service) => (
              <div key={service.id} className="mb-2 flex items-center justify-between rounded border p-2">
                <span>{service.nombre}</span>
                <button className="text-red-600" onClick={() => removeService(service.id)}>Eliminar</button>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
