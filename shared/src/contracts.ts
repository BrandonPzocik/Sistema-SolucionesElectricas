export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  technical_specs: string;
  price: number;
  stock: number;
  min_stock: number;
  image_url: string;
};

export type OrderCreateRequest = {
  payment_method: "mercado_pago" | "cash";
  items: Array<{ product_id: string; quantity: number }>;
};
