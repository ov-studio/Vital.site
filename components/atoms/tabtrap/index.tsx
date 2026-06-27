'use client'
import { useEffect } from 'react'

export function TabTrap() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') e.preventDefault()
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [])
  return null
}