export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  activo: boolean;
  created_at: string;
};

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
  created_at: string;
};
