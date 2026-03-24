import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  Plus,
  MoreHorizontal,
  Clock,
  UserX,
  Briefcase,
  Award,
  Edit,
  Trash2,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { AddTeacherDialog } from '@/components/AddTeacherDialog'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { useToast } from '@/hooks/use-toast'
import { Teacher } from '@/lib/types'

const editTeacherSchema = z.object({
  name: z.string().min(3, 'Obrigatório'),
  email: z.string().email('Inválido'),
  phone: z.string(),
  cpf: z.string(),
  rg: z.string(),
  subjects: z.string().min(2),
  workload: z.coerce.number().min(1),
})

export default function Teachers() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const [editItem, setEditItem] = useState<Teacher | null>(null)
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    destructive: false,
  })

  const editForm = useForm<z.infer<typeof editTeacherSchema>>({
    resolver: zodResolver(editTeacherSchema),
  })

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

  const confirmAction = (
    title: string,
    description: string,
    onConfirm: () => void,
    destructive = false,
  ) => {
    setConfirmState({ open: true, title, description, onConfirm, destructive })
  }

  const handleEditClick = (t: Teacher) => {
    setEditItem(t)
    editForm.reset({
      name: t.name,
      email: t.email,
      phone: t.phone,
      cpf: t.cpf,
      rg: t.rg,
      subjects: t.subjects.join(', '),
      workload: t.workload,
    })
  }

  const handleDeleteClick = (id: string) => {
    confirmAction(
      'Excluir Docente',
      'Deseja remover permanentemente este docente e desvincular suas disciplinas?',
      () => {
        deleteTeacher(id)
        toast({ title: 'Excluído', description: 'Registro de docente removido.' })
      },
      true,
    )
  }

  const onEditSubmit = (data: z.infer<typeof editTeacherSchema>) => {
    confirmAction(
      'Salvar Alterações',
      'Deseja confirmar as alterações nos dados deste docente?',
      () => {
        updateTeacher(editItem!.id, {
          ...data,
          subjects: data.subjects.split(',').map((s) => s.trim()),
        })
        toast({ title: 'Atualizado', description: 'Dados salvos com sucesso.' })
        setEditItem(null)
      },
    )
  }

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corpo Docente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de professores e carga horária.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="shadow-sm h-9 px-4 group"
          title="Atalho: Ctrl + N"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Docente
          <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
            Ctrl+N
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Total Registrados
              </p>
              <p className="text-2xl font-bold">{teachers.length}</p>
            </div>
            <div className="p-2 rounded-md bg-muted text-muted-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Docentes Ativos
              </p>
              <p className="text-2xl font-bold">
                {teachers.filter((t) => t.status === 'Ativo').length}
              </p>
            </div>
            <div className="p-2 rounded-md bg-muted text-muted-foreground">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Carga Semanal
              </p>
              <p className="text-2xl font-bold">
                {teachers.reduce((acc, curr) => acc + curr.workload, 0)}h
              </p>
            </div>
            <div className="p-2 rounded-md bg-muted text-muted-foreground">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm p-2 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9 h-9 bg-muted/50 text-xs w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <Table className="table-compact">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[300px]">Docente</TableHead>
                <TableHead className="w-[140px]">Documento</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead className="w-[120px]">Carga</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((teacher) => (
                <TableRow key={teacher.id} className="group hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 rounded-sm border">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback className="bg-muted text-[10px]">
                          {teacher.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate">{teacher.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {teacher.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">
                    {teacher.cpf || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {teacher.subjects.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="font-medium text-[10px] py-0 px-1.5"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {teacher.workload}h
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        teacher.status === 'Ativo'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-border bg-muted/50'
                      }
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right p-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(teacher)}>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(teacher.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/10">
            <div className="h-12 w-12 bg-background border rounded-lg flex items-center justify-center mb-3">
              <UserX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold">Nenhum professor</h3>
          </div>
        )}
      </div>

      <AddTeacherDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={(t) => {
          addTeacher(t)
          toast({ title: 'Salvo' })
        }}
      />
      <ConfirmActionDialog
        {...confirmState}
        onOpenChange={(open) => setConfirmState((p) => ({ ...p, open }))}
      />

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Editar Docente</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="workload"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carga (h)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplinas (separadas por vírgula)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setEditItem(null)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
