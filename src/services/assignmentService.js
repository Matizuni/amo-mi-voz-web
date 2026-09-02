import { supabase } from '@/lib/supabase'

/* =========================================================
   NORMALIZAR
========================================================= */

const normalizeAssignment = assignment => {
    if (!assignment) {
        return null
    }

    return {
        id: assignment.id,

        lessonId:
            assignment.lesson_id,

        title:
            assignment.title,

        description:
            assignment.description || '',

        type:
            assignment.activity_type ||
            'assignment',

        acceptedFile:
            assignment.accepted_file ||
            'audio',

        acceptedFiles: [
            assignment.accepted_file ||
            'audio'
        ],

        dueDate:
            assignment.due_date || '',

        points:
            assignment.points ?? 100,

        status:
            assignment.status ||
            'published',

        createdAt:
            assignment.created_at,

        updatedAt:
            assignment.updated_at
    }
}

/* =========================================================
   TODAS
========================================================= */

export const fetchAssignments = async () => {
    const {
        data,
        error
    } = await supabase
        .from('assignments')
        .select('*')
        .order(
            'lesson_id',
            {
                ascending: true
            }
        )
        .order(
            'id',
            {
                ascending: true
            }
        )

    if (error) {
        console.error(
            'Error obteniendo tareas:',
            error
        )

        throw error
    }

    return (
        data || []
    ).map(
        normalizeAssignment
    )
}

/* =========================================================
   POR CLASE
========================================================= */

export const fetchAssignmentsByLesson =
    async lessonId => {
        const {
            data,
            error
        } = await supabase
            .from('assignments')
            .select('*')
            .eq(
                'lesson_id',
                Number(lessonId)
            )
            .order(
                'id',
                {
                    ascending: true
                }
            )

        if (error) {
            console.error(
                'Error obteniendo tareas de la clase:',
                error
            )

            throw error
        }

        return (
            data || []
        ).map(
            normalizeAssignment
        )
    }

/* =========================================================
   UNA TAREA
========================================================= */

export const fetchAssignmentById =
    async assignmentId => {
        const {
            data,
            error
        } = await supabase
            .from('assignments')
            .select('*')
            .eq(
                'id',
                Number(assignmentId)
            )
            .single()

        if (error) {
            console.error(
                'Error obteniendo tarea:',
                error
            )

            throw error
        }

        return normalizeAssignment(
            data
        )
    }

/* =========================================================
   CREAR
========================================================= */

export const insertAssignment =
    async assignment => {
        const payload = {
            lesson_id:
                Number(
                    assignment.lessonId
                ),

            title:
                assignment.title,

            description:
                assignment.description ||
                '',

            activity_type:
                assignment.type ||
                'assignment',

            accepted_file:
                assignment.acceptedFile ||
                'audio',

            due_date:
                assignment.dueDate ||
                '',

            points:
                Number(
                    assignment.points ??
                    100
                ),

            status:
                assignment.status ||
                'published'
        }

        const {
            data,
            error
        } = await supabase
            .from('assignments')
            .insert(payload)
            .select()
            .single()

        if (error) {
            console.error(
                'Error creando tarea:',
                error
            )

            throw error
        }

        return normalizeAssignment(
            data
        )
    }

/* =========================================================
   ACTUALIZAR
========================================================= */

export const updateAssignment =
    async (
        assignmentId,
        assignment
    ) => {
        const payload = {
            lesson_id:
                Number(
                    assignment.lessonId
                ),

            title:
                assignment.title,

            description:
                assignment.description ||
                '',

            activity_type:
                assignment.type ||
                'assignment',

            accepted_file:
                assignment.acceptedFile ||
                'audio',

            due_date:
                assignment.dueDate ||
                '',

            points:
                Number(
                    assignment.points ??
                    100
                ),

            status:
                assignment.status ||
                'published',

            updated_at:
                new Date().toISOString()
        }

        const {
            data,
            error
        } = await supabase
            .from('assignments')
            .update(payload)
            .eq(
                'id',
                Number(assignmentId)
            )
            .select()
            .single()

        if (error) {
            console.error(
                'Error actualizando tarea:',
                error
            )

            throw error
        }

        return normalizeAssignment(
            data
        )
    }

/* =========================================================
   ELIMINAR
========================================================= */

export const removeAssignment =
    async assignmentId => {
        const {
            error
        } = await supabase
            .from('assignments')
            .delete()
            .eq(
                'id',
                Number(assignmentId)
            )

        if (error) {
            console.error(
                'Error eliminando tarea:',
                error
            )

            throw error
        }

        return true
    }