import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAppStore } from '@/contexts/AppContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, Clock, Users, Plus, Check, X, HelpCircle, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const eventSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  category: z.string().min(1, 'Categoria obrigatória'),
  date: z.string().min(1, 'Data obrigatória'),
  time: z.string().min(1, 'Horário obrigatório'),
  description: z.string().min(10, 'Descreva os detalhes do evento'),
})

export default function Events() {
  const { schoolEvents, addSchoolEvent, rsvpEvent } = useAppStore()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isAddOpen, setIsAddOpen] = useState(false)

  const selectedDateStr = date ? date.toISOString().split('T')[0] : ''
  const selectedEvents = schoolEvents.filter((e) => e.date === selectedDateStr)

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      category: 'Feira Institucional',
      date: selectedDateStr,
      time: '10:00',
      description: '',
    },
  })

  useEffect(() => {
    if (isAddOpen) {
      form.reset({
        title: '',
        category: 'Feira Institucional',
        date: selectedDateStr,
        time: '10:00',
        description: '',
      })
    }
  }, [isAddOpen, selectedDateStr, form])

  // Global shortcut for opening modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCreateSubmit = (data: z.infer<typeof eventSchema>) => {
    addSchoolEvent({
      title: data.title,
      category: data.category,
      date: data.date,
      time: data.time,
      description: data.description,
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
        <Button
          onClick={() => setIsAddOpen(true)}
          className="shadow-sm group"
          title="Atalho: Ctrl + N"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
          <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
            Ctrl+N
          </span>
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agendar Evento Acadêmico</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Feira de Inovação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Feira Institucional">Feira Institucional</SelectItem>
                          <SelectItem value="Reunião">Reunião de Pais/Mestres</SelectItem>
                          <SelectItem value="Celebração">Celebração Festiva</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Programada</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição e Local</FormLabel>
                    <FormControl>
                      <textarea
                        rows={3}
                        placeholder="Detalhes para os convidados..."
                        className="w-full p-2 text-sm rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" /> Salvar e Convidar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
