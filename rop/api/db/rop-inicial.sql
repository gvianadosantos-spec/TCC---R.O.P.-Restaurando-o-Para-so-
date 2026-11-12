-- ============================================================================
-- R.O.P. | RESTAURANDO O PARAÍSO
-- BANCO COMPLETO RECRIADO - 60 ANIMAIS (10 POR GRUPO)
-- Fonte original: Banco de Dados R.O.P. - TCC(1).sql (dados biológicos básicos)
-- Data de preparação: 10/11/2026
-- Requer MySQL 8.0 ou posterior.
--
-- IMPORTANTE: Execute no banco `rop` VAZIO (sem as tabelas antigas).
-- O arquivo não contém DROP TABLE nem ALTER TABLE.
-- Todos os campos dos ANIMAIS são NOT NULL, exceto `imagem_url`.
-- Todas as 60 imagens estão explicitamente NULL, para cadastrar depois.
--
-- NOTA CIENTÍFICA: Os status confirmados nas fontes institucionais referem-se
-- a períodos de avaliação específicos e podem não equivaler à lista 2026.
-- Onde não houve verificação da espécie, o status é "Não verificado",
-- e NÃO "Menor Preocupação" ou "Não Avaliado" (categorias técnicas diferentes).
-- `populacao_estimada` é TEXTO para registrar "não quantificada" sem criar
-- falsos zeros. `data_avaliacao` é TEXTO para evitar datas inventadas.
-- As `causas_ameaca` não referenciadas individualmente são explicitamente
-- descritas como PRESSÕES POTENCIAIS, não como ameaças confirmadas.
-- Fontes consultadas: ICMBio SALVE/PAN, Zoo Brasília, IUCN Crocodile
-- Specialist Group e Portal de Dados Abertos MMA (ver fonte_url por animal).
-- ============================================================================

-- Usar o schema selecionado na variavel MYSQL_URL.
SET NAMES utf8mb4;

-- 1. CADASTRO — preserva os nomes usados no cadastroRepository.js
CREATE TABLE usuario_cadastro (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nome_usuario VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_nome (nome_usuario),
  UNIQUE KEY uq_usuario_email (email)
) ENGINE=InnoDB;

-- 2. GRUPOS: IDs fixos compatíveis com os INSERTs das tabelas animais.
CREATE TABLE pesquisa_especie (
  id_especie INT NOT NULL AUTO_INCREMENT,
  classe_especie VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_especie),
  UNIQUE KEY uq_classe_especie (classe_especie)
) ENGINE=InnoDB;

INSERT INTO pesquisa_especie (id_especie, classe_especie) VALUES
  (1, 'Mamíferos'),
  (2, 'Aves'),
  (3, 'Répteis'),
  (4, 'Anfibios'),
  (5, 'Peixes'),
  (6, 'Invertebrados');

-- 3. TABELAS DOS ANIMAIS (MESMOS NOMES E MESMAS COLUNAS ANTIGAS)
-- Todos os campos EXCETO imagem_url são NOT NULL desde o CREATE TABLE.

CREATE TABLE mamiferos (
  id_animal INT NOT NULL AUTO_INCREMENT,
  nome_popular VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(150) NOT NULL,
  classificacao VARCHAR(50) NOT NULL,
  habitat VARCHAR(200) NOT NULL,
  alimentacao VARCHAR(100) NOT NULL,
  reproducao VARCHAR(100) NOT NULL,
  caracteristicas TEXT NOT NULL,
  curiosidade TEXT NOT NULL,
  id_especie INT NOT NULL,
  status_conservacao VARCHAR(60) NOT NULL,
  imagem_url VARCHAR(500) NULL,
  populacao_estimada VARCHAR(160) NOT NULL,
  observacao_populacao TEXT NOT NULL,
  tendencia_populacional VARCHAR(40) NOT NULL,
  causas_ameaca TEXT NOT NULL,
  fonte_conservacao VARCHAR(255) NOT NULL,
  data_avaliacao VARCHAR(60) NOT NULL,
  escopo_avaliacao VARCHAR(30) NOT NULL,
  fonte_url VARCHAR(500) NOT NULL,
  credito_imagem VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_animal),
  UNIQUE KEY uq_mamiferos_cientifico (nome_cientifico),
  KEY idx_mamiferos_categoria (id_especie),
  KEY idx_mamiferos_status (status_conservacao),
  CONSTRAINT fk_mamiferos_grupo FOREIGN KEY (id_especie)
    REFERENCES pesquisa_especie(id_especie)
) ENGINE=InnoDB;

