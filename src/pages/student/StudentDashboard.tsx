import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  CalendarDays,
  Wallet,
  ClipboardList,
  BookOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { students, payments, attendances, schedules } = useAppStore()
  // Assuming logged in as first student for the mock portal
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

  // Mock AI Logic to find low performance subjects
  const aiRecommendations = myAttendances
    .map((att, i) => {
      const grade = 8.5 - i * 2.5 // matching parent portal mock logic
      return { ...att, grade, isLow: grade < 7.0 }
    })
    .filter((att) => att.isLow)

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
                <Badge
                  variant="outline"
                  className="bg-zinc-50 text-[10px] font-mono border-zinc-200"
                >
                  {nextClass.startTime}
                </Badge>
                <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                  <BookOpen className="w-3.5 h-3.5" /> {nextClass.room}
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
                  to="/student/financial"
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Ver faturas pendentes &rarr;
                </Link>
              ) : (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
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
            <div className="mt-auto text-xs font-medium text-zinc-500">
              {totalAbsences} faltas registradas no semestre
            </div>
          </CardContent>
        </Card>

        {aiRecommendations.length > 0 && (
          <Card className="border-indigo-200 shadow-sm bg-indigo-50/50 md:col-span-3 mt-4">
            <CardHeader className="py-4 border-b border-indigo-100 bg-indigo-50">
              <CardTitle className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                IA Educacional: Sugestões de Leitura
              </CardTitle>
              <CardDescription className="text-xs text-indigo-700">
                O sistema identificou oportunidades de melhoria com base nas suas notas recentes e
                separou materiais de apoio exclusivos para você no acervo.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecommendations.map((sub) => (
                <div
                  key={sub.id}
                  className="flex gap-3 bg-white p-3 rounded-md border border-indigo-100 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer"
                >
                  <div className="h-16 w-12 bg-indigo-100 rounded flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 px-1.5 py-0 mb-1 leading-none"
                    >
                      {sub.subject}
                    </Badge>
                    <h4 className="text-[13px] font-bold text-zinc-900 leading-tight mb-1">
                      Fundamentos de {sub.subject}
                    </h4>
                    <p className="text-[10px] text-zinc-500 leading-tight">
                      Recomendado pela IA para recuperar sua média na disciplina.
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Resumo Acadêmico */}
        <Card className="border-zinc-200 shadow-sm bg-white md:col-span-3 mt-2">
          <CardHeader className="py-4 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-zinc-400" /> Desempenho Acadêmico (Semestre
              Atual)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {myAttendances.map((att, i) => {
                const isWarning = att.absences / att.totalClasses > 0.25
                const grade = 8.5 - i * 2.5
                const isLowGrade = grade < 7.0

                return (
                  <div
                    key={att.id}
                    className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900">{att.subject}</h4>
                      <p
                        className={`text-xs mt-0.5 ${isWarning ? 'text-rose-600 font-semibold' : 'text-zinc-500'}`}
                      >
                        Faltas: {att.absences} / {att.totalClasses}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          Média Parcial
                        </p>
                        <p className="font-mono font-bold text-lg leading-tight text-zinc-900">
                          {grade.toFixed(1)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`w-28 justify-center ${!isLowGrade ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
                      >
                        {!isLowGrade ? 'Na Média' : 'Abaixo da Média'}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <Card className="border-zinc-200 shadow-sm bg-white">
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
          <div className="h-12 w-12 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center mb-3">
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
