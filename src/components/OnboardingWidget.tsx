import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/hooks/use-onboarding'
import { onboardingData } from '@/lib/onboarding-data'

export function OnboardingWidget() {
  const { currentUserRole } = useAppStore()
  const content = onboardingData[currentUserRole] || onboardingData.Default

  const { completedItems, toggleItem } = useOnboarding(currentUserRole)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const loadVisibility = () => {
      const dismissed = localStorage.getItem(`onboarding_dismissed_${currentUserRole}`)
      setIsVisible(dismissed !== 'true')
    }
    loadVisibility()
    window.addEventListener('onboarding-visibility', loadVisibility)
    return () => window.removeEventListener('onboarding-visibility', loadVisibility)
  }, [currentUserRole])

  const dismiss = () => {
    setIsVisible(false)
    localStorage.setItem(`onboarding_dismissed_${currentUserRole}`, 'true')
    window.dispatchEvent(new Event('onboarding-visibility'))
  }

  const progress = Math.round((completedItems.length / content.checklist.length) * 100) || 0

  if (!isVisible || progress === 100) return null

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/30 dark:bg-blue-950/20 dark:border-blue-900 shadow-sm relative overflow-hidden animate-fade-in-up">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 z-10"
        onClick={dismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-1 space-y-2">
          <h3 className="text-base font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2 pr-6">
            Bem-vindo! Vamos configurar seu acesso.
          </h3>
          <p className="text-sm text-blue-700/80 dark:text-blue-300/80 max-w-2xl">
            Siga os passos ao lado para extrair o máximo das ferramentas disponíveis para o seu
            perfil de {currentUserRole}. Clique no botão "Suporte" no topo para mais tutoriais.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Progress
              value={progress}
              className="h-2 flex-1 max-w-[200px] bg-blue-100 dark:bg-blue-900"
            />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              {progress}% concluído
            </span>
          </div>
        </div>

        <div className="w-full md:w-[350px] space-y-2 shrink-0">
          {content.checklist.map((item) => {
            const isDone = completedItems.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors text-left shadow-sm group"
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-zinc-300 dark:text-zinc-600 shrink-0 group-hover:text-blue-400 transition-colors" />
                )}
                <span
                  className={`text-xs font-medium truncate ${isDone ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
