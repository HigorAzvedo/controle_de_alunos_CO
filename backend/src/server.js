require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { runMigrations } = require('./config/migrate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Gerenciamento de Alunos - Igreja',
    versao: '1.0.0',
    status: 'ativo'
  });
});

app.use('/api', routes);
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Executar migrations antes de iniciar o servidor
async function startServer() {
  try {
    await runMigrations();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📍 URL: http://localhost:${PORT}\n`);
      }
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;
