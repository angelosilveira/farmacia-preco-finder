-- Supabase migration for tabela produtos (farmácia)
create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  nome text not null,
  laboratorio text,
  grupo text,
  curva_abc text,
  estoque integer not null default 0,
  preco_compra numeric(12,2) not null default 0,
  preco_custo numeric(12,2) not null default 0,
  preco_venda numeric(12,2) not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create unique index if not exists produtos_codigo_idx on public.produtos (codigo);
create index if not exists produtos_nome_idx on public.produtos (nome);
