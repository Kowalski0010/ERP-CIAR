import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Bell, FileText, Wallet, GraduationCap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ParentDashboard() {
  const { students, payments, attendances, notifications } = useAppStore()
  // Mock finding dependent (using the first student available in mock data)
  const dependent = students[0]

  if (!dependent) return <div>Sem dependentes vinculados.</div>

  const dependentPayments = payments.filter((p) => p.studentId === dependent.id)
  const dependentGrades = attendances.filter((a) => a.studentId === dependent.id)
  const schoolNotices = notifications.filter((n) => n.target === 'Todos' || n.target === 'Alunos')

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <Users className="h-7 w-7 text-zinc-400" />
          Portal da Família
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Acompanhamento acadêmico e financeiro de:{' '}
          <strong className="text-zinc-800">{dependent.name}</strong>
        </p>
      </div>

      <Tabs defaultValue="boletos" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto mb-4">
          <TabsTrigger value="boletos">
            <Wallet className="w-4 h-4 mr-2" /> Financeiro (Boletos)
          </TabsTrigger>
          <TabsTrigger value="notas">
            <GraduationCap className="w-4 h-4 mr-2" /> Boletim e Notas
          </TabsTrigger>
          <TabsTrigger value="avisos">
            <Bell className="w-4 h-4 mr-2" /> Avisos Escolares
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boletos">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle className="text-base text-zinc-800">Faturas e Mensalidades</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="table-compact">
                <TableHeader>
                  <TableRow>
                    <TableHead>Referência</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependentPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-xs">
                        {p.installmentNumber ? `Parcela ${p.installmentNumber}` : 'Avulsa'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(p.dueDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-bold text-sm text-zinc-900">
                        R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.status === 'Pago' ? 'outline' : 'default'}
                          className={
                            p.status === 'Pago'
                              ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                              : p.status === 'Atrasado'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {p.status !== 'Pago' && (
                          <Button size="sm" variant="secondary" className="h-8 text-xs">
                            <FileText className="w-3.5 h-3.5 mr-1" /> Boleto
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notas">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
              <CardTitle className="text-base text-zinc-800">Desempenho Acadêmico</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="table-compact">
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="text-center">Faltas</TableHead>
                    <TableHead className="text-center">Média Parcial</TableHead>
                    <TableHead>Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependentGrades.map((g, i) => {
                    const grade = 8.5 - i * 2.5 // Mock grade variation to show low performance
                    const isLow = grade < 7.0
                    return (
                      <TableRow key={g.id}>
                        <TableCell className="font-semibold text-xs text-zinc-900">
                          {g.subject}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {g.absences} / {g.totalClasses}
                        </TableCell>
                        <TableCell className="text-center font-bold text-zinc-900">
                          {grade.toFixed(1)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              !isLow
                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                : 'border-rose-200 text-rose-700 bg-rose-50'
                            }
                          >
                            {!isLow ? 'Na Média' : 'Atenção (Abaixo da Média)'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avisos">
          <div className="space-y-4">
            {schoolNotices.map((n) => (
              <Card key={n.id} className="border-zinc-200 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-zinc-900">{n.title}</h3>
                    <span className="text-xs text-zinc-500 font-mono">
                      {new Date(n.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">{n.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
