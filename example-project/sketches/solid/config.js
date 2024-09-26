export default {
  title: 'Solid',
  description: 'Platonic solids! Rotate, scale, wireframe mode.',
  params: [
    {
      key: 'rotSpeedX',
      title: 'Rotation Speed X',
      defaultValue: 0.5,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'rotSpeedY',
      title: 'Rotation Speed Y',
      defaultValue: 0.5,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'rotSpeedZ',
      title: 'Rotation Speed Z',
      defaultValue: 0.5,
      defaultMin: -1,
      defaultMax: 1,
    },
    {
      key: 'scale',
      title: 'Scale',
      defaultValue: 0.5,
      defaultMin: 0.00001,
      defaultMax: 4,
    },
    {
      key: 'isWireframe',
      title: 'Wireframe',
      defaultValue: true,
      valueType: 'boolean',
    },
    {
      key: 'geomName',
      title: 'Geometry',
      valueType: 'enum',
      defaultValue: 'icosa',
      options: [
        {
          value: 'tetra',
          label: 'Tetrahedron',
        },
        {
          value: 'octa',
          label: 'Octahedron',
        },
        {
          value: 'cube',
          label: 'Cube',
        },
        {
          value: 'icosa',
          label: 'Icosahedron',
        },
        // no dodeca until drawn with 5 sided faces
        // {
        //   value: 'dodeca',
        //   label: 'Dodeca',
        // },
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
