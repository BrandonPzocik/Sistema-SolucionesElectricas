import type { Request, Response } from "express";
import { productsService } from "../modules/products/products.service.js";
import { ProductStockUpdateSchema, ProductUpsertSchema } from "../modules/products/products.schemas.js";

export const productsController = {
  list: async (_req: Request, res: Response) => {
    const data = await productsService.list();
    res.json(data);
  },
  get: async (req: Request, res: Response) => {
    const data = await productsService.getBySlug(req.params.slug);
    res.json(data);
  },
  create: async (req: Request, res: Response) => {
    const payload = ProductUpsertSchema.parse(req.body);
    const data = await productsService.create(payload);
    res.status(201).json(data);
  },
  update: async (req: Request, res: Response) => {
    const payload = ProductUpsertSchema.partial().parse(req.body);
    const data = await productsService.update(req.params.id, payload);
    res.json(data);
  },
  remove: async (req: Request, res: Response) => {
    await productsService.remove(req.params.id);
    res.status(204).send();
  },
  updateStock: async (req: Request, res: Response) => {
    const payload = ProductStockUpdateSchema.parse(req.body);
    const data = await productsService.updateStock(req.params.id, payload);
    res.json(data);
  }
};
