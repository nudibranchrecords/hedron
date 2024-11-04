import c from './Icon.module.css'

// All icons are installed, find names here
// https://fonts.google.com/icons
export type IconName =
  | 'add'
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

export const sketchIcon: IconName = 'token'
export const sceneIcon: IconName = 'panorama'

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName
}

export const Icon = ({ name, className, ...props }: IconProps) => (
  <span className={`material-symbols-rounded ${c.wrapper} ${className}`} {...props}>
    {name}
  </span>
)
