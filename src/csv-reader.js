import fs from 'node:fs'
import { Parser } from 'csv-parse'

const results = []

const databasePath = new URL('assets/csv.csv', import.meta.url)

fs.createReadStream(databasePath)
  .pipe(new Parser({
    columns: true
  }))
  .on('error', err => {
    console.error(err)
  })
  .on('data', data => {
    results.push(data)
  })
  .on('end', () => {
    console.log('dados ' + results.length)
  })
