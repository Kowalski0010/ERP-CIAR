import { useState, useEffect } from 'react'

export function useOnboarding(role: string) {
  const [completedItems, setCompletedItems] = useState<string[]>([])

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem(`onboarding_${role}`)
      if (saved) {
        setCompletedItems(JSON.parse(saved))
      } else {
        setCompletedItems([])
      }
    }
    load()

    const handleSync = () => load()
    window.addEventListener('onboarding-sync', handleSync)
    return () => window.removeEventListener('onboarding-sync', handleSync)
  }, [role])

  const toggleItem = (id: string) => {
    setCompletedItems((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem(`onboarding_${role}`, JSON.stringify(next))
      window.dispatchEvent(new Event('onboarding-sync'))
      return next
    })
  }

  return { completedItems, toggleItem }
}
