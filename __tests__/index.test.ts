import { resizeStream } from '../src/lib'
import { Application } from 'express'
import { imageSize } from 'image-size'

import * as path from 'path'
import express from 'express'

let server: any

describe('integration testing', () => {
  beforeAll(() => {
    const app: Application = express()
    app.use(express.static(path.join(__dirname, 'public')))
    server = app.listen(3000, () => null)
  })

  afterAll(() => {
    server.close()
  })

  test('resizes remote image retrieved from server to webp', async () => {
    const sourceImageData = imageSize(path.join(__dirname, 'public', 'profile.jpg'))

    const response: Buffer = await resizeStream({
      srcUrl: 'http://localhost:3000/profile.jpg',
      w: 100
    })

    const transformedImageData = imageSize(response)

    expect(sourceImageData).toEqual({
      "height": 460,
      "type": "jpg",
      "width": 460,
    })
    expect(transformedImageData).toEqual({
      "height": 100,
      "type": "webp",
      "width": 100,
    })
  })
})