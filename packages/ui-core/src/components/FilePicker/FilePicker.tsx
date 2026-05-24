import { useState } from 'react'
import { ParamFileValue, Resource } from '@hedron-gl/engine'
import css from './FilePicker.module.css'
import { filterAvailableFiles } from './filterAvailableFiles'
import { Dialog } from '@components/Dialog/Dialog'
import { Panel, PanelBody, PanelHeader } from '@components/Panel/Panel'
import { fileIcon, Icon } from '@components/Icon/Icon'

interface FilePickerProps {
  currentFileName: ParamFileValue
  onFileNameChange: (fileName: ParamFileValue) => void
  availableFiles: Resource[]
  accept?: string[] | null
}

// TODO: After upgrading to React 19 we can use popover API to simplify dialogs
// overlay z-index issues this component, we'd have to us react portals to fix it, will automatically be fixed with popovers
export const FilePicker = ({
  onFileNameChange,
  currentFileName,
  availableFiles,
  accept,
}: FilePickerProps) => {
  // TODO: With popovers we wont need to explicitly manage state
  const [isOpen, setIsOpen] = useState(false)
  const filteredAvailableFiles = filterAvailableFiles(availableFiles, accept)
  const isMissing =
    currentFileName && !availableFiles.some((file) => file.fileName === currentFileName)

  const iconName = isMissing ? 'error' : fileIcon

  return (
    <>
      <button
        className={`${css.wrapper} ${isMissing ? css.missing : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <Icon name={iconName} /> {currentFileName || 'Select File'}
      </button>
      {isOpen && (
        <Dialog onBackgroundClick={() => setIsOpen(false)}>
          <Panel className={css.panel}>
            <PanelHeader>Choose File</PanelHeader>
            <PanelBody>
              <ul className={css.fileList}>
                {filteredAvailableFiles.map((file) => (
                  <li key={file.fileName}>
                    <button
                      onClick={() => {
                        onFileNameChange(file.fileName)
                        setIsOpen(false)
                      }}
                    >
                      {file.fileName}
                    </button>
                  </li>
                ))}
              </ul>
            </PanelBody>
          </Panel>
        </Dialog>
      )}
    </>
  )
}
