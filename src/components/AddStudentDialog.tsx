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
import { Student, FinancialPlan } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormEvent } from 'react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<Student>
  onSuccess: (student: Student, plan: FinancialPlan) => void
}

export function AddStudentDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    const student: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      cpf: fd.get('cpf') as string,
      rg: fd.get('rg') as string,
      course: fd.get('course') as string,
      status: 'Ativo',
      enrollmentDate: new Date().toISOString(),
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

    const plan: FinancialPlan = {
      installments: Number(fd.get('installments')) || 1,
      value: Number(fd.get('value')) || 0,
      firstDueDate: (fd.get('firstDueDate') as string) || new Date().toISOString().split('T')[0],
    }

    onSuccess(student, plan)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Matricular Aluno & Gerar Financeiro</DialogTitle>
          <DialogDescription>Preencha os dados pessoais e o plano de pagamento.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3 text-primary uppercase tracking-wider">
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Nome Completo *</Label>
                  <Input name="name" defaultValue={initialData?.name} required />
                </div>
                <div className="space-y-1">
                  <Label>E-mail *</Label>
                  <Input name="email" type="email" defaultValue={initialData?.email} required />
                </div>
                <div className="space-y-1">
                  <Label>Telefone</Label>
                  <Input name="phone" defaultValue={initialData?.phone} />
                </div>
                <div className="space-y-1">
                  <Label>Curso *</Label>
                  <Input name="course" defaultValue={initialData?.course} required />
                </div>
                <div className="space-y-1">
                  <Label>CPF *</Label>
                  <Input
                    name="cpf"
                    placeholder="000.000.000-00"
                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>RG</Label>
                  <Input name="rg" placeholder="00.000.000-0" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3 text-primary uppercase tracking-wider">
                Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>CEP</Label>
                  <Input name="zipCode" placeholder="00000-000" />
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
                  <Label>Estado (UF)</Label>
                  <Input name="state" maxLength={2} />
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border border-primary/20">
              <h3 className="font-semibold text-sm mb-3 text-primary uppercase tracking-wider">
                Plano Financeiro Automático
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Qtd. de Parcelas</Label>
                  <Input
                    name="installments"
                    type="number"
                    min="1"
                    max="24"
                    defaultValue="12"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Valor da Mensalidade (R$)</Label>
                  <Input
                    name="value"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue="850.00"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Vencimento da 1ª Parcela</Label>
                  <Input name="firstDueDate" type="date" required />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="student-form">
            Salvar e Matricular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
