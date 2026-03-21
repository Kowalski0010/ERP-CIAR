import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Map, CalendarDays, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/contexts/AppContext'
import { Badge } from '@/components/ui/badge'

const hours = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '19:00',
  '20:00',
  '21:00',
]

export default function RoomOccupancy() {
  const { schedules } = useAppStore()
  const [day, setDay] = useState('Segunda')

  // Extract unique rooms from schedules, add some defaults
  const uniqueRooms = Array.from(new Set(schedules.map((s) => s.room)))
  if (uniqueRooms.length === 0)
    uniqueRooms.push('Sala 101', 'Sala 102', 'Lab Info 3', 'Lab Mac 1', 'Auditório')

  const getCellStatus = (room: string, hour: string) => {
    // Check if there is any schedule covering this hour for this room and day
    const hourInt = parseInt(hour.split(':')[0])
    const activeSchedule = schedules.find((s) => {
      if (s.room !== room || s.dayOfWeek !== day) return false
      const sStart = parseInt(s.startTime.split(':')[0])
      const sEnd = parseInt(s.endTime.split(':')[0])
      return hourInt >= sStart && hourInt < sEnd
    })

    if (activeSchedule) {
      // Return heat based on some mock logic or just a solid color indicating occupied
      return { occupied: true, subject: activeSchedule.subject, class: activeSchedule.classId }
    }

    // Add random mock heat for empty spaces to demonstrate the "Heatmap" feature
    // In real app, this would be actual occupancy data
    const isMockOccupied = Math.random() > 0.85
    if (isMockOccupied)
      return { occupied: true, subject: 'Uso Administrativo', class: 'N/A', isMock: true }

    return { occupied: false }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Map className="h-7 w-7 text-zinc-400" />
            Mapa de Ocupação Espacial
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Heatmap de alocação de salas e laboratórios em tempo real.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-700">
              <CalendarDays className="h-4 w-4 text-zinc-400" /> Grade Horária e Utilização
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-400" />
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="w-[180px] h-8 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}-feira
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px] p-6">
            <div className="grid grid-cols-[120px_repeat(10,1fr)] gap-1 mb-2">
              <div className="text-xs font-bold text-zinc-400 flex items-end pb-2">
                Salas / Horários
              </div>
              {hours.map((h) => (
                <div
                  key={h}
                  className="text-[10px] font-mono font-semibold text-zinc-500 text-center pb-2 border-b border-zinc-200"
                >
                  {h}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {uniqueRooms.map((room) => (
                <div
                  key={room}
                  className="grid grid-cols-[120px_repeat(10,1fr)] gap-1 items-center"
                >
                  <div className="text-xs font-semibold text-zinc-800 truncate pr-2" title={room}>
                    {room}
                  </div>
                  {hours.map((h) => {
                    const status = getCellStatus(room, h)

                    if (status.occupied) {
                      return (
                        <div
                          key={`${room}-${h}`}
                          className={`h-12 rounded flex flex-col items-center justify-center p-1 text-center transition-colors cursor-help ${status.isMock ? 'bg-amber-100 hover:bg-amber-200 border border-amber-200' : 'bg-blue-100 hover:bg-blue-200 border border-blue-200'}`}
                          title={`${status.subject} (${status.class})`}
                        >
                          <span
                            className={`text-[9px] font-bold leading-tight line-clamp-2 ${status.isMock ? 'text-amber-800' : 'text-blue-800'}`}
                          >
                            {status.subject}
                          </span>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={`${room}-${h}`}
                        className="h-12 bg-zinc-50 border border-zinc-100 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Disponível"
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4 text-xs text-zinc-500 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" /> Turmas
                Regulares
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" />{' '}
                Eventos/Admin
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-zinc-50 border border-zinc-100" /> Livre
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
