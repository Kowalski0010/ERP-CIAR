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
import { ClassRoom } from '@/lib/types'
import { addClass as addClassDb, updateClass as updateClassDb } from '@/services/db'

const schema = z.object({
  name: z.string().min(3, 'Nome da turma obrigatório'),
  course: z.string().min(2, 'Curso obrigatório'),
  semester: z.string().min(1, 'Semestre obrigatório'),
  capacity: z.coerce.number().min(1, 'Capacidade deve ser maior que zero'),
  room: z.string().optional(),
  year: z.string().optional(),
  shift: z.string().optional(),
})

export function TurmaForm({
  onCancel,
  initialData,
}: {
  onCancel: () => void
  initialData?: ClassRoom | null
}) {
  const { toast } = useToast()
  const { addClass, updateClass } = useAppStore()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      course: initialData?.course || '',
      semester: initialData?.semester || '',
      capacity: initialData?.capacity || 40,
      room: initialData?.room || '',
      year: initialData?.year || new Date().getFullYear().toString(),
      shift: initialData?.shift || 'Noturno',
    },
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (initialData?.id) {
        const updated = await updateClassDb(initialData.id, data)
        updateClass(initialData.id, updated)
        toast({
          title: 'Turma Atualizada',
          description: 'Registro atualizado com sucesso no banco de dados.',
        })
      } else {
        const newClass = {
          ...data,
          id: `T${Math.floor(Math.random() * 1000)}`,
        }
        const saved = await addClassDb(newClass)
        addClass(saved)
        toast({
          title: 'Turma Salva',
          description: 'Registro criado com sucesso no banco de dados.',
        })
      }
      onCancel()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar os dados permanentemente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Turma</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: T01 - Turma A" {...field} />
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
                  <Input placeholder="Ex: Engenharia de Software" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semestre de Ingresso</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1º Semestre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano Letivo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shift"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turno</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Matutino">Matutino</SelectItem>
                    <SelectItem value="Vespertino">Vespertino</SelectItem>
                    <SelectItem value="Noturno">Noturno</SelectItem>
                    <SelectItem value="Integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade (Alunos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Sala Base (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Sala 101" {...field} />
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
          <Button type="submit">{initialData ? 'Atualizar Turma' : 'Salvar Turma'}</Button>
        </div>
      </form>
    </Form>
  )
}
