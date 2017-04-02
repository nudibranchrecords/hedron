const Sketch = require('../../src/Engine/Sketch.js')

class Cubey extends Sketch {
  getMeta () {
    return {
      defaultTitle: 'Cubey',
      params: [
        {
          key: 'rotX',
          title: 'Rotation X',
          defaultValue: 0.5
        },
        {
          key: 'rotY',
          title: 'Rotation Y',
          defaultValue: 0.5
        }
      ]
    }
  }

  update (params) {
    console.log(params)
  }
}

module.exports = Cubey
