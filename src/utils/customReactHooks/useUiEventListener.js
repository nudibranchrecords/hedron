// Based on https://github.com/donavon/use-event-listener

import { useRef, useEffect } from 'react'
import uiEventEmitter from '..//uiEventEmitter'

const useUiEventListener = (eventName, handler) => {
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      const eventListener = event => savedHandler.current(event)
      uiEventEmitter.on(eventName, eventListener)
      return () => {
        uiEventEmitter.removeListener(eventName, eventListener)
      }
    },
    [eventName]
  )
}

export default useUiEventListener
