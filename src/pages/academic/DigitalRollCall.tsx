import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { QrCode, Smartphone, Users, CheckCircle2, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type RollCallStudent = { id: string; name: string; status: 'Presente' | 'Falta' | 'Pendente' }

export default function DigitalRollCall() {
  const { classes, students } = useAppStore()
  const { toast } = useToast()

  const [turma, setTurma] = useState('')
  const [sessionActive, setSessionActive] = useState(false)
  const [rollCallList, setRollCallList] = useState<RollCallStudent[]>([])

  const handleStartSession = () => {
    if (!turma) return
    const cls = classes.find((c) => c.id === turma)
    if (!cls) return

    // Create mock list based on course
    const enrolled = students
      .filter((s) => s.course.includes(cls.course))
      .map((s) => ({
        id: s.id,
        name: s.name,
        status: 'Pendente' as const,
      }))

    // Add fallback if empty
    if (enrolled.length === 0) {
      enrolled.push(
        { id: '1', name: 'Ana Silva', status: 'Pendente' },
        { id: '2', name: 'Carlos Oliveira', status: 'Pendente' },
      )
    }

    setRollCallList(enrolled)
    setSessionActive(true)
  }

  const simulateScan = () => {
    setRollCallList((prev) => {
      const pendingIndex = prev.findIndex((s) => s.status === 'Pendente')
      if (pendingIndex !== -1) {
        const updated = [...prev]
        updated[pendingIndex].status = 'Presente'
        toast({
          title: 'Check-in Realizado',
          description: `${updated[pendingIndex].name} marcou presença.`,
        })
        return updated
      }
      toast({ title: 'Aviso', description: 'Todos os alunos já processados.' })
      return prev
    })
  }

  const finalizeRollCall = () => {
    // Set remaining pending to Falta
    setRollCallList((prev) =>
      prev.map((s) => (s.status === 'Pendente' ? { ...s, status: 'Falta' } : s)),
    )
    toast({ title: 'Chamada Encerrada', description: 'Lista consolidada no diário de classe.' })
  }

  const presentes = rollCallList.filter((s) => s.status === 'Presente').length
  const faltas = rollCallList.filter((s) => s.status === 'Falta').length

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <QrCode className="h-7 w-7 text-zinc-400" />
            Chamada Digital (QR Code)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Geração de sessões de check-in em tempo real para registro automático de presença.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-zinc-200 shadow-sm bg-white h-fit">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
            <CardTitle className="text-base text-zinc-800">Sessão Ativa</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {!sessionActive ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700">Selecione a Turma</label>
                  <Select value={turma} onValueChange={setTurma}>
                    <SelectTrigger className="bg-zinc-50">
                      <SelectValue placeholder="Turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleStartSession} disabled={!turma} className="w-full shadow-sm">
                  Iniciar Chamada
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
                <div className="p-4 bg-white border-2 border-zinc-200 rounded-xl shadow-sm">
                  <QrCode className="h-40 w-40 text-zinc-800" />
                </div>
                <p className="text-xs text-zinc-500 max-w-[200px]">
                  Peça aos alunos para escanearem o código através do Portal PWA.
                </p>
                <div className="w-full pt-4 border-t border-zinc-100 flex flex-col gap-2">
                  <Button variant="outline" onClick={simulateScan} className="w-full text-xs h-9">
                    <Smartphone className="h-3.5 w-3.5 mr-2" /> Simular Leitura do Aluno
                  </Button>
                  <Button
                    onClick={finalizeRollCall}
                    className="w-full text-xs h-9 bg-rose-600 hover:bg-rose-700"
                  >
                    Encerrar e Salvar Faltas
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-zinc-200 shadow-sm bg-white">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-zinc-800 flex items-center gap-2">
              <Users className="h-4 w-4" /> Lista de Frequência
            </CardTitle>
            {sessionActive && (
              <div className="flex gap-3 text-xs font-medium">
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {presentes} Presentes
                </span>
                <span className="text-rose-600 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> {faltas} Faltas
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {!sessionActive ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400">
                <Users className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm font-semibold">Inicie uma sessão para ver a lista.</p>
              </div>
            ) : (
              <Table className="table-compact">
                <TableHeader className="bg-zinc-50">
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead className="text-right w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rollCallList.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-semibold text-xs text-zinc-800">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {student.status === 'Pendente' && (
                          <Badge variant="outline" className="text-zinc-500 bg-zinc-100">
                            Aguardando
                          </Badge>
                        )}
                        {student.status === 'Presente' && (
                          <Badge
                            variant="outline"
                            className="text-emerald-700 border-emerald-200 bg-emerald-50"
                          >
                            Presente
                          </Badge>
                        )}
                        {student.status === 'Falta' && (
                          <Badge
                            variant="outline"
                            className="text-rose-700 border-rose-200 bg-rose-50"
                          >
                            Falta
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
