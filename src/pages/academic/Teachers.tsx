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
  GraduationCap,
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
import { supabase } from '@/lib/supabase/client'

const editTeacherSchema = z.object({
  name: z.string().min(3, 'Obrigatório'),
  email: z.string().email('Inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  cpf: z.string().optional().or(z.literal('')),
  rg: z.string().optional().or(z.literal('')),
  subjects: z.string().min(2),
  workload: z.coerce.number().min(1),
  degree: z.string().optional().or(z.literal('')),
  undergraduate_degree: z.string().optional().or(z.literal('')),
  postgraduate_degree: z.string().optional().or(z.literal('')),
})

function safeSubjects(subs: unknown): string[] {
  if (Array.isArray(subs)) return subs
  if (typeof subs === 'string' && subs.trim()) return subs.split(',').map((s) => s.trim())
  return []
}

export default function Teachers() {
  const { teachers: rawTeachers, addTeacher, updateTeacher, deleteTeacher } = useAppStore()
  const teachers = Array.isArray(rawTeachers) ? rawTeachers : []
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<Teacher | null>(null)

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
      email: t.email || '',
      phone: t.phone || '',
      cpf: t.cpf || '',
      rg: t.rg || '',
      subjects: safeSubjects(t.subjects).join(', '),
      workload: t.workload || 0,
      degree: (t as any).degree || '',
      undergraduate_degree: (t as any).undergraduate_degree || (t as any).undergraduateDegree || '',
      postgraduate_degree: (t as any).postgraduate_degree || (t as any).postgraduateDegree || '',
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
      async () => {
        const updateData = {
          ...data,
          phone: data.phone === '' ? null : data.phone,
          email: data.email === '' ? null : data.email,
          cpf: data.cpf === '' ? null : data.cpf,
          rg: data.rg === '' ? null : data.rg,
          subjects: data.subjects.split(',').map((s) => s.trim()),
          degree: data.degree || undefined,
          undergraduateDegree: data.undergraduate_degree || undefined,
          postgraduateDegree: data.postgraduate_degree || undefined,
        }
        updateTeacher(editItem!.id, updateData)

        try {
          await supabase
            .from('teachers')
            .update({
              name: data.name,
              email: data.email === '' ? null : data.email,
              phone: data.phone === '' ? null : data.phone,
              cpf: data.cpf === '' ? null : data.cpf,
              rg: data.rg === '' ? null : data.rg,
              subjects: data.subjects,
              workload: data.workload,
              degree: data.degree === '' ? null : data.degree,
              undergraduate_degree:
                data.undergraduate_degree === '' ? null : data.undergraduate_degree,
              postgraduate_degree:
                data.postgraduate_degree === '' ? null : data.postgraduate_degree,
            })
            .eq('id', editItem!.id)
        } catch (err) {
          console.error('Error updating teacher in Supabase:', err)
        }

        toast({ title: 'Atualizado', description: 'Dados salvos com sucesso.' })
        setEditItem(null)
      },
    )
  }

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeSubjects(t.subjects).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const academicInfo = (t: Teacher) => {
    const items: { label: string; value: string }[] = []
    if ((t as any).degree || (t as any).undergraduateDegree) {
      const degree = (t as any).degree || (t as any).undergraduateDegree
      if (degree) items.push({ label: 'Titulação', value: degree })
    }
    if ((t as any).undergraduate_degree || (t as any).undergraduateDegree) {
      const ug = (t as any).undergraduate_degree || (t as any).undergraduateDegree
      if (ug) items.push({ label: 'Graduação', value: ug })
    }
    if ((t as any).postgraduate_degree || (t as any).postgraduateDegree) {
      const pg = (t as any).postgraduate_degree || (t as any).postgraduateDegree
      if (pg) items.push({ label: 'Pós-graduação', value: pg })
    }
    return items
  }

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
                {teachers.reduce((acc, curr) => acc + (curr.workload || 0), 0)}h
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
                <TableHead>Informações Acadêmicas</TableHead>
                <TableHead className="w-[120px]">Carga</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((teacher) => {
                const academic = academicInfo(teacher)
                return (
                  <TableRow key={teacher.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setDetailItem(teacher)}
                      >
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
                        {safeSubjects(teacher.subjects).map((s) => (
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
                      {academic.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {academic.map((a, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="font-medium text-[10px] py-0 px-1.5 gap-1"
                            >
                              <GraduationCap className="h-3 w-3" />
                              {a.value}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">—</span>
                      )}
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
                          <DropdownMenuItem onClick={() => setDetailItem(teacher)}>
                            <GraduationCap className="h-4 w-4 mr-2" /> Ver Detalhes
                          </DropdownMenuItem>
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
                )
              })}
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

      {/* Detail Dialog */}
      <Dialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Docente</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-sm border">
                  <AvatarImage src={detailItem.avatar} />
                  <AvatarFallback className="bg-muted">{detailItem.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{detailItem.name}</p>
                  <p className="text-xs text-muted-foreground">{detailItem.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Telefone
                  </p>
                  <p>{detailItem.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">CPF</p>
                  <p>{detailItem.cpf || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Carga Horária
                  </p>
                  <p>{detailItem.workload}h</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Status
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      detailItem.status === 'Ativo'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-border bg-muted/50'
                    }
                  >
                    {detailItem.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                  Disciplinas
                </p>
                <div className="flex gap-1 flex-wrap">
                  {safeSubjects(detailItem.subjects).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {(() => {
                const academic = academicInfo(detailItem)
                if (academic.length === 0) return null
                return (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" /> Informações Acadêmicas
                    </p>
                    <div className="space-y-2">
                      {academic.map((a, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{a.label}</span>
                          <span className="font-medium text-right">{a.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDetailItem(null)}>
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    handleEditClick(detailItem)
                    setDetailItem(null)
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
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
                      <FormLabel>Telefone (Opcional)</FormLabel>
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
              <div className="grid grid-cols-1 gap-4 pt-2 border-t border-border">
                <p className="text-sm font-semibold text-muted-foreground">
                  Informações Acadêmicas
                </p>
                <FormField
                  control={editForm.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titulação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Doutorado, Mestrado..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="undergraduate_degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Licenciatura em Matemática..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="postgraduate_degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pós-graduação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: MBA em Gestão Educacional..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
