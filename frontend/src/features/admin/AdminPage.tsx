import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Producto, Servicio } from "../../types";

const token = import.meta.env.VITE_ADMIN_TOKEN ?? "";

export const AdminPage = () => {
  const queryClient = useQueryClient();
  const [productForm, setProductForm] = useState({ nombre: "", descripcion: "", precio: 0, stock: 0, imagen: "", activo: true });

  const headers = useMemo(() => ({ "x-admin-token": token }), []);
  const { data: products } = useQuery({ queryKey: ["admin-products"], queryFn: () => api.get<Producto[]>("/admin/products", headers) });
  const { data: services } = useQuery({ queryKey: ["admin-services"], queryFn: () => api.get<Servicio[]>("/admin/services", headers) });

  const createProduct = useMutation({
    mutationFn: () => api.post("/admin/products", productForm, headers),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] })
  });

  const removeProduct = async (id: string) => {
    await api.delete(`/admin/products/${id}`, headers);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const uploadImage = async (file: File) => {
    const signed = await api.post<{ token: string; path: string; publicUrl: string }>("/admin/storage/upload-url", { fileName: file.name, contentType: file.type }, headers);
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable/sign/${signed.path}?token=${signed.token}`, {
      method: "PUT",
      headers: { "Content-Type": file.type, "x-upsert": "true" },
      body: file
    });

    setProductForm((prev) => ({ ...prev, imagen: signed.publicUrl }));
  };

  if (!token) return <Navigate to="/" replace />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    createProduct.mutate();
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Panel administrador</h2>
      <form onSubmit={submit} className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <input className="rounded border p-2" placeholder="Nombre" onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })} />
        <textarea className="rounded border p-2" placeholder="Descripción" onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })} />
        <input className="rounded border p-2" type="number" placeholder="Precio" onChange={(e) => setProductForm({ ...productForm, precio: Number(e.target.value) })} />
        <input className="rounded border p-2" type="number" placeholder="Stock" onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} />
        <input className="rounded border p-2" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
        <button className="rounded bg-[#FFC107] py-2 font-bold">Agregar producto</button>
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

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="font-bold">Servicios ({services?.length ?? 0})</h3>
        <p className="text-sm text-slate-600">También podés gestionar servicios usando los endpoints /api/admin/services.</p>
      </div>
    </section>
  );
};
