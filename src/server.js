import http from 'node:http'

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/') {
    res.end('Home da aplicacao')
  }

  if (method === 'GET' && url === '/tasks') {
    return res.end('Listagem de tasks')
  }

  if (method === 'POST' && url === '/tasks') {
    return res.end('Criação de tasks')
  }
  
})

const port = 3333
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
