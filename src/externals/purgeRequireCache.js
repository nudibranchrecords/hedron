// Purge require cache. This works specifically for sketches and anything else required inside an eval
// We must do this inside an eval because sketches are required inside an eval too
module.exports = (resolvedPath) => {
  /* eslint-disable */
  eval(`
    // Resolve the module identified by the specified name
    let mod = require.resolve('${resolvedPath}')

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
    // Recursively go over the results
    (function traverse (mod) {
        // Go over each of the module's children and
        // traverse them
        mod.children.forEach(function (child) {
        traverse(child)
        })
        // delete from cache
        delete require.cache[mod.id]
    }(mod))
    }
  `)
  /* eslint-enable */
}
