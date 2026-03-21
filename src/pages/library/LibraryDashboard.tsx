import { useMemo } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { BookOpen, AlertTriangle } from 'lucide-react'

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']

export default function LibraryDashboard() {
  const { loans, students } = useAppStore()

  // Prepare Top 10 Most Read Books data
  const topBooksData = useMemo(() => {
    const counts: Record<string, number> = {}
    loans.forEach((l) => {
      counts[l.bookTitle] = (counts[l.bookTitle] || 0) + 1
    })
    return Object.keys(counts)
      .map((k) => ({ name: k, value: counts[k] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [loans])

  // Prepare Delinquency Ranking by Course
  const delinquencyData = useMemo(() => {
    const overdueLoans = loans.filter(
      (l) => l.status === 'Ativo' && new Date() > new Date(l.expectedReturnDate),
    )
    const courseCounts: Record<string, number> = {}

    overdueLoans.forEach((loan) => {
      const student = students.find((s) => s.id === loan.studentId)
      const course = student ? student.course : 'Desconhecido'
      courseCounts[course] = (courseCounts[course] || 0) + 1
    })

    return Object.keys(courseCounts).map((k) => ({ name: k, value: courseCounts[k] }))
  }, [loans, students])

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-zinc-400" />
            Dashboard da Biblioteca (BI)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Métricas de popularidade de acervo e ranking de inadimplência de devoluções.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base font-semibold text-zinc-800">
              Top Livros Mais Emprestados
            </CardTitle>
            <CardDescription className="text-xs">
              Histórico consolidado de todas as saídas no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {topBooksData.length > 0 ? (
              <ChartContainer
                config={{ value: { label: 'Empréstimos', color: 'hsl(var(--primary))' } }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topBooksData}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#e4e4e7"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#3f3f46' }}
                      width={140}
                    />
                    <Tooltip cursor={{ fill: '#f4f4f5' }} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm">
                Dados insuficientes para exibir o gráfico.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base font-semibold text-zinc-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Inadimplência por Curso
            </CardTitle>
            <CardDescription className="text-xs">
              Volume de livros com prazo de devolução expirado.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {delinquencyData.length > 0 ? (
              <ChartContainer
                config={{ value: { label: 'Atrasados' } }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={delinquencyData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {delinquencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`${val} Livros`, 'Atrasados']} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm">
                Nenhuma inadimplência registrada. Excelente!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
