-- Ejecutar solo si estas tablas aún no existen en el proyecto Supabase.
-- Esta migración no altera perfiles, productos ni pedidos.
create extension if not exists pgcrypto;

create table if not exists public.favoritos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles(id) on delete cascade,
  producto_id text not null,
  created_at timestamptz not null default now(),
  constraint favoritos_usuario_producto_unico unique (usuario_id, producto_id)
);

alter table public.favoritos enable row level security;
drop policy if exists "cliente gestiona sus favoritos" on public.favoritos;
create policy "cliente gestiona sus favoritos" on public.favoritos
for all to authenticated
using (usuario_id = auth.uid())
with check (usuario_id = auth.uid());

create table if not exists public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.perfiles(id) on delete cascade,
  pedido_id uuid references public.pedidos(id) on delete set null,
  estado_anterior text,
  estado_nuevo text,
  mensaje text not null,
  leida boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notificaciones enable row level security;
drop policy if exists "cliente consulta sus notificaciones" on public.notificaciones;
create policy "cliente consulta sus notificaciones" on public.notificaciones
for select to authenticated using (usuario_id = auth.uid() or public.es_admin());
drop policy if exists "cliente marca sus notificaciones" on public.notificaciones;
create policy "cliente marca sus notificaciones" on public.notificaciones
for update to authenticated using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

-- Permite recibir inserts en tiempo real desde la aplicación móvil y la web.
do $$ begin
  alter publication supabase_realtime add table public.notificaciones;
exception when duplicate_object then null;
when undefined_object then null;
end $$;
