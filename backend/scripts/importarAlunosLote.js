require('dotenv').config();

const db = require('../src/config/database');
const alunoService = require('../src/services/alunoService');

const alunosEntrada = [
  { nome: 'Adélia Maria Pereira', data: '04/09/1940' },
  { nome: 'José Rodrigues da Costa', data: '02/03/1944' },
  { nome: 'Pedro Diniz Carvalho', data: '02/03/2025' },
  { nome: 'Margarida Condinho Vieira Marques', data: '03/03/1960' },
  { nome: 'Ezio Astolpho Diniz Rodrigues Pereira', data: '03/03/1969' },
  { nome: 'Bianca Isabely de Resende', data: '05/03/2009' },
  { nome: 'Ana Francisca Mariano', data: '08/03/1939' },
  { nome: 'Haniel Pereira Resende Soares', data: '08/03/1999' },
  { nome: 'Talita Alves de Rezende Lázaro', data: '08/03/2012' },
  { nome: 'Maria Marta Vieira Tavares', data: '11/03/1983' },
  { nome: 'Fabiana Resende Vieira Oliveira', data: '13/03/1979' },
  { nome: 'Sebastião Rodrigues de Azevedo', data: '13/03/1959' },
  { nome: 'Eveline Edna Vieira de Resende', data: '15/03/1969' },
  { nome: 'Marlene Soares Resende Vieira', data: '15/03/1953' },
  { nome: 'Adson Luiz de Oliveira', data: '16/03/1980' },
  { nome: 'Deise Aparecida Drumond Farjado', data: '17/03/1969' },
  { nome: 'Raul Patrício de Azevedo', data: '17/03/1963' },
  { nome: 'Matilde Euzébia Fernandes', data: '18/03/1965' },
  { nome: 'Jordânia da Costa Mariano', data: '19/03/1989' },
  { nome: 'Joaz Alexsandro Alves Vieira', data: '20/03/1972' },
  { nome: 'José Elias Amorim', data: '22/03/1959' },
  { nome: 'Fabiano Martins Diniz Resende', data: '22/03/1992' },
  { nome: 'Geraldo Vitorino Mariano', data: '23/03/1946' },
  { nome: 'Dalila Inêz de Paiva Resende', data: '23/03/1972' },
  { nome: 'Alana Resende Souza Tavares', data: '25/03/2003' },
  { nome: 'Vander Resende Soares', data: '25/03/1956' },
  { nome: 'Leci Alves Vieira de Rezende', data: '27/03/1955' },
  { nome: 'Amanda Souza Diniz Carvalho', data: '27/03/1990' },
  { nome: 'Irenilda Maria Pereira Resende', data: '28/03/1960' },
  { nome: 'Edilene Sampaio Mariano', data: '01/04/1967' },
  { nome: 'Líria Nancy Alves Vieira de Rezende Lázaro', data: '02/04/1978' },
  { nome: 'Niva Vieira Soares Sírio', data: '02/04/1963' },
  { nome: 'Rodrigo Soares Resende Vieira', data: '06/04/1980' },
  { nome: 'Ana Cecília Mariano Tavares', data: '07/04/2024' },
  { nome: 'Danielle Diniz Ebnner', data: '08/04/2001' },
  { nome: 'Solange Muller Resende Kohls', data: '08/04/1978' },
  { nome: 'Dativa Maria Oliveira Lima', data: '10/04/1961' },
  { nome: 'Léssia Darci de Resende Vieira', data: '10/04/1960' },
  { nome: 'Matheus Diniz de Oliveira', data: '12/04/2011' },
  { nome: 'Anita Alzira Alves Vieira de Rezende Soares', data: '12/04/1985' },
  { nome: 'Débora Reis de Paiva Resende', data: '16/04/1956' },
  { nome: 'Luciano Alves de Resende Júnior', data: '18/04/1996' },
  { nome: 'Helena Paula Mendes', data: '18/04/2008' },
  { nome: 'Heitor Lucas Resende Dutra', data: '18/04/2017' },
  { nome: 'Lais Vieira Mariano', data: '21/04/2016' },
  { nome: 'Evans Vieira de Rezende', data: '22/04/1953' },
  { nome: 'Gustavo Costa Mariano', data: '22/04/1992' },
  { nome: 'Edimara Raquel Diniz Vieira Resende', data: '24/04/1976' },
  { nome: 'Samuel Fernandes da Silva', data: '29/04/2005' },
  { nome: 'Ezequias Resende Vieira', data: '02/05/1953' },
  { nome: 'Davi Resende Oliveira', data: '02/05/2017' },
  { nome: 'Christian Diniz Soares', data: '05/05/2005' },
  { nome: 'Jaqueline Rita Barbosa Dutra', data: '06/05/1983' },
  { nome: 'Cláudia Diniz Rodrigues Ferreira', data: '06/05/1965' },
  { nome: 'Ester Fidelis Resende', data: '06/05/20' },
  { nome: 'Eliene Camily de Resende', data: '09/05/2005' },
  { nome: 'Lébio Vinícius Vieira Tavares', data: '10/05/1987' },
  { nome: 'Wilson Trevisane', data: '11/05/1949' },
  { nome: 'Lizete Alves Diniz Vieira', data: '15/05/1956' },
  { nome: 'Denise Martins Diniz de Oliveira', data: '16/05/1983' },
  { nome: 'Suzane Eneida de Resende', data: '24/05/2006' },
  { nome: 'Rafael Alves Rodrigues Souza', data: '27/05/2024' },
  { nome: 'Diva Euzébia Fernandes Lucas', data: '27/05/1958' },
  { nome: 'Letícia Fernada Azevedo Diniz', data: '28/05/1993' },
  { nome: 'Davi Vinícius Mariano Tavares', data: '29/05/2022' },
  { nome: 'Juarez Resende Vieira', data: '29/05/1946' },
  { nome: 'Elias Resende Vieira', data: '30/05/1954' },
  { nome: 'Marcos Vinícius Amorim de Azevedo', data: '31/05/1999' },
  { nome: 'Ane Elize Resende', data: '31/05/2003' },
  { nome: 'Larissa Mariano Assis', data: '01/06/2011' },
  { nome: 'Luzia Rosa de Oliveira', data: '02/06/1949' },
  { nome: 'Alexandre Wilton de Oliveira', data: '05/06/1977' },
  { nome: 'Joel Mariano Teotonio', data: '06/06/1965' },
  { nome: 'João Severiano da Silva', data: '08/06/1942' },
  { nome: 'Sonia Margarida Azevedo Amorim', data: '10/06/1960' },
  { nome: 'Isabel Egg de Melo', data: '10/06/1964' },
  { nome: 'Ester Vitalina de Paiva Resende', data: '10/06/1965' },
  { nome: 'Helena Oliveira Resende', data: '14/06/2022' },
  { nome: 'Nathalie Vieira Lima', data: '14/06/2024' },
  { nome: 'Elias Flávio de Paiva', data: '16/06/1991' },
  { nome: 'Horácio Vieira Diniz', data: '20/06/1950' },
  { nome: 'Catharina Vieira Lima', data: '21/06/2021' },
  { nome: 'Paulino Marques', data: '21/06/1953' },
  { nome: 'Karine Rodrigues de Souza Resende', data: '25/06/1995' },
  { nome: 'Rayssa Vitória Diniz', data: '27/06/2007' },
  { nome: 'Rayane Júlia Diniz', data: '27/06/2007' },
  { nome: 'Expedido Severino de Oliveira', data: '27/06/1945' },
  { nome: 'Boaz de Melo Oliveira', data: '28/06/1984' },
  { nome: 'Maura Resende Diniz', data: '30/06/1940' },
  { nome: 'Mauri Aser Diniz', data: '01/07/1958' },
  { nome: 'Ramon Martins Rezende Diniz', data: '01/07/1989' },
  { nome: 'Jéssica Priscila de Azevedo', data: '02/07/1988' },
  { nome: 'France Jane Corrêia Soares', data: '03/07/1964' },
  { nome: 'Fabrício Resende da Costa', data: '06/07/1995' },
  { nome: 'Joeni Marta Mariano da Costa', data: '07/07/1966' },
  { nome: 'Eder Pereira Resende Soares', data: '07/07/1995' },
  { nome: 'Valdecir Chaves Diniz', data: '08/07/1984' },
  { nome: 'Weslley Peterson dos Santos Moraes', data: '09/07/1988' },
  { nome: 'Ilsomar Antônio dos Santos', data: '10/07/19' },
  { nome: 'Josiane Thais de Oliveira Diniz', data: '12/07/1993' },
  { nome: 'Lavinia Diniz de Oliveira', data: '12/07/2015' },
  { nome: 'Adriana Conceição Silva e Souza', data: '14/07/1975' },
  { nome: 'Ênio Siqueira de Gouveia', data: '14/07/1955' },
  { nome: 'Isadora de Assis Reis Oliveira', data: '15/07/2016' },
  { nome: 'Caio Vitor de Resende', data: '19/07/1996' },
  { nome: 'Valdeci Luis de Souza', data: '20/07/1971' },
  { nome: 'Samuel Tavares Diniz', data: '21/07/2020' },
  { nome: 'Luiz Vieira da Fonseca', data: '27/07/1942' },
  { nome: 'Ernandes Celestino de Azevedo', data: '27/07/1957' },
  { nome: 'Daniel Tavares Diniz', data: '31/07/2017' },
  { nome: 'Elizabete Diniz Cândida da Silva', data: '01/08/' },
  { nome: 'Lilian Beatriz Souza', data: '02/08/2007' },
  { nome: 'Dorcas Vieira Diniz', data: '05/08/1946' },
  { nome: 'Camila Cristina Pereira', data: '05/08/1994' },
  { nome: 'Miguel Mariano Diniz', data: '05/08/2017' },
  { nome: 'Ivan Resende Soares', data: '07/08/1960' },
  { nome: 'Mônica Caetano Azevedo Gonzaga', data: '07/08/1970' },
  { nome: 'Ângela Maria do Amaral Melo', data: '08/08/1993' },
  { nome: 'Aline Patrícia Costa Resende Souza', data: '08/08/1990' },
  { nome: 'Sara Cassiano Coelho de Paiva', data: '09/08/2019' },
  { nome: 'Alexsandro Ferreira Alves Vieira', data: '10/08/1999' },
  { nome: 'Wagner Lúcio Oliveira', data: '18/08/1978' },
  { nome: 'Sandra Fernanda de Oliveira', data: '23/08/1982' },
  { nome: 'Vânia Consolação Azevedo Resende', data: '26/08/1964' },
  { nome: 'Adilson Gomes de Souza', data: '29/08/1971' }
];

