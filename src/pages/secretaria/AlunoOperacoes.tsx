import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/contexts/AppContext'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Check, X, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AlunoOperacoes() {
  const location = useLocation()
  const navigate = useNavigate()
  const { students, registerOccurrence } = useAppStore()
  const { toast } = useToast()

  const activeTab = location.pathname.split('/').pop() || 'ocorrencias-aluno'
  const [searchTerm, setSearchTerm] = useState('')
  const [occurrenceText, setOccurrenceText] = useState('')

  // Quick mock search
  const foundStudent =
    students.find(
      (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length > 2,
    ) || students[0]

  const handleSaveOccurrence = () => {
    if (!occurrenceText || !foundStudent) return

    registerOccurrence(foundStudent.id, occurrenceText)
    toast({
      title: 'Ocorrência Registrada',
      description: `Notificação enviada para o responsável de ${foundStudent.name}.`,
    })
    setOccurrenceText('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico e Requerimentos</h1>
        <p className="text-muted-foreground">
          Acompanhe a vida acadêmica e registre ocorrências com notificação automática.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="ocorrencias-aluno">Ocorrências do Aluno</TabsTrigger>
          <TabsTrigger value="requerimentos">Requerimentos Pendentes</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'ocorrencias-aluno'
              ? 'Diário de Ocorrências e Disciplina'
              : 'Gestão de Requerimentos'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'ocorrencias-aluno' && (
            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar Aluno..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {foundStudent && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md">
                  <h3 className="font-semibold text-zinc-900 text-sm mb-4">
                    Aluno Selecionado: {foundStudent.name}
                  </h3>
                  <div className="relative border-l-2 border-zinc-200 ml-3 pl-6 space-y-6">
                    {foundStudent.observations?.map((obs) => (
                      <div key={obs.id} className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white bg-blue-500" />
                        <p className="text-sm font-semibold text-zinc-900">Registro</p>
                        <p className="text-xs text-zinc-500 mb-1">
                          {new Date(obs.date).toLocaleDateString('pt-BR')} - Autor: {obs.author}
                        </p>
                        <p className="text-sm bg-white border border-zinc-200 p-3 rounded-md text-zinc-700">
                          {obs.text}
                        </p>
                      </div>
                    ))}
                    {(!foundStudent.observations || foundStudent.observations.length === 0) && (
                      <p className="text-sm text-zinc-500 italic">Nenhuma ocorrência registrada.</p>
                    )}
                  </div>

                  <div className="space-y-3 pt-6 mt-6 border-t border-zinc-200 max-w-2xl">
                    <label className="text-sm font-semibold flex items-center gap-2 text-zinc-900">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Registrar Nova Ocorrência
                    </label>
                    <p className="text-xs text-zinc-500">
                      O registro criará um log de auditoria e enviará um email automático ao
                      responsável.
                    </p>
                    <Input
                      placeholder="Descrição detalhada do evento ou observação..."
                      className="h-10"
                      value={occurrenceText}
                      onChange={(e) => setOccurrenceText(e.target.value)}
                    />
                    <Button
                      onClick={handleSaveOccurrence}
                      disabled={!occurrenceText}
                      className="shadow-sm"
                    >
                      Salvar e Notificar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requerimentos' && (
            <div className="space-y-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Tipo de Solicitação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Decisão</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">REQ-1092</TableCell>
                      <TableCell>Mariana Costa</TableCell>
                      <TableCell>Revisão de Nota (Cálculo II)</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                          Em Análise
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
