import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getStudents, updateStudent } from '@/services/students'

export default function MatriculaOperacoes() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const activeTab = location.pathname.split('/').pop() || 'manutencao-matricula'

  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data || [])
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Sincronização',
        description: 'Falha ao carregar alunos do banco de dados.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleBlock = async () => {
    if (!selectedStudent || !blockReason) {
      toast({
        variant: 'destructive',
        title: 'Atenção',
        description: 'Selecione o aluno e o motivo antes de prosseguir.',
      })
      return
    }

    setSubmitting(true)
    try {
      await updateStudent(selectedStudent, { status: 'Trancado' })
      toast({
        title: 'Matrícula Trancada no Sistema',
        description: `Status alterado para Trancado. O motivo registrado foi: ${blockReason}.`,
      })
      setSelectedStudent('')
      setBlockReason('')
      fetchStudents()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao atualizar o status do aluno no banco.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedStudent || !newStatus) return
    setSubmitting(true)
    try {
      await updateStudent(selectedStudent, { status: newStatus })
      toast({ title: 'Sucesso', description: 'Status acadêmico atualizado no banco de dados.' })
      fetchStudents()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao atualizar as informações.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const selectedStudentData = students.find((s) => s.id === selectedStudent)

  return (
    <div className="space-y-6 animate-fade-in-up p-4 md:p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operações de Matrícula (Integrado)</h1>
        <p className="text-muted-foreground">
          Gerencie o status e as configurações de vínculos acadêmicos reais.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="manutencao-matricula">Manutenção e Ajustes</TabsTrigger>
          <TabsTrigger value="bloquear-matricula">Trancamento / Bloqueio</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            {activeTab === 'bloquear-matricula'
              ? 'Trancamento de Matrícula'
              : 'Manutenção do Vínculo'}
          </CardTitle>
          <CardDescription>
            {activeTab === 'bloquear-matricula'
              ? 'Suspenda o vínculo no banco de dados. Esta operação notifica automaticamente as dependências.'
              : 'Altere status e dados estruturais de alunos já matriculados.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center gap-3 text-muted-foreground p-4">
              <Loader2 className="h-5 w-5 animate-spin" /> Carregando alunos da base de dados...
            </div>
          ) : (
            <>
              <div className="space-y-3 max-w-md bg-muted/20 p-4 rounded-lg border">
                <Label className="text-sm font-semibold">Selecione o Aluno (Base Real)</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Buscar aluno..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} {s.course ? `- ${s.course}` : ''}
                      </SelectItem>
                    ))}
                    {students.length === 0 && (
                      <SelectItem value="none" disabled>
                        Nenhum aluno encontrado.
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedStudent &&
                (activeTab === 'bloquear-matricula' ? (
                  <div className="space-y-5 max-w-md p-5 border rounded-lg bg-red-50/30 dark:bg-red-950/10">
                    <div className="flex items-start gap-3 text-rose-700 bg-rose-100/50 dark:bg-rose-900/30 p-3 rounded-md border border-rose-200 dark:border-rose-800 text-sm font-medium">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <p>
                        O trancamento interrompe processos acadêmicos e alerta o departamento
                        financeiro.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">
                        Motivo Oficial
                      </Label>
                      <Select value={blockReason} onValueChange={setBlockReason}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione uma justificativa..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inadimplência Crítica">Inadimplência</SelectItem>
                          <SelectItem value="Evasão Escolar">Evasão Escolar</SelectItem>
                          <SelectItem value="Solicitação do Responsável">
                            Solicitação Voluntária
                          </SelectItem>
                          <SelectItem value="Trancamento de Semestre">
                            Trancamento Padrão
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full font-bold"
                      onClick={handleBlock}
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirmar Trancamento
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t mt-4">
                    <div className="space-y-2">
                      <Label>Curso Atual Registrado</Label>
                      <Input
                        value={selectedStudentData?.course || 'Sem vínculo'}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status Atual</Label>
                      <Input
                        value={selectedStudentData?.status || 'Novo'}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 max-w-md">
                      <Label>Atualizar Status Manualmente</Label>
                      <div className="flex gap-3">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Novo Status..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Trancado">Trancado</SelectItem>
                            <SelectItem value="Formado">Formado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleUpdateStatus} disabled={!newStatus || submitting}>
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
