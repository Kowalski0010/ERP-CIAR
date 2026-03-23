import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DisciplinaForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onCancel()
      }}
      className="space-y-4 max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Nome da Disciplina</Label>
          <Input
            required
            placeholder="Ex: Algoritmos e Estrutura de Dados"
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Carga Horária Período (h)</Label>
          <Input required type="number" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Sigla / Código</Label>
          <Input required placeholder="Ex: ALG-101" className="bg-muted/50 uppercase" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
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
