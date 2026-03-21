import { useParams, Link, useNavigate } from 'react-router-dom'
import { BookOpen, Search, Filter, Plus, Save, ChevronLeft, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

import { EditarAlunoForm, TrocarTurmaForm } from '@/components/academic-control/StudentForms'
import {
  VincularDisciplinaForm,
  AlocarProfessorForm,
  LancarNotasForm,
} from '@/components/academic-control/ClassForms'
import { LancarFrequenciaForm } from '@/components/academic-control/LancarFrequenciaForm'

export default function AcademicControlView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const formatTitle = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace('Tcc', 'TCC')
  }

  const title = id ? formatTitle(id) : 'Módulo Acadêmico'

  // Check if it's a known form view
  const knownForms = [
    'editar-aluno',
    'trocar-turma',
    'vincular-disciplina',
    'alocar-professor',
    'lancar-notas',
    'lancar-frequencia',
  ]
  const isForm = id && (id.startsWith('lancar-') || knownForms.includes(id))

  const mockData = Array.from({ length: 6 }).map((_, i) => ({
    id: `REQ-${Math.floor(Math.random() * 10000)}`,
    ref: `Aluno/Docente ${i + 1}`,
    desc: `${title} - Registro #00${i + 1}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('pt-BR'),
    status: ['Pendente', 'Processado', 'Aprovado'][Math.floor(Math.random() * 3)],
  }))

  const renderForm = () => {
    const props = { onCancel: () => navigate(-1) }

    switch (id) {
      case 'editar-aluno':
        return <EditarAlunoForm {...props} />
      case 'trocar-turma':
        return <TrocarTurmaForm {...props} />
      case 'vincular-disciplina':
        return <VincularDisciplinaForm {...props} />
      case 'alocar-professor':
        return <AlocarProfessorForm {...props} />
      case 'lancar-notas':
        return <LancarNotasForm {...props} />
      case 'lancar-frequencia':
        return <LancarFrequenciaForm {...props} />
      default:
        return (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Aluno/Turma</label>
                <Input placeholder="Buscar entidade..." className="text-sm h-10 bg-zinc-50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700">Data de Referência</label>
                <Input type="date" className="text-sm h-10 bg-zinc-50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-zinc-700">Observações/Valores</label>
                <textarea
                  className="w-full min-h-[100px] p-3 text-sm rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50 resize-none"
                  placeholder="Detalhes complementares do lançamento..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
              <Button
                variant="outline"
                className="h-10 px-4"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button className="shadow-sm h-10 px-4" type="button" onClick={() => navigate(-1)}>
                <Save className="h-4 w-4 mr-2" /> Efetivar Lançamento
              </Button>
            </div>
          </form>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -ml-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              asChild
            >
              <Link to="/">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Badge
              variant="secondary"
              className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-widest border border-zinc-200"
            >
              Controle Acadêmico
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-zinc-400" />
            {title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerenciamento de registros e processos acadêmicos integrados.
          </p>
        </div>
        {!isForm && (
          <Button className="shadow-sm h-10 px-4 font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Novo Registro
          </Button>
        )}
      </div>

      {isForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-zinc-200 bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
              <CardTitle className="text-base font-semibold text-zinc-800">
                Formulário de Execução
              </CardTitle>
              <CardDescription className="text-xs">
                Preencha os campos abaixo para processar a solicitação de {title}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">{renderForm()}</CardContent>
          </Card>

          <Card className="shadow-sm border-zinc-200 bg-zinc-50/30 h-fit">
            <CardHeader className="border-b border-zinc-100 py-4 bg-zinc-50">
              <CardTitle className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" /> Últimos Registros
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {mockData.slice(0, 4).map((d) => (
                  <div key={d.id} className="p-4 hover:bg-zinc-100 transition-colors bg-white">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-semibold text-zinc-900 text-xs">{d.ref}</span>
                      <span className="text-[10px] text-zinc-500 font-mono bg-zinc-100 px-1.5 py-0.5 rounded">
                        {d.date}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">{d.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar registros e protocolos..."
                className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus-visible:border-zinc-300 w-full text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 shrink-0 text-xs font-semibold w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" /> Filtros Avançados
            </Button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="table-compact min-w-[700px]">
                <TableHeader className="bg-zinc-50/80">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px]">Protocolo</TableHead>
                    <TableHead className="w-[200px]">Referência</TableHead>
                    <TableHead>Descrição / Detalhe</TableHead>
                    <TableHead className="w-[120px]">Data</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="text-right w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                      <TableCell className="font-mono text-xs text-zinc-500 font-medium">
                        {row.id}
                      </TableCell>
                      <TableCell className="font-semibold text-zinc-900 text-xs">
                        {row.ref}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-600 truncate max-w-[300px]">
                        {row.desc}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">{row.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            row.status === 'Aprovado' || row.status === 'Processado'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-amber-200 bg-amber-50 text-amber-700'
                          }
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Revisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
