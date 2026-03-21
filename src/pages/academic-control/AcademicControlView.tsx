import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { BookOpen, Search, Filter, Plus, Save, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'

function LancarFrequenciaForm({ onCancel }: { onCancel: () => void }) {
  const { classes, students, schedules } = useAppStore()
  const { toast } = useToast()

  const [turma, setTurma] = useState('')
  const [aluno, setAluno] = useState('')
  const [data, setData] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [frequencia, setFrequencia] = useState('Presente')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredStudents = useMemo(() => {
    const selectedClass = classes.find((c) => c.id === turma)
    if (!selectedClass) return students
    return students.filter((s) => s.course.includes(selectedClass.course))
  }, [turma, classes, students])

  const subjects = useMemo(() => {
    if (!turma) return []
    const classSchedules = schedules.filter((s) => s.classId === turma)
    const unique = Array.from(new Set(classSchedules.map((s) => s.subject)))
    return unique.length > 0 ? unique : ['Disciplina Padrão']
  }, [turma, schedules])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!turma) newErrors.turma = 'Selecione uma turma'
    if (!aluno) newErrors.aluno = 'Selecione um aluno'
    if (!data) newErrors.data = 'Informe a data'
    if (!disciplina) newErrors.disciplina = 'Selecione a disciplina'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    toast({
      title: 'Frequência Registrada',
      description: `Status '${frequencia}' salvo para o aluno na data ${new Date(data).toLocaleDateString('pt-BR')}.`,
    })

    setAluno('')
    setData('')
    setFrequencia('Presente')
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            className={`text-xs font-semibold ${errors.turma ? 'text-rose-500' : 'text-zinc-700'}`}
          >
            Turma (Class)
          </Label>
          <Select
            value={turma}
            onValueChange={(v) => {
              setTurma(v)
              setAluno('')
              setDisciplina('')
            }}
          >
            <SelectTrigger
              className={`h-9 text-xs bg-zinc-50 ${errors.turma ? 'border-rose-500' : ''}`}
            >
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.turma && <span className="text-[10px] text-rose-500">{errors.turma}</span>}
        </div>

        <div className="space-y-2">
          <Label
            className={`text-xs font-semibold ${errors.disciplina ? 'text-rose-500' : 'text-zinc-700'}`}
          >
            Disciplina (Discipline)
          </Label>
          <Select value={disciplina} onValueChange={setDisciplina} disabled={!turma}>
            <SelectTrigger
              className={`h-9 text-xs bg-zinc-50 ${errors.disciplina ? 'border-rose-500' : ''}`}
            >
              <SelectValue
                placeholder={turma ? 'Selecione a disciplina' : 'Selecione a turma primeiro'}
              />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.disciplina && (
            <span className="text-[10px] text-rose-500">{errors.disciplina}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label
            className={`text-xs font-semibold ${errors.aluno ? 'text-rose-500' : 'text-zinc-700'}`}
          >
            Aluno (Student)
          </Label>
          <Select value={aluno} onValueChange={setAluno} disabled={!turma}>
            <SelectTrigger
              className={`h-9 text-xs bg-zinc-50 ${errors.aluno ? 'border-rose-500' : ''}`}
            >
              <SelectValue
                placeholder={turma ? 'Selecione o aluno' : 'Selecione a turma primeiro'}
              />
            </SelectTrigger>
            <SelectContent>
              {filteredStudents.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-xs">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.aluno && <span className="text-[10px] text-rose-500">{errors.aluno}</span>}
        </div>

        <div className="space-y-2">
          <Label
            className={`text-xs font-semibold ${errors.data ? 'text-rose-500' : 'text-zinc-700'}`}
          >
            Data (Date)
          </Label>
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={`h-9 text-xs bg-zinc-50 ${errors.data ? 'border-rose-500' : ''}`}
          />
          {errors.data && <span className="text-[10px] text-rose-500">{errors.data}</span>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-semibold text-zinc-700">Status da Frequência</Label>
          <Select value={frequencia} onValueChange={setFrequencia}>
            <SelectTrigger className="h-9 text-xs bg-zinc-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Presente" className="text-xs">
                Presente
              </SelectItem>
              <SelectItem value="Falta" className="text-xs text-rose-600 font-medium">
                Falta
              </SelectItem>
              <SelectItem value="Falta Justificada" className="text-xs text-amber-600 font-medium">
                Falta Justificada
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button variant="outline" type="button" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          <Save className="h-4 w-4 mr-2" /> Salvar Registro
        </Button>
      </div>
    </form>
  )
}

export default function AcademicControlView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const title = id
    ? id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Módulo Acadêmico'
  const isForm = id?.startsWith('lancar-')

  const mockData = Array.from({ length: 6 }).map((_, i) => ({
    id: `REQ-${Math.floor(Math.random() * 10000)}`,
    ref: `Aluno/Docente ${i + 1}`,
    desc: `${title} - Registro #00${i + 1}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('pt-BR'),
    status: ['Pendente', 'Processado', 'Aprovado'][Math.floor(Math.random() * 3)],
  }))

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 -ml-1 text-zinc-500" asChild>
              <Link to="/">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 text-[10px]">
              Controle Acadêmico
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-zinc-400" />
            {title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerenciamento de registros e processos acadêmicos integrados.
          </p>
        </div>
        {!isForm && (
          <Button className="shadow-sm h-9 px-4">
            <Plus className="mr-2 h-4 w-4" /> Novo Registro
          </Button>
        )}
      </div>

      {isForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-zinc-200">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
              <CardTitle className="text-sm font-semibold">
                {id === 'lancar-frequencia' ? 'Registro de Frequência' : 'Formulário de Lançamento'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {id === 'lancar-frequencia' ? (
                <LancarFrequenciaForm onCancel={() => navigate(-1)} />
              ) : (
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-zinc-700">Aluno/Turma</Label>
                      <Input placeholder="Buscar entidade..." className="text-xs h-9 bg-zinc-50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-zinc-700">
                        Data de Referência
                      </Label>
                      <Input type="date" className="text-xs h-9 bg-zinc-50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-semibold text-zinc-700">
                        Observações/Valores
                      </Label>
                      <textarea
                        className="w-full min-h-[100px] p-3 text-xs rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50 resize-none"
                        placeholder="Detalhes complementares do lançamento..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <Button className="shadow-sm" type="button" onClick={() => navigate(-1)}>
                      <Save className="h-4 w-4 mr-2" /> Efetivar Lançamento
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-sm border-zinc-200 bg-zinc-50/30">
            <CardHeader className="border-b border-zinc-100 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Últimos Lançamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {mockData.slice(0, 4).map((d) => (
                  <div key={d.id} className="p-3 hover:bg-zinc-100 transition-colors text-xs">
                    <div className="flex justify-between font-semibold text-zinc-900 mb-1">
                      <span>{d.ref}</span>
                      <span className="text-zinc-500 font-normal">{d.date}</span>
                    </div>
                    <p className="text-zinc-600 truncate">{d.desc}</p>
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
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar registros..."
                className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 shrink-0 text-xs">
              <Filter className="h-4 w-4 mr-2" /> Filtros Avançados
            </Button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <Table className="table-compact">
              <TableHeader className="bg-zinc-50/50">
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
                    <TableCell className="font-mono text-xs text-zinc-500">{row.id}</TableCell>
                    <TableCell className="font-semibold text-zinc-900 text-xs">{row.ref}</TableCell>
                    <TableCell className="text-xs text-zinc-600">{row.desc}</TableCell>
                    <TableCell className="text-xs text-zinc-600">{row.date}</TableCell>
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
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium">
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
