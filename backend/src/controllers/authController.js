const authService = require('../services/authService')

async function login(req, res) {
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({
        erro: 'Username e password são obrigatórios'
      })
    }
    
    const usuario = await authService.validarCredenciais(username, password)
    
    if (!usuario) {
      return res.status(401).json({
        erro: 'Credenciais inválidas'
      })
    }
    
    const token = authService.gerarToken(usuario)
    
    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return res.status(500).json({
      erro: 'Erro ao realizar login'
    })
  }
}

function verificarAutenticacao(req, res) {
  return res.status(200).json({
    autenticado: true,
    usuario: req.usuario
  })
}

module.exports = {
  login,
  verificarAutenticacao
}
