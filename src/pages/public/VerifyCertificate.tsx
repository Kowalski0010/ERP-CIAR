import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ShieldCheck, FileText, ArrowLeft, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function VerifyCertificate() {
  const { code } = useParams()

  // For demonstration, code ending in "fail" will show an error, otherwise success.
  const isValid = !code?.endsWith('fail')

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-500 hover:text-zinc-900 -ml-2"
          asChild
        >
          <Link to="/login">
            <ArrowLeft className="h-4 w-4 mr-2" /> Portal de Acesso
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg border-zinc-200 relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-full h-1.5 ${isValid ? 'bg-emerald-500' : 'bg-rose-500'}`}
        />

        <CardHeader className="pb-4 pt-8 text-center border-b border-zinc-100">
          <div className="flex justify-center mb-4">
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center ${isValid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
            >
              {isValid ? <ShieldCheck className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-zinc-900">
            {isValid ? 'Documento Autêntico' : 'Documento Inválido'}
          </CardTitle>
          <p className="text-sm text-zinc-500 mt-2">Validação de Assinatura Digital e Emissão</p>
        </CardHeader>

        <CardContent className="pt-6">
          {isValid ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-md flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-900 text-sm">
                    Código Verificado com Sucesso
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Este documento foi emitido pelo sistema CIAR e sua integridade está garantida.
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-zinc-50 p-4 rounded-md border border-zinc-200">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <span className="font-semibold text-zinc-800 text-sm">Dados do Documento</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-500">
                      Protocolo (Hash)
                    </span>
                    <span className="font-mono text-zinc-900">{code || 'CIAR-88X992'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-zinc-500">
                      Data de Emissão
                    </span>
                    <span className="font-medium text-zinc-900">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] uppercase font-bold text-zinc-500">
                      Tipo de Documento
                    </span>
                    <Badge variant="outline" className="bg-white mt-1">
                      Declaração de Matrícula
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] uppercase font-bold text-zinc-500">
                      Titular
                    </span>
                    <span className="font-medium text-zinc-900">
                      Ana Silva Costa (CPF: ***.456.789-**)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-md text-center">
              <h4 className="font-semibold text-rose-900 text-sm mb-1">Código Não Encontrado</h4>
              <p className="text-xs text-rose-700">
                O código {code} não existe em nossa base de dados ou o documento foi revogado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