function converterData(dataBr) {
  const partes = dataBr.split('/');
  if (partes.length !== 3) {
    return null;
  }

  const [dia, mes, ano] = partes;
  if (!dia || !mes || !ano || ano.length !== 4) {
    return null;
  }

  const diaNum = Number(dia);
  const mesNum = Number(mes);
  const anoNum = Number(ano);

  if (!Number.isInteger(diaNum) || !Number.isInteger(mesNum) || !Number.isInteger(anoNum)) {
    return null;
  }

  if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 || anoNum < 1900) {
    return null;
  }

  return `${String(anoNum)}-${String(mesNum).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
}

async function executar() {
  let inseridos = 0;
  let ignoradosSemAno = 0;
  let jaExistentes = 0;
  let comErro = 0;

  for (const aluno of alunosEntrada) {
    try {
      const dataIso = converterData(aluno.data);

      if (!dataIso) {
        ignoradosSemAno++;
        console.log(`IGNORADO (sem ano/data inválida): ${aluno.nome} - ${aluno.data}`);
        continue;
      }

      const existente = await db('alunos')
        .where({ nome: aluno.nome, data_nascimento: dataIso })
        .first();

      if (existente) {
        jaExistentes++;
        console.log(`JÁ EXISTE: ${aluno.nome} (${dataIso})`);
        continue;
      }

      const { classe } = await alunoService.obterClassePorDataNascimento(dataIso);

      await db('alunos').insert({
        nome: aluno.nome,
        data_nascimento: dataIso,
        classe_id: classe.id
      });

      inseridos++;
      console.log(`INSERIDO: ${aluno.nome} (${dataIso}) -> Classe ${classe.nome}`);
    } catch (error) {
      comErro++;
      console.error(`ERRO: ${aluno.nome} - ${error.message}`);
    }
  }

  console.log('\nResumo da importação:');
  console.log(`Inseridos: ${inseridos}`);
  console.log(`Ignorados (sem ano/data inválida): ${ignoradosSemAno}`);
  console.log(`Já existentes: ${jaExistentes}`);
  console.log(`Com erro: ${comErro}`);
}

executar()
  .catch((error) => {
    console.error('Falha na importação em lote:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.destroy();
  });
