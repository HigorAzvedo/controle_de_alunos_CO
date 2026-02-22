import { useState } from 'react'
import './Login.css'

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Armazena o token no localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        
        // Chama a função de sucesso
        onLoginSuccess(data.token, data.usuario)
      } else {
        setErro(data.erro || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setErro('Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Sistema de Gerenciamento</h1>
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
