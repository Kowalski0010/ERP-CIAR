import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Inbox, Filter, Reply, Check } from 'lucide-react'
import { StudentFeedback } from '@/lib/types'

export default function FeedbackInbox() {
  const { feedbacks, replyFeedback } = useAppStore()
  const { toast } = useToast()

  const [filter, setFilter] = useState('Todos')
  const [selectedFb, setSelectedFb] = useState<StudentFeedback | null>(null)
  const [replyText, setReplyText] = useState('')

  const filtered = feedbacks
    .filter((fb) => filter === 'Todos' || fb.status === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleReply = () => {
    if (!selectedFb || !replyText.trim()) return
    replyFeedback(selectedFb.id, replyText)
    toast({ title: 'Resposta Enviada', description: 'O aluno foi notificado da sua resposta.' })
    setSelectedFb(null)
    setReplyText('')
  }

  const getStatusColor = (s: string) => {
    if (s === 'Novo') return 'bg-blue-100 text-blue-800 border-blue-200'
    if (s === 'Respondido') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    return 'bg-zinc-100 text-zinc-600 border-zinc-200'
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Inbox className="h-7 w-7 text-zinc-400" />
            Caixa de Feedback
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerencie as sugestões, dúvidas e reclamações enviadas pelo Portal do Aluno.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Inbox List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="h-8 text-xs bg-zinc-50">
                    <SelectValue placeholder="Filtrar por Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Novo">Novos</SelectItem>
                    <SelectItem value="Respondido">Respondidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm bg-white flex-1 overflow-hidden">
            <CardContent className="p-0 max-h-[600px] overflow-y-auto divide-y divide-zinc-100">
              {filtered.length > 0 ? (
                filtered.map((fb) => (
                  <div
                    key={fb.id}
                    className={`p-4 cursor-pointer transition-colors ${selectedFb?.id === fb.id ? 'bg-blue-50/50' : 'hover:bg-zinc-50'}`}
                    onClick={() => setSelectedFb(fb)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs text-zinc-900 truncate">
                        {fb.studentName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 uppercase ${getStatusColor(fb.status)}`}
                      >
                        {fb.status}
                      </Badge>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-medium bg-zinc-100 px-1.5 py-0 mb-2"
                    >
                      {fb.category}
                    </Badge>
                    <p className="text-xs text-zinc-600 line-clamp-2">{fb.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-zinc-500">
                  Nenhuma mensagem encontrada.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail View */}
        <Card className="w-full md:w-2/3 border-zinc-200 shadow-sm bg-white h-fit min-h-[400px]">
          {selectedFb ? (
            <div className="flex flex-col h-full">
              <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-zinc-900">
                      {selectedFb.studentName}
                    </CardTitle>
                    <p className="text-xs text-zinc-500 mt-1">
                      Enviado em {new Date(selectedFb.date).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {selectedFb.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4 text-sm text-zinc-800 mb-6 whitespace-pre-wrap">
                  {selectedFb.message}
                </div>

                {selectedFb.reply ? (
                  <div className="mt-auto border-t border-zinc-100 pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" /> Resposta Registrada
                    </h4>
                    <p className="text-sm text-zinc-700 bg-emerald-50/30 p-4 rounded border border-emerald-100">
                      {selectedFb.reply}
                    </p>
                  </div>
                ) : (
                  <div className="mt-auto border-t border-zinc-100 pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
                      <Reply className="w-4 h-4" /> Enviar Resposta Oficial
                    </h4>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Digite a resposta para o aluno aqui..."
                      className="w-full p-3 text-sm rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white resize-none min-h-[120px] mb-3"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleReply} className="shadow-sm">
                        Enviar Resposta
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-zinc-400 p-12">
              <Inbox className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">Selecione uma mensagem para ler e responder.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
