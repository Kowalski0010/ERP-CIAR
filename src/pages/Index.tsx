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
  Tooltip as RechartsTooltip,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

const mockAttendanceData = [
  { day: 'Seg', rate: 95 },
  { day: 'Ter', rate: 92 },
  { day: 'Qua', rate: 88 },
  { day: 'Qui', rate: 96 },
  { day: 'Sex', rate: 90 },
]

export default function Index() {
  const navigate = useNavigate()
  const { students, payments, logs } = useAppStore()

  // Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        navigate('/academic/students') // Nova Matrícula / Aluno
      }
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        navigate('/academic/control/lancar-frequencia') // Lançar Frequência
      }
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        navigate('/secretaria/efetuar-matricula') // Matrícula Direta
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const activeStudents = students.filter((s) => s.status === 'Ativo').length
  const totalRevenue = payments
    .filter((p) => p.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0)
  const totalDelinquency = payments
    .filter((p) => p.status === 'Atrasado')
    .reduce((acc, curr) => acc + curr.amount, 0)

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
    { name: 'Receita', value: totalRevenue, fill: '#10b981' },
    { name: 'Inadimplência', value: totalDelinquency, fill: '#f43f5e' },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 font-sans max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">Dashboard de Decisão</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Visão consolidada e atalhos rápidos para gestão operacional.
        </p>
      </div>

      {/* Smart Actions / FABs equivalent */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-zinc-800">Ações Rápidas (Atalhos)</h2>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
            <Keyboard className="w-3.5 h-3.5" /> Pressione{' '}
            <kbd className="font-mono">Alt + Letra</kbd>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-300 transition-all group"
            onClick={() => navigate('/academic/students')}
          >
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-blue-900">Novo Aluno</span>
              <span className="text-[10px] text-blue-600/70 font-mono mt-1">Alt + N</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
            onClick={() => navigate('/academic/control/lancar-frequencia')}
          >
            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-emerald-900">Lançar Frequência</span>
              <span className="text-[10px] text-emerald-600/70 font-mono mt-1">Alt + F</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-purple-200 bg-purple-50/50 hover:bg-purple-100 hover:border-purple-300 transition-all group"
            onClick={() => navigate('/secretaria/efetuar-matricula')}
          >
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-center">
              <span className="block font-bold text-purple-900">Nova Matrícula</span>
              <span className="text-[10px] text-purple-600/70 font-mono mt-1">Alt + M</span>
            </div>
          </Button>
        </div>
      </section>

      {/* BI KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Matrículas Ativas
              </p>
              <p className="text-3xl font-extrabold text-zinc-900">{activeStudents}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Faturamento Consolidado
              </p>
              <p className="text-3xl font-extrabold text-emerald-600">
                R$ {totalRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Índice de Inadimplência
              </p>
              <p className="text-3xl font-extrabold text-rose-600">
                R$ {totalDelinquency.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BI KPI Cards - Row 2 (New Portal metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Acessos ao Portal (Mês)
              </p>
              <p className="text-3xl font-extrabold text-zinc-900">{portalAccesses}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-50 flex items-center justify-center">
              <Laptop className="h-6 w-6 text-cyan-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Assinaturas Digitais
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-indigo-600">{signatureRate}%</p>
                <span className="text-xs font-semibold text-zinc-500 tracking-wider">
                  CONCLUÍDAS
                </span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <FileSignature className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-zinc-200 bg-white">
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
                <BarChart data={financialData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <RechartsTooltip cursor={{ fill: '#f4f4f5' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Taxa de Frequência Diária</CardTitle>
            <CardDescription className="text-xs">Presença global por dia da semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: 'Frequência %', color: 'hsl(var(--primary))' },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockAttendanceData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activities Feed */}
      <Card className="shadow-sm border-zinc-200 bg-white">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-zinc-400" /> Histórico Recente de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-900">{log.action}</span>
                    <Badge
                      variant="secondary"
                      className="bg-zinc-100 text-zinc-600 px-1.5 py-0 text-[10px] font-medium border border-zinc-200"
                    >
                      {log.user}
                    </Badge>
                  </div>
                  <span className="text-xs text-zinc-600">
                    {log.entity} {log.targetStudent ? `(${log.targetStudent})` : ''}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {new Date(log.timestamp).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-zinc-100 bg-zinc-50 flex justify-center">
            <Button
              variant="link"
              className="text-xs text-blue-600 h-auto p-0"
              onClick={() => navigate('/admin/audit-logs')}
            >
              Ver todo o histórico de auditoria &rarr;
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
