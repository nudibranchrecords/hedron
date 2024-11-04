/*
 * This whole file is a bit of a mess but seems to be the only way to get esbuild to work inside a packaged app
 * 1. "node_modules/esbuild" needs to be added to asarUnpack (electron-builder.yml)
 * 2. Importing only works as shown below, a normal import always resolves to the .asar archive which causes runtime errors
 */

import path from 'path'
import { app } from 'electron'
import * as _esbuild from 'esbuild'

const basePath = `${app.getAppPath()}/../app.asar.unpacked/node_modules`

let importedEsbuild: typeof _esbuild | null = null

const esbuildPath = app.isPackaged ? path.normalize(`${basePath}/esbuild/lib/main.js`) : 'esbuild'

const importPackages = async () => {
  importedEsbuild = await import(esbuildPath)
}

importPackages()

export const getEsbuild = () => {
  if (importedEsbuild === null) throw new Error('esbuild was not imported in time')
  return importedEsbuild
}
