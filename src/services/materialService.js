import { supabase } from '@/lib/supabase'

/* =========================================================
   NORMALIZAR DATOS
========================================================= */

const normalizeMaterial = material => {
    if (!material) {
        return null
    }

    return {
        id: material.id,

        lessonId:
            material.lesson_id,

        type:
            material.type,

        voice:
            material.voice || 'general',

        title:
            material.title,

        description:
            material.description || '',

        url:
            material.url || '',

        storagePath:
            material.storage_path || '',

        fileName:
            material.file_name || '',

        fileSize:
            material.file_size || 0,

        mimeType:
            material.mime_type || '',

        createdAt:
            material.created_at,

        updatedAt:
            material.updated_at
    }
}

/* =========================================================
   TRAER TODOS LOS RECURSOS
========================================================= */

export const fetchMaterials = async () => {
    const {
        data,
        error
    } = await supabase
        .from('materials')
        .select('*')
        .order('lesson_id', {
            ascending: true
        })
        .order('id', {
            ascending: true
        })

    if (error) {
        console.error(
            'Error obteniendo materiales:',
            error
        )

        throw error
    }

    return (
        data || []
    ).map(
        normalizeMaterial
    )
}

/* =========================================================
   TRAER RECURSOS DE UNA CLASE
========================================================= */

export const fetchMaterialsByLesson =
    async lessonId => {
        const {
            data,
            error
        } = await supabase
            .from('materials')
            .select('*')
            .eq(
                'lesson_id',
                Number(lessonId)
            )
            .order('id', {
                ascending: true
            })

        if (error) {
            console.error(
                'Error obteniendo materiales de la clase:',
                error
            )

            throw error
        }

        return (
            data || []
        ).map(
            normalizeMaterial
        )
    }

/* =========================================================
   CREAR RECURSO
========================================================= */

export const insertMaterial =
    async material => {
        const payload = {
            lesson_id:
                Number(
                    material.lessonId
                ),

            type:
                material.type ||
                'other',

            voice:
                material.voice ||
                'general',

            title:
                material.title,

            description:
                material.description ||
                '',

            url:
                material.url ||
                '',

            storage_path:
                material.storagePath ||
                '',

            file_name:
                material.fileName ||
                '',

            file_size:
                Number(
                    material.fileSize ||
                    0
                ),

            mime_type:
                material.mimeType ||
                ''
        }

        const {
            data,
            error
        } = await supabase
            .from('materials')
            .insert(payload)
            .select()
            .single()

        if (error) {
            console.error(
                'Error creando recurso:',
                error
            )

            throw error
        }

        return normalizeMaterial(
            data
        )
    }

/* =========================================================
   ACTUALIZAR RECURSO
========================================================= */

export const updateMaterial =
    async (
        materialId,
        material
    ) => {
        const payload = {
            lesson_id:
                Number(
                    material.lessonId
                ),

            type:
                material.type ||
                'other',

            voice:
                material.voice ||
                'general',

            title:
                material.title,

            description:
                material.description ||
                '',

            updated_at:
                new Date().toISOString()
        }

        const {
            data,
            error
        } = await supabase
            .from('materials')
            .update(payload)
            .eq(
                'id',
                Number(materialId)
            )
            .select()
            .single()

        if (error) {
            console.error(
                'Error actualizando recurso:',
                error
            )

            throw error
        }

        return normalizeMaterial(
            data
        )
    }

/* =========================================================
   ELIMINAR METADATA
========================================================= */

export const removeMaterialRecord =
    async materialId => {
        const {
            error
        } = await supabase
            .from('materials')
            .delete()
            .eq(
                'id',
                Number(materialId)
            )

        if (error) {
            console.error(
                'Error eliminando registro del recurso:',
                error
            )

            throw error
        }

        return true
    }

/* =========================================================
   ELIMINAR ARCHIVO + METADATA
========================================================= */

export const removeMaterial =
    async material => {
        if (!material) {
            return false
        }

        /*
         * Primero eliminamos el archivo físico
         * de Storage.
         */

        if (material.storagePath) {
            const {
                error: storageError
            } = await supabase
                .storage
                .from(
                    'aula-materiales'
                )
                .remove([
                    material.storagePath
                ])

            if (storageError) {
                console.error(
                    'Error eliminando archivo de Storage:',
                    storageError
                )

                throw storageError
            }
        }

        /*
         * Luego eliminamos la fila
         * de la tabla materials.
         */

        await removeMaterialRecord(
            material.id
        )

        return true
    }