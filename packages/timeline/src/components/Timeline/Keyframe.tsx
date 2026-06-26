import c from './Timeline.module.css'

interface KeyframeProps {
  id: string
  onClick?: (keyframeId: string) => void
  isSelected: boolean
  percentPos: number
}

export const Keyframe = ({ onClick, isSelected, percentPos, id }: KeyframeProps) => {
  const percent = percentPos
  const isKeyframeSelected = isSelected
  return (
    <div
      key={id}
      className={`${c.keyframe} ${isKeyframeSelected ? c.keyframeSelected : ''}`}
      style={{ left: `${percent}%` }}
      onClick={(e) => {
        if (!onClick) return
        e.stopPropagation()
        onClick(id)
      }}
    />
  )
}
