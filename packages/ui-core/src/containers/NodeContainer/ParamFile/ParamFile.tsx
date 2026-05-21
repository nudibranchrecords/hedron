import { ParamFile as ParamFileType, ParamFileValue } from '@hedron-gl/engine'
import { useEngineStore, useEngineStoreShallow } from '@hooks/engineHooks'
import { useOnParamValueChange } from '@hooks/useOnParamValueChange'
import { useParamValue } from '@hooks/useParamValue'
import { FilePicker } from '@components/FilePicker/FilePicker'

interface ParamFileProps {
  id: string
}

export const ParamFile = ({ id }: ParamFileProps) => {
  const node = useEngineStore((state) => state.nodes[id]) as ParamFileType
  const currentFile = useParamValue<ParamFileValue>(id)
  const onFileChange = useOnParamValueChange(id)
  const availableFiles = useEngineStoreShallow((state) => Object.values(state.resources))

  return (
    <FilePicker
      currentFile={currentFile}
      onFileChange={onFileChange}
      availableFiles={availableFiles}
      accept={node.accept}
    />
  )
}
