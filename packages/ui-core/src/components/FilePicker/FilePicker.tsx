import { useState } from 'react'
import { ParamFileValue, ParamFileValueNonEmpty } from '@hedron-gl/engine'
import css from './FilePicker.module.css'
import { filterAvailableFiles } from './filterAvailableFiles'
import { Dialog } from '@components/Dialog/Dialog'
import { Panel, PanelBody, PanelHeader } from '@components/Panel/Panel'
import { fileIcon, Icon } from '@components/Icon/Icon'

interface FilePickerProps {
  currentFile: ParamFileValue
  onFileChange: (val: ParamFileValue) => void
  availableFiles: ParamFileValueNonEmpty[]
  accept?: string[] | null
}

// TODO: After upgrading to React 19 we can use popover API to simplify dialogs
// overlay z-index issues this component, we'd have to us react portals to fix it, will automatically be fixed with popovers
export const FilePicker = ({
  onFileChange,
  currentFile,
  availableFiles,
  accept,
}: FilePickerProps) => {
  // TODO: With popovers we wont need to explicitly manage state
  const [isOpen, setIsOpen] = useState(false)
  const filteredAvailableFiles = filterAvailableFiles(availableFiles, accept)

  return (
    <>
      <button className={css.wrapper} onClick={() => setIsOpen(true)}>
        <Icon name={fileIcon} /> {currentFile.fileName || 'Select File'}
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
                        onFileChange(file)
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