CREATE TABLE aves (
  id_animal INT NOT NULL AUTO_INCREMENT,
  nome_popular VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(150) NOT NULL,
  classificacao VARCHAR(50) NOT NULL,
  habitat VARCHAR(200) NOT NULL,
  alimentacao VARCHAR(100) NOT NULL,
  reproducao VARCHAR(100) NOT NULL,
  caracteristicas TEXT NOT NULL,
  curiosidade TEXT NOT NULL,
  id_especie INT NOT NULL,
  status_conservacao VARCHAR(60) NOT NULL,
  imagem_url VARCHAR(500) NULL,
  populacao_estimada VARCHAR(160) NOT NULL,
  observacao_populacao TEXT NOT NULL,
  tendencia_populacional VARCHAR(40) NOT NULL,
  causas_ameaca TEXT NOT NULL,
  fonte_conservacao VARCHAR(255) NOT NULL,
  data_avaliacao VARCHAR(60) NOT NULL,
  escopo_avaliacao VARCHAR(30) NOT NULL,
  fonte_url VARCHAR(500) NOT NULL,
  credito_imagem VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_animal),
  UNIQUE KEY uq_aves_cientifico (nome_cientifico),
  KEY idx_aves_categoria (id_especie),
  KEY idx_aves_status (status_conservacao),
  CONSTRAINT fk_aves_grupo FOREIGN KEY (id_especie)
    REFERENCES pesquisa_especie(id_especie)
) ENGINE=InnoDB;

CREATE TABLE repteis (
  id_animal INT NOT NULL AUTO_INCREMENT,
  nome_popular VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(150) NOT NULL,
  classificacao VARCHAR(50) NOT NULL,
  habitat VARCHAR(200) NOT NULL,
  alimentacao VARCHAR(100) NOT NULL,
  reproducao VARCHAR(100) NOT NULL,
  caracteristicas TEXT NOT NULL,
  curiosidade TEXT NOT NULL,
  id_especie INT NOT NULL,
  status_conservacao VARCHAR(60) NOT NULL,
  imagem_url VARCHAR(500) NULL,
  populacao_estimada VARCHAR(160) NOT NULL,
  observacao_populacao TEXT NOT NULL,
  tendencia_populacional VARCHAR(40) NOT NULL,
  causas_ameaca TEXT NOT NULL,
  fonte_conservacao VARCHAR(255) NOT NULL,
  data_avaliacao VARCHAR(60) NOT NULL,
  escopo_avaliacao VARCHAR(30) NOT NULL,
  fonte_url VARCHAR(500) NOT NULL,
  credito_imagem VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_animal),
  UNIQUE KEY uq_repteis_cientifico (nome_cientifico),
  KEY idx_repteis_categoria (id_especie),
  KEY idx_repteis_status (status_conservacao),
  CONSTRAINT fk_repteis_grupo FOREIGN KEY (id_especie)
    REFERENCES pesquisa_especie(id_especie)
) ENGINE=InnoDB;

CREATE TABLE anfibios (
  id_animal INT NOT NULL AUTO_INCREMENT,
  nome_popular VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(150) NOT NULL,
  classificacao VARCHAR(50) NOT NULL,
  habitat VARCHAR(200) NOT NULL,
  alimentacao VARCHAR(100) NOT NULL,
  reproducao VARCHAR(100) NOT NULL,
  caracteristicas TEXT NOT NULL,
  curiosidade TEXT NOT NULL,
  id_especie INT NOT NULL,
  status_conservacao VARCHAR(60) NOT NULL,
  imagem_url VARCHAR(500) NULL,
  populacao_estimada VARCHAR(160) NOT NULL,
  observacao_populacao TEXT NOT NULL,
  tendencia_populacional VARCHAR(40) NOT NULL,
  causas_ameaca TEXT NOT NULL,
  fonte_conservacao VARCHAR(255) NOT NULL,
  data_avaliacao VARCHAR(60) NOT NULL,
  escopo_avaliacao VARCHAR(30) NOT NULL,
  fonte_url VARCHAR(500) NOT NULL,
  credito_imagem VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_animal),
  UNIQUE KEY uq_anfibios_cientifico (nome_cientifico),
  KEY idx_anfibios_categoria (id_especie),
  KEY idx_anfibios_status (status_conservacao),
  CONSTRAINT fk_anfibios_grupo FOREIGN KEY (id_especie)
    REFERENCES pesquisa_especie(id_especie)
) ENGINE=InnoDB;

CREATE TABLE peixes (
  id_animal INT NOT NULL AUTO_INCREMENT,
  nome_popular VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(150) NOT NULL,
  classificacao VARCHAR(50) NOT NULL,
  habitat VARCHAR(200) NOT NULL,
  alimentacao VARCHAR(100) NOT NULL,
  reproducao VARCHAR(100) NOT NULL,
  caracteristicas TEXT NOT NULL,
  curiosidade TEXT NOT NULL,
  id_especie INT NOT NULL,
  status_conservacao VARCHAR(60) NOT NULL,
  imagem_url VARCHAR(500) NULL,
  populacao_estimada VARCHAR(160) NOT NULL,
  observacao_populacao TEXT NOT NULL,
  tendencia_populacional VARCHAR(40) NOT NULL,
  causas_ameaca TEXT NOT NULL,
  fonte_conservacao VARCHAR(255) NOT NULL,
  data_avaliacao VARCHAR(60) NOT NULL,
  escopo_avaliacao VARCHAR(30) NOT NULL,
  fonte_url VARCHAR(500) NOT NULL,
  credito_imagem VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_animal),
  UNIQUE KEY uq_peixes_cientifico (nome_cientifico),
  KEY idx_peixes_categoria (id_especie),
  KEY idx_peixes_status (status_conservacao),
  CONSTRAINT fk_peixes_grupo FOREIGN KEY (id_especie)
    REFERENCES pesquisa_especie(id_especie)
) ENGINE=InnoDB;

