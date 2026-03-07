import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { requireAdmin } from "../middleware/auth.js";
import { preferenceClient } from "../services/mercadoPago.js";
import { supabaseAdmin, supabasePublic } from "../services/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const router = Router();

const productSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().min(5),
  precio: z.coerce.number().positive(),
  imagen: z.string().url(),
  stock: z.coerce.number().int().nonnegative(),
  activo: z.boolean().default(true)
});

const serviceSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().min(5),
  imagen: z.string().url(),
  activo: z.boolean().default(true)
});

const ensureBucket = async () => {
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) throw new Error(`No se pudo listar buckets: ${listError.message}`);

  const exists = buckets?.some((bucket) => bucket.name === env.SUPABASE_STORAGE_BUCKET);
  if (exists) return;

  const { error: createError } = await supabaseAdmin.storage.createBucket(env.SUPABASE_STORAGE_BUCKET, {
    public: true,
    fileSizeLimit: "10MB"
  });

  if (createError) throw new Error(`No se pudo crear bucket '${env.SUPABASE_STORAGE_BUCKET}': ${createError.message}`);
};

router.get("/health", (_req, res) => res.json({ ok: true }));

router.get(
  "/products",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabasePublic.from("productos").select("*").eq("activo", true).order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  })
);

router.get(
  "/services",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabasePublic.from("servicios").select("*").eq("activo", true).order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  })
);

router.post(
  "/payments/create-preference",
  asyncHandler(async (req, res) => {
    const schema = z.object({ nombre: z.string(), precio: z.number().positive(), cantidad: z.number().int().positive().default(1) });
    const payload = schema.parse(req.body);

    const preferenceBody = {
      items: [
        {
          id: "producto",
          title: payload.nombre,
          quantity: payload.cantidad,
          unit_price: payload.precio,
          currency_id: "ARS"
        }
      ],
      back_urls: {
        success: `${env.APP_ORIGIN}/gracias?producto=${encodeURIComponent(payload.nombre)}&monto=${payload.precio}`,
        failure: `${env.APP_ORIGIN}/`,
        pending: `${env.APP_ORIGIN}/`
      },
      auto_return: "approved" as const
    };

    const response = await preferenceClient.create({ body: preferenceBody });
    return res.json({ init_point: response.init_point });
  })
);

router.use("/admin", requireAdmin);

router.get(
  "/admin/products",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabaseAdmin.from("productos").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  })
);

router.post(
  "/admin/products",
  asyncHandler(async (req, res) => {
    const payload = productSchema.parse(req.body);
    const { data, error } = await supabaseAdmin.from("productos").insert(payload).select("*").single();
    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(data);
  })
);

router.put(
  "/admin/products/:id",
  asyncHandler(async (req, res) => {
    const payload = productSchema.partial().parse(req.body);
    const { data, error } = await supabaseAdmin.from("productos").update(payload).eq("id", req.params.id).select("*").single();
    if (error) return res.status(400).json({ message: error.message });
    return res.json(data);
  })
);

router.delete(
  "/admin/products/:id",
  asyncHandler(async (req, res) => {
    const { error } = await supabaseAdmin.from("productos").delete().eq("id", req.params.id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).send();
  })
);

router.get(
  "/admin/services",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabaseAdmin.from("servicios").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  })
);

router.post(
  "/admin/services",
  asyncHandler(async (req, res) => {
    const payload = serviceSchema.parse(req.body);
    const { data, error } = await supabaseAdmin.from("servicios").insert(payload).select("*").single();
    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(data);
  })
);

router.put(
  "/admin/services/:id",
  asyncHandler(async (req, res) => {
    const payload = serviceSchema.partial().parse(req.body);
    const { data, error } = await supabaseAdmin.from("servicios").update(payload).eq("id", req.params.id).select("*").single();
    if (error) return res.status(400).json({ message: error.message });
    return res.json(data);
  })
);

router.delete(
  "/admin/services/:id",
  asyncHandler(async (req, res) => {
    const { error } = await supabaseAdmin.from("servicios").delete().eq("id", req.params.id);
    if (error) return res.status(400).json({ message: error.message });
    return res.status(204).send();
  })
);

router.post(
  "/admin/storage/upload-url",
  asyncHandler(async (req, res) => {
    const schema = z.object({ fileName: z.string().min(1), contentType: z.string().min(1) });
    const { fileName } = schema.parse(req.body);

    await ensureBucket();

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `uploads/${Date.now()}-${sanitizedFileName}`;

    const { data, error } = await supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).createSignedUploadUrl(path);
    if (error) return res.status(400).json({ message: error.message });

    const { data: publicData } = supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
    return res.json({
      token: data.token,
      signedUrl: data.signedUrl,
      path,
      bucket: env.SUPABASE_STORAGE_BUCKET,
      publicUrl: publicData.publicUrl
    });
  })
);
