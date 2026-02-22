/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('alunos', (table) => {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.date('data_nascimento').notNullable();
    table.integer('classe_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Chave estrangeira
    table.foreign('classe_id')
      .references('id')
      .inTable('classes')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    
    // Índices
    table.index('classe_id', 'idx_classe');
    table.index('data_nascimento', 'idx_data_nascimento');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('alunos');
};
