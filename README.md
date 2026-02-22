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


## Regras de Negócio

- A idade dos alunos é sempre calculada dinamicamente a partir da data de nascimento
- Ao cadastrar um aluno, o sistema atribui automaticamente a classe correta
- A revalidação de classes pode ser executada manualmente via endpoint
- A idade nunca é armazenada diretamente no banco de dados
