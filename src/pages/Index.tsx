import { Calendar as CalendarIcon, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const calendarDays = [
  // Row 1
  { day: 1, current: true },
  { day: 2, current: true },
  { day: 3, current: true },
  { day: 4, current: true },
  { day: 5, current: true },
  { day: 6, current: true },
  { day: 7, current: true },
  // Row 2
  { day: 8, current: true },
  { day: 9, current: true },
  { day: 10, current: true },
  { day: 11, current: true },
  { day: 12, current: true },
  { day: 13, current: true },
  { day: 14, current: true },
  // Row 3
  { day: 15, current: true },
  { day: 16, current: true },
  { day: 17, current: true },
  { day: 18, current: true },
  { day: 19, current: true },
  { day: 20, current: true, today: true },
  { day: 21, current: true },
  // Row 4
  { day: 22, current: true },
  { day: 23, current: true },
  { day: 24, current: true },
  { day: 25, current: true },
  { day: 26, current: true },
  { day: 27, current: true },
  { day: 28, current: true },
  // Row 5
  { day: 29, current: true },
  { day: 30, current: true },
  { day: 31, current: true },
  { day: 1, current: false },
  { day: 2, current: false },
  { day: 3, current: false },
  { day: 4, current: false },
  // Row 6
  { day: 5, current: false },
  { day: 6, current: false },
  { day: 7, current: false },
  { day: 8, current: false },
  { day: 9, current: false },
  { day: 10, current: false },
  { day: 11, current: false },
]

export default function Index() {
  return (
    <div className="space-y-6 animate-fade-in pb-8 font-sans">
      <div>
        <h1 className="text-3xl font-normal text-[#1e3a8a] tracking-tight">Agenda</h1>
      </div>

      <div className="bg-white border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-2xl font-normal text-[#1e3a8a] mb-6">Agenda</h2>

        {/* Calendar Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex rounded-md border border-zinc-300 overflow-hidden shadow-sm">
            <Button
              variant="ghost"
              className="rounded-none border-r border-zinc-300 h-9 px-4 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
            >
              Mês
            </Button>
            <Button
              variant="ghost"
              className="rounded-none border-r border-zinc-300 h-9 px-4 text-xs font-medium hover:bg-zinc-100 text-zinc-700"
            >
              Semana
            </Button>
            <Button
              variant="ghost"
              className="rounded-none h-9 px-4 text-xs font-medium hover:bg-zinc-100 text-zinc-700"
            >
              Dia
            </Button>
          </div>

          <div className="text-lg font-bold text-zinc-600 uppercase tracking-widest">
            Março 2026
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 px-4 text-xs font-medium text-zinc-600 shadow-sm"
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              className="h-9 px-4 text-xs font-medium text-zinc-600 shadow-sm bg-zinc-50"
            >
              Mostrar Aniversariantes
            </Button>
            <div className="flex rounded-md border border-zinc-300 overflow-hidden shadow-sm ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none border-r border-zinc-300 h-9 w-10 hover:bg-zinc-100"
              >
                <ChevronLeft className="h-4 w-4 text-zinc-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none h-9 w-10 hover:bg-zinc-100"
              >
                <ChevronRight className="h-4 w-4 text-zinc-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border-t border-l border-zinc-200">
          <div className="grid grid-cols-7 bg-white">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
              <div
                key={day}
                className="py-3 text-center font-bold text-sm text-zinc-800 border-r border-b border-zinc-200"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((date, i) => (
              <div
                key={i}
                className={`min-h-[100px] p-2 border-r border-b border-zinc-200 relative transition-colors
                  ${date.today ? 'bg-[#fff9c4]' : 'bg-white'}
                `}
              >
                <span
                  className={`absolute top-2 right-3 text-xl ${
                    date.current ? 'text-zinc-800' : 'text-zinc-300'
                  }`}
                >
                  {date.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Markers Section */}
        <fieldset className="mt-8 border border-zinc-200 rounded-md p-4 pt-6 relative">
          <legend className="absolute -top-3 left-4 bg-white px-2 text-xs font-medium text-zinc-500">
            Marcadores
          </legend>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-[#2d3e50] hover:bg-[#1e2b3c] text-white text-xs h-8 px-4 rounded shadow-sm">
              Ocultar Agenda Pessoal
            </Button>
            <Button className="bg-[#00c0b5] hover:bg-[#009e95] text-white text-xs h-8 px-4 rounded shadow-sm">
              Ocultar Calendário Escolar
            </Button>
            <Button className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs h-8 px-4 rounded shadow-sm">
              Ocultar Feriados
            </Button>
          </div>
        </fieldset>

        {/* Summary Cards */}
        <div className="mt-6 space-y-3">
          <div className="p-4 border border-blue-200 bg-[#f0f7ff] rounded-md flex items-center gap-3 shadow-sm">
            <CalendarIcon className="h-5 w-5 text-blue-800" />
            <span className="text-sm font-medium text-blue-900">
              Sem compromissos agendados para hoje!
            </span>
          </div>

          <div className="p-4 border border-amber-200 bg-[#fff9c4] rounded-md flex items-center gap-3 shadow-sm">
            <Mail className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">Sem novas mensagens!</span>
          </div>
        </div>
      </div>
    </div>
  )
}
