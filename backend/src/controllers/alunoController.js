const db = require('../config/database');
const alunoService = require('../services/alunoService');

/**
 * Cadastra um novo aluno
 */
async function cadastrarAluno(req, res) {
  try {
    const { nome, data_nascimento } = req.body;
    
    // Validações básicas
    if (!nome || !data_nascimento) {
      return res.status(400).json({
        erro: 'Nome e data de nascimento são obrigatórios'
      });
    }
    
    // Valida formato da data
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dataRegex.test(data_nascimento)) {
      return res.status(400).json({
        erro: 'Data de nascimento deve estar no formato YYYY-MM-DD'
      });
    }
    
    // Valida se a data não é futura
    const dataNasc = new Date(data_nascimento);
    if (dataNasc > new Date()) {
      return res.status(400).json({
        erro: 'Data de nascimento não pode ser futura'
      });
    }
    
    // Determina a classe baseada na idade
    const { idade, classe } = await alunoService.obterClassePorDataNascimento(data_nascimento);
    
    // Insere o aluno no banco
    const [id] = await db('alunos').insert({
      nome,
      data_nascimento,
      classe_id: classe.id
    });
    
    // Busca o aluno cadastrado com informações da classe
    const alunoCadastrado = await db('alunos')
      .select(
        'alunos.id',
        'alunos.nome',
        'alunos.data_nascimento',
        'alunos.created_at',
        'classes.id as classe_id',
        'classes.nome as classe_nome'
      )
      .join('classes', 'alunos.classe_id', 'classes.id')
      .where('alunos.id', id)
      .first();
    
    res.status(201).json({
      mensagem: 'Aluno cadastrado com sucesso',
      aluno: {
        ...alunoCadastrado,
        idade
      }
    });
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);
    res.status(500).json({
      erro: 'Erro ao cadastrar aluno',
      detalhes: error.message
    });
  }
}

/**
 * Lista todos os alunos com suas classes
 */
async function listarAlunos(req, res) {
  try {
    const alunos = await db('alunos')
      .select(
        'alunos.id',
        'alunos.nome',
        'alunos.data_nascimento',
        'alunos.created_at',
        'alunos.updated_at',
        'classes.id as classe_id',
        'classes.nome as classe_nome',
        'classes.idade_min',
        'classes.idade_max'
      )
      .join('classes', 'alunos.classe_id', 'classes.id')
      .orderBy('alunos.nome');
    
    // Calcula a idade de cada aluno
    const alunosComIdade = alunos.map(aluno => {
      // Formata a data para evitar problemas de timezone
      let dataFormatada = aluno.data_nascimento
      if (aluno.data_nascimento instanceof Date) {
        const ano = aluno.data_nascimento.getFullYear()
        const mes = String(aluno.data_nascimento.getMonth() + 1).padStart(2, '0')
        const dia = String(aluno.data_nascimento.getDate()).padStart(2, '0')
        dataFormatada = `${ano}-${mes}-${dia}`
      } else if (typeof aluno.data_nascimento === 'string') {
        // Já está em string, mantém como está
        dataFormatada = aluno.data_nascimento.split('T')[0]
      }
      
      return {
        id: aluno.id,
        nome: aluno.nome,
        data_nascimento: dataFormatada,
        idade: alunoService.calcularIdade(aluno.data_nascimento),
        classe: {
          id: aluno.classe_id,
          nome: aluno.classe_nome,
          idade_min: aluno.idade_min,
          idade_max: aluno.idade_max
        },
        created_at: aluno.created_at,
        updated_at: aluno.updated_at
      }
    });
    
    res.json({
      total: alunosComIdade.length,
      alunos: alunosComIdade
    });
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({
      erro: 'Erro ao listar alunos',
      detalhes: error.message
    });
  }
}

/**
 * Revalida as classes de todos os alunos
 */
async function revalidarClasses(req, res) {
  try {
    const resultado = await alunoService.revalidarTodasAsClasses();
    
    res.json({
      mensagem: 'Revalidação concluída',
      resultado
    });
  } catch (error) {
    console.error('Erro ao revalidar classes:', error);
    res.status(500).json({
      erro: 'Erro ao revalidar classes',
      detalhes: error.message
    });
  }
}

/**
 * Atualiza um aluno existente
 */
async function atualizarAluno(req, res) {
  try {
    const { id } = req.params;
    const { nome, data_nascimento } = req.body;
    
    // Validações básicas
    if (!nome && !data_nascimento) {
      return res.status(400).json({
        erro: 'Informe ao menos um campo para atualizar'
      });
    }
    
    // Verifica se o aluno existe
    const alunoExistente = await db('alunos').where('id', id).first();
    if (!alunoExistente) {
      return res.status(404).json({
        erro: 'Aluno não encontrado'
      });
    }
    
    const dadosAtualizacao = { updated_at: db.fn.now() };
    
    if (nome) {
      dadosAtualizacao.nome = nome;
    }
    
    if (data_nascimento) {
      // Valida formato da data
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(data_nascimento)) {
        return res.status(400).json({
          erro: 'Data de nascimento deve estar no formato YYYY-MM-DD'
        });
      }
      
      // Valida se a data não é futura
      const dataNasc = new Date(data_nascimento);
      if (dataNasc > new Date()) {
        return res.status(400).json({
          erro: 'Data de nascimento não pode ser futura'
        });
      }
      
      dadosAtualizacao.data_nascimento = data_nascimento;
      
      // Recalcula a classe se a data de nascimento mudou
      const { classe } = await alunoService.obterClassePorDataNascimento(data_nascimento);
      dadosAtualizacao.classe_id = classe.id;
    }
    
    // Atualiza o aluno
    await db('alunos').where('id', id).update(dadosAtualizacao);
    
    // Busca o aluno atualizado com informações da classe
    const alunoAtualizado = await db('alunos')
      .select(
        'alunos.id',
        'alunos.nome',
        'alunos.data_nascimento',
        'alunos.updated_at',
        'classes.id as classe_id',
        'classes.nome as classe_nome'
      )
      .join('classes', 'alunos.classe_id', 'classes.id')
      .where('alunos.id', id)
      .first();
    
    const idade = alunoService.calcularIdade(alunoAtualizado.data_nascimento);
    
    res.json({
      mensagem: 'Aluno atualizado com sucesso',
      aluno: {
        ...alunoAtualizado,
        idade
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({
      erro: 'Erro ao atualizar aluno',
      detalhes: error.message
    });
  }
}

/**
 * Deleta um aluno
 */
async function deletarAluno(req, res) {
  try {
    const { id } = req.params;
    
    // Verifica se o aluno existe
    const aluno = await db('alunos').where('id', id).first();
    if (!aluno) {
      return res.status(404).json({
        erro: 'Aluno não encontrado'
      });
    }
    
    // Deleta o aluno
    await db('alunos').where('id', id).del();
    
    res.json({
      mensagem: 'Aluno deletado com sucesso',
      aluno: {
        id: aluno.id,
        nome: aluno.nome
      }
    });
  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    res.status(500).json({
      erro: 'Erro ao deletar aluno',
      detalhes: error.message
    });
  }
}

module.exports = {
  cadastrarAluno,
  listarAlunos,
  revalidarClasses,
  atualizarAluno,
  deletarAluno
};
