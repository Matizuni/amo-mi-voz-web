import { supabase } from '@/lib/supabase'

/* =========================================================
   OBTENER TODAS LAS CLASES
========================================================= */

export const fetchLessons = async () => {
    const {
        data,
        error
    } = await supabase
        .from('lessons')
        .select('*')
        .order('id', {
            ascending: true
        })

    if (error) {
        console.error(
            'Error obteniendo clases:',
            error
        )

        throw error
    }

    return data || []
}

/* =========================================================
   OBTENER UNA CLASE
========================================================= */

export const fetchLessonById =
    async lessonId => {
        const {
            data,
            error
        } = await supabase
            .from('lessons')
            .select('*')
            .eq(
                'id',
                Number(lessonId)
            )
            .single()

        if (error) {
            console.error(
                'Error obteniendo la clase:',
                error
            )

            throw error
        }

        return data
    }

/* =========================================================
   CREAR CLASE
========================================================= */

export const insertLesson =
    async lesson => {
        const payload = {
            date:
                lesson.date || '',

            title:
                lesson.title,

            description:
                lesson.description || '',

            status:
                lesson.status || 'available',

            time:
                lesson.time || '',

            duration:
                lesson.duration || '3 horas',

            modality:
                lesson.modality || 'Presencial',

            location:
                lesson.location ||
                'Academia Amo Mi Voz',

            focus:
                lesson.focus || '',

            objectives:
                lesson.objectives || [],

            contents:
                lesson.contents || [],

            activities:
                lesson.activities || [],

            repertoire:
                lesson.repertoire || [],

            support_materials:
                lesson.supportMaterials ||
                lesson.support_materials ||
                '',

            notes:
                lesson.notes || ''
        }

        const {
            data,
            error
        } = await supabase
            .from('lessons')
            .insert(payload)
            .select()
            .single()

        if (error) {
            console.error(
                'Error creando la clase:',
                error
            )

            throw error
        }

        return data
    }

/* =========================================================
   ACTUALIZAR CLASE
========================================================= */

export const updateLesson =
    async (
        lessonId,
        lesson
    ) => {
        const payload = {
            date:
                lesson.date || '',

            title:
                lesson.title,

            description:
                lesson.description || '',

            status:
                lesson.status || 'available',

            time:
                lesson.time || '',

            duration:
                lesson.duration || '',

            modality:
                lesson.modality || '',

            location:
                lesson.location || '',

            focus:
                lesson.focus || '',

            objectives:
                lesson.objectives || [],

            contents:
                lesson.contents || [],

            activities:
                lesson.activities || [],

            repertoire:
                lesson.repertoire || [],

            support_materials:
                lesson.supportMaterials ||
                lesson.support_materials ||
                '',

            notes:
                lesson.notes || '',

            updated_at:
                new Date().toISOString()
        }

        const {
            data,
            error
        } = await supabase
            .from('lessons')
            .update(payload)
            .eq(
                'id',
                Number(lessonId)
            )
            .select()
            .single()

        if (error) {
            console.error(
                'Error actualizando la clase:',
                error
            )

            throw error
        }

        return data
    }

/* =========================================================
   ELIMINAR CLASE
========================================================= */

export const removeLesson =
    async lessonId => {
        const {
            error
        } = await supabase
            .from('lessons')
            .delete()
            .eq(
                'id',
                Number(lessonId)
            )

        if (error) {
            console.error(
                'Error eliminando la clase:',
                error
            )

            throw error
        }

        return true
    }

/* =========================================================
   DUPLICAR CLASE
========================================================= */

export const cloneLesson =
    async lesson => {
        return insertLesson({
            ...lesson,

            title:
                `${lesson.title} · Copia`,

            date:
                'Fecha por definir',

            status:
                'available'
        })
    }