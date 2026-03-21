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

export function TurmaForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Turma Salva',
      description: 'A nova turma foi aberta e está disponível para matrículas.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Código / Nome da Turma</Label>
        <Input
          required
          placeholder="Ex: T01 - Engenharia de Software"
          className="bg-zinc-50 font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Curso Vinculado</Label>
          <Select required>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione o curso..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eng">Engenharia de Software</SelectItem>
              <SelectItem value="adm">Administração</SelectItem>
              <SelectItem value="dir">Direito</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Turno (Período)</Label>
          <Select required>
            <SelectTrigger className="bg-zinc-50">
              <SelectValue placeholder="Selecione o turno..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matutino">Matutino</SelectItem>
              <SelectItem value="vespertino">Vespertino</SelectItem>
              <SelectItem value="noturno">Noturno</SelectItem>
              <SelectItem value="integral">Integral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Capacidade Máxima de Alunos</Label>
        <Input type="number" required placeholder="Ex: 40" className="bg-zinc-50 w-full sm:w-48" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Data de Início das Aulas</Label>
          <Input type="date" required className="bg-zinc-50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Data de Término Estimada</Label>
          <Input type="date" required className="bg-zinc-50" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Turma
        </Button>
      </div>
    </form>
  )
}
