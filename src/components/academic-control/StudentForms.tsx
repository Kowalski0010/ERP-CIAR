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

export function EditarAlunoForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Buscar Aluno (Matrícula ou Nome)</Label>
          <Input placeholder="Ex: 2023001..." className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Nome Social / Completo</Label>
          <Input placeholder="Nome" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Telefone Atualizado</Label>
          <Input placeholder="(00) 00000-0000" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Status Matrícula</Label>
          <Select defaultValue="ativo">
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="trancado">Trancado</SelectItem>
              <SelectItem value="formado">Formado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onCancel}>
          Salvar Alterações
        </Button>
      </div>
    </form>
  )
}

export function TrocarTurmaForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Aluno</Label>
          <Input placeholder="Buscar aluno..." className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Turma Atual</Label>
          <Input disabled value="T01 - Engenharia de Software" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Nova Turma Destino</Label>
          <Select>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t2">T02 - Engenharia de Software (Noturno)</SelectItem>
              <SelectItem value="t3">T03 - Engenharia de Software (Manhã)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onCancel}>
          Confirmar Transferência
        </Button>
      </div>
    </form>
  )
}
