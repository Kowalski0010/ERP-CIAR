import { useAppStore } from '@/contexts/AppContext'
import { CalendarDays, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Classes() {
  const { classes } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground">Visão geral das turmas ativas no semestre.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {classes.map((cls) => (
          <Card
            key={cls.id}
            className="shadow-subtle border-border hover:border-primary/30 transition-colors"
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-primary">{cls.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Curso: {cls.course}</p>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1 bg-muted/50">
                {cls.id}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 text-sm mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-primary/70" />
                  <span className="font-medium text-foreground">{cls.semester}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/academic/students">Alunos</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/academic/schedules">Ver Horários</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
