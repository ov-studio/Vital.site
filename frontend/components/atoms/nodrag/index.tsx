'use client'
import * as react from 'react';

export function NoDrag() {
  react.useEffect(() => {
    const handler = (e: DragEvent) => {
      if (e.target instanceof Element) e.preventDefault()
    }
    document.addEventListener('dragstart', handler, true)
    return () => document.removeEventListener('dragstart', handler, true)
  }, [])
  return null
}
