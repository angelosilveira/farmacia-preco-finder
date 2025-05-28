export type Colaborador = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cargo: string;
  data_admissao: string;
  status: boolean;
  created_at: string;
};
