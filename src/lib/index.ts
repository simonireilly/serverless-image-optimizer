import sharp from 'sharp'
import http from 'http'

type ResizeParameters = {
  srcUrl: string
  w: number
  h?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export const resizeStream = async ({ srcUrl, w, format = 'webp' }: ResizeParameters): Promise<Buffer> => {
  const imageResizer = sharp().resize(w)[format]()

  return new Promise(resolve => {
    http.get(srcUrl, { method: 'GET' }, (response) => {
      response.pipe(imageResizer)

      response.on('end', () => {
        resolve(imageResizer.toBuffer())
      })
    })
  })
}