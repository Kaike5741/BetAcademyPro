# BetAcademy Pro

Plataforma acadêmica de simulação esportiva criada em **React + Vite**, com **JSON Server**, **React Router DOM**, **Hooks**, **Context API**, dashboard administrativo, área do jogador, histórico, ranking, carteira fictícia e controle de apostas simuladas.

> Este projeto é exclusivamente acadêmico. Não usa dinheiro real, PIX, cartão, gateway de pagamento, criptomoedas ou integração com casas de apostas reais. Todos os valores são fictícios.

---

## Nome da plataforma

**BetAcademy Pro**

## Descrição geral

O sistema simula uma plataforma acadêmica de apostas esportivas fictícias. Existem dois perfis principais:

- **Administrador:** cadastra eventos, edita eventos, encerra apostas, informa resultados e acompanha métricas da plataforma.
- **Usuário/Jogador:** visualiza eventos disponíveis, realiza apostas fictícias, acompanha saldo simulado, consulta histórico, ranking, conquistas e carteira.

---

## Funcionalidade extra escolhida

### Carteira e Extrato Fictício

A funcionalidade extra possui tela própria em `/app/carteira` e usa o JSON Server para:

- consultar movimentações do usuário em `transacoes`;
- registrar apostas fictícias com valor negativo;
- registrar prêmios fictícios após encerramento de eventos;
- resgatar bônus acadêmico diário;
- atualizar saldo e XP do usuário.

Também existe uma área de **Conquistas** com gamificação por XP para deixar a apresentação mais completa.

---

## Tecnologias utilizadas

- React
- Vite
- React Router DOM
- React Hooks
- Context API
- Axios
- JSON Server
- Recharts
- React Icons
- CSS puro responsivo
- GitHub

---

## Como executar o projeto

### 1. Instale as dependências

```bash
npm install
```

### 2. Execute o JSON Server

```bash
npm run server
```

O servidor será aberto em:

```txt
http://localhost:3001
```

### 3. Em outro terminal, execute o React

```bash
npm run dev
```

O Vite abrirá normalmente em:

```txt
http://localhost:5173
```

### Opção alternativa

Também é possível rodar o React e o JSON Server juntos:

```bash
npm run start:all
```

---

## Usuários de teste

### Administrador

```txt
E-mail: admin@betacademy.com
Senha: 123
```

### Jogador

```txt
E-mail: kaike@betacademy.com
Senha: 123
```

Outros jogadores de teste:

```txt
maria@betacademy.com / 123
lucas@betacademy.com / 123
```

---

## Principais rotas

### Públicas

- `/login` — tela de login
- `/regulamento` — regras da plataforma acadêmica

### Administrador

- `/admin` — dashboard administrativo
- `/admin/eventos` — cadastro, edição e encerramento de eventos
- `/admin/ranking` — ranking geral dos jogadores

### Usuário

- `/app` — dashboard do jogador
- `/app/eventos` — eventos disponíveis e tela de aposta
- `/app/historico` — histórico de apostas
- `/app/carteira` — carteira, bônus e extrato fictício
- `/app/ranking` — ranking dos jogadores
- `/app/conquistas` — conquistas e evolução por XP

---

## Regras de negócio

- Usuário comum não acessa funcionalidades administrativas.
- Administrador não realiza apostas.
- Apenas eventos com status `aberto` podem receber apostas.
- Ao apostar, o valor é descontado do saldo fictício do jogador.
- O retorno potencial é calculado por `valor x odd`.
- Quando o administrador encerra um evento, informa o resultado.
- As apostas pendentes daquele evento são atualizadas para `ganhou` ou `perdeu`.
- Se o jogador ganha, o retorno fictício é adicionado ao saldo.
- O sistema registra movimentações no extrato.
- O jogador ganha XP ao apostar e ao acertar resultados.
- O bônus diário só pode ser resgatado uma vez por dia.

---

## Organização de pastas

```txt
src/
├── components/
│   ├── AppShell.jsx
│   ├── BetSlip.jsx
│   ├── EmptyState.jsx
│   ├── EventCard.jsx
│   ├── ProtectedRoute.jsx
│   ├── RankingTable.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── StatusBadge.jsx
│   └── Topbar.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── pages/
│   ├── Carteira.jsx
│   ├── Conquistas.jsx
│   ├── DashboardAdmin.jsx
│   ├── DashboardUser.jsx
│   ├── Eventos.jsx
│   ├── EventosAdmin.jsx
│   ├── Historico.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── Ranking.jsx
│   └── Regulamento.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   └── api.js
│
├── styles/
│   └── global.css
│
├── utils/
│   └── business.js
│
├── App.jsx
└── main.jsx
```

---

## Principais telas

- Login profissional com acesso rápido para Admin e Jogador.
- Dashboard Admin com estatísticas, gráfico e últimos eventos.
- Tela Admin para cadastrar, editar e encerrar eventos.
- Dashboard do Jogador com saldo, XP, nível, apostas ativas e gráfico.
- Tela de eventos com odds e bilhete de aposta fictícia.
- Histórico filtrável por status.
- Carteira com bônus e extrato.
- Ranking geral.
- Conquistas por XP.
- Regulamento acadêmico.

---

## Divisão de tarefas sugerida para dupla

### Integrante 1

- Estrutura inicial do projeto.
- Rotas protegidas.
- Context API de autenticação.
- Tela de login.
- Layout geral, sidebar e topbar.
- Dashboard do usuário.

### Integrante 2

- JSON Server e arquivo `db.json`.
- CRUD de eventos do administrador.
- Tela de apostas.
- Atualização de saldo e histórico.
- Carteira, extrato e bônus.
- README e ajustes finais.

---

## Commits sugeridos

```txt
Criação da estrutura inicial do projeto React com Vite
Configuração do JSON Server e dados fictícios
Implementação da tela de login simulado
Criação das rotas protegidas por perfil
Implementação do layout profissional com sidebar
Criação do painel administrativo
Implementação do cadastro e gerenciamento de eventos
Criação da tela de eventos disponíveis
Implementação da aposta fictícia e controle de saldo
Criação do histórico de apostas
Implementação da carteira e extrato fictício
Criação do ranking e conquistas
Finalização do README e ajustes responsivos
```

---

## Dificuldades encontradas

- Separar corretamente as permissões entre administrador e usuário.
- Atualizar apostas após o encerramento dos eventos.
- Sincronizar saldo, XP e transações com o JSON Server.
- Criar uma interface responsiva e organizada sem copiar sites reais.

---

## Melhorias futuras

- Adicionar tema claro/escuro.
- Criar painel estatístico mais completo para o administrador.
- Permitir busca por nome dos times.
- Criar filtros por data e liga.
- Adicionar modal de confirmação para encerrar eventos.
- Criar testes automatizados para regras de negócio.
