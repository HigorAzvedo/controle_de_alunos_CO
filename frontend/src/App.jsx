import { useState, useEffect } from 'react'
import './App.css'
import Login from './Login'

function App() {
  const [alunos, setAlunos] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  
  // Estados para o modal de edição
  const [modalAberto, setModalAberto] = useState(false)
  const [alunoEditando, setAlunoEditando] = useState(null)
  const [nomeEdicao, setNomeEdicao] = useState('')
  const [dataNascimentoEdicao, setDataNascimentoEdicao] = useState('')
  const [salvando, setSalvando] = useState(false)
  
  // Estado para filtro por classe
  const [classeSelecionada, setClasseSelecionada] = useState(null)
  
  // Estados de autenticação
  const [autenticado, setAutenticado] = useState(false)
  const [token, setToken] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [verificandoAuth, setVerificandoAuth] = useState(true)

  useEffect(() => {
    // Verifica se há token salvo ao carregar a aplicação
    const tokenSalvo = localStorage.getItem('token')
    const usuarioSalvo = localStorage.getItem('usuario')
    
    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo)
      setUsuario(JSON.parse(usuarioSalvo))
      setAutenticado(true)
    }
    
    setVerificandoAuth(false)
  }, [])

  useEffect(() => {
    if (autenticado) {
      carregarDados()
    }
  }, [autenticado])

  const carregarDados = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      
      const [alunosRes, classesRes] = await Promise.all([
        fetch('/api/alunos', { headers }),
        fetch('/api/classes', { headers })
      ])
      
      // Verifica se houve erro de autenticação
      if (alunosRes.status === 401 || classesRes.status === 401) {
        handleLogout()
        return
      }
      
      const alunosData = await alunosRes.json()
      const classesData = await classesRes.json()
      
      console.log('Dados recebidos:', alunosData) // Debug
      
      setAlunos(alunosData.alunos || [])
      setClasses(classesData.classes || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const cadastrarAluno = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          data_nascimento: dataNascimento
        })
      })
      
      if (response.status === 401) {
        handleLogout()
        return
      }
      
      if (response.ok) {
        alert('Aluno cadastrado com sucesso!')
        setNome('')
        setDataNascimento('')
        carregarDados()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.erro}`)
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      alert('Erro ao cadastrar aluno')
    }
  }

  const revalidarClasses = async () => {
    try {
      const response = await fetch('/api/alunos/revalidar-classes', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 401) {
        handleLogout()
        return
      }
      
      const data = await response.json()
      alert(`Revalidação concluída! ${data.resultado.atualizados} aluno(s) atualizado(s)`)
      carregarDados()
    } catch (error) {
      console.error('Erro ao revalidar:', error)
      alert('Erro ao revalidar classes')
    }
  }

  const abrirModalEdicao = (aluno) => {
    setAlunoEditando(aluno)
    setNomeEdicao(aluno.nome)
    // Extrai apenas a data sem timestamp
    const dataFormatada = aluno.data_nascimento.split('T')[0]
    setDataNascimentoEdicao(dataFormatada)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setAlunoEditando(null)
    setNomeEdicao('')
    setDataNascimentoEdicao('')
  }

  const editarAluno = async (e) => {
    e.preventDefault()
    
    setSalvando(true)
    
    try {
      const response = await fetch(`/api/alunos/${alunoEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: nomeEdicao,
          data_nascimento: dataNascimentoEdicao
        })
      })
      
      if (response.status === 401) {
        handleLogout()
        return
      }
      
      if (response.ok) {
        alert('Aluno atualizado com sucesso!')
        fecharModal()
        carregarDados()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.erro}`)
      }
    } catch (error) {
      console.error('Erro ao editar aluno:', error)
      alert('Erro ao editar aluno')
    } finally {
      setSalvando(false)
    }
  }

  const deletarAluno = async (aluno) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar o aluno ${aluno.nome}?\n\nEsta ação não pode ser desfeita.`
    )
    
    if (!confirmacao) return
    
    try {
      const response = await fetch(`/api/alunos/${aluno.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 401) {
        handleLogout()
        return
      }
      
      if (response.ok) {
        alert('Aluno deletado com sucesso!')
        carregarDados()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.erro}`)
      }
    } catch (error) {
      console.error('Erro ao deletar aluno:', error)
      alert('Erro ao deletar aluno')
    }
  }

  const selecionarClasse = (classe) => {
    if (classeSelecionada?.id === classe.id) {
      // Se clicar na mesma classe, desmarca
      setClasseSelecionada(null)
    } else {
      setClasseSelecionada(classe)
    }
  }

  // Filtra os alunos baseado na classe selecionada
  const alunosFiltrados = classeSelecionada
    ? alunos.filter(aluno => aluno.classe.id === classeSelecionada.id)
    : alunos

  // Funções de autenticação
  const handleLoginSuccess = (tokenRecebido, usuarioRecebido) => {
    setToken(tokenRecebido)
    setUsuario(usuarioRecebido)
    setAutenticado(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
    setAutenticado(false)
    setAlunos([])
    setClasses([])
  }

  // Mostra tela de carregamento durante verificação de autenticação
  if (verificandoAuth) {
    return <div className="loading">Verificando autenticação...</div>
  }

  // Mostra tela de login se não estiver autenticado
  if (!autenticado) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div>
            <h1>📚 Gerenciamento de Alunos Casa de Oração</h1>
            <p>Organização por Classes</p>
          </div>
          <div className="user-info">
            <span>👤 {usuario.username}</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <section className="form-section">
          <h2>Cadastrar Novo Aluno</h2>
          <form onSubmit={cadastrarAluno}>
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Digite o nome do aluno"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dataNascimento">Data de Nascimento:</label>
              <input
                type="date"
                id="dataNascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Cadastrar Aluno
            </button>
          </form>
        </section>

        <section className="classes-section">
          <h2>Classes Disponíveis</h2>
          <p className="classes-subtitle">
            {classeSelecionada 
              ? `Filtrando por: ${classeSelecionada.nome} - Clique novamente para mostrar todos` 
              : 'Clique em uma classe para filtrar os alunos'}
          </p>
          <div className="classes-grid">
            {classes.map(classe => {
              // Formata a faixa etária corretamente
              let faixaEtaria;
              if (classe.idade_max === null) {
                faixaEtaria = `${classe.idade_min}+ anos`;
              } else {
                faixaEtaria = `${classe.idade_min} a ${classe.idade_max - 1} anos`;
              }
              
              const isSelected = classeSelecionada?.id === classe.id;
              const alunosNaClasse = alunos.filter(a => a.classe.id === classe.id).length;
              
              return (
                <div 
                  key={classe.id} 
                  className={`classe-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => selecionarClasse(classe)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{classe.nome}</h3>
                  <p>{faixaEtaria}</p>
                  <span className="alunos-count">{alunosNaClasse} aluno(s)</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="alunos-section">
          <div className="section-header">
            <h2>
              {classeSelecionada 
                ? `Alunos da Classe ${classeSelecionada.nome} (${alunosFiltrados.length})`
                : `Alunos Cadastrados (${alunos.length})`}
            </h2>
            <div className="header-actions">
              {classeSelecionada && (
                <button 
                  onClick={() => setClasseSelecionada(null)} 
                  className="btn btn-limpar"
                >
                  Mostrar Todos
                </button>
              )}
              <button onClick={revalidarClasses} className="btn btn-secondary">
                Revalidar Classes
              </button>
            </div>
          </div>
          
          {alunosFiltrados.length === 0 ? (
            <p className="empty-message">
              {classeSelecionada 
                ? `Nenhum aluno cadastrado na classe ${classeSelecionada.nome}.`
                : 'Nenhum aluno cadastrado ainda.'}
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Data Nascimento</th>
                    <th>Idade</th>
                    <th>Classe</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosFiltrados.map(aluno => {
                    // Corrige problema de timezone na data
                    let dataFormatada = 'Data inválida'
                    if (aluno.data_nascimento) {
                      const dataParts = aluno.data_nascimento.split('T')[0].split('-')
                      dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`
                    }
                    
                    return (
                      <tr key={aluno.id}>
                        <td>{aluno.nome || 'N/A'}</td>
                        <td>{dataFormatada}</td>
                        <td>{aluno.idade !== undefined ? `${aluno.idade} anos` : 'N/A'}</td>
                        <td>
                          <span className="classe-badge">
                            {aluno.classe?.nome || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => abrirModalEdicao(aluno)}
                              className="btn-action btn-edit"
                              title="Editar aluno"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deletarAluno(aluno)}
                              className="btn-action btn-delete"
                              title="Deletar aluno"
                            >
                              🗑️
                            </button> 
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Modal de Edição */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Aluno</h2>
              <button className="btn-close" onClick={fecharModal}>✕</button>
            </div>
            
            <form onSubmit={editarAluno} className="modal-form">
              <div className="form-group">
                <label htmlFor="nomeEdicao">Nome:</label>
                <input
                  type="text"
                  id="nomeEdicao"
                  value={nomeEdicao}
                  onChange={(e) => setNomeEdicao(e.target.value)}
                  required
                  placeholder="Digite o nome do aluno"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dataNascimentoEdicao">Data de Nascimento:</label>
                <input
                  type="date"
                  id="dataNascimentoEdicao"
                  value={dataNascimentoEdicao}
                  onChange={(e) => setDataNascimentoEdicao(e.target.value)}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={fecharModal} className="btn btn-secondary" disabled={salvando}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
