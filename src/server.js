import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { json } from './middlewares/json.js'
import { Database } from './database.js'

const tasks = []
const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/') {
    res.end('Home da aplicacao')
  }

  if (method === 'GET' && url === '/tasks') {
    const tasks = database.select('tasks')
    
    return res.end(JSON.stringify(tasks))
  }

  if (method === 'POST' && url === '/tasks') {
    const { title, description } = req.body
    tasks.push({
      id: randomUUID(),
      title,
      description,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: null
    })

    return res.writeHead(201).end("task criada")
  }
})

const port = 3333
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
