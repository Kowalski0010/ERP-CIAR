import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Cloud, CheckCircle, Database, Play } from 'lucide-react'

export default function BackupSettings() {
  const { toast } = useToast()
  const [isAutomated, setIsAutomated] = useState(true)
  const [provider, setProvider] = useState('gdrive')
  const [isRunning, setIsRunning] = useState(false)

  const handleSave = () => {
    toast({
      title: 'Configurações Salvas',
      description: 'As preferências de backup em nuvem foram atualizadas com sucesso.',
    })
  }

  const handleRunNow = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      toast({
        title: 'Backup Concluído',
        description: 'A exportação completa do banco de dados foi sincronizada com a nuvem.',
      })
    }, 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[800px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Cloud className="h-7 w-7 text-zinc-400" />
            Configurações de Backup em Nuvem
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gerencie as exportações diárias automatizadas do banco de dados.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm bg-white">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
          <CardTitle className="text-base text-zinc-800">Rotina Automatizada</CardTitle>
          <CardDescription className="text-xs">
            Ative o backup diário para manter os dados da instituição seguros em serviços externos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-zinc-900">
                Exportação Diária (Automática)
              </Label>
              <p className="text-xs text-zinc-500">O sistema rodará às 03:00 da manhã.</p>
            </div>
            <Switch checked={isAutomated} onCheckedChange={setIsAutomated} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-zinc-900">Serviço de Destino</Label>
            <Select value={provider} onValueChange={setProvider} disabled={!isAutomated}>
              <SelectTrigger className="w-full sm:w-64 bg-zinc-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gdrive">Google Drive</SelectItem>
                <SelectItem value="dropbox">Dropbox</SelectItem>
                <SelectItem value="aws">AWS S3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md">
            <h4 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
              <Database className="h-4 w-4 text-zinc-500" /> Status do Sistema
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Último Backup
                </p>
                <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="h-3.5 w-3.5" /> Sucesso (Hoje, 03:02 AM)
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Próxima Rotina
                </p>
                <p className="text-sm font-medium text-zinc-800 mt-0.5">Amanhã, 03:00 AM</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex gap-3">
            <Button onClick={handleSave} className="shadow-sm">
              Salvar Preferências
            </Button>
            <Button
              variant="outline"
              onClick={handleRunNow}
              disabled={isRunning}
              className="shadow-sm"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Executando...' : 'Forçar Backup Agora'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
