'use client'
import * as react from 'react';

export function TabTrap() {
  react.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') e.preventDefault()
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [])
  return null
}