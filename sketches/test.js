const Sketch = require('../src/Engine/Sketch.js')

class Test extends Sketch {
  update (params) {
    console.log(params)
  }
}

module.exports = Test
