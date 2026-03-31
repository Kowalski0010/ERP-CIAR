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
import { supabase } from '@/lib/supabase/client'

const schema = z.object({
  name: z.string().min(3, 'Nome da disciplina obrigatório'),
  workload: z.coerce.number().min(1, 'Carga horária deve ser maior que zero'),
  teacher: z.string().optional(),
  course: z.string().optional(),
  observations: z.string().optional(),
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
      teacher: initialData?.teacher || '',
      course: initialData?.course || '',
      observations: initialData?.observations || '',
    },
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (initialData?.id) {
        const { data: updated, error } = await supabase
          .from('disciplinas')
          .update({
            name: data.name,
            workload: data.workload,
            teacher: data.teacher || null,
            course: data.course || null,
            observations: data.observations || null,
          })
          .eq('id', initialData.id)
          .select()
          .single()

        if (error) throw error

        updateDisciplina(initialData.id, updated as any)
        toast({
          title: 'Disciplina Atualizada',
          description: 'Registro atualizado com sucesso no banco de dados.',
        })
      } else {
        const { data: saved, error } = await supabase
          .from('disciplinas')
          .insert([
            {
              name: data.name,
              workload: data.workload,
              teacher: data.teacher || null,
              course: data.course || null,
              observations: data.observations || null,
            },
          ])
          .select()
          .single()

        if (error) throw error

        addDisciplina(saved as any)
        toast({
          title: 'Disciplina Salva',
          description: 'Registro criado com sucesso no banco de dados.',
        })
      }
      onCancel()
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao salvar a disciplina permanentemente.',
        variant: 'destructive',
      })
    }
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
        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor da Disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Professor" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso Vinculado</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Curso" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informações adicionais..."
                  {...field}
                  value={field.value || ''}
                />
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
