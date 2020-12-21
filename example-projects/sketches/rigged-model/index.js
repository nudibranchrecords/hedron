const { THREE } = window.HEDRON.dependencies

// This Model class is a rough utility for loading and preparing GLTF files, it could probably be improved a lot!
const Model = require('./Model')

class RiggedModel {
  constructor ({ camera }) {
    this.root = new THREE.Group()

    this.model = new Model(`${__dirname}/model.glb`, [], [], (model) => {
      // Having to scale the model because for some reason it's tiny
      model.group.scale.set(20, 20, 20)
      this.root.add(model.group)
    })
  }

  update ({ params: p, elapsedFrames: t, deltaFrame: f }) {
    // The Model class takes in params and updates action weightings if they have the same name as the param
    this.model.update(p, t, f)
    this.model.group.position.set(p.posX * 10, p.posY * 10, p.posZ * 10)
    this.model.group.rotation.y = p.rotY
  }
}

module.exports = RiggedModel
