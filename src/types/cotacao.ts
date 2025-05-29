import { CategoriaType } from "./categorias";

/** Representa uma cotação da tabela cotacoes */
export interface Cotacao {
  id: string;
  produto_id?: string | null;
  nome: string;
  categoria?: CategoriaType | string;
  preco_unitario: number;
  quantidade: number;
  unidade_medida?: string;
  preco_total: number;
  representante?: string;
  data_atualizacao?: string | Date;
  created_at?: string;
}

/** Representa um produto com cotação de preço (formulário/UI) */
export interface Produto {
  id: string;
  nome: string;
  categoria: CategoriaType;
  precoUnitario: number;
  quantidade: number;
  unidadeMedida: string;
  precoTotal: number;
  representante: string;
  dataAtualizacao: Date;
}

export interface MelhorPreco {
  nome: string;
  menorPreco: number;
  representante: string;
  unidadeMedida: string;
}

/** Utilitário para converter Cotacao (db) para Produto (UI) */
export function cotacaoToProduto(c: Cotacao): Produto {
  return {
    id: c.id,
    nome: c.nome,
    categoria: (c.categoria as CategoriaType) || "Outros",
    precoUnitario: Number(c.preco_unitario),
    quantidade: Number(c.quantidade),
    unidadeMedida: c.unidade_medida || "",
    precoTotal: Number(c.preco_total),
    representante: c.representante || "",
    dataAtualizacao: c.data_atualizacao
      ? new Date(c.data_atualizacao)
      : new Date(),
  };
}

/** Utilitário para converter Produto (UI) para Cotacao (db) */
export function produtoToCotacao(p: Produto): Cotacao {
  return {
    id: p.id,
    nome: p.nome,
    categoria: p.categoria,
    preco_unitario: p.precoUnitario,
    quantidade: p.quantidade,
    unidade_medida: p.unidadeMedida,
    preco_total: p.precoTotal,
    representante: p.representante,
    data_atualizacao: p.dataAtualizacao,
  };
}
