import { Router } from 'express';
import * as dbAnimais from '../repository/animaisRepository.js';

const endpoints = Router();

const categorias = {
  mamifero: 'Mamíferos',
  mamiferos: 'Mamíferos',
  ave: 'Aves',
  aves: 'Aves',
  reptil: 'Répteis',
  repteis: 'Répteis',
  anfibio: 'Anfibios',
  anfibios: 'Anfibios',
  peixe: 'Peixes',
  peixes: 'Peixes',
  invertebrado: 'Invertebrados',
  invertebrados: 'Invertebrados'
};

function simplificar(valor) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function lerTexto(valor, nome, maximo = 150) {
  if (valor === undefined || valor === null) return '';
  if (typeof valor !== 'string') {
    throw new Error(`O parâmetro ${nome} deve ser um texto.`);
  }
  const texto = valor.trim();
  if (texto.length > maximo) {
    throw new Error(`O parâmetro ${nome} excede ${maximo} caracteres.`);
  }
  return texto;
}

function normalizarCategoria(valor) {
  const texto = lerTexto(valor, 'categoria', 60);
  if (!texto) return '';
  const categoria = categorias[simplificar(texto)];
  if (!categoria) {
    throw new Error('Categoria inválida. Use Mamíferos, Aves, Répteis, Anfibios, Peixes ou Invertebrados.');
  }
  return categoria;
}

function tratarErro(resp, erro) {
  if (erro instanceof Error && erro.name === 'ErroValidacao') {
    return resp.status(400).json({ erro: erro.message });
  }
  console.error('[API R.O.P. - animais]', erro);
  return resp.status(500).json({ erro: 'Não foi possível consultar os animais no banco de dados.' });
}

// Mantém validações de entradas e respostas de erro padronizadas.
async function executar(resp, operacao) {
  try {
    return await operacao();
  } catch (erro) {
    return tratarErro(resp, erro);
  }
}

function validacao(fn) {
  try {
    return fn();
  } catch (erro) {
    erro.name = 'ErroValidacao';
    throw erro;
  }
}

// Teste adicional: /health já confirma o Express; /health/banco confirma o MySQL.
endpoints.get('/health/banco', (req, resp) => executar(resp, async () => {
  const dados = await dbAnimais.estatisticasAnimais();
  return resp.json({ status: 'ok', banco: 'rop', total_animais: dados.total });
}));

// Rotas existentes: /mamifero, /aves, /repteis, /anfibios, /peixes, /invertebrados.
const rotasGrupos = [
  ['/mamifero', 'Mamíferos'],
  ['/mamiferos', 'Mamíferos'],
  ['/aves', 'Aves'],
  ['/repteis', 'Répteis'],
  ['/anfibios', 'Anfibios'],
  ['/peixes', 'Peixes'],
  ['/invertebrados', 'Invertebrados']
];
for (const [rota, categoria] of rotasGrupos) {
  endpoints.get(rota, (req, resp) => executar(resp, async () => {
    return resp.json(await dbAnimais.listAnimais({ categoria }));
  }));
}

// /animais?nome=onça&categoria=Mamíferos&status=Vulnerável
endpoints.get('/animais', (req, resp) => executar(resp, async () => {
  const filtros = validacao(() => ({
    nome: lerTexto(req.query.nome, 'nome'),
    categoria: normalizarCategoria(req.query.categoria),
    status: lerTexto(req.query.status, 'status', 60)
  }));
  return resp.json(await dbAnimais.listAnimais(filtros));
}));

// Essa rota deve ficar antes de /animais/:id para não confundir 'estatisticas' com um id.
endpoints.get('/animais/estatisticas', (req, resp) => executar(resp, async () => {
  return resp.json(await dbAnimais.estatisticasAnimais());
}));

// id é o id_catalogo (único entre as seis tabelas), não o id_animal de cada grupo.
endpoints.get('/animais/:id', (req, resp) => executar(resp, async () => {
  const id = validacao(() => {
    const texto = req.params.id;
    if (!/^\d+$/.test(texto) || !Number.isSafeInteger(Number(texto)) || Number(texto) < 1) {
      throw new Error('O id do catálogo precisa ser um número inteiro positivo.');
    }
    return Number(texto);
  });
  const animal = await dbAnimais.getAnimalPorCatalogo(id);
  if (!animal) return resp.status(404).json({ erro: 'Animal não encontrado.' });
  return resp.json(animal);
}));

// Corrigido: o código anterior lia req.query.nome mesmo com rota /pesquisa/:nome.
endpoints.get('/pesquisa/:nome', (req, resp) => executar(resp, async () => {
  const nome = validacao(() => lerTexto(req.params.nome, 'nome'));
  return resp.json(await dbAnimais.listAnimaisPesquisa(nome));
}));

export default endpoints;
