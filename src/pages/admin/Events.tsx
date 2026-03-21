import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAppStore } from '@/contexts/AppContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, Clock, Users, Plus, Check, X, HelpCircle, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Events() {
  const { schoolEvents, addSchoolEvent, rsvpEvent } = useAppStore()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isAddOpen, setIsAddOpen] = useState(false)

  const selectedDateStr = date ? date.toISOString().split('T')[0] : ''
  const selectedEvents = schoolEvents.filter((e) => e.date === selectedDateStr)

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addSchoolEvent({
      title: fd.get('title') as string,
      category: fd.get('category') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      description: fd.get('description') as string,
    })
    toast({
      title: 'Evento Criado',
      description:
        'O evento foi adicionado ao calendário da instituição e os convites serão enviados.',
    })
    setIsAddOpen(false)
  }

  const handleSimulateRSVP = (id: string, response: 'yes' | 'no') => {
    rsvpEvent(id, response)
    toast({ title: 'RSVP Computado', description: 'O contador do evento foi atualizado.' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-zinc-400" />
            Gestão de Eventos (RSVP)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Central de agendamento de feiras, reuniões e controle de presença automatizado.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="pb-2 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base text-zinc-800">Calendário de Eventos</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex justify-center w-full">
            <div className="w-full max-w-[320px] mx-auto">
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
          <h2 className="text-lg font-bold text-zinc-800 px-1 border-b pb-2">
            Eventos Programados: {date ? date.toLocaleDateString('pt-BR') : ''}
          </h2>

          {selectedEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedEvents.map((ev) => {
                const total = ev.rsvp.yes + ev.rsvp.no + ev.rsvp.pending
                return (
                  <Card key={ev.id} className="border-zinc-200 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge
                            variant="outline"
                            className="mb-2 bg-white text-zinc-600 border-zinc-200"
                          >
                            {ev.category}
                          </Badge>
                          <CardTitle className="text-lg">{ev.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-3.5 w-3.5" /> {ev.time}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-zinc-600 mb-6">{ev.description}</p>

                      <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                            <Users className="w-4 h-4" /> Controle de Presença (RSVP)
                          </h4>
                          <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border shadow-sm">
                            Total: {total}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-emerald-50 border border-emerald-100 rounded flex flex-col items-center justify-center py-3">
                            <Check className="h-5 w-5 text-emerald-500 mb-1" />
                            <span className="text-2xl font-bold text-emerald-700">
                              {ev.rsvp.yes}
                            </span>
                            <span className="text-[10px] text-emerald-600 uppercase font-semibold">
                              Confirmados
                            </span>
                          </div>
                          <div className="bg-rose-50 border border-rose-100 rounded flex flex-col items-center justify-center py-3">
                            <X className="h-5 w-5 text-rose-500 mb-1" />
                            <span className="text-2xl font-bold text-rose-700">{ev.rsvp.no}</span>
                            <span className="text-[10px] text-rose-600 uppercase font-semibold">
                              Ausentes
                            </span>
                          </div>
                          <div className="bg-amber-50 border border-amber-100 rounded flex flex-col items-center justify-center py-3">
                            <HelpCircle className="h-5 w-5 text-amber-500 mb-1" />
                            <span className="text-2xl font-bold text-amber-700">
                              {ev.rsvp.pending}
                            </span>
                            <span className="text-[10px] text-amber-600 uppercase font-semibold">
                              Pendentes
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSimulateRSVP(ev.id, 'no')}
                            className="h-8 text-xs text-rose-600 hover:text-rose-700"
                          >
                            Simular Resposta: NÃO
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSimulateRSVP(ev.id, 'yes')}
                            className="h-8 text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            Simular Resposta: SIM
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50 border border-zinc-200 rounded-lg border-dashed">
              <CalendarDays className="h-10 w-10 text-zinc-300 mb-3" />
              <p className="text-sm font-semibold text-zinc-700">Agenda Livre</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                Nenhum evento registrado para esta data. Utilize o botão "Novo Evento" para
                adicionar.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Evento Acadêmico</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Título do Evento</Label>
              <Input name="title" required placeholder="Ex: Feira de Inovação" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select name="category" required defaultValue="Feira Institucional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feira Institucional">Feira Institucional</SelectItem>
                    <SelectItem value="Reunião">Reunião de Pais/Mestres</SelectItem>
                    <SelectItem value="Celebração">Celebração Festiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Input name="time" type="time" required defaultValue="10:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data Programada</Label>
              <Input name="date" type="date" required defaultValue={selectedDateStr} />
            </div>
            <div className="space-y-2">
              <Label>Descrição e Local</Label>
              <textarea
                name="description"
                required
                rows={3}
                placeholder="Detalhes para os convidados..."
                className="w-full p-2 text-sm rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
              />
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Salvar e Convidar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
