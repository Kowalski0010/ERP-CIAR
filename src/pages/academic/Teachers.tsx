import { Search, Plus, Book, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const mockTeachers = [
  {
    id: '1',
    name: 'Dr. Roberto Lemos',
    email: 'roberto@edusync.com',
    subjects: ['Cálculo I', 'Física'],
    workload: '40h',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=10',
  },
  {
    id: '2',
    name: 'Profa. Cláudia Dias',
    email: 'claudia@edusync.com',
    subjects: ['Design UI/UX', 'História da Arte'],
    workload: '20h',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=11',
  },
  {
    id: '3',
    name: 'Msc. Thiago Alves',
    email: 'thiago@edusync.com',
    subjects: ['Algoritmos', 'Lógica'],
    workload: '30h',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=12',
  },
]

export default function Teachers() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corpo Docente</h1>
          <p className="text-muted-foreground">Gestão de professores e alocação de disciplinas.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Professor
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar professores..."
          className="pl-9 bg-card border-border shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeachers.map((teacher) => (
          <Card
            key={teacher.id}
            className="overflow-hidden shadow-subtle border-border hover:border-primary/50 transition-colors"
          >
            <div className="h-16 bg-primary/10 w-full" />
            <CardContent className="pt-0 relative px-6 pb-6 text-center">
              <Avatar className="h-20 w-20 border-4 border-background mx-auto -mt-10 mb-4 shadow-sm">
                <AvatarImage src={teacher.avatar} />
                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{teacher.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{teacher.email}</p>

              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                {teacher.subjects.map((sub) => (
                  <Badge
                    key={sub}
                    variant="secondary"
                    className="font-normal border bg-muted/50 text-xs"
                  >
                    <Book className="w-3 h-3 mr-1" /> {sub}
                  </Badge>
                ))}
              </div>

              <div className="border-t pt-4 mt-2 flex justify-between items-center text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Carga Horária
                </span>
                <span className="font-semibold text-foreground">{teacher.workload}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