CREATE TABLE invertebrados (
  id_animal INT NOT NULL AUTO_INCREMENT,
  nome_popular VARCHAR(100) NOT NULL,
  nome_cientifico VARCHAR(150) NOT NULL,
  classificacao VARCHAR(50) NOT NULL,
  habitat VARCHAR(200) NOT NULL,
  alimentacao VARCHAR(100) NOT NULL,
  reproducao VARCHAR(100) NOT NULL,
  caracteristicas TEXT NOT NULL,
  curiosidade TEXT NOT NULL,
  id_especie INT NOT NULL,
  status_conservacao VARCHAR(60) NOT NULL,
  imagem_url VARCHAR(500) NULL,
  populacao_estimada VARCHAR(160) NOT NULL,
  observacao_populacao TEXT NOT NULL,
  tendencia_populacional VARCHAR(40) NOT NULL,
  causas_ameaca TEXT NOT NULL,
  fonte_conservacao VARCHAR(255) NOT NULL,
  data_avaliacao VARCHAR(60) NOT NULL,
  escopo_avaliacao VARCHAR(30) NOT NULL,
  fonte_url VARCHAR(500) NOT NULL,
  credito_imagem VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_animal),
  UNIQUE KEY uq_invertebrados_cientifico (nome_cientifico),
  KEY idx_invertebrados_categoria (id_especie),
  KEY idx_invertebrados_status (status_conservacao),
  CONSTRAINT fk_invertebrados_grupo FOREIGN KEY (id_especie)
    REFERENCES pesquisa_especie(id_especie)
) ENGINE=InnoDB;

-- 4. INSERÇÕES COMPLETAS - 10 ANIMAIS EM CADA GRUPO; IMAGEM SEMPRE NULL
-- Textos de biologia reaproveitados do arquivo SQL enviado pelo usuário.

