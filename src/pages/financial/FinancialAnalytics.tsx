import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'

// Mock Data
const cashFlowData = [
  { month: 'Jan', receitas: 45000, despesas: 32000 },
  { month: 'Fev', receitas: 52000, despesas: 34000 },
  { month: 'Mar', receitas: 60000, despesas: 36000 },
  { month: 'Abr', receitas: 58000, despesas: 35000 },
  { month: 'Mai', receitas: 62000, despesas: 38000 },
  { month: 'Jun', receitas: 65000, despesas: 40000 },
]

const delinquencyData = [
  { month: 'Jan', real: 5.2, projetado: 5.0 },
  { month: 'Fev', real: 4.8, projetado: 4.9 },
  { month: 'Mar', real: 5.5, projetado: 5.1 },
  { month: 'Abr', real: 5.8, projetado: 5.3 },
  { month: 'Mai', real: null, projetado: 5.0 },
  { month: 'Jun', real: null, projetado: 4.8 },
]

const cashFlowConfig = {
  receitas: { label: 'Receitas (R$)', color: 'hsl(var(--primary))' },
  despesas: { label: 'Despesas (R$)', color: 'hsl(var(--muted-foreground))' },
}

const delinquencyConfig = {
  real: { label: 'Taxa Real (%)', color: '#ef4444' },
  projetado: { label: 'Projeção Preditiva (%)', color: '#f59e0b' },
}

export default function FinancialAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-emerald-600" />
            Análise Financeira Avançada (BI)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Dashboards preditivos de fluxo de caixa e controle de inadimplência escolar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base flex items-center gap-2 text-zinc-800">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Fluxo de Caixa Mensal
            </CardTitle>
            <CardDescription className="text-xs">
              Comparativo entre receitas liquidadas e despesas operacionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={cashFlowConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    tickFormatter={(val) => `R$${val / 1000}k`}
                  />
                  <Tooltip cursor={{ fill: '#f4f4f5' }} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
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

        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base flex items-center gap-2 text-zinc-800">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Projeção de Inadimplência
            </CardTitle>
            <CardDescription className="text-xs">
              Taxa real de faturas vencidas vs. modelo preditivo do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={delinquencyConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={delinquencyData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717a' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip cursor={{ fill: '#f4f4f5' }} content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="real"
                    stroke="var(--color-real)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: 'var(--color-real)' }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="projetado"
                    stroke="var(--color-projetado)"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
