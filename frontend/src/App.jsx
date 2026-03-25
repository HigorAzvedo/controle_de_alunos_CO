import { useState, useEffect } from 'react'
import './App.css'
import Login from './Login'
import api from './config/api'
import { FaEdit, FaTrash, FaUserTie } from 'react-icons/fa'
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
  const [buscaNome, setBuscaNome] = useState('')
  const [mesAniversario, setMesAniversario] = useState('')
  const [modalProfessorAberto, setModalProfessorAberto] = useState(false)
  const [alunoProfessorSelecionado, setAlunoProfessorSelecionado] = useState(null)
  const [classeProfessorSelecionada, setClasseProfessorSelecionada] = useState('')
  const [salvandoProfessor, setSalvandoProfessor] = useState(false)

  // Estado para filtro por classe
  const [classeSelecionada, setClasseSelecionada] = useState(null)

  // Estados para modal de confirmação de exclusão
  const [modalDeleteAberto, setModalDeleteAberto] = useState(false)
  const [alunoDeletando, setAlunoDeletando] = useState(null)
  const [deletando, setDeletando] = useState(false)

  // Estados para modal de resultado de revalidação
  const [modalRevalidacaoAberto, setModalRevalidacaoAberto] = useState(false)
  const [resultadoRevalidacao, setResultadoRevalidacao] = useState(null)

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
      const resultado = response.data.resultado

      // Se houve mudanças, buscar detalhes completos dos alunos
      if (resultado.atualizados > 0 && resultado.detalhes) {
        const alunosAlterados = []

        for (const detalhe of resultado.detalhes) {
          if (!detalhe.erro) {
            const classeAnterior = classes.find(c => c.id === detalhe.classe_anterior)
            const classeNova = classes.find(c => c.id === detalhe.classe_nova)

            alunosAlterados.push({
              nome: detalhe.aluno_nome,
              idade: detalhe.idade,
              classeAnterior: classeAnterior?.nome || 'N/A',
              classeNova: classeNova?.nome || 'N/A'
            })
          }
        }

        setResultadoRevalidacao({
          total: resultado.total_alunos,
          atualizados: resultado.atualizados,
          erros: resultado.erros,
          alunosAlterados
        })

        await carregarDados() // Recarregar dados antes de abrir modal
        setModalRevalidacaoAberto(true)
      } else {
        toast.info('Nenhuma alteração necessária. Todos os alunos já estão nas classes corretas!')
      }

      if (resultado.atualizados > 0) {
        carregarDados()
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        toast.error('Erro ao revalidar classes')
      }
    }
  }

  const fecharModalRevalidacao = () => {
    setModalRevalidacaoAberto(false)
    setResultadoRevalidacao(null)
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

  const abrirModalProfessor = (aluno) => {
    const classeAtualProfessor = classes.find(classe =>
      classe.professores?.some(professor => professor.id === aluno.id)
    )
    setAlunoProfessorSelecionado(aluno)
    setClasseProfessorSelecionada(classeAtualProfessor ? String(classeAtualProfessor.id) : '')
    setModalProfessorAberto(true)
  }

  const fecharModalProfessor = () => {
    setModalProfessorAberto(false)
    setAlunoProfessorSelecionado(null)
    setClasseProfessorSelecionada('')
  }

  const confirmarProfessorDaClasse = async () => {
    if (!classeProfessorSelecionada) {
      toast.error('Selecione uma classe para definir o professor')
      return
    }

    try {
      setSalvandoProfessor(true)

      const response = await api.put(`/classes/${classeProfessorSelecionada}/professor`, {
        professor_id: alunoProfessorSelecionado.id
      })

      toast.success(response.data?.mensagem || 'Professor definido com sucesso!')
      await carregarDados()
      fecharModalProfessor()
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        toast.error(`Erro: ${error.response?.data?.erro || 'Erro ao definir professor'}`)
      }
    } finally {
      setSalvandoProfessor(false)
    }
  }

  const removerProfessorDaClasse = async () => {
    if (!alunoProfessorSelecionado) {
      return
    }

    const classeAtualProfessor = classes.find(classe =>
      classe.professores?.some(professor => professor.id === alunoProfessorSelecionado.id)
    )

    if (!classeAtualProfessor) {
      toast.info('Este aluno não está como professor em nenhuma classe')
      return
    }

    try {
      setSalvandoProfessor(true)

      const response = await api.delete(
        `/classes/${classeAtualProfessor.id}/professor/${alunoProfessorSelecionado.id}`
      )

      toast.success(response.data?.mensagem || 'Professor removido com sucesso!')
      await carregarDados()
      fecharModalProfessor()
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout()
      } else {
        toast.error(`Erro: ${error.response?.data?.erro || 'Erro ao remover professor'}`)
      }
    } finally {
      setSalvandoProfessor(false)
    }
  }

  const classeSelecionadaAtual = classeSelecionada
    ? classes.find(classe => classe.id === classeSelecionada.id) || classeSelecionada
    : null

  const alunosFiltradosPorClasse = classeSelecionadaAtual
    ? alunos.filter(aluno => aluno.classe.id === classeSelecionadaAtual.id)
    : alunos

  const termoBusca = buscaNome.trim().toLowerCase()
  const alunosFiltradosPorNome = termoBusca
    ? alunosFiltradosPorClasse.filter(aluno =>
      aluno.nome?.trim().toLowerCase().startsWith(termoBusca)
    )
    : alunosFiltradosPorClasse

  const alunosFiltrados = mesAniversario
    ? alunosFiltradosPorNome.filter(aluno => {
      const dataSomente = aluno.data_nascimento?.split('T')[0]
      const mesNascimento = dataSomente?.split('-')[1]
      return mesNascimento === mesAniversario
    })
    : alunosFiltradosPorNome

  const professorIds = new Set(
    classes.flatMap(classe => (classe.professores || []).map(professor => professor.id))
  )

  const classesProfessorPorAluno = classes.reduce((acumulador, classe) => {
    (classe.professores || []).forEach((professor) => {
      if (!acumulador[professor.id]) {
        acumulador[professor.id] = []
      }

      acumulador[professor.id].push(classe.nome)
    })

    return acumulador
  }, {})

  const classeProfessorAtualDoAluno = alunoProfessorSelecionado
    ? classes.find(classe =>
      classe.professores?.some(professor => professor.id === alunoProfessorSelecionado.id)
    )
    : null

  const meses = [
    { valor: '01', label: 'Janeiro' },
    { valor: '02', label: 'Fevereiro' },
    { valor: '03', label: 'Março' },
    { valor: '04', label: 'Abril' },
    { valor: '05', label: 'Maio' },
    { valor: '06', label: 'Junho' },
    { valor: '07', label: 'Julho' },
    { valor: '08', label: 'Agosto' },
    { valor: '09', label: 'Setembro' },
    { valor: '10', label: 'Outubro' },
    { valor: '11', label: 'Novembro' },
    { valor: '12', label: 'Dezembro' }
  ]

  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const hoje = new Date()
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - hoje.getDay())
  inicioSemana.setHours(0, 0, 0, 0)

  const fimSemana = new Date(inicioSemana)
  fimSemana.setDate(inicioSemana.getDate() + 6)
  fimSemana.setHours(23, 59, 59, 999)

  const anosParaComparar = Array.from(
    new Set([inicioSemana.getFullYear(), fimSemana.getFullYear()])
  )

  const aniversariantesDaSemana = alunos
    .map((aluno) => {
      const dataSomente = aluno.data_nascimento?.split('T')[0]
      if (!dataSomente) {
        return null
      }

      const [, mes, dia] = dataSomente.split('-')
      if (!mes || !dia) {
        return null
      }

      let aniversarioNaSemana = null

      for (const ano of anosParaComparar) {
        const aniversario = new Date(ano, Number(mes) - 1, Number(dia))
        if (aniversario >= inicioSemana && aniversario <= fimSemana) {
          aniversarioNaSemana = aniversario
          break
        }
      }

      if (!aniversarioNaSemana) {
        return null
      }

      return {
        ...aluno,
        aniversarioSemana: aniversarioNaSemana
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.aniversarioSemana - b.aniversarioSemana)

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

        <section className="aniversariantes-section">
          <h2>Aniversariantes da Semana</h2>
          <p className="classes-subtitle">
            Semana atual: {formatarData(inicioSemana)} até {formatarData(fimSemana)}
          </p>

          {aniversariantesDaSemana.length === 0 ? (
            <p className="empty-message">Nenhum aniversariante nesta semana.</p>
          ) : (
            <div className="aniversariantes-grid">
              {aniversariantesDaSemana.map((aluno) => (
                <div key={aluno.id} className="aniversariante-card">
                  <h3>{aluno.nome}</h3>
                  <p>
                    🎂 {String(aluno.aniversarioSemana.getDate()).padStart(2, '0')}/
                    {String(aluno.aniversarioSemana.getMonth() + 1).padStart(2, '0')}
                  </p>
                  <span className="alunos-count">{aluno.classe?.nome || 'Sem classe'}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="classes-section">
          <h2>Classes Disponíveis</h2>
          <p className="classes-subtitle">
            {classeSelecionadaAtual
              ? `Filtrando por: ${classeSelecionadaAtual.nome} - Clique novamente para mostrar todos`
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
              {classeSelecionadaAtual
                ? `Alunos da Classe ${classeSelecionadaAtual.nome} (${alunosFiltrados.length})`
                : `Alunos Cadastrados (${alunosFiltrados.length})`}
            </h2>
            <div className="header-actions">
              {classeSelecionadaAtual && (
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

          {classeSelecionadaAtual && (
            <p className="professor-da-classe">
              Professores da classe: <strong>{classeSelecionadaAtual.professores?.length
                ? classeSelecionadaAtual.professores.map(professor => professor.nome).join(', ')
                : 'Não definido'}</strong>
            </p>
          )}

          <div className="table-filters">
            <input
              type="text"
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
              placeholder="Buscar aluno"
              className="search-input"
            />
            <select
              value={mesAniversario}
              onChange={(e) => setMesAniversario(e.target.value)}
              className="month-filter"
            >
              <option value="">Todos os meses</option>
              {meses.map(mes => (
                <option key={mes.valor} value={mes.valor}>
                  {mes.label}
                </option>
              ))}
            </select>
          </div>

          <p className="professor-legend">🟨 Linha amarela = professor</p>

          {alunosFiltrados.length === 0 ? (
            <p className="empty-message">
              {buscaNome.trim()
                ? `Nenhum aluno encontrado para "${buscaNome.trim()}".`
                : mesAniversario
                  ? 'Nenhum aluno encontrado para o mês selecionado.'
                : classeSelecionadaAtual
                  ? `Nenhum aluno cadastrado na classe ${classeSelecionadaAtual.nome}.`
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
                      <tr
                        key={aluno.id}
                        className={professorIds.has(aluno.id) ? 'aluno-professor-row' : ''}
                      >
                        <td>
                          <div>{aluno.nome || 'N/A'}</div>
                          {professorIds.has(aluno.id) && (
                            <small className="professor-classes-info">
                              Professor da(s) classe(s): {classesProfessorPorAluno[aluno.id]?.join(', ')}
                            </small>
                          )}
                        </td>
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
                              onClick={() => abrirModalProfessor(aluno)}
                              className="btn-action btn-professor"
                              title="Definir aluno como professor"
                            >
                              <FaUserTie />
                            </button>
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

      {/* Modal de Definição de Professor */}
      {modalProfessorAberto && alunoProfessorSelecionado && (
        <div className="modal-overlay" onClick={fecharModalProfessor}>
          <div className="modal-content modal-professor" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Definir Professor da Classe</h2>
              <button className="btn-close" onClick={fecharModalProfessor}>✕</button>
            </div>

            <div className="modal-body">
              <p className="delete-warning">
                Aluno selecionado: <strong>{alunoProfessorSelecionado.nome}</strong>
              </p>

              <p className="professor-atual-info">
                Classe atual como professor: <strong>{classeProfessorAtualDoAluno?.nome || 'Nenhuma'}</strong>
              </p>

              <div className="form-group">
                <label htmlFor="classeProfessor">Selecione a classe:</label>
                <select
                  id="classeProfessor"
                  value={classeProfessorSelecionada}
                  onChange={(e) => setClasseProfessorSelecionada(e.target.value)}
                  disabled={salvandoProfessor}
                >
                  <option value="">Selecione uma classe</option>
                  {classes.map(classe => (
                    <option key={classe.id} value={classe.id}>
                      {classe.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={fecharModalProfessor}
                className="btn btn-secondary"
                disabled={salvandoProfessor}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={removerProfessorDaClasse}
                className="btn btn-danger"
                disabled={salvandoProfessor || !classeProfessorAtualDoAluno}
              >
                Remover Professor
              </button>
              <button
                type="button"
                onClick={confirmarProfessorDaClasse}
                className="btn btn-primary"
                disabled={salvandoProfessor}
              >
                {salvandoProfessor ? 'Salvando...' : 'Salvar Professor'}
              </button>
            </div>
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

      {/* Modal de Resultado de Revalidação */}
      {modalRevalidacaoAberto && resultadoRevalidacao && (
        <div className="modal-overlay" onClick={fecharModalRevalidacao}>
          <div className="modal-content modal-revalidacao" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✅ Revalidação Concluída</h2>
            </div>

            <div className="modal-body">
              <div className="revalidacao-summary">
                <p><strong>Total de alunos:</strong> {resultadoRevalidacao.total}</p>
                <p><strong>Alunos atualizados:</strong> {resultadoRevalidacao.atualizados}</p>
                {resultadoRevalidacao.erros > 0 && (
                  <p className="text-error"><strong>Erros:</strong> {resultadoRevalidacao.erros}</p>
                )}
              </div>

              {resultadoRevalidacao.alunosAlterados.length > 0 && (
                <>
                  <h3 className="mudancas-title">Alunos que Mudaram de Classe:</h3>
                  <div className="mudancas-lista">
                    {resultadoRevalidacao.alunosAlterados.map((aluno, index) => (
                      <div key={index} className="mudanca-item">
                        <div className="mudanca-nome">
                          <span>{aluno.nome}</span>
                          <span className="mudanca-idade">({aluno.idade} anos)</span>
                        </div>
                        <div className="mudanca-classes">
                          <span className="classe-antiga">{aluno.classeAnterior}</span>
                          <span className="mudanca-seta">→</span>
                          <span className="classe-nova">{aluno.classeNova}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={fecharModalRevalidacao}
                className="btn btn-primary"
              >
                Fechar
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
