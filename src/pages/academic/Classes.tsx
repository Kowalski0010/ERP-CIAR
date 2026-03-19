import { useAppStore } from '@/contexts/AppContext'
import { CalendarDays, Users, BookOpen, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Progress } from '@/components/ui/progress'

export default function Classes() {
  const { classes, students } = useAppStore()

  // Helper to count active students per course (mock logic)
  const getStudentCount = (courseName: string) => {
    return (
      students.filter((s) => s.course.includes(courseName)).length ||
      Math.floor(Math.random() * 30) + 10
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas e Cursos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Estrutura curricular e grade de turmas ativas.
          </p>
        </div>
        <Button className="shadow-sm">Nova Turma</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((cls) => {
          const studentCount = getStudentCount(cls.course)
          const capacity = 40
          const occupation = (studentCount / capacity) * 100

          return (
            <Card
              key={cls.id}
              className="shadow-sm border-border/50 hover:border-primary/40 transition-colors duration-300 flex flex-col group"
            >
              <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 bg-background font-mono text-xs text-muted-foreground"
                    >
                      CÓD: {cls.id}
                    </Badge>
                    <CardTitle className="text-lg text-foreground leading-tight">
                      {cls.name}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2 font-medium">
                      <BookOpen className="w-4 h-4 text-primary/70" />
                      {cls.course}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-4 flex-1">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>Período Letivo</span>
                  </div>
                  <span className="font-semibold text-foreground">{cls.semester}</span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-muted-foreground flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Ocupação da Turma
                    </span>
                    <span className="font-semibold">
                      {studentCount} / {capacity}
                    </span>
                  </div>
                  <Progress value={occupation} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t border-border/50 bg-muted/5 flex gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                  <Link to="/academic/students">Ver Alunos</Link>
                </Button>
                <Button variant="secondary" size="sm" className="w-full text-xs" asChild>
                  <Link to="/academic/schedules">Grade Horária</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
