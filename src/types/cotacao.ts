import { CategoriaType } from "./categorias";

/** Representa um produto com cotação de preço */
export interface Produto {
  /** UUID v4 único para identificar o produto */
  id: string;
  /** Nome do produto */
  nome: string;
  /** Categoria do produto */
  categoria: CategoriaType;
  /** Preço unitário do produto */
  precoUnitario: number;
  /** Quantidade do produto */
  quantidade: number;
  /** Unidade de medida (ex: Comprimido, ml, etc) */
  unidadeMedida: string;
  /** Preço total (precoUnitario * quantidade) */
  precoTotal: number;
  /** Nome do representante */
  representante: string;
  /** Data da última atualização */
  dataAtualizacao: Date;
}

export interface MelhorPreco {
  nome: string;
  menorPreco: number;
  representante: string;
  unidadeMedida: string;
}
