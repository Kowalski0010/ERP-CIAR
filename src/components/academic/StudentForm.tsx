import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Student, StudentDocument } from '@/lib/types'
import { addStudent, updateStudent } from '@/services/students'
import { createInstallments } from '@/services/payments'
import { getCourses } from '@/services/courses'
import { uploadDocument } from '@/services/storage'
import { Loader2 } from 'lucide-react'
import {
  StudentDocumentManager,
  DOCUMENT_TYPES,
} from '@/components/academic/StudentDocumentManager'

const studentSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  registrationCode: z.string().optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  birthCity: z.string().optional().or(z.literal('')),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  rg: z.string().optional().or(z.literal('')),
  rgIssuer: z.string().optional().or(z.literal('')),
  cpf: z.string().optional().or(z.literal('')),
  maritalStatus: z.string().optional().or(z.literal('')),
  motherName: z.string().optional().or(z.literal('')),
  fatherName: z.string().optional().or(z.literal('')),
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
  phone: z.string().optional().or(z.literal('')),
  course: z.string().optional().or(z.literal('')),
  previousGraduation: z.string().optional().or(z.literal('')),
  contract: z.string().optional().or(z.literal('')),
  observations: z.string().optional().or(z.literal('')),
  dueDay: z.union([z.coerce.number(), z.literal('')]).optional(),
  planInstallments: z.union([z.coerce.number().min(1), z.literal('')]).optional(),
  planValue: z.union([z.coerce.number().min(0), z.literal('')]).optional(),
  planFirstDueDate: z.string().optional().or(z.literal('')),
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
  const [documents, setDocuments] = useState<StudentDocument[]>(
    initialData?.uploadedDocuments || [],
  )
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({})

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => {})
      .finally(() => setCoursesLoading(false))
  }, [])

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: initialData?.name || '',
      registrationCode: initialData?.registrationCode || '',
      nationality: initialData?.nationality || '',
      birthCity: initialData?.birthCity || '',
      email: initialData?.email || '',
      birthDate: initialData?.birthDate || '',
      rg: initialData?.rg || '',
      rgIssuer: initialData?.rgIssuer || '',
      cpf: initialData?.cpf || '',
      maritalStatus: initialData?.maritalStatus || '',
      motherName: initialData?.motherName || '',
      fatherName: initialData?.fatherName || '',
      address: {
        zipCode: initialData?.address?.zipCode || '',
        street: initialData?.address?.street || '',
        number: initialData?.address?.number || '',
        neighborhood: initialData?.address?.neighborhood || '',
        city: initialData?.address?.city || '',
        state: initialData?.address?.state || '',
      },
      phone: initialData?.phone || '',
      course: initialData?.course || '',
      previousGraduation: initialData?.previousGraduation || '',
      contract: initialData?.contract || '',
      observations: initialData?.observations || '',
      dueDay: initialData?.dueDay || '',
      planInstallments: 12,
      planValue: 850,
      planFirstDueDate: new Date().toISOString().split('T')[0],
    },
  })

  const sanitize = (val: any): any => {
    if (val === '') return null
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const o: any = {}
      for (const k in val) o[k] = sanitize(val[k])
      return o
    }
    return val
  }

  const onSubmit = async (data: z.infer<typeof studentSchema>) => {
    setLoading(true)
    try {
      const cleanData = sanitize(data)
      if (initialData?.id) {
        await updateStudent(initialData.id, { ...cleanData, uploadedDocuments: documents })
        toast({ title: 'Sucesso', description: 'Aluno atualizado com sucesso.' })
      } else {
        const newStudent = await addStudent({
          ...cleanData,
          status: 'Ativo',
          enrollmentDate: new Date().toISOString(),
          uploadedDocuments: [],
        })
        const uploadedDocs: StudentDocument[] = []
        for (const [docType, file] of Object.entries(pendingFiles)) {
          const label = DOCUMENT_TYPES.find((d) => d.key === docType)?.label || docType
          const result = await uploadDocument(newStudent.id, docType, file)
          uploadedDocs.push({ docType, label, ...result })
        }
        if (uploadedDocs.length > 0)
          await updateStudent(newStudent.id, { uploadedDocuments: uploadedDocs })
        if (cleanData.planInstallments && cleanData.planValue && cleanData.planFirstDueDate) {
          await createInstallments(
            newStudent.id,
            newStudent.name,
            cleanData.planInstallments,
            cleanData.planValue,
            cleanData.planFirstDueDate,
          )
        }
        toast({
          title: 'Matrícula Realizada',
          description: 'Aluno cadastrado e documentos salvos.',
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: 'Erro no Cadastro',
        description: error.message || 'Falha ao cadastrar.',
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
      const d = await res.json()
      if (!d.erro) {
        form.setValue('address.street', d.logradouro)
        form.setValue('address.neighborhood', d.bairro)
        form.setValue('address.city', d.localidade)
        form.setValue('address.state', d.uf)
      }
    } catch {
      /* intentionally ignored */
    } finally {
      setCepLoading(false)
    }
  }

  const ri = (name: any, label: string, type = 'text', ph = '') => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={ph} {...field} value={field.value || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
  const rt = (name: any, label: string, rows = 3) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea rows={rows} {...field} value={field.value || ''} />
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
            <TabsTrigger value="docs" className="text-xs">
              Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pessoais" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ri('name', 'Nome Completo', 'text', 'Nome do Aluno')}
              {ri('registrationCode', 'Matrícula', 'text', 'Ex: 26-001')}
              {ri('nationality', 'Nacionalidade')}
              {ri('birthCity', 'Cidade Natal')}
              {ri('email', 'E-mail', 'email')}
              {ri('birthDate', 'Data de Nascimento', 'date')}
              {ri('rg', 'RG')}
              {ri('rgIssuer', 'Órgão Emissor')}
              {ri('cpf', 'CPF', 'text', '000.000.000-00')}
              {ri('maritalStatus', 'Estado Civil')}
              {ri('motherName', 'Nome da Mãe')}
              {ri('fatherName', 'Nome do Pai')}
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
              {ri('address.street', 'Logradouro')}
              {ri('address.number', 'Número')}
              {ri('address.neighborhood', 'Bairro')}
              {ri('address.city', 'Cidade')}
              {ri('address.state', 'Estado (UF)')}
              {ri('phone', 'Telefone Celular', 'text', '(00) 00000-0000')}
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {ri('previousGraduation', 'Graduação Anterior')}
              {ri('dueDay', 'Dia de Vencimento', 'number')}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {rt('contract', 'Contrato', 4)}
              {rt('observations', 'Observações', 4)}
            </div>
            {!initialData?.id && (
              <>
                <h4 className="text-sm font-semibold text-foreground border-b pb-2 mt-4">
                  Plano Financeiro (Geração Automática)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ri('planInstallments', 'Qtd. Parcelas', 'number')}
                  {ri('planValue', 'Valor Mensalidade (R$)', 'number')}
                  {ri('planFirstDueDate', '1º Vencimento', 'date')}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="docs" className="space-y-4 mt-4">
            <StudentDocumentManager
              studentId={initialData?.id}
              documents={documents}
              onDocumentsChange={setDocuments}
              onPendingFilesChange={setPendingFiles}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData?.id ? 'Atualizar Aluno' : 'Efetivar Matrícula'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
