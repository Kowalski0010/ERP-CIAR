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
import { FormEvent, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<Student>
  onSuccess: (student: Student, plan: FinancialPlan) => void
}

export function AddStudentDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState('personal')

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
    setActiveTab('personal')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 py-5 border-b bg-muted/20 shrink-0">
          <DialogTitle className="text-xl">Ficha de Matrícula</DialogTitle>
          <DialogDescription>Preencha os dados do aluno organizados por seções.</DialogDescription>
        </DialogHeader>

        <form id="student-form" onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-6 pt-4 shrink-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-4">
              <TabsContent value="personal" className="m-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input id="name" name="name" defaultValue={initialData?.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={initialData?.email}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" defaultValue={initialData?.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Curso / Programa *</Label>
                    <Input id="course" name="course" defaultValue={initialData?.course} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00"
                      pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" name="rg" placeholder="00.000.000-0" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="m-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" name="zipCode" placeholder="00000-000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Logradouro</Label>
                    <Input id="street" name="street" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" name="number" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" name="neighborhood" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" name="city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado (UF)</Label>
                    <Input id="state" name="state" maxLength={2} placeholder="Ex: SP" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="m-0">
                <div className="bg-muted/30 p-5 rounded-lg border border-border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="installments">Qtd. de Parcelas *</Label>
                      <Input
                        id="installments"
                        name="installments"
                        type="number"
                        min="1"
                        max="24"
                        defaultValue="12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value">Valor da Mensalidade (R$) *</Label>
                      <Input
                        id="value"
                        name="value"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue="850.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstDueDate">Vencimento da 1ª Parcela *</Label>
                      <Input id="firstDueDate" name="firstDueDate" type="date" required />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </form>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20 shrink-0">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="student-form">
            Finalizar Matrícula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
