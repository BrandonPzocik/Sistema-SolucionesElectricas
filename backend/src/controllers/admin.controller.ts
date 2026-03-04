import type { Request, Response } from "express";
import { z } from "zod";
import { adminService } from "../modules/admin/admin.service.js";
import { supabase } from "../services/supabase.js";

const LoginSchema = z.object({ password: z.string().min(1) });

export const adminController = {
  login: async (req: Request, res: Response) => {
    const { password } = LoginSchema.parse(req.body);
    const token = adminService.login(password);
    res.json({ token });
  },
  dashboard: async (_req: Request, res: Response) => {
    const [{ data: sales }, { data: topProducts }] = await Promise.all([
      supabase.rpc("dashboard_sales_summary"),
      supabase.rpc("dashboard_top_products")
    ]);
    res.json({ sales, topProducts });
  }
};
