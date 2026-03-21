import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Send, Users, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Chat() {
  const { chatMessages, sendChatMessage, employees, teachers, currentUserRole, students } =
    useAppStore()
  const [input, setInput] = useState('')
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages, selectedContactId])

  const staff = [
    { id: 'geral', name: 'Canal Geral', role: 'Institucional', avatar: '' },
    ...employees.map((e) => ({ ...e, role: e.department })),
    ...teachers.map((t) => ({ ...t, role: 'Professor' })),
  ]

  const selectedContact =
    selectedContactId && selectedContactId !== 'geral'
      ? staff.find((s) => s.id === selectedContactId)
      : null

  const filteredMessages = chatMessages.filter((msg) => {
    if (!selectedContact) return !msg.receiverId // General Channel

    // 1-to-1 matching
    return (
      (msg.senderId === selectedContact.id && msg.receiverId === 'current') ||
      (msg.senderId === 'current' && msg.receiverId === selectedContact.id)
    )
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendChatMessage(
      input,
      selectedContactId === 'geral' ? undefined : selectedContactId || undefined,
    )
    setInput('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 h-[calc(100vh-100px)] flex flex-col max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-zinc-400" />
            Chat Corporativo
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Comunicação direta e em tempo real entre a secretaria, docentes e equipe.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* Contacts Sidebar */}
        <Card className="w-full md:w-80 flex flex-col shrink-0 overflow-hidden bg-white border-zinc-200 shadow-sm">
          <CardHeader className="py-4 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" /> Diretório de Contatos
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {staff.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedContactId(s.id === 'geral' ? null : s.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContactId === s.id || (s.id === 'geral' && selectedContactId === null)
                      ? 'bg-blue-50 border border-blue-100 shadow-sm'
                      : 'hover:bg-zinc-50 border border-transparent'
                  }`}
                >
                  <Avatar className="h-10 w-10 border border-zinc-200 bg-white">
                    {s.avatar ? (
                      <AvatarImage src={s.avatar} />
                    ) : (
                      <AvatarFallback className="text-xs">{s.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-zinc-900 truncate">{s.name}</span>
                    <span className="text-[10px] text-zinc-500 truncate uppercase tracking-wider">
                      {s.role}
                    </span>
                  </div>
                  {s.id !== 'geral' && (
                    <div
                      className="ml-auto w-2 h-2 rounded-full bg-emerald-500"
                      title="Online"
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden bg-white border-zinc-200 shadow-sm">
          <CardHeader className="py-4 border-b border-zinc-100 bg-zinc-50/50 shadow-sm z-10 shrink-0">
            <CardTitle className="text-sm flex items-center gap-2">
              {selectedContact ? (
                <>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {selectedContact.name}
                  <Badge variant="secondary" className="ml-2 text-[10px] bg-white">
                    {selectedContact.role}
                  </Badge>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 text-blue-600" /> Canal Geral
                  <Badge
                    variant="outline"
                    className="ml-2 text-[10px] bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Broadcast
                  </Badge>
                </>
              )}
            </CardTitle>
          </CardHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => {
                const isMe = msg.senderId === 'current'
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {!isMe && (
                        <span className="text-xs font-semibold text-zinc-700">
                          {msg.senderName}
                        </span>
                      )}
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 bg-zinc-100 text-zinc-500 border border-zinc-200"
                      >
                        {msg.senderRole}
                      </Badge>
                    </div>
                    <div
                      className={`p-3 rounded-lg max-w-[80%] text-sm shadow-sm ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-zinc-100 text-zinc-800 rounded-tl-none border border-zinc-200'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 opacity-60">
                <MessageSquare className="h-12 w-12 mb-3" />
                <p className="text-sm font-medium">Nenhuma mensagem neste chat.</p>
                <p className="text-xs">Comece a digitar abaixo para iniciar uma conversa.</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-100 bg-zinc-50 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                placeholder={`Mensagem para ${selectedContact ? selectedContact.name : 'Todos'}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white border-zinc-200 h-10 shadow-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
