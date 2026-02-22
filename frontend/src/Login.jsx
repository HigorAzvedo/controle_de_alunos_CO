import { useState } from 'react'
import './Login.css'
import api from './config/api'
import { toast } from 'react-toastify'

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await api.post('/auth/login', { username, password })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
      
      toast.success(`Bem-vindo, ${response.data.usuario.username}!`)
      onLoginSuccess(response.data.token, response.data.usuario)
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Gerenciamento</h1>
          <p>Casa de Oração - Alunos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {erro && (
            <div className="error-message">
              {erro}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
              autoComplete="username"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              autoComplete="current-password"
              disabled={carregando}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
