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

export function CursoForm({ onCancel }: { onCancel: () => void }) {
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
          <Label>Nome do Curso</Label>
          <Input required placeholder="Ex: Bacharelado em Engenharia" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Modalidade</Label>
          <Select defaultValue="Presencial">
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="EAD">EAD / Online</SelectItem>
              <SelectItem value="Hibrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Carga Horária Total (h)</Label>
          <Input required type="number" className="bg-muted/50" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Curso
        </Button>
      </div>
    </form>
  )
}
