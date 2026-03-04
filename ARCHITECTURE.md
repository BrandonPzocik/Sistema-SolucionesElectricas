# Arquitectura escalable propuesta

## Capas

1. **Frontend (React + Tailwind)**
   - UI modular por features (`catalog`, `product`, `cart`, `checkout`, `admin`).
   - Estado local con Zustand para carrito.
   - Data fetching con React Query.
   - SEO básico con `react-helmet-async`.

2. **Backend (Node.js + TypeScript + Express)**
   - API REST bajo `/api`.
   - Módulos por dominio: productos, órdenes, pagos, stock, admin.
   - Middleware de seguridad (helmet, CORS, rate limit).
   - Validación de input con Zod.

3. **DB (Supabase/PostgreSQL)**
   - Tablas normalizadas de productos, órdenes e items.
   - Funciones RPC transaccionales para evitar overselling.
   - Locks `FOR UPDATE` en validación y descuento de stock.

4. **Pagos + Notificaciones**
   - Checkout de Mercado Pago.
   - Webhook de confirmación para estado `approved`.
   - Mensaje dinámico de WhatsApp por pedido.

## Reglas de negocio críticas

- Precio y stock siempre se validan en backend.
- El frontend nunca decide disponibilidad final.
- Descuento de stock solo cuando pago está confirmado.
- Compras simultáneas protegidas con locks transaccionales.
- Alertas cuando stock <= stock mínimo.

## Preparado para escalar

- Separación en módulos para migrar a microservicios.
- Posibilidad de cola para webhooks (BullMQ/SQS).
- Cache de catálogo (Redis) sin romper contratos.
- CDN para imágenes desde Supabase Storage.
