import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/contexts/AppContext'
import { Send, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Chat() {
  const { chatMessages, sendChatMessage, employees, teachers, currentUserRole } = useAppStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendChatMessage(input)
    setInput('')
  }

  const staff = [
    ...employees.map((e) => ({ ...e, role: e.department })),
    ...teachers.map((t) => ({ ...t, role: 'Professor' })),
  ]

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 h-[calc(100vh-100px)] flex flex-col max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-zinc-400" />
            Chat Interno
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Comunicação em tempo real entre a equipe escolar e docentes.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* Sidebar */}
        <Card className="w-full md:w-80 flex flex-col shrink-0 overflow-hidden bg-white border-zinc-200">
          <CardHeader className="py-4 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-sm">Equipe Ativa</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Avatar className="h-10 w-10 border border-zinc-200">
                    <AvatarImage src={s.avatar} />
                    <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold text-zinc-900 truncate">{s.name}</span>
                    <span className="text-[10px] text-zinc-500 truncate">{s.role}</span>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden bg-white border-zinc-200">
          <CardHeader className="py-4 border-b border-zinc-100 bg-zinc-50/50 shadow-sm z-10 shrink-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" /> Canal Geral
            </CardTitle>
          </CardHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            {chatMessages.map((msg) => {
              const isMe = msg.senderRole === currentUserRole
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isMe && (
                      <span className="text-xs font-semibold text-zinc-700">{msg.senderName}</span>
                    )}
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 bg-zinc-100 text-zinc-500 border border-zinc-200"
                    >
                      {msg.senderRole}
                    </Badge>
                  </div>
                  <div
                    className={`p-3 rounded-lg max-w-[80%] text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-100 text-zinc-800 rounded-tl-none border border-zinc-200'}`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                placeholder="Escreva sua mensagem no canal geral..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white border-zinc-200 h-10"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0"
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
