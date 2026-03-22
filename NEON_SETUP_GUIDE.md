# 🚀 Guia: Conectar Neon (PostgreSQL) na Vercel

## ✅ O que foi feito

1. ✓ Configurado `knexfile.js` para PostgreSQL
2. ✓ Instalado driver `pg` 
3. ✓ Criado script automático de migrations
4. ✓ `server.js` agora executa migrations ao iniciar
5. ✓ Variável de ambiente `DATABASE_URL` adicionada na Vercel

---

## 📝 Próximos Passos

### **Passo 1: Atualizar o `.env` local**

No arquivo `/backend/.env`, substitua:
```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@ep-seu-projeto.neon.tech/seu_banco?sslmode=require
```

Pela URL **real** do Neon que você copiou:
```env
DATABASE_URL=postgresql://neon_user:abc123xyz@ep-small-bat-123456.neon.tech/neondb?sslmode=require
```

### **Passo 2: Testar localmente**

```bash
cd backend
npm run dev
```

Se ver isto, está funcionando! ✅
```
📦 Executando migrations no ambiente: development
✅ Migrations executadas com sucesso:
   - 20260221000001_create_classes_table.js
   - 20260221000002_create_alunos_table.js
   - 20260221000003_create_usuarios_table.js

🚀 Servidor rodando na porta 3000
```

### **Passo 3: Adicionar dados de teste (opcional)**

```bash
npm run seed
```

### **Passo 4: Fazer deploy na Vercel**

```bash
git add .
git commit -m "feat: migrate from MySQL to PostgreSQL (Neon)"
git push
```

A Vercel automaticamente:
1. Faz build do backend
2. Executa migrations ao iniciar
3. Inicia o servidor com banco atualizado

---

## 🔍 Verificar Status

Após deploy, você pode verificar os logs na Vercel:
- **Vercel Dashboard** → Seu projeto → **Deployments** → **Funções** → Logs

Procure por:
```
✅ Migrations executadas com sucesso
🚀 Servidor rodando na porta
```

---

## ⚠️ Troubleshooting

| Erro | Solução |
|------|---------|
| `relation "classes" does not exist` | As migrations não rodaram. Verifique logs no Vercel |
| `password authentication failed` | URL do Neon incorreta ou expirada |
| `SSL required` | A URL do Neon deve ter `?sslmode=require` |
| `connection refused` | Banco não está rodando ou firewall bloqueando |

---

## 📱 Teste a API

Após tudo funcionando:
```bash
curl http://localhost:3000/api/alunos
```

Ou na Vercel:
```bash
curl https://seu-app.vercel.app/api/alunos
```
