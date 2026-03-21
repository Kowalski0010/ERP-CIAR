import { useAppStore } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export function DisciplinaForm({ onCancel }: { onCancel: () => void }) {
  const { addDisciplina } = useAppStore()
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addDisciplina({
      name: fd.get('name') as string,
      workload: Number(fd.get('workload')),
    })
    toast({
      title: 'Disciplina Salva',
      description: 'A disciplina foi persistida na grade curricular com sucesso.',
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-semibold text-zinc-700">Nome da Disciplina</Label>
          <Input
            name="name"
            required
            placeholder="Ex: Banco de Dados Avançado"
            className="bg-zinc-50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-zinc-700">Carga Horária (Horas)</Label>
          <Input
            name="workload"
            type="number"
            required
            placeholder="Ex: 80"
            className="bg-zinc-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">Pré-requisitos / Exigências</Label>
        <Input
          name="prerequisites"
          placeholder="Ex: Lógica de Programação (Código: MAT101)"
          className="bg-zinc-50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-zinc-700">
          Ementa / Conteúdo Programático Oficial
        </Label>
        <Textarea
          name="syllabus"
          required
          placeholder="Detalhes do conteúdo que será abordado durante o semestre para composição de relatórios..."
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
