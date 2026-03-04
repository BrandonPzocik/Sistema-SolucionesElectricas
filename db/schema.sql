-- Core tables
create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,
  technical_specs text not null,
  image_url text not null,
  price numeric(12,2) not null check (price > 0),
  stock int not null check (stock >= 0),
  min_stock int not null default 0 check (min_stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  status text not null default 'pending',
  payment_method text not null,
  payment_status text not null default 'pending',
  external_payment_id text,
  total numeric(12,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  subtotal numeric(12,2) not null
);

create table if not exists stock_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  current_stock int not null,
  min_stock int not null,
  created_at timestamptz not null default now(),
  resolved boolean not null default false
);

-- Generate friendly order number
create or replace function generate_order_number() returns text language sql as $$
  select 'SE-' || to_char(now(), 'YYYYMMDD') || '-' || substring(gen_random_uuid()::text from 1 for 8);
$$;

-- Validate stock and create pending order atomically
create or replace function create_order_with_validation(p_payment_method text, p_items jsonb)
returns jsonb
language plpgsql
as $$
declare
  item_record jsonb;
  v_product products%rowtype;
  v_order_id uuid;
  v_order_number text;
  v_total numeric(12,2) := 0;
  v_qty int;
begin
  v_order_number := generate_order_number();

  insert into orders (order_number, payment_method, total)
  values (v_order_number, p_payment_method, 0)
  returning id into v_order_id;

  for item_record in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (item_record->>'quantity')::int;

    select * into v_product
    from products
    where id = (item_record->>'product_id')::uuid
    for update;

    if not found then
      raise exception 'Producto inexistente';
    end if;

    if v_product.stock < v_qty then
      raise exception 'Stock insuficiente para %', v_product.name;
    end if;

    insert into order_items(order_id, product_id, quantity, unit_price, subtotal)
    values (v_order_id, v_product.id, v_qty, v_product.price, v_product.price * v_qty);

    v_total := v_total + (v_product.price * v_qty);
  end loop;

  update orders set total = v_total where id = v_order_id;

  return (
    select jsonb_build_object(
      'id', o.id,
      'order_number', o.order_number,
      'total', o.total,
      'items', jsonb_agg(jsonb_build_object(
        'product_id', oi.product_id,
        'name', p.name,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'subtotal', oi.subtotal
      ))
    )
    from orders o
    join order_items oi on oi.order_id = o.id
    join products p on p.id = oi.product_id
    where o.id = v_order_id
    group by o.id
  );
end;
$$;

-- Confirm payment and discount stock atomically
create or replace function confirm_order_payment(p_order_id uuid, p_external_payment_id text)
returns jsonb
language plpgsql
as $$
declare
  v_item record;
  v_product products%rowtype;
begin
  for v_item in select * from order_items where order_id = p_order_id
  loop
    select * into v_product from products where id = v_item.product_id for update;

    if v_product.stock < v_item.quantity then
      raise exception 'Stock insuficiente al confirmar pago';
    end if;

    update products
    set stock = stock - v_item.quantity,
        updated_at = now()
    where id = v_item.product_id;

    insert into stock_alerts(product_id, current_stock, min_stock)
    select p.id, p.stock, p.min_stock
    from products p
    where p.id = v_item.product_id and p.stock <= p.min_stock;
  end loop;

  update orders
  set status = 'paid',
      payment_status = 'approved',
      external_payment_id = p_external_payment_id,
      updated_at = now()
  where id = p_order_id;

  return jsonb_build_object('ok', true);
end;
$$;

-- Dashboard RPCs
create or replace function dashboard_sales_summary()
returns table(total_orders bigint, paid_orders bigint, gross_revenue numeric)
language sql
as $$
  select
    count(*) as total_orders,
    count(*) filter (where payment_status = 'approved') as paid_orders,
    coalesce(sum(total) filter (where payment_status = 'approved'), 0) as gross_revenue
  from orders;
$$;

create or replace function dashboard_top_products()
returns table(product_id uuid, name text, units_sold bigint)
language sql
as $$
  select p.id, p.name, coalesce(sum(oi.quantity), 0)::bigint as units_sold
  from products p
  left join order_items oi on oi.product_id = p.id
  left join orders o on o.id = oi.order_id and o.payment_status = 'approved'
  group by p.id, p.name
  order by units_sold desc
  limit 10;
$$;
