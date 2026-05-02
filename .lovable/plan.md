# Fase 1 — MVP frontend (mock, sem backend)

Objetivo: validar fluxo, layout e identidade visual do Portal IEADMI Check-in com baixo custo. Tudo roda em memória (Context + localStorage), sem Supabase, sem auth real, sem edge functions.

## O que será entregue

### Identidade visual
- Tokens HSL no `index.css` reescritos: azul profundo IEADMI como primária, branco/cinza claro como base, **verde apenas em `--success`** para confirmações de check-in.
- Logo enviada copiada para `src/assets/logo-ieadmi.png` e usada em login, sidebar e cabeçalho.
- Cards arredondados, botões grandes, sombras suaves.

### Layout e navegação
- `AppLayout` com sidebar azul profundo (logo + itens: Dashboard, Check-in, Pessoas, Reuniões, Aviso de Privacidade, Sair) e topbar discreta.
- Rotas em `App.tsx`: `/login`, `/dashboard`, `/checkin`, `/pessoas`, `/pessoas/:id`, `/reunioes`, `/privacidade`, fallback `/` redireciona para `/login`.
- "Auth" simulada: ao clicar em Entrar, marca uma flag `ieadmi_logged_in` no localStorage; `ProtectedRoute` simples redireciona para `/login` se não estiver logado. Perfil fixo "Administrador" para o MVP visual.

### Mock store (`src/store/mockStore.tsx`)
- Context React + persistência em `localStorage`.
- Entidades: `pessoas`, `reunioes`, `presencas`.
- Seed inicial com ~8 pessoas e 1 reunião "em andamento" para visualizar o dashboard já populado.
- Ações: addPessoa, updatePessoa, removePessoa, addReuniao, updateReuniao, iniciarReuniao, finalizarReuniao, registrarCheckin (com bloqueio de duplicidade por reunião).

### Telas

**Login (`/login`)**
- Fundo com gradiente azul profundo, card branco centralizado, logo em destaque.
- Campos e-mail e senha (sem validação real), botão "Entrar no Portal".
- Frase "Sistema de presença, acesso e missão".

**Dashboard (`/dashboard`)** — versão simplificada
- Card "Reunião em andamento" (título, horário, local).
- Cards: total de presentes na reunião atual, total de pessoas cadastradas.
- Lista dos últimos 10 check-ins.
- Botão grande "Iniciar Check-in" → vai para `/checkin`.

**Pessoas (`/pessoas`)**
- Tabela com busca por nome/CPF/congregação, filtro por tipo.
- Botão "Nova Pessoa" abre dialog com formulário (nome, CPF, telefone, congregação, cargo, tipo, credencial, status, observações).
- Ações: editar, excluir (com confirmação), ver detalhes.
- CPF exibido completo (perfil mock = Administrador). Função `maskCpf` já criada para uso futuro.

**Detalhes da Pessoa (`/pessoas/:id`)**
- Dados da pessoa + histórico de presença (lista de reuniões em que esteve presente).

**Reuniões (`/reunioes`)**
- Lista com status (agendada / em andamento / finalizada).
- Botão "Nova Reunião" abre dialog (título, data, horário início/fim, local, descrição, pastor responsável).
- Ações: iniciar, finalizar, editar, excluir.
- Garante que apenas uma reunião fica "em andamento" por vez.

**Check-in (`/checkin`)**
- Mostra a reunião em andamento no topo (ou aviso "Nenhuma reunião em andamento").
- Campo de busca com **autofoco**, **debounce 300ms**, busca por nome/CPF/credencial.
- Lista até 20 resultados; clique seleciona.
- Botão grande "Registrar Entrada":
  - desabilitado ao clicar (anti-duplo-clique)
  - exibe spinner
  - sucesso → toast verde "Check-in realizado com sucesso às HH:MM"
  - duplicado → alerta "Entrada já registrada nesta reunião às HH:MM"
- Tecla **Enter** registra entrada quando há um resultado selecionado.
- Botão "Novo Cadastro Rápido" abre dialog com campos mínimos e, ao salvar, registra a entrada automaticamente.

**Aviso de Privacidade (`/privacidade`)**
- Página estática com texto LGPD curto e institucional.

## O que NÃO será feito nesta fase

Lovable Cloud, banco real, RLS, edge functions, setup do admin, aprovação de usuários, perfis/permissões reais, relatórios, exportações, gráficos, congregações como CRUD separado, QR Code.

## Arquivos afetados

**Criados**
- `src/assets/logo-ieadmi.png` (já copiado)
- `src/store/mockStore.tsx`
- `src/lib/maskCpf.ts`, `src/lib/format.ts`
- `src/hooks/useDebounce.ts`, `src/hooks/useMockAuth.ts`
- `src/components/layout/AppLayout.tsx`, `Sidebar.tsx`, `Topbar.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/pessoas/PessoaForm.tsx`
- `src/components/reunioes/ReuniaoForm.tsx`
- `src/components/checkin/CadastroRapidoModal.tsx`
- `src/pages/Login.tsx`, `Dashboard.tsx`, `Pessoas.tsx`, `PessoaDetalhes.tsx`, `Reunioes.tsx`, `Checkin.tsx`, `Privacidade.tsx`

**Alterados**
- `src/index.css` — paleta IEADMI
- `src/App.tsx` — novas rotas + AuthProvider mock + MockStoreProvider
- `src/pages/Index.tsx` — redireciona para `/login`
- `index.html` — title "Portal IEADMI Check-in"

## Dependências
Nenhuma nova. Tudo com o que já está no template (React Router, shadcn/ui, sonner, lucide-react, recharts disponível mas não usado nesta fase).
