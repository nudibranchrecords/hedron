# Creating Sketches for Hedron

## Starting a project
It is best practice to create a project folder outside of Hedron. This is advantageous, because:

1. The project can exist as it's own repository
2. You can install dependencies from NPM without polluting Hedron's own dependencies

Inside the project folder, you'll want to have a "sketches" folder, this is what you'll point Hedron to.

## Sketches Directory
This directory contains sketch folders. Sketch folders can be grouped into directories to keep things neat, with as many levels of organisation as you need. However, you can't have a sketch folder inside another sketch folder.

## Sketch
Sketches live in the sketches directory. A sketch is itself a directory with two required files:

- config.js
- index.js

## config.js

This is where the params and shots are defined.

```javascript
module.exports = {
  // Default title when sketch is loaded in (can be changed by user)
  defaultTitle: 'Solid',
  // Category and author can be used as a way to organise sketches based on the user's settings
  category: 'Simple',
  author: 'Laurence Ipsum',  
  // Params are values between 0 and 1 that can be manipulated by the user
  // these values are sent to the sketch every frame
  // e.g. Speed, scale, colour
  params: [
    {
      key: 'rotSpeedX', // needs to be unique
      defaultValue: 0, // must be between 0 and 1
      title: 'Rotation Speed X', // optional, should be human, if not provided defaults to the key
      hidden: false, // optional, some params may want to be hidden in the UI, if they are controlled programatically by the sketch. Defaults to false.
      valueType: 'float', // optional, can be "float", "boolean" or "enum". Defaults to "float"
      defaultMin: 0, // for "float" valueType, optional. The value passed to the sketch when the param is at it's lowest value, if not provided defaults to 0
      defaultMax: 1, // for "float" valueType, optional. The value passed to the sketch when the param is at it's highest value, if not provided defaults to 1
    },
    {
      key: 'isWireframe',
      title: 'Wireframe',
      valueType: 'boolean',
      defaultValue: true, // If using defaultValue, it should match the valueType
    },
    {
      key: 'geomName',
      label: 'Geometry',
      valueType: 'enum',
      defaultValue: 'icosa',
      // options for "enum" valueType are defined like this
      options: [
        {
          value: 'cube', // required, the value of the option that will be passed around
          label: 'Cube', // optional, human readable version (defaults to value)
        },
        {
          value: 'tetra',
          label: 'Tetra',
        },
        {
          value: 'octa',
          label: 'Octa',
        },
        {
          value: 'icosa',
          label: 'Icosa',
        },
        {
          value: 'dodeca',
          label: 'Dodeca',
        },
      ],
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

This is where the actual sketch is held. `THREE` is available as a global variable and it's strongly advised you use this rather than import the library yourself, to prevent unexpected behaviour. For convenience, `THREE.GLTFLoader` and `THREE.OrbitControls` are available too.

You can `require` other modules from here, so don't feel restricted to a single file. 

### Very basic example
This is the minimum you need to do in order to use Hedron.

```javascript
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
  Hedron sketches must be a class
**/
class Solid {
  /** HEDRON TIP **
    The constructor method has three arguments:

    scene - This is the THREE object for the scene. You can also access the THREE renderer
    using scene.renderer

    meta - This is an object with meta data that might be useful. It has the following properties:
      sketchesFolder - The path to the sketches folder on your computer.
      Useful if you need to link to a resource such as an image.

    params - The sketch params when the sketch first initialises
  **/
  constructor (scene, params, meta) {
    /** HEDRON TIP **
      Must define a "root" property as a THREE.Group or THREE.Object3D
      Hedron looks for this and will add it to the scene.
    **/
    this.root = new THREE.Group() // THREE is a global var, so no need to import

    /** HEDRON TIP **
      It's good practice to not manipulate the root object
      so we create another group and add it to the root.
      This isn't required and the name isn't important.
    **/
    this.group = new THREE.Group()
    this.root.add(this.group)

    // Empty object to be populated with meshes
    this.meshes = {}

    // Defining a single material for all the polyhedra
    this.mat = new THREE.MeshBasicMaterial(
      { wireframe: true, color: 0xffffff }
    )
    const size = 1

    // Array geometries (the platonic solids!)
    const geoms = {
      cube: new THREE.BoxGeometry(size, size, size),
      tetra: new THREE.TetrahedronGeometry(size),
      octa: new THREE.OctahedronGeometry(size),
      icosa: new THREE.IcosahedronGeometry(size),
      dodeca: new THREE.DodecahedronGeometry(size),
    }

    // Keep an array of the geom names
    this.geomNames = Object.keys(geoms)

    // Loop through meshes
    for (const geomName in geoms) {
      // Create a mesh for each solid
      const mesh = new THREE.Mesh(geoms[geomName], this.mat)
      // Add to meshes object
      this.meshes[geomName] = mesh
      // Add to scene
      this.group.add(mesh)
      // Hide the mesh
      mesh.visible = false
    }
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
    this.group.scale.set(params.scale, params.scale, params.scale)

    // Change material wireframe option using boolean param
    this.mat.wireframe = params.isWireframe

    if (this.currGeomName !== params.geomName) {
      if (this.currGeomName) this.meshes[this.currGeomName].visible = false
      this.meshes[params.geomName].visible = true
      this.currGeomName = params.geomName
    }
  }

