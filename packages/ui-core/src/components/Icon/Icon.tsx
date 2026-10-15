import c from './Icon.module.css'

// All icons are installed, find names here
// https://fonts.google.com/icons
export type IconName =
  | '360'
  | 'add'
  | 'add_circle'
  | 'arrow_downward'
  | 'arrow_upward'
  | 'audio_file'
  | 'bolt'
  | 'cable'
  | 'close'
  | 'code'
  | 'content_copy'
  | 'delete'
  | 'description'
  | 'draft'
  | 'drag_pan'
  | 'edit'
  | 'error'
  | 'file_open'
  | 'folder_open'
  | 'frame_bug'
  | 'fullscreen'
  | 'image'
  | 'info'
  | 'mood'
  | 'more_horiz'
  | 'movie'
  | 'panorama'
  | 'pause'
  | 'photo_camera_back'
  | 'play_arrow'
  | 'power'
  | 'remove'
  | 'settings'
  | 'token'
  | 'tune'
  | 'video_camera_back'
  | 'view_in_ar'

export const sketchIcon: IconName = 'token'
export const sceneIcon: IconName = 'view_in_ar'
export const paramIcon: IconName = 'tune'
export const inputIcon: IconName = 'cable'
export const fileIcon: IconName = 'draft'
export const imageFileIcon: IconName = 'image'
export const videoFileIcon: IconName = 'movie'
export const audioFileIcon: IconName = 'audio_file'
export const collapseOpenIcon: IconName = 'add'
export const collapseCloseIcon: IconName = 'remove'
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName
}

export const Icon = ({ name, className, ...props }: IconProps) => (
  <span className={`material-symbols-rounded ${c.wrapper} ${className}`} {...props}>
    {name}
  </span>
)
