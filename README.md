# Sistema Soluciones Eléctricas - E-commerce simplificado (MySQL + phpMyAdmin)

Versión simplificada para empezar rápido con base SQL clásica (MySQL), compra por carrito y envío del pedido por WhatsApp al dueño para coordinar cobro manual.

## Monorepo

- `frontend/`: SPA React + Vite + Tailwind (catálogo, carrito, checkout y admin).
- `backend/`: API REST en Node.js/TypeScript.
- `shared/`: tipos compartidos y contratos.
- `db/`: scripts SQL para crear estructura y seed en phpMyAdmin.

## Qué queda funcionando ahora

- Catálogo de productos con stock.
- Carrito sin login de cliente.
- Checkout simple.
- Compra en efectivo (`cash`) con link automático a WhatsApp para avisar al dueño.
- Panel admin con login por contraseña.
- Seed de productos de ejemplo.

> Usuario admin: contraseña inicial `admin123`.

## Quick start

### 1) Base de datos (phpMyAdmin)

1. Crear una base MySQL (si no existe).
2. Ejecutar `db/schema.sql`.
3. Ejecutar `db/seed.sql`.

### 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Variables del backend (`backend/.env`)

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `WHATSAPP_PHONE`
- `ADMIN_JWT_SECRET`
- `ADMIN_PASSWORD_HASH` (por defecto: `admin123`)

## Flujo de compra actual

1. Frontend envía orden a `POST /api/orders` con `payment_method: "cash"`.
2. Backend valida stock y registra orden en MySQL.
3. Backend devuelve `whatsapp_url` con el detalle del pedido.
4. Cliente abre WhatsApp y envía el mensaje al dueño para coordinar cobro.
