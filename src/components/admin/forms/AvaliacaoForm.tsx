import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/contexts/AppContext'

const schema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  subject: z.string().min(2, 'Disciplina obrigatória'),
  type: z.string().min(1, 'Tipo obrigatório'),
  date: z.string().min(1, 'Data obrigatória'),
})

export function AvaliacaoForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const { addAvaliacao } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      subject: '',
      type: 'Prova Escrita',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    addAvaliacao(data)
    toast({ title: 'Avaliação Salva', description: 'Registro criado com sucesso.' })
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Avaliação</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Prova N1..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cálculo I" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Prova Escrita">Prova Escrita</SelectItem>
                    <SelectItem value="Trabalho Prático">Trabalho Prático</SelectItem>
                    <SelectItem value="Seminário">Seminário</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Aplicação</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Registro</Button>
        </div>
      </form>
    </Form>
  )
}
