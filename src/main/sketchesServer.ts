import express from 'express'
import cors from 'cors'
const app = express()
const PORT = 3030
const baseUrl = `http://localhost:${PORT}`

export const createSketchesServer = (): string => {
  app.use(cors())
  app.use(express.static('/Users/alex/Desktop/sketches'))

  app.listen(PORT, () => {
    console.log(`Sketches server is running on http://localhost:${PORT}`)
  })

  return baseUrl
}
