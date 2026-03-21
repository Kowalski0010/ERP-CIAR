import { useState } from 'react'
import { Mail, Search, MessageSquare, Reply, Trash2, MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  sender: string
  avatar: string
  subject: string
  snippet: string
  content: string
  date: string
  read: boolean
  department: string
}

const mockMessages: Message[] = [
  {
    id: 'm1',
    sender: 'Coordenação Acadêmica',
    department: 'Coordenação',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=12',
    subject: 'Aprovação de Calendário de Provas',
    snippet: 'O calendário oficial de provas N1 foi aprovado...',
    content:
      'Prezados,\n\nInformo que o calendário oficial de provas da N1 foi aprovado pela diretoria. Por favor, revisem os horários e garantam que não há conflitos de alocação de salas.\n\nAtenciosamente,\nCoordenação',
    date: '10:30',
    read: false,
  },
  {
    id: 'm2',
    sender: 'Carlos TI',
    department: 'TI Suporte',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=45',
    subject: 'Manutenção Servidor ERP',
    snippet: 'Aviso de indisponibilidade temporária hoje à noite.',
    content:
      'Olá equipe,\n\nHoje, entre 23:00 e 01:00, realizaremos uma manutenção programada no servidor principal do ERP. O sistema poderá apresentar instabilidade.\n\nAbs,\nTI',
    date: 'Ontem',
    read: true,
  },
  {
    id: 'm3',
    sender: 'Mariana Financeiro',
    department: 'Financeiro',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=99',
    subject: 'Relatório de Inadimplência',
    snippet: 'Segue em anexo o relatório atualizado desta semana...',
    content:
      'Bom dia!\n\nSegue o relatório semanal de inadimplência. Notamos um leve aumento no curso de Administração. Gostaria de sugerir uma ação de recuperação junto à secretaria.\n\nObrigada.',
    date: '15 de Out',
    read: true,
  },
]

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(mockMessages[0].id)
  const [searchTerm, setSearchTerm] = useState('')

  const activeMessage = messages.find((m) => m.id === selectedMsgId)

  const filtered = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sender.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectMessage = (id: string) => {
    setSelectedMsgId(id)
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 h-[calc(100vh-100px)] flex flex-col max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Mail className="h-7 w-7 text-zinc-400" />
            Caixa de Mensagens
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Comunicação interna entre setores e colaboradores.
          </p>
        </div>
        <Button className="shadow-sm h-9 px-4 shrink-0">
          <MessageSquare className="mr-2 h-4 w-4" /> Nova Mensagem
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-0 flex-1 overflow-hidden bg-white border border-zinc-200 rounded-lg shadow-sm">
        {/* Inbox List */}
        <div className="w-full md:w-[350px] border-r border-zinc-200 flex flex-col bg-zinc-50/30">
          <div className="p-3 border-b border-zinc-200">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Pesquisar mensagens..."
                className="pl-8 h-9 text-xs bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => selectMessage(msg.id)}
                className={`p-4 cursor-pointer transition-colors relative ${selectedMsgId === msg.id ? 'bg-blue-50/50' : 'hover:bg-zinc-50'}`}
              >
                {!msg.read && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                )}
                <div className={`flex gap-3 ${!msg.read ? 'pl-2' : ''}`}>
                  <Avatar className="h-10 w-10 shrink-0 border border-zinc-200">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4
                        className={`text-sm truncate font-semibold ${msg.read ? 'text-zinc-700' : 'text-zinc-900'}`}
                      >
                        {msg.sender}
                      </h4>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2">
                        {msg.date}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${msg.read ? 'text-zinc-600' : 'font-medium text-zinc-900'}`}
                    >
                      {msg.subject}
                    </p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{msg.snippet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Viewer */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {activeMessage ? (
            <>
              <div className="p-6 border-b border-zinc-100 flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 leading-tight mb-4">
                    {activeMessage.subject}
                  </h2>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-zinc-200 shadow-sm">
                      <AvatarImage src={activeMessage.avatar} />
                      <AvatarFallback>{activeMessage.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900">
                          {activeMessage.sender}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-zinc-100 text-zinc-500 px-1.5 py-0 text-[10px] font-medium"
                        >
                          {activeMessage.department}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500">Para: Mim • {activeMessage.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="prose prose-sm max-w-none text-zinc-700 whitespace-pre-wrap">
                  {activeMessage.content}
                </div>
              </div>
              <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                <div className="relative">
                  <Input placeholder="Escreva uma resposta..." className="pr-20" />
                  <Button size="sm" className="absolute right-1 top-1 h-8">
                    Enviar
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
              <Mail className="h-12 w-12 mb-4 opacity-20" />
              <p>Selecione uma mensagem para ler.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
