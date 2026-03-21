import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Clock, MapPin, BookOpen, Download, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ptBR } from 'date-fns/locale'

const mockEvents = [
  {
    id: 1,
    date: new Date(),
    title: 'Prova N1 - Cálculo I',
    type: 'Avaliação',
    time: '08:00',
    location: 'Sala 101',
    desc: 'Avaliação presencial com peso 10.',
  },
  {
    id: 2,
    date: new Date(Date.now() + 86400000),
    title: 'Entrega de Trabalho - Física',
    type: 'Trabalho',
    time: '23:59',
    location: 'Portal Acadêmico',
    desc: 'Prazo final para envio via sistema.',
  },
  {
    id: 3,
    date: new Date(Date.now() + 172800000),
    title: 'Reunião de Professores',
    type: 'Evento',
    time: '14:00',
    location: 'Sala dos Professores',
    desc: 'Alinhamento pedagógico bimestral.',
  },
]

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const selectedEvents = mockEvents.filter(
    (e) => date && e.date.toDateString() === date.toDateString(),
  )

  const generateGoogleCalendarUrl = (event: any) => {
    const d = new Date(event.date)
    const [hours, minutes] = event.time.split(':')
    d.setHours(parseInt(hours), parseInt(minutes))

    const start = d.toISOString().replace(/-|:|\.\d+/g, '')
    const endObj = new Date(d.getTime() + 60 * 60 * 1000)
    const end = endObj.toISOString().replace(/-|:|\.\d+/g, '')

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.desc)}&location=${encodeURIComponent(event.location)}`
  }

  const downloadICS = (event: any) => {
    const d = new Date(event.date)
    const [hours, minutes] = event.time.split(':')
    d.setHours(parseInt(hours), parseInt(minutes))

    const start = d.toISOString().replace(/-|:|\.\d+/g, '')
    const endObj = new Date(d.getTime() + 60 * 60 * 1000)
    const end = endObj.toISOString().replace(/-|:|\.\d+/g, '')

    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.desc}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-zinc-400" />
            Agenda Acadêmica Institucional
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Calendário visual de avaliações, prazos e eventos. Sincronize com seu calendário
            pessoal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base text-zinc-800">Calendário Mensal</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex justify-center w-full">
            <div className="w-full max-w-[300px] mx-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                className="rounded-md border border-zinc-200 bg-white mx-auto shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-zinc-800 px-1">
            Eventos de {date ? date.toLocaleDateString('pt-BR') : 'Hoje'}
          </h2>
          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((ev) => (
                <Card
                  key={ev.id}
                  className="border-zinc-200 shadow-sm transition-colors group bg-white"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h3 className="font-bold text-zinc-900 text-sm leading-tight">
                          {ev.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-zinc-50 border-zinc-200 text-zinc-600 text-[10px] w-fit"
                        >
                          {ev.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-medium mb-4">
                        <span className="flex items-center gap-1.5 bg-zinc-100 px-2 py-1 rounded">
                          <Clock className="h-3.5 w-3.5" /> {ev.time}
                        </span>
                        <span className="flex items-center gap-1.5 bg-zinc-100 px-2 py-1 rounded">
                          <MapPin className="h-3.5 w-3.5" /> {ev.location}
                        </span>
                      </div>
                      <div className="flex gap-2 border-t border-zinc-100 pt-3">
                        <Button variant="outline" size="sm" className="h-8 text-[11px]" asChild>
                          <a href={generateGoogleCalendarUrl(ev)} target="_blank" rel="noreferrer">
                            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Google Agenda
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[11px]"
                          onClick={() => downloadICS(ev)}
                        >
                          <Download className="mr-1.5 h-3.5 w-3.5" /> Exportar .ICS
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50 border border-zinc-200 rounded-lg border-dashed">
              <CalendarDays className="h-10 w-10 text-zinc-300 mb-3" />
              <p className="text-sm font-semibold text-zinc-700">Nenhum evento agendado</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Não há provas, entregas ou atividades programadas para a data selecionada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
