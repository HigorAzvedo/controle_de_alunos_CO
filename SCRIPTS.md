# 📋 Cheat Sheet - Scripts NPM

## 🎯 Desenvolvimento

### Rodar tudo junto
```bash
npm run dev
```
Inicia backend (porta 3000) e frontend (porta 5173) simultaneamente

### Rodar separadamente
```bash
npm run backend    # Apenas API
npm run frontend   # Apenas interface
```

---

## 🗄️ Banco de Dados

### Migrations
```bash
npm run backend:migrate              # Executar todas migrations
npm run backend:migrate:rollback     # Desfazer última migration
```

### Seeds
```bash
npm run backend:seed                 # Executar seeds (cadastrar classes)
```

### Comandos diretos no backend
```bash
cd backend
npm run migrate
npm run migrate:rollback
npm run seed
```

---

## 📦 Instalação de Pacotes

### No workspace raiz
```bash
npm install <pacote>
```

### No backend
```bash
npm install <pacote> --workspace=backend
# ou
cd backend && npm install <pacote>
```

### No frontend
```bash
npm install <pacote> --workspace=frontend
# ou
cd frontend && npm install <pacote>
```

---

## 🏗️ Build e Produção

### Frontend
```bash
cd frontend
npm run build      # Gera pasta dist/
npm run preview    # Preview da build
```

### Backend
```bash
cd backend
npm start          # Modo produção
```

---

## 🧪 Testes da API

Arquivos disponíveis em `backend/`:

1. **REST Client** (VS Code extension)
   - Abrir: `backend/test-endpoints.rest`
   - Clicar em "Send Request"

2. **Script Batch**
   ```bash
   cd backend
   test-commands.bat
   ```

3. **cURL Manual**
   ```bash
   curl http://localhost:3000/api/classes
   curl http://localhost:3000/api/alunos
   ```

---

## 🔍 Verificar Status

### Listar classes cadastradas
```bash
curl http://localhost:3000/api/classes
```

### Listar alunos
```bash
curl http://localhost:3000/api/alunos
```

### Health check
```bash
curl http://localhost:3000/
```

---

## 🐛 Troubleshooting

### Limpar e reinstalar
```bash
# Remover node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Remover locks
rm package-lock.json backend/package-lock.json frontend/package-lock.json

# Reinstalar tudo
npm install
```

### Resetar banco de dados
```bash
# Desfazer migrations
npm run backend:migrate:rollback

# Aplicar novamente
npm run backend:migrate

# Recriar seeds
npm run backend:seed
```

### Portas em uso
```bash
# Mudar porta do backend: editar backend/.env
PORT=3001

# Mudar porta do frontend: editar frontend/vite.config.js
server: { port: 5174 }
```

---

## 📱 URLs Padrão

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Base: http://localhost:3000/api

---

## 🚀 Workflow Completo

```bash
# 1. Instalar dependências
npm install

# 2. Configurar backend/.env
cd backend
cp .env.example .env
# Editar .env com credenciais MySQL

# 3. Criar banco
# No MySQL: CREATE DATABASE igreja_alunos;

# 4. Estruturar banco
cd ..
npm run backend:migrate
npm run backend:seed

# 5. Rodar sistema
npm run dev

# 6. Acessar
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```
