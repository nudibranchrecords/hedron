const { THREE } = window.HEDRON.dependencies

const getCleanClips = require('./getCleanClips')
const { getActions, setWeight } = require('./getActions')
const getMorphs = require('./getMorphs')

const loader = new THREE.GLTFLoader()

class Model {
  constructor (modelUrlOrGltf, actions = [], morphs = [], callback) {
    this.group = new THREE.Object3D()
    if (typeof modelUrlOrGltf === 'string') {
      loader.load(modelUrlOrGltf, (gltf) => {
        this.processModel(gltf, actions, morphs)

        this.isLoaded = true

        if (callback) callback(this)
      }, null, error => console.error(error))
    } else {
      this.processModel(modelUrlOrGltf, actions, morphs)
      this.isLoaded = true
      if (callback) callback(this)
    }
  }

  processModel (gltf, actions, morphs) {
    this.gltf = gltf
    const object = gltf.scene || gltf.scenes[ 0 ]

    this.group.add(object)

    this.mixer = new THREE.AnimationMixer(object)

    this.clips = getCleanClips(gltf)
    this.actions = getActions(gltf.animations, this.mixer)
    this.morphs = getMorphs(object, morphs)
  }

  update (p, t, f) {
    if (this.isLoaded) {
      this.actions.forEach(action => {
        const name = action._clip.name
        if (p[name] !== undefined) setWeight(action, p[name])
      })

      this.morphs.forEach(morph => {
        if (p[morph.key] !== undefined) morph.update(p[morph.key])
      })

      if (this.mixer) this.mixer.update(f / 60)
    }
  }
}

module.exports = Model
