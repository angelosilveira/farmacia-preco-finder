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
  contato?: string; // Número de WhatsApp do representante
}

export const REPRESENTANTES: Representante[] = [
  {
    nome: "CIRLANE RECOMED",
    categorias: ["Medicamentos"],
    contato: "5577981130802",
  },
  {
    nome: "LUIS TOTAL",
    categorias: ["Medicamentos"],
    contato: "5577988100406",
  },
  {
    nome: "VINICIUS RD",
    categorias: ["Medicamentos"],
    contato: "77988718274",
  },
  {
    nome: "EDUARDO DPC",
    categorias: ["Medicamentos"],
    contato: "5577999381140",
  },
  {
    nome: "SILVANEIDE CINTRAFARMA",
    categorias: ["Medicamentos"],
    contato: "5575998412137",
  },
  {
    nome: "LAZARO GERMED",
    categorias: ["Medicamentos"],
    contato: "5577981161674",
  },
];
