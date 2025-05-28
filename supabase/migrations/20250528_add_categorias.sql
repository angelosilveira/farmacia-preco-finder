-- Create a table for storing categorias
create table categorias (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  created_at timestamp with time zone default now() not null
);

-- Create an index for faster searches by nome
create index categorias_nome_idx on categorias(nome);

-- Enable Row Level Security (RLS)
alter table categorias enable row level security;

-- Create a policy that allows all operations for all users (including anonymous)
create policy "Enable all operations for all users" on categorias
  for all
  to anon, authenticated
  using (true)
  with check (true);
