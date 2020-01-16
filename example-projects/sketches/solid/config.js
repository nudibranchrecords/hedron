module.exports = {
  defaultTitle: 'Solid',
  category:'simple',
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
      label: 'Geometry',
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
      method: 'randomGeom',
      title: 'Random Geom',
    },
  ],
}
