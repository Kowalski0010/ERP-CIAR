import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function CursoForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Curso Salvo',
      description: 'Novo curso registrado com sucesso no sistema.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Nome do Curso</Label>
        <Input
          required
          placeholder="Ex: Bacharelado em Engenharia de Software"
          className="bg-zinc-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Carga Horária Total (Horas)</Label>
          <Input type="number" required placeholder="Ex: 3600" className="bg-zinc-50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Coordenador do Curso</Label>
          <Input required placeholder="Nome do Docente Coordenador" className="bg-zinc-50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Descrição / Ementa Geral</Label>
        <Textarea
          required
          placeholder="Detalhes, perfil do egresso e objetivos do curso..."
          className="bg-zinc-50 min-h-[100px] resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Registro de Curso
        </Button>
      </div>
    </form>
  )
}
