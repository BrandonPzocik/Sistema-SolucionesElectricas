# Soluciones Eléctricas - Catálogo web (React + Supabase + Mercado Pago)

Aplicación mobile-first para mostrar productos y servicios eléctricos, comprar con Mercado Pago o efectivo y continuar la conversación por WhatsApp sin registro de usuario.

## Stack

- Frontend: React + Vite + TailwindCSS
- Backend API: Node + Express + TypeScript
- Base de datos e imágenes: Supabase + Supabase Storage
- Pagos: Mercado Pago Checkout (preferencias)
- Mensajería: links dinámicos de WhatsApp

## Estructura

- `frontend/`: web app con Home, Productos, Servicios, Gracias y `/admin`.
- `backend/`: API para catálogo, panel admin, storage y preferencias de Mercado Pago.
- `db/supabase_schema.sql`: tablas `productos` y `servicios`.

## Variables de entorno

### `backend/.env`

```env
PORT=4000
APP_ORIGIN=http://localhost:5173
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=catalogo
MERCADO_PAGO_ACCESS_TOKEN=
WHATSAPP_PHONE=5491112345678
ADMIN_PANEL_TOKEN=admin-dev-token
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:4000/api
VITE_WHATSAPP_PHONE=5491112345678
VITE_ADMIN_TOKEN=admin-dev-token
VITE_SUPABASE_URL=
```

## Ejecutar

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Flujo de compra

1. Usuario toca **Comprar** desde Productos.
2. El modal ofrece **Mercado Pago** o **Efectivo**.
3. Mercado Pago: frontend llama `POST /api/payments/create-preference` y redirige a `init_point`.
4. Retorno exitoso a `/gracias` con CTA para enviar comprobante por WhatsApp.
5. Efectivo: abre WhatsApp directamente con el resumen del producto.
