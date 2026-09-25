import type { MouseEvent as ReactMouseEvent, RefObject } from 'react'
import { useCallback, useRef, useState } from 'react'

export interface SelectionBox {
  left: number
  top: number
  width: number
  height: number
}

interface UseSelectionBoxParams {
  bodyRef: RefObject<HTMLDivElement>
  onSelectionChange: (keyframeIds: string[]) => void
}

/** Body-relative coordinates, clamped so the box can't stretch the scrollable area. */
const getContentPoint = (body: HTMLDivElement, clientX: number, clientY: number) => {
  const rect = body.getBoundingClientRect()

  return {
    x: Math.max(0, Math.min(clientX - rect.left + body.scrollLeft, body.scrollWidth)),
    y: Math.max(0, Math.min(clientY - rect.top + body.scrollTop, body.scrollHeight)),
  }
}

const getKeyframeIdsInBox = (body: HTMLDivElement, box: SelectionBox): string[] => {
  const bodyRect = body.getBoundingClientRect()
  const keyframeIds: string[] = []
  const seen = new Set<string>()

  for (const element of body.querySelectorAll<HTMLElement>('[data-keyframe-ids]')) {
    const rect = element.getBoundingClientRect()
    const left = rect.left - bodyRect.left + body.scrollLeft
    const top = rect.top - bodyRect.top + body.scrollTop

    const isInsideBox =
      left + rect.width >= box.left &&
      left <= box.left + box.width &&
      top + rect.height >= box.top &&
      top <= box.top + box.height

    if (!isInsideBox) continue

    // A collapsed group row stands in for every keyframe beneath it.
    for (const keyframeId of element.dataset.keyframeIds?.split(',') ?? []) {
      if (!keyframeId || seen.has(keyframeId)) continue

      seen.add(keyframeId)
      keyframeIds.push(keyframeId)
    }
  }

  return keyframeIds
}

export const useSelectionBox = ({ bodyRef, onSelectionChange }: UseSelectionBoxParams) => {
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)
  const startPointRef = useRef<{ x: number; y: number } | null>(null)

  const startSelectionBox = useCallback(
    (e: ReactMouseEvent) => {
      const body = bodyRef.current
      if (!body) return

      startPointRef.current = getContentPoint(body, e.clientX, e.clientY)
      onSelectionChange([])

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const startPoint = startPointRef.current
        const currentBody = bodyRef.current
        if (!startPoint || !currentBody) return

        const point = getContentPoint(currentBody, moveEvent.clientX, moveEvent.clientY)
        const box: SelectionBox = {
          left: Math.min(startPoint.x, point.x),
          top: Math.min(startPoint.y, point.y),
          width: Math.abs(point.x - startPoint.x),
          height: Math.abs(point.y - startPoint.y),
        }

        setSelectionBox(box)
        onSelectionChange(getKeyframeIdsInBox(currentBody, box))
      }

      const handleMouseUp = () => {
        startPointRef.current = null
        setSelectionBox(null)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [bodyRef, onSelectionChange],
  )

  return { selectionBox, startSelectionBox }
}
