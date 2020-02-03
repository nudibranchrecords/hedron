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
This is where the params and shots are defined as an object literal.

- `defaultTitle` - Initial title of the sketch when first added to a scene (can be renamed by user)
- `category` - Can be set to help organise sketches
- `author` - Can be set to help organise sketches
- `params` - Params are the values you have control over in a sketch. This setting is an array of objects, each with the following properties:
  - `key` - A unique string for the param  _(Required)_
  - `title` - A human readable title for the param _(defaults to `key`)_
  - `valueType` - Can be `float` _(default)_, `boolean` or `enum`. The look and behaviour of the param control will change depending on what type you are using dropdown for `enum`, button for `boolean`)
  - `defaultValue` - Default value for the param when the sketch is first loaded. If not set, the default depends on the value type.
  -  `defaultMin` - Used with `float` value type. If set, will interpolate the slider value to this minimum _(defaults to 0)_
  -  `defaultMax` - Used with `float` value type. If set, will interpolate the slider value to this maximum _(defaults to 1)_
  - `options` - Used with `enum` value type. An array of objects with these properties:
    - `value` - The value of the param if this option is selected _(Required)_
    - `label` - A human readable label for the option _(defaults to `value`)_
  - `hidden` - Hides the param from the user. One example for using this would be that you might have some param in your sketch that is controlled by a shot, but not available to edit for the user. _(Defaults to `false`)_
- `shots` - Shots are methods you have control of in your sketch. This setting is an array of objects, each with the following properties:
  - `method` - The name of the method to control in your sketch
  - `title` - A human readable name for the shot _(defaults to `method`)_

Example of a config file:

```javascript
module.exports = {
  defaultTitle: 'Solid',
  category: 'Simple',
  author: 'Laurence Ipsum',  
  params: [
    {
      key: 'rotSpeedX',
      defaultValue: 0,
      title: 'Rotation Speed X', 
      valueType: 'float',
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'isWireframe',
      title: 'Wireframe',
      valueType: 'boolean',
      defaultValue: true,
    },
    {
      key: 'geomName',
      title: 'Geometry',
      valueType: 'enum',
      defaultValue: 'icosa',
      options: [
        {
          value: 'cube',
          label: 'Cube',
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
  shots: [
    {
      method: 'shapeShift',
      title: 'Shape Shift',
    }
  ]
}
```

## index.js
This is the main file for the sketch. Essentially, it's a Javascript class, with some important properties and methods. You can `require` other modules from here, so don't feel restricted to a single file. However, you should use the Hedron global version of `THREE` and not import this yourself (`window.HEDRON.dependencies`), see below.

### Properties

- `root` - This should be set in the constructor as a `THREE.Group`. It is the top-level 3D object for the sketch. Hedron takes this root object and places it in the scene. Not required if your sketch is only for post processing (see below).

