// Inefficient but tidy
class Morph {
  constructor (index, key, meshes) {
    this.meshes = meshes
    this.index = index
    this.key = key
  }

  update (value) {
    this.meshes.forEach(mesh => {
      mesh.morphTargetInfluences[this.index] = value
    })
  }
}

const getMorphs = (object, morphKeys) => {
  const morphMeshes = []
  const morphs = []

  object.traverse((node) => {
    if (node.isMesh && node.morphTargetInfluences) {
      morphMeshes.push(node)
    }
  })

  if (morphMeshes.length > 0) {
    const numMorphs = morphMeshes[0].morphTargetInfluences.length

    for (let i = 0; i < numMorphs; i++) {
      morphs.push(new Morph(i, morphKeys[i], morphMeshes))
    }
  }

  return morphs
}

module.exports = getMorphs

