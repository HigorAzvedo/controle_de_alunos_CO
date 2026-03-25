const db = require('../config/database');
const alunoService = require('../services/alunoService');

/**
 * Lista todas as classes disponíveis
 */
async function listarClasses(req, res) {
  try {
    const classes = await db('classes')
      .select('id', 'nome', 'idade_min', 'idade_max')
      .orderBy('idade_min');

    const relacoesProfessores = await db('classe_professores')
      .join('alunos', 'classe_professores.professor_id', 'alunos.id')
      .select(
        'classe_professores.classe_id',
        'alunos.id as professor_id',
        'alunos.nome as professor_nome'
      )
      .orderBy('alunos.nome');

    const professoresPorClasse = relacoesProfessores.reduce((acc, relacao) => {
      if (!acc[relacao.classe_id]) {
        acc[relacao.classe_id] = [];
      }

      acc[relacao.classe_id].push({
        id: relacao.professor_id,
        nome: relacao.professor_nome
      });

      return acc;
    }, {});

    const classesFormatadas = classes.map((classe) => ({
      id: classe.id,
      nome: classe.nome,
      idade_min: classe.idade_min,
      idade_max: classe.idade_max,
      professores: professoresPorClasse[classe.id] || []
    }));
    
    res.json({
      total: classesFormatadas.length,
      classes: classesFormatadas
    });
  } catch (error) {
    console.error('Erro ao listar classes:', error);
    res.status(500).json({
      erro: 'Erro ao listar classes',
      detalhes: error.message
    });
  }
}

async function definirProfessorDaClasse(req, res) {
  try {
    const { id } = req.params;
    const { professor_id } = req.body;

    const classe = await db('classes').where('id', id).first();
    if (!classe) {
      return res.status(404).json({
        erro: 'Classe não encontrada'
      });
    }

    if (professor_id === null || professor_id === undefined || professor_id === '') {
      return res.status(400).json({
        erro: 'Informe o aluno que será definido como professor'
      });
    }

    const professor = await db('alunos')
      .select('id', 'nome')
      .where('id', professor_id)
      .first();

    if (!professor) {
      return res.status(404).json({
        erro: 'Aluno selecionado como professor não foi encontrado'
      });
    }

    const relacaoExistente = await db('classe_professores')
      .where({
        classe_id: id,
        professor_id: professor.id
      })
      .first();

    if (relacaoExistente) {
      const alunoJaNaClasse = await db('alunos')
        .select('classe_id')
        .where('id', professor.id)
        .first();

      if (!alunoJaNaClasse || alunoJaNaClasse.classe_id !== Number(id)) {
        await db('alunos')
          .where('id', professor.id)
          .update({
            classe_id: id,
            updated_at: db.fn.now()
          });
      }

      return res.json({
        mensagem: 'Este aluno já é professor desta classe e foi sincronizado na turma'
      });
    }

    await db('classe_professores')
      .where('professor_id', professor.id)
      .del();

    await db('classe_professores').insert({
      classe_id: id,
      professor_id: professor.id
    });

    await db('alunos')
      .where('id', professor.id)
      .update({
        classe_id: id,
        updated_at: db.fn.now()
      });

    await db('classes')
      .where('id', id)
      .update({ updated_at: db.fn.now() });

    const professoresClasse = await db('classe_professores')
      .join('alunos', 'classe_professores.professor_id', 'alunos.id')
      .select('alunos.id', 'alunos.nome')
      .where('classe_professores.classe_id', id)
      .orderBy('alunos.nome');

    res.json({
      mensagem: 'Professor adicionado com sucesso e movido para a classe selecionada',
      classe: {
        id: classe.id,
        nome: classe.nome,
        idade_min: classe.idade_min,
        idade_max: classe.idade_max,
        professores: professoresClasse
      }
    });
  } catch (error) {
    console.error('Erro ao definir professor da classe:', error);
    res.status(500).json({
      erro: 'Erro ao definir professor da classe',
      detalhes: error.message
    });
  }
}

async function removerProfessorDaClasse(req, res) {
  try {
    const { id, professorId } = req.params;

    const classe = await db('classes').where('id', id).first();
    if (!classe) {
      return res.status(404).json({
        erro: 'Classe não encontrada'
      });
    }

    const professor = await db('alunos')
      .select('id', 'nome', 'data_nascimento')
      .where('id', professorId)
      .first();

    if (!professor) {
      return res.status(404).json({
        erro: 'Professor não encontrado'
      });
    }

    const relacao = await db('classe_professores')
      .where({
        classe_id: id,
        professor_id: professorId
      })
      .first();

    if (!relacao) {
      return res.status(404).json({
        erro: 'Este aluno não é professor desta classe'
      });
    }

    await db('classe_professores')
      .where({
        classe_id: id,
        professor_id: professorId
      })
      .del();

    const { classe: classePorIdade } = await alunoService.obterClassePorDataNascimento(professor.data_nascimento);

    await db('alunos')
      .where('id', professorId)
      .update({
        classe_id: classePorIdade.id,
        updated_at: db.fn.now()
      });

    res.json({
      mensagem: 'Professor removido da classe e realocado pela idade',
      professor: {
        id: professor.id,
        nome: professor.nome,
        nova_classe: {
          id: classePorIdade.id,
          nome: classePorIdade.nome
        }
      }
    });
  } catch (error) {
    console.error('Erro ao remover professor da classe:', error);
    res.status(500).json({
      erro: 'Erro ao remover professor da classe',
      detalhes: error.message
    });
  }
}

module.exports = {
  listarClasses,
  definirProfessorDaClasse,
  removerProfessorDaClasse
};
