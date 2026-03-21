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
import { Save, Send } from 'lucide-react'

export function VincularDisciplinaForm({ onCancel }: { onCancel: () => void }) {
  const { classes } = useAppStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Disciplina Vinculada',
      description: 'Nova disciplina adicionada à grade curricular da turma com sucesso.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Turma Base</Label>
          <Select required>
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
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Nome da Nova Disciplina</Label>
          <Input
            required
            className="h-10 text-sm bg-zinc-50"
            placeholder="Ex: Engenharia de Requisitos"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button variant="outline" type="button" onClick={onCancel} className="h-10 px-4">
          Cancelar
        </Button>
        <Button type="submit" className="h-10 px-4 shadow-sm">
          <Save className="h-4 w-4 mr-2" /> Vincular à Grade
        </Button>
      </div>
    </form>
  )
}

export function AlocarProfessorForm({ onCancel }: { onCancel: () => void }) {
  const { classes, teachers } = useAppStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Professor Alocado',
      description: 'O docente foi designado como titular da disciplina e turma selecionadas.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Professor (Docente)</Label>
          <Select required>
            <SelectTrigger className="h-10 text-sm bg-zinc-50">
              <SelectValue placeholder="Selecione o professor" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">
            Turma e Disciplina de Destino
          </Label>
          <Select required>
            <SelectTrigger className="h-10 text-sm bg-zinc-50">
              <SelectValue placeholder="Selecione o destino" />
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
        <Button type="submit" className="h-10 px-4 shadow-sm">
          <Save className="h-4 w-4 mr-2" /> Atribuir Docente
        </Button>
      </div>
    </form>
  )
}

export function LancarNotasForm({ onCancel }: { onCancel: () => void }) {
  const { students, addCommunicationLog } = useAppStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCommunicationLog({
      recipient: 'Aluno / Responsável',
      channel: 'Email',
      subject: 'Atualização de Notas e Boletim',
      status: 'Entregue',
      body: 'Uma nova avaliação foi registrada no sistema. Acesse o portal do aluno para visualizar seu boletim detalhado.',
    })
    toast({
      title: 'Notas Registradas',
      description: 'Nota lançada e notificação enviada ao aluno/responsável automaticamente.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-semibold text-zinc-700">Aluno Alvo</Label>
          <Select required>
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
          <Label className="text-xs font-semibold text-zinc-700">Nota da Avaliação</Label>
          <Input
            required
            type="number"
            step="0.1"
            min="0"
            max="10"
            className="h-10 text-sm bg-zinc-50 font-bold"
            placeholder="Ex: 8.5"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button variant="outline" type="button" onClick={onCancel} className="h-10 px-4">
          Cancelar
        </Button>
        <Button type="submit" className="h-10 px-4 shadow-sm bg-zinc-900 hover:bg-zinc-800">
          <Send className="h-4 w-4 mr-2" /> Salvar e Notificar
        </Button>
      </div>
    </form>
  )
}
