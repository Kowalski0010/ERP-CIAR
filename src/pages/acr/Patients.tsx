import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Search, Plus, UserCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const patientSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido. Verifique a formatação'),
  phone: z.string().min(10, 'Telefone deve ter DDD e número válidos'),
  birthDate: z.string().min(1, 'A data de nascimento é obrigatória'),
  background: z.string().min(10, 'Descreva o motivo da busca (mínimo de 10 caracteres)'),
})

export default function Patients() {
  const { acrPatients, addAcrPatient } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      background: '',
    },
  })

  useEffect(() => {
    if (isAddOpen) {
      form.reset()
    }
  }, [isAddOpen, form])

  // Global shortcut for opening modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredPatients = acrPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubmit = (data: z.infer<typeof patientSchema>) => {
    addAcrPatient({
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
      background: data.background,
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCircle className="h-7 w-7 text-muted-foreground" />
            Pacientes (Clínica ACR)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie perfis e dados cadastrais de pacientes do módulo de clínica.
          </p>
        </div>
        <Button
          className="shadow-sm h-10 px-4 group"
          onClick={() => setIsAddOpen(true)}
          title="Atalho: Ctrl + N"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Paciente
          <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
            Ctrl+N
          </span>
        </Button>
      </div>

      <Card className="border-border shadow-sm p-3 bg-card">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9 h-10 bg-muted/50 border-input w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="border-border shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-muted/50">
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
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                    {p.id}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground text-sm">{p.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-foreground/80">{p.email}</span>
                      <span className="text-[10px] text-muted-foreground">{p.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">
                    {new Date(p.birthDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-xs text-foreground/70">
                    {new Date(p.registrationDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Júlia Mendes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 90000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Histórico Básico (Motivo da busca)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve resumo do relato inicial..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Paciente</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
