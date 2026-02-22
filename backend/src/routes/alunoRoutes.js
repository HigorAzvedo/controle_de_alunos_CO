const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const verificarAutenticacao = require('../middlewares/authMiddleware');

// Todas as rotas abaixo requerem autenticação
router.use(verificarAutenticacao);

// POST /api/alunos - Cadastrar novo aluno
router.post('/', alunoController.cadastrarAluno);

// GET /api/alunos - Listar todos os alunos
router.get('/', alunoController.listarAlunos);

// PUT /api/alunos/revalidar-classes - Revalidar classes de todos os alunos
router.put('/revalidar-classes', alunoController.revalidarClasses);

// PUT /api/alunos/:id - Atualizar aluno
router.put('/:id', alunoController.atualizarAluno);

// DELETE /api/alunos/:id - Deletar aluno
router.delete('/:id', alunoController.deletarAluno);

module.exports = router;
