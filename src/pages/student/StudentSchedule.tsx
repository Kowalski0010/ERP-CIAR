import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function StudentSchedule() {
  const { schedules, teachers } = useAppStore()
  // Mock logic: assume student is in T01
  const mySchedules = schedules.filter((s) => s.classId === 'T01')
  const getTeacherName = (id: string) => teachers.find((t) => t.id === id)?.name || 'N/A'

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-zinc-400" />
          Minha Agenda de Aulas
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Grade curricular e horários das disciplinas matriculadas.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 items-start">
        {days.map((day) => {
          const daySlots = mySchedules
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))

          return (
            <Card
              key={day}
              className="shadow-sm border-zinc-200 bg-white rounded-md overflow-hidden flex flex-col min-h-[300px]"
            >
              <CardHeader className="py-2.5 px-3 bg-zinc-50 border-b border-zinc-100">
                <CardTitle className="text-[12px] font-bold text-zinc-700 uppercase tracking-widest flex items-center justify-between">
                  {day}
                  {daySlots.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-zinc-200 text-zinc-700 text-[9px] px-1.5 py-0 h-4 rounded-sm"
                    >
                      {daySlots.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-1 flex flex-col gap-2">
                {daySlots.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 text-[11px] uppercase tracking-wider opacity-60">
                    Livre
                  </div>
                ) : (
                  daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-zinc-50/50 p-3 rounded border border-zinc-200 border-l-[3px] border-l-blue-600 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-1.5 text-zinc-600 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono text-[10px] font-bold">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <p className="font-bold text-[13px] text-zinc-900 leading-tight">
                        {slot.subject}
                      </p>
                      <div className="text-[11px] text-zinc-500 font-medium truncate mt-1">
                        {getTeacherName(slot.teacherId)}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-1">
                        <MapPin className="w-3 h-3" /> {slot.room}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
