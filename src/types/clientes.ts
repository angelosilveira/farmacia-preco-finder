export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  cpf: string | null;
  endereco: string | null;
  ultima_compra: string | null;
  status_pagamento: "em_dia" | "atrasado" | "inadimplente";
  observacoes: string | null;
  saldo_devedor: number;
  created_at: string;
};
