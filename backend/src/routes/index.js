const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const alunoRoutes = require('./alunoRoutes');
const classeRoutes = require('./classeRoutes');

// Rotas de autenticação (não requerem login)
router.use('/auth', authRoutes);

// Rotas de alunos
router.use('/alunos', alunoRoutes);

// Rotas de classes
router.use('/classes', classeRoutes);

module.exports = router;
