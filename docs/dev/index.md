# Creating Sketches for Hedron

## Starting a project
It is best practice to create a project folder outside of Hedron. This is advantageous, because:

1. The project can exist as it's own repository
2. You can install dependencies from NPM without polluting Hedron's own dependencies

Inside the project folder, you'll want to have a "sketches" folder, this is what you'll point Hedron to.

## Sketch
Sketches together in the sketches directory. A sketch is itself directory with two required files:

- config.js
- index.js

## config.js

This is where the params and shots are defined.

```javascript
module.exports = {
  // Default title when sketch is loaded in (can be changed by user)
  defaultTitle: 'Solid',
  // Params are values between 0 and 1 that can be manipulated by the user
  // these values are sent to the sketch every frame
  // e.g. Speed, scale, colour
  params: [
    {
      key: 'rotSpeedX', // needs to be unique
      defaultValue: 0, // must be between 0 and 1
      title: 'Rotation Speed X', // optional, should be human, if not provided defaults to the key
      defaultMin: 0, // optional, the value passed to the sketch when the param is at it's lowest value, if not provided defaults to 0
      defaultMax: 1, // optional, the value passed to the sketch when the param is at it's highest value, if not provided defaults to 1
      hidden: false, // optional, some params may want to be hidden in the UI, if they are controlled programatically by the sketch. Defaults to false.
    },
  ],
  // Shots are single functions that can fire, as opposed to values that change
  // e.g. Explosions, Pre-defined animations
  shots: [
    {
      method: 'shapeShift', // needs to be unique
      title: 'Shape Shift' // should be human
    }
  ]
}
```

## index.js

This is where the actual sketch is held. You can `require` other modules from here, so don't feel restricted to a single file.

### Very basic example
This is the minimum you need to do in order to use Hedron.

```javascript
const THREE = require('three')

class MyFirstSketch {
  constructor () {
    // Create a cube, add it to the root of the scene
    const mat = new THREE.MeshNormalMaterial()
    const geom = new THREE.BoxGeometry(300, 300, 300)
    this.cube = new THREE.Mesh(geom, mat)
    this.root.add(this.cube)
  }

  update (params) {
    // params.rotSpeedX is a value that is controlled by the user,
    // in order to change the rotation speed of the cube
    this.cube.rotation.x += params.rotSpeedX
  }
}

module.exports = MyFirstSketch
```

### Advanced example
This example shows many more features of Hedron, with lots more comments

