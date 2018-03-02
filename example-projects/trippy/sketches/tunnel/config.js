module.exports = {
  defaultTitle: 'Tunnel',
  params: [
    {
      key: 'zSpeed',
      title: 'Z Speed',
      defaultValue: 0.5
    },
    {
      key: 'tunnelScale',
      title: 'Tunnel Scale',
      defaultValue: 0
    },
    {
      key: 'rotSpeed',
      title: 'Rot Speed',
      defaultValue: 0
    },
    {
      key: 'rotTweenSpeed',
      title: 'Rot Tween Speed',
      defaultValue: 0.5
    },
    {
      key: 'blockShiftSpeed',
      title: 'Block Shift Speed',
      defaultValue: 0.5
    },
    {
      key: 'blockSpinSpeed',
      title: 'Block Spin Speed',
      defaultValue: 0.5
    },
    {
      key: 'perlinSpeed',
      title: 'Perlin Speed',
      defaultValue: 0.5
    },
    {
      key: 'colorH',
      title: 'color H',
      defaultValue: 0.5
    },
    {
      key: 'colorS',
      title: 'color S',
      defaultValue: 0.5
    },
    {
      key: 'colorL',
      title: 'color L',
      defaultValue: 0.5
    }
  ],
  shots: [
    {
      method: 'quarterTurn',
      title: 'Quarter Turn'
    },
    {
      method: 'removeBlocks',
      title: 'Remove Blocks'
    },
    {
      method: 'addBlocks',
      title: 'Add Blocks'
    },
    {
      method: 'shiftBlocks',
      title: 'Shift Blocks'
    },
    {
      method: 'spinBlocks',
      title: 'Spin Blocks'
    },
    {
      method: 'flashBlocks',
      title: 'Flash Blocks'
    },
    {
      method: 'boostedFlashBlocks',
      title: 'Boosted Flash Blocks'
    },
    {
      method: 'flashAllBlocksOn',
      title: 'Flash All On'
    },
    {
      method: 'flashAllBlocksOff',
      title: 'Flash All Off'
    },
    {
      method: 'pipesOn',
      title: 'Pipes On'
    },
    {
      method: 'pipesOff',
      title: 'Pipes Off'
    },
    {
      method: 'pipesSwap',
      title: 'Pipes Swap'
    },
    {
      method: 'pipesAllOn',
      title: 'Pipes All On'
    }
  ]
}
