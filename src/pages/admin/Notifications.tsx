import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { BellRing, Send, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function Notifications() {
  const { notifications, sendNotification } = useAppStore()
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'Info' | 'Warning' | 'Success'>('Info')
  const [target, setTarget] = useState<'Todos' | 'Alunos' | 'Professores' | 'Staff'>('Todos')

  const [channels, setChannels] = useState({ email: true, sms: false, whatsapp: false })

  const handleToggleChannel = (ch: 'email' | 'sms' | 'whatsapp', checked: boolean) => {
    setChannels((prev) => ({ ...prev, [ch]: checked }))
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return
    if (!channels.email && !channels.sms && !channels.whatsapp) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione ao menos um canal de envio.',
      })
      return
    }

    sendNotification({ title, message, type, target })
    toast({
      title: 'Enviado',
      description: `Notificação enviada para: ${target} via canais selecionados.`,
    })
    setTitle('')
    setMessage('')
  }

  const getTypeIcon = (t: string) => {
    if (t === 'Success') return <CheckCircle className="h-4 w-4 text-emerald-500" />
    if (t === 'Warning') return <AlertTriangle className="h-4 w-4 text-amber-500" />
    return <Info className="h-4 w-4 text-blue-500" />
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BellRing className="h-7 w-7 text-zinc-400" />
            Central de Alertas e Broadcast
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Envio e gerenciamento de comunicações ativas (Email, SMS, WhatsApp).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-zinc-200 shadow-sm h-fit">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
            <CardTitle className="text-base">Nova Mensagem</CardTitle>
            <CardDescription className="text-xs">Componha um aviso sistêmico</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-5">
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">Mensagem Curta</Label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full min-h-[80px] p-2 text-xs rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100">
                <Label className="text-xs font-semibold text-zinc-700">Canais de Disparo</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2 bg-zinc-50 p-1.5 rounded border border-zinc-200">
                    <Checkbox
                      id="ch-email"
                      checked={channels.email}
                      onCheckedChange={(c) => handleToggleChannel('email', !!c)}
                    />
                    <label
                      htmlFor="ch-email"
                      className="text-[11px] font-medium leading-none cursor-pointer"
                    >
                      Email
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-zinc-50 p-1.5 rounded border border-zinc-200">
                    <Checkbox
                      id="ch-sms"
                      checked={channels.sms}
                      onCheckedChange={(c) => handleToggleChannel('sms', !!c)}
                    />
                    <label
                      htmlFor="ch-sms"
                      className="text-[11px] font-medium leading-none cursor-pointer"
                    >
                      SMS
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                    <Checkbox
                      id="ch-wa"
                      checked={channels.whatsapp}
                      onCheckedChange={(c) => handleToggleChannel('whatsapp', !!c)}
                    />
                    <label
                      htmlFor="ch-wa"
                      className="text-[11px] font-bold text-emerald-800 leading-none cursor-pointer"
                    >
                      WhatsApp
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">Tipo</Label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Info">Informativo</SelectItem>
                      <SelectItem value="Warning">Alerta</SelectItem>
                      <SelectItem value="Success">Sucesso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700">Público</Label>
                  <Select value={target} onValueChange={(v: any) => setTarget(v)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Alunos">Alunos</SelectItem>
                      <SelectItem value="Professores">Professores</SelectItem>
                      <SelectItem value="Staff">Equipe (Staff)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full shadow-sm mt-2">
                <Send className="h-4 w-4 mr-2" /> Disparar Aviso
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-zinc-200 shadow-sm">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
            <CardTitle className="text-base">Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 hover:bg-zinc-50/50 transition-colors flex gap-4">
                  <div className="pt-1">{getTypeIcon(n.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-zinc-900">{n.title}</h4>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(n.date).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-2">{n.message}</p>
                    <div className="pt-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2 py-0 border border-zinc-200"
                      >
                        Destino: {n.target}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  Nenhuma notificação registrada.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
