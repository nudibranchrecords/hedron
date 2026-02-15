import c from './Icon.module.css'

// All icons are installed, find names here
// https://fonts.google.com/icons
export type IconName =
  | 'add'
  | 'remove'
  | 'add_circle'
  | 'delete'
  | 'mood'
  | 'bolt'
  | 'power'
  | 'info'
  | 'content_copy'
  | 'folder_open'
  | 'file_open'
  | 'draft'
  | 'description'
  | 'token'
  | 'close'
  | 'panorama'
  | 'tune'
  | 'edit'
  | 'play_arrow'
  | 'pause'
  | 'more_horiz'
  | 'fullscreen'
  | 'video_camera_back'
  | 'photo_camera_back'
  | '360'
  | 'error'
  | 'arrow_upward'
  | 'arrow_downward'
  | 'frame_bug'
  | 'cable'
  | 'settings'

export const sketchIcon: IconName = 'token'
export const sceneIcon: IconName = 'panorama'
export const paramIcon: IconName = 'tune'
export const inputIcon: IconName = 'cable'

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName
}

export const Icon = ({ name, className, ...props }: IconProps) => (
  <span className={`material-symbols-rounded ${c.wrapper} ${className}`} {...props}>
    {name}
  </span>
)
