import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { Search, Filter, Eye } from 'lucide-react'

const CONFIG: Record<string, { title: string; cols: string[]; data: string[][] }> = {
  'consultar-aluno': {
    title: 'Consulta de Alunos',
    cols: ['Matrícula', 'Nome Completo', 'CPF', 'Curso Atual', 'Status'],
    data: [
      ['2023001', 'Ana Silva Costa', '111.222.333-44', 'Engenharia Civil', 'Ativo'],
      ['2023002', 'Carlos Mendes Souza', '555.666.777-88', 'Direito', 'Inativo'],
    ],
  },
  'consultar-curso': {
    title: 'Consulta de Cursos',
    cols: ['Código', 'Nome do Curso', 'Turno', 'Vagas Abertas', 'Coordenador'],
    data: [
      ['C-01', 'Engenharia Civil', 'Integral', '40', 'Prof. Roberto'],
      ['C-02', 'Direito', 'Noturno', '60', 'Profa. Angela'],
    ],
  },
  'consultar-horario-curso': {
    title: 'Consulta de Horários por Curso',
    cols: ['Curso', 'Turma', 'Dia', 'Horário', 'Disciplina'],
    data: [
      ['Eng. Civil', 'T1-2024', 'Segunda', '08:00 - 09:40', 'Cálculo I'],
      ['Direito', 'T3-2024', 'Terça', '19:00 - 20:40', 'Direito Penal'],
    ],
  },
  'consultar-horario-prof': {
    title: 'Consulta de Horários por Professor',
    cols: ['Professor', 'Dia', 'Horário', 'Disciplina', 'Turma'],
    data: [
      ['Prof. Roberto', 'Segunda', '08:00 - 09:40', 'Cálculo I', 'T1-2024'],
      ['Profa. Angela', 'Terça', '19:00 - 20:40', 'Direito Penal', 'T3-2024'],
    ],
  },
  'consultar-matricula': {
    title: 'Consulta de Matrículas Ativas',
    cols: ['Protocolo', 'Aluno', 'Data Vínculo', 'Plano Pgto.', 'Situação'],
    data: [
      ['PRT-9912', 'Ana Silva Costa', '10/01/2023', 'Bolsa 50%', 'Regular'],
      ['PRT-9913', 'Carlos Mendes Souza', '12/01/2023', 'Integral', 'Inadimplente'],
    ],
  },
  'consultar-responsavel': {
    title: 'Consulta de Responsáveis Financeiros',
    cols: ['CPF Responsável', 'Nome do Responsável', 'Aluno Vinculado', 'Contato'],
    data: [
      ['000.111.222-33', 'Marcos Silva Costa', 'Ana Silva Costa', '(11) 98888-7777'],
      ['444.555.666-77', 'Teresa Mendes', 'Carlos Mendes Souza', '(11) 97777-6666'],
    ],
  },
}

export default function Consultas() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split('/').pop() || 'consultar-aluno'

  const currentConfig = CONFIG[activeTab] || CONFIG['consultar-aluno']

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Módulo de Consultas</h1>
        <p className="text-muted-foreground">
          Acesse dados de alta densidade da secretaria com filtros rápidos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/secretaria/${v}`)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {Object.keys(CONFIG).map((key) => (
            <TabsTrigger key={key} value={key}>
              {CONFIG[key].title.replace('Consulta de ', '').replace('Consultar ', '')}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>{currentConfig.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar registros..." className="pl-8" />
            </div>
            <Select defaultValue="todos">
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativos">Ativos</SelectItem>
                <SelectItem value="inativos">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary">Aplicar Filtros</Button>
          </div>

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  {currentConfig.cols.map((col, idx) => (
                    <TableHead key={idx} className="whitespace-nowrap">
                      {col}
                    </TableHead>
                  ))}
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentConfig.data.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <TableCell key={cellIdx} className="whitespace-nowrap font-medium">
                        {cell}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
