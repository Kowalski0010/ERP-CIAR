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
import { Search } from 'lucide-react'

export default function MatriculaOperacoes() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || 'manutencao-matricula'

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
          <TabsTrigger value="bloquear-matricula">Bloquear Matrícula</TabsTrigger>
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
              ? 'Interrompa temporária ou permanentemente o vínculo do aluno.'
              : 'Ajuste os dados acadêmicos e financeiros do vínculo atual.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-md">
            <label className="text-sm font-medium">Buscar Aluno</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Matrícula, CPF ou Nome..." className="pl-8" />
            </div>
          </div>

          {activeTab === 'bloquear-matricula' ? (
            <div className="space-y-4 max-w-md p-4 border rounded-md bg-muted/30">
              <div className="space-y-2">
                <label className="text-sm font-medium text-destructive">Motivo do Bloqueio</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um motivo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inadimplencia">Inadimplência</SelectItem>
                    <SelectItem value="evasao">Evasão Escolar</SelectItem>
                    <SelectItem value="solicitacao">Solicitação do Responsável</SelectItem>
                    <SelectItem value="disciplinar">Afastamento Disciplinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <Input placeholder="Detalhes adicionais do bloqueio..." />
              </div>
              <Button variant="destructive" className="w-full">
                Efetivar Bloqueio
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
