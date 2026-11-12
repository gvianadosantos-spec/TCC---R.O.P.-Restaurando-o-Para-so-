import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { addRoutes } from './routes.js'

const api = express()

api.use(cors())
// O avatar compactado tem até ~155 KB em base64. O limite anterior era 100 KB.
api.use(express.json({ limit: '250kb' }))

api.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', mensagem: 'API R.O.P. funcionando' })
})

addRoutes(api)

const PORT = Number(process.env.PORT) || 5050
api.listen(PORT, () => {
  console.log(`API R.O.P. iniciada em http://localhost:${PORT}`)
})
