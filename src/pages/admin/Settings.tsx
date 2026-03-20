import { useState } from 'react'
import {
  Settings as SettingsIcon,
  Save,
  UploadCloud,
  Building2,
  Calendar,
  GraduationCap,
  BellRing,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function Settings() {
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Configurações Salvas',
      description: 'Os parâmetros globais foram atualizados com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-zinc-400" />
            Configurações Globais
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Parâmetros institucionais e regras de negócio do sistema.
          </p>
        </div>
        <Button onClick={handleSave} className="shadow-sm h-9 px-4">
          <Save className="mr-2 h-4 w-4" /> Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-800">
                <Building2 className="h-4 w-4 text-zinc-400" /> Dados da Instituição
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-700">Nome Fantasia</Label>
                <Input defaultValue="Centro Universitário TOTVS" className="bg-zinc-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-700">CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-99" className="bg-zinc-50 font-mono" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-700">Telefone Principal</Label>
                  <Input defaultValue="(11) 4002-8922" className="bg-zinc-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-800">
                <GraduationCap className="h-4 w-4 text-zinc-400" /> Parâmetros Acadêmicos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-700">Ano Letivo Vigente</Label>
                  <Select defaultValue="2023">
                    <SelectTrigger className="bg-zinc-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-700">Semestre Atual</Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="bg-zinc-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Semestre</SelectItem>
                      <SelectItem value="2">2º Semestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold text-zinc-700">
                  Média Mínima para Aprovação
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    defaultValue="7.0"
                    step="0.5"
                    className="w-24 text-center bg-zinc-50 font-bold"
                  />
                  <span className="text-xs text-zinc-500">
                    Média padrão para o cálculo do diário de classe.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-800">
                Identidade Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-zinc-50/50">
                <img
                  src="https://img.usecurling.com/i?q=university&color=blue&shape=lineal-color"
                  alt="Logo"
                  className="w-20 h-20 mb-4 opacity-80 mix-blend-multiply"
                />
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <UploadCloud className="h-3.5 w-3.5 mr-2" /> Trocar Logotipo
                </Button>
                <p className="text-[10px] text-zinc-400 mt-2">Recomendado: PNG 200x200</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm bg-white">
            <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 py-4">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-800">
                <BellRing className="h-4 w-4 text-zinc-400" /> Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Envio de Faturas (Email)</Label>
                  <p className="text-[10px] text-zinc-500">
                    Boleto automático 5 dias antes do vencimento.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Alertas de Falta (SMS)</Label>
                  <p className="text-[10px] text-zinc-500">
                    Notificar responsável sobre faltas sucessivas.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
