import { supabase } from '@/lib/supabase'

/* =========================================================
   NORMALIZACIÓN
========================================================= */

const normalizeStudent = student => {
  if (!student) {
    return null
  }

  return {
    id: Number(student.id),

    name:
      String(
        student.name || '',
      ).trim(),

    role: 'student',

    voice:
      String(
        student.voice || '',
      ).trim(),

    active:
      student.active ?? true,

    createdAt:
      student.created_at || null,

    updatedAt:
      student.updated_at || null,
  }
}

/* =========================================================
   UTILIDADES
========================================================= */

const normalizeStudentId = studentId => {
  const id =
    Number(studentId)

  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'El identificador del estudiante no es válido.',
    )
  }

  return id
}

const normalizeName = name =>
  String(name || '')
    .trim()
    .replace(/\s+/g, ' ')

const normalizeVoice = voice =>
  String(voice || '')
    .trim()

/* =========================================================
   OBTENER ESTUDIANTES ACTIVOS
========================================================= */

export const fetchStudents = async () => {
  const {
    data,
    error,
  } =
    await supabase
      .from('students')
      .select('*')
      .eq('active', true)
      .order(
        'name',
        {
          ascending: true,
        },
      )

  if (error) {
    console.error(
      'Error obteniendo estudiantes:',
      error,
    )

    throw error
  }

  return (
    data || []
  ).map(
    normalizeStudent,
  )
}

/* =========================================================
   OBTENER TODOS
========================================================= */

export const fetchAllStudents =
  async () => {
    const {
      data,
      error,
    } =
      await supabase
        .from('students')
        .select('*')
        .order(
          'name',
          {
            ascending: true,
          },
        )

    if (error) {
      console.error(
        'Error obteniendo todos los estudiantes:',
        error,
      )

      throw error
    }

    return (
      data || []
    ).map(
      normalizeStudent,
    )
  }

/* =========================================================
   OBTENER ESTUDIANTE
========================================================= */

export const fetchStudentById =
  async studentId => {
    const id =
      normalizeStudentId(
        studentId,
      )

    const {
      data,
      error,
    } =
      await supabase
        .from('students')
        .select('*')
        .eq(
          'id',
          id,
        )
        .maybeSingle()

    if (error) {
      console.error(
        'Error obteniendo estudiante:',
        error,
      )

      throw error
    }

    return normalizeStudent(
      data,
    )
  }

/* =========================================================
   CREAR ESTUDIANTE

   Se conserva para compatibilidad interna.

   Para matrículas reales recomendamos utilizar el flujo:
   inscripción -> aprobación -> matrícula -> invitación.
========================================================= */

export const insertStudent =
  async student => {
    const name =
      normalizeName(
        student?.name,
      )

    const voice =
      normalizeVoice(
        student?.voice,
      )

    if (!name) {
      throw new Error(
        'Debes ingresar el nombre del estudiante.',
      )
    }

    if (!voice) {
      throw new Error(
        'Debes seleccionar una clasificación vocal.',
      )
    }

    const {
      data,
      error,
    } =
      await supabase
        .from('students')
        .insert({
          name,
          voice,
          active: true,
        })
        .select()
        .single()

    if (error) {
      console.error(
        'Error creando estudiante:',
        error,
      )

      throw error
    }

    return normalizeStudent(
      data,
    )
  }

/* =========================================================
   ACTUALIZAR ESTUDIANTE
========================================================= */

export const updateStudent =
  async (
    studentId,
    student,
  ) => {
    const id =
      normalizeStudentId(
        studentId,
      )

    const name =
      normalizeName(
        student?.name,
      )

    const voice =
      normalizeVoice(
        student?.voice,
      )

    if (!name) {
      throw new Error(
        'El nombre del estudiante no puede estar vacío.',
      )
    }

    if (!voice) {
      throw new Error(
        'La clasificación vocal no puede estar vacía.',
      )
    }

    const payload = {
      name,
      voice,

      active:
        student?.active ??
        true,

      updated_at:
        new Date()
          .toISOString(),
    }

    const {
      data,
      error,
    } =
      await supabase
        .from('students')
        .update(payload)
        .eq(
          'id',
          id,
        )
        .select()
        .single()

    if (error) {
      console.error(
        'Error actualizando estudiante:',
        error,
      )

      throw error
    }

    return normalizeStudent(
      data,
    )
  }

