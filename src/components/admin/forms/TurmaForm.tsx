import { useState, useEffect } from 'react'
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
import { ClassRoom } from '@/lib/types'

export function TurmaForm({
  onCancel,
  initialData,
}: {
  onCancel: () => void
  initialData?: ClassRoom
}) {
  const { addClass, updateClass, cursos } = useAppStore()
  const { toast } = useToast()

  const [courseId, setCourseId] = useState(initialData?.course || '')
  const [shift, setShift] = useState(initialData?.shift || '')

  useEffect(() => {
    if (initialData) {
      setCourseId(cursos.find((c) => c.name === initialData.course)?.id || 'eng')
      setShift(initialData.shift || 'Matutino')
    }
  }, [initialData, cursos])

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const code = fd.get('code') as string
    const selectedCourse = cursos.find((c) => c.id === courseId)?.name || 'Curso Genérico'

    const classData = {
      name: code,
      course: selectedCourse,
      semester: `${fd.get('year')} - ${shift}`,
      capacity: Number(fd.get('capacity')),
      year: fd.get('year') as string,
      shift: shift,
      room: fd.get('room') as string,
    }

    if (initialData) {
      updateClass(initialData.id, classData)
      toast({
        title: 'Turma Atualizada',
        description: 'As informações da turma foram editadas e salvas com sucesso.',
      })
    } else {
      addClass({
        id: code.split(' ')[0],
        ...classData,
      })
      toast({
        title: 'Turma Salva',
        description: 'A nova turma foi persistida e está disponível para matrículas.',
      })
    }

    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Nome da Turma</Label>
        <Input
          name="code"
          required
          defaultValue={initialData?.name}
          placeholder="Ex: T01 - Engenharia de Software"
          className="bg-zinc-50 font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Curso Associado</Label>
          <Select required value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione o curso..." />
            </SelectTrigger>
            <SelectContent>
              {cursos.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
              {cursos.length === 0 && <SelectItem value="eng">Engenharia de Software</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Período / Turno</Label>
          <Select required value={shift} onValueChange={setShift}>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione o turno..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Matutino">Matutino</SelectItem>
              <SelectItem value="Vespertino">Vespertino</SelectItem>
              <SelectItem value="Noturno">Noturno</SelectItem>
              <SelectItem value="Integral">Integral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Ano Letivo</Label>
          <Input
            name="year"
            required
            defaultValue={initialData?.year || new Date().getFullYear().toString()}
            className="bg-zinc-50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Sala / Laboratório</Label>
          <Input
            name="room"
            required
            defaultValue={initialData?.room || ''}
            placeholder="Ex: Sala 102, Lab Info..."
            className="bg-zinc-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Capacidade Máxima de Alunos</Label>
        <Input
          name="capacity"
          type="number"
          required
          defaultValue={initialData?.capacity}
          placeholder="Ex: 40"
          className="bg-zinc-50 w-full sm:w-48"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          {initialData ? 'Salvar Edição' : 'Abrir Nova Turma'}
        </Button>
      </div>
    </form>
  )
}
