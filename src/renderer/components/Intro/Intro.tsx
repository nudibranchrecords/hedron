import { useCallback } from 'react'
import c from './Intro.module.css'
import { Button } from '../core/Button/Button'
import { FileEvents } from 'src/shared/Events'

export const Intro = () => {
  const onButtonClick = useCallback(() => {
    window.electron.ipcRenderer.send(FileEvents.OpenSketchesDirDialog)
  }, [])

  return (
    <div className={c.wrapper}>
      <p>Choose your sketches folder...</p>
      <Button onClick={onButtonClick}>Select Sketches Folder</Button>
    </div>
  )
}
