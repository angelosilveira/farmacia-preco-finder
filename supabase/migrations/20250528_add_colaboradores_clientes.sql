-- Create colaboradores table
create table colaboradores (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text unique,
  telefone text,
  cargo text not null,
  data_admissao date not null,
  status boolean default true,
  created_at timestamp with time zone default now() not null
);

-- Create clientes table
create table clientes (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  telefone text not null,
  email text,
  cpf text unique,
  endereco text,
  ultima_compra timestamp with time zone,
  status_pagamento text default 'em_dia',
  observacoes text,
  saldo_devedor numeric(10,2) default 0,
  created_at timestamp with time zone default now() not null
);

-- Permitir email NULL e garantir que não haja valores vazios duplicados
ALTER TABLE colaboradores ALTER COLUMN email DROP NOT NULL;
UPDATE colaboradores SET email = NULL WHERE email = '';
