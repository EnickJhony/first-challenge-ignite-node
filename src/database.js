import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    const data = this.#database[table] ?? []
    return data
  }

  selectUnique(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      return this.#database[table][rowIndex]
    }
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(table, id, data) {
    const { title, description, updatedAt } = data
    const indexRow = this.#database[table].findIndex(row => row.id === id)

    const dataDB = this.#database[table][indexRow]

    const isTitleNull = title === undefined
    const isDescriptionNull = description === undefined

    if (indexRow > -1) {
      if (isTitleNull) {
        this.#database[table][indexRow] = {
          ...dataDB,
          description,
          updatedAt
        }
        this.#persist()
      } else if (isDescriptionNull) {
        this.#database[table][indexRow] = {
          ...dataDB,
          title,
          updatedAt
        }
        this.#persist()
      } else {
        this.#database[table][indexRow] = {
          ...dataDB,
          title,
          description,
          updatedAt
        }
        this.#persist()
      }
    }
  }
  updateStatus(table, id, data) {
    const { completedAt, updatedAt } = data

    const indexRow = this.#database[table].findIndex(row => row.id === id)
    const dataDB = this.#database[table][indexRow]

    const statusDoBanco = dataDB.completedAt

    if (statusDoBanco === null) {
      dataDB.completedAt = completedAt
      this.#database[table][indexRow] = { ...dataDB, updatedAt }
    } else {
      dataDB.completedAt = null
      this.#database[table][indexRow] = { ...dataDB, updatedAt }
    }
  }
}
