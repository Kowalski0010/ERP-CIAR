import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Teacher } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormEvent } from 'react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (teacher: Teacher) => void
}

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const teacher: Teacher = {
      id: Math.random().toString(36).substr(2, 9),
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      cpf: fd.get('cpf') as string,
      rg: fd.get('rg') as string,
      subjects: (fd.get('subjects') as string).split(',').map((s) => s.trim()),
      workload: Number(fd.get('workload')),
      status: 'Ativo',
      avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${Math.floor(Math.random() * 100)}`,
      address: {
        zipCode: fd.get('zipCode') as string,
        street: fd.get('street') as string,
        number: fd.get('number') as string,
        neighborhood: fd.get('neighborhood') as string,
        city: fd.get('city') as string,
        state: fd.get('state') as string,
      },
    }
    onSuccess(teacher)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Cadastrar Professor</DialogTitle>
          <DialogDescription>Preencha os dados e documentação do docente.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="teacher-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Nome Completo *</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-1">
                <Label>E-mail *</Label>
                <Input name="email" type="email" required />
              </div>
              <div className="space-y-1">
                <Label>Telefone</Label>
                <Input name="phone" />
              </div>
              <div className="space-y-1">
                <Label>Carga Horária (h/sem) *</Label>
                <Input name="workload" type="number" required />
              </div>
              <div className="space-y-1">
                <Label>CPF *</Label>
                <Input name="cpf" pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" required />
              </div>
              <div className="space-y-1">
                <Label>RG</Label>
                <Input name="rg" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Especialidades/Disciplinas (separadas por vírgula) *</Label>
                <Input name="subjects" required placeholder="Física, Matemática Aplicada..." />
              </div>
            </div>

            <h3 className="font-semibold text-sm text-primary uppercase tracking-wider mt-4 mb-2">
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>CEP</Label>
                <Input name="zipCode" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Logradouro</Label>
                <Input name="street" />
              </div>
              <div className="space-y-1">
                <Label>Número</Label>
                <Input name="number" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Bairro</Label>
                <Input name="neighborhood" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Cidade</Label>
                <Input name="city" />
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Input name="state" maxLength={2} />
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="teacher-form">
            Salvar Professor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
