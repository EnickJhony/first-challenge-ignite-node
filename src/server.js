import http from 'node:http'

const tasks = []

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  if (method === 'GET' && url === '/') {
    res.end('Home da aplicacao')
  }

  if (method === 'GET' && url === '/tasks') {
    return res
      .setHeader('content-type', 'application/json')
      .end(JSON.stringify(tasks))
  }

  if (method === 'POST' && url === '/tasks') {
    const { id, title, description } = req.body
    const { completedAt, createdAt, updatedAt } = req.body
    tasks.push({
      id,
      title,
      description,
      completedAt,
      createdAt,
      updatedAt
    })

    return res.writeHead(201).end()
  }
})

const port = 3333
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
