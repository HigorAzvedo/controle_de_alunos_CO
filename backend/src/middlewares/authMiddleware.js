const authService = require('../services/authService')

/**
 * Middleware para verificar autenticação JWT
 */
function verificarAutenticacao(req, res, next) {
  try {
    // Obtém o token do header Authorization
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        erro: 'Token não fornecido'
      })
    }
    
    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(' ')
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        erro: 'Formato de token inválido'
      })
    }
    
    const token = parts[1]
    
    // Verifica o token
    const decoded = authService.verificarToken(token)
    
    if (!decoded) {
      return res.status(401).json({
        erro: 'Token inválido ou expirado'
      })
    }
    
    // Adiciona os dados do usuário na requisição
    req.usuario = {
      id: decoded.id,
      username: decoded.username
    }
    
    // Continua para a próxima função
    next()
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error)
    return res.status(500).json({
      erro: 'Erro ao verificar autenticação'
    })
  }
}

module.exports = verificarAutenticacao