### Methods
- `constructor` - Where the sketch setup happens. It has a single object literal as an argument, with the following properties:
  - `params` - A key/value pair of all the params in the sketch
  - `scene` - The [three.js scene](https://threejs.org/docs/#api/en/scenes/Scene) that this sketch is added to
  - `camera` - The [three.js camera](https://threejs.org/docs/#api/en/cameras/Camera) the scene is using
  - `renderer` - The [three.js renderer](https://threejs.org/docs/#api/en/constants/Renderer)
  - `sketchesDir` - The location of the top level sketches directory. Useful for loading in external assets.
  - `outputSize` - An object with `width` and `height` properties that match the image output resolution
- `update` - This method is called every frame.  It has a single object literal as an argument, with the following properties:
  - `params` - A key/value pair of all the params in the sketch
  - `elapsedTimeMs` - Elapsed time in milliseconds, since Hedron was started
  - `elapsedFrames` - Elapsed frames since Hedron was started. This is an ideal value based on 60FPS, instead of actual frames that have been seen.
  - `deltaMs` - Milliseconds that have passed since the last update was fired
  - `deltaFrame` - How many should have passed since the last update was fired. Ideally, this will always be at 1. If the program experiences some lag and the FPS drops below 60, this will be some number greater than 1. Use this to multiply with any incremental values to keep animation speeds consistent
  - `tick` - Raw number of updates that have actually been fired since Hedron started
  - `allParams` - A key/value pair of all the sketches in the scene, aech with their own key/value pair of params
  - `outputSize` - An object with `width` and `height` properties that match the image output resolution
- `destructor` - Fires when a sketch is removed. Use this to clean up anything that may continue to run afterwards. Not usually needed. Has the same argument object as the construtor, except for the `params` property.

### Shots
Any custom method in your sketch class can be defined as a shot in the config. Shot methods have a single object literal as an argument, with the following properties:
- `params` - A key/value pair of all the params in the sketch

### Global HEDRON variable
Hedron provides a single global variable with some useful libraries to make use of.

- `window.HEDRON.dependencies`
  - `THREE` - It is strongly recommended you use this instance of `THREE` and not your own installed package. Also are the following extras have been added to this property as child properties:
    - `GLTFLoader`
    - `OrbitControls`
  - `TWEEN` - A very simple [tweening library](https://github.com/tweenjs/tween.js/). The update method is called interally in Hedron, so there's no need to do that inside of a sketch.
  - `postprocessing` - The post [processing library](https://github.com/vanruesc/postprocessing) Hedron uses
  - `glslify` - [Module system for GLSL](https://github.com/glslify/glslify)

### Very basic example
This is the minimum you need to do in order to use Hedron.

```javascript
// Hedron exposes three.js via the HEDRON global
// It is highly advised you use this and don't install your own version of THREE
const { THREE } = window.HEDRON.dependencies

// All sketches are a class
class MyFirstSketch {
  constructor () {
    // You must define a sketch root object
    this.root = new THREE.Group()

    // Create a cube, add it to the root of the scene
    const mat = new THREE.MeshNormalMaterial()
    const geom = new THREE.BoxGeometry(1, 1, 1)
    this.cube = new THREE.Mesh(geom, mat)
    this.root.add(this.cube)
  }

  update ({ params }) {
    // params.rotSpeedX is a value that is controlled by the user,
    // in order to change the rotation speed of the cube
    this.cube.rotation.x += params.rotSpeedX
  }
}

module.exports = MyFirstSketch
```

### Advanced example
This example shows many more features of Hedron 

```javascript
// Hedron exposes three.js via the HEDRON global
// It is highly advised you use this and don't install your own version of THREE
const { THREE } = window.HEDRON.dependencies

class Solid {
  constructor ({ scene, renderer, camera, params, meta }) {
    // Sketches must set this root property so Hedron can place the sketch in the scene
    // Everything should be added to this root
    this.root = new THREE.Group()

    // Empty object to be populated with meshes
    this.meshes = {}

    // Defining a single material for all the polyhedra
    this.mat = new THREE.MeshBasicMaterial(
      { wireframe: true, color: 0xffffff }
    )
    const size = 1

    // Array of geometries (the platonic solids!)
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
      this.root.add(mesh)
      // Hide the mesh
      mesh.visible = false
    }
  }

  // The update method gets called every frame and passes in params defined in the config
  update ({ params, deltaFrame }) {
    // Solids spin too fast at 1
    const baseSpeed = 0.15

    // Using the rotSpeed params to affect the rotation of the group
    // We multiply by deltaFrame to keep the rotation speed consistent
    this.root.rotation.x += params.rotSpeedX * baseSpeed * deltaFrame
    this.root.rotation.y += params.rotSpeedY * baseSpeed * deltaFrame
    this.root.rotation.z += params.rotSpeedZ * baseSpeed * deltaFrame

    // Change scale using params.scale
    this.root.scale.set(params.scale, params.scale, params.scale)

    // Change material wireframe option using boolean param
    this.mat.wireframe = params.isWireframe

    if (this.currGeomName !== params.geomName) {
      if (this.currGeomName) this.meshes[this.currGeomName].visible = false
      this.meshes[params.geomName].visible = true
      this.currGeomName = params.geomName
    }
  }

  
  // All non-special methods of the class are exposed as "shots", defined in the config.
  // These are single functions that can fire rather than paramaters than slowly change.
  randomGeom ({ params }) {
    // Shot can be used to directly alter something in the sketch
    // or as in this example, to manipulate the params
    const i = Math.floor(Math.random() * this.geomNames.length)
    const geomName = this.geomNames[i]

    // In order to tell Hedron params have changed inside a shot, return the updated params
    return { geomName }
  }

  /** HEDRON TIP **
    Use the destructor method to do anything when the sketch is deleted
  **/
  destructor ({ scene, renderer, camera, params, meta }) {
    console.log('Solid sketch deleted!')
  }
}

/** HEDRON TIP **
  Class must be exported as a default.
**/
module.exports = Solid
```

## Post Processing
Custom post processing, such as pixel shaders, are handled inside of sketches. Hedron's post processing system is a thin wrapper around the [postprocessing](https://github.com/vanruesc/postprocessing) library, so it's a good idea to understand how that works. Multiple passes can be created inside of `initiatePostProcessing` and returned as an array. `initiatePostProcessing` has a similar argument object to the class constructor (see above), except `renderer` is replaced with `composer` (for experimental usage).

All values are updated with the usual `update` method.

Please note that this feature is still very much under development and so will most likely see many changes to the API in future.

### Simple example
Below is a simple example of how to achieve a bloom effect. A config file is also needed, which is exactly the same as a normal sketch config file.

```javascript
// THe postprocessing library is available under the HEDRON global variable
const { EffectPass, BloomEffect, BlendFunction, KernelSize } = window.HEDRON.dependencies.postprocessing

class Bloom {
  initiatePostProcessing () {
    // Create a bloom effect
    this.bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
      kernelSize: KernelSize.LARGE,
      useLuminanceFilter: true,
      luminanceThreshold: 0.825,
      luminanceSmoothing: 0.075,
      height: 480,
    })

    // Create your passes and return as an array
    const pass = new EffectPass(null, this.bloomEffect)

    return [ pass ]
  }

  update ({ params }) {
    this.bloomEffect.blurPass.scale = params.scale
    this.bloomEffect.luminanceMaterial.threshold = params.lumThreshold
    this.bloomEffect.luminanceMaterial.smoothing = params.lumSmoothing
    this.bloomEffect.blendMode.opacity.value = params.opacity
  }
}

module.exports = Bloom
```

### Other examples
There are plenty of other examples that can be found in the [example sketches folder](../../example-projects).

### Global postprocessing
By default, any post processing will only affect the scene that sketch is in. This means that fading the scene out on the crossfader will also fade out any post processing effects you have in that scene. However, by checking "Global Post Processing" enabled under the scene settings, the effect will now work across all scenes. An icon will appear on the scene thumbnail if this setting is enabled. The scene does not need to be added to any channel, `update` will always be running with this setting on.

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
