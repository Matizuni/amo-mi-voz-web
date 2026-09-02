import { supabase } from '@/lib/supabase'

export async function createStudentAccount({
  name,
  email,
  voice,
  password,
}) {
  const { data, error } = await supabase.functions.invoke(
    'create-student-account',
    {
      body: {
        name,
        email,
        voice,
        password,
      },
    },
  )

  if (error) {
    throw error
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data
}
