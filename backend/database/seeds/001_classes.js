/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deleta alunos primeiro (por causa da foreign key)
  await knex('alunos').del();
  
  // Deleta registros existentes de classes
  await knex('classes').del();
  
  // Insere as classes predefinidas
  // Regra: idade_min (inclusivo) <= idade < idade_max (exclusivo)
  // Exemplo: 3 anos está em Samuel (3 a 7), não em Moisés (0 a 3)
  await knex('classes').insert([
    { 
      nome: 'Moisés', 
      idade_min: 0, 
      idade_max: 3   // 0, 1, 2 anos
    },
    { 
      nome: 'Samuel', 
      idade_min: 3, 
      idade_max: 7   // 3, 4, 5, 6 anos
    },
    { 
      nome: 'Josué', 
      idade_min: 7, 
      idade_max: 10  // 7, 8, 9 anos
    },
    { 
      nome: 'Paulo', 
      idade_min: 10, 
      idade_max: 13  // 10, 11, 12 anos
    },
    { 
      nome: 'Daniel', 
      idade_min: 13, 
      idade_max: 18  // 13, 14, 15, 16, 17 anos
    },
    { 
      nome: 'Embaixadores', 
      idade_min: 18, 
      idade_max: 30  // 18 a 29 anos
    },
    { 
      nome: 'Arautos', 
      idade_min: 30, 
      idade_max: null  // 30 anos ou mais
    }
  ]);
};
