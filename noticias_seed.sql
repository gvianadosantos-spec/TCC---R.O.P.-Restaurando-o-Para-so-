USE rop_teste;

-- Notícias de demonstração para validar a página e a pesquisa.
-- Você pode trocar por conteúdos reais depois.

INSERT INTO noticias_natureza
  (titulo, descricao, imagem_url, fonte_url, publicado_em)
VALUES
(
  'Preservação da fauna brasileira ganha destaque',
  'A proteção dos animais silvestres depende da preservação dos habitats, da educação ambiental e do combate às ameaças causadas pela ação humana.',
  '/assets/img/pages/inicio/carrosel/imagem1.png',
  NULL,
  '2026-11-01 10:00:00'
),
(
  'Projetos ambientais reforçam a importância da conservação',
  'Iniciativas de conservação ajudam a aproximar a sociedade da biodiversidade e incentivam práticas voltadas à proteção da natureza.',
  '/assets/img/pages/inicio/carrosel/imagem2.png',
  NULL,
  '2026-10-20 10:00:00'
),
(
  'Educação ambiental ajuda na proteção dos animais',
  'Informação e conscientização são ferramentas importantes para reduzir impactos ambientais e fortalecer o cuidado com a fauna.',
  '/assets/img/pages/inicio/carrosel/imagem3.png',
  NULL,
  '2026-09-15 10:00:00'
),
(
  'R.O.P. destaca a importância dos ecossistemas',
  'A conservação dos ecossistemas contribui diretamente para a sobrevivência de inúmeras espécies e para o equilíbrio ambiental.',
  '/assets/img/pages/inicio/carrosel/imagem4.png',
  NULL,
  '2026-08-02 10:00:00'
);

SELECT
  id_noticia,
  titulo,
  descricao,
  imagem_url,
  fonte_url,
  publicado_em
FROM noticias_natureza
ORDER BY publicado_em DESC;
