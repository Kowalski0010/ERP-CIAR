import { supabase } from '@/lib/supabase/client'

const mapToDb = (student: any) => {
  const dbObj: any = {
    name: student.name,
    email: student.email,
    phone: student.phone,
    cpf: student.cpf,
    rg: student.rg,
    course: student.course,
    status: student.status,
    enrollment_date: student.enrollmentDate,
    avatar: student.avatar,
    registration_code: student.registrationCode,
    nationality: student.nationality,
    birth_city: student.birthCity,
    birth_date: student.birthDate,
    rg_issuer: student.rgIssuer,
    marital_status: student.maritalStatus,
    mother_name: student.motherName,
    father_name: student.fatherName,
    previous_graduation: student.previousGraduation,
  }
  if (student.id) {
    dbObj.id = student.id
  }
  if (student.address) {
    dbObj.address_street = student.address.street
    dbObj.address_number = student.address.number
    dbObj.address_neighborhood = student.address.neighborhood
    dbObj.address_city = student.address.city
    dbObj.address_state = student.address.state
    dbObj.address_zip = student.address.zipCode
  }
  return dbObj
}

const mapFromDb = (row: any) => ({
  ...row,
  enrollmentDate: row.enrollment_date,
  registrationCode: row.registration_code,
  birthCity: row.birth_city,
  birthDate: row.birth_date,
  rgIssuer: row.rg_issuer,
  maritalStatus: row.marital_status,
  motherName: row.mother_name,
  fatherName: row.father_name,
  previousGraduation: row.previous_graduation,
  address: {
    street: row.address_street,
    number: row.address_number,
    neighborhood: row.address_neighborhood,
    city: row.address_city,
    state: row.address_state,
    zipCode: row.address_zip,
  },
})

export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapFromDb)
}

export const addStudent = async (student: any) => {
  if (!student.registrationCode) {
    const year = new Date().getFullYear().toString().slice(-2)
    const randomNum = Math.floor(100 + Math.random() * 900)
    student.registrationCode = `${year}-${randomNum}`
  }
  const dbStudent = mapToDb(student)
  const { data, error } = await supabase.from('students').insert([dbStudent]).select().single()
  if (error) throw error
  return mapFromDb(data)
}

export const updateStudent = async (id: string, student: any) => {
  const dbStudent = mapToDb(student)
  const { data, error } = await supabase
    .from('students')
    .update(dbStudent)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapFromDb(data)
}

export const deleteStudent = async (id: string) => {
  const { error } = await supabase.from('students').delete().eq('id', id)
  if (error) throw error
}
