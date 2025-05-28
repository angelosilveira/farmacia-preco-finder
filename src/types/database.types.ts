export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          created_at?: string;
        };
      };
      representantes: {
        Row: {
          id: string;
          nome: string;
          empresa: string;
          telefone: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          empresa: string;
          telefone: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          empresa?: string;
          telefone?: string;
          email?: string;
          created_at?: string;
        };
      };
      produtos: {
        Row: {
          id: string;
          nome: string;
          categoria: string;
          precoUnitario: number;
          quantidade: number;
          unidadeMedida: string;
          precoTotal: number;
          representante: string;
          dataAtualizacao: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          categoria: string;
          precoUnitario: number;
          quantidade: number;
          unidadeMedida: string;
          precoTotal: number;
          representante: string;
          dataAtualizacao: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          categoria?: string;
          precoUnitario?: number;
          quantidade?: number;
          unidadeMedida?: string;
          precoTotal?: number;
          representante?: string;
          dataAtualizacao?: string;
          created_at?: string;
        };
      };
    };
  };
};
