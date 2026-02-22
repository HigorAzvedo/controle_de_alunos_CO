# 🧪 Guia de Testes dos Endpoints

## Pré-requisitos

1. MySQL rodando
2. Banco de dados `igreja_alunos` criado
3. Arquivo `.env` configurado

## Passo a Passo

### 1️⃣ Executar Migrations
```bash
npm run migrate
```
✅ Isso criará as tabelas `classes` e `alunos`

### 2️⃣ Executar Seeds
```bash
npm run seed
```
✅ Isso cadastrará as 7 classes (Moisés, Samuel, Josué, Paulo, Daniel, Embaixadores, Arautos)

### 3️⃣ Iniciar o Servidor
```bash
npm run dev
```
✅ O servidor iniciará em http://localhost:3000

---

## 🎯 Como Testar

### Opção 1: Arquivo .rest (Recomendado)
1. Instale a extensão **REST Client** no VS Code
2. Abra o arquivo `test-endpoints.rest`
3. Clique em "Send Request" acima de cada requisição

### Opção 2: Script Batch
Execute no terminal:
```bash
test-commands.bat
```

### Opção 3: cURL Manual
Copie e cole os comandos abaixo no terminal:

#### Listar Classes
```bash
curl -X GET http://localhost:3000/api/classes
```

#### Cadastrar Aluno
```bash
curl -X POST http://localhost:3000/api/alunos -H "Content-Type: application/json" -d "{\"nome\":\"Maria Silva\",\"data_nascimento\":\"2023-05-15\"}"
```

#### Listar Alunos
```bash
curl -X GET http://localhost:3000/api/alunos
```

#### Revalidar Classes
```bash
curl -X PUT http://localhost:3000/api/alunos/revalidar-classes
```

---

## 📊 Verificar no Banco de Dados

Para verificar diretamente no MySQL:

```sql
-- Ver as classes cadastradas
SELECT * FROM classes ORDER BY idade_min;

-- Ver os alunos com suas classes
SELECT 
    a.id,
    a.nome,
    a.data_nascimento,
    c.nome as classe,
    YEAR(CURDATE()) - YEAR(a.data_nascimento) as idade_aproximada
FROM alunos a
JOIN classes c ON a.classe_id = c.id
ORDER BY a.nome;

-- Contar alunos por classe
SELECT 
    c.nome as classe,
    COUNT(a.id) as total_alunos
FROM classes c
LEFT JOIN alunos a ON c.id = a.classe_id
GROUP BY c.id, c.nome
ORDER BY c.idade_min;
```

---

## ✅ Checklist de Validação

- [ ] Classes foram criadas corretamente (7 classes)
- [ ] Aluno cadastrado aparece com a classe correta
- [ ] Idade é calculada dinamicamente (não está salva no banco)
- [ ] Revalidação atualiza classes quando necessário
- [ ] Validações funcionam (data futura, campos obrigatórios)
- [ ] Foreign key entre alunos e classes está funcionando

---

## 🐛 Troubleshooting

**Erro de conexão com banco:**
- Verifique se MySQL está rodando
- Confirme credenciais no arquivo `.env`
- Verifique se o banco `igreja_alunos` existe

**Erro "classe_id cannot be null":**
- Execute o seed: `npm run seed`

**Porta 3000 em uso:**
- Altere a PORT no arquivo `.env`
