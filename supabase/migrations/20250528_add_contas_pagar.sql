-- Tabela de categorias de despesas (caso não exista)
create table if not exists categorias_despesa (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  created_at timestamp with time zone default now() not null
);

-- Tabela de fornecedores (caso não exista)
create table if not exists fornecedores (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  contato text,
  email text,
  created_at timestamp with time zone default now() not null
);

-- Tabela de contas a pagar
create table contas_pagar (
  id uuid default gen_random_uuid() primary key,
  descricao text not null,
  fornecedor_id uuid references fornecedores(id),
  categoria_id uuid references categorias_despesa(id),
  valor_total numeric(10,2) not null,
  data_vencimento date not null,
  data_emissao date not null,
  forma_pagamento text not null,
  parcelado boolean default false,
  numero_parcelas int,
  status text default 'em_aberto', -- em_aberto, pago, atrasado
  observacoes text,
  valor_pago numeric(10,2),
  data_pagamento date,
  comprovante_url text,
  created_at timestamp with time zone default now() not null
);
