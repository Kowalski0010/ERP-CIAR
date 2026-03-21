import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import {
  Briefcase,
  Filter,
  MoreHorizontal,
  UserCheck,
  Search,
  Link as LinkIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Candidate } from '@/lib/types'

const columns = [
  { id: 'Novo', label: 'Triagem Inicial', color: 'bg-blue-500', text: 'text-blue-700' },
  {
    id: 'Em Avaliação',
    label: 'Análise Curricular',
    color: 'bg-amber-500',
    text: 'text-amber-700',
  },
  { id: 'Entrevista', label: 'Entrevista/Banca', color: 'bg-purple-500', text: 'text-purple-700' },
  { id: 'Aprovado', label: 'Aprovados', color: 'bg-emerald-500', text: 'text-emerald-700' },
]

export default function Recruitment() {
  const { candidates, updateCandidateStatus } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')

  const handleAdvance = (cand: Candidate, e: React.MouseEvent) => {
    e.stopPropagation()
    const currentIndex = columns.findIndex((c) => c.id === cand.status)
    if (currentIndex < columns.length - 1) {
      updateCandidateStatus(cand.id, columns[currentIndex + 1].id as Candidate['status'])
      toast({
        title: 'Candidato Atualizado',
        description: `O status de ${cand.name} foi alterado para ${columns[currentIndex + 1].label}.`,
      })
    }
  }

  const handleReject = (cand: Candidate, e: React.MouseEvent) => {
    e.stopPropagation()
    updateCandidateStatus(cand.id, 'Rejeitado')
    toast({
      title: 'Candidato Rejeitado',
      variant: 'destructive',
      description: `O candidato foi movido para o banco de talentos inativos.`,
    })
  }

  const copyPublicLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/apply-teacher`)
    toast({
      title: 'Link Copiado',
      description: 'Link do portal de vagas copiado para a área de transferência.',
    })
  }

  const filteredCandidates = candidates.filter(
    (c) =>
      c.status !== 'Rejeitado' &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subjects.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6 animate-fade-in-up flex flex-col h-[calc(100vh-100px)] max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-zinc-400" />
            Recrutamento de Docentes
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Funil de seleção de professores e especialistas.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar candidatos ou matérias..."
              className="pl-9 h-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 shadow-sm shrink-0 bg-white"
            onClick={copyPublicLink}
          >
            <LinkIcon className="mr-1.5 h-4 w-4 text-blue-600" /> Portal Público
          </Button>
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-6 flex-1 items-stretch snap-x">
        {columns.map((col) => {
          const colCandidates = filteredCandidates.filter((c) => c.status === col.id)
          return (
            <div key={col.id} className="min-w-[320px] w-[320px] flex flex-col snap-start">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-semibold text-sm text-zinc-800">{col.label}</h3>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-zinc-200/50 text-zinc-700 font-medium px-2 py-0"
                >
                  {colCandidates.length}
                </Badge>
              </div>

              <div className="bg-zinc-100/50 rounded-lg p-3 flex flex-col gap-3 flex-1 overflow-y-auto border border-zinc-200">
                {colCandidates.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 opacity-70 border-2 border-dashed border-zinc-200 rounded-md p-4">
                    <p className="text-xs font-medium">Vazio</p>
                  </div>
                ) : (
                  colCandidates.map((cand) => (
                    <Card
                      key={cand.id}
                      className="shadow-sm border-zinc-200 cursor-pointer hover:border-blue-300 transition-all duration-200 group bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-zinc-900 leading-tight">
                            {cand.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                          </Button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="text-xs text-zinc-600 line-clamp-1" title={cand.subjects}>
                            <strong>Áreas:</strong> {cand.subjects}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                          <span className="text-[10px] font-medium text-zinc-400">
                            {new Date(cand.dateApplied).toLocaleDateString('pt-BR')}
                          </span>
                          <div className="flex gap-1">
                            {cand.status !== 'Aprovado' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-[10px] text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                  onClick={(e) => handleReject(cand, e)}
                                >
                                  Recusar
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="h-7 px-2 text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-100"
                                  onClick={(e) => handleAdvance(cand, e)}
                                >
                                  Avançar
                                </Button>
                              </>
                            )}
                            {cand.status === 'Aprovado' && (
                              <Badge
                                variant="outline"
                                className="h-6 border-emerald-200 bg-emerald-50 text-emerald-700 font-medium px-2 py-0"
                              >
                                <UserCheck className="w-3 h-3 mr-1" /> Selecionado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
