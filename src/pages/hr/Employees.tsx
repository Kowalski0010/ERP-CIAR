import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import { Employee, SystemAttachment } from '@/lib/types'
import {
  Search,
  Plus,
  FileText,
  UserCircle,
  Briefcase,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { FileUpload } from '@/components/FileUpload'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'

const empSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  department: z.string().min(2, 'Obrigatório'),
  position: z.string().min(2, 'Obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Inválido'),
  salary: z.coerce.number().min(0, 'Valor inválido'),
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
  avatar: z.string().optional(),
  rgDoc: z.string().optional(),
  cpfDoc: z.string().optional(),
  addressDoc: z.string().optional(),
  certDoc: z.string().optional(),
})

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<Employee | null>(null)
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    destructive: false,
  })

  const form = useForm<z.infer<typeof empSchema>>({
    resolver: zodResolver(empSchema),
    defaultValues: {
      name: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      salary: 0,
      status: 'Ativo',
      avatar: '',
      rgDoc: '',
      cpfDoc: '',
      addressDoc: '',
      certDoc: '',
    },
  })

  useEffect(() => {
    if (!isFormOpen) {
      setEditItem(null)
      form.reset({
        name: '',
        department: '',
        position: '',
        email: '',
        phone: '',
        salary: 0,
        status: 'Ativo',
        avatar: '',
        rgDoc: '',
        cpfDoc: '',
        addressDoc: '',
        certDoc: '',
      })
    }
  }, [isFormOpen, form])

  const confirmAction = (
    title: string,
    description: string,
    onConfirm: () => void,
    destructive = false,
  ) => {
    setConfirmState({ open: true, title, description, onConfirm, destructive })
  }

  const handleEditClick = (e: Employee) => {
    setEditItem(e)
    form.reset({
      name: e.name,
      department: e.department,
      position: e.position,
      email: e.email,
      phone: e.phone,
      salary: e.salary,
      status: e.status,
      avatar: e.avatar || '',
      rgDoc: '',
      cpfDoc: '',
      addressDoc: '',
      certDoc: '', // Clean for new uploads
    })
    setIsFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    confirmAction(
      'Excluir Colaborador',
      'Deseja remover permanentemente este colaborador do sistema?',
      () => {
        deleteEmployee(id)
        toast({ title: 'Excluído', description: 'Registro removido.' })
      },
      true,
    )
  }

  const onSubmit = (data: z.infer<typeof empSchema>) => {
    const newAttachments: SystemAttachment[] = []
    if (data.rgDoc)
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Cópia do RG',
        url: data.rgDoc,
        type: 'RG',
        date: new Date().toISOString(),
      })
    if (data.cpfDoc)
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Cópia do CPF',
        url: data.cpfDoc,
        type: 'CPF',
        date: new Date().toISOString(),
      })
    if (data.addressDoc)
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Comprovante de Endereço',
        url: data.addressDoc,
        type: 'Endereço',
        date: new Date().toISOString(),
      })
    if (data.certDoc)
      newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Certificado/Diploma',
        url: data.certDoc,
        type: 'Certificado',
        date: new Date().toISOString(),
      })

    if (editItem) {
      confirmAction('Salvar Alterações', 'Deseja atualizar os dados deste colaborador?', () => {
        const finalAttachments = [...(editItem.attachments || []), ...newAttachments]
        updateEmployee(editItem.id, { ...data, attachments: finalAttachments })
        toast({ title: 'Atualizado', description: 'Dados salvos.' })
        setIsFormOpen(false)
      })
    } else {
      addEmployee({ ...data, admissionDate: new Date().toISOString(), attachments: newAttachments })
      toast({ title: 'Cadastrado', description: 'Novo colaborador registrado.' })
      setIsFormOpen(false)
    }
  }

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderDocUpload = (name: any, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {field.value ? (
              <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/30">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium truncate flex-1">Arquivo anexado</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] px-2"
                  onClick={() => field.onChange('')}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <FileUpload
                accept="image/*,application/pdf"
                label={`Anexar ${label}`}
                onUpload={(files) => field.onChange(files[0]?.url)}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Recursos Humanos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de colaboradores e contratos.</p>
        </div>
        <Button className="shadow-sm h-9 px-4" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou departamento..."
            className="pl-9 h-9 bg-muted/50 text-xs w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>Colaborador</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[140px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-md border">
                      <AvatarImage src={emp.avatar} />
                      <AvatarFallback className="rounded-md bg-muted text-xs">
                        {emp.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs">{emp.name}</span>
                      <span className="text-[10px] text-muted-foreground">{emp.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-foreground/80">{emp.department}</TableCell>
                <TableCell className="text-xs text-foreground/80">{emp.position}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      emp.status === 'Ativo'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-border bg-muted/50'
                    }
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedEmp(emp)}
                    >
                      Ver
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(emp)}>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(emp.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Colaborador' : 'Novo Colaborador'}</DialogTitle>
            <DialogDescription>
              Insira os dados pessoais e anexe a documentação necessária.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                Dados Pessoais & Contrato
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Foto de Perfil</FormLabel>
                      <FormControl>
                        {field.value ? (
                          <div className="flex items-center gap-4 p-3 border border-border rounded-md bg-muted/30">
                            <img
                              src={field.value}
                              alt="Avatar"
                              className="w-12 h-12 rounded-full object-cover border shadow-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => field.onChange('')}
                            >
                              Remover
                            </Button>
                          </div>
                        ) : (
                          <FileUpload
                            accept="image/*"
                            label="Clique ou arraste uma foto"
                            onUpload={(files) => field.onChange(files[0]?.url)}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salário Base (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2 mt-6">
                Documentação (Anexos)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderDocUpload('rgDoc', 'Cópia do RG')}
                {renderDocUpload('cpfDoc', 'Cópia do CPF')}
                {renderDocUpload('addressDoc', 'Comprovante de Endereço')}
                {renderDocUpload('certDoc', 'Certificados / Diplomas')}
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedEmp} onOpenChange={(open) => !open && setSelectedEmp(null)}>
        <SheetContent className="sm:max-w-[500px] p-0 flex flex-col bg-card">
          {selectedEmp && (
            <>
              <SheetHeader className="p-6 bg-card border-b border-border flex-shrink-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border shadow-sm">
                    <AvatarImage src={selectedEmp.avatar} />
                    <AvatarFallback>{selectedEmp.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">{selectedEmp.name}</SheetTitle>
                    <SheetDescription className="text-xs mt-1">
                      {selectedEmp.position} • {selectedEmp.department}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-hidden p-6 pt-4">
                <Tabs defaultValue="pessoais" className="w-full h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-md mb-4 flex-shrink-0">
                    <TabsTrigger value="pessoais" className="text-[11px] rounded">
                      <UserCircle className="w-3.5 h-3.5 mr-1.5" /> Pessoais
                    </TabsTrigger>
                    <TabsTrigger value="contrato" className="text-[11px] rounded">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Contrato
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="text-[11px] rounded">
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Documentos
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex-1 overflow-y-auto">
                    <TabsContent value="pessoais" className="space-y-4 m-0">
                      <div className="grid grid-cols-1 gap-4 bg-background p-4 rounded-lg border shadow-sm">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">
                            Email
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmp.email}
                            className="h-8 text-xs bg-muted/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">
                            Telefone
                          </Label>
                          <Input
                            readOnly
                            value={selectedEmp.phone}
                            className="h-8 text-xs bg-muted/50"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="contrato" className="space-y-4 m-0">
                      <div className="grid grid-cols-1 gap-4 bg-background p-4 rounded-lg border shadow-sm">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">
                            Admissão
                          </Label>
                          <Input
                            readOnly
                            value={new Date(selectedEmp.admissionDate).toLocaleDateString('pt-BR')}
                            className="h-8 text-xs bg-muted/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">
                            Salário Base
                          </Label>
                          <Input
                            readOnly
                            value={`R$ ${selectedEmp.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            className="h-8 text-xs bg-muted/50"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="docs" className="space-y-4 m-0">
                      <FileUpload
                        multiple
                        label="Anexar novo documento"
                        onUpload={(files) => {
                          const newAtt = [...(selectedEmp.attachments || []), ...files]
                          updateEmployee(selectedEmp.id, { attachments: newAtt })
                          setSelectedEmp({ ...selectedEmp, attachments: newAtt })
                          toast({ title: 'Documentos anexados' })
                        }}
                      />
                      <div className="space-y-2">
                        {selectedEmp.attachments?.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-background border rounded-lg shadow-sm"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium truncate hover:underline"
                              >
                                {doc.name}
                              </a>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                const newAtt = selectedEmp.attachments!.filter(
                                  (a) => a.id !== doc.id,
                                )
                                updateEmployee(selectedEmp.id, { attachments: newAtt })
                                setSelectedEmp({ ...selectedEmp, attachments: newAtt })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {(!selectedEmp.attachments || selectedEmp.attachments.length === 0) && (
                          <p className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded-lg border border-dashed">
                            Nenhum documento anexado.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <ConfirmActionDialog
        {...confirmState}
        onOpenChange={(open) => setConfirmState((p) => ({ ...p, open }))}
      />
    </div>
  )
}
