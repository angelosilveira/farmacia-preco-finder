-- Create usuarios table
create table usuarios (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text not null unique,
  created_at timestamp with time zone default now() not null
);

-- Create an index for faster searches by email
create index usuarios_email_idx on usuarios(email);

-- Enable Row Level Security (RLS)
alter table usuarios enable row level security;

-- Create a policy that allows all operations for all users (including anonymous)
create policy "Enable all operations for all users" on usuarios
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Insert some sample users
insert into usuarios (nome, email) values
  ('Administrador', 'admin@exemplo.com'),
  ('Operador 1', 'operador1@exemplo.com'),
  ('Operador 2', 'operador2@exemplo.com');
