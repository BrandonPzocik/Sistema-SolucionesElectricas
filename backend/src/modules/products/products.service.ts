import { supabase } from "../../services/supabase.js";
import type { z } from "zod";
import type { ProductUpsertSchema, ProductStockUpdateSchema } from "./products.schemas.js";

export const productsService = {
  list: async () => {
    const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  getBySlug: async (slug: string) => {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
    if (error) throw error;
    return data;
  },
  create: async (payload: z.infer<typeof ProductUpsertSchema>) => {
    const { data, error } = await supabase.from("products").insert(payload).select("*").single();
    if (error) throw error;
    return data;
  },
  update: async (id: string, payload: Partial<z.infer<typeof ProductUpsertSchema>>) => {
    const { data, error } = await supabase.from("products").update(payload).eq("id", id).select("*").single();
    if (error) throw error;
    return data;
  },
  remove: async (id: string) => {
    const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id);
    if (error) throw error;
  },
  updateStock: async (id: string, payload: z.infer<typeof ProductStockUpdateSchema>) => {
    const { data, error } = await supabase.from("products").update(payload).eq("id", id).select("*").single();
    if (error) throw error;
    return data;
  }
};
