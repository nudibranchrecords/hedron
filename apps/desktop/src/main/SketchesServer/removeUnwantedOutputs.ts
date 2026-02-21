/*
Esbuild has a limited glob pattern, meaning that unwanted index.js/config.js might be generated in subfolders, which causes noise for our watcher
https://esbuild.github.io/api/#glob-style-entry-points

This removes any index.js or config.js files that are not one level deep (e.g. sketches/sketch1/index.js is ok, but sketches/sketch1/subfolder/index.js is not).
*/
export const removeUnwantedOutputs = (outputs: string[]) => {
  const badFiles = outputs.filter((key) => {
    if (key.includes('node_modules')) return false

    const fileName = key.split('/').pop()
    if (fileName !== 'index.js' && fileName !== 'config.js') return false
    // Remove leading ./ if present
    const rel = key.replace(/^\.\/?/, '')
    // Only allow one-level-deep: e.g. foo/index.js (not foo/bar/index.js)
    return rel.split('/').length > 3 // 3 because of outdir + sketch folder + file (e.g. .sketches-server/sketch1/index.js)
  })
  if (badFiles.length > 0) {
    const fs = require('fs')
    for (const file of badFiles) {
      try {
        fs.unlinkSync(file)
      } catch (err) {
        console.error('[SketchesServer] Failed to remove', file, err)
      }
    }
  }
}
