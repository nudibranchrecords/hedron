import { useMemo, useState } from 'react'
import { ParamFileValue, Resource } from '@hedron-gl/engine'
import { createPortal } from 'react-dom'
import css from './FilePicker.module.css'
import { filterAvailableFiles } from './filterAvailableFiles'
import { Dialog } from '@components/Dialog/Dialog'
import { Panel, PanelBody, PanelHeader } from '@components/Panel/Panel'
import { audioFileIcon, fileIcon, Icon, imageFileIcon, videoFileIcon } from '@components/Icon/Icon'

interface FilePickerProps {
  currentFileName: ParamFileValue
  onFileNameChange: (fileName: ParamFileValue) => void
  availableFiles: Resource[]
  accept?: string[] | null
}

const iconNameLookup = (contentType: string) => {
  if (contentType.startsWith('image/')) {
    return imageFileIcon
  }
  if (contentType.startsWith('audio/')) {
    return audioFileIcon
  }
  if (contentType.startsWith('video/')) {
    return videoFileIcon
  }
  return fileIcon
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

  const currentFile = useMemo(() => {
    return availableFiles.find((file) => file.fileName === currentFileName)
  }, [availableFiles, currentFileName])

  const isMissing =
    currentFileName && !availableFiles.some((file) => file.fileName === currentFileName)

  const iconName = isMissing ? 'error' : iconNameLookup(currentFile?.contentType || '')

  return (
    <>
      <button
        className={`${css.fileButton} ${isMissing ? css.missing : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <Icon name={iconName} /> {currentFileName || 'Select File'}
      </button>
      {isOpen &&
        // TODO: With popovers we wont need a portal
        createPortal(
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
                        <Icon name={iconNameLookup(file.contentType)} /> {file.fileName}
                      </button>
                    </li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>
          </Dialog>,
          document.body,
        )}
    </>
  )
}