/* =========================================================
   DESACTIVAR ESTUDIANTE

   IMPORTANTE:
   No elimina historial.
========================================================= */

export const deactivateStudent =
  async studentId => {
    const id =
      normalizeStudentId(
        studentId,
      )

    const {
      data,
      error,
    } =
      await supabase
        .from('students')
        .update({
          active: false,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          'id',
          id,
        )
        .select()
        .single()

    if (error) {
      console.error(
        'Error desactivando estudiante:',
        error,
      )

      throw error
    }

    /*
     * Marcamos también la cuenta asociada como inactiva.
     *
     * Esto permite que nuestro router impida el acceso.
     */

    const {
      error: profileError,
    } =
      await supabase
        .from('profiles')
        .update({
          account_status:
            'inactive',
        })
        .eq(
          'student_id',
          id,
        )
        .eq(
          'role',
          'student',
        )

    if (profileError) {
      console.error(
        'Error desactivando perfil del estudiante:',
        profileError,
      )

      /*
       * No ocultamos este problema.
       *
       * Queremos que el profesor sepa que la desactivación
       * no quedó completamente sincronizada.
       */

      throw new Error(
        'El alumno fue desactivado académicamente, pero no pudimos desactivar su cuenta de acceso.',
      )
    }

    return normalizeStudent(
      data,
    )
  }

/* =========================================================
   REACTIVAR ESTUDIANTE
========================================================= */

export const reactivateStudent =
  async studentId => {
    const id =
      normalizeStudentId(
        studentId,
      )

    const {
      data,
      error,
    } =
      await supabase
        .from('students')
        .update({
          active: true,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          'id',
          id,
        )
        .select()
        .single()

    if (error) {
      console.error(
        'Error reactivando estudiante:',
        error,
      )

      throw error
    }

    const {
      error: profileError,
    } =
      await supabase
        .from('profiles')
        .update({
          account_status:
            'active',
        })
        .eq(
          'student_id',
          id,
        )
        .eq(
          'role',
          'student',
        )

    if (profileError) {
      console.error(
        'Error reactivando perfil:',
        profileError,
      )

      throw new Error(
        'El alumno fue reactivado académicamente, pero no pudimos reactivar su cuenta.',
      )
    }

    return normalizeStudent(
      data,
    )
  }

/* =========================================================
   ELIMINAR DEFINITIVAMENTE

   La eliminación sensible ocurre en Edge Function porque
   necesitamos eliminar también Supabase Auth.

   NUNCA utilizamos service_role desde Vue.
========================================================= */

export const deleteStudentPermanently =
  async studentId => {
    const id =
      normalizeStudentId(
        studentId,
      )

    const {
      data,
      error,
    } =
      await supabase.functions
        .invoke(
          'delete-student-account',
          {
            body: {
              studentId: id,
            },
          },
        )

    if (error) {
      console.error(
        'Error eliminando estudiante:',
        error,
      )

      throw new Error(
        error?.message ||
        'No fue posible eliminar al estudiante.',
      )
    }

    if (
      !data?.success
    ) {
      throw new Error(
        data?.error ||
        'No fue posible eliminar al estudiante.',
      )
    }

    return data
  }

/* =========================================================
   COMPATIBILIDAD

   Si algún componente antiguo todavía importa removeStudent,
   seguirá funcionando como DESACTIVACIÓN.

   Más adelante podemos eliminar este alias.
========================================================= */

export const removeStudent =
  deactivateStudent
