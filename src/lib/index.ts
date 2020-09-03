import sharp from 'sharp'
import http from 'http'

type ResizeParameters = {
  srcUrl: string
  w: number
  h?: number
}

export const resize = async ({srcUrl, w}: ResizeParameters): Promise<Buffer> => {
  let data: Uint8Array[] = []

  return new Promise(resolve => {
    http.get(srcUrl, { method: 'GET' }, (response) => {
      response.on('data', (chunk) => {
        data.push(chunk);
      })

      response.on('end', () => {
        const imageBuffer = Buffer.concat(data)
        const resizesBuffer = sharp(imageBuffer).resize(w).toBuffer()
        resolve(resizesBuffer)
      })
    })
  })
}