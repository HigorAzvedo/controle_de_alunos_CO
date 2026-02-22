const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const verificarAutenticacao = require('../middlewares/authMiddleware')

// Rota de login (não requer autenticação)
router.post('/login', authController.login)

// Rota para verificar autenticação (requer token válido)
router.get('/verificar', verificarAutenticacao, authController.verificarAutenticacao)

module.exports = router
