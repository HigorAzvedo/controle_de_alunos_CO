const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');const verificarAutenticacao = require('../middlewares/authMiddleware')

// Todas as rotas abaixo requerem autenticação
router.use(verificarAutenticacao)
// GET /api/classes - Listar todas as classes
router.get('/', classeController.listarClasses);

module.exports = router;
