import cadastro from './controller/cadastroController.js'
import animais from './controller/animaisController.js'
import noticias from './controller/noticiasController.js'
import doacao from './controller/doadoresController.js'
import recuperacao from './controller/recuperacaoController.js'

export function addRoutes(api) {
  api.use(cadastro);
  api.use(animais)
  api.use(noticias)
  api.use(doacao)
 api.use(recuperacao)
}

