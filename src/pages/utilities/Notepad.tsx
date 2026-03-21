import { useState } from 'react'
import { StickyNote, Plus, Trash2, Save, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface Note {
  id: string
  title: string
  content: string
  date: string
}

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Lembretes Reunião Pedagógica',
    content:
      '- Discutir aprovação do novo currículo\n- Analisar evasão no 1º semestre\n- Solicitar compra de novos projetores',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Pendências Secretaria',
    content:
      'Verificar documentação do aluno João Silva (falta RG original).\nLigar para fornecedor de TI.',
    date: new Date(Date.now() - 172800000).toISOString(),
  },
]

export default function Notepad() {
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(initialNotes[0].id)

  const activeNote = notes.find((n) => n.id === activeNoteId) || null

  const [editTitle, setEditTitle] = useState(activeNote?.title || '')
  const [editContent, setEditContent] = useState(activeNote?.content || '')

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Nota',
      content: '',
      date: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setActiveNoteId(newNote.id)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
  }

  const handleSave = () => {
    if (!activeNoteId) return

    setNotes(
      notes.map((n) =>
        n.id === activeNoteId
          ? { ...n, title: editTitle, content: editContent, date: new Date().toISOString() }
          : n,
      ),
    )

    toast({
      title: 'Nota Salva',
      description: 'Sua anotação foi atualizada com sucesso.',
    })
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = notes.filter((n) => n.id !== id)
    setNotes(updated)
    if (activeNoteId === id) {
      if (updated.length > 0) {
        setActiveNoteId(updated[0].id)
        setEditTitle(updated[0].title)
        setEditContent(updated[0].content)
      } else {
        setActiveNoteId(null)
        setEditTitle('')
        setEditContent('')
      }
    }
    toast({
      title: 'Nota Removida',
      description: 'Anotação excluída do seu bloco.',
    })
  }

  const selectNote = (note: Note) => {
    setActiveNoteId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <StickyNote className="h-7 w-7 text-zinc-400" />
            Bloco de Notas Pessoal
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Anotações rápidas, lembretes e rascunhos.</p>
        </div>
        <Button onClick={handleCreateNote} className="shadow-sm h-9 px-4 shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Nova Nota
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* List */}
        <Card className="w-full md:w-80 border-zinc-200 shadow-sm flex flex-col shrink-0 overflow-hidden bg-zinc-50/50">
          <CardHeader className="py-4 border-b border-zinc-200 bg-white">
            <CardTitle className="text-sm">Minhas Notas</CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex-1 overflow-y-auto space-y-2">
            {notes.length === 0 && (
              <div className="p-6 text-center text-zinc-500 text-sm">Nenhuma nota criada.</div>
            )}
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors group relative ${
                  activeNoteId === note.id
                    ? 'bg-white border-blue-200 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-zinc-100'
                }`}
              >
                <h4 className="font-semibold text-sm text-zinc-900 truncate pr-6">{note.title}</h4>
                <p className="text-xs text-zinc-500 line-clamp-2 mt-1 mb-2">
                  {note.content || '...'}
                </p>
                <div className="flex items-center text-[10px] text-zinc-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(note.date).toLocaleDateString('pt-BR')}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 transition-opacity"
                  onClick={(e) => handleDelete(note.id, e)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="flex-1 border-zinc-200 shadow-sm flex flex-col overflow-hidden bg-white">
          {activeNote ? (
            <>
              <CardHeader className="py-3 border-b border-zinc-100 flex flex-row items-center justify-between space-y-0">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-bold text-lg border-transparent px-2 h-auto focus-visible:ring-1 focus-visible:ring-zinc-300 w-full max-w-lg"
                  placeholder="Título da Nota"
                />
                <Button onClick={handleSave} size="sm" className="shadow-sm">
                  <Save className="h-4 w-4 mr-2" /> Salvar
                </Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col relative">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 w-full resize-none border-none p-6 text-sm text-zinc-700 focus-visible:ring-0 rounded-none leading-relaxed"
                  placeholder="Comece a digitar sua nota aqui..."
                />
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
              <StickyNote className="h-12 w-12 mb-4 opacity-20" />
              <p>Selecione uma nota ou crie uma nova para começar.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
