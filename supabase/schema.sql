-- Rode este script no SQL Editor do seu projeto Supabase
-- (Painel do Supabase > SQL Editor > New query > colar e rodar)

-- 1) Tabela de perfis: guarda o nome do usuário vinculado ao auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuário só pode ler/editar o próprio perfil
create policy "Perfil visível para o próprio usuário"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário pode atualizar o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 2) Função + trigger: cria automaticamente um perfil quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3) (Opcional) Tabela de transações, já pronta caso você queira
--    salvar as transações no banco em vez de só na memória do navegador.
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('entrada', 'saida')),
  category text not null,
  amount numeric(12, 2) not null,
  description text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Usuário vê só as próprias transações"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Usuário insere só as próprias transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Usuário atualiza só as próprias transações"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Usuário apaga só as próprias transações"
  on public.transactions for delete
  using (auth.uid() = user_id);
