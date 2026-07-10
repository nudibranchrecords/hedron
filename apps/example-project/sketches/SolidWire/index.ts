import * as THREE from 'three'

interface Params {
  rotX: number
  rotY: number
  rotZ: number
  rotSpeedX: number
  rotSpeedY: number
  rotSpeedZ: number
  scale: number
  isVisible: boolean
  thickness: number
  geomName: string
  color: [number, number, number]
}

export default class Solid {
  root: THREE.Group
  meshes: Record<string, THREE.Group>
  material: THREE.MeshBasicMaterial
  geomNames: string[]
  currGeomName?: string
  rotationTracker: THREE.Vector3

  constructor() {
    this.root = new THREE.Group()
    this.meshes = {}
    this.rotationTracker = new THREE.Vector3(0, 0, 0)
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      depthTest: true,
      depthWrite: true,
    })

    const geoms: Record<string, THREE.BufferGeometry> = {
      cube: new THREE.BoxGeometry(1, 1, 1),
      tetra: new THREE.TetrahedronGeometry(1),
      octa: new THREE.OctahedronGeometry(1),
      icosa: new THREE.IcosahedronGeometry(1),
      dodeca: new THREE.DodecahedronGeometry(1),
    }

    this.geomNames = Object.keys(geoms)

    for (const geomName in geoms) {
      const geom = geoms[geomName]
      const edgeGroup = new THREE.Group()

      const edges = this.extractTrueEdges(geom as THREE.BufferGeometry)
      // create a tube (cylinder) for each edge
      const baseRadius = 0.02
      for (const [a, b] of edges) {
        const edgeMesh = this.createEdgeMesh(a, b, baseRadius, 6)
        // remember base radius so we can scale later
        ;(edgeMesh.userData as any).baseRadius = baseRadius
        edgeGroup.add(edgeMesh)
      }

      this.meshes[geomName] = edgeGroup
      this.root.add(edgeGroup)
      edgeGroup.visible = false
    }
  }

  update({ params, deltaFrame }: { params: Params; deltaFrame: number }) {
    const baseSpeed = 0.15
    params.rotX = params.rotX ?? 0
    params.rotY = params.rotY ?? 0
    params.rotZ = params.rotZ ?? 0
    params.rotSpeedX = params.rotSpeedX ?? 0
    params.rotSpeedY = params.rotSpeedY ?? 0
    params.rotSpeedZ = params.rotSpeedZ ?? 0

    this.rotationTracker.x += params.rotSpeedX * baseSpeed * deltaFrame
    this.rotationTracker.y += params.rotSpeedY * baseSpeed * deltaFrame
    this.rotationTracker.z += params.rotSpeedZ * baseSpeed * deltaFrame

    this.root.rotation.x = params.rotX + this.rotationTracker.x
    this.root.rotation.y = params.rotY + this.rotationTracker.y
    this.root.rotation.z = params.rotZ + this.rotationTracker.z

    const s = params.scale * 2.0
    this.root.scale.set(s, s, s)

    this.material.color.setRGB(params.color[0], params.color[1], params.color[2])

    // Update geometry selection and visibility
    if (this.currGeomName !== params.geomName) {
      if (this.currGeomName) this.meshes[this.currGeomName].visible = false
      this.currGeomName = params.geomName
      this.meshes[this.currGeomName].visible = !!params.isVisible
    } else if (this.currGeomName) {
      // reflect possible change to isVisible
      this.meshes[this.currGeomName].visible = !!params.isVisible
    }

    // Apply thickness to currently visible group's cylinders
    if (this.currGeomName) {
      const g = this.meshes[this.currGeomName]
      g.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh
          const scale = params.thickness
          m.scale.x = scale
          m.scale.z = scale
        }
      })
    }
  }

  randomGeom() {
    const i = Math.floor(Math.random() * this.geomNames.length)

    return {
      geomName: this.geomNames[i],
    }
  }

  createEdgeMesh(a: THREE.Vector3, b: THREE.Vector3, radius = 0.02, radialSegments = 6) {
    const dir = new THREE.Vector3().subVectors(b, a)
    const length = dir.length()
    const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)

    const geom = new THREE.CylinderGeometry(radius, radius, length, radialSegments)
    const mat = this.material
    const mesh = new THREE.Mesh(geom, mat)

    // orient the cylinder to align with the edge
    const up = new THREE.Vector3(0, 1, 0)
    const dirNorm = dir.clone().normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(up, dirNorm)
    mesh.quaternion.copy(q)
    mesh.position.copy(midpoint)

    return mesh
  }

  // Extract unique "true" edges from a geometry by ignoring internal coplanar triangle edges
  extractTrueEdges(geometry: THREE.BufferGeometry) {
    // work with an indexed geometry
    let geom = geometry
    if (!geom.index) geom = geom.toNonIndexed()

    const pos = geom.getAttribute('position')
    const index = geom.index ? geom.index.array : null
    // First, weld (dedupe) vertices by position to collapse duplicated vertices
    const vertexMap = new Map<string, number>()
    const uniqueVerts: THREE.Vector3[] = []
    const remap: number[] = new Array(pos.count)
    const tol = 1e-6

    function vertKey(x: number, y: number, z: number) {
      // quantize coordinates to avoid float noise
      const qx = Math.round(x / tol)
      const qy = Math.round(y / tol)
      const qz = Math.round(z / tol)
      return `${qx}_${qy}_${qz}`
    }

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const key = vertKey(x, y, z)
      if (vertexMap.has(key)) {
        remap[i] = vertexMap.get(key)!
      } else {
        const id = uniqueVerts.length
        vertexMap.set(key, id)
        uniqueVerts.push(new THREE.Vector3(x, y, z))
        remap[i] = id
      }
    }

    type Face = { indices: [number, number, number]; normal: THREE.Vector3 }
    const faces: Face[] = []

    if (index) {
      for (let i = 0; i < index.length; i += 3) {
        const i0 = remap[index[i]]
        const i1 = remap[index[i + 1]]
        const i2 = remap[index[i + 2]]
        const v0 = uniqueVerts[i0]
        const v1 = uniqueVerts[i1]
        const v2 = uniqueVerts[i2]
        const normal = new THREE.Vector3()
          .subVectors(v1, v0)
          .cross(new THREE.Vector3().subVectors(v2, v0))
          .normalize()
        faces.push({ indices: [i0, i1, i2], normal })
      }
    } else {
      for (let i = 0; i < pos.count; i += 3) {
        const i0 = remap[i]
        const i1 = remap[i + 1]
        const i2 = remap[i + 2]
        const v0 = uniqueVerts[i0]
        const v1 = uniqueVerts[i1]
        const v2 = uniqueVerts[i2]
        const normal = new THREE.Vector3()
          .subVectors(v1, v0)
          .cross(new THREE.Vector3().subVectors(v2, v0))
          .normalize()
        faces.push({ indices: [i0, i1, i2], normal })
      }
    }

    const edgeMap = new Map<string, { a: number; b: number; normals: THREE.Vector3[] }>()

    function addEdge(a: number, b: number, normal: THREE.Vector3) {
      if (a === b) return
      const aa = Math.min(a, b)
      const bb = Math.max(a, b)
      const key = `${aa}_${bb}`
      const existing = edgeMap.get(key)
      if (existing) {
        existing.normals.push(normal.clone())
      } else {
        edgeMap.set(key, { a: aa, b: bb, normals: [normal.clone()] })
      }
    }

    for (const f of faces) {
      const [i0, i1, i2] = f.indices
      addEdge(i0, i1, f.normal)
      addEdge(i1, i2, f.normal)
      addEdge(i2, i0, f.normal)
    }

    const edges: Array<[THREE.Vector3, THREE.Vector3]> = []
    const coplanarTolerance = 0.9995
    edgeMap.forEach((val) => {
      if (val.normals.length === 1) {
        edges.push([uniqueVerts[val.a], uniqueVerts[val.b]])
      } else if (val.normals.length === 2) {
        const d = val.normals[0].dot(val.normals[1])
        if (d < coplanarTolerance) {
          edges.push([uniqueVerts[val.a], uniqueVerts[val.b]])
        }
      } else {
        edges.push([uniqueVerts[val.a], uniqueVerts[val.b]])
      }
    })

    return edges
  }

  static getConfig() {
    return {
      title: 'Solid Wire',
      category: 'simple',
      description: 'Wireframe solid geometries with adjustable edge thickness',
      params: [
        {
          key: 'rotX',
          title: 'Rotation X',
          defaultValue: 1.5707,
          sliderMin: -Math.PI * 2,
          sliderMax: Math.PI * 2,
        },
        {
          key: 'rotY',
          title: 'Rotation Y',
          defaultValue: 0,
          sliderMin: -Math.PI * 2,
          sliderMax: Math.PI * 2,
        },
        {
          key: 'rotZ',
          title: 'Rotation Z',
          defaultValue: 0,
          sliderMin: -Math.PI * 2,
          sliderMax: Math.PI * 2,
        },
        {
          key: 'rotSpeedX',
          title: 'Rotation Speed X',
          defaultValue: 0,
          sliderMin: -1,
          sliderMax: 1,
        },
        {
          key: 'rotSpeedY',
          title: 'Rotation Speed Y',
          defaultValue: 0,
          sliderMin: -1,
          sliderMax: 1,
        },
        {
          key: 'rotSpeedZ',
          title: 'Rotation Speed Z',
          defaultValue: 0,
          sliderMin: -1,
          sliderMax: 1,
        },
        {
          key: 'scale',
          title: 'Scale',
          defaultValue: 1,
          sliderMin: 0.00001,
          sliderMax: 4,
        },
        {
          key: 'isVisible',
          title: 'Visible',
          defaultValue: true,
          valueType: 'boolean',
        },
        {
          key: 'color',
          title: 'Color',
          defaultValue: [1, 1, 1],
          valueType: 'rgb',
        },
        {
          key: 'thickness',
          title: 'Edge Thickness',
          defaultValue: 1,
          sliderMin: 0.001,
          sliderMax: 10,
        },
        {
          key: 'geomName',
          title: 'Geometry',
          valueType: 'enum',
          defaultValue: 'icosa',
          options: [
            {
              value: 'tetra',
              label: 'Tetra',
            },
            {
              value: 'cube',
              label: 'Cube',
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
          method: 'randomGeom',
          title: 'Random Geom',
        },
      ],
    }
  }
}
