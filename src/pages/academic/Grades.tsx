import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Save, AlertCircle, FileSpreadsheet, Check } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

const initialGrades = [
  { id: '1', name: 'Ana Silva', n1: 8.5, n2: 7.0 },
  { id: '2', name: 'Carlos Oliveira', n1: 5.0, n2: 6.0 },
  { id: '3', name: 'Beatriz Souza', n1: 9.0, n2: 9.5 },
  { id: '4', name: 'Daniel Costa', n1: 4.5, n2: 4.0 },
  { id: '5', name: 'Eduarda Lima', n1: 7.5, n2: 8.0 },
]

export default function Grades() {
  const { toast } = useToast()
  const [grades, setGrades] = useState(initialGrades)
  const [isSaving, setIsSaving] = useState(false)

  const handleGradeChange = (id: string, field: 'n1' | 'n2', value: string) => {
    let num = parseFloat(value)
    if (isNaN(num)) num = 0
    if (num > 10) num = 10
    if (num < 0) num = 0

    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: num } : g)))
  }

  const calculateStatus = (n1: number, n2: number) => {
    const avg = (n1 + n2) / 2
    if (avg >= 7) return { text: 'Aprovado', color: 'status-success' }
    if (avg >= 5) return { text: 'Recuperação', color: 'status-warning' }
    return { text: 'Reprovado', color: 'status-danger' }
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: 'Diário de Classe Salvo',
        description: 'As notas foram processadas e os históricos atualizados.',
      })
    }, 800)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diário de Classe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lançamento de avaliações e apuração de médias.
          </p>
        </div>
        <Button variant="outline" className="shadow-sm">
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar Planilha
        </Button>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Período
            </label>
            <Select defaultValue="2023-2">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-1">1º Semestre 2023</SelectItem>
                <SelectItem value="2023-2">2º Semestre 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Turma
            </label>
            <Select defaultValue="t01">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t01">T01 - Engenharia de Software</SelectItem>
                <SelectItem value="t02">T02 - Design Gráfico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Disciplina
            </label>
            <Select defaultValue="d1">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="d1">Algoritmos Avançados</SelectItem>
                <SelectItem value="d2">Cálculo I</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-primary/5 border-primary/20 text-foreground shadow-sm">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          Sistema parametrizado para <strong>Média 7.0</strong>. Alterações ficam em rascunho até
          confirmação de salvamento.
        </AlertDescription>
      </Alert>

      <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table className="table-compact">
            <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] text-center">Matrícula</TableHead>
                <TableHead>Nome do Aluno</TableHead>
                <TableHead className="w-[120px] text-center">N1 (Peso 4)</TableHead>
                <TableHead className="w-[120px] text-center">N2 (Peso 6)</TableHead>
                <TableHead className="w-[100px] text-center">Média</TableHead>
                <TableHead className="w-[140px]">Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((student, index) => {
                const avg = ((student.n1 + student.n2) / 2).toFixed(1)
                const status = calculateStatus(student.n1, student.n2)
                const matricula = `2023${String(index + 1).padStart(4, '0')}`

                return (
                  <TableRow key={student.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-xs text-muted-foreground text-center">
                      {matricula}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{student.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={student.n1 || ''}
                        onChange={(e) => handleGradeChange(student.id, 'n1', e.target.value)}
                        className="w-20 mx-auto text-center h-8 bg-background focus-visible:ring-primary/30"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={student.n2 || ''}
                        onChange={(e) => handleGradeChange(student.id, 'n2', e.target.value)}
                        className="w-20 mx-auto text-center h-8 bg-background focus-visible:ring-primary/30"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono font-bold text-[15px] px-2 py-1 bg-muted/40 rounded border border-border/50">
                        {avg}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${status.color} px-2.5 font-medium`}>
                        {status.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-between items-center shrink-0">
          <span className="text-xs text-muted-foreground font-medium flex items-center">
            <Check className="h-3 w-3 mr-1" /> Todos os alunos processados
          </span>
          <Button onClick={handleSave} disabled={isSaving} className="shadow-sm min-w-[150px]">
            {isSaving ? (
              'Processando...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Consolidar Notas
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
