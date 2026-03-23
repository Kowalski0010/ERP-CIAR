import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CepForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onCancel()
      }}
      className="space-y-4 max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>CEP</Label>
          <Input required placeholder="00000-000" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Estado (UF)</Label>
          <Input required placeholder="Ex: SP" maxLength={2} className="bg-muted/50 uppercase" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Logradouro / Rua</Label>
          <Input required placeholder="Ex: Avenida Brasil" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Bairro</Label>
          <Input required placeholder="Bairro" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Input required placeholder="Cidade" className="bg-muted/50" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar CEP
        </Button>
      </div>
    </form>
  )
}
