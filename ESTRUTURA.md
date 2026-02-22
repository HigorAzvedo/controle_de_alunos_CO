# 📂 Estrutura do Projeto - Monorepo

## 📁 Visão Geral

```
projeto_igrejaCO/                    # Raiz do monorepo
│
├── 📦 backend/                      # API REST (Node.js + Express + MySQL)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Conexão Knex com MySQL
│   │   ├── controllers/
│   │   │   ├── alunoController.js   # CRUD de alunos
│   │   │   └── classeController.js  # Listagem de classes
│   │   ├── services/
│   │   │   └── alunoService.js      # Lógica de negócio (cálculo idade)
│   │   ├── routes/
│   │   │   ├── alunoRoutes.js       # Rotas /api/alunos
│   │   │   ├── classeRoutes.js      # Rotas /api/classes
│   │   │   └── index.js             # Agregador de rotas
│   │   └── server.js                # Entry point do Express
│   │
│   ├── database/
│   │   ├── migrations/              # Estrutura do banco
│   │   │   ├── *_create_classes_table.js
│   │   │   └── *_create_alunos_table.js
│   │   └── seeds/                   # Dados iniciais
│   │       └── 001_classes.js       # 7 classes pré-cadastradas
│   │
│   ├── .env                         # Variáveis de ambiente (MySQL)
│   ├── .env.example                 # Template do .env
│   ├── knexfile.js                  # Configuração do Knex
│   ├── package.json                 # Dependências do backend
│   ├── test-endpoints.rest          # Testes com REST Client
│   ├── test-commands.bat            # Testes automatizados
│   ├── TESTES.md                    # Guia de testes
│   └── README.md                    # Documentação do backend
│
├── 🎨 frontend/                     # Interface Web (React + Vite)
│   ├── src/
│   │   ├── App.jsx                  # Componente principal
│   │   ├── App.css                  # Estilos do app
│   │   ├── main.jsx                 # Entry point React
│   │   └── index.css                # Estilos globais
│   │
│   ├── index.html                   # HTML base
│   ├── vite.config.js               # Config Vite + Proxy API
│   ├── package.json                 # Dependências do frontend
│   ├── .gitignore                   # Ignores específicos
│   └── README.md                    # Documentação do frontend
│
├── 📄 Arquivos da Raiz
│   ├── package.json                 # Workspace do monorepo
│   ├── .gitignore                   # Ignores globais
│   ├── README.md                    # Documentação principal
│   ├── QUICKSTART.md                # Guia rápido de início
│   ├── SCRIPTS.md                   # Cheat sheet de comandos
│   └── projeto-igreja.code-workspace # Workspace do VS Code
│
└── 📦 node_modules/                 # Dependências compartilhadas

```

## 🎯 Responsabilidades

### Backend (`/backend`)
- ✅ API RESTful
- ✅ Acesso ao MySQL via Knex
- ✅ Cálculo dinâmico de idade
- ✅ Atribuição automática de classes
- ✅ Validações de dados
- ✅ Migrations e seeds
- ✅ Porta: **3000**

### Frontend (`/frontend`)
- ✅ Interface React moderna
- ✅ Cadastro de alunos
- ✅ Listagem com classes
- ✅ Revalidação manual
- ✅ Design responsivo
- ✅ Proxy para API
- ✅ Porta: **5173**

## 🔗 Comunicação

```
Frontend (5173)  →  Proxy (/api/*)  →  Backend (3000)
                                    →  MySQL (3306)
```

## 📊 Fluxo de Dados

```
1. Usuário cadastra aluno (Frontend)
   ↓
2. POST /api/alunos (Backend)
   ↓
3. Calcula idade (Service)
   ↓
4. Identifica classe correta (Service)
   ↓
5. Salva no MySQL (Knex)
   ↓
6. Retorna aluno com classe (Frontend)
```

## 🗄️ Estrutura do Banco

```sql
-- Tabela classes
+---------+-----------+
| Campo   | Tipo      |
+---------+-----------+
| id      | INT       |
| nome    | VARCHAR   |
| idade_min | INT     |
| idade_max | INT (NULL)|
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
+---------+-----------+

-- Tabela alunos
+----------------+-----------+
| Campo          | Tipo      |
+----------------+-----------+
| id             | INT       |
| nome           | VARCHAR   |
| data_nascimento| DATE      |
| classe_id (FK) | INT       |
| created_at     | TIMESTAMP |
| updated_at     | TIMESTAMP |
+----------------+-----------+
```

## 🚀 Scripts Principais

```bash
# Desenvolvimento completo
npm run dev                    # Backend + Frontend

# Desenvolvimento separado
npm run backend               # Apenas API
npm run frontend              # Apenas Interface

# Banco de dados
npm run backend:migrate       # Criar tabelas
npm run backend:seed          # Popular classes

# Instalação
npm install                   # Instala tudo
```

## 📦 Tecnologias

### Backend
- Node.js
- Express 4.18
- Knex 3.0
- MySQL2
- dotenv
- CORS

### Frontend
- React 18
- Vite 5
- Axios
- CSS puro

### DevOps
- Concurrently (rodar ambos juntos)
- Nodemon (hot reload backend)
- Vite HMR (hot reload frontend)

## 🎨 Funcionalidades Implementadas

### Backend
- [x] CRUD de alunos
- [x] Listagem de classes
- [x] Cálculo automático de idade
- [x] Atribuição automática de classes
- [x] Revalidação manual
- [x] Validações robustas
- [x] Tratamento de erros
- [x] Migrations e seeds

### Frontend  
- [x] Interface moderna
- [x] Formulário de cadastro
- [x] Tabela de alunos
- [x] Cards de classes
- [x] Botão de revalidação
- [x] Design responsivo
- [x] Feedback visual
- [x] Loading states

## 🔐 Variáveis de Ambiente

Apenas o backend necessita de configuração (arquivo `backend/.env`):

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=igreja_alunos
```

## 🎓 Classes Cadastradas

| Classe       | Faixa Etária   |
|--------------|----------------|
| Moisés       | 0 a 3 anos     |
| Samuel       | 3 a 7 anos     |
| Josué        | 7 a 10 anos    |
| Paulo        | 10 a 13 anos   |
| Daniel       | 13 a 18 anos   |
| Embaixadores | 18 a 30 anos   |
| Arautos      | 30 anos ou +   |
