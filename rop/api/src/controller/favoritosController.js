import { Router } from 'express';
import { getAuthentication } from '../utils/jwt.js';
import * as favoritos from '../repository/favoritosRepository.js';

const rotas = Router();
const autenticar = getAuthentication();

function idValido(valor) {
  const numero = Number(valor);
  return Number.isSafeInteger(numero) && numero > 0 ? numero : null;
}

function falha(resp, erro) {
  console.error('[API R.O.P. - favoritos]', erro);
  return resp.status(500).json({ erro: 'Não foi possível consultar os favoritos agora.' });
}

// Cada solicitação usa exclusivamente o id_usuario do JWT.
rotas.get('/favoritos/me', autenticar, async (req, resp) => {
  try {
    const lista = await favoritos.listarFavoritos(req.user.id_usuario);
    return resp.json(lista);
  } catch (erro) {
    return falha(resp, erro);
  }
});

rotas.post('/favoritos', autenticar, async (req, resp) => {
  const idEspecie = idValido(req.body?.id_especie);
  const idAnimal = idValido(req.body?.id_animal);
  if (!idEspecie || !idAnimal) {
    return resp.status(400).json({ erro: 'Informe um animal válido.' });
  }
  try {
    if (!(await favoritos.animalExiste(idEspecie, idAnimal))) {
      return resp.status(404).json({ erro: 'Animal não encontrado no catálogo.' });
    }
    await favoritos.adicionarFavorito(req.user.id_usuario, idEspecie, idAnimal);
    return resp.status(200).json({ salvo: true, id_especie: idEspecie, id_animal: idAnimal });
  } catch (erro) {
    return falha(resp, erro);
  }
});

rotas.delete('/favoritos/:id_especie/:id_animal', autenticar, async (req, resp) => {
  const idEspecie = idValido(req.params.id_especie);
  const idAnimal = idValido(req.params.id_animal);
  if (!idEspecie || !idAnimal) {
    return resp.status(400).json({ erro: 'Informe um animal válido.' });
  }
  try {
    await favoritos.removerFavorito(req.user.id_usuario, idEspecie, idAnimal);
    return resp.json({ removido: true });
  } catch (erro) {
    return falha(resp, erro);
  }
});

export default rotas;
