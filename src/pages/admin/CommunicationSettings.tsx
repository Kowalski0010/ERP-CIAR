import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Save, MessageCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function CommunicationSettings() {
  const { toast } = useToast()

  const [paymentMsg, setPaymentMsg] = useState(
    'Olá {nome_responsavel}, lembramos que a fatura do aluno {nome_aluno} vence no dia {data_vencimento}. Acesse o portal para obter o boleto.',
  )
  const [noticeMsg, setNoticeMsg] = useState('Aviso Escolar da CIAR: {mensagem_aviso}.')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Configurações Salvas',
      description: 'Os templates oficiais para envio de WhatsApp foram atualizados com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[800px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-emerald-500" />
            Configurações WhatsApp
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Padronize as mensagens automáticas e envios transacionais.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-base text-zinc-800">Templates de Disparo</CardTitle>
          <CardDescription className="text-xs">
            Utilize as tags em chaves para permitir a substituição inteligente de dados do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-zinc-900">
                  Lembretes de Pagamento Financeiro
                </Label>
              </div>
              <p className="text-[11px] text-zinc-500 mb-2">
                Tags disponíveis:{' '}
                <code className="bg-zinc-100 px-1 py-0.5 rounded text-blue-600">{`{nome_responsavel}`}</code>
                ,{' '}
                <code className="bg-zinc-100 px-1 py-0.5 rounded text-blue-600">{`{nome_aluno}`}</code>
                ,{' '}
                <code className="bg-zinc-100 px-1 py-0.5 rounded text-blue-600">{`{data_vencimento}`}</code>
                ,{' '}
                <code className="bg-zinc-100 px-1 py-0.5 rounded text-blue-600">{`{valor_fatura}`}</code>
              </p>
              <textarea
                value={paymentMsg}
                onChange={(e) => setPaymentMsg(e.target.value)}
                required
                rows={3}
                className="w-full p-3 text-sm rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-zinc-50 resize-none"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <Label className="text-sm font-semibold text-zinc-900">
                Avisos Escolares (Broadcast)
              </Label>
              <p className="text-[11px] text-zinc-500 mb-2">
                Tags disponíveis:{' '}
                <code className="bg-zinc-100 px-1 py-0.5 rounded text-blue-600">{`{mensagem_aviso}`}</code>
                ,{' '}
                <code className="bg-zinc-100 px-1 py-0.5 rounded text-blue-600">{`{nome_turma}`}</code>
              </p>
              <textarea
                value={noticeMsg}
                onChange={(e) => setNoticeMsg(e.target.value)}
                required
                rows={3}
                className="w-full p-3 text-sm rounded-md border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-zinc-50 resize-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-md flex gap-2 items-start mt-4">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                O sistema utilizará sempre o número cadastrado no perfil de{' '}
                <strong>Responsáveis</strong> do aluno. Certifique-se de que os números possuam DDD
                e estejam no formato correto para evitar falhas no disparo.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" /> Salvar Templates
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
