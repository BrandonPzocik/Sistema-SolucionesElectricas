# Sistema Soluciones Eléctricas - E-commerce escalable

Arquitectura completa para un e-commerce moderno (mobile-first) de productos eléctricos con React + Tailwind en frontend, Node.js + TypeScript en backend, Supabase/PostgreSQL, Mercado Pago, WhatsApp y panel de administración privado.

## Monorepo

- `frontend/`: SPA React + Vite + Tailwind, catálogo, carrito, checkout, admin.
- `backend/`: API REST en Node.js/TypeScript con módulos de productos, órdenes, stock, pagos y admin.
- `shared/`: tipos compartidos y contratos de API.
- `db/`: schema SQL, triggers y funciones transaccionales para stock en tiempo real.

## Características implementadas en la arquitectura

- Catálogo y detalle de producto con stock en tiempo real.
- Carrito sin login de cliente.
- Checkout con Mercado Pago y opción efectivo.
- Webhook para confirmación automática de pago.
- Descuento de stock transaccional al confirmar pago.
- Bloqueo por falta de stock y anti-overselling por concurrencia.
- Redirección automática a WhatsApp con mensaje dinámico.
- Admin privado con token/JWT para CRUD de productos y stock.
- Métricas de ventas e ingresos.
- Seguridad base: Helmet, CORS, rate-limit, validaciones Zod.
- SEO base y lazy loading de imágenes.

## Quick start

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 3) Base de datos

Ejecutar `db/schema.sql` en Supabase SQL Editor.

## Variables clave

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `WHATSAPP_PHONE`
- `ADMIN_JWT_SECRET`
- `ADMIN_PASSWORD_HASH`

## Flujo de orden

1. Frontend valida carrito y crea orden (`POST /api/orders`).
2. Backend valida stock y precio desde DB.
3. Si método MP: crea preferencia y devuelve `init_point`.
4. Mercado Pago notifica webhook.
5. Backend confirma pago, ejecuta transacción de descuento de stock.
6. Backend actualiza orden y retorna URL de WhatsApp.
7. Frontend redirige automáticamente al link `wa.me`.
