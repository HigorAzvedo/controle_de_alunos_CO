const path = require('path');
const knex = require('knex');
const knexConfig = require('../../knexfile');

/**
 * Executa as migrations automaticamente
 * Útil para rodar na inicialização do servidor
 */
async function runMigrations() {
  try {
    const environment = process.env.NODE_ENV || 'development';
    const config = knexConfig[environment];
    
    console.log(`\n📦 Executando migrations no ambiente: ${environment}`);
    
    const db = knex(config);
    
    // Executa as migrations
    const [batchNo, log] = await db.migrate.latest({
      directory: path.join(__dirname, '../../database/migrations')
    });
    
    if (log.length === 0) {
      console.log('✅ Banco de dados já está atualizado\n');
    } else {
      console.log('✅ Migrations executadas com sucesso:');
      log.forEach(migration => console.log(`   - ${migration}`));
      console.log('');
    }
    
    await db.destroy();
    return true;
  } catch (error) {
    console.error('❌ Erro ao executar migrations:');
    console.error(error.message);
    console.error('\n⚠️ IMPORTANTE: Se estiver rodando na Vercel, verifique:');
    console.error('1. DATABASE_URL está configurada corretamente');
    console.error('2. O banco de dados existe no Neon');
    console.error('3. A conexão permite SSL (sslmode=require)\n');
    
    // Não para a aplicação em produção, apenas loga o erro
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Continuando mesmo com erro de migration...');
      return false;
    }
    
    throw error;
  }
}

module.exports = { runMigrations };
