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
import { FormEvent, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (teacher: Teacher) => void
}

export function AddTeacherDialog({ open, onOpenChange, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState('personal')

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
    setActiveTab('personal')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 py-5 border-b bg-muted/20 shrink-0">
          <DialogTitle className="text-xl">Ficha do Docente</DialogTitle>
          <DialogDescription>
            Cadastro completo do professor organizado por seções.
          </DialogDescription>
        </DialogHeader>

        <form id="teacher-form" onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-6 pt-4 shrink-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="academic">Acadêmico</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-4">
              <TabsContent value="personal" className="m-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Profissional *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" name="cpf" pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" name="rg" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="m-0 space-y-4">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="workload">Carga Horária (h/sem) *</Label>
                    <Input
                      id="workload"
                      name="workload"
                      type="number"
                      className="max-w-[200px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjects">
                      Especialidades/Disciplinas (separadas por vírgula) *
                    </Label>
                    <Input
                      id="subjects"
                      name="subjects"
                      required
                      placeholder="Ex: Física Quântica, Matemática Aplicada"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="m-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" name="zipCode" />
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
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" name="state" maxLength={2} />
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
          <Button type="submit" form="teacher-form">
            Salvar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
