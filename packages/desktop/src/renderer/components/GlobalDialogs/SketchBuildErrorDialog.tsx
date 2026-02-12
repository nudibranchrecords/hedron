import { Dialog, Panel, PanelBody, PanelHeader } from '@hedron/ui-core'
import styles from './SketchBuildErrorDialog.module.css'
import { useAppStore, BuildMessage } from '@renderer/appStore'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'

interface MessageItemProps {
  message: BuildMessage
  type: 'error' | 'warning'
}

const MessageItem = ({ message, type }: MessageItemProps) => (
  <div className={`${styles.messageItem} ${styles[type]}`}>
    <div className={styles.messageText}>{message.text}</div>
    {message.location && (
      <div className={styles.messageLocation}>
        <span className={styles.messageFile}>{message.location.file}</span>
        <span className={styles.messageLine}>
          :{message.location.line}:{message.location.column}
        </span>
        <pre className={styles.messageLineText}>{message.location.lineText}</pre>
      </div>
    )}
  </div>
)

export const SketchBuildErrorDialog = ({ closeDialog }: GlobalDialogProps) => {
  const buildResult = useAppStore((state) => state.sketchesServerBuildResult)

  const errors = buildResult?.errors ?? []
  const warnings = buildResult?.warnings ?? []

  const hasErrors = errors.length > 0
  const hasWarnings = warnings.length > 0

  return (
    <Dialog onBackgroundClick={closeDialog}>
      <Panel width="full" height="full" style={{ maxWidth: '50rem', maxHeight: '80vh' }}>
        <PanelHeader iconName="error" buttonOnClick={closeDialog}>
          Sketch Build {hasErrors ? 'Errors' : 'Warnings'}{' '}
          {hasErrors && hasWarnings && `(+ ${warnings.length} warnings)`}
        </PanelHeader>
        <PanelBody scrollable={true}>
          <div className={styles.messageList}>
            {errors.map((error, index) => (
              <MessageItem key={`error-${index}`} message={error} type="error" />
            ))}
            {warnings.map((warning, index) => (
              <MessageItem key={`warning-${index}`} message={warning} type="warning" />
            ))}
          </div>
        </PanelBody>
      </Panel>
    </Dialog>
  )
}
