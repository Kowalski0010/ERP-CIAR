import { CalendarDays, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const mockClasses = [
  {
    id: 'T01',
    name: 'Engenharia de Software - 1º Sem',
    teacher: 'Thiago Alves',
    studentsCount: 35,
    schedule: 'Seg, Qua (19h-22h)',
  },
  {
    id: 'T02',
    name: 'Design Gráfico - 3º Sem',
    teacher: 'Cláudia Dias',
    studentsCount: 28,
    schedule: 'Ter, Qui (08h-11h)',
  },
  {
    id: 'T03',
    name: 'Direito Civil - 5º Sem',
    teacher: 'Roberto Lemos',
    studentsCount: 42,
    schedule: 'Sex (19h-22h)',
  },
]

export default function Classes() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas e Horários</h1>
          <p className="text-muted-foreground">Visualize o cronograma e alocação de turmas.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {mockClasses.map((cls) => (
          <Card key={cls.id} className="shadow-subtle border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-primary">{cls.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Prof. Responsável: {cls.teacher}
                </p>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1 bg-muted/50">
                {cls.id}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 text-primary/70" />
                  <span className="font-medium text-foreground">{cls.studentsCount}</span>{' '}
                  matriculados
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-primary/70" />
                  <span className="font-medium text-foreground">{cls.schedule}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" size="sm">
                  Ver Alunos
                </Button>
                <Button variant="outline" size="sm">
                  Editar Horário
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
