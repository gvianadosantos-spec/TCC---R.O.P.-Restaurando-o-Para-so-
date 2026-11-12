
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;

if (
  typeof JWT_SECRET !== 'string' ||
  JWT_SECRET.length < 32 ||
  JWT_SECRET.includes('COLE_AQUI')
) {
  throw new Error(
    'Configure a variavel de ambiente JWT_SECRET (minimo 32 caracteres).'
  );
}

// GERAR TOKEN
export function generateToken(usuario) {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      nome_usuario: usuario.nome_usuario,
      role: 'user'
    },
    JWT_SECRET,
    {
      expiresIn: '2h',
      algorithm: 'HS256'
    }
  );
}

// LER TOKEN
export function getTokenInfo(req) {
  const authorization = req.headers.authorization;

  const bearer =
    typeof authorization === 'string'
      ? authorization.match(/^Bearer\s+(.+)$/i)?.[1]
      : null;

  const token = bearer ?? req.headers['x-access-token'];

  if (typeof token !== 'string') {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });
  } catch {
    return null;
  }
}

// PROTEGER ROTAS
export function getAuthentication(checkRole, throw401 = true) {
  return (req, resp, next) => {
    const usuario = getTokenInfo(req);

    if (!usuario) {
      if (throw401) {
        return resp.status(401).json({
          erro: 'Token ausente, inválido ou expirado.'
        });
      }

      return next();
    }

    req.user = usuario;

    if (checkRole && !checkRole(usuario)) {
      return resp.status(403).json({
        erro: 'Acesso negado.'
      });
    }

    next();
  };
}
