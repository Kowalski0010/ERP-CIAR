import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getStudents } from '@/services/students'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Loader2, Database } from 'lucide-react'

export default function Consultas() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudents()
        setStudents(data || [])
      } catch (error) {
        console.error('Falha ao buscar consultas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = students.filter((s) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.cpf && s.cpf.includes(term)) ||
      (s.registrationCode && s.registrationCode.includes(term)) ||
      (s.course && s.course.toLowerCase().includes(term))
    )
  })

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel de Consultas Reais</h1>
        <p className="text-muted-foreground">
          Busca unificada e em tempo real no banco de dados da instituição.
        </p>
      </div>

      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" /> Banco Central de Alunos
              </CardTitle>
              <CardDescription className="mt-1">
                Todas as informações listadas aqui refletem cadastros definitivos no sistema.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-8 max-w-xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Pesquise por nome, CPF, matrícula ou curso..."
              className="pl-11 h-12 text-base bg-muted/20 border-primary/20 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-12 text-muted-foreground">
              <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
              <p>Consultando base de dados...</p>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold">Matrícula</TableHead>
                    <TableHead className="font-bold">Nome Completo</TableHead>
                    <TableHead className="font-bold">Documento (CPF)</TableHead>
                    <TableHead className="font-bold">Curso Vinculado</TableHead>
                    <TableHead className="font-bold">Status DB</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 text-muted-foreground text-base"
                      >
                        Nenhum registro encontrado na sua base de dados atual.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((s) => (
                      <TableRow key={s.id} className="hover:bg-muted/30">
                        <TableCell className="font-semibold text-primary">
                          {s.registrationCode || 'Pendente'}
                        </TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-muted-foreground">{s.cpf || '-'}</TableCell>
                        <TableCell>
                          {s.course || (
                            <span className="text-amber-600/80 text-sm italic">Sem vínculo</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                              s.status === 'Ativo'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : s.status === 'Trancado'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}
                          >
                            {s.status || 'Novo Registro'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
