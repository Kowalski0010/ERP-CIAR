import { useState, useEffect } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Student } from '@/lib/types'
import { addStudent, updateStudent } from '@/services/students'
import { createInstallments } from '@/services/payments'
import { getCourses } from '@/services/courses'
import { Loader2, Check } from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'

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
  // Financial Plan
  planInstallments: z.coerce.number().min(1, 'Mínimo 1').optional(),
  planValue: z.coerce.number().min(0, 'Valor inválido').optional(),
  planFirstDueDate: z.string().optional(),
  // Docs
  avatar: z.string().optional(),
  documents: z.any().optional(),
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
  const [courses, setCourses] = useState<any[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data || [])
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setCoursesLoading(false)
      }
    }
    fetchCourses()
  }, [])

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
      planInstallments: 12,
      planValue: 850,
      planFirstDueDate: new Date().toISOString().split('T')[0],
      avatar: initialData?.avatar || '',
    },
  })

  const onSubmit = async (data: z.infer<typeof studentSchema>) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        await updateStudent(initialData.id, data)
        toast({ title: 'Sucesso', description: 'Aluno atualizado com sucesso.' })
      } else {
        const newStudent = await addStudent({
          ...data,
          status: 'Ativo',
          enrollmentDate: new Date().toISOString(),
        })

        // Se for aluno novo e tiver plano financeiro preenchido, gera os pagamentos
        if (data.planInstallments && data.planValue && data.planFirstDueDate) {
          await createInstallments(
            newStudent.id,
            newStudent.name,
            data.planInstallments,
            data.planValue,
            data.planFirstDueDate,
          )
        }

        toast({
          title: 'Matrícula Realizada',
          description: 'Aluno cadastrado e financeiro gerado com sucesso.',
        })
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

  const renderInput = (name: any, label: string, type = 'text', placeholder = '') => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} value={field.value || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="pessoais" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pessoais" className="text-xs">
              Pessoais
            </TabsTrigger>
            <TabsTrigger value="endereco" className="text-xs">
              Endereço
            </TabsTrigger>
            <TabsTrigger value="academico" className="text-xs">
              Acadêmico
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="text-xs">
              Financeiro/Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pessoais" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('name', 'Nome Completo', 'text', 'Nome do Aluno')}
              {renderInput('email', 'E-mail', 'email')}
              {renderInput('phone', 'Telefone Celular', 'text', '(00) 00000-0000')}
              {renderInput('cpf', 'CPF', 'text', '000.000.000-00')}
              {renderInput('rg', 'RG')}
              {renderInput('rgIssuer', 'Órgão Emissor')}
              {renderInput('birthDate', 'Data de Nascimento', 'date')}
              {renderInput('nationality', 'Nacionalidade')}
              {renderInput('birthCity', 'Cidade Natal')}
              {renderInput('maritalStatus', 'Estado Civil')}
              {renderInput('motherName', 'Nome da Mãe')}
              {renderInput('fatherName', 'Nome do Pai')}
            </div>
          </TabsContent>

          <TabsContent value="endereco" className="space-y-4 mt-4">
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
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {renderInput('address.street', 'Logradouro')}
              {renderInput('address.number', 'Número')}
              {renderInput('address.neighborhood', 'Bairro')}
              {renderInput('address.city', 'Cidade')}
              {renderInput('address.state', 'Estado (UF)')}
            </div>
          </TabsContent>

          <TabsContent value="academico" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Graduação / Curso{' '}
                      {coursesLoading && <Loader2 className="inline h-3 w-3 animate-spin ml-2" />}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={coursesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                        {courses.length === 0 && !coursesLoading && (
                          <SelectItem value="none" disabled>
                            Nenhum curso cadastrado
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {renderInput('previousGraduation', 'Graduação Anterior (Fora da IES)')}
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4 mt-4">
            {!initialData?.id && (
              <>
                <h4 className="text-sm font-semibold text-foreground border-b pb-2">
                  Plano Financeiro (Geração Automática)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInput('planInstallments', 'Qtd. Parcelas', 'number')}
                  {renderInput('planValue', 'Valor Mensalidade (R$)', 'number')}
                  {renderInput('planFirstDueDate', '1º Vencimento', 'date')}
                </div>
              </>
            )}

            <h4 className="text-sm font-semibold text-foreground border-b pb-2 mt-6">
              Documentação
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto do Perfil</FormLabel>
                    <FormControl>
                      <FileUpload
                        accept="image/*"
                        label="Anexar Foto"
                        onUpload={(files) => field.onChange(files[0]?.url)}
                      />
                    </FormControl>
                    {field.value && (
                      <p className="text-xs text-emerald-600 mt-1">
                        <Check className="inline w-3 h-3 mr-1" /> Foto anexada com sucesso
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documentos Pessoais (RG, CPF, Comprovantes)</FormLabel>
                    <FormControl>
                      <FileUpload
                        multiple
                        accept="image/*,application/pdf"
                        label="Anexar Documentos"
                        onUpload={(files) => field.onChange(files)}
                      />
                    </FormControl>
                    {field.value?.length > 0 && (
                      <p className="text-xs text-emerald-600 mt-1">
                        <Check className="inline w-3 h-3 mr-1" /> {field.value.length} arquivo(s)
                        anexado(s)
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {initialData?.id ? 'Atualizar Aluno' : 'Efetivar Matrícula'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
