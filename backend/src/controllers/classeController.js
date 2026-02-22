const db = require('../config/database');

/**
 * Lista todas as classes disponíveis
 */
async function listarClasses(req, res) {
  try {
    const classes = await db('classes')
      .select('id', 'nome', 'idade_min', 'idade_max')
      .orderBy('idade_min');
    
    res.json({
      total: classes.length,
      classes
    });
  } catch (error) {
    console.error('Erro ao listar classes:', error);
    res.status(500).json({
      erro: 'Erro ao listar classes',
      detalhes: error.message
    });
  }
}

module.exports = {
  listarClasses
};
