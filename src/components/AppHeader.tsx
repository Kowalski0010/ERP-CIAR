import { HelpCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-end gap-3 border-b border-zinc-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-zinc-50 pr-3 pl-1 py-1 rounded-full border border-zinc-200">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=99"
              alt="KOWALSKI"
            />
            <AvatarFallback className="bg-[#1e3a8a] text-white text-[10px]">KW</AvatarFallback>
          </Avatar>
          <span className="text-[11px] font-bold text-zinc-700 tracking-wider">KOWALSKI</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium text-white bg-[#2d3e50] hover:bg-[#1e2b3c] hover:text-white border-transparent"
        >
          <HelpCircle className="h-3.5 w-3.5 mr-1.5" /> Suporte
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sair
        </Button>
      </div>
    </header>
  )
}
