import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { addRoutes } from './routes.js'
import { con } from './repository/connection.js'
import { prepararNoticias } from './repository/noticiasRepository.js'
import { prepararFavoritos } from './repository/favoritosRepository.js'

const api = express()

api.use(cors())
// O avatar compactado tem até ~155 KB em base64. O limite anterior era 100 KB.
api.use(express.json({ limit: '250kb' }))

api.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'API R.O.P. funcionando' })
})

// Mantém /health/banco da rota de animais; diagnóstico de notícias em rota própria.
api.get('/health/noticias', async (req, res) => {
  try {
    const [bancoRows] = await con.query('SELECT DATABASE() AS banco')
    const [noticiasRows] = await con.query('SELECT COUNT(*) AS noticias FROM noticias_natureza')

    res.status(200).json({
      status: 'ok',
      banco: bancoRows[0]?.banco || null,
      noticias: Number(noticiasRows[0]?.noticias ?? 0)
    })
  } catch (erro) {
    console.error('Erro no teste do banco:', erro)
    res.status(503).json({
      status: 'erro',
      mensagem: 'A API iniciou, mas não conseguiu acessar o banco de dados.'
    })
  }
})

addRoutes(api)

const PORT = Number(process.env.PORT) || 5050

async function iniciar() {
  try {
    await prepararNoticias()
    console.log('Módulo de notícias conectado ao banco e preparado.')
  } catch (erro) {
    console.error('Aviso: não foi possível preparar notícias no banco:', erro.message)
  }

  try {
    await prepararFavoritos()
    console.log('Tabela de favoritos verificada com sucesso.')
  } catch (erro) {
    console.error('Aviso: não foi possível preparar favoritos no banco:', erro)
  }

  api.listen(PORT, () => {
    console.log(`API R.O.P. iniciada em http://localhost:${PORT}`)
  })
}

iniciar()