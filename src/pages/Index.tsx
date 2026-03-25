import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Wallet,
  Activity,
  UserPlus,
  ClipboardCheck,
  GraduationCap,
  Keyboard,
  TrendingUp,
  AlertTriangle,
  FileSignature,
  Laptop,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAppStore } from '@/contexts/AppContext'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const mockAttendanceData = [
  { day: 'Seg', rate: 95 },
  { day: 'Ter', rate: 92 },
  { day: 'Qua', rate: 88 },
  { day: 'Qui', rate: 96 },
  { day: 'Sex', rate: 90 },
]

export default function Index() {
  const navigate = useNavigate()
  const { students, payments } = useAppStore()

  // Shortcuts Listener (Safely handled to prevent keydown crashes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return
      const key = e.key.toLowerCase()

      if (e.altKey && key === 'n') {
        e.preventDefault()
        navigate('/academic/students') // Nova Matrícula / Aluno
      }
      if (e.altKey && key === 'f') {
        e.preventDefault()
        navigate('/academic/control/lancar-frequencia') // Lançar Frequência
      }
      if (e.altKey && key === 'm') {
        e.preventDefault()
        navigate('/secretaria/efetuar-matricula') // Matrícula Direta
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const activeStudents = students.filter((s) => s.status === 'Ativo').length || 0
  const totalRevenue = payments
    .filter((p) => p.status === 'Pago')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const totalDelinquency = payments
    .filter((p) => p.status === 'Atrasado')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0)

  // Document Signatures and Portal KPI metrics
  const totalDocuments = students.reduce((acc, s) => acc + (s.documents?.length || 0), 0)
  const signedDocuments = students.reduce(
    (acc, s) => acc + (s.documents?.filter((d) => d.status === 'Assinado').length || 0),
    0,
  )
  const signatureRate =
    totalDocuments > 0 ? Math.round((signedDocuments / totalDocuments) * 100) : 0
  const portalAccesses = 1240 // mock value

  const financialData = [
    { name: 'Receita', value: totalRevenue, fill: 'hsl(var(--primary))' },
    { name: 'Inadimplência', value: totalDelinquency, fill: 'hsl(var(--destructive))' },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 font-sans max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">Dashboard de Decisão</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão consolidada e atalhos rápidos para gestão operacional.
        </p>
      </div>

      {/* Smart Actions / FABs equivalent */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Ações Rápidas (Atalhos)</h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded border border-border">
            <Keyboard className="w-3.5 h-3.5" /> Pressione{' '}
            <kbd className="font-mono">Alt + Letra</kbd>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all group"
            onClick={() => navigate('/academic/students')}
          >
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-blue-900 dark:text-blue-200">Novo Aluno</span>
              <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-mono mt-1">
                Alt + N
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all group"
            onClick={() => navigate('/academic/control/lancar-frequencia')}
          >
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-emerald-900 dark:text-emerald-200">
                Lançar Frequência
              </span>
              <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-mono mt-1">
                Alt + F
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all group"
            onClick={() => navigate('/secretaria/efetuar-matricula')}
          >
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-purple-900 dark:text-purple-200">
                Nova Matrícula
              </span>
              <span className="text-[10px] text-purple-600/70 dark:text-purple-400/70 font-mono mt-1">
                Alt + M
              </span>
            </div>
          </Button>
        </div>
      </section>

      {/* BI KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Matrículas Ativas
              </p>
              <p className="text-3xl font-extrabold text-foreground">{activeStudents}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Faturamento Consolidado
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Índice de Inadimplência
              </p>
              <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-500">
                R$ {totalDelinquency.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BI KPI Cards - Row 2 (New Portal metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Acessos ao Portal (Mês)
              </p>
              <p className="text-3xl font-extrabold text-foreground">{portalAccesses}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center">
              <Laptop className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Assinaturas Digitais
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {signatureRate}%
                </p>
                <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                  CONCLUÍDAS
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <FileSignature className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Saúde Financeira</CardTitle>
            <CardDescription className="text-xs">
              Recebimentos vs. Em Atraso (Mês Atual)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: 'Valor R$', color: 'hsl(var(--primary))' },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <ChartTooltip
                    cursor={{ fill: 'transparent' }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}></Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Frequência Semanal Média</CardTitle>
            <CardDescription className="text-xs">
              Taxa de presença dos alunos por dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: 'Presença (%)', color: 'hsl(var(--primary))' },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockAttendanceData}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-rate)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Histórico e Relatórios',
            url: '/reports/custom',
            icon: Activity,
            color: 'text-indigo-500',
          },
          {
            label: 'Gestão de Estoque',
            url: '/inventory/stock',
            icon: Wallet,
            color: 'text-emerald-500',
          },
          {
            label: 'Corpo Docente',
            url: '/academic/teachers',
            icon: Users,
            color: 'text-blue-500',
          },
          {
            label: 'Configurações',
            url: '/admin/settings',
            icon: Keyboard,
            color: 'text-muted-foreground',
          },
        ].map((item) => (
          <Button
            key={item.label}
            variant="outline"
            className="h-16 justify-start px-4 flex items-center gap-3 bg-card hover:bg-muted/50"
            onClick={() => navigate(item.url)}
          >
            <div className={`p-2 rounded bg-muted/50 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="font-semibold text-sm">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
