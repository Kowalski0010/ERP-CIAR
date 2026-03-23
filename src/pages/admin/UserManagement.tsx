import { useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Role } from '@/lib/types'

export default function UserManagement() {
  const { systemUsers, addSystemUser, updateSystemUser } = useAppStore()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)

  const filteredUsers = systemUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addSystemUser({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      role: fd.get('role') as Role,
      status: 'Ativo',
    })
    toast({
      title: 'Usuário Criado',
      description: 'O acesso foi gerado. A senha temporária foi enviada por e-mail.',
    })
    setIsAddOpen(false)
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
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Shield className="h-7 w-7 text-zinc-400" />
            Gestão de Usuários e Acessos
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Cadastre novos perfis, defina níveis de acesso e controle senhas ativas.
          </p>
        </div>
        <Button className="shadow-sm h-10 px-4" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm p-3 bg-white">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome, e-mail ou perfil..."
            className="pl-9 h-10 bg-zinc-50/50 border-zinc-200 focus-visible:border-zinc-300 w-full text-sm"
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
                <TableHead>Nome e Contato</TableHead>
                <TableHead className="w-[160px]">Perfil de Acesso</TableHead>
                <TableHead className="w-[160px]">Último Acesso</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="text-right w-[160px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 text-sm">{user.name}</span>
                      <span className="text-xs text-zinc-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 font-medium">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500 font-mono">
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
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-rose-200 bg-rose-50 text-rose-700'
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
                        className="h-8 w-8 text-zinc-500 hover:text-blue-600"
                        title="Redefinir Senha"
                        onClick={handleResetPassword}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
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
                        className={`h-8 w-8 ${user.status === 'Ativo' ? 'text-zinc-500 hover:text-rose-600' : 'text-rose-500 hover:text-emerald-600'}`}
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
                  <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
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
        <DialogContent className="max-w-md bg-white">
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
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input name="name" required defaultValue={editUser?.name} />
            </div>
            <div className="space-y-2">
              <Label>E-mail (Login)</Label>
              <Input name="email" type="email" required defaultValue={editUser?.email} />
            </div>
            <div className="space-y-2">
              <Label>Perfil de Permissão</Label>
              <Select name="role" required defaultValue={editUser?.role || 'Secretaria'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Gestao">Gestão/Diretoria</SelectItem>
                  <SelectItem value="Secretaria">Secretaria</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Aluno">Aluno</SelectItem>
                  <SelectItem value="Paciente">Paciente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editUser && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-md">
                Uma senha forte temporária será gerada e enviada para o e-mail cadastrado. O usuário
                deverá alterá-la no primeiro acesso.
              </div>
            )}
            <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editUser ? 'Salvar Alterações' : 'Criar Acesso'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
