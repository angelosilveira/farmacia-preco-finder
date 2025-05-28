-- Add responsavel field to fechamentos_caixa table
ALTER TABLE fechamentos_caixa
ADD COLUMN responsavel uuid REFERENCES auth.users(id) NOT NULL;
