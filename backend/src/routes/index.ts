import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { ordersController } from "../controllers/orders.controller.js";
import { paymentsController } from "../controllers/payments.controller.js";
import { adminController } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));

router.get("/products", asyncHandler(productsController.list));
router.get("/products/:slug", asyncHandler(productsController.get));

router.post("/orders", asyncHandler(ordersController.create));

router.post("/payments/webhook", asyncHandler(paymentsController.webhook));
router.get("/payments/orders/:id/whatsapp", asyncHandler(paymentsController.whatsappRedirectData));

router.post("/admin/login", asyncHandler(adminController.login));
router.get("/admin/dashboard", requireAdmin, asyncHandler(adminController.dashboard));
router.post("/admin/products", requireAdmin, asyncHandler(productsController.create));
router.patch("/admin/products/:id", requireAdmin, asyncHandler(productsController.update));
router.patch("/admin/products/:id/stock", requireAdmin, asyncHandler(productsController.updateStock));
router.delete("/admin/products/:id", requireAdmin, asyncHandler(productsController.remove));
