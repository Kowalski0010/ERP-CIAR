import { useState } from 'react'
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

export function EditarAlunoForm({ onCancel }: { onCancel: () => void }) {
  const { students, updateStudent } = useAppStore()
  const { toast } = useToast()
  const [selectedId, setSelectedId] = useState('')

  const student = students.find((s) => s.id === selectedId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedId) return
    const fd = new FormData(e.currentTarget)
    updateStudent(selectedId, {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
    })
    toast({
      title: 'Perfil Atualizado',
      description: 'Os dados cadastrais do aluno foram modificados com sucesso.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Selecionar Aluno</Label>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="h-10 text-sm bg-zinc-50 border-zinc-200">
            <SelectValue placeholder="Selecione um aluno para editar..." />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} ({s.cpf})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {student && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-semibold text-zinc-700">Nome Completo</Label>
            <Input
              name="name"
              defaultValue={student.name}
              className="h-10 text-sm bg-zinc-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-700">E-mail Principal</Label>
            <Input
              name="email"
              type="email"
              defaultValue={student.email}
              className="h-10 text-sm bg-zinc-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-700">Telefone / Celular</Label>
            <Input name="phone" defaultValue={student.phone} className="h-10 text-sm bg-zinc-50" />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button variant="outline" type="button" onClick={onCancel} className="h-10 px-4">
          Cancelar
        </Button>
        <Button type="submit" disabled={!student} className="h-10 px-4 shadow-sm">
          <Save className="h-4 w-4 mr-2" /> Salvar Alterações
        </Button>
      </div>
    </form>
  )
}

export function TrocarTurmaForm({ onCancel }: { onCancel: () => void }) {
  const { students, classes, updateStudent } = useAppStore()
  const { toast } = useToast()
  const [selectedId, setSelectedId] = useState('')
  const [newClass, setNewClass] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || !newClass) return
    const cls = classes.find((c) => c.id === newClass)
    if (cls) {
      updateStudent(selectedId, { course: cls.course })
      toast({ title: 'Turma Atualizada', description: 'Aluno movido para nova turma no sistema.' })
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Aluno</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="h-10 text-sm bg-zinc-50">
              <SelectValue placeholder="Selecione o aluno" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Nova Turma de Destino</Label>
          <Select value={newClass} onValueChange={setNewClass}>
            <SelectTrigger className="h-10 text-sm bg-zinc-50">
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
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button variant="outline" type="button" onClick={onCancel} className="h-10 px-4">
          Cancelar
        </Button>
        <Button type="submit" disabled={!selectedId || !newClass} className="h-10 px-4 shadow-sm">
          <Save className="h-4 w-4 mr-2" /> Efetivar Troca
        </Button>
      </div>
    </form>
  )
}
