import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function VincularDisciplinaForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Turma</Label>
          <Input placeholder="Buscar turma..." className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Disciplina a Vincular</Label>
          <Input placeholder="Ex: Cálculo III" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Carga Horária Alocada</Label>
          <Input type="number" defaultValue="60" className="bg-muted/50" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onCancel}>
          Salvar Vínculo
        </Button>
      </div>
    </form>
  )
}

export function AlocarProfessorForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Professor / Docente</Label>
          <Input placeholder="Buscar professor..." className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Turma / Disciplina</Label>
          <Input placeholder="Buscar alocação existente..." className="bg-muted/50" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onCancel}>
          Confirmar Alocação
        </Button>
      </div>
    </form>
  )
}

export function LancarNotasForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form className="space-y-4 text-center py-6">
      <p className="text-muted-foreground mb-4">
        Para realizar o lançamento de notas, por favor, utilize o módulo dedicado:
        <br /> <strong>Pedagógico &gt; Controle de Notas (Diário de Classe)</strong>.
      </p>
      <Button type="button" onClick={onCancel}>
        Voltar
      </Button>
    </form>
  )
}
