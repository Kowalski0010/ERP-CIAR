import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ConvenioForm({ onCancel }: { onCancel: () => void }) {
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
          <Label>Empresa / Parceiro</Label>
          <Input required placeholder="Nome da empresa conveniada" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Nº do Contrato</Label>
          <Input required placeholder="Identificador do acordo" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Desconto Aplicado (%)</Label>
          <Input required type="number" min="0" max="100" className="bg-muted/50" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Convênio
        </Button>
      </div>
    </form>
  )
}
