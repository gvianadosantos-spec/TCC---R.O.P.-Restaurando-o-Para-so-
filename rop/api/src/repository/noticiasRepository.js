import { con } from './connection.js';

let colunasCache = null;

async function obterColunas(forcarAtualizacao = false) {
  if (colunasCache && !forcarAtualizacao) return colunasCache;

  const [linhas] = await con.query('SHOW COLUMNS FROM noticias_natureza');
  colunasCache = new Set(linhas.map((linha) => linha.Field));
  return colunasCache;
}

function tem(colunas, nome) {
  return colunas.has(nome);
}

function expressao(colunas, nome, alternativa = 'NULL') {
  return tem(colunas, nome) ? nome : alternativa;
}

const noticiasIniciais = [
  {
    titulo: 'Preservar habitats também é proteger a fauna',
    descricao: 'A conservação de florestas, rios, áreas úmidas e outros ambientes naturais ajuda a manter alimento, abrigo e espaço para a vida silvestre.',
    imagem_url: '/assets/img/pages/inicio/carrosel/imagem1.png',
    publicado_em: '2026-11-01 10:00:00'
  },
  {
    titulo: 'Educação ambiental aproxima pessoas da biodiversidade',
    descricao: 'Conhecer as espécies e entender sua importância ecológica são passos essenciais para incentivar atitudes de respeito e conservação.',
    imagem_url: '/assets/img/pages/inicio/carrosel/imagem2.png',
    publicado_em: '2026-10-20 10:00:00'
  },
  {
    titulo: 'Queimadas afetam abrigo e alimentação de animais silvestres',
    descricao: 'Incêndios podem alterar áreas de vida da fauna e reduzir recursos importantes para diferentes espécies, reforçando a necessidade de prevenção e recuperação ambiental.',
    imagem_url: '/assets/img/pages/inicio/carrosel/imagem3.png',
    publicado_em: '2026-09-15 10:00:00'
  },
  {
    titulo: 'Corredores ecológicos ajudam a conectar áreas naturais',
    descricao: 'A conexão entre fragmentos de vegetação pode facilitar o deslocamento dos animais e contribuir para a manutenção da diversidade biológica.',
    imagem_url: '/assets/img/pages/inicio/carrosel/imagem4.png',
    publicado_em: '2026-08-02 10:00:00'
  },
  {
    titulo: 'Atropelamentos estão entre as pressões sobre a fauna',
    descricao: 'Planejamento, sinalização e medidas de redução de velocidade em áreas sensíveis podem colaborar para diminuir conflitos entre rodovias e animais silvestres.',
    imagem_url: '/assets/img/pages/inicio/carrosel/imagem1.png',
    publicado_em: '2026-07-18 10:00:00'
  },
  {
    titulo: 'Reabilitação prepara animais para novas etapas de cuidado',
    descricao: 'Centros de atendimento podem oferecer avaliação, tratamento e acompanhamento de animais resgatados, sempre de acordo com as necessidades de cada caso.',
    imagem_url: '/assets/img/pages/inicio/carrosel/imagem2.png',
    publicado_em: '2026-06-05 10:00:00'
  }
];

function valorInicial(noticia, campo) {
  const data = noticia.publicado_em.slice(0, 10);

  const mapa = {
    titulo: noticia.titulo,
    descricao: noticia.descricao,
    imagem_url: noticia.imagem_url,
    fonte_url: null,
    publicado_em: noticia.publicado_em,
    local: 'Brasil',
    acontecimento: noticia.descricao,
    causas: 'Pressões ambientais e alterações humanas podem afetar habitats e espécies.',
    objetivo: 'Promover informação e conscientização sobre conservação da fauna e da natureza.',
    impactos: 'A proteção dos ambientes naturais contribui para a manutenção da biodiversidade.',
    curiosidade: 'Este conteúdo faz parte da demonstração educativa do projeto fictício R.O.P.',
    data_noticia: data,
    fonte: 'Conteúdo educativo do projeto R.O.P.'
  };

  return mapa[campo] ?? null;
}

async function inserirNoticiasIniciais(colunas) {
  const camposPossiveis = [
    'titulo',
    'descricao',
    'imagem_url',
    'fonte_url',
    'publicado_em',
    'local',
    'acontecimento',
    'causas',
    'objetivo',
    'impactos',
    'curiosidade',
    'data_noticia',
    'fonte'
  ];

  const campos = camposPossiveis.filter((campo) => tem(colunas, campo));
  const placeholders = campos.map(() => '?').join(', ');
  const comando = `INSERT INTO noticias_natureza (${campos.join(', ')}) VALUES (${placeholders})`;

  for (const noticia of noticiasIniciais) {
    const valores = campos.map((campo) => valorInicial(noticia, campo));
    await con.query(comando, valores);
  }
}

