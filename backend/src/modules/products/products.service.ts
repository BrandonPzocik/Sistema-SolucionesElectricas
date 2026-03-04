import type { z } from "zod";
import type { ProductUpsertSchema, ProductStockUpdateSchema } from "./products.schemas.js";
import { pool } from "../../services/mysql.js";

export const productsService = {
  list: async () => {
    const [rows] = await pool.query("SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC");
    return rows;
  },
  getBySlug: async (slug: string) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE slug = ? LIMIT 1", [slug]);
    const product = (rows as any[])[0];
    if (!product) throw new Error("Producto no encontrado");
    return product;
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
      return (rows as any[])[0];
    }

    const updates = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (payload as any)[field]);
    await pool.query(`UPDATE products SET ${updates}, updated_at = NOW() WHERE id = ?`, [...values, id]);

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0];
  },
  remove: async (id: string) => {
    await pool.query("UPDATE products SET is_active = 0, updated_at = NOW() WHERE id = ?", [id]);
  },
  updateStock: async (id: string, payload: z.infer<typeof ProductStockUpdateSchema>) => {
    await pool.query("UPDATE products SET stock = ?, min_stock = COALESCE(?, min_stock), updated_at = NOW() WHERE id = ?", [payload.stock, payload.min_stock ?? null, id]);
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0];
  }
};
