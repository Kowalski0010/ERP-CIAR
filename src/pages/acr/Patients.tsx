import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Search, Plus, UserCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Patients() {
  const { acrPatients, addAcrPatient } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filteredPatients = acrPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addAcrPatient({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      birthDate: fd.get('birthDate') as string,
      background: fd.get('background') as string,
    })
    toast({
      title: 'Paciente Registrado',
      description: 'O paciente foi adicionado ao sistema ACR.',
    })
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <UserCircle className="h-7 w-7 text-zinc-400" />
            Pacientes (Clínica ACR)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerencie perfis e dados cadastrais de pacientes do módulo de clínica.
          </p>
        </div>
        <Button className="shadow-sm h-9 px-4" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Paciente
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm p-3 bg-white">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">Código</TableHead>
                <TableHead>Nome Completo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="w-[140px]">Data de Nasc.</TableHead>
                <TableHead className="w-[140px]">Data Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((p) => (
                <TableRow key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="font-mono text-xs text-zinc-500 font-medium">
                    {p.id}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900 text-sm">{p.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-700">{p.email}</span>
                      <span className="text-[10px] text-zinc-500">{p.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600">
                    {new Date(p.birthDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600">
                    {new Date(p.registrationDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input name="name" required placeholder="Ex: Júlia Mendes" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <Input name="birthDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label>Telefone / WhatsApp</Label>
                <Input name="phone" required placeholder="(11) 90000-0000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input name="email" type="email" required placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label>Histórico Básico (Motivo da busca)</Label>
              <Textarea
                name="background"
                placeholder="Breve resumo do relato inicial..."
                className="resize-none"
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Paciente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
