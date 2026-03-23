import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/contexts/AppContext'
import { useToast } from '@/hooks/use-toast'

export function TurmaForm({ onCancel, initialData }: { onCancel: () => void; initialData?: any }) {
  const { addClass, updateClass } = useAppStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const payload = {
      name: fd.get('name') as string,
      course: fd.get('course') as string,
      semester: fd.get('semester') as string,
      capacity: Number(fd.get('capacity')),
      room: fd.get('room') as string,
      year: fd.get('year') as string,
      shift: fd.get('shift') as string,
    }

    if (initialData) {
      updateClass(initialData.id, payload)
      toast({ title: 'Turma Atualizada', description: 'Dados alterados com sucesso.' })
    } else {
      addClass({ ...payload, id: `T${Math.floor(Math.random() * 1000)}` })
      toast({ title: 'Turma Cadastrada', description: 'Nova turma disponível para matrículas.' })
    }

    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nome/Identificador da Turma</Label>
          <Input
            required
            name="name"
            defaultValue={initialData?.name}
            placeholder="Ex: ENG-T01"
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Curso Vinculado</Label>
          <Input
            required
            name="course"
            defaultValue={initialData?.course}
            placeholder="Ex: Engenharia de Software"
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Ano Letivo</Label>
          <Input
            required
            name="year"
            defaultValue={initialData?.year || new Date().getFullYear()}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Semestre / Período</Label>
          <Input
            required
            name="semester"
            defaultValue={initialData?.semester || '1º Semestre'}
            placeholder="Ex: 1º Semestre"
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Capacidade Máxima (Alunos)</Label>
          <Input
            required
            type="number"
            name="capacity"
            defaultValue={initialData?.capacity || 40}
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Sala Padrão</Label>
          <Input
            name="room"
            defaultValue={initialData?.room}
            placeholder="Ex: Sala 101, Bloco B"
            className="bg-muted/50"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          {initialData ? 'Salvar Alterações' : 'Cadastrar Turma'}
        </Button>
      </div>
    </form>
  )
}
