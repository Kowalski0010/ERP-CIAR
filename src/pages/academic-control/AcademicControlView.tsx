import { useParams, Link } from 'react-router-dom'
import { BookOpen, Search, Filter, Plus, Save, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export default function AcademicControlView() {
  const { id } = useParams()
  const title = id
    ? id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Módulo Acadêmico'
  const isForm = id?.startsWith('lancar-')

  const mockData = Array.from({ length: 6 }).map((_, i) => ({
    id: `REQ-${Math.floor(Math.random() * 10000)}`,
    ref: `Aluno/Docente ${i + 1}`,
    desc: `${title} - Registro #00${i + 1}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('pt-BR'),
    status: ['Pendente', 'Processado', 'Aprovado'][Math.floor(Math.random() * 3)],
  }))

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
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 text-[10px]">
              Controle Acadêmico
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-zinc-400" />
            {title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerenciamento de registros e processos acadêmicos integrados.
          </p>
        </div>
        {!isForm && (
          <Button className="shadow-sm h-9 px-4">
            <Plus className="mr-2 h-4 w-4" /> Novo Registro
          </Button>
        )}
      </div>

      {isForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-zinc-200">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
              <CardTitle className="text-sm font-semibold">Formulário de Lançamento</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-700">Aluno/Turma</Label>
                  <Input placeholder="Buscar entidade..." className="text-xs h-9 bg-zinc-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-700">Data de Referência</Label>
                  <Input type="date" className="text-xs h-9 bg-zinc-50" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-semibold text-zinc-700">Observações/Valores</Label>
                  <textarea
                    className="w-full min-h-[100px] p-3 text-xs rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50 resize-none"
                    placeholder="Detalhes complementares do lançamento..."
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-zinc-100">
                <Button className="shadow-sm">
                  <Save className="h-4 w-4 mr-2" /> Efetivar Lançamento
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-zinc-200 bg-zinc-50/30">
            <CardHeader className="border-b border-zinc-100 py-4">
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Últimos Lançamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {mockData.slice(0, 4).map((d) => (
                  <div key={d.id} className="p-3 hover:bg-zinc-100 transition-colors text-xs">
                    <div className="flex justify-between font-semibold text-zinc-900 mb-1">
                      <span>{d.ref}</span>
                      <span className="text-zinc-500 font-normal">{d.date}</span>
                    </div>
                    <p className="text-zinc-600 truncate">{d.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar registros..."
                className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 shrink-0 text-xs">
              <Filter className="h-4 w-4 mr-2" /> Filtros Avançados
            </Button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <Table className="table-compact">
              <TableHeader className="bg-zinc-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">Protocolo</TableHead>
                  <TableHead className="w-[200px]">Referência</TableHead>
                  <TableHead>Descrição / Detalhe</TableHead>
                  <TableHead className="w-[120px]">Data</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                    <TableCell className="font-mono text-xs text-zinc-500">{row.id}</TableCell>
                    <TableCell className="font-semibold text-zinc-900 text-xs">{row.ref}</TableCell>
                    <TableCell className="text-xs text-zinc-600">{row.desc}</TableCell>
                    <TableCell className="text-xs text-zinc-600">{row.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          row.status === 'Aprovado' || row.status === 'Processado'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-2">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium">
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
