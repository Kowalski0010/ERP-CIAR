import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, UploadCloud, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TeacherApplication() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-zinc-200">
          <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Inscrição Recebida!</h2>
            <p className="text-zinc-600 mb-6">
              Agradecemos seu interesse em fazer parte do nosso corpo docente. Seu currículo foi
              encaminhado para o departamento de Recursos Humanos.
            </p>
            <Button asChild className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90">
              <Link to="/login">Voltar para a Página Inicial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-500 hover:text-zinc-900 -ml-2"
          asChild
        >
          <Link to="/login">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-2xl shadow-lg border-zinc-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1e3a8a]" />
        <CardHeader className="pb-6 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#1e3a8a]">
                Trabalhe Conosco (Docentes)
              </CardTitle>
              <CardDescription>
                Portal de submissão de currículos para o banco de talentos institucionais.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input required placeholder="Ex: João Silva Mendes" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail Principal</Label>
                  <Input required type="email" placeholder="joao@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone / Celular</Label>
                  <Input required placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label>Link do Lattes / LinkedIn (Opcional)</Label>
                  <Input placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">
                Perfil Acadêmico
              </h3>
              <div className="space-y-2">
                <Label>Disciplinas de Interesse (Separadas por vírgula)</Label>
                <Input required placeholder="Ex: Cálculo I, Álgebra Linear, Física" />
              </div>
              <div className="space-y-2">
                <Label>Maior Titulação</Label>
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="" disabled selected>
                    Selecione...
                  </option>
                  <option value="especialista">Especialista</option>
                  <option value="mestre">Mestre</option>
                  <option value="doutor">Doutor</option>
                  <option value="posdoutor">Pós-Doutor</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-zinc-900 border-b pb-2">
                Anexo de Currículo
              </h3>
              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <UploadCloud className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-zinc-900">
                  Clique para selecionar o arquivo
                </p>
                <p className="text-xs text-zinc-500 mt-1">PDF, DOCX ou JPG (Máx. 5MB)</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-semibold"
            >
              Submeter Candidatura
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
