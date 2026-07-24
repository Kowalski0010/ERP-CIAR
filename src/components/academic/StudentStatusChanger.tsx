import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmActionDialog } from '@/components/ConfirmActionDialog'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Student } from '@/lib/types'
import { STUDENT_STATUSES, getStatusStyle } from '@/lib/student-status'
import { updateStudentStatus } from '@/services/students'

const ALLOWED_ROLES = ['Admin', 'Gestao', 'Secretaria']

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
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!user)
      return supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.role && ALLOWED_ROLES.includes(data.role)) {
            setCanEdit(true)
          }
        })
        .catch(() => {})
  }, [user])

  const handleStatusSelect = (value: string) => {
    if (value === currentStatus) return
    setPendingStatus(value)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingStatus) return
    setLoading(true)
    try {
      await updateStudentStatus(student.id, pendingStatus)
      setCurrentStatus(pendingStatus)
      toast({
        title: 'Sucesso',
        description: 'Status do aluno atualizado com sucesso.',
      })
      onSuccess()
    } catch {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setPendingStatus(null)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-lg border bg-muted/30">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(currentStatus)}`}
        >
          {currentStatus}
        </span>
      </div>
      {canEdit && (
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm font-medium text-muted-foreground">Alterar para:</span>
          <Select onValueChange={handleStatusSelect} value={currentStatus} disabled={loading}>
            <SelectTrigger className="w-48">
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
      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirmar alteração de status"
        description={`Tem certeza que deseja alterar o status do aluno para ${pendingStatus}?`}
        onConfirm={handleConfirm}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </div>
  )
}
