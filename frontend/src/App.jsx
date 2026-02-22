import { useState, useEffect } from 'react'
import './App.css'
import Login from './Login'
import api from './config/api'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
  
  // Estados para modal de confirmação de exclusão
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false)
  const [alunoDeletando, setAlunoDeletando] = useState(null)
  const [deletando, setDeletando] = useState(false)
  
  // Estados de autenticação
  const [autenticado, setAutenticado] = useState(false)
  const [token, setToken] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [verificandoAuth, setVerificandoAuth] = useState(true)

  useEffect(() => {
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
      const [alunosRes, classesRes] = await Promise.all([
        api.get('/alunos'),
        api.get('/classes')
      ])
      
      setAlunos(alunosRes.data.alunos || [])
      setClasses(classesRes.data.classes || [])
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const cadastrarAluno = async (e) => {
    e.preventDefault()
    
    try {
      await api.post('/alunos', {
        nome,
        data_nascimento: dataNascimento
      })
      
      toast.success('Aluno cadastrado com sucesso!')
      setNome('')
      setDataNascimento('')
      carregarDados()
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        toast.error(`Erro: ${error.response?.data?.erro || 'Erro ao cadastrar aluno'}`)
      }
    }
  }

  const revalidarClasses = async () => {
    try {
      const response = await api.put('/alunos/revalidar-classes')
      
      toast.success(`Revalidação concluída! ${response.data.resultado.atualizados} aluno(s) atualizado(s)`)
      carregarDados()
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        toast.error('Erro ao revalidar classes')
      }
    }
  }

  const abrirModalEdicao = (aluno) => {
    setAlunoEditando(aluno)
    setNomeEdicao(aluno.nome)
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
      await api.put(`/alunos/${alunoEditando.id}`, {
        nome: nomeEdicao,
        data_nascimento: dataNascimentoEdicao
      })
      
      toast.success('Aluno atualizado com sucesso!')
      fecharModal()
      carregarDados()
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        toast.error(`Erro: ${error.response?.data?.erro || 'Erro ao editar aluno'}`)
      }
    } finally {
      setSalvando(false)
    }
  }

  const abrirModalDelete = (aluno) => {
    setAlunoDeletando(aluno)
    setModalDeleteAberto(true)
  }

  const fecharModalDelete = () => {
    setModalDeleteAberto(false)
    setAlunoDeletando(null)
  }

  const confirmarDelete = async () => {
    setDeletando(true)
    
    try {
      await api.delete(`/alunos/${alunoDeletando.id}`)
      
      toast.success('Aluno deletado com sucesso!')
      fecharModalDelete()
      carregarDados()
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        toast.error(`Erro: ${error.response?.data?.erro || 'Erro ao deletar aluno'}`)
      }
    } finally {
      setDeletando(false)
    }
  }

  const selecionarClasse = (classe) => {
    if (classeSelecionada?.id === classe.id) {
      setClasseSelecionada(null)
    } else {
      setClasseSelecionada(classe)
    }
  }

  const alunosFiltrados = classeSelecionada
    ? alunos.filter(aluno => aluno.classe.id === classeSelecionada.id)
    : alunos

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

  if (verificandoAuth) {
    return <div className="loading">Verificando autenticação...</div>
  }

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
            <h1>Gerenciamento de Alunos Casa de Oração</h1>
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
                    <th className="data-nascimento-col">Data Nascimento</th>
                    <th>Idade</th>
                    <th>Classe</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosFiltrados.map(aluno => {
                    let dataFormatada = 'Data inválida'
                    if (aluno.data_nascimento) {
                      const dataParts = aluno.data_nascimento.split('T')[0].split('-')
                      dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`
                    }
                    
                    return (
                      <tr key={aluno.id}>
                        <td>{aluno.nome || 'N/A'}</td>
                        <td className="data-nascimento-col">{dataFormatada}</td>
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
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => abrirModalDelete(aluno)}
                              className="btn-action btn-delete"
                              title="Deletar aluno"
                            >
                              <FaTrash />
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
      
      {/* Modal de Confirmação de Exclusão */}
      {modalDeleteAberto && (
        <div className="modal-overlay" onClick={fecharModalDelete}>
          <div className="modal-content modal-delete" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Exclusão</h2>
            </div>
            
            <div className="modal-body">
              <p className="delete-warning">
                Tem certeza que deseja deletar o aluno:
              </p>
              <p className="delete-student-name">
                <strong>{alunoDeletando?.nome}</strong>
              </p>
              <p className="delete-info">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={fecharModalDelete} 
                className="btn btn-secondary"
                disabled={deletando}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={confirmarDelete} 
                className="btn btn-danger"
                disabled={deletando}
              >
                {deletando ? 'Deletando...' : 'Sim, Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default App
