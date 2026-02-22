/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('classes', (table) => {
    table.increments('id').primary();
    table.string('nome', 50).notNullable().unique();
    table.integer('idade_min').notNullable();
    table.integer('idade_max').nullable(); // NULL para classe sem limite superior
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Índice para busca por faixa etária
    table.index(['idade_min', 'idade_max'], 'idx_faixa_etaria');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('classes');
};
