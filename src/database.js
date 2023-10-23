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

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }

  selectUnique(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      return this.#database[table][rowIndex]
    } else {
      return null
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
    } else {
      return null
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
    } else {
      return null
    }
  }
  updateStatus(table, id, data) {
    const { completedAt, updatedAt } = data

    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const dataDB = this.#database[table][rowIndex]

    if (rowIndex > -1) {
      if (dataDB.completedAt === null) {
        dataDB.completedAt = completedAt
        this.#database[table][rowIndex] = { ...dataDB, updatedAt }
        this.#persist()
      } else {
        dataDB.completedAt = null
        this.#database[table][rowIndex] = { ...dataDB, updatedAt }
        this.#persist()
      }
    } else {
      return null
    }
  }
}
