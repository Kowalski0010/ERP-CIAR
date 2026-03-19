import { useAppStore } from '@/contexts/AppContext'
import { Users, DollarSign, Target, AlertCircle, TrendingUp, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { mockFinancialChart } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const chartConfig = {
  receitas: { label: 'Receitas', color: 'hsl(var(--chart-2))' },
  despesas: { label: 'Despesas', color: 'hsl(var(--chart-4))' },
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
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe os principais indicadores da instituição (Visão: {currentUserRole}).
          </p>
        </div>
        <div className="flex gap-2">
          {isCommercial && (
            <Button asChild>
              <Link to="/commercial/leads">Novo Lead</Link>
            </Button>
          )}
          {isAcademic && (
            <Button variant={isCommercial ? 'secondary' : 'default'} asChild>
              <Link to="/academic/students">Matricular Aluno</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isAcademic && (
          <Card className="hover:shadow-md transition-shadow duration-300 border-none shadow-subtle group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Alunos Ativos</p>
                  <p className="text-3xl font-bold">{activeStudents}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-medium">+12% este mês</p>
            </CardContent>
          </Card>
        )}

        {isFinancial && (
          <>
            <Card className="hover:shadow-md transition-shadow duration-300 border-none shadow-subtle group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Receita (Mês)</p>
                    <p className="text-3xl font-bold">
                      R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 font-medium">+8% vs mês passado</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300 border-none shadow-subtle group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Inadimplência</p>
                    <p className="text-3xl font-bold">{pendingPayments}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="h-6 w-6 text-rose-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 font-medium">Requer atenção</p>
              </CardContent>
            </Card>
          </>
        )}

        {isCommercial && (
          <Card className="hover:shadow-md transition-shadow duration-300 border-none shadow-subtle group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Novos Leads</p>
                  <p className="text-3xl font-bold">{newLeads}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-medium">Aguardando contato</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isFinancial && (
          <Card
            className={`col-span-1 border-none shadow-subtle ${isAcademic ? 'lg:col-span-2' : 'lg:col-span-3'}`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                Balanço Financeiro (Últimos 6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockFinancialChart}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
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
                    <Legend verticalAlign="top" height={36} iconType="circle" />
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
            className={`col-span-1 border-none shadow-subtle flex flex-col ${!isFinancial ? 'lg:col-span-3' : ''}`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                Avisos Acadêmicos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-6">
                {[
                  { time: '09:00', title: 'Reunião de Professores', type: 'Evento' },
                  {
                    time: '14:30',
                    title: 'Fechamento de Notas 3º Bim',
                    type: 'Prazo',
                    urgent: true,
                  },
                  { time: '16:00', title: 'Visita Técnica: Turma Eng', type: 'Aula Externa' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-muted-foreground w-12 text-right">
                        {item.time}
                      </span>
                      {i !== 2 && <div className="w-[2px] h-full bg-border mt-2 rounded-full" />}
                    </div>
                    <div
                      className={`flex-1 p-3 rounded-lg border ${item.urgent ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/10' : 'bg-muted/50 border-transparent'}`}
                    >
                      <p className="text-sm font-medium">{item.title}</p>
                      <span
                        className={`text-xs ${item.urgent ? 'text-rose-600' : 'text-muted-foreground'}`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 text-sm" asChild>
                <Link to="/academic/classes">Ver Agenda Completa</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
