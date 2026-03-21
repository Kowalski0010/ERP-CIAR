import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function DisciplinaForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Disciplina Salva',
      description: 'A disciplina foi cadastrada na grade curricular com sucesso.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Nome da Disciplina</Label>
        <Input required placeholder="Ex: Banco de Dados Avançado" className="bg-zinc-50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Carga Horária (Horas)</Label>
          <Input type="number" required placeholder="Ex: 80" className="bg-zinc-50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Pré-requisitos</Label>
          <Input placeholder="Ex: Lógica de Programação (Opcional)" className="bg-zinc-50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          Ementa / Conteúdo Programático
        </Label>
        <Textarea
          required
          placeholder="Detalhes do conteúdo que será abordado durante o semestre..."
          className="bg-zinc-50 min-h-[100px] resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Disciplina
        </Button>
      </div>
    </form>
  )
}
