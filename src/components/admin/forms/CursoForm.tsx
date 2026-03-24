import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
import { Curso } from '@/lib/types'

const schema = z.object({
  name: z.string().min(3, 'Nome do curso é obrigatório'),
  mode: z.string().min(1, 'Modalidade obrigatória'),
  duration: z.coerce.number().min(1, 'Duração deve ser maior que zero'),
  description: z.string().optional(),
})

export function CursoForm({
  onCancel,
  initialData,
}: {
  onCancel: () => void
  initialData?: Curso | null
}) {
  const { toast } = useToast()
  const { addCurso, updateCurso } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      mode: initialData?.mode || 'Presencial',
      duration: initialData?.duration || 3600,
      description: initialData?.description || '',
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (initialData?.id) {
      updateCurso(initialData.id, data)
      toast({ title: 'Curso Atualizado', description: 'Registro atualizado com sucesso.' })
    } else {
      addCurso(data)
      toast({ title: 'Curso Salvo', description: 'Registro criado com sucesso.' })
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
              <FormLabel>Nome do Curso</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Engenharia de Software" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="EAD">EAD</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carga Horária Total (h)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição / Ementa Base</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes do curso..." className="resize-none" {...field} />
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
