import { useParams, Link } from 'react-router-dom'
import { Database, Search, Plus, Filter, Edit, Trash2, ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import { useToast } from '@/hooks/use-toast'

export default function RegistryView() {
  const { id } = useParams()
  const { toast } = useToast()

  // Format ID for display
  const title = id
    ? id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Cadastro Básico'

  const mockData = Array.from({ length: 5 }).map((_, i) => ({
    id: `REG-00${i + 1}`,
    name: `${title} - Exemplo ${i + 1}`,
    description: `Registro genérico para módulo de ${title.toLowerCase()}`,
    status: i % 3 === 0 ? 'Inativo' : 'Ativo',
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('pt-BR'),
  }))

  const handleAction = (action: string) => {
    toast({
      title: `Ação: ${action}`,
      description: `Funcionalidade '${action}' acionada no módulo de ${title}.`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 -ml-1 text-zinc-500" asChild>
              <Link to="/">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge
              variant="secondary"
              className="bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-widest"
            >
              Administração / Cadastro
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Database className="h-6 w-6 text-zinc-400" />
            Gestão de {title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Interface padronizada para manutenção de registros de sistema.
          </p>
        </div>
        <Button className="shadow-sm h-9 px-4" onClick={() => handleAction('Novo Registro')}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Novo
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm p-3 bg-white">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Pesquisar registros..."
              className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 shrink-0 text-xs w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2 text-zinc-400" /> Filtros
          </Button>
        </div>
      </Card>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Nome / Identificação</TableHead>
              <TableHead className="hidden md:table-cell">Descrição Breve</TableHead>
              <TableHead className="w-[120px]">Criado em</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="text-right w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id} className="hover:bg-zinc-50/50 transition-colors group">
                <TableCell className="font-mono text-xs text-zinc-500">{row.id}</TableCell>
                <TableCell className="font-semibold text-zinc-900 text-xs">{row.name}</TableCell>
                <TableCell className="text-xs text-zinc-500 hidden md:table-cell truncate max-w-xs">
                  {row.description}
                </TableCell>
                <TableCell className="text-xs text-zinc-500">{row.date}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      row.status === 'Ativo'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right p-1">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => handleAction('Editar')}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => handleAction('Excluir')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 border-t border-zinc-100 bg-zinc-50 text-[11px] text-zinc-400 text-right font-mono">
          Exibindo {mockData.length} registros
        </div>
      </div>
    </div>
  )
}
