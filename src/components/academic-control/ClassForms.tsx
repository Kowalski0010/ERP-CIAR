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

const vincularSchema = z.object({
  classId: z.string().min(1, 'Turma obrigatória'),
  subjectId: z.string().min(1, 'Disciplina obrigatória'),
})

export function VincularDisciplinaForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof vincularSchema>>({
    resolver: zodResolver(vincularSchema),
    mode: 'onChange',
    defaultValues: { classId: '', subjectId: '' },
  })

  const onSubmit = (data: z.infer<typeof vincularSchema>) => {
    toast({ title: 'Vínculo Criado', description: 'Grade curricular atualizada.' })
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma (Destino)</FormLabel>
              <FormControl>
                <Input placeholder="Código da Turma..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina a Incluir</FormLabel>
              <FormControl>
                <Input placeholder="Código da Disciplina..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Vincular</Button>
        </div>
      </form>
    </Form>
  )
}

const alocarSchema = z.object({
  teacherId: z.string().min(1, 'Professor obrigatório'),
  classId: z.string().min(1, 'Turma obrigatória'),
})

export function AlocarProfessorForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof alocarSchema>>({
    resolver: zodResolver(alocarSchema),
    mode: 'onChange',
    defaultValues: { teacherId: '', classId: '' },
  })

  const onSubmit = (data: z.infer<typeof alocarSchema>) => {
    toast({ title: 'Alocação Salva', description: 'Professor designado para a turma.' })
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor (CPF/ID)</FormLabel>
              <FormControl>
                <Input placeholder="Buscar professor..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma (Alocação)</FormLabel>
              <FormControl>
                <Input placeholder="Código da Turma..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Alocar Docente</Button>
        </div>
      </form>
    </Form>
  )
}

const notasSchema = z.object({
  studentId: z.string().min(1, 'Aluno obrigatório'),
  subjectId: z.string().min(1, 'Disciplina obrigatória'),
  grade: z.coerce.number().min(0).max(10, 'Nota inválida (0-10)'),
})

export function LancarNotasForm({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof notasSchema>>({
    resolver: zodResolver(notasSchema),
    mode: 'onChange',
    defaultValues: { studentId: '', subjectId: '', grade: 0 },
  })

  const onSubmit = (data: z.infer<typeof notasSchema>) => {
    toast({ title: 'Nota Lançada', description: 'Registro individual atualizado no diário.' })
    onCancel()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno (Matrícula)</FormLabel>
              <FormControl>
                <Input placeholder="Buscar aluno..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Código da disciplina..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota Avaliativa (0 a 10)</FormLabel>
              <FormControl>
                <Input type="number" step="0.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Nota</Button>
        </div>
      </form>
    </Form>
  )
}
