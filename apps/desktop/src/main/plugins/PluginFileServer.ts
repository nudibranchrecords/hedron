import http from 'http'
import { getPort } from 'get-port-please'
import { getContentTypeFromFileName } from '@utils/getContentTypeFromFileName'

const HOST = process.platform.startsWith('win') ? 'localhost' : '127.0.0.1'

/** Serves plugin build output straight from memory, so builds never touch disk. */
export class PluginFileServer {
  private server?: http.Server
  private files = new Map<string, Uint8Array>()
  public baseUrl = ''

  start = async () => {
    if (this.server) return
    const port = await getPort({ host: HOST })

    this.server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url ?? '').split('?')[0])
      const file = this.files.get(urlPath)

      if (!file) {
        res.writeHead(404, { 'Access-Control-Allow-Origin': '*' })
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': getContentTypeFromFileName(urlPath),
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      })
      res.end(file)
    })

    await new Promise<void>((resolve) => this.server!.listen(port, HOST, resolve))
    this.baseUrl = `http://${HOST}:${port}`
  }

  /** Replaces every file under `/<prefix>/` with the given set. */
  setFiles = (prefix: string, files: Map<string, Uint8Array>) => {
    this.removeFiles(prefix)
    for (const [filePath, contents] of files) this.files.set(`/${prefix}/${filePath}`, contents)
  }

  removeFiles = (prefix: string) => {
    for (const key of [...this.files.keys()]) {
      if (key.startsWith(`/${prefix}/`)) this.files.delete(key)
    }
  }

  stop = () => {
    this.server?.close()
    this.server = undefined
    this.files.clear()
  }
}
