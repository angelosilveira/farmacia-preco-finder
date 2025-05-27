import { CategoriaType } from "./categorias";

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
