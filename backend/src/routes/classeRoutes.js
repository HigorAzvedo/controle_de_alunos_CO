const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');const verificarAutenticacao = require('../middlewares/authMiddleware')

// Todas as rotas abaixo requerem autenticação
router.use(verificarAutenticacao)
// GET /api/classes - Listar todas as classes
router.get('/', classeController.listarClasses);

// PUT /api/classes/:id/professor - Adicionar professor na classe
router.put('/:id/professor', classeController.definirProfessorDaClasse);

// DELETE /api/classes/:id/professor/:professorId - Remover professor da classe
router.delete('/:id/professor/:professorId', classeController.removerProfessorDaClasse);

module.exports = router;
