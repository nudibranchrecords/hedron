import { useContext, useMemo, useState } from 'react'
import { ParamFileValue, Resource } from '@hedron-gl/engine'
import { createPortal } from 'react-dom'
import css from './FilePicker.module.css'
import { filterAvailableFiles } from './filterAvailableFiles'
import { Button } from '@components/Button/Button'
import { Dialog } from '@components/Dialog/Dialog'
import { Panel, PanelBody, PanelHeader, PanelActions } from '@components/Panel/Panel'
import { audioFileIcon, fileIcon, Icon, imageFileIcon, videoFileIcon } from '@components/Icon/Icon'
import { LocalPathPickerContext, LocalPathPickerOptions } from '@hooks/localPathPicker'

interface DialogFilePickerProps {
  mode?: 'dialog'
  currentFileName: ParamFileValue
  onFileNameChange: (fileName: ParamFileValue) => void
  availableFiles: Resource[]
  accept?: string[] | null
}

interface LocalFilePickerProps {
  mode: 'local'
  fileSource: LocalPathPickerOptions['fileSource']
  currentFileName: ParamFileValue
  onFileNameChange: (fileName: ParamFileValue) => void
}

export type FilePickerProps = DialogFilePickerProps | LocalFilePickerProps

export const FilePicker = (props: FilePickerProps) => {
  if (props.mode === 'local') {
    return <LocalFilePicker {...props} />
  }

  return <DialogFilePicker {...props} />
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

interface FilePickerButtonProps {
  fileName: ParamFileValue
  contentType?: string
  isMissing?: boolean
  onClick: () => void
  onClear: () => void
  disabled?: boolean
  isBusy?: boolean
  emptyLabel?: string
  title?: string
}

const FilePickerButton = ({
  fileName,
  contentType = '',
  isMissing,
  onClick,
  onClear,
  disabled,
  isBusy,
  emptyLabel = 'Select File',
  title,
}: FilePickerButtonProps) => (
  <div className={css.picker}>
    <button
      type="button"
      className={`${css.fileButton} ${isMissing ? css.missing : ''}`}
      onClick={onClick}
      disabled={disabled || isBusy}
      title={title ?? fileName ?? undefined}
    >
      <Icon name={isMissing ? 'error' : iconNameLookup(contentType)} /> {fileName || emptyLabel}
    </button>
    {fileName && (
      <button
        type="button"
        className={css.clearButton}
        aria-label="Clear file"
        title="Clear file"
        disabled={isBusy}
        onClick={(event) => {
          event.stopPropagation()
          onClear()
        }}
      >
        <Icon name="close" aria-hidden="true" />
      </button>
    )}
  </div>
)

const LocalFilePicker = ({
  fileSource,
  currentFileName,
  onFileNameChange,
}: LocalFilePickerProps) => {
  const selectPath = useContext(LocalPathPickerContext)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    if (!selectPath) {
      throw new Error('Local path selection is not supported by this host')
    }

    setIsBusy(true)
    setError(null)
    try {
      const path = await selectPath({ fileSource, currentPath: currentFileName })
      if (path !== null) {
        onFileNameChange(path)
      }
    } catch (error) {
      console.error('Failed to select local path:', error)
      setError(error instanceof Error ? error.message : 'Failed to select local path')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <>
      <FilePickerButton
        fileName={currentFileName}
        emptyLabel="Select Directory"
        disabled={!selectPath}
        isBusy={isBusy}
        title={!selectPath ? 'Local path selection is not supported by this host' : undefined}
        onClick={handleClick}
        onClear={() => {
          setError(null)
          onFileNameChange(null)
        }}
      />
      {error && <span role="alert">{error}</span>}
    </>
  )
}

// TODO: After upgrading to React 19 we can use popover API to simplify dialogs
// overlay z-index issues this component, we'd have to us react portals to fix it, will automatically be fixed with popovers
const DialogFilePicker = ({
  onFileNameChange,
  currentFileName,
  availableFiles,
  accept,
}: DialogFilePickerProps) => {
  // TODO: With popovers we wont need to explicitly manage state
  const [isOpen, setIsOpen] = useState(false)
  const filteredAvailableFiles = filterAvailableFiles(availableFiles, accept)

  const currentFile = useMemo(() => {
    return availableFiles.find((file) => file.fileName === currentFileName)
  }, [availableFiles, currentFileName])

  const isMissing =
    currentFileName && !availableFiles.some((file) => file.fileName === currentFileName)

  return (
    <>
      <FilePickerButton
        fileName={currentFileName}
        contentType={currentFile?.contentType}
        isMissing={!!isMissing}
        onClick={() => setIsOpen(true)}
        onClear={() => onFileNameChange(null)}
      />
      {isOpen &&
        // TODO: With popovers we wont need a portal
        createPortal(
          <Dialog onBackgroundClick={() => setIsOpen(false)}>
            <Panel className={css.panel}>
              <PanelHeader>Choose File</PanelHeader>
              <PanelBody>
                <ul className={css.fileList}>
                  {filteredAvailableFiles.map((file) => (
                    <li
                      key={file.fileName}
                      className={file.fileName === currentFileName ? css.selectedFile : ''}
                    >
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
              <PanelActions>
                <Button
                  type="secondary"
                  disabled={!currentFileName}
                  onClick={() => {
                    onFileNameChange(null)
                    setIsOpen(false)
                  }}
                >
                  Clear
                </Button>
              </PanelActions>
            </Panel>
          </Dialog>,
          document.body,
        )}
    </>
  )
}
