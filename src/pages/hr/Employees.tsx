import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Employee } from '@/lib/types'
import { Search, Plus, FileText, UserCircle, Briefcase } from 'lucide-react'
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
import { Label } from '@/components/ui/label'

export default function Employees() {
  const { employees } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Recursos Humanos</h1>
          <p className="text-sm text-zinc-500 mt-1">Gestão de colaboradores e contratos.</p>
        </div>
        <Button className="shadow-sm h-9 px-4">
          <Plus className="mr-2 h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome ou departamento..."
            className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <Table className="table-compact">
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>Colaborador</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow key={emp.id} className="hover:bg-zinc-50/80 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-md border border-zinc-200">
                      <AvatarImage src={emp.avatar} />
                      <AvatarFallback className="rounded-md bg-zinc-100 text-zinc-900 text-xs">
                        {emp.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 text-xs">{emp.name}</span>
                      <span className="text-[10px] text-zinc-500">{emp.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-700">{emp.department}</TableCell>
                <TableCell className="text-xs text-zinc-700">{emp.position}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      emp.status === 'Ativo'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                    }
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] font-medium"
                    onClick={() => setSelectedEmp(emp)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedEmp} onOpenChange={(open) => !open && setSelectedEmp(null)}>
        <SheetContent className="sm:max-w-[500px] p-0 flex flex-col bg-zinc-50">
          {selectedEmp && (
            <>
              <SheetHeader className="p-6 bg-white border-b border-zinc-200 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border border-zinc-200 shadow-sm">
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
                  <TabsList className="grid w-full grid-cols-3 bg-zinc-200/50 p-1 rounded-md mb-4 flex-shrink-0">
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
                      <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-zinc-500">Email</Label>
                          <Input
                            readOnly
                            value={selectedEmp.email}
                            className="h-8 text-xs bg-zinc-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-zinc-500">Telefone</Label>
                          <Input
                            readOnly
                            value={selectedEmp.phone}
                            className="h-8 text-xs bg-zinc-50"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="contrato" className="space-y-4 m-0">
                      <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-zinc-500">Admissão</Label>
                          <Input
                            readOnly
                            value={new Date(selectedEmp.admissionDate).toLocaleDateString('pt-BR')}
                            className="h-8 text-xs bg-zinc-50"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-zinc-500">
                            Salário Base
                          </Label>
                          <Input
                            readOnly
                            value={`R$ ${selectedEmp.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            className="h-8 text-xs bg-zinc-50"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="docs" className="space-y-2 m-0">
                      {['Contrato de Trabalho.pdf', 'Termo de Confidencialidade.pdf'].map((doc) => (
                        <div
                          key={doc}
                          className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-2 text-zinc-700">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-medium">{doc}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                            Baixar
                          </Button>
                        </div>
                      ))}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