```javascript
/** HEDRON TIP **
This is a nice and simple sketch to get you going!
A polyhedron that can spin on all axes. The user can change the speed of the rotation.
The user can change the scale. The user can also click on "shapeshift" and the geometry changes.
**/

/** HEDRON TIP **
  Hedron uses three.js, so you'll need that :)
**/
const THREE = require('three')

/** HEDRON TIP **
  Hedron sketches must be a class
**/
class Solid {
  /** HEDRON TIP **
    The constructor method has three arguments:

    scene - This is the THREE object for the scene. You can also access the THREE renderer
    using scene.renderer

    params - The sketch params when the sketch first initialises

    meta - This is an object with meta data that might be useful. It has the following properties:
      sketchesFolder - The path to the sketches folder on your computer. Useful if you need to link to a resource such as an image.
  **/
  constructor (scene, params, meta) {
    /** HEDRON TIP **
      Must define a "root" property as a THREE.Group or THREE.Object3D
      Hedron looks for this and will add it to the scene.
    **/
    this.root = new THREE.Group()

    /** HEDRON TIP **
      It's good practice to not manipulate the root object
      so we create another group and add it to the root.
      This isn't required and the name isn't important.
    **/
    this.group = new THREE.Group()
    this.root.add(this.group)

    // Empty array to be populated with meshes
    this.meshes = []

    // Defining a single material for all the polyhedra
    const mat = new THREE.MeshBasicMaterial(
      { wireframe: true, color: 0xffffff }
    )
    const size = 300

    // Array geometries (the platonic solids!)
    const geoms = [
      new THREE.IcosahedronGeometry(size),
      new THREE.BoxGeometry(size, size, size),
      new THREE.OctahedronGeometry(size),
      new THREE.TetrahedronGeometry(size),
      new THREE.DodecahedronGeometry(size)
    ]

    // Loop through meshes
    geoms.forEach(geom => {
      // Create a mesh for each solid
      const mesh = new THREE.Mesh(geom, mat)
      // Add to array
      this.meshes.push(mesh)
      // Add to scene
      this.group.add(mesh)
    })

    // Update the shape based on params
    this._updateShape(params.meshIndex)
  }

  /** HEDRON TIP **
    The update method is called every frame by Hedron.
    You have the following arguments to make use of...

    ownParams: An object containing params defined in config.js.
    These are values between 0 and 1 that can be manipulated in many ways by the user.

    time: Elapsed time in ms (not used below)

    frameDiff: Number of frames that should have passed since last frame.
    Useful for keeping speeds consistent.
    If the framerate changes, this value changes too. At 60fps the value will be
    exactly 1. Less than 60fps and the value goes above 1. More than 60fps and the value
    goes below 1. See below on how it can be used.

    allParams: An object containing all params from all sketches. (not used below)
  **/
  update (params, time, frameDiff, allParams) {
    // Solids spin too fast at 1
    const baseSpeed = 0.15

    /** HEDRON TIP **
      Making use of params.rotSpeedX to rotate the solid. When the user changes
      the "Rotation Speed X" param (defined in config.js), it will change here and the
      speed increases. We're multiplying the final increase by 'frameDiff'
      so that the speed stays consistent across varying framerates.
    **/
    this.group.rotation.x += params.rotSpeedX * baseSpeed * frameDiff
    this.group.rotation.y += params.rotSpeedY * baseSpeed * frameDiff
    this.group.rotation.z += params.rotSpeedZ * baseSpeed * frameDiff

    // Change scale using params.scale
    params.scale = Math.max(params.scale * 4, 0.00001)
    this.group.scale.set(params.scale, params.scale, params.scale)
  }

  /** HEDRON TIP **
    All non-special methods of the class are exposed as "shots".
    These are single functions that can fire rather than paramaters than slowly change.
    See config.js to see how these are defined.

    Current params are given as an argument
  **/
  shapeShift (params) {
    let meshIndex = params.meshIndex

    // Increase index to shapeshift
    meshIndex++

    // If at end of array, loop round
    if (meshIndex > this.meshes.length - 1) meshIndex = 0

    this._updateShape(meshIndex)

    /** HEDRON TIP **
      If you've updated some params inside the shot, you'll need to return these new values
    **/
    return { meshIndex }
  }

  _updateShape (meshIndex) {
    // Loop through meshes and only show the mesh
    // that matches with current index
    this.meshes.forEach((mesh, index) => {
      if (meshIndex !== index) {
        mesh.visible = false
      } else {
        mesh.visible = true
      }
    })
  }

  /** HEDRON TIP **
    Use the destructor method to do anything when the sketch is deleted
  **/
  destructor () {
    console.log('Solid sketch deleted!')
  }
}

/** HEDRON TIP **
  Class must be exported as a default.
**/
module.exports = Solid
```

## Hedron dev config

You can get extra functionality by adding `dev.config.js` to `/config` (from the root directory of the Hedron repo).

```javascript
// config/dev.config.js
module.exports = {
  defaultProject: false
}
```

Setting `defaultProject` to the path of a saved project (e.g. `/Users/alex/Desktop/foo.json`) can help improve your workflow when developing:
* The project will load automatically on load/restart
* The project sketches folder will be watched for changes, triggering a restart

## Reimporting

If you've already got a project going with some sketches and then make edits to a sketch, Hedron automatically loads in the new content. However, if you've made changes to `config.js`, you'll need to "reimport" to see the new params and shots. Do this by clicking the button at the bottom of the view for that sketch.
