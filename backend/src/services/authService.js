const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/database')

// Chave secreta para o JWT (em produção, use variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-2026'

/**
 * Valida as credenciais do usuário
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<object|null>} Usuário se credenciais válidas, null caso contrário
 */
async function validarCredenciais(username, password) {
  try {
    // Busca o usuário pelo username
    const usuario = await db('usuarios')
      .where({ username })
      .first()
    
    if (!usuario) {
      return null
    }
    
    // Compara a senha fornecida com o hash armazenado
    const senhaValida = await bcrypt.compare(password, usuario.password_hash)
    
    if (!senhaValida) {
      return null
    }
    
    // Remove a senha do objeto retornado
    const { password_hash, ...usuarioSemSenha } = usuario
    
    return usuarioSemSenha
  } catch (error) {
    console.error('Erro ao validar credenciais:', error)
    throw error
  }
}

/**
 * Gera um token JWT para o usuário
 * @param {object} usuario 
 * @returns {string} Token JWT
 */
function gerarToken(usuario) {
  const payload = {
    id: usuario.id,
    username: usuario.username
  }
  
  // Token expira em 24 horas
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

/**
 * Verifica se um token JWT é válido
 * @param {string} token 
 * @returns {object|null} Payload do token se válido, null caso contrário
 */
function verificarToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

module.exports = {
  validarCredenciais,
  gerarToken,
  verificarToken
}
