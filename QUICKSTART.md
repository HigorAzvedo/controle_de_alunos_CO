# 🚀 Guia Rápido - Monorepo

## Estrutura Atual

```
projeto_igrejaCO/
├── backend/              # API REST
│   ├── src/
│   ├── database/
│   ├── .env
│   ├── knexfile.js
│   └── package.json
│
├── frontend/             # Interface React
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── package.json         # Workspace root
```

## ⚡ Início Rápido

### 1. Instalar tudo de uma vez
```bash
npm install
```

### 2. Configurar backend
```bash
cd backend
# Edite o .env com suas credenciais MySQL
```

### 3. Criar banco e estrutura
```bash
# Voltar para a raiz
cd ..

# Executar migrations
npm run backend:migrate

# Executar seeds
npm run backend:seed
```

### 4. Rodar o sistema completo
```bash
npm run dev
```

Isso iniciará:
- ✅ Backend em http://localhost:3000
- ✅ Frontend em http://localhost:5173

## 📝 Comandos Úteis

```bash
# Rodar apenas backend
npm run backend

# Rodar apenas frontend
npm run frontend

# Migrations
npm run backend:migrate

# Seeds
npm run backend:seed

# Instalar dependência no backend
npm install <pacote> --workspace=backend

# Instalar dependência no frontend
npm install <pacote> --workspace=frontend
```

## 🧪 Testar a API

Os arquivos de teste estão em `backend/`:
- `test-endpoints.rest` - Para REST Client do VS Code
- `test-commands.bat` - Script batch
- `TESTES.md` - Documentação completa

## 📦 O que foi criado

### Backend (Node.js + Express + MySQL)
- ✅ API REST completa
- ✅ Migrations e seeds
- ✅ Controllers e services
- ✅ Validações
- ✅ Cálculo de idade dinâmico

### Frontend (React + Vite)
- ✅ Interface moderna e responsiva
- ✅ Cadastro de alunos
- ✅ Listagem com classes
- ✅ Revalidação manual
- ✅ Proxy configurado para API

## 🎯 Próximos Passos

1. Configure o `.env` do backend
2. Execute `npm install` na raiz
3. Execute `npm run backend:migrate`
4. Execute `npm run backend:seed`
5. Execute `npm run dev`
6. Acesse http://localhost:5173

Pronto! 🎉
