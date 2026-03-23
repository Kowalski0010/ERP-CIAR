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

export function AvaliacaoForm({ onCancel }: { onCancel: () => void }) {
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
          <Label>Nome da Avaliação</Label>
          <Input required placeholder="Ex: Prova N1 - Presencial" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Disciplina Associada</Label>
          <Select defaultValue="d1">
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Selecione a disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="d1">Cálculo Avançado</SelectItem>
              <SelectItem value="d2">Física Aplicada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo de Avaliação</Label>
          <Select defaultValue="escrita">
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="escrita">Prova Escrita</SelectItem>
              <SelectItem value="trabalho">Trabalho/Projeto</SelectItem>
              <SelectItem value="seminario">Seminário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Data Prevista</Label>
          <Input required type="date" className="bg-muted/50" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} className="shadow-sm">
          Cancelar
        </Button>
        <Button type="submit" className="shadow-sm">
          Salvar Avaliação
        </Button>
      </div>
    </form>
  )
}
