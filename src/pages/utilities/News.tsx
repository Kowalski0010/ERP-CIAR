import { Newspaper, Bell, Calendar, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const newsItems = [
  {
    id: 1,
    title: 'Atualização do Sistema - Versão 2.4.1',
    category: 'Sistema',
    date: '25 Out 2023',
    excerpt:
      'Nova atualização do ERP inclui melhorias no módulo financeiro e correções de bugs no portal do aluno. Leia as notas de lançamento completas.',
    image: 'https://img.usecurling.com/p/600/300?q=software&color=blue',
    important: true,
  },
  {
    id: 2,
    title: 'Abertura de Matrículas 2024.1',
    category: 'Institucional',
    date: '22 Out 2023',
    excerpt:
      'O período de rematrícula e novas adesões para o primeiro semestre de 2024 começará no dia 10 de Novembro. Verifique o calendário.',
    image: 'https://img.usecurling.com/p/600/300?q=university&color=green',
    important: false,
  },
  {
    id: 3,
    title: 'Novo Processo de Avaliação Institucional (CPA)',
    category: 'Acadêmico',
    date: '18 Out 2023',
    excerpt:
      'Professores e alunos, participem da avaliação da CPA deste semestre. O link estará disponível no portal a partir de amanhã.',
    image: 'https://img.usecurling.com/p/600/300?q=exam&color=yellow',
    important: false,
  },
  {
    id: 4,
    title: 'Manutenção Preventiva - Ar Condicionado',
    category: 'Infraestrutura',
    date: '15 Out 2023',
    excerpt:
      'Informamos que as manutenções preventivas dos aparelhos do Bloco B ocorrerão neste fim de semana.',
    image: 'https://img.usecurling.com/p/600/300?q=tools&color=gray',
    important: false,
  },
]

export default function News() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Newspaper className="h-7 w-7 text-zinc-400" />
            Mural de Avisos e Notícias
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Fique por dentro das atualizações e comunicados da instituição.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {newsItems.map((item) => (
            <Card
              key={item.id}
              className="border-zinc-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="md:flex h-full">
                <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.important && (
                    <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600 shadow-sm border-none">
                      <Bell className="w-3 h-3 mr-1" /> Importante
                    </Badge>
                  )}
                </div>
                <div className="md:w-2/3 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-bold text-blue-600 border-blue-200 bg-blue-50 px-2 py-0.5"
                      >
                        {item.category}
                      </Badge>
                      <span className="text-[11px] text-zinc-500 flex items-center font-medium">
                        <Calendar className="w-3 h-3 mr-1" /> {item.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-600 line-clamp-2">{item.excerpt}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-semibold h-8 px-2"
                    >
                      Ler notícia completa <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 shadow-sm bg-zinc-50/50">
            <CardHeader className="py-4 border-b border-zinc-200 bg-white">
              <CardTitle className="text-sm font-semibold">Tópicos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-200">
                {[
                  'Eventos e Palestras',
                  'Manuais do Sistema',
                  'Políticas de RH',
                  'Orientações aos Discentes',
                ].map((topic) => (
                  <div
                    key={topic}
                    className="p-3 hover:bg-zinc-100 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <span className="text-sm font-medium text-zinc-700">{topic}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm bg-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bell className="w-24 h-24" />
            </div>
            <CardContent className="p-6 relative z-10">
              <h3 className="font-bold text-lg mb-2">Notificações no Email</h3>
              <p className="text-sm text-blue-100 mb-4">
                Mantenha seu e-mail institucional atualizado para não perder avisos importantes.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold w-full"
              >
                Verificar Cadastros
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
