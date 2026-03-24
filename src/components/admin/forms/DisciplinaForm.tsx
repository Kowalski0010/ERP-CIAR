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
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/contexts/AppContext'
import { Disciplina } from '@/lib/types'

const schema = z.object({
  name: z.string().min(3, 'Nome da disciplina obrigatório'),
  workload: z.coerce.number().min(1, 'Carga horária deve ser maior que zero'),
})

export function DisciplinaForm({
  onCancel,
  initialData,
}: {
  onCancel: () => void
  initialData?: Disciplina | null
}) {
  const { toast } = useToast()
  const { addDisciplina, updateDisciplina } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      workload: initialData?.workload || 40,
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (initialData?.id) {
      updateDisciplina(initialData.id, data)
      toast({ title: 'Disciplina Atualizada', description: 'Registro atualizado com sucesso.' })
    } else {
      addDisciplina(data)
      toast({ title: 'Disciplina Salva', description: 'Registro criado com sucesso.' })
    }
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
              <FormLabel>Nome da Disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Banco de Dados Aplicado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carga Horária Semestral (h)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialData ? 'Atualizar Registro' : 'Salvar Registro'}</Button>
        </div>
      </form>
    </Form>
  )
}
