import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BarChart3, Send, Plus, CheckCircle2, MessageSquare, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function Surveys() {
  const { surveys, addSurvey } = useAppStore()
  const { toast } = useToast()

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addSurvey({
      title: fd.get('title') as string,
      target: fd.get('target') as string,
      triggerBimester: fd.get('bimester') as string,
    })
    toast({
      title: 'Pesquisa Criada',
      description: 'A automação disparará a pesquisa no período definido.',
    })
    e.currentTarget.reset()
  }

  const handleSendNow = (id: string) => {
    toast({
      title: 'Disparo Manual',
      description: 'Os formulários foram enviados imediatamente para os usuários-alvo.',
    })
  }

  const getNpsColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600'
    if (score >= 50) return 'text-amber-500'
    return 'text-rose-500'
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-zinc-400" />
            Pesquisas de Satisfação (NPS)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Geração de formulários, disparos automatizados bimestrais e análise de métricas.
          </p>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Pesquisas e Resultados</TabsTrigger>
          <TabsTrigger value="new">Criar Nova Pesquisa</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {surveys.map((sv) => (
              <Card key={sv.id} className="border-zinc-200 shadow-sm bg-white flex flex-col h-full">
                <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge
                        variant="outline"
                        className={`mb-2 text-[10px] uppercase font-bold px-1.5 py-0 ${sv.status === 'Ativo' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
                      >
                        {sv.status}
                      </Badge>
                      <CardTitle className="text-base text-zinc-900">{sv.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Público-alvo: {sv.target} • Disparo Automático: {sv.triggerBimester}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-1 flex flex-col">
                  {sv.status === 'Encerrado' ? (
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> Score NPS
                          </span>
                          <span
                            className={`text-4xl font-extrabold ${getNpsColor(sv.results.score)}`}
                          >
                            {sv.results.score}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs font-medium">
                          <span className="text-emerald-600">
                            {sv.results.promoters}% Promotores
                          </span>
                          <span className="text-amber-600">{sv.results.passives}% Passivos</span>
                          <span className="text-rose-600">{sv.results.detractors}% Detratores</span>
                        </div>
                      </div>

                      <div className="border-t border-zinc-100 pt-4 mt-auto">
                        <h4 className="text-xs font-bold text-zinc-800 mb-3 flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-zinc-400" /> Últimos Comentários
                        </h4>
                        <div className="space-y-2">
                          {sv.comments.map((c) => (
                            <div
                              key={c.id}
                              className="bg-zinc-50 p-2 rounded border border-zinc-100 text-[11px] text-zinc-700"
                            >
                              "{c.text}"
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                      <CheckCircle2 className="h-10 w-10 text-zinc-300 mb-2" />
                      <p className="text-sm font-semibold text-zinc-700">Aguardando Coleta</p>
                      <p className="text-xs text-zinc-500 mt-1 mb-4">
                        Esta pesquisa será disparada no {sv.triggerBimester}.
                      </p>
                      <Button variant="secondary" size="sm" onClick={() => handleSendNow(sv.id)}>
                        <Send className="w-3.5 h-3.5 mr-2" /> Forçar Disparo Agora
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new">
          <Card className="max-w-2xl border-zinc-200 shadow-sm bg-white">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle className="text-lg">Configurar Automação NPS</CardTitle>
              <CardDescription>
                Crie uma nova pesquisa e defina quando ela deve ser enviada.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="space-y-2">
                  <Label>Título da Pesquisa</Label>
                  <Input name="title" required placeholder="Ex: Pesquisa de Qualidade de Ensino" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Público-Alvo</Label>
                    <Select name="target" required defaultValue="Ambos">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alunos">Apenas Alunos</SelectItem>
                        <SelectItem value="Responsáveis">Apenas Responsáveis</SelectItem>
                        <SelectItem value="Ambos">Alunos e Responsáveis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gatilho de Disparo (Automático)</Label>
                    <Select name="bimester" required defaultValue="Fim do 1º Bimestre">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fim do 1º Bimestre">Fim do 1º Bimestre</SelectItem>
                        <SelectItem value="Fim do 2º Bimestre">Fim do 2º Bimestre</SelectItem>
                        <SelectItem value="Fim do 3º Bimestre">Fim do 3º Bimestre</SelectItem>
                        <SelectItem value="Fim do 4º Bimestre">Fim do 4º Bimestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-xs text-blue-800">
                  <strong>Nota:</strong> A pesquisa padrão NPS será enviada com a pergunta de escala
                  (0-10) e uma caixa de texto aberta para justificativa.
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Salvar Pesquisa e Ativar Automação
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
