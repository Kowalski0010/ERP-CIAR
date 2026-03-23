import { useState } from 'react'
import { Key, Save, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

const roles = ['Admin', 'Professor', 'Paciente', 'Aluno', 'Secretaria', 'Financeiro']

const modules = [
  'Dashboard Analytics',
  'Prontuários Clínicos (ACR)',
  'Portal do Paciente',
  'Portal do Aluno',
  'Gestão Acadêmica (Notas/Frequência)',
  'Gestão Financeira',
  'Configurações do Sistema',
]

const initialPermissions: Record<
  string,
  Record<string, { read: boolean; write: boolean; delete: boolean }>
> = {
  Admin: modules.reduce(
    (acc, mod) => ({ ...acc, [mod]: { read: true, write: true, delete: true } }),
    {},
  ),
  Professor: modules.reduce(
    (acc, mod) => ({
      ...acc,
      [mod]: {
        read: [
          'Prontuários Clínicos (ACR)',
          'Gestão Acadêmica (Notas/Frequência)',
          'Portal do Aluno',
        ].includes(mod),
        write: ['Prontuários Clínicos (ACR)', 'Gestão Acadêmica (Notas/Frequência)'].includes(mod),
        delete: false,
      },
    }),
    {},
  ),
  Paciente: modules.reduce(
    (acc, mod) => ({
      ...acc,
      [mod]: {
        read: mod === 'Portal do Paciente',
        write: false,
        delete: false,
      },
    }),
    {},
  ),
  Aluno: modules.reduce(
    (acc, mod) => ({
      ...acc,
      [mod]: {
        read: mod === 'Portal do Aluno',
        write: false,
        delete: false,
      },
    }),
    {},
  ),
  Secretaria: modules.reduce(
    (acc, mod) => ({
      ...acc,
      [mod]: {
        read: !mod.includes('Clínicos'),
        write: !mod.includes('Clínicos') && !mod.includes('Sistema'),
        delete: false,
      },
    }),
    {},
  ),
  Financeiro: modules.reduce(
    (acc, mod) => ({
      ...acc,
      [mod]: {
        read: ['Gestão Financeira', 'Dashboard Analytics'].includes(mod),
        write: mod === 'Gestão Financeira',
        delete: false,
      },
    }),
    {},
  ),
}

export default function AccessControl() {
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState('Professor')
  const [permissions, setPermissions] = useState(initialPermissions)

  const handleToggle = (mod: string, action: 'read' | 'write' | 'delete') => {
    setPermissions((prev) => {
      const rolePerms = { ...prev[selectedRole] }
      rolePerms[mod] = { ...rolePerms[mod], [action]: !rolePerms[mod][action] }
      return { ...prev, [selectedRole]: rolePerms }
    })
  }

  const handleSave = () => {
    toast({
      title: 'Permissões Atualizadas',
      description: `As regras de acesso para o perfil ${selectedRole} foram aplicadas no sistema.`,
    })
  }

  const currentPerms =
    permissions[selectedRole] ||
    modules.reduce(
      (acc, mod) => ({ ...acc, [mod]: { read: false, write: false, delete: false } }),
      {},
    )

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Key className="h-7 w-7 text-zinc-400" />
            Gestão de Perfis e Permissões (RBAC)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Configure quais módulos cada tipo de usuário (Admin, Professor, Paciente, etc) pode
            visualizar ou alterar.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Selecionar Perfil</CardTitle>
            <CardDescription className="text-xs">
              Escolha o grupo para visualizar ou editar as permissões.
            </CardDescription>
          </div>
          <div className="w-full sm:w-64">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-compact">
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Módulo do Sistema</TableHead>
                <TableHead className="text-center">Visualizar (Ler)</TableHead>
                <TableHead className="text-center">Criar / Editar (Escrever)</TableHead>
                <TableHead className="text-center">Remover (Excluir)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((mod) => {
                const perms = currentPerms[mod]
                return (
                  <TableRow key={mod} className="hover:bg-zinc-50/50">
                    <TableCell className="font-medium text-zinc-900 text-sm">{mod}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={perms.read}
                        onCheckedChange={() => handleToggle(mod, 'read')}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={perms.write}
                        onCheckedChange={() => handleToggle(mod, 'write')}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={perms.delete}
                        onCheckedChange={() => handleToggle(mod, 'delete')}
                        className="data-[state=checked]:bg-rose-500"
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <ShieldAlert className="h-4 w-4" />
              Alterações aplicam-se imediatamente no próximo acesso dos usuários.
            </div>
            <Button onClick={handleSave} className="shadow-sm">
              <Save className="h-4 w-4 mr-2" /> Salvar Matriz de Acesso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
