import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import {
  Search,
  Plus,
  MoreHorizontal,
  UserX,
  GraduationCap,
  AlertCircle,
  Users,
  FileText,
  Download,
  FileSpreadsheet,
  Edit,
  Trash2,
  Paperclip,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddStudentDialog } from '@/components/AddStudentDialog'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { FileUpload } from '@/components/FileUpload'
import { useToast } from '@/hooks/use-toast'
import { Student } from '@/lib/types'

const editStudentSchema = z.object({
  name: z.string().min(3, 'Obrigatório'),
  email: z.string().email('Inválido'),
  phone: z.string(),
  cpf: z.string(),
  course: z.string().min(1, 'Obrigatório'),
  status: z.enum(['Ativo', 'Inativo', 'Formado']).default('Ativo'),
})

export default function Students() {
  const { students, payments, enrollStudent, generateInvoice, updateStudent, deleteStudent } =
    useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('Todos')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Student | null>(null)
  const [attachmentsItem, setAttachmentsItem] = useState<Student | null>(null)

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    destructive: false,
  })

  const editForm = useForm<z.infer<typeof editStudentSchema>>({
    resolver: zodResolver(editStudentSchema),
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setIsAddDialogOpen(true)
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

  const handleEditClick = (s: Student) => {
    setEditItem(s)
    editForm.reset({
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      cpf: s.cpf || '',
      course: s.course,
      status: s.status as 'Ativo' | 'Inativo' | 'Formado',
    })
  }

  const handleDeleteClick = (id: string) => {
    confirmAction(
      'Excluir Aluno',
      'Deseja remover permanentemente este aluno e desvincular seus registros?',
      () => {
        deleteStudent(id)
        toast({ title: 'Excluído', description: 'Registro de aluno removido.' })
      },
      true,
    )
  }

  const onEditSubmit = (data: z.infer<typeof editStudentSchema>) => {
    confirmAction(
      'Salvar Alterações',
      'Deseja confirmar as alterações nos dados deste aluno?',
      () => {
        updateStudent(editItem!.id, data)
        toast({ title: 'Atualizado', description: 'Dados do aluno salvos com sucesso.' })
        setEditItem(null)
      },
    )
  }

  const studentsWithFinance = useMemo(() => {
    return students.map((s) => {
      const studentPayments = payments.filter((p) => p.studentId === s.id)
      const hasLate = studentPayments.some((p) => p.status === 'Atrasado')
      return { ...s, financialStatus: hasLate ? 'Inadimplente' : 'Regular' }
    })
  }, [students, payments])

  const filteredStudents = studentsWithFinance.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.cpf && s.cpf.includes(searchTerm))
    const matchesStatus = filterStatus === 'Todos' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de matrículas, documentação e histórico.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <Button variant="outline" className="shadow-sm h-10 px-4 text-xs shrink-0">
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Excel
          </Button>
          <Button variant="outline" className="shadow-sm h-10 px-4 text-xs shrink-0">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="shadow-sm h-10 px-4 shrink-0 group"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Matrícula
            <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
              Ctrl+N
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Matrículas Ativas
              </p>
              <p className="text-2xl font-bold">
                {students.filter((s) => s.status === 'Ativo').length}
              </p>
            </div>
            <div className="p-2 rounded-md bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Egressos
              </p>
              <p className="text-2xl font-bold">
                {students.filter((s) => s.status === 'Formado').length}
              </p>
            </div>
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Inadimplência
              </p>
              <p className="text-2xl font-bold">
                {studentsWithFinance.filter((s) => s.financialStatus === 'Inadimplente').length}
              </p>
            </div>
            <div className="p-2 rounded-md bg-rose-50 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 h-10 bg-muted/50 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex bg-muted/50 p-1.5 rounded-md shrink-0 border border-border">
            {['Todos', 'Ativo', 'Inativo', 'Formado'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`text-xs h-7 px-3 ${filterStatus === status ? 'shadow-sm bg-background' : 'text-muted-foreground'}`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {filteredStudents.length > 0 ? (
          <Table className="table-compact">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[280px]">Aluno / Contato</TableHead>
                <TableHead className="w-[140px]">Documento (CPF)</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[140px]">Situação</TableHead>
                <TableHead className="text-right w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="group hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 rounded border shadow-sm">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-muted text-xs">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm truncate">{student.name}</span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {student.cpf || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-foreground/80">{student.course}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        student.status === 'Ativo'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-border bg-muted/50'
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        student.financialStatus === 'Regular'
                          ? 'border-transparent bg-transparent text-emerald-600'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }
                    >
                      {student.financialStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem
                          className="text-sm font-medium text-blue-600 focus:text-blue-700"
                          onClick={() => {
                            generateInvoice(student.id, 850)
                            toast({ title: 'Fatura Gerada' })
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" /> Gerar Boleto
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setAttachmentsItem(student)}>
                          <Paperclip className="w-4 h-4 mr-2" /> Gerenciar Anexos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClick(student)}>
                          <Edit className="w-4 h-4 mr-2" /> Editar Dados
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(student.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir Aluno
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
            <div className="h-12 w-12 bg-background border rounded-lg flex items-center justify-center mb-3 shadow-sm">
              <UserX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold">Nenhum registro</h3>
          </div>
        )}
      </div>

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={(student, plan) => {
          enrollStudent(student, plan)
          toast({ title: 'Matrícula Concluída' })
        }}
      />
      <ConfirmActionDialog
        {...confirmState}
        onOpenChange={(open) => setConfirmState((p) => ({ ...p, open }))}
      />

      <Dialog open={!!attachmentsItem} onOpenChange={(open) => !open && setAttachmentsItem(null)}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Documentos de {attachmentsItem?.name}</DialogTitle>
            <DialogDescription>Armazene documentos de matrícula e histórico.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <FileUpload
              multiple
              onUpload={(files) => {
                if (!attachmentsItem) return
                const newAttachments = [...(attachmentsItem.attachments || []), ...files]
                updateStudent(attachmentsItem.id, { attachments: newAttachments })
                setAttachmentsItem({ ...attachmentsItem, attachments: newAttachments })
                toast({ title: 'Arquivos anexados' })
              }}
            />
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {attachmentsItem?.attachments?.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2 border rounded-md text-sm bg-muted/30"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 shrink-0 text-blue-500" />
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate hover:underline font-medium"
                    >
                      {att.name}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => {
                      const newAttachments = attachmentsItem.attachments!.filter(
                        (a) => a.id !== att.id,
                      )
                      updateStudent(attachmentsItem.id, { attachments: newAttachments })
                      setAttachmentsItem({ ...attachmentsItem, attachments: newAttachments })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!attachmentsItem?.attachments || attachmentsItem.attachments.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                  Nenhum documento anexado.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Editar Dados do Aluno</DialogTitle>
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                          <SelectItem value="Formado">Formado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curso</FormLabel>
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
