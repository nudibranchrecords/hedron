export default {
  title: 'Solid',
  description: 'Platonic solids! Rotate, scale, wireframe mode.',
  params: [
    {
      key: 'position',
      title: 'Position',
      valueType: 'vector3',
      defaultValue: [0, 0, 0],
    },
    {
      key: 'color',
      title: 'Color',
      valueType: 'rgb',
      defaultValue: [1, 1, 1],
    },
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
          label: 'Tetra',
        },
        {
          value: 'octa',
          label: 'Octa',
        },
        {
          value: 'cube',
          label: 'Cube',
        },
        {
          value: 'icosa',
          label: 'Icosa',
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
