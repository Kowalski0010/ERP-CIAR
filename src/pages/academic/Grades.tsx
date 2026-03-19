import { useState, useMemo } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Save, AlertCircle } from 'lucide-react'
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

const initialGrades = [
  { id: '1', name: 'Ana Silva', n1: 8.5, n2: 7.0 },
  { id: '2', name: 'Carlos Oliveira', n1: 5.0, n2: 6.0 },
  { id: '3', name: 'Beatriz Souza', n1: 9.0, n2: 9.5 },
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
        title: 'Notas salvas com sucesso!',
        description: 'Os boletins foram atualizados.',
      })
    }, 800)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lançamento de Notas</h1>
        <p className="text-muted-foreground mt-1">
          Insira as notas e o sistema calculará a média automaticamente.
        </p>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row p-4 bg-card border rounded-xl shadow-subtle">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">
            Turma
          </label>
          <Select defaultValue="t01">
            <SelectTrigger>
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t01">Engenharia de Software - 1º Sem</SelectItem>
              <SelectItem value="t02">Design Gráfico - 3º Sem</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">
            Disciplina
          </label>
          <Select defaultValue="d1">
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="d1">Algoritmos</SelectItem>
              <SelectItem value="d2">Cálculo I</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Média para aprovação: <strong>7.0</strong>. Valores são salvos temporariamente até o
          clique em "Salvar Notas".
        </AlertDescription>
      </Alert>

      <div className="bg-card border rounded-xl shadow-subtle overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Aluno</TableHead>
              <TableHead className="w-[120px]">Nota 1</TableHead>
              <TableHead className="w-[120px]">Nota 2</TableHead>
              <TableHead className="w-[100px] text-center">Média</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((student) => {
              const avg = ((student.n1 + student.n2) / 2).toFixed(1)
              const status = calculateStatus(student.n1, student.n2)
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={student.n1 || ''}
                      onChange={(e) => handleGradeChange(student.id, 'n1', e.target.value)}
                      className="w-20 text-center"
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
                      className="w-20 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center font-bold font-mono text-lg bg-muted/20">
                    {avg}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${status.color} border-none`}>{status.text}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="p-4 border-t flex justify-end bg-muted/20">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Salvando...' : 'Salvar Notas'}
          </Button>
        </div>
      </div>
    </div>
  )
}
