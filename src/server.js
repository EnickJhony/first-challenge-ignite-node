import http from 'node:http'

const server = http.createServer((req, res) => {
  res.end('Hello World')
})

const port = 3333

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
