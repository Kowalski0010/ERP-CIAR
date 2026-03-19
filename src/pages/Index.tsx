import { useAppStore } from '@/contexts/AppContext'
import {
  Users,
  DollarSign,
  Target,
  AlertCircle,
  TrendingUp,
  BookOpen,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { mockFinancialChart } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

const chartConfig = {
  receitas: { label: 'Receitas', color: 'hsl(var(--primary))' },
  despesas: { label: 'Despesas', color: 'hsl(var(--muted-foreground))' },
}

export default function Index() {
  const { students, leads, payments, currentUserRole } = useAppStore()

  const activeStudents = students.filter((s) => s.status === 'Ativo').length
  const newLeads = leads.filter((l) => l.status === 'Novo').length
  const pendingPayments = payments.filter(
    (p) => p.status === 'Pendente' || p.status === 'Atrasado',
  ).length
  const totalRevenue = payments
    .filter((p) => p.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const isAcademic = currentUserRole === 'Admin' || currentUserRole === 'Academico'
  const isFinancial = currentUserRole === 'Admin' || currentUserRole === 'Financeiro'
  const isCommercial = currentUserRole === 'Admin' || currentUserRole === 'Comercial'

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão gerencial consolidada • Perfil: {currentUserRole}
          </p>
        </div>
        <div className="flex gap-2">
          {isCommercial && (
            <Button variant="outline" size="sm" asChild className="h-9">
              <Link to="/commercial/leads">Gerenciar Leads</Link>
            </Button>
          )}
          {isAcademic && (
            <Button size="sm" asChild className="h-9">
              <Link to="/academic/students">Nova Matrícula</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isAcademic && (
          <Card className="shadow-subtle border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total de Alunos
                  </p>
                  <p className="text-2xl font-bold text-foreground">{activeStudents}</p>
                </div>
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                <ChevronUp className="h-3 w-3 mr-1" />
                <span>12% em relação ao mês anterior</span>
              </div>
            </CardContent>
          </Card>
        )}

        {isFinancial && (
          <>
            <Card className="shadow-subtle border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Receita Mensal
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  <span>8.4% acima da meta</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Inadimplência
                    </p>
                    <p className="text-2xl font-bold text-foreground">{pendingPayments}</p>
                  </div>
                  <div className="p-2 rounded-md bg-rose-500/10 text-rose-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-rose-600 font-medium">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  <span>Requer atenção imediata</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {isCommercial && (
          <Card className="shadow-subtle border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Leads Ativos
                  </p>
                  <p className="text-2xl font-bold text-foreground">{newLeads}</p>
                </div>
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-600">
                  <Target className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground font-medium">
                <span>Aguardando primeiro contato</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isFinancial && (
          <Card
            className={`col-span-1 border-border/50 shadow-subtle ${isAcademic ? 'lg:col-span-2' : 'lg:col-span-3'}`}
          >
            <CardHeader className="border-b border-border/50 bg-muted/10 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Desempenho Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockFinancialChart}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(val) => `R$${val / 1000}k`}
                    />
                    <ChartTooltip
                      cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                      content={<ChartTooltipContent />}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Bar
                      dataKey="receitas"
                      fill="var(--color-receitas)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                    <Bar
                      dataKey="despesas"
                      fill="var(--color-despesas)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {isAcademic && (
          <Card
            className={`col-span-1 border-border/50 shadow-subtle flex flex-col ${!isFinancial ? 'lg:col-span-3' : ''}`}
          >
            <CardHeader className="border-b border-border/50 bg-muted/10 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Agenda Acadêmica
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-6 px-0">
              <div className="space-y-0 divide-y divide-border/50">
                {[
                  { time: '09:00', title: 'Reunião de Coordenação', type: 'Institucional' },
                  {
                    time: '14:30',
                    title: 'Fechamento de Notas 3º Bimestre',
                    type: 'Prazo Limite',
                    urgent: true,
                  },
                  {
                    time: '16:00',
                    title: 'Visita Técnica: Turma Eng. Software',
                    type: 'Atividade Externa',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col items-center justify-start pt-1">
                      <span className="text-xs font-semibold text-muted-foreground w-12 text-right tabular-nums">
                        {item.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${item.urgent ? 'text-rose-600' : 'text-foreground'}`}
                      >
                        {item.title}
                      </p>
                      <span className="text-xs text-muted-foreground mt-1 block">{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pt-2">
                <Button variant="outline" size="sm" className="w-full text-xs font-medium" asChild>
                  <Link to="/academic/classes">Ver Agenda Completa</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
