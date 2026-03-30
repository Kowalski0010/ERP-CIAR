import { useState } from 'react'
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
import { Student } from '@/lib/types'
import { addStudent, updateStudent } from '@/services/students'
import { Loader2 } from 'lucide-react'

const studentSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  rgIssuer: z.string().optional(),
  nationality: z.string().optional(),
  birthCity: z.string().optional(),
  birthDate: z.string().optional(),
  maritalStatus: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  course: z.string().min(1, 'Curso na IES é obrigatório'),
  previousGraduation: z.string().optional(),
  address: z
    .object({
      zipCode: z.string().optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      neighborhood: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
})

export function StudentForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: Partial<Student>
  onSuccess: () => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      cpf: initialData?.cpf || '',
      rg: initialData?.rg || '',
      rgIssuer: initialData?.rgIssuer || '',
      nationality: initialData?.nationality || '',
      birthCity: initialData?.birthCity || '',
      birthDate: initialData?.birthDate || '',
      maritalStatus: initialData?.maritalStatus || '',
      motherName: initialData?.motherName || '',
      fatherName: initialData?.fatherName || '',
      course: initialData?.course || '',
      previousGraduation: initialData?.previousGraduation || '',
      address: {
        zipCode: initialData?.address?.zipCode || '',
        street: initialData?.address?.street || '',
        number: initialData?.address?.number || '',
        neighborhood: initialData?.address?.neighborhood || '',
        city: initialData?.address?.city || '',
        state: initialData?.address?.state || '',
      },
    },
  })

  const onSubmit = async (data: z.infer<typeof studentSchema>) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        await updateStudent(initialData.id, data)
        toast({ title: 'Sucesso', description: 'Aluno atualizado com sucesso.' })
      } else {
        await addStudent({ ...data, status: 'Ativo', enrollmentDate: new Date().toISOString() })
        toast({ title: 'Sucesso', description: 'Aluno cadastrado com sucesso.' })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar aluno',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length !== 8) return

    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        form.setValue('address.street', data.logradouro)
        form.setValue('address.neighborhood', data.bairro)
        form.setValue('address.city', data.localidade)
        form.setValue('address.state', data.uf)
      } else {
        toast({ title: 'CEP não encontrado', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Erro ao buscar CEP', variant: 'destructive' })
    } finally {
      setCepLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone Celular</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rgIssuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Órgão Emissor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nacionalidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade Natal</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado Civil</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Solteiro(a)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="motherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Mãe</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Pai</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CEP {cepLoading && <Loader2 className="inline h-3 w-3 animate-spin ml-2" />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onBlur={(e) => {
                        field.onBlur()
                        handleCepBlur(e)
                      }}
                      placeholder="00000-000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado (UF)</FormLabel>
                  <FormControl>
                    <Input maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Dados Acadêmicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso na IES</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Engenharia Civil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousGraduation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduação Anterior (Fora da IES)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Administração pela USP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Documentos</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormItem>
              <FormLabel>Anexar Cópias de Documentos (RG, CPF, Certificados)</FormLabel>
              <FormControl>
                <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Apenas arquivos PDF ou imagens. (Upload em desenvolvimento)
              </p>
            </FormItem>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {initialData?.id ? 'Atualizar' : 'Salvar Aluno'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
