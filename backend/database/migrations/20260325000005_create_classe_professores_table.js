/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const tabelaExiste = await knex.schema.hasTable('classe_professores');

  if (!tabelaExiste) {
    await knex.schema.createTable('classe_professores', (table) => {
      table.increments('id').primary();
      table.integer('classe_id').unsigned().notNullable();
      table.integer('professor_id').unsigned().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.foreign('classe_id')
        .references('id')
        .inTable('classes')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table.foreign('professor_id')
        .references('id')
        .inTable('alunos')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      table.unique(['classe_id', 'professor_id'], 'uk_classe_professor');
      table.index('classe_id', 'idx_classe_professores_classe');
      table.index('professor_id', 'idx_classe_professores_professor');
    });
  }

  const colunaProfessorExiste = await knex.schema.hasColumn('classes', 'professor_id');

  if (colunaProfessorExiste) {
    await knex.raw(`
      INSERT INTO classe_professores (classe_id, professor_id)
      SELECT id AS classe_id, professor_id
      FROM classes
      WHERE professor_id IS NOT NULL
      ON CONFLICT (classe_id, professor_id) DO NOTHING
    `);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const tabelaExiste = await knex.schema.hasTable('classe_professores');

  if (tabelaExiste) {
    await knex.schema.dropTable('classe_professores');
  }
};
