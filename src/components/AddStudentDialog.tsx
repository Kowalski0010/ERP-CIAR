import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Student, FinancialPlan } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormEvent, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<Student>
  onSuccess: (student: Student, plan: FinancialPlan) => void
}

export function AddStudentDialog({ open, onOpenChange, initialData, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState('pessoais')

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
      enrollmentDate: (fd.get('enrollmentDate') as string) || new Date().toISOString(),
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
    setActiveTab('pessoais')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 shrink-0">
          <DialogTitle className="text-lg font-bold text-zinc-900">
            Registro de Matrícula (Pessoa Física)
          </DialogTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Preencha os formulários por seção. Os campos marcados com asterisco (*) são
            obrigatórios.
          </p>
        </DialogHeader>

        <form
          id="student-form"
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex flex-1 overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-row overflow-hidden"
              orientation="vertical"
            >
              <div className="w-48 border-r border-zinc-200 bg-zinc-50/30 p-4 shrink-0 overflow-y-auto">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1 items-stretch">
                  <TabsTrigger
                    value="pessoais"
                    className="justify-start px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold border border-transparent data-[state=active]:border-zinc-200"
                  >
                    Informações Pessoais
                  </TabsTrigger>
                  <TabsTrigger
                    value="docs"
                    className="justify-start px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold border border-transparent data-[state=active]:border-zinc-200"
                  >
                    Documentação
                  </TabsTrigger>
                  <TabsTrigger
                    value="endereco"
                    className="justify-start px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold border border-transparent data-[state=active]:border-zinc-200"
                  >
                    Endereço Principal
                  </TabsTrigger>
                  <TabsTrigger
                    value="academico"
                    className="justify-start px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold border border-transparent data-[state=active]:border-zinc-200"
                  >
                    Dados Acadêmicos
                  </TabsTrigger>
                  <TabsTrigger
                    value="financeiro"
                    className="justify-start px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold border border-transparent data-[state=active]:border-zinc-200"
                  >
                    Plano Financeiro
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1 bg-white">
                <div className="p-6">
                  <TabsContent value="pessoais" className="m-0 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">Identificação</h3>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className="text-xs">
                            Nome Completo *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={initialData?.name}
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">Contato</h3>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs">
                            E-mail Principal *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={initialData?.email}
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs">
                            Telefone / Celular
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            defaultValue={initialData?.phone}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="docs" className="m-0 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                        Documentos Oficiais
                      </h3>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="cpf" className="text-xs">
                            CPF *
                          </Label>
                          <Input
                            id="cpf"
                            name="cpf"
                            placeholder="000.000.000-00"
                            className="h-9 text-xs font-mono"
                            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="rg" className="text-xs">
                            RG / Órgão Emissor
                          </Label>
                          <Input
                            id="rg"
                            name="rg"
                            placeholder="00.000.000-0"
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="endereco" className="m-0 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">Localização</h3>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5 md:col-span-1">
                          <Label htmlFor="zipCode" className="text-xs">
                            CEP
                          </Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            placeholder="00000-000"
                            className="h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                          <Label htmlFor="street" className="text-xs">
                            Logradouro
                          </Label>
                          <Input id="street" name="street" className="h-9 text-xs" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                          <Label htmlFor="number" className="text-xs">
                            Número
                          </Label>
                          <Input id="number" name="number" className="h-9 text-xs" />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                          <Label htmlFor="neighborhood" className="text-xs">
                            Bairro
                          </Label>
                          <Input id="neighborhood" name="neighborhood" className="h-9 text-xs" />
                        </div>
                        <div className="space-y-1.5 md:col-span-3">
                          <Label htmlFor="city" className="text-xs">
                            Cidade
                          </Label>
                          <Input id="city" name="city" className="h-9 text-xs" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                          <Label htmlFor="state" className="text-xs">
                            UF
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            maxLength={2}
                            placeholder="SP"
                            className="h-9 text-xs uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="academico" className="m-0 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                        Vínculo Institucional
                      </h3>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="course" className="text-xs">
                            Curso / Programa *
                          </Label>
                          <Input
                            id="course"
                            name="course"
                            defaultValue={initialData?.course}
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="enrollmentDate" className="text-xs">
                            Data de Matrícula
                          </Label>
                          <Input
                            id="enrollmentDate"
                            name="enrollmentDate"
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="financeiro" className="m-0 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                        Parametrização de Faturamento
                      </h3>
                      <Separator className="mb-4" />
                      <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="installments" className="text-xs">
                            Nº de Parcelas *
                          </Label>
                          <Input
                            id="installments"
                            name="installments"
                            type="number"
                            min="1"
                            max="48"
                            defaultValue="12"
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="value" className="text-xs">
                            Valor Bruto (R$) *
                          </Label>
                          <Input
                            id="value"
                            name="value"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue="850.00"
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="firstDueDate" className="text-xs">
                            Vencimento da 1ª Parcela *
                          </Label>
                          <Input
                            id="firstDueDate"
                            name="firstDueDate"
                            type="date"
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </form>

        <DialogFooter className="px-6 py-3 border-t border-zinc-200 bg-zinc-50/80 shrink-0">
          <Button variant="outline" type="button" size="sm" onClick={() => onOpenChange(false)}>
            Cancelar Operação
          </Button>
          <Button type="submit" form="student-form" size="sm" className="font-semibold shadow-sm">
            Processar Matrícula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
