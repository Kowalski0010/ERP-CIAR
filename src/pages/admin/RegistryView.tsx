import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppStore } from '@/contexts/AppContext'
import { Database, Search, Plus, Filter, Edit, Trash2, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'

import { AvaliacaoForm } from '@/components/admin/forms/AvaliacaoForm'
import { CursoForm } from '@/components/admin/forms/CursoForm'
import { ConvenioForm } from '@/components/admin/forms/ConvenioForm'
import { CepForm } from '@/components/admin/forms/CepForm'
import { DisciplinaForm } from '@/components/admin/forms/DisciplinaForm'
import { TurmaForm } from '@/components/admin/forms/TurmaForm'

export default function RegistryView() {
  const { id } = useParams()
  const { toast } = useToast()

  const {
    classes,
    deleteClass,
    cursos,
    deleteCurso,
    avaliacoes,
    deleteAvaliacao,
    convenios,
    deleteConvenio,
    ceps,
    deleteCep,
    disciplinas,
    deleteDisciplina,
  } = useAppStore()

  const [isAdding, setIsAdding] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  useEffect(() => {
    setIsAdding(false)
    setEditItem(null)
  }, [id])

  const title = id ? id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Cadastro'

  const getStoreData = () => {
    switch (id) {
      case 'turmas':
        return {
          data: classes,
          format: (c: any) => ({ name: c.name, desc: `${c.course} | Sala: ${c.room || 'N/A'}` }),
        }
      case 'curso':
        return {
          data: cursos,
          format: (c: any) => ({ name: c.name, desc: `${c.mode} - ${c.duration}h` }),
        }
      case 'avaliacoes':
        return {
          data: avaliacoes,
          format: (a: any) => ({ name: a.name, desc: `${a.subject} - ${a.type}` }),
        }
      case 'convenio':
        return {
          data: convenios,
          format: (c: any) => ({
            name: c.name,
            desc: `Contrato: ${c.contract} - Desc: ${c.discount}%`,
          }),
        }
      case 'cep':
        return {
          data: ceps,
          format: (c: any) => ({
            name: c.cep,
            desc: `${c.street}, ${c.neighborhood} - ${c.city}/${c.state}`,
          }),
        }
      case 'disciplina':
        return {
          data: disciplinas,
          format: (d: any) => ({ name: d.name, desc: `Carga: ${d.workload}h` }),
        }
      default:
        return { data: [], format: () => ({ name: '', desc: '' }) }
    }
  }

  const storeConfig = getStoreData()
  const displayData = storeConfig.data.map((item: any) => {
    const f = storeConfig.format(item)
    return {
      id: item.id,
      name: f.name,
      description: f.desc,
      status: item.status || 'Ativo',
      date: item.date || new Date().toLocaleDateString('pt-BR'),
      original: item,
    }
  })

  const handleEditAction = (item: any) => {
    setEditItem(item.original)
    setIsAdding(true)
  }

  const handleDeleteAction = (item: any) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    let success = true
    switch (id) {
      case 'turmas':
        deleteClass(itemToDelete.id)
        break
      case 'curso':
        deleteCurso(itemToDelete.id)
        break
      case 'avaliacoes':
        deleteAvaliacao(itemToDelete.id)
        break
      case 'convenio':
        deleteConvenio(itemToDelete.id)
        break
      case 'cep':
        deleteCep(itemToDelete.id)
        break
      case 'disciplina':
        deleteDisciplina(itemToDelete.id)
        break
      default:
        success = false
    }
    if (success) {
      toast({
        title: 'Registro Excluído',
        description: `O registro ${itemToDelete.name || itemToDelete.id} foi removido.`,
      })
    }
    setItemToDelete(null)
  }

  const handleCancelForm = () => {
    setIsAdding(false)
    setEditItem(null)
  }

  const renderForm = () => {
    const props = { onCancel: handleCancelForm, initialData: editItem }
    switch (id) {
      case 'avaliacoes':
        return <AvaliacaoForm {...props} />
      case 'curso':
        return <CursoForm {...props} />
      case 'convenio':
        return <ConvenioForm {...props} />
      case 'cep':
        return <CepForm {...props} />
      case 'disciplina':
        return <DisciplinaForm {...props} />
      case 'turmas':
        return <TurmaForm {...props} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 -ml-1 text-zinc-500" asChild>
              <Link to="/">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge
              variant="secondary"
              className="bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-widest"
            >
              Administração / Cadastro
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Database className="h-6 w-6 text-zinc-400" />
            {isAdding
              ? editItem
                ? `Editando ${title}`
                : `Novo(a) ${title}`
              : `Gestão de ${title}`}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isAdding
              ? 'Preencha as informações abaixo para atualizar o registro.'
              : 'Interface padronizada para manutenção de registros de sistema.'}
          </p>
        </div>
        {!isAdding && (
          <Button className="shadow-sm h-9 px-4" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Novo
          </Button>
        )}
      </div>

      {isAdding ? (
        <Card className="border-zinc-200 shadow-sm bg-white animate-fade-in">
          <CardHeader className="border-b border-zinc-100 pb-4 bg-zinc-50/50">
            <CardTitle className="text-base text-zinc-800">Formulário de Cadastro</CardTitle>
            <CardDescription className="text-xs">
              Certifique-se de preencher todos os campos obrigatórios.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">{renderForm()}</CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-zinc-200 shadow-sm p-3 bg-white">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Pesquisar registros..."
                  className="pl-9 h-9 bg-zinc-50/50 border-transparent focus-visible:border-zinc-300 w-full text-xs"
                />
              </div>
            </div>
          </Card>

          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <Table className="table-compact">
              <TableHeader className="bg-zinc-50/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">Código</TableHead>
                  <TableHead>Nome / Identificação</TableHead>
                  <TableHead className="hidden md:table-cell">Detalhes</TableHead>
                  <TableHead className="w-[120px]">Criado em</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                  <TableHead className="text-right w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <TableCell className="font-mono text-xs text-zinc-500">{row.id}</TableCell>
                    <TableCell className="font-semibold text-zinc-900 text-xs">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 hidden md:table-cell truncate max-w-xs">
                      {row.description}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500">{row.date}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          row.status === 'Ativo'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-1">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditAction(row)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDeleteAction(row)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {displayData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Registro"
        description={`Tem certeza que deseja excluir "${itemToDelete?.name || itemToDelete?.id}"? Esta ação não poderá ser desfeita.`}
        onConfirm={confirmDelete}
        destructive
      />
    </div>
  )
}
