import { EventEmitter } from 'events'
import http from 'http'
import fs from 'fs'
import path from 'path'
import chokidar, { FSWatcher } from 'chokidar'
import { getPort } from 'get-port-please'
import { getContentTypeFromFileName } from '@utils/getContentTypeFromFileName'
import { FileWatchEvents } from '@shared/Events'

const HOST = process.platform.startsWith('win') ? 'localhost' : '0.0.0.0'

export class ResourcesServer extends EventEmitter {
  private server?: http.Server
  private watcher?: FSWatcher

  init = async (dirPath: string): Promise<{ host: string; port: number }> => {
    const port = await getPort({ host: HOST })

    this.server = http.createServer((req, res) => {
      if (!req.url) {
        res.writeHead(400)
        res.end()
        return
      }

      // Decode the URL and strip query string
      const urlPath = decodeURIComponent(req.url.split('?')[0])

      // Prevent path traversal
      const fileName = path.basename(urlPath)
      const filePath = path.join(dirPath, fileName)

      // Ensure resolved path is still within dirPath
      if (!filePath.startsWith(path.resolve(dirPath) + path.sep)) {
        res.writeHead(403)
        res.end()
        return
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404)
          res.end()
          return
        }

        res.writeHead(200, {
          'Content-Type': getContentTypeFromFileName(fileName),
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        })
        res.end(data)
      })
    })

    await new Promise<void>((resolve) => {
      this.server!.listen(port, HOST, resolve)
    })

    console.log(`[HEDRON] Resources server running: http://${HOST}:${port}`)
    console.log(`[HEDRON] Serving resources from: ${dirPath}`)

    this.watcher = chokidar.watch(dirPath, {
      ignoreInitial: true,
      depth: 0, // flat — only top-level files
    })

    this.watcher.on(FileWatchEvents.add, (filePath, stats) => {
      console.log(stats)
      this.emit(FileWatchEvents.add, path.basename(filePath))
    })

    this.watcher.on(FileWatchEvents.unlink, (filePath) => {
      this.emit(FileWatchEvents.unlink, path.basename(filePath))
    })

    this.watcher.on(FileWatchEvents.change, (filePath) => {
      this.emit(FileWatchEvents.change, path.basename(filePath))
    })

    console.log({ host: HOST, port })

    return { host: HOST, port }
  }

  shutdown = async (): Promise<void> => {
    try {
      if (this.watcher) {
        await this.watcher.close()
        this.watcher = undefined
      }

      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server!.close((err) => (err ? reject(err) : resolve()))
        })
        this.server = undefined
      }

      console.log('[HEDRON] Resources server shut down successfully')
    } catch (error) {
      console.error('[HEDRON] Error shutting down resources server:', error)
    }
  }
}
