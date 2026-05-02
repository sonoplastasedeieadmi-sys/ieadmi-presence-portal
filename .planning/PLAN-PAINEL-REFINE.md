# Plano de Refinamento: Painel de Presença Premium

## Objetivo
Transformar o `Painel.tsx` atual em uma interface de "TV Display" de alto nível, seguindo o design da captura de tela fornecida e os princípios de "Quiet Luxury".

## Mudanças Necessárias

### 1. Estrutura Visual (Layout)
- **Header**: Separar logo/título do relógio. Adicionar "PORTAL IEADMI" em subtexto.
- **Hero**: Centralizar título da reunião e local com tipografia imponente.
- **Counter**: Card central com glassmorphism, contagem de 2 dígitos e badge de "Atualização ao vivo".
- **Últimos Check-ins**: Lista compacta e elegante ou placeholder de "Aguardando".
- **Footer**: Barra informativa com atalhos e status.

### 2. Funcionalidades
- **Full Screen**: Implementar hook ou lógica para alternar modo tela cheia (tecla F).
- **Animações**: Adicionar transições suaves para novos check-ins.

### 3. Estética
- **Background**: Gradiente profundo `from-[#0f4392] to-[#0a1e3f]`.
- **Tipografia**: Uso de pesos variados para hierarquia clara.

## Critérios de Aceite
- Build sem erros.
- Visual idêntico ou superior ao screenshot.
- Atalho 'F' funcional para tela cheia.
