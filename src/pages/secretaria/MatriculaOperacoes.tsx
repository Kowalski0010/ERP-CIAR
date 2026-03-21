import { useState } from 'react'
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
import { Search, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'

export default function MatriculaOperacoes() {
  const location = useLocation()
  const navigate = useNavigate()
  const { students, suspendStudent } = useAppStore()
  const { toast } = useToast()

  const activeTab = location.pathname.split('/').pop() || 'manutencao-matricula'

  const [selectedStudent, setSelectedStudent] = useState('')
  const [blockReason, setBlockReason] = useState('')

  const handleBlock = () => {
    if (!selectedStudent || !blockReason) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Selecione o aluno e o motivo.' })
      return
    }

    suspendStudent(selectedStudent, blockReason)

    toast({
      title: 'Matrícula Trancada com Sucesso',
      description: 'O fluxo de notificação ao módulo Financeiro foi disparado automaticamente.',
    })

    setSelectedStudent('')
    setBlockReason('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operações de Matrícula</h1>
        <p className="text-muted-foreground">
          Gerencie o status e configurações de matrículas ativas.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="manutencao-matricula">Manutenção Matrícula</TabsTrigger>
          <TabsTrigger value="bloquear-matricula">Bloquear/Trancar Matrícula</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'bloquear-matricula'
              ? 'Bloqueio de Matrícula'
              : 'Manutenção de Matrícula'}
          </CardTitle>
          <CardDescription>
            {activeTab === 'bloquear-matricula'
              ? 'Interrompa temporária ou permanentemente o vínculo do aluno. Esta ação alerta o departamento financeiro.'
              : 'Ajuste os dados acadêmicos e financeiros do vínculo atual.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium">Buscar Aluno</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o aluno..." />
              </SelectTrigger>
              <SelectContent>
                {students
                  .filter((s) => s.status === 'Ativo')
                  .map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} - {s.cpf}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {activeTab === 'bloquear-matricula' ? (
            <div className="space-y-4 max-w-md p-4 border rounded-md bg-muted/30">
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-2 rounded-md border border-rose-200 text-xs font-semibold mb-4">
                <AlertTriangle className="h-4 w-4" />
                Um alerta será gerado para o Financeiro avaliar pendências.
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-destructive">Motivo do Bloqueio</label>
                <Select value={blockReason} onValueChange={setBlockReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um motivo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inadimplência Crítica">Inadimplência</SelectItem>
                    <SelectItem value="Evasão Escolar">Evasão Escolar</SelectItem>
                    <SelectItem value="Solicitação do Responsável">
                      Solicitação do Responsável
                    </SelectItem>
                    <SelectItem value="Afastamento Disciplinar">Afastamento Disciplinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="destructive" className="w-full" onClick={handleBlock}>
                Efetivar Trancamento
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Curso Atual</label>
                <Input value="Engenharia de Software" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Novo Status</label>
                <Select defaultValue="ativo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="trancado">Trancado</SelectItem>
                    <SelectItem value="formado">Formado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Plano Financeiro</label>
                <Select defaultValue="padrao">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">Mensalidade Padrão</SelectItem>
                    <SelectItem value="bolsa50">Bolsista (50%)</SelectItem>
                    <SelectItem value="bolsa100">Bolsista Integral (100%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 sm:col-span-2 pt-2">
                <Button>Salvar Alterações</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
