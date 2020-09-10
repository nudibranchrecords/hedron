const { THREE } = window.HEDRON.dependencies
const fontJson = require('./font/droid_sans_regular.typeface.json')

class TextBasic {
  constructor ({ params }) {
    this.root = new THREE.Group()
    this.group = new THREE.Group()
    this.root.add(this.group)

    this.text = params.text

    this.font = new THREE.Font(fontJson)
    this.geometry = this.getGeometry(this.text)

    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(),
      transparent: true,
      opacity: 0.7,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.group.add(this.mesh)
  }

  setText (text) {
    this.geometry = this.getGeometry(text)
    this.mesh.geometry = this.geometry
  }

  getGeometry (text) {
    this.text = text
    let a = text.split('\\n')
    let geometry = new THREE.Geometry()
    for (let i = 0; i < a.length; i++) {
      let geo = new THREE.TextGeometry(a[i], {
        size: 1,
        height: 1,
        font: this.font,
        style: 'normal',
        weight: 'normal',
      })
      geo.center()
      geometry.merge(geo, new THREE.Matrix4().makeTranslation(0, -i * 1.2, 0))
    }
    geometry.center()
    return geometry
  }

  update ({ params }) {
    if (this.text !== params.text) {
      this.setText(params.text)
    }

    this.material.opacity = params.alpha
    this.material.color.setHSL(params.colorHue, params.colorSat, params.colorLight)
    this.group.scale.set(params.scale, params.scale, params.scale * params.thickness)
    this.group.rotation.set(params.rotX, params.rotY, params.rotZ)
    this.group.position.set(params.posX, params.posY, params.posZ)
  }
}

module.exports = TextBasic
