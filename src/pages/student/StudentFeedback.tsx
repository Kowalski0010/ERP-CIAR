import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MessageSquare, Send, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function StudentFeedback() {
  const { students, addFeedback, feedbacks } = useAppStore()
  const { toast } = useToast()

  const student = students[0]
  const myFeedbacks = feedbacks
    .filter((fb) => fb.studentId === student?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const [category, setCategory] = useState<'Sugestão' | 'Reclamação' | 'Dúvida'>('Dúvida')
  const [message, setMessage] = useState('')

  if (!student) return <div>Acesso negado.</div>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    addFeedback({
      studentId: student.id,
      studentName: student.name,
      category,
      message,
    })

    toast({ title: 'Enviado', description: 'Seu feedback foi encaminhado para a secretaria.' })
    setMessage('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-zinc-400" />
          Feedback e Suporte
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Canal direto de comunicação com a secretaria e coordenação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base font-semibold">Novo Chamado</CardTitle>
            <CardDescription className="text-xs">
              Preencha o formulário para enviar sua mensagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Categoria</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger className="bg-zinc-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dúvida">Dúvida Acadêmica/Financeira</SelectItem>
                    <SelectItem value="Sugestão">Sugestão de Melhoria</SelectItem>
                    <SelectItem value="Reclamação">Reclamação / Problema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Mensagem</Label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Descreva detalhadamente..."
                  className="w-full p-3 text-sm rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50 resize-none"
                />
              </div>
              <Button type="submit" className="w-full shadow-sm">
                <Send className="w-4 h-4 mr-2" /> Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-base font-semibold">Histórico de Chamados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {myFeedbacks.length > 0 ? (
                myFeedbacks.map((fb) => (
                  <div key={fb.id} className="p-4 bg-white hover:bg-zinc-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-100 border-transparent px-2 py-0.5"
                      >
                        {fb.category}
                      </Badge>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(fb.date).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-800 font-medium mb-2">{fb.message}</p>

                    {fb.reply ? (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-md text-xs text-emerald-800">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Resposta da Secretaria:
                        </div>
                        {fb.reply}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 mt-1"
                      >
                        Aguardando Resposta
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-500 text-sm">Nenhum chamado aberto.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