  /** HEDRON TIP **
    All non-special methods of the class are exposed as "shots".
    These are single functions that can fire rather than paramaters than slowly change.
    See config.js to see how these are defined.

    Current params are given as an argument
  **/
  randomGeom (params) {
    const i = Math.floor(Math.random() * this.geomNames.length)
    const geomName = this.geomNames[i]

    if (geomName === params.geomName) {
      // If random name is the same as previous, go again
      return this.randomGeom(params)
    } else {
      /** HEDRON TIP **
        If you've updated some params inside the shot, you'll need to return these new values
      **/
      return { geomName }
    }
  }

  /** HEDRON TIP **
    Use the destructor method to do anything when the sketch is deleted
  **/
  destructor () {
    // eslint-disable-next-line no-console
    console.log('Solid sketch deleted!')
  }
}

/** HEDRON TIP **
  Class must be exported as a default.
**/
module.exports = Solid
```

## Post Processing
Custom post processing, such as pixel shaders, are handled inside of sketches. Hedron's post processing system is a thin wrapper around the [postprocessing](https://github.com/vanruesc/postprocessing) library, so it's a good idea to understand how that works. Multiple passes can be added to the rendering composer using `initiatePostProcessing` and things are updated every frame using `updatePostProcessing`.

### Simple example
Below is a simple example of how to achieve a bloom effect. A config file is also needed, which is exactly the same as a normal sketch config file.

```javascript
// POSTPROCESSING is a global variable available to Hedron sketches
const { EffectPass, BloomEffect, BlendFunction, KernelSize } = POSTPROCESSING

class Bloom {
  // Here we add our passes to the composer
  initiatePostProcessing (composer) {
    // Create a bloom effect
    this.bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.LARGE,
      useLuminanceFilter: true,
      luminanceThreshold: 0.825,
      luminanceSmoothing: 0.075,
      height: 480,
    })

    // Add the bloom effect as a new pass to the composer
    const pass = new EffectPass(null, this.bloomEffect)
    composer.addPass(pass)

    // Return the pass that needs to be rendered to the screen
    return pass
  }

  // This method will be called every frame, just like the usual update method
  updatePostProcessing (p) {
    this.bloomEffect.blurPass.scale = p.scale
    this.bloomEffect.luminanceMaterial.threshold = p.lumThreshold
    this.bloomEffect.luminanceMaterial.smoothing = p.lumSmoothing
    this.bloomEffect.blendMode.opacity.value = p.opacity
  }
}

module.exports = Bloom
```

### Other examples
There are plenty of other examples that can be found in the [example sketches folder](../../example-projects).

### How to see the output in Hedron
Currently, post processing only works on the final output of Hedron (there are plans for a per-scene option too). To see the output of your passes, the sketch must be added to a scene. This scene must have "Global Post Processing" enabled under the scene settings for the passes to take effect. An icon will appear on the scene thumbnail if this setting is enabled. The scene does not need to be added to any channel, `updatePostProcessing` will always be running with this setting on.

As a convention, it makes sense to have a post processing scene, with post processing related sketches added to it. This scene does not need to have any 3D objects in it and never needs to be added to a channel.

### Order of passes
You can reorder sketches by clicking and holding on them in the sidebar. This relates to the order in which passes are added to the composer. If passes are added to sketches across multiple scenes, the order of the scenes is also important.

## Reloading sketches / Auto reload
If you have the "Watch sketches" setting enabled, Hedron will automatically refresh your sketches. However, if you don't have this enabled or something went wrong with the file watch (e.g. your sketch imports a file outside of its own folder) you'll need to click "Reload File" to see changes made to sketch files.

This refresh will remove the sketch from the scene, import any new params or shots, remove and old params and shots, and then add the new sketch back into the scene.

**Please note: File change detection may not work with all text editors. (e.g. Atom on OSX is reported to be inconsistent).**

## Hedron dev config

You can get extra functionality by adding `dev.config.js` to `/config` (from the root directory of the Hedron repo).

```javascript
// config/dev.config.js
module.exports = {
  defaultProject: false
}
```

Setting `defaultProject` to the path of a saved project (e.g. `/Users/alex/Desktop/foo.json`) can help improve your workflow when developing by  automatically loading that project when the app compiles. This is particularly useful when developing Hedron itself, so that you can test changes made to the app immediately, without having to manually load in a project each time.