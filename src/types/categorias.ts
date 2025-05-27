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
    nome: "Medley",
    categorias: ["Medicamentos"],
    contato: "5577988634987",
  },
  {
    nome: "EMS",
    categorias: ["Medicamentos"],
    contato: "5511999999902",
  },
  {
    nome: "Eurofarma",
    categorias: ["Medicamentos"],
    contato: "5511999999903",
  },
  {
    nome: "Germed",
    categorias: ["Medicamentos"],
    contato: "5511999999904",
  },
  {
    nome: "Neo Química",
    categorias: ["Medicamentos"],
    contato: "5511999999905",
  },
  {
    nome: "Sanofi",
    categorias: ["Medicamentos", "Dermocosméticos"],
    contato: "5511999999906",
  },
  {
    nome: "Bayer",
    categorias: ["Medicamentos", "Nutrição"],
    contato: "5511999999907",
  },
  {
    nome: "L'Oréal",
    categorias: ["Cosméticos", "Perfumaria"],
    contato: "5511999999908",
  },
  {
    nome: "Avon",
    categorias: ["Cosméticos", "Perfumaria", "Higiene Pessoal"],
    contato: "5511999999909",
  },
  {
    nome: "Natura",
    categorias: ["Cosméticos", "Perfumaria", "Higiene Pessoal"],
    contato: "5511999999910",
  },
  {
    nome: "Boticário",
    categorias: ["Cosméticos", "Perfumaria", "Higiene Pessoal"],
    contato: "5511999999911",
  },
  {
    nome: "La Roche-Posay",
    categorias: ["Dermocosméticos"],
    contato: "5511999999912",
  },
  {
    nome: "Vichy",
    categorias: ["Dermocosméticos"],
    contato: "5511999999913",
  },
];
