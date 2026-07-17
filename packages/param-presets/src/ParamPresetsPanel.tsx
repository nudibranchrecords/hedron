import { HedronEngine, ParamNode, ParamValue, SketchNode } from '@hedron-gl/engine'
import { useMemo } from 'react'
import { ParamPresetsControl } from './ParamPresetsControl'
import { useParamPresetsStore } from './paramPresetsStore'

const EMPTY_PRESETS = {} as Record<string, { title: string; params: Record<string, ParamValue> }>

interface ParamPresetsPanelProps {
  sketchId: string
  engine: HedronEngine
}

export const ParamPresetsPanel = ({ sketchId, engine }: ParamPresetsPanelProps) => {
  const sketch = engine.getNode(sketchId) as SketchNode | undefined
  const moduleId = sketch?.moduleId

  const addPreset = useParamPresetsStore((state) => state.addPreset)
  const deletePreset = useParamPresetsStore((state) => state.deletePreset)
  const overwritePreset = useParamPresetsStore((state) => state.overwritePreset)
  const editPresetTitle = useParamPresetsStore((state) => state.editPresetTitle)

  const modulePresets = useParamPresetsStore((state) => {
    if (!moduleId) return EMPTY_PRESETS
    return state.byModuleId[moduleId] ?? EMPTY_PRESETS
  })

  const presets = useMemo(() => {
    return Object.entries(modulePresets).map(([id, item]) => ({
      id,
      name: item.title,
    }))
  }, [modulePresets])

  const getSketchParamKeyToIdMap = (): Record<string, string> => {
    if (!sketch) return {}

    return sketch.childGroups.nodeIds.reduce(
      (acc, nodeId) => {
        const node = engine.getNode(nodeId) as ParamNode | undefined
        if (!node || node.nodeType !== 'param') return acc

        acc[node.key] = node.id
        return acc
      },
      {} as Record<string, string>,
    )
  }

  const handlePresetSelect = (presetId: string) => {
    if (!sketch) return

    const preset = modulePresets[presetId]
    if (!preset) return

    const keyToIdMap = getSketchParamKeyToIdMap()
    const paramEntries = Object.entries(preset.params).reduce(
      (acc, [paramKey, value]) => {
        const paramId = keyToIdMap[paramKey]
        if (!paramId) return acc

        acc[paramId] = value
        return acc
      },
      {} as Record<string, ParamValue>,
    )

    engine.setMultipleParamValues(paramEntries)
  }

  const getCurrentParamsSnapshot = (): Record<string, ParamValue> | null => {
    if (!moduleId || !sketch) return null

    const keyToIdMap = getSketchParamKeyToIdMap()

    return Object.entries(keyToIdMap).reduce(
      (acc, [paramKey, paramId]) => {
        const val = engine.getParamValue(paramId)
        if (val !== undefined) {
          acc[paramKey] = val
        }
        return acc
      },
      {} as Record<string, ParamValue>,
    )
  }

  const handlePresetSave = (presetName: string) => {
    if (!moduleId) return

    const vals = getCurrentParamsSnapshot()
    if (!vals) return

    addPreset(moduleId, presetName, vals)
  }

  const handlePresetDelete = (presetId: string) => {
    if (!moduleId) return
    deletePreset(moduleId, presetId)
  }

  const handlePresetOverwrite = (presetId: string) => {
    if (!moduleId) return

    const vals = getCurrentParamsSnapshot()
    if (!vals) return

    overwritePreset(moduleId, presetId, vals)
  }

  const handlePresetEditTitle = (presetId: string, newName: string) => {
    if (!moduleId) return

    const trimmedName = newName.trim()
    if (!trimmedName) return

    editPresetTitle(moduleId, presetId, trimmedName)
  }

  return (
    <ParamPresetsControl
      presets={presets}
      onPresetSelect={handlePresetSelect}
      onPresetSave={handlePresetSave}
      onPresetDelete={handlePresetDelete}
      onPresetOverwrite={handlePresetOverwrite}
      onPresetEditTitle={handlePresetEditTitle}
    />
  )
}
