import { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Circle, PlayCircle, HelpCircle, Send, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/contexts/AppContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOnboarding } from '@/hooks/use-onboarding'
import { onboardingData } from '@/lib/onboarding-data'

interface SupportCenterProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportCenter({ isOpen, onOpenChange }: SupportCenterProps) {
  const { currentUserRole } = useAppStore()
  const { toast } = useToast()
  const content = onboardingData[currentUserRole] || onboardingData.Default
  const { completedItems, toggleItem } = useOnboarding(currentUserRole)
  const [supportMessage, setSupportMessage] = useState('')

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!supportMessage.trim()) return
    onOpenChange(false)
    setSupportMessage('')
    toast({
      title: 'Chamado Aberto',
      description: 'Sua solicitação de suporte foi enviada. A equipe técnica responderá em breve.',
    })
  }

  const progress = Math.round((completedItems.length / content.checklist.length) * 100) || 0

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[450px] p-0 flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="h-5 w-5 text-blue-600" /> Centro de Suporte
          </SheetTitle>
          <SheetDescription className="mt-1.5">
            Aprenda a utilizar o sistema, tire suas dúvidas ou fale com nossa equipe.
          </SheetDescription>
        </div>

        <Tabs defaultValue="onboarding" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 border-b border-zinc-100 dark:border-zinc-800">
            <TabsList className="w-full grid grid-cols-4 bg-zinc-100 dark:bg-zinc-900">
              <TabsTrigger value="onboarding" className="text-xs">
                Início
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="text-xs">
                Tutoriais
              </TabsTrigger>
              <TabsTrigger value="faq" className="text-xs">
                FAQ
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs">
                Chamado
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <TabsContent value="onboarding" className="m-0 space-y-6 animate-fade-in">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Seu Progresso Inicial
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Configuração do Perfil ({currentUserRole})
                    </span>
                    <span className="text-emerald-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-zinc-100 dark:bg-zinc-800" />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Passos Recomendados
                </h4>
                <div className="space-y-2">
                  {content.checklist.map((item) => {
                    const isDone = completedItems.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all group ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30'
                            : 'bg-white border-zinc-200 hover:border-blue-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-blue-700'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-600 shrink-0 group-hover:text-blue-400 transition-colors" />
                        )}
                        <span
                          className={`text-sm font-medium ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}
                        >
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {progress === 100 && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2">
                    <Check className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>
                      Parabéns! Você completou os passos iniciais sugeridos para o seu perfil.
                      Explore os tutoriais para aprender mais.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="m-0 space-y-4 animate-fade-in">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
                <PlayCircle className="h-4 w-4 text-blue-500" />
                Vídeos e Guias
              </h3>
              <div className="grid gap-3">
                {content.tutorials.map((t, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 relative">
                      <img
                        src={`https://img.usecurling.com/p/400/225?q=tutorial&color=blue&seed=${t.seed}`}
                        alt="Tutorial"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-multiply dark:mix-blend-overlay"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <PlayCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-mono">
                        {t.duration}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {t.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">Guia prático em vídeo</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="m-0 space-y-4 animate-fade-in">
              <div className="mb-4">
                <Input type="search" placeholder="Buscar pergunta..." className="h-9 text-sm" />
              </div>
              <Accordion type="single" collapsible className="w-full">
                {content.faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="contact" className="m-0 animate-fade-in h-full flex flex-col pb-8">
              <form onSubmit={handleSupportSubmit} className="space-y-4 flex-1 flex flex-col">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Abrir Chamado
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    Nossa equipe técnica responderá o mais breve possível.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Assunto</Label>
                  <Input placeholder="Ex: Dúvida sobre relatórios" required />
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <Label>Mensagem</Label>
                  <Textarea
                    placeholder="Descreva detalhadamente a sua solicitação..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                    className="flex-1 resize-none min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="w-full mt-auto">
                  <Send className="w-4 h-4 mr-2" /> Enviar Solicitação
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
