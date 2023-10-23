import { Parser } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('assets/csv.csv', import.meta.url)

const createStream = fs.createReadStream(csvPath)

async function parseCsv() {
  const parseStream = createStream.pipe(
    new Parser({ delimiter: ',', fromLine: 2 })
  )

  for await (const line of parseStream) {
    const [title, description] = line

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}

parseCsv()
