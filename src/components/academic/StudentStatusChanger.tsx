import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Student } from '@/lib/types'
import { STUDENT_STATUSES, getStatusStyle } from '@/lib/student-status'
import { updateStudentStatus } from '@/services/students'
import { logStudentStatusChange } from '@/services/student-status-changes'
import { Loader2, Save, X } from 'lucide-react'

const isAdminRole = (role: string | null | undefined) => !!role && role.toLowerCase() === 'admin'

export function StudentStatusChanger({
  student,
  onSuccess,
}: {
  student: Student
  onSuccess: () => void
}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(student.status || 'Ativo')
  const [selectedStatus, setSelectedStatus] = useState(student.status || 'Ativo')
  const [reason, setReason] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (!user) {
      setCanEdit(false)
      return
    }
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.role && isAdminRole(data.role)) {
          setCanEdit(true)
        }
      })
      .catch(() => {})
  }, [user])

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value)
    setValidationError('')
  }

  const isReasonRequired = selectedStatus.toLowerCase().includes('cancelado')
  const showReasonField = canEdit && selectedStatus !== currentStatus

  const handleReset = () => {
    setSelectedStatus(currentStatus)
    setReason('')
    setValidationError('')
  }

  const handleSave = async () => {
    if (selectedStatus === currentStatus) return

    if (isReasonRequired && !reason.trim()) {
      setValidationError('Motivo é obrigatório para cancelamento')
      return
    }

    setLoading(true)
    const previousStatus = currentStatus
    try {
      await updateStudentStatus(student.id, selectedStatus)

      try {
        await logStudentStatusChange(
          student.id,
          previousStatus,
          selectedStatus,
          reason.trim() || null,
          user!.id,
        )
      } catch {
        await updateStudentStatus(student.id, previousStatus)
        throw new Error('Falha ao registrar o motivo da alteração.')
      }

      setCurrentStatus(selectedStatus)
      setReason('')
      setValidationError('')
      toast({
        title: 'Sucesso',
        description: 'Status do aluno atualizado com sucesso.',
      })
      onSuccess()
    } catch (err) {
      toast({
        title: 'Erro',
        description:
          err instanceof Error ? err.message : 'Erro ao atualizar status. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(currentStatus)}`}
          >
            {currentStatus}
          </span>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Alterar para:
            </span>
            <Select onValueChange={handleStatusSelect} value={selectedStatus} disabled={loading}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {STUDENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      {showReasonField && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <label className="text-sm font-medium text-muted-foreground">
            Motivo {isReasonRequired && <span className="text-red-500">*</span>}
          </label>
          <Textarea
            placeholder="Digite o motivo da alteração de status..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setValidationError('')
            }}
            disabled={loading}
            className="min-h-[80px]"
          />
          {validationError && (
            <span className="text-xs text-red-500 font-medium">{validationError}</span>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={loading}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
