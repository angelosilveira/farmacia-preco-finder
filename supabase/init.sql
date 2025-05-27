-- Create a table for storing produtos
create table produtos (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  categoria text not null,
  "precoUnitario" numeric(10,2) not null,
  quantidade integer not null,
  "unidadeMedida" text not null,
  "precoTotal" numeric(10,2) not null,
  representante text not null,
  "dataAtualizacao" timestamp with time zone not null default now(),
  created_at timestamp with time zone default now() not null,
  -- Add a constraint to ensure precoTotal equals precoUnitario * quantidade
  constraint preco_total_check check ("precoTotal" = "precoUnitario" * quantidade)
);

-- Create an index for faster searches by nome
create index produtos_nome_idx on produtos(nome);

-- Create an index for faster searches by categoria
create index produtos_categoria_idx on produtos(categoria);

-- Create an index for faster searches by representante
create index produtos_representante_idx on produtos(representante);

-- Enable Row Level Security (RLS)
alter table produtos enable row level security;

-- Create a policy that allows all operations for all users (including anonymous)
create policy "Enable all operations for all users" on produtos
  for all
  to anon, authenticated
  using (true)
  with check (true);
