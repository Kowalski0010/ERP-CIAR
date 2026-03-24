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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Plus, UserCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { AcrPatient } from '@/lib/types'

const patientSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido. Verifique a formatação'),
  phone: z.string().min(10, 'Telefone deve ter DDD e número válidos'),
  birthDate: z.string().min(1, 'A data de nascimento é obrigatória'),
  background: z.string().min(10, 'Descreva o motivo da busca (mínimo de 10 caracteres)'),
})

export default function Patients() {
  const { acrPatients, addAcrPatient, updateAcrPatient, deleteAcrPatient } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<AcrPatient | null>(null)
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    destructive: false,
  })

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', phone: '', birthDate: '', background: '' },
  })

  useEffect(() => {
    if (!isFormOpen) {
      setEditItem(null)
      form.reset({ name: '', email: '', phone: '', birthDate: '', background: '' })
    }
  }, [isFormOpen, form])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsFormOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const confirmAction = (
    title: string,
    description: string,
    onConfirm: () => void,
    destructive = false,
  ) => {
    setConfirmState({ open: true, title, description, onConfirm, destructive })
  }

  const handleEditClick = (p: AcrPatient) => {
    setEditItem(p)
    form.reset({
      name: p.name,
      email: p.email,
      phone: p.phone,
      birthDate: p.birthDate,
      background: p.background,
    })
    setIsFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    confirmAction(
      'Excluir Paciente',
      'Tem certeza que deseja remover este paciente permanentemente do sistema ACR?',
      () => {
        deleteAcrPatient(id)
        toast({ title: 'Excluído', description: 'Registro de paciente removido com sucesso.' })
      },
      true,
    )
  }

  const handleFormSubmit = (data: z.infer<typeof patientSchema>) => {
    if (editItem) {
      confirmAction(
        'Salvar Alterações',
        'Deseja confirmar as alterações nos dados deste paciente?',
        () => {
          updateAcrPatient(editItem.id, data)
          toast({ title: 'Paciente Atualizado', description: 'Os dados foram salvos com sucesso.' })
          setIsFormOpen(false)
        },
      )
    } else {
      addAcrPatient(data)
      toast({
        title: 'Paciente Registrado',
        description: 'O paciente foi adicionado ao sistema ACR.',
      })
      setIsFormOpen(false)
    }
  }

  const filteredPatients = acrPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          onClick={() => setIsFormOpen(true)}
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
            className="pl-9 h-10 bg-muted/50 w-full text-sm"
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
                <TableHead className="w-[80px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                    {p.id}
                  </TableCell>
                  <TableCell className="font-semibold text-sm">{p.name}</TableCell>
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
                  <TableCell className="text-right p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(p)}>
                          <Edit className="h-4 w-4 mr-2" /> Editar Cadastro
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(p.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        <Input {...field} />
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
                      <Input type="email" {...field} />
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
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Paciente</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmActionDialog
        {...confirmState}
        onOpenChange={(open) => setConfirmState((p) => ({ ...p, open }))}
      />
    </div>
  )
}
