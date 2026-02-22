# Frontend - Sistema de Gerenciamento de Alunos

Interface web desenvolvida com React e Vite.

## Tecnologias

- **Framework:** React 18
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Estilização:** CSS

## Instalação

```bash
# Na raiz do projeto
npm install --workspace=frontend

# Ou dentro da pasta frontend
cd frontend
npm install
```

## Executar

```bash
# Da raiz do monorepo
npm run frontend

# Ou dentro da pasta frontend
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## Funcionalidades

- ✅ Visualizar todas as classes disponíveis
- ✅ Cadastrar novos alunos
- ✅ Listar alunos com suas classes
- ✅ Revalidar classes automaticamente
- ✅ Interface responsiva

## Estrutura

```
frontend/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos principais
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globais
├── index.html           # HTML base
├── vite.config.js       # Configuração do Vite
└── package.json
```

## Proxy

O Vite está configurado para fazer proxy das requisições `/api/*` para o backend em `http://localhost:3000`.

## Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.
