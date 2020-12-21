const getInc = (trackName, scene) => {
  let inc

  const nameParts = trackName.split('.')
  const name = nameParts[ 0 ]
  const type = nameParts[ 1 ]

  switch (type) {
    case 'morphTargetInfluences':
      const mesh = scene.getObjectByName(name)
      inc = mesh.morphTargetInfluences.length
      break

    case 'quaternion':
      inc = 4
      break

    default:
      inc = 3
  }

  return inc
}

module.exports = (gltf) => {
  const scene = gltf.scene || gltf.scenes[ 0 ]
  const clips = gltf.animations || []

  clips.forEach(function (clip) {
    for (let t = clip.tracks.length - 1; t >= 0; t--) {
      const track = clip.tracks[ t ]
      let isStatic = true

      const inc = getInc(track.name, scene)

      // const numFrames = track.values.length / inc
      //
      // if (numFrames < 3) {
      //   break
      // }

      for (let i = 0; i < track.values.length - inc; i += inc) {
        for (let j = 0; j < inc; j++) {
          if (Math.abs(track.values[ i + j ] - track.values[ i + j + inc ]) > 0.000001) {
            isStatic = false
            break
          }
        }

        if (!isStatic) { break }
      }

      if (isStatic) {
        clip.tracks.splice(t, 1)
      }
    }
  })

  return clips
}
