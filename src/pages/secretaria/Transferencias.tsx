import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ArrowRight } from 'lucide-react'

export default function Transferencias() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || 'trocar-aluno-curso'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transferências Internas</h1>
        <p className="text-muted-foreground">
          Realize a migração rápida de alunos entre turmas e cursos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="trocar-aluno-curso">Trocar Aluno de Curso</TabsTrigger>
          <TabsTrigger value="trocar-aluno-turma">Trocar Aluno de Turma</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'trocar-aluno-curso'
              ? 'Transferência de Curso'
              : 'Remanejamento de Turma'}
          </CardTitle>
          <CardDescription>
            O histórico letivo será migrado ou encerrado dependendo da configuração da instituição.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar Aluno</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Matrícula ou Nome..." className="pl-8" />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/20">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold">Origem Atual</p>
              <p className="font-medium">
                {activeTab === 'trocar-aluno-curso' ? 'Engenharia Civil' : 'Turma A - 1º Semestre'}
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold">Novo Destino</p>
              <Select>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Selecione o destino..." />
                </SelectTrigger>
                <SelectContent>
                  {activeTab === 'trocar-aluno-curso' ? (
                    <>
                      <SelectItem value="c1">Engenharia de Software</SelectItem>
                      <SelectItem value="c2">Ciência da Computação</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="t1">Turma B - 1º Semestre</SelectItem>
                      <SelectItem value="t2">Turma C - 1º Semestre</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full">Confirmar Transferência</Button>
        </CardContent>
      </Card>
    </div>
  )
}