// Prepara somente a parte de notícias, sem apagar tabelas, colunas ou registros existentes.
// Também permite que um banco antigo continue funcionando com o frontend novo.
export async function prepararNoticias() {
  await con.query(`
    CREATE TABLE IF NOT EXISTS noticias_natureza (
      id_noticia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT NOT NULL,
      imagem_url VARCHAR(500) NULL,
      fonte_url VARCHAR(500) NULL,
      publicado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  let colunas = await obterColunas(true);

  const alteracoes = [];
  if (!tem(colunas, 'descricao')) alteracoes.push('ADD COLUMN descricao TEXT NULL');
  if (!tem(colunas, 'imagem_url')) alteracoes.push('ADD COLUMN imagem_url VARCHAR(500) NULL');
  if (!tem(colunas, 'fonte_url')) alteracoes.push('ADD COLUMN fonte_url VARCHAR(500) NULL');
  if (!tem(colunas, 'publicado_em')) alteracoes.push('ADD COLUMN publicado_em TIMESTAMP NULL DEFAULT NULL');

  if (alteracoes.length) {
    await con.query(`ALTER TABLE noticias_natureza ${alteracoes.join(', ')}`);
    colunas = await obterColunas(true);
  }

  // Migração não destrutiva dos campos antigos para os campos usados pela interface nova.
  if (tem(colunas, 'acontecimento') && tem(colunas, 'descricao')) {
    await con.query(`
      UPDATE noticias_natureza
      SET descricao = COALESCE(NULLIF(descricao, ''), acontecimento)
      WHERE descricao IS NULL OR descricao = ''
    `);
  }

  if (tem(colunas, 'descricao')) {
    await con.query(`
      UPDATE noticias_natureza
      SET descricao = titulo
      WHERE descricao IS NULL OR descricao = ''
    `);
  }

  if (tem(colunas, 'fonte') && tem(colunas, 'fonte_url')) {
    await con.query(`
      UPDATE noticias_natureza
      SET fonte_url = fonte
      WHERE (fonte_url IS NULL OR fonte_url = '')
        AND fonte REGEXP '^https?://'
    `);
  }

  if (tem(colunas, 'data_noticia') && tem(colunas, 'publicado_em')) {
    await con.query(`
      UPDATE noticias_natureza
      SET publicado_em = data_noticia
      WHERE publicado_em IS NULL
    `);
  }

  if (tem(colunas, 'publicado_em')) {
    await con.query(`
      UPDATE noticias_natureza
      SET publicado_em = CURRENT_TIMESTAMP
      WHERE publicado_em IS NULL
    `);
  }

  const [contagem] = await con.query('SELECT COUNT(*) AS total FROM noticias_natureza');
  const total = Number(contagem[0]?.total ?? 0);

  if (total === 0) {
    colunas = await obterColunas(true);
    await inserirNoticiasIniciais(colunas);
  }

  colunasCache = null;
}

export async function listNoticias() {
  const colunas = await obterColunas();

  const descricao = expressao(
    colunas,
    'descricao',
    tem(colunas, 'acontecimento') ? 'acontecimento' : "''"
  );

  const imagem = expressao(colunas, 'imagem_url');

  const fonteUrl = tem(colunas, 'fonte_url')
    ? 'fonte_url'
    : tem(colunas, 'fonte')
      ? "CASE WHEN fonte REGEXP '^https?://' THEN fonte ELSE NULL END"
      : 'NULL';

  const publicado = tem(colunas, 'publicado_em')
    ? 'publicado_em'
    : tem(colunas, 'data_noticia')
      ? 'data_noticia'
      : 'NULL';

  const fonteTexto = tem(colunas, 'fonte')
    ? 'fonte'
    : tem(colunas, 'fonte_url')
      ? 'fonte_url'
      : 'NULL';

  const ordenarPor = tem(colunas, 'publicado_em')
    ? 'publicado_em DESC, id_noticia DESC'
    : tem(colunas, 'data_noticia')
      ? 'data_noticia DESC, id_noticia DESC'
      : 'id_noticia DESC';

  const command = `
    SELECT
      id_noticia,
      titulo,
      ${descricao} AS descricao,
      ${imagem} AS imagem_url,
      ${fonteUrl} AS fonte_url,
      ${publicado} AS publicado_em,
      ${expressao(colunas, 'local')} AS local,
      ${expressao(colunas, 'causas')} AS causas,
      ${expressao(colunas, 'objetivo')} AS objetivo,
      ${expressao(colunas, 'impactos')} AS impactos,
      ${expressao(colunas, 'curiosidade')} AS curiosidade,
      ${fonteTexto} AS fonte_texto
    FROM noticias_natureza
    ORDER BY ${ordenarPor}
  `;

  const [linhas] = await con.query(command);
  return linhas;
}