import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 z-[100] h-12 w-12 rounded-full shadow-lg border-border bg-background"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      title="Alternar Tema"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
      <span className="sr-only">Alternar Tema</span>
    </Button>
  )
}
