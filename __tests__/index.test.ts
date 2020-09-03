import { resize } from '../src/lib'
import { Application } from 'express'

import * as path from 'path'
import * as fs from 'fs'
import express from 'express'

import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot });

const app: Application = express()
const dir = path.join(__dirname, 'public')
const outDir = path.join(__dirname, 'output')
app.use(express.static(dir))

let server: any

describe('integration testing', () => {
  beforeAll(()=> {
    server = app.listen(3000, function () {
      console.log('Listening on http://localhost:3000')
    })
  })

  afterAll(()=> {
    server.close()
  })

  test('resize image', async () => {
    const response: Buffer = await resize({
      srcUrl: 'http://localhost:3000/profile.jpg',
      w: 10
    })

    await fs.writeFile(path.join(outDir, 'profile.jpg'), response, function (err) {
      if (err) throw err;
    })

    expect(response).toMatchImageSnapshot();
  })
})