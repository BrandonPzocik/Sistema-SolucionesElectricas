import type { Request, Response } from "express";
import { z } from "zod";
import { adminService } from "../modules/admin/admin.service.js";
import { pool } from "../services/mysql.js";

const LoginSchema = z.object({ password: z.string().min(1) });

export const adminController = {
  login: async (req: Request, res: Response) => {
    const { password } = LoginSchema.parse(req.body);
    const token = adminService.login(password);
    res.json({ token });
  },
  dashboard: async (_req: Request, res: Response) => {
    try {
      const [salesRows] = await pool.query(
        `SELECT
          COUNT(*) AS total_orders,
          SUM(CASE WHEN payment_status = 'approved' THEN 1 ELSE 0 END) AS paid_orders,
          COALESCE(SUM(CASE WHEN payment_status = 'approved' THEN total ELSE 0 END), 0) AS gross_revenue
         FROM orders`
      );

      const [topRows] = await pool.query(
        `SELECT p.id AS product_id, p.name, COALESCE(SUM(CASE WHEN o.payment_status = 'approved' THEN oi.quantity ELSE 0 END), 0) AS units_sold
         FROM products p
         LEFT JOIN order_items oi ON oi.product_id = p.id
         LEFT JOIN orders o ON o.id = oi.order_id
         GROUP BY p.id, p.name
         ORDER BY units_sold DESC
         LIMIT 10`
      );

      return res.json({ sales: salesRows, topProducts: topRows });
    } catch (error: any) {
      if (error?.code === "ER_NO_SUCH_TABLE" || error?.code === "ER_BAD_FIELD_ERROR") {
        return res.json({
          sales: [{ total_orders: 0, paid_orders: 0, gross_revenue: 0 }],
          topProducts: []
        });
      }
      throw error;
    }
  }
};
