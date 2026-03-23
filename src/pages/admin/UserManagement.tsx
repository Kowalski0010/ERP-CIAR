import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppStore } from '@/contexts/AppContext'
import { Shield, Plus, Search, Key, UserX, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { useToast } from '@/hooks/use-toast'
import { Role } from '@/lib/types'

const userSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido. Verifique a formatação'),
  role: z.string().min(1, 'Selecione um perfil de acesso'),
})

export default function UserManagement() {
  const { systemUsers, addSystemUser, updateSystemUser } = useAppStore()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Secretaria',
    },
  })

  useEffect(() => {
    if (editUser) {
      form.reset({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      })
    } else if (isAddOpen) {
      form.reset({
        name: '',
        email: '',
        role: 'Secretaria',
      })
    }
  }, [editUser, isAddOpen, form])

  // Global shortcut for opening modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setEditUser(null)
        setIsAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredUsers = systemUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubmit = (data: z.infer<typeof userSchema>) => {
    if (editUser) {
      updateSystemUser(editUser.id, {
        name: data.name,
        email: data.email,
        role: data.role as Role,
      })
      toast({
        title: 'Usuário Atualizado',
        description: 'Os dados do usuário foram atualizados com sucesso.',
      })
    } else {
      addSystemUser({
        name: data.name,
        email: data.email,
        role: data.role as Role,
        status: 'Ativo',
      })
      toast({
        title: 'Usuário Criado',
        description: 'O acesso foi gerado. A senha temporária foi enviada por e-mail.',
      })
    }

    setIsAddOpen(false)
    setEditUser(null)
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo'
    updateSystemUser(id, { status: newStatus })
    toast({
      title: 'Status Atualizado',
      description: `O usuário foi marcado como ${newStatus}.`,
    })
  }

  const handleResetPassword = () => {
    toast({
      title: 'Senha Redefinida',
      description: 'Um link seguro de redefinição foi enviado ao e-mail do usuário.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-7 w-7 text-muted-foreground" />
            Gestão de Usuários e Acessos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre novos perfis, defina níveis de acesso e controle senhas ativas.
          </p>
        </div>
        <Button
          className="shadow-sm h-10 px-4 group"
          onClick={() => {
            setEditUser(null)
            setIsAddOpen(true)
          }}
          title="Atalho: Ctrl + N"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
          <span className="hidden group-hover:inline-block ml-2 text-[10px] font-mono opacity-70">
            Ctrl+N
          </span>
        </Button>
      </div>

      <Card className="border-border shadow-sm p-3 bg-card">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail ou perfil..."
            className="pl-9 h-10 bg-muted/50 border-input focus-visible:border-ring w-full text-sm"
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
                <TableHead>Nome e Contato</TableHead>
                <TableHead className="w-[160px]">Perfil de Acesso</TableHead>
                <TableHead className="w-[160px]">Último Acesso</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="text-right w-[160px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-muted text-foreground font-medium">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : 'Nunca acessou'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        user.status === 'Ativo'
                          ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                          : 'border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right p-2">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                        title="Redefinir Senha"
                        onClick={handleResetPassword}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Editar Permissões"
                        onClick={() => {
                          setEditUser(user)
                          setIsAddOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${user.status === 'Ativo' ? 'text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400' : 'text-rose-500 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                        title={user.status === 'Ativo' ? 'Suspender Acesso' : 'Reativar Acesso'}
                        onClick={() => handleToggleStatus(user.id, user.status)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum usuário encontrado para a busca.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={isAddOpen}
        onOpenChange={(o) => {
          setIsAddOpen(o)
          if (!o) setEditUser(null)
        }}
      >
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editUser ? 'Atualizar Dados de Acesso' : 'Cadastrar Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editUser
                ? 'Edite as informações de login e perfil.'
                : 'Defina o e-mail de login e a função no sistema.'}
            </DialogDescription>
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
                      <Input placeholder="Ex: Ana Souza" {...field} />
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
                    <FormLabel>E-mail (Login)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ana.souza@instituicao.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Permissão</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Gestao">Gestão/Diretoria</SelectItem>
                        <SelectItem value="Secretaria">Secretaria</SelectItem>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Aluno">Aluno</SelectItem>
                        <SelectItem value="Paciente">Paciente (ACR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!editUser && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs p-3 rounded-md">
                  Uma senha forte temporária será gerada e enviada para o e-mail cadastrado. O
                  usuário deverá alterá-la no primeiro acesso.
                </div>
              )}
              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editUser ? 'Salvar Alterações' : 'Criar Acesso'}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
