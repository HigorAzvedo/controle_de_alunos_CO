/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('classes', (table) => {
    table.integer('professor_id').unsigned().nullable();

    table.foreign('professor_id')
      .references('id')
      .inTable('alunos')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');

    table.index('professor_id', 'idx_classe_professor');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('classes', (table) => {
    table.dropIndex('professor_id', 'idx_classe_professor');
    table.dropForeign('professor_id');
    table.dropColumn('professor_id');
  });
};
