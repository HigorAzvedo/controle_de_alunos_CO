# Backend - Sistema de Gerenciamento de Alunos

API RESTful desenvolvida com Node.js, Express, Knex e MySQL.

## Tecnologias

- **Runtime:** Node.js
- **Framework:** Express
- **Banco de Dados:** MySQL
- **Query Builder:** Knex.js
- **Variáveis de Ambiente:** dotenv

## Instalação

```bash
# Na raiz do projeto
npm install --workspace=backend

# Ou dentro da pasta backend
cd backend
npm install
```

## Configuração

1. Configure o arquivo `.env`:
```bash
cp .env.example .env
```

2. Edite o `.env` com suas credenciais do MySQL

3. Crie o banco de dados:
```sql
CREATE DATABASE igreja_alunos;
```

## Executar

```bash
# Da raiz do monorepo
npm run backend:migrate    # Executar migrations
npm run backend:seed       # Executar seeds
npm run backend           # Modo desenvolvimento

# Ou dentro da pasta backend
npm run migrate
npm run seed
npm run dev
```

## Endpoints

### Classes
- `GET /api/classes` - Listar todas as classes

### Alunos
- `POST /api/alunos` - Cadastrar novo aluno
- `GET /api/alunos` - Listar todos os alunos
- `PUT /api/alunos/revalidar-classes` - Revalidar classes

## Estrutura

```
backend/
├── src/
│   ├── config/          # Configurações do banco
│   ├── controllers/     # Controladores da API
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição das rotas
│   └── server.js        # Arquivo principal
├── database/
│   ├── migrations/      # Migrations
│   └── seeds/          # Seeds
└── knexfile.js         # Configuração do Knex
```