INSERT INTO mamiferos (
  nome_popular, nome_cientifico, classificacao, habitat, alimentacao, reproducao, caracteristicas,
  curiosidade, id_especie, status_conservacao, imagem_url, populacao_estimada, observacao_populacao, tendencia_populacional,
  causas_ameaca, fonte_conservacao, data_avaliacao, escopo_avaliacao, fonte_url, credito_imagem
) VALUES
  ('Onça-pintada', 'Panthera onca', 'Mamífero', 'Pantanal, Amazônia e Cerrado', 'Carnívoro', 'Vivíparo', 'Maior felino das Américas, pelagem com manchas em forma de rosetas.', 'Excelente nadadora.', 1, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Perda e fragmentação de habitat, redução de presas, caça e conflitos com atividades humanas.', 'ICMBio - SALVE; referência anterior à lista de 2026', '2018-11-01', 'Brasil', 'https://salve.icmbio.gov.br/', 'A cadastrar após definição da imagem'),
  ('Lobo-guará', 'Chrysocyon brachyurus', 'Mamífero', 'Cerrado', 'Onívoro', 'Vivíparo', 'Pernas longas e pelagem avermelhada.', 'Apesar do nome, não é um lobo verdadeiro.', 1, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Atropelamentos, perda do Cerrado, incêndios e doenças transmitidas por animais domésticos.', 'ICMBio - PAN Lobo-guará; referência anterior a 2026', 'Não informada', 'Brasil', 'https://www.gov.br/icmbio/', 'A cadastrar após definição da imagem'),
  ('Tamanduá-bandeira', 'Myrmecophaga tridactyla', 'Mamífero', 'Cerrado, Pantanal e campos', 'Insetívoro', 'Vivíparo', 'Língua comprida e garras fortes.', 'Pode consumir milhares de formigas por dia.', 1, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Atropelamentos, incêndios e perda de vegetação nativa.', 'ICMBio - PAN Tamanduá e Tatus', 'Não informada', 'Brasil', 'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-tamandua-e-tatus', 'A cadastrar após definição da imagem'),
  ('Anta', 'Tapirus terrestris', 'Mamífero', 'Florestas e áreas úmidas', 'Herbívoro', 'Vivíparo', 'Maior mamífero terrestre brasileiro.', 'Importante dispersora de sementes.', 1, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Desmatamento, caça e atropelamentos podem reduzir populações locais.', 'ICMBio - referência nacional anterior a 2026', 'Não informada', 'Brasil', 'https://salve.icmbio.gov.br/', 'A cadastrar após definição da imagem'),
  ('Tatu-canastra', 'Priodontes maximus', 'Mamífero', 'Cerrado, Pantanal e Amazônia', 'Insetívoro', 'Vivíparo', 'Maior espécie de tatu do mundo.', 'Constrói tocas profundas.', 1, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Perda e fragmentação do habitat, caça e alteração do solo por atividades humanas.', 'ICMBio - PAN Tamanduá e Tatus', 'Não informada', 'Brasil', 'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-tamandua-e-tatus', 'A cadastrar após definição da imagem'),
  ('Tatu-bola', 'Tolypeutes tricinctus', 'Mamífero', 'Caatinga e Cerrado', 'Insetívoro', 'Vivíparo', 'Enrola completamente o corpo para se defender.', 'Foi mascote da Copa do Mundo de 2014.', 1, 'Em Perigo', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Caça e destruição/fragmentação de áreas de Caatinga e Cerrado.', 'ICMBio - PAN Tamanduá e Tatus', 'Não informada', 'Brasil', 'https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-tamandua-e-tatus', 'A cadastrar após definição da imagem'),
  ('Mico-leão-dourado', 'Leontopithecus rosalia', 'Mamífero', 'Mata Atlântica', 'Onívoro', 'Vivíparo', 'Pelagem dourada característica.', 'É símbolo da conservação da Mata Atlântica.', 1, 'Em Perigo', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Fragmentação da Mata Atlântica, expansão urbana e efeitos sobre a conectividade florestal.', 'ICMBio - avaliação nacional divulgada em publicação de 2025', 'Não informada', 'Brasil', 'https://revistaeletronica.icmbio.gov.br/BioBR/article/download/2529/1843?inline=1', 'A cadastrar após definição da imagem'),
  ('Ariranha', 'Pteronura brasiliensis', 'Mamífero', 'Rios e lagos', 'Carnívoro', 'Vivíparo', 'Maior lontra do mundo.', 'Vive em grupos familiares.', 1, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Caça histórica, alterações dos rios, barragens e conflitos com atividades pesqueiras.', 'ICMBio - avaliação nacional publicada em 2013', '2013 (publicação)', 'Brasil', 'https://revistaeletronica.icmbio.gov.br/BioBR/article/view/390', 'A cadastrar após definição da imagem'),
  ('Quati', 'Nasua nasua', 'Mamífero', 'Florestas e Cerrado', 'Onívoro', 'Vivíparo', 'Focinho longo e cauda anelada.', 'É comum em parques nacionais.', 1, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Pressões potenciais: perda de cobertura vegetal, atropelamentos e conflitos em áreas urbanizadas.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Jaguatirica', 'Leopardus pardalis', 'Mamífero', 'Florestas e Cerrado', 'Carnívoro', 'Vivíparo', 'Felino de médio porte com manchas.', 'Tem hábitos principalmente noturnos.', 1, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não foi adotada uma estimativa numérica nacional de indivíduos neste cadastro; números locais não devem ser tratados como total brasileiro.', 'Não determinada', 'Pressões potenciais: fragmentação de florestas, caça e atropelamentos.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem');

INSERT INTO aves (
  nome_popular, nome_cientifico, classificacao, habitat, alimentacao, reproducao, caracteristicas,
  curiosidade, id_especie, status_conservacao, imagem_url, populacao_estimada, observacao_populacao, tendencia_populacional,
  causas_ameaca, fonte_conservacao, data_avaliacao, escopo_avaliacao, fonte_url, credito_imagem
) VALUES
  ('Arara-azul', 'Anodorhynchus hyacinthinus', 'Ave', 'Pantanal e Cerrado', 'Frugívoro', 'Ovíparo', 'Grande ave de plumagem azul intensa.', 'É a maior arara do mundo.', 2, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Captura ilegal, perda de locais de nidificação e derrubada de árvores com cavidades.', 'Prefeitura de Americana - Parque Ecológico (verificar atualização)', 'Não informada', 'Referência institucional', 'https://www.americana.sp.gov.br/portal_parque/site_parque.php/downloads/site_parque.php?a=animais_detalhe&e=6', 'A cadastrar após definição da imagem'),
  ('Arara-vermelha', 'Ara chloropterus', 'Ave', 'Amazônia e Mata Atlântica', 'Frugívoro', 'Ovíparo', 'Plumagem vermelha com asas verdes e azuis.', 'Forma casais por muitos anos.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Pressões potenciais: perda florestal e captura para o comércio ilegal.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Papagaio-de-cara-roxa', 'Amazona brasiliensis', 'Ave', 'Mata Atlântica', 'Frugívoro', 'Ovíparo', 'Cabeça com coloração arroxeada.', 'Está ameaçado de extinção.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Perda de florestas costeiras, pressão sobre árvores-ninho e comércio ilegal.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Tucano-toco', 'Ramphastos toco', 'Ave', 'Cerrado e Pantanal', 'Frugívoro', 'Ovíparo', 'Grande bico alaranjado.', 'É o maior tucano do Brasil.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Pressões potenciais: redução de árvores usadas para alimentação e nidificação.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Saíra-sete-cores', 'Tangara seledon', 'Ave', 'Mata Atlântica', 'Frugívoro', 'Ovíparo', 'Plumagem extremamente colorida.', 'É considerada uma das aves mais bonitas do Brasil.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Pressões potenciais: perda e fragmentação da Mata Atlântica.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Colhereiro', 'Platalea ajaja', 'Ave', 'Manguezais e Pantanal', 'Carnívoro', 'Ovíparo', 'Possui bico em forma de colher.', 'Sua plumagem é rosada.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Pressões potenciais: poluição e alteração de áreas úmidas e manguezais.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Ema', 'Rhea americana', 'Ave', 'Cerrado e Pampas', 'Onívoro', 'Ovíparo', 'Maior ave brasileira, não voa.', 'O macho cuida dos filhotes.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Pressões potenciais: conversão de campos naturais, queimadas e atropelamentos.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Seriema', 'Cariama cristata', 'Ave', 'Cerrado', 'Carnívoro', 'Ovíparo', 'Pernas longas e canto característico.', 'Caça cobras e pequenos animais.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Pressões potenciais: perda do Cerrado, fogo e atropelamentos.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Urubu-rei', 'Sarcoramphus papa', 'Ave', 'Florestas tropicais', 'Carnívoro', 'Ovíparo', 'Cabeça colorida e grande porte.', 'É dominante sobre outros urubus.', 2, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Pressões potenciais: destruição de florestas e redução da disponibilidade de alimento.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Harpia', 'Harpia harpyja', 'Ave', 'Floresta Amazônica', 'Carnívoro', 'Ovíparo', 'Maior águia das Américas.', 'Consegue capturar preguiças e macacos.', 2, 'Vulnerável', NULL, 'Não quantificada em fonte validada', 'Ainda não há estimativa nacional de indivíduos conferida para este registro; contagens locais não representam toda a população.', 'Não determinada', 'Desmatamento, fragmentação de grandes florestas, caça e tráfico de fauna.', 'Zoológico de Brasília (2025)', '2025 (publicação)', 'Referência institucional', 'https://zoo.df.gov.br/harpia-harpia-harpyja', 'A cadastrar após definição da imagem');

INSERT INTO repteis (
  nome_popular, nome_cientifico, classificacao, habitat, alimentacao, reproducao, caracteristicas,
  curiosidade, id_especie, status_conservacao, imagem_url, populacao_estimada, observacao_populacao, tendencia_populacional,
  causas_ameaca, fonte_conservacao, data_avaliacao, escopo_avaliacao, fonte_url, credito_imagem
) VALUES
  ('Jacaré-açu', 'Melanosuchus niger', 'Réptil', 'Rios e lagos da Amazônia', 'Carnívoro', 'Ovíparo', 'Maior jacaré da América do Sul.', 'Pode ultrapassar 5 metros de comprimento.', 3, 'Menor Preocupação', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Pressões potenciais: caça, transformação de áreas alagadas e conflitos com pessoas.', 'IUCN Crocodile Specialist Group (referência histórica)', '2000 (referência)', 'Global', 'https://www.iucncsg.org/pages/Conservation-Status.html', 'A cadastrar após definição da imagem'),
  ('Jacaré-do-pantanal', 'Caiman yacare', 'Réptil', 'Pantanal', 'Carnívoro', 'Ovíparo', 'Possui coloração escura e focinho largo.', 'É muito comum na região do Pantanal.', 3, 'Menor Preocupação', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Pressões potenciais: drenagem e poluição de áreas úmidas e caça localizada.', 'Zoológico de Brasília - status MMA (2025)', '2025 (publicação)', 'Brasil', 'https://zoo.df.gov.br/jacare-do-pantanal', 'A cadastrar após definição da imagem'),
  ('Sucuri-verde', 'Eunectes murinus', 'Réptil', 'Pantanal e Amazônia', 'Carnívoro', 'Vivíparo', 'Maior serpente das Américas.', 'Pode atingir mais de 7 metros.', 3, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Pressões potenciais: perda de várzeas, conflitos com pessoas e perseguição.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Jiboia', 'Boa constrictor', 'Réptil', 'Florestas e Cerrado', 'Carnívoro', 'Vivíparo', 'Mata a presa por constrição.', 'Não é peçonhenta.', 3, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Pressões potenciais: fragmentação florestal e perseguição por medo de serpentes.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Coral-verdadeira', 'Micrurus corallinus', 'Réptil', 'Florestas', 'Carnívoro', 'Ovíparo', 'Possui anéis vermelhos, pretos e brancos.', 'Seu veneno afeta o sistema nervoso.', 3, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Pressões potenciais: fragmentação da Mata Atlântica e mortalidade por perseguição.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Surucucu-pico-de-jaca', 'Lachesis muta', 'Réptil', 'Floresta Amazônica', 'Carnívoro', 'Ovíparo', 'Maior serpente peçonhenta das Américas.', 'Pode ultrapassar 3 metros.', 3, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Pressões potenciais: redução de florestas e perseguição de serpentes.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Iguana-verde', 'Iguana iguana', 'Réptil', 'Florestas tropicais', 'Herbívoro', 'Ovíparo', 'Lagarto arborícola de coloração verde.', 'É excelente nadadora.', 3, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Pressões potenciais: desmatamento e captura irregular.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Tartaruga-da-amazônia', 'Podocnemis expansa', 'Réptil', 'Rios amazônicos', 'Herbívoro', 'Ovíparo', 'Maior tartaruga de água doce da América do Sul.', 'Pode colocar mais de 100 ovos.', 3, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Coleta de ovos e indivíduos, caça, barragens e alteração de praias de desova.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Tracajá', 'Podocnemis unifilis', 'Réptil', 'Rios amazônicos', 'Onívoro', 'Ovíparo', 'Quelônio de água doce muito conhecido.', 'É bastante consumido em algumas regiões.', 3, 'Quase Ameaçado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Captura e comércio ilegais, coleta de ovos e alteração de ambientes aquáticos.', 'Zoológico de Brasília - status MMA (2025)', '2025 (publicação)', 'Brasil', 'https://www.zoo.df.gov.br/tracaja', 'A cadastrar após definição da imagem'),
  ('Jabuti-piranga', 'Chelonoidis carbonarius', 'Réptil', 'Florestas e Cerrado', 'Herbívoro', 'Ovíparo', 'Casco escuro com manchas avermelhadas.', 'É um dos jabutis mais conhecidos do Brasil.', 3, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'A população na natureza não foi quantificada por fonte específica conferida neste cadastro.', 'Não determinada', 'Captura e comércio ilegais, perda de habitat e atropelamentos.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem');

INSERT INTO anfibios (
  nome_popular, nome_cientifico, classificacao, habitat, alimentacao, reproducao, caracteristicas,
  curiosidade, id_especie, status_conservacao, imagem_url, populacao_estimada, observacao_populacao, tendencia_populacional,
  causas_ameaca, fonte_conservacao, data_avaliacao, escopo_avaliacao, fonte_url, credito_imagem
) VALUES
  ('Sapo-cururu', 'Rhinella diptycha', 'Anfíbio', 'Cerrado, Caatinga e áreas urbanas', 'Insetívoro', 'Ovíparo', 'Grande sapo de pele rugosa.', 'Libera substâncias tóxicas para se defender.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: contaminação da água, perda de áreas úmidas e atropelamentos.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Perereca-verde', 'Boana albomarginata', 'Anfíbio', 'Mata Atlântica', 'Insetívoro', 'Ovíparo', 'Possui discos adesivos nos dedos.', 'Excelente escaladora.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: desmatamento e contaminação dos riachos.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Perereca-macaco', 'Phyllomedusa bicolor', 'Anfíbio', 'Floresta Amazônica', 'Insetívoro', 'Ovíparo', 'Grande perereca verde.', 'Sua pele produz substâncias estudadas pela medicina.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: destruição da floresta e captura sem controle.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Rã-manteiga', 'Leptodactylus latrans', 'Anfíbio', 'Lagoas e brejos', 'Insetívoro', 'Ovíparo', 'Rã de médio porte.', 'É comum em diversas regiões do Brasil.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: redução de brejos e contaminação dos corpos d’água.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Perereca-de-vidro', 'Vitreorana uranoscopa', 'Anfíbio', 'Mata Atlântica', 'Insetívoro', 'Ovíparo', 'Barriga parcialmente transparente.', 'Os órgãos internos podem ser vistos.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: desmatamento, poluição de córregos e alterações microclimáticas.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Sapo-folha', 'Proceratophrys boiei', 'Anfíbio', 'Mata Atlântica', 'Insetívoro', 'Ovíparo', 'Corpo semelhante a uma folha seca.', 'Excelente camuflagem.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: perda de folhiço florestal e alteração da umidade.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Sapo-anão', 'Brachycephalus ephippium', 'Anfíbio', 'Serra do Mar', 'Insetívoro', 'Ovíparo', 'Menos de 2 centímetros de comprimento.', 'É um dos menores vertebrados do mundo.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: fragmentação da Serra do Mar e alterações microclimáticas.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Sapinho-pingo-de-ouro', 'Brachycephalus rotenbergae', 'Anfíbio', 'Mata Atlântica', 'Insetívoro', 'Ovíparo', 'Cor laranja intensa.', 'É endêmico do Brasil.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: destruição de micro-habitats e mudanças na umidade florestal.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Rã-de-córrego', 'Crossodactylus gaudichaudii', 'Anfíbio', 'Córregos da Mata Atlântica', 'Insetívoro', 'Ovíparo', 'Habita riachos de águas limpas.', 'É sensível à poluição.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: assoreamento de riachos e poluição da água.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Perereca-de-folhagem', 'Phasmahyla guttata', 'Anfíbio', 'Mata Atlântica', 'Insetívoro', 'Ovíparo', 'Deposita ovos sobre folhas.', 'Os girinos caem na água ao nascer.', 4, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não foi localizada aqui uma contagem populacional comparável para esta espécie; a abundância varia entre regiões.', 'Não determinada', 'Pressões potenciais: perda florestal e mudanças na qualidade de pequenos cursos de água.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem');

INSERT INTO peixes (
  nome_popular, nome_cientifico, classificacao, habitat, alimentacao, reproducao, caracteristicas,
  curiosidade, id_especie, status_conservacao, imagem_url, populacao_estimada, observacao_populacao, tendencia_populacional,
  causas_ameaca, fonte_conservacao, data_avaliacao, escopo_avaliacao, fonte_url, credito_imagem
) VALUES
  ('Pirarucu', 'Arapaima gigas', 'Peixe', 'Rios e lagos da Amazônia', 'Carnívoro', 'Ovíparo', 'Um dos maiores peixes de água doce do mundo.', 'Pode ultrapassar 3 metros de comprimento.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: sobrepesca, barragens e alterações dos lagos de várzea.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Tambaqui', 'Colossoma macropomum', 'Peixe', 'Rios da Amazônia', 'Onívoro', 'Ovíparo', 'Possui corpo alto e forte.', 'É importante dispersor de sementes.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: pesca excessiva, barragens e degradação das várzeas amazônicas.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Pacu', 'Piaractus mesopotamicus', 'Peixe', 'Bacia do Paraguai e Paraná', 'Onívoro', 'Ovíparo', 'Possui dentes fortes para quebrar frutos.', 'Muito utilizado na piscicultura.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: barragens, poluição e interrupção de migrações reprodutivas.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Jaú', 'Zungaro jahu', 'Peixe', 'Rios das bacias Paraná e Paraguai', 'Carnívoro', 'Ovíparo', 'Um dos maiores bagres brasileiros.', 'Pode pesar mais de 100 kg.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: pesca excessiva e degradação de grandes rios.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Pintado', 'Pseudoplatystoma corruscans', 'Peixe', 'Pantanal e rios brasileiros', 'Carnívoro', 'Ovíparo', 'Corpo com manchas escuras.', 'Muito apreciado na pesca esportiva.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: pesca, barragens e redução de habitats adequados.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Dourado', 'Salminus brasiliensis', 'Peixe', 'Rios de água doce', 'Carnívoro', 'Ovíparo', 'Peixe forte e veloz.', 'É considerado o rei dos rios.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: barragens, interrupção de migrações e pesca intensiva.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Poraquê', 'Electrophorus electricus', 'Peixe', 'Rios amazônicos', 'Carnívoro', 'Ovíparo', 'Produz descargas elétricas.', 'Pode gerar choques superiores a 600 volts.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: alteração de águas amazônicas e contaminação.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Sardinha-verdadeira', 'Sardinella brasiliensis', 'Peixe', 'Litoral brasileiro', 'Planktívoro', 'Ovíparo', 'Forma grandes cardumes.', 'É uma das espécies mais pescadas do país.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: pesca intensiva, poluição e mudanças no ambiente costeiro.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Robalo-flecha', 'Centropomus undecimalis', 'Peixe', 'Manguezais e estuários', 'Carnívoro', 'Ovíparo', 'Peixe de grande importância comercial.', 'Tolera água doce e salgada.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: degradação de manguezais, pesca excessiva e poluição.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Peixe-cachorro', 'Hydrolycus scomberoides', 'Peixe', 'Rios amazônicos', 'Carnívoro', 'Ovíparo', 'Possui grandes dentes.', 'É conhecido como vampiro dos rios.', 5, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Não há estimativa populacional abrangente documentada neste cadastro; desembarque pesqueiro não equivale a número de indivíduos.', 'Não determinada', 'Pressões potenciais: alterações dos rios, pesca e redução de presas.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem');

INSERT INTO invertebrados (
  nome_popular, nome_cientifico, classificacao, habitat, alimentacao, reproducao, caracteristicas,
  curiosidade, id_especie, status_conservacao, imagem_url, populacao_estimada, observacao_populacao, tendencia_populacional,
  causas_ameaca, fonte_conservacao, data_avaliacao, escopo_avaliacao, fonte_url, credito_imagem
) VALUES
  ('Borboleta-azul', 'Morpho helenor', 'Invertebrado', 'Mata Atlântica e Amazônia', 'Herbívoro', 'Ovíparo', 'Asas azuis metálicas.', 'Sua coloração é produzida pela estrutura das asas.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: desmatamento e perda de plantas hospedeiras.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Borboleta-da-praia', 'Parides ascanius', 'Invertebrado', 'Restingas da Mata Atlântica', 'Herbívoro', 'Ovíparo', 'Borboleta de asas pretas e manchas vermelhas.', 'É uma espécie ameaçada.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Perda de vegetação de restinga, urbanização costeira e fragmentação do habitat.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Abelha-jataí', 'Tetragonisca angustula', 'Invertebrado', 'Florestas e áreas urbanas', 'Nectarívoro', 'Ovíparo', 'Abelha sem ferrão de pequeno porte.', 'Produz mel muito valorizado.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: inseticidas e perda de locais de nidificação.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Abelha-mandaçaia', 'Melipona quadrifasciata', 'Invertebrado', 'Mata Atlântica', 'Nectarívoro', 'Ovíparo', 'Abelha social sem ferrão.', 'Importante polinizadora.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: desmatamento, pesticidas e perda de recursos florais.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Abelha-uruçu', 'Melipona scutellaris', 'Invertebrado', 'Mata Atlântica', 'Nectarívoro', 'Ovíparo', 'Grande abelha sem ferrão.', 'Produz mel de alta qualidade.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: desmatamento da Mata Atlântica, queimadas e captura de colônias.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Aranha-caranguejeira', 'Lasiodora parahybana', 'Invertebrado', 'Mata Atlântica', 'Carnívoro', 'Ovíparo', 'Grande aranha peluda.', 'É uma das maiores caranguejeiras do mundo.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: destruição de solo florestal e coleta irregular.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Aranha-armadeira', 'Phoneutria nigriventer', 'Invertebrado', 'Mata Atlântica', 'Carnívoro', 'Ovíparo', 'Aranha altamente peçonhenta.', 'É considerada uma das aranhas mais venenosas do mundo.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: destruição de habitats florestais e perseguição.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Estrela-do-mar', 'Echinaster brasiliensis', 'Invertebrado', 'Costões rochosos', 'Carnívoro', 'Ovíparo', 'Equinodermo de cinco braços.', 'Pode regenerar braços perdidos.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: poluição costeira e alterações dos fundos rochosos.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Caranguejo-uçá', 'Ucides cordatus', 'Invertebrado', 'Manguezais', 'Onívoro', 'Ovíparo', 'Importante crustáceo dos manguezais.', 'Escava tocas profundas na lama.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Supressão de manguezais, poluição e sobrecaptura.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem'),
  ('Camarão-da-amazônia', 'Macrobrachium amazonicum', 'Invertebrado', 'Rios amazônicos', 'Onívoro', 'Ovíparo', 'Camarão de água doce.', 'Possui grande importância econômica para a pesca.', 6, 'Não verificado', NULL, 'Não quantificada em fonte validada', 'Sem levantamento populacional abrangente validado neste cadastro; registros de ocorrência não equivalem a tamanho populacional.', 'Não determinada', 'Pressões potenciais: barragens, poluição e alteração das várzeas amazônicas.', 'Pendente de validação científica', 'Não informada', 'Não definido', 'Não disponível', 'A cadastrar após definição da imagem');

-- 5. CATÁLOGO COM IDENTIFICAÇÃO ÚNICA GLOBAL PARA CADA UM DOS 60 ANIMAIS
-- Uma entrada em catálogo para (grupo, id_animal); o id_catalogo não se repete.
CREATE TABLE catalogo_especies (
  id_catalogo INT NOT NULL AUTO_INCREMENT,
  id_especie INT NOT NULL,
  id_animal INT NOT NULL,
  PRIMARY KEY (id_catalogo),
  UNIQUE KEY uq_catalogo_origem (id_especie, id_animal),
  CONSTRAINT fk_catalogo_grupo FOREIGN KEY (id_especie)
    REFERENCES pesquisa_especie(id_especie) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO catalogo_especies (id_especie, id_animal)
SELECT origem.id_especie, origem.id_animal
FROM (
  SELECT id_especie, id_animal FROM mamiferos
  UNION ALL SELECT id_especie, id_animal FROM aves
  UNION ALL SELECT id_especie, id_animal FROM repteis
  UNION ALL SELECT id_especie, id_animal FROM anfibios
  UNION ALL SELECT id_especie, id_animal FROM peixes
  UNION ALL SELECT id_especie, id_animal FROM invertebrados
) AS origem;

-- 6. VIEW DO CATÁLOGO (6 GRUPOS)
CREATE OR REPLACE VIEW vw_animais_completos AS
SELECT c.id_catalogo, g.classe_especie, a.*
FROM catalogo_especies c JOIN pesquisa_especie g ON g.id_especie=c.id_especie
JOIN mamiferos a ON a.id_especie=c.id_especie AND a.id_animal=c.id_animal
UNION ALL
SELECT c.id_catalogo, g.classe_especie, a.*
FROM catalogo_especies c JOIN pesquisa_especie g ON g.id_especie=c.id_especie
JOIN aves a ON a.id_especie=c.id_especie AND a.id_animal=c.id_animal
UNION ALL
SELECT c.id_catalogo, g.classe_especie, a.*
FROM catalogo_especies c JOIN pesquisa_especie g ON g.id_especie=c.id_especie
JOIN repteis a ON a.id_especie=c.id_especie AND a.id_animal=c.id_animal
UNION ALL
SELECT c.id_catalogo, g.classe_especie, a.*
FROM catalogo_especies c JOIN pesquisa_especie g ON g.id_especie=c.id_especie
JOIN anfibios a ON a.id_especie=c.id_especie AND a.id_animal=c.id_animal
UNION ALL
SELECT c.id_catalogo, g.classe_especie, a.*
FROM catalogo_especies c JOIN pesquisa_especie g ON g.id_especie=c.id_especie
JOIN peixes a ON a.id_especie=c.id_especie AND a.id_animal=c.id_animal
UNION ALL
SELECT c.id_catalogo, g.classe_especie, a.*
FROM catalogo_especies c JOIN pesquisa_especie g ON g.id_especie=c.id_especie
JOIN invertebrados a ON a.id_especie=c.id_especie AND a.id_animal=c.id_animal;

-- 7. DOACOES
CREATE TABLE IF NOT EXISTS doacoes (
 id_doacao INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 id_usuario INT NOT NULL,
 valor DECIMAL(10,2) NOT NULL,
 criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 KEY idx_doacoes_usuario (id_usuario),
 CONSTRAINT fk_doacoes_usuario FOREIGN KEY (id_usuario)
 REFERENCES usuario_cadastro(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. NOTICIAS (sem dados ficticios)
CREATE TABLE IF NOT EXISTS noticias_natureza (
 id_noticia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 titulo VARCHAR(255) NOT NULL,
 descricao TEXT NOT NULL,
 imagem_url VARCHAR(500) NULL,
 fonte_url VARCHAR(500) NULL,
 publicado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. RECUPERACAO DE SENHA
CREATE TABLE IF NOT EXISTS recuperacao_senha (
 id_usuario INT NOT NULL PRIMARY KEY,
 token_hash BINARY(32) NOT NULL,
 expira_em DATETIME NOT NULL,
 UNIQUE KEY uq_recuperacao_token (token_hash),
 CONSTRAINT fk_recuperacao_usuario FOREIGN KEY (id_usuario)
 REFERENCES usuario_cadastro(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

SELECT COUNT(*) AS animais_cadastrados FROM vw_animais_completos;
