import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Wallet, ClipboardList, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { students, payments, attendances, schedules } = useAppStore()
  // Assuming logged in as first student
  const student = students[0]

  if (!student) return <div>Acesso negado.</div>

  const myPayments = payments.filter((p) => p.studentId === student.id && p.status !== 'Pago')
  const totalDue = myPayments.reduce((acc, curr) => acc + curr.amount, 0)

  const myAttendances = attendances.filter((a) => a.studentId === student.id)
  const totalClasses = myAttendances.reduce((acc, curr) => acc + curr.totalClasses, 0)
  const totalAbsences = myAttendances.reduce((acc, curr) => acc + curr.absences, 0)
  const freqRate =
    totalClasses > 0 ? (((totalClasses - totalAbsences) / totalClasses) * 100).toFixed(1) : '100'

  // Mock next class
  const nextClass = schedules.find((s) => s.classId === 'T01')

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Olá, {student.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Bem-vindo(a) ao seu Portal do Aluno. • {student.course}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-zinc-200 shadow-sm relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Próxima Aula
                </p>
                <p className="text-lg font-bold text-zinc-900 leading-tight">
                  {nextClass?.subject || 'Sem aulas hoje'}
                </p>
              </div>
              <div className="p-2 rounded bg-blue-50 text-blue-600">
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>
            {nextClass && (
              <div className="flex items-center gap-2 mt-auto">
                <Badge variant="outline" className="bg-zinc-50 text-[10px] font-mono">
                  {nextClass.startTime}
                </Badge>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {nextClass.room}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Situação Financeira
                </p>
                <p className="text-2xl font-bold text-zinc-900">
                  R$ {totalDue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 rounded bg-rose-50 text-rose-600">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-auto">
              {myPayments.length > 0 ? (
                <Link
                  to="/student-area/financial"
                  className="text-xs text-rose-600 font-medium hover:underline"
                >
                  Ver faturas pendentes &rarr;
                </Link>
              ) : (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  Tudo em dia! 🎉
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Frequência Global
                </p>
                <p className="text-2xl font-bold text-zinc-900">{freqRate}%</p>
              </div>
              <div className="p-2 rounded bg-emerald-50 text-emerald-600">
                <ClipboardList className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-auto text-xs text-zinc-500">
              {totalAbsences} faltas registradas no semestre
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-sm font-semibold text-zinc-900">Avisos Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="border-l-2 border-blue-500 pl-3">
              <h4 className="text-xs font-semibold text-zinc-900">Rematrícula Aberta</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Garanta sua vaga para o próximo semestre com desconto.
              </p>
            </div>
            <div className="border-l-2 border-zinc-300 pl-3">
              <h4 className="text-xs font-semibold text-zinc-900">Semana de Provas N1</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Início no dia 15/10. Verifique o calendário na secretaria.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm flex flex-col items-center justify-center p-6 bg-zinc-50/30 text-center">
          <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
            <BookOpen className="h-5 w-5 text-zinc-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">Biblioteca Virtual</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-[250px]">
            Acesse milhares de e-books e artigos científicos disponíveis para seu curso.
          </p>
          <Button variant="outline" size="sm" className="mt-4 h-8 text-xs font-medium bg-white">
            Acessar Acervo
          </Button>
        </Card>
      </div>
    </div>
  )
}
