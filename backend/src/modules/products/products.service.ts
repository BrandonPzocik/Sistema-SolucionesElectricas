import type { z } from "zod";
import type { ProductUpsertSchema, ProductStockUpdateSchema } from "./products.schemas.js";
import { pool } from "../../services/mysql.js";

const normalizeProduct = (product: any) => ({
  ...product,
  price: Number(product?.price ?? 0),
  stock: Number(product?.stock ?? 0),
  min_stock: Number(product?.min_stock ?? 0),
  is_active: Number(product?.is_active ?? 1)
});

const getProductColumns = async () => {
  const [cols] = await pool.query("SHOW COLUMNS FROM products");
  return new Set((cols as any[]).map((c) => String(c.Field)));
};

export const productsService = {
  list: async () => {
    try {
      const columns = await getProductColumns();
      const where = columns.has("is_active") ? " WHERE is_active = 1" : "";

      let orderBy = "";
      if (columns.has("created_at")) orderBy = " ORDER BY created_at DESC";
      else if (columns.has("id")) orderBy = " ORDER BY id DESC";

      const [rows] = await pool.query(`SELECT * FROM products${where}${orderBy}`);
      return (rows as any[]).map(normalizeProduct);
    } catch (error: any) {
      if (error?.code === "ER_NO_SUCH_TABLE") return [];
      throw error;
    }
  },
  getBySlug: async (slug: string) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE slug = ? LIMIT 1", [slug]);
    const product = (rows as any[])[0];
    if (!product) throw new Error("Producto no encontrado");
    return normalizeProduct(product);
  },
  create: async (payload: z.infer<typeof ProductUpsertSchema>) => {
    await pool.query(
      `INSERT INTO products (id, name, slug, description, technical_specs, image_url, price, stock, min_stock, is_active)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        payload.name,
        payload.slug,
        payload.description,
        payload.technical_specs,
        payload.image_url,
        payload.price,
        payload.stock,
        payload.min_stock
      ]
    );

    return productsService.getBySlug(payload.slug);
  },
  update: async (id: string, payload: Partial<z.infer<typeof ProductUpsertSchema>>) => {
    const fields = Object.keys(payload);
    if (fields.length === 0) {
      const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
      return normalizeProduct((rows as any[])[0]);
    }

    const updates = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (payload as any)[field]);
    await pool.query(`UPDATE products SET ${updates}, updated_at = NOW() WHERE id = ?`, [...values, id]);

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    return normalizeProduct((rows as any[])[0]);
  },
  remove: async (id: string) => {
    await pool.query("UPDATE products SET is_active = 0, updated_at = NOW() WHERE id = ?", [id]);
  },
  updateStock: async (id: string, payload: z.infer<typeof ProductStockUpdateSchema>) => {
    await pool.query("UPDATE products SET stock = ?, min_stock = COALESCE(?, min_stock), updated_at = NOW() WHERE id = ?", [payload.stock, payload.min_stock ?? null, id]);
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    return normalizeProduct((rows as any[])[0]);
  }
};
