export type ContaPagar = {
  id: string;
  descricao: string;
  fornecedor_id: string | null;
  categoria_id: string | null;
  valor_total: number;
  data_vencimento: string;
  data_emissao: string;
  forma_pagamento: string;
  parcelado: boolean;
  numero_parcelas?: number | null;
  status: "em_aberto" | "pago" | "atrasado";
  observacoes?: string | null;
  valor_pago?: number | null;
  data_pagamento?: string | null;
  comprovante_url?: string | null;
  created_at: string;
};
