export type CategoriaType =
  | "Medicamentos"
  | "Perfumaria"
  | "Higiene Pessoal"
  | "Cosméticos"
  | "Dermocosméticos"
  | "Nutrição"
  | "Outros";

export interface Representante {
  nome: string;
  categorias: CategoriaType[];
}

export const REPRESENTANTES: Representante[] = [
  {
    nome: "Medley",
    categorias: ["Medicamentos"],
  },
  {
    nome: "EMS",
    categorias: ["Medicamentos"],
  },
  {
    nome: "Eurofarma",
    categorias: ["Medicamentos"],
  },
  {
    nome: "Germed",
    categorias: ["Medicamentos"],
  },
  {
    nome: "Neo Química",
    categorias: ["Medicamentos"],
  },
  {
    nome: "Sanofi",
    categorias: ["Medicamentos", "Dermocosméticos"],
  },
  {
    nome: "Bayer",
    categorias: ["Medicamentos", "Nutrição"],
  },
  {
    nome: "L'Oréal",
    categorias: ["Cosméticos", "Perfumaria"],
  },
  {
    nome: "Avon",
    categorias: ["Cosméticos", "Perfumaria", "Higiene Pessoal"],
  },
  {
    nome: "Natura",
    categorias: ["Cosméticos", "Perfumaria", "Higiene Pessoal"],
  },
  {
    nome: "Boticário",
    categorias: ["Cosméticos", "Perfumaria", "Higiene Pessoal"],
  },
  {
    nome: "La Roche-Posay",
    categorias: ["Dermocosméticos"],
  },
  {
    nome: "Vichy",
    categorias: ["Dermocosméticos"],
  },
];
