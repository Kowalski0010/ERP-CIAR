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
import { Teacher } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormEvent, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (teacher: Teacher) => void
}

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState('pessoais')

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
    setActiveTab('pessoais')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 shrink-0">
          <DialogTitle className="text-lg font-bold text-zinc-900">Registro de Docente</DialogTitle>
          <p className="text-xs text-zinc-500 mt-1">Cadastro completo organizado por módulos.</p>
        </DialogHeader>

        <form
          id="teacher-form"
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
                    Identificação
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
                    Alocação Acadêmica
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1 bg-white">
                <div className="p-6">
                  <TabsContent value="pessoais" className="m-0 space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">Dados Básicos</h3>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className="text-xs">
                            Nome Completo *
                          </Label>
                          <Input id="name" name="name" className="h-9 text-xs" required />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">Contato</h3>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs">
                            E-mail Profissional *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs">
                            Telefone / Celular
                          </Label>
                          <Input id="phone" name="phone" className="h-9 text-xs" />
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
                            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                            placeholder="000.000.000-00"
                            className="h-9 text-xs font-mono"
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
                        Parametrização Acadêmica
                      </h3>
                      <Separator className="mb-4" />
                      <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5 md:col-span-1">
                          <Label htmlFor="workload" className="text-xs">
                            Carga Horária (h/sem) *
                          </Label>
                          <Input
                            id="workload"
                            name="workload"
                            type="number"
                            min="1"
                            max="80"
                            className="h-9 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label htmlFor="subjects" className="text-xs">
                            Especialidades (separadas por vírgula) *
                          </Label>
                          <Input
                            id="subjects"
                            name="subjects"
                            placeholder="Ex: Engenharia de Software, Algoritmos"
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
          <Button type="submit" form="teacher-form" size="sm" className="font-semibold shadow-sm">
            Salvar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
