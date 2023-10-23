import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
        method: 'GET',
    path: buildRoutePath('/'),
    handler: (req, res) => {
      return res.end('Home da aplicação')
    }
  },
  {
        method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null )

      return res.end(JSON.stringify(tasks))
    }
  },
  {
        method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.selectUnique('tasks', id)

      if (!task) {
        return res.writeHead(404).end('task não encontrada')
      } else {
        return res.end(JSON.stringify(task))
      }
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end('task criada')
    }
  },
  {
        method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const updatedTask = database.update('tasks', id, {
        title,
        description,
        updatedAt: new Date()
      })

      if (updatedTask === null) {
        return res.writeHead(404).end('task não encontrada')
      } else {
        return res.writeHead(204).end()
      }
    }
  },
  {
        method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const completedTask = database.updateStatus('tasks', id, {
        completedAt: new Date(),
        updatedAt: new Date()
      })

      if (completedTask === null) {
        return res.writeHead(404).end('task não encontrada')
      } else {
        return res.writeHead(204).end()
      }
    }
  },
  {
        method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const deletedTask = database.delete('tasks', id)

      if (deletedTask === null) {
        return res.writeHead(404).end('task não encontrada')
      } else {
        return res.writeHead(204).end()
      }
    }
  }
]
