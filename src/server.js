import http from 'node:http'

const tasks = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/') {
    res.end('Home da aplicacao')
  }

  if (method === 'GET' && url === '/tasks') {
    return res
      .setHeader('content-type', 'application/json')
      .end(JSON.stringify(tasks))
  }

  if (method === 'POST' && url === '/tasks') {
    tasks.push({
      id: 1,
      title: 'Task',
      description: 'Tarefa de teste',
      completedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    })

    console.log('entrou no POST')
    console.log(tasks)

    return res.writeHead(201).end()
  }
})

const port = 3333
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
  console.log(tasks)
})
