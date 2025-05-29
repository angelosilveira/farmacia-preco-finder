-- Supabase migration para tabela de cotações
create table if not exists public.cotacoes (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid references public.produtos(id) on delete cascade,
  nome text not null, -- nome do produto
  categoria text,
  preco_unitario numeric(12,2) not null,
  quantidade integer not null default 1,
  unidade_medida text,
  preco_total numeric(12,2) not null,
  representante text,
  data_atualizacao timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create index if not exists cotacoes_produto_id_idx on public.cotacoes (produto_id);
create index if not exists cotacoes_nome_idx on public.cotacoes (nome);
create index if not exists cotacoes_representante_idx on public.cotacoes (representante);
