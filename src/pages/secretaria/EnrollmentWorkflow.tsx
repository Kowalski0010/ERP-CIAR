import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, UserPlus, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { StudentForm } from '@/components/academic/StudentForm'
import { getStudents, updateStudent } from '@/services/students'
import { getCourses } from '@/services/courses'
import { createInstallments } from '@/services/payments'

export default function EnrollmentWorkflow() {
  const location = useLocation()
  const { toast } = useToast()

  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form for existing student
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [installments, setInstallments] = useState('12')
  const [planValue, setPlanValue] = useState('850')
  const [firstDueDate, setFirstDueDate] = useState(new Date().toISOString().split('T')[0])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stData, crData] = await Promise.all([getStudents(), getCourses()])
      setStudents(stData || [])
      setCourses(crData || [])
    } catch (error) {
      toast({
        title: 'Erro de Integração',
        description: 'Não foi possível carregar os dados reais do banco de dados.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEnrollExisting = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast({
        title: 'Atenção',
        description: 'Selecione o aluno cadastrado e o curso desejado.',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const student = students.find((s) => s.id === selectedStudent)

      // Update student course in DB
      await updateStudent(selectedStudent, {
        course: selectedCourse,
        status: 'Ativo',
      })

      // Generate real financial records
      if (installments && planValue && firstDueDate) {
        await createInstallments(
          selectedStudent,
          student?.name || 'Aluno',
          parseInt(installments),
          parseFloat(planValue),
          firstDueDate,
        )
      }

      toast({
        title: 'Matrícula Efetivada',
        description: 'O aluno foi vinculado ao curso e os pagamentos foram gerados.',
      })
      setSelectedStudent('')
      setSelectedCourse('')
      fetchData() // Refresh list
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao efetivar matrícula.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewStudentSuccess = () => {
    fetchData()
    // Scroll to top or show success
  }

  return (
    <div className="space-y-6 animate-fade-in-up p-4 md:p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fluxo de Matrícula Integrado</h1>
        <p className="text-muted-foreground">
          Realize o cadastro de novos alunos ou vincule alunos existentes aos cursos da sua
          instituição.
        </p>
      </div>

      <Tabs defaultValue="novo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="novo" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Cadastro de Novo Aluno
          </TabsTrigger>
          <TabsTrigger value="existente" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Matricular Aluno Existente
          </TabsTrigger>
        </TabsList>

        <TabsContent value="novo" className="mt-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle>Cadastro Completo</CardTitle>
              <CardDescription>
                Este formulário já está conectado diretamente à sua base de dados real. Os cursos
                listados aqui refletem exatamente o que está cadastrado no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentForm
                onSuccess={handleNewStudentSuccess}
                onCancel={() => window.scrollTo(0, 0)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="existente" className="mt-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle>Vincular a um Curso</CardTitle>
              <CardDescription>
                Selecione um aluno que já possui a "ficha" cadastrada no sistema para matricular em
                um novo curso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground space-y-4">
                  <Loader2 className="animate-spin h-8 w-8 text-primary" />
                  <p>Sincronizando com o banco de dados...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Aluno Registrado</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger className="h-12 bg-background border-input">
                          <SelectValue placeholder="Selecione na sua base de dados..." />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} {s.cpf ? `(${s.cpf})` : ''}
                            </SelectItem>
                          ))}
                          {students.length === 0 && (
                            <SelectItem value="none" disabled>
                              Nenhum aluno cadastrado.
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Curso Selecionado</Label>
                      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger className="h-12 bg-background border-input">
                          <SelectValue placeholder="Selecione um curso real..." />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                          {courses.length === 0 && (
                            <SelectItem value="none" disabled>
                              Nenhum curso na base.
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 p-6 border rounded-xl bg-muted/30 dark:bg-muted/10 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <h4 className="font-semibold text-lg text-primary">Plano Financeiro</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label>Quantidade de Parcelas</Label>
                        <Input
                          type="number"
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Mensal (R$)</Label>
                        <Input
                          type="number"
                          value={planValue}
                          onChange={(e) => setPlanValue(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Data do 1º Vencimento</Label>
                        <Input
                          type="date"
                          value={firstDueDate}
                          onChange={(e) => setFirstDueDate(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 pt-4 border-t flex justify-end">
                    <Button
                      onClick={handleEnrollExisting}
                      disabled={submitting}
                      size="lg"
                      className="px-8 font-semibold"
                    >
                      {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                      {submitting ? 'Processando...' : 'Efetivar Matrícula no Banco'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
