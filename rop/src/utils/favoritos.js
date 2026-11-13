// Identificação por grupo e número interno no catálogo de espécies.
const GRUPOS = { 'Mamíferos':1, 'Aves':2, 'Répteis':3,
  'Anfíbios':4, 'Anfibios':4, 'Peixes':5, 'Invertebrados':6 };
const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5050').replace(/\/+$/, '');

export function identificarFavorito(animal) {
  if (!animal) return null;
  const grupo = Number(animal.id_especie ?? GRUPOS[animal.grupo ?? animal.classe_especie]);
  const idLocal = String(animal.id ?? '').match(/^rop-[a-z]+-(\d+)$/);
  const id = Number(animal.id_animal ?? idLocal?.[1]);
  if (!Number.isSafeInteger(grupo) || !Number.isSafeInteger(id) || grupo < 1 || id < 1) return null;
  return { id_especie:grupo, id_animal:id, chave:`${grupo}:${id}` };
}
export const chaveFavorito = (animal) => identificarFavorito(animal)?.chave ?? null;

async function requisitar(path, options={}) {
  const token = sessionStorage.getItem('rop_token');
  if (!token) throw new Error('Entre na sua conta para salvar favoritos.');
  const resp = await fetch(`${API_URL}${path}`, { ...options, headers: {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${token}`
  } });
  const dados = await resp.json().catch(() => ({}));
  if (resp.status === 401) {
    sessionStorage.removeItem('rop_token');
    window.dispatchEvent(new Event('rop:login'));
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }
  if (!resp.ok) throw new Error(dados.erro || 'Não foi possível atualizar seus favoritos.');
  return dados;
}

export const consultarFavoritos = (signal) => requisitar('/favoritos/me', { signal });
export function definirFavorito(id, salvar) {
  if (!id) throw new Error('Animal não identificado no catálogo.');
  return salvar
    ? requisitar('/favoritos', { method:'POST', body:JSON.stringify({
        id_especie:id.id_especie, id_animal:id.id_animal }) })
    : requisitar(`/favoritos/${id.id_especie}/${id.id_animal}`, { method:'DELETE' });
}
