import { useState, useMemo } from 'react'
import { useAppStore } from '@/contexts/AppContext'
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
import { useToast } from '@/hooks/use-toast'
import { Save } from 'lucide-react'

export function LancarFrequenciaForm({ onCancel }: { onCancel: () => void }) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className={`h-10 text-sm bg-zinc-50 ${errors.turma ? 'border-rose-500' : ''}`}
            >
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
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
            Disciplina
          </Label>
          <Select value={disciplina} onValueChange={setDisciplina} disabled={!turma}>
            <SelectTrigger
              className={`h-10 text-sm bg-zinc-50 ${errors.disciplina ? 'border-rose-500' : ''}`}
            >
              <SelectValue
                placeholder={turma ? 'Selecione a disciplina' : 'Selecione a turma primeiro'}
              />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>
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
            Aluno
          </Label>
          <Select value={aluno} onValueChange={setAluno} disabled={!turma}>
            <SelectTrigger
              className={`h-10 text-sm bg-zinc-50 ${errors.aluno ? 'border-rose-500' : ''}`}
            >
              <SelectValue
                placeholder={turma ? 'Selecione o aluno' : 'Selecione a turma primeiro'}
              />
            </SelectTrigger>
            <SelectContent>
              {filteredStudents.map((s) => (
                <SelectItem key={s.id} value={s.id}>
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
            Data de Lançamento
          </Label>
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={`h-10 text-sm bg-zinc-50 ${errors.data ? 'border-rose-500' : ''}`}
          />
          {errors.data && <span className="text-[10px] text-rose-500">{errors.data}</span>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-semibold text-zinc-700">Status da Frequência</Label>
          <Select value={frequencia} onValueChange={setFrequencia}>
            <SelectTrigger className="h-10 text-sm bg-zinc-50 font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Presente" className="font-medium text-emerald-700">
                Presente
              </SelectItem>
              <SelectItem value="Falta" className="font-medium text-rose-600">
                Falta
              </SelectItem>
              <SelectItem value="Falta Justificada" className="font-medium text-amber-600">
                Falta Justificada
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button variant="outline" type="button" onClick={onCancel} className="h-10 px-4">
          Cancelar
        </Button>
        <Button type="submit" className="h-10 px-4 shadow-sm">
          <Save className="h-4 w-4 mr-2" /> Salvar Registro
        </Button>
      </div>
    </form>
  )
}
