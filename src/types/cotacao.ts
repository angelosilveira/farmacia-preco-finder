
export interface Produto {
  id: string;
  nome: string;
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
