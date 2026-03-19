import { useState } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Plus, Phone, UserPlus, Filter, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lead } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { AddStudentDialog } from '@/components/AddStudentDialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const columns = [
  { id: 'Novo', label: 'Prospecção (Novos)', color: 'bg-blue-500', text: 'text-blue-700' },
  { id: 'Contatado', label: 'Em Negociação', color: 'bg-amber-500', text: 'text-amber-700' },
  { id: 'Visita', label: 'Apresentação/Visita', color: 'bg-purple-500', text: 'text-purple-700' },
  {
    id: 'Pendente',
    label: 'Fechamento Pendente',
    color: 'bg-emerald-500',
    text: 'text-emerald-700',
  },
]

export default function Leads() {
  const { leads, updateLeadStatus, enrollStudent } = useAppStore()
  const { toast } = useToast()
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null)

  const handleAdvance = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation()
    const currentIndex = columns.findIndex((c) => c.id === lead.status)
    if (currentIndex < columns.length - 1) {
      updateLeadStatus(lead.id, columns[currentIndex + 1].id as Lead['status'])
      toast({ title: 'Oportunidade Atualizada', description: `Status de ${lead.name} alterado.` })
    } else {
      setConvertingLead(lead)
    }
  }

  const handleConvertSuccess = (student: any, plan: any) => {
    if (convertingLead) {
      enrollStudent(student, plan, convertingLead.id)
      toast({
        title: 'Conversão Realizada',
        description: `Oportunidade ganha! ${student.name} matriculado(a).`,
        variant: 'default',
      })
      setConvertingLead(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up flex flex-col h-[calc(100vh-100px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Comercial</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de funil de vendas e oportunidades.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filtrar oportunidades..." className="pl-9 h-9" />
          </div>
          <Button size="sm" className="h-9 shadow-sm shrink-0">
            <Plus className="mr-1.5 h-4 w-4" /> Novo Lead
          </Button>
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-6 flex-1 items-stretch snap-x">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id)
          return (
            <div key={col.id} className="min-w-[320px] w-[320px] flex flex-col snap-start">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-semibold text-sm text-foreground">{col.label}</h3>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-muted/50 text-muted-foreground font-medium px-2 py-0"
                >
                  {colLeads.length}
                </Badge>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 flex flex-col gap-3 flex-1 overflow-y-auto border border-border/50">
                {colLeads.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 border-2 border-dashed border-border/50 rounded-md p-4">
                    <p className="text-xs font-medium">Nenhuma oportunidade</p>
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="shadow-sm border-border/50 cursor-pointer hover:border-primary/30 transition-all duration-200 group bg-card"
                    >
                      <CardContent className="p-3.5">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-[13px] text-foreground leading-tight line-clamp-1">
                            {lead.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </div>

                        <div className="space-y-2 mb-3">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal px-1.5 py-0 bg-background border-border"
                          >
                            {lead.courseInterest}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" /> {lead.phone}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            Adicionado em{' '}
                            {new Date(lead.dateAdded).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-6 text-[10px] px-2 bg-background hover:bg-primary/10 hover:text-primary border shadow-sm"
                            onClick={(e) => handleAdvance(lead, e)}
                          >
                            {lead.status === 'Pendente' ? (
                              <span className="flex items-center">
                                <UserPlus className="w-3 h-3 mr-1" /> Converter
                              </span>
                            ) : (
                              'Avançar Fase'
                            )}
                          </Button>
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

      <AddStudentDialog
        open={!!convertingLead}
        onOpenChange={(open) => !open && setConvertingLead(null)}
        initialData={
          convertingLead
            ? {
                name: convertingLead.name,
                phone: convertingLead.phone,
                course: convertingLead.courseInterest,
              }
            : undefined
        }
        onSuccess={handleConvertSuccess}
      />
    </div>
  )
}
