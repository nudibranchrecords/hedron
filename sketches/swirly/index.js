const Sketch = require('../../src/Engine/Sketch.js')

class Swirly extends Sketch {
  getMeta () {
    return {
      defaultTitle: 'Swirly',
      params: [
        {
          key: 'swirlRate',
          title: 'Swirl Rate',
          defaultValue: 0.5
        }
      ]
    }
  }

  update (params) {
    console.log(params)
  }
}

module.exports = Swirly
