# Tutorial de Configuração do Supabase

Este guia vai te ajudar a configurar o Supabase para a aplicação Farmácia Preço Finder.

## 1. Criar uma conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project" ou "Sign Up"
3. Você pode se registrar usando sua conta GitHub para maior facilidade

## 2. Criar um novo projeto

1. Após fazer login, clique em "New Project"
2. Preencha as informações do projeto:
   - **Name**: farmacia-preco-finder (ou outro nome de sua preferência)
   - **Database Password**: Crie uma senha forte e guarde-a em local seguro
   - **Region**: Escolha "South America (São Paulo)" para melhor performance no Brasil
   - **Pricing Plan**: Free tier (gratuito)
3. Clique em "Create new project"
4. Aguarde a criação do projeto (pode levar alguns minutos)

## 3. Configurar o Banco de Dados

1. No menu lateral, vá para "SQL Editor"
2. Clique em "New Query"
3. Cole o conteúdo do arquivo `supabase/init.sql` que criamos
4. Clique em "Run" para criar a tabela e configurações

O SQL criará:

- Tabela `produtos` com todos os campos necessários
- Índices para melhor performance
- Configurações de segurança básicas

## 4. Obter as Credenciais

1. No menu lateral, clique em "Project Settings"
2. Na seção "Project Settings", procure por:
   - **Project URL**: Será seu `VITE_SUPABASE_URL`
   - **Project API keys** > **anon public**: Será seu `VITE_SUPABASE_ANON_KEY`

## 5. Configurar as Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env` (se ainda não existir)
2. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_projeto
VITE_SUPABASE_ANON_KEY=sua_chave_anon_public
```

## 6. Verificar a Instalação

1. Certifique-se de que o pacote do Supabase está instalado:

```bash
yarn add @supabase/supabase-js
```

2. Reinicie sua aplicação:

```bash
yarn dev
```

## 7. Testar a Conexão

1. Tente adicionar uma nova cotação através do formulário
2. Verifique no painel do Supabase se os dados estão chegando:
   - Menu lateral > Table Editor > produtos
   - Você deverá ver os registros inseridos

## Estrutura da Tabela

A tabela `produtos` contém os seguintes campos:

- `id`: UUID (gerado automaticamente)
- `nome`: texto (obrigatório)
- `categoria`: texto (obrigatório)
- `preco_unitario`: decimal (obrigatório)
- `quantidade`: inteiro (obrigatório)
- `unidade_medida`: texto (obrigatório)
- `preco_total`: decimal (calculado automaticamente)
- `representante`: texto (obrigatório)
- `data_atualizacao`: timestamp com timezone
- `created_at`: timestamp com timezone

## Solução de Problemas

Se encontrar erros:

1. **Erro de Conexão**

   - Verifique se as variáveis de ambiente estão corretas
   - Confirme se o arquivo `.env` está na raiz do projeto
   - Reinicie o servidor de desenvolvimento

2. **Erro ao Inserir Dados**

   - Verifique o console do navegador para mensagens de erro
   - Confirme se todos os campos obrigatórios estão sendo preenchidos
   - Verifique se o formato dos dados está correto

3. **Dados Não Aparecem**
   - Verifique no Table Editor do Supabase se os dados foram inseridos
   - Confirme se as políticas de segurança (RLS) estão configuradas corretamente

## Próximos Passos

Após a configuração inicial, você pode:

1. Adicionar autenticação de usuários
2. Criar mais políticas de segurança
3. Configurar backup dos dados
4. Adicionar webhooks para notificações
5. Implementar cache para melhor performance

## Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Exemplos de React + Supabase](https://github.com/supabase/supabase/tree/master/examples/user-management/react-user-management)
- [Guia de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
