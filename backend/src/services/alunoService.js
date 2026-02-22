const db = require('../config/database');

/**
 * Calcula a idade a partir da data de nascimento
 * @param {string} dataNascimento - Data no formato YYYY-MM-DD
 * @returns {number} Idade em anos
 */
function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  // Ajusta se ainda não fez aniversário no ano atual
  if (mesAtual < mesNascimento || 
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

/**
 * Determina a classe apropriada baseada na idade
 * Regra: idade_min (inclusivo) <= idade < idade_max (exclusivo)
 * @param {number} idade - Idade do aluno
 * @returns {Promise<Object|null>} Objeto da classe ou null se não encontrada
 */
async function determinarClasse(idade) {
  try {
    // Busca a classe que corresponde à idade
    // idade_min <= idade AND (idade_max > idade OR idade_max IS NULL)
    const classe = await db('classes')
      .where('idade_min', '<=', idade)
      .andWhere(function() {
        this.where('idade_max', '>', idade)
            .orWhereNull('idade_max');
      })
      .first();
    
    return classe;
  } catch (error) {
    console.error('Erro ao determinar classe:', error);
    throw new Error('Erro ao buscar classe apropriada');
  }
}

/**
 * Obtém a classe correta para um aluno baseado na data de nascimento
 * @param {string} dataNascimento - Data no formato YYYY-MM-DD
 * @returns {Promise<Object>} Objeto contendo idade e classe
 */
async function obterClassePorDataNascimento(dataNascimento) {
  const idade = calcularIdade(dataNascimento);
  const classe = await determinarClasse(idade);
  
  if (!classe) {
    throw new Error(`Nenhuma classe encontrada para idade ${idade} anos`);
  }
  
  return {
    idade,
    classe
  };
}

/**
 * Revalida e atualiza as classes de todos os alunos
 * @returns {Promise<Object>} Estatísticas da revalidação
 */
async function revalidarTodasAsClasses() {
  try {
    // Busca todos os alunos
    const alunos = await db('alunos').select('id', 'data_nascimento', 'classe_id');
    
    let atualizados = 0;
    let erros = 0;
    const detalhes = [];
    
    for (const aluno of alunos) {
      try {
        const idade = calcularIdade(aluno.data_nascimento);
        const classeCorreta = await determinarClasse(idade);
        
        if (!classeCorreta) {
          erros++;
          detalhes.push({
            aluno_id: aluno.id,
            erro: `Nenhuma classe encontrada para idade ${idade}`
          });
          continue;
        }
        
        // Atualiza apenas se a classe mudou
        if (aluno.classe_id !== classeCorreta.id) {
          await db('alunos')
            .where('id', aluno.id)
            .update({
              classe_id: classeCorreta.id,
              updated_at: db.fn.now()
            });
          
          atualizados++;
          detalhes.push({
            aluno_id: aluno.id,
            classe_anterior: aluno.classe_id,
            classe_nova: classeCorreta.id,
            idade
          });
        }
      } catch (error) {
        erros++;
        detalhes.push({
          aluno_id: aluno.id,
          erro: error.message
        });
      }
    }
    
    return {
      total_alunos: alunos.length,
      atualizados,
      erros,
      detalhes: detalhes.length > 0 ? detalhes : undefined
    };
  } catch (error) {
    console.error('Erro ao revalidar classes:', error);
    throw new Error('Erro ao revalidar classes dos alunos');
  }
}

module.exports = {
  calcularIdade,
  determinarClasse,
  obterClassePorDataNascimento,
  revalidarTodasAsClasses
};
