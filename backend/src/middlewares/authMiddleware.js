const authService = require('../services/authService')

function verificarAutenticacao(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        erro: 'Token não fornecido'
      })
    }
    
    const parts = authHeader.split(' ')
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        erro: 'Formato de token inválido'
      })
    }
    
    const token = parts[1]
    
    const decoded = authService.verificarToken(token)
    
    if (!decoded) {
      return res.status(401).json({
        erro: 'Token inválido ou expirado'
      })
    }
    
    req.usuario = {
      id: decoded.id,
      username: decoded.username
    }
    
    next()
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error)
    return res.status(500).json({
      erro: 'Erro ao verificar autenticação'
    })
  }
}

module.exports = verificarAutenticacao
