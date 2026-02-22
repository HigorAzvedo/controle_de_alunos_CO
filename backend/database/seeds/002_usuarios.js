const bcrypt = require('bcryptjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deleta todos os dados existentes
  // ATENÇÃO: Esta ordem é importante por causa das foreign keys
  // Se houver outras tabelas dependentes, delete-as primeiro
  
  await knex('usuarios').del()
  
  // Hash da senha 'admin123'
  const passwordHash = await bcrypt.hash('admin123', 10)
  
  // Insere usuários padrão
  await knex('usuarios').insert([
    {
      username: 'admin',
      password_hash: passwordHash
    }
  ])
}
