const authService = require('../services/authService')

/**
 * Realiza o login do usuário
 */
async function login(req, res) {
  try {
    const { username, password } = req.body
    
    // Valida os dados de entrada
    if (!username || !password) {
      return res.status(400).json({
        erro: 'Username e password são obrigatórios'
      })
    }
    
    // Valida as credenciais
    const usuario = await authService.validarCredenciais(username, password)
    
    if (!usuario) {
      return res.status(401).json({
        erro: 'Credenciais inválidas'
      })
    }
    
    // Gera o token JWT
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

/**
 * Verifica se o usuário está autenticado
 */
function verificarAutenticacao(req, res) {
  // Se chegou aqui, o middleware já validou o token
  return res.status(200).json({
    autenticado: true,
    usuario: req.usuario
  })
}

module.exports = {
  login,
  verificarAutenticacao
}
