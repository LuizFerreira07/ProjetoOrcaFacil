# Minhas Finanças

App de controle financeiro pessoal feito em React + Vite + Tailwind CSS, com
cadastro/login integrado ao Supabase (Postgres + Auth).

## Como configurar o banco de dados (Supabase)

1. Crie uma conta grátis em [supabase.com](https://supabase.com) e crie um novo projeto.
2. No painel do projeto, vá em **SQL Editor > New query**, cole o conteúdo do
   arquivo [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.
   Isso cria a tabela `profiles` (nome de cada usuário) e já deixa pronta uma
   tabela `transactions`, ambas com as políticas de segurança (RLS) corretas.
3. Vá em **Project Settings > API** e copie a **Project URL** e a chave
   **anon public**.
4. Na raiz do projeto, copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   e preencha com os valores copiados:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-public
   ```
5. (Opcional, recomendado para testar rápido) Em **Authentication > Providers > Email**,
   desative a exigência de confirmação por e-mail, assim o cadastro já loga
   direto sem precisar clicar em um link de confirmação.

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois abra o endereço que aparecer no terminal (geralmente `http://localhost:5173`).
Clique em **"Cadastre-se"** na tela de login para criar uma conta nova — os
dados vão direto para o seu projeto Supabase.

## Estrutura

- `src/App.jsx` — todo o app (login, cadastro, tela inicial, nova transação)
- `src/lib/supabaseClient.js` — cliente do Supabase (lê as variáveis do `.env`)
- `src/main.jsx` — ponto de entrada do React
- `src/index.css` — estilos base (Tailwind)
- `supabase/schema.sql` — script que cria as tabelas e permissões no Supabase

## Tecnologias

- React
- Vite
- Tailwind CSS
- lucide-react (ícones)
- Supabase (Postgres + Auth)
