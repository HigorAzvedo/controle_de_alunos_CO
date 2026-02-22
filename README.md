# Sistema de Gerenciamento de Alunos - Igreja

Sistema web completo para organizar alunos da igreja local em classes de acordo com a faixa etária.

## 📁 Estrutura do Monorepo

```
projeto_igrejaCO/
├── backend/          # API REST com Node.js + Express
├── frontend/         # Interface web com React + Vite
├── package.json      # Configuração do workspace
└── README.md
```

## Tecnologias

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Banco de Dados:** MySQL
- **Query Builder:** Knex.js
- **Variáveis de Ambiente:** dotenv

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Estilização:** CSS

## Classes Disponíveis

| Classe | Faixa Etária |
|--------|--------------|
| Moisés | 0 a 2 anos |
| Samuel | 3 a 6 anos |
| Josué | 7 a 9 anos |
| Paulo | 10 a 12 anos |
| Daniel | 13 a 17 anos |
| Embaixadores | 18 a 29 anos |
| Arautos | 30 anos ou mais |

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd projeto_igrejaCO
```

### 2. Instale todas as dependências
```bash
npm install
```

### 3. Configure o Backend

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `backend/.env` com suas credenciais do MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=igreja_alunos
```

### 4. Crie o banco de dados
```sql
CREATE DATABASE igreja_alunos;
```

### 5. Execute migrations e seeds
```bash
# Da raiz do projeto
npm run backend:migrate
npm run backend:seed
```

### 6. Inicie o sistema

#### Opção 1: Rodar backend e frontend juntos
```bash
npm run dev
```

#### Opção 2: Rodar separadamente
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend  
npm run frontend
```

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Roda backend + frontend simultaneamente
npm run backend          # Apenas backend (porta 3000)
npm run frontend         # Apenas frontend (porta 5173)

# Backend
npm run backend:migrate  # Executar migrations
npm run backend:seed     # Executar seeds
npm run backend:start    # Produção

# Instalação
npm run install:all      # Instalar dependências de tudo
```

## 🔌 Endpoints da API

### Alunos
- `POST /api/alunos` - Cadastrar novo aluno
- `GET /api/alunos` - Listar todos os alunos
- `PUT /api/alunos/:id` - Atualizar aluno (nome e/ou data de nascimento)
- `DELETE /api/alunos/:id` - Deletar aluno
- `PUT /api/alunos/revalidar-classes` - Revalidar classes de todos os alunos

### Classes
- `GET /api/classes` - Listar todas as classes

## 📱 Funcionalidades do Frontend

- ✅ Cadastro de alunos com validação
- ✅ Listagem de alunos por classe
- ✅ Edição de alunos via modal
- ✅ Exclusão de alunos com confirmação
- ✅ Visualização de todas as classes
- ✅ Revalidação manual das classes
- ✅ Interface responsiva e moderna
- ✅ Feedback visual
- ✅ Loading states
- ✅ Cálculo automático de idade
- ✅ Cálculo automático de idade

## Regras de Negócio

- A idade dos alunos é sempre calculada dinamicamente a partir da data de nascimento
- Ao cadastrar um aluno, o sistema atribui automaticamente a classe correta
- A revalidação de classes pode ser executada manualmente via endpoint
- A idade nunca é armazenada diretamente no banco de dados
