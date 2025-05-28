-- Criar tabela de fechamentos de caixa
create table fechamentos_caixa (
  id uuid default gen_random_uuid() primary key,
  valor_inicial numeric(10,2) not null,
  dinheiro numeric(10,2) not null,
  pix numeric(10,2) not null,
  cartao_credito numeric(10,2) not null,
  cartao_debito numeric(10,2) not null,
  total numeric(10,2) not null,
  diferenca numeric(10,2) not null,
  observacoes text,
  data_fechamento timestamp with time zone not null,
  created_at timestamp with time zone default now() not null
);

-- Create an index for faster searches by data_fechamento
create index fechamentos_caixa_data_idx on fechamentos_caixa(data_fechamento);

-- Enable Row Level Security (RLS)
alter table fechamentos_caixa enable row level security;

-- Create a policy that allows all operations for all users (including anonymous)
create policy "Enable all operations for all users" on fechamentos_caixa
  for all
  to anon, authenticated
  using (true)
  with check (true);
