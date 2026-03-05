create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null,
  precio numeric not null,
  imagen text not null,
  stock integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null,
  imagen text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);
