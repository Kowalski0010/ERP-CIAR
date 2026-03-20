import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

export default function TurmasHorarios() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || 'cadastrar-horario'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Turmas e Horários</h1>
        <p className="text-muted-foreground">
          Gerencie horários, compartilhamento e divisão de turmas acadêmicas.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="cadastrar-horario">Cadastrar Horário</TabsTrigger>
          <TabsTrigger value="compartilhar-turma">Compartilhar Turma</TabsTrigger>
          <TabsTrigger value="dividir-turma">Dividir Turma</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'cadastrar-horario' && 'Novo Quadro de Horários'}
            {activeTab === 'compartilhar-turma' && 'Compartilhar Turma Física'}
            {activeTab === 'dividir-turma' && 'Divisão de Turmas'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'cadastrar-horario' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dia da Semana</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seg">Segunda-feira</SelectItem>
                    <SelectItem value="ter">Terça-feira</SelectItem>
                    <SelectItem value="qua">Quarta-feira</SelectItem>
                    <SelectItem value="qui">Quinta-feira</SelectItem>
                    <SelectItem value="sex">Sexta-feira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário Início/Fim</label>
                <div className="flex items-center gap-2">
                  <Input type="time" defaultValue="08:00" />
                  <span>-</span>
                  <Input type="time" defaultValue="09:40" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disciplina</label>
                <Input placeholder="Ex: Cálculo I" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professor Associado</label>
                <Input placeholder="Nome do docente" />
              </div>
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 pt-4">
                <Button>Adicionar ao Quadro</Button>
              </div>
            </div>
          )}

          {activeTab === 'compartilhar-turma' && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Turma Principal (Origem)</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t1">Engenharia - Turma A (Noturno)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Turma Secundária (Destino)</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t2">Física - Turma B (Noturno)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Efetivar Compartilhamento</Button>
            </div>
          )}

          {activeTab === 'dividir-turma' && (
            <div className="space-y-4">
              <div className="flex gap-4 max-w-md">
                <Input placeholder="Código da Turma Original..." />
                <Button variant="secondary">Carregar Alunos</Button>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome do Aluno</TableHead>
                      <TableHead>Situação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>2023101</TableCell>
                      <TableCell>João Silva Martins</TableCell>
                      <TableCell>Ativo</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>2023102</TableCell>
                      <TableCell>Maria Fernanda Souza</TableCell>
                      <TableCell>Ativo</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex gap-4 max-w-md items-end pt-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Código da Nova Turma</label>
                  <Input placeholder="Ex: TURMA-B-2024" />
                </div>
                <Button>Mover Selecionados</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
