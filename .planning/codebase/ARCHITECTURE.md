# Arquitetura Frontend MVP (Mock)

## Stack
- React 18, Vite
- TypeScript
- Tailwind CSS v3 / shadcn/ui
- React Router DOM
- TanStack Query (para requisições/mocks async)

## Estrutura
- `/src/components`: Componentes UI reutilizáveis e Layouts.
- `/src/pages`: Páginas da aplicação (Dashboard, Pessoas, Reuniões, Check-in, Login).
- `/src/hooks`: Custom hooks (ex: `useMockAuth`).
- `/src/store`: Gerenciador de estado falso (`MockStoreProvider`).

## Restrição Atual
Toda a persistência e autenticação ocorrem em memória (Mock). Este ambiente foi projetado para estar estável para validação visual, sem uso de backend.
