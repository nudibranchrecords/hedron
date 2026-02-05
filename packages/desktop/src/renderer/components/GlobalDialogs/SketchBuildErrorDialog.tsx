import { Dialog, Panel, PanelBody, PanelHeader } from '@hedron/ui-core'
import styles from './SketchBuildErrorDialog.module.css'
import { useAppStore, BuildError } from '@renderer/appStore'
import { GlobalDialogProps } from '@components/GlobalDialogs/types'

export const SketchBuildErrorDialog = ({ closeDialog }: GlobalDialogProps) => {
  const buildErrors = useAppStore((state) => state.buildErrors)

  return (
    <Dialog onBackgroundClick={closeDialog}>
      <Panel width="full" height="full" style={{ maxWidth: '50rem', maxHeight: '80vh' }}>
        <PanelHeader iconName="error" buttonOnClick={closeDialog}>
          Sketch Build Errors
        </PanelHeader>
        <PanelBody scrollable={true}>
          <div className={styles.errorList}>
            {buildErrors.map((error: BuildError, index: number) => (
              <div key={index} className={styles.errorItem}>
                <div className={styles.errorText}>{error.text}</div>
                {error.location && (
                  <div className={styles.errorLocation}>
                    <span className={styles.errorFile}>{error.location.file}</span>
                    <span className={styles.errorLine}>
                      :{error.location.line}:{error.location.column}
                    </span>
                    <pre className={styles.errorLineText}>{error.location.lineText}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>
    </Dialog>
  )
}
