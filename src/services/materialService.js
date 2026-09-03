import { supabase } from '@/lib/supabase'

const MATERIALS_TABLE = 'materials'
const MATERIALS_BUCKET = 'aula-materiales'

/* =========================================================
   HELPERS
========================================================= */

const parseId = value => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

const sanitizeFileName = value => {
  return String(value || 'archivo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const normalizeMaterial = material => {
  if (!material) {
    return null
  }

  return {
    id: Number(material.id),
    lessonId: Number(material.lesson_id),

    type: material.type || 'other',
    voice: material.voice || 'general',

    title: material.title || '',
    description: material.description || '',

    url: material.url || '',
    storagePath: material.storage_path || '',

    fileName: material.file_name || '',
    fileSize: Number(material.file_size || 0),
    mimeType: material.mime_type || '',

    createdAt: material.created_at,
    updatedAt: material.updated_at,
  }
}

const throwServiceError = (
  message,
  error,
) => {
  console.error(message, error)

  throw new Error(
    error?.message ||
    message,
  )
}

/* =========================================================
   TRAER TODOS LOS RECURSOS
========================================================= */

export async function fetchMaterials() {
  const { data, error } =
    await supabase
      .from(MATERIALS_TABLE)
      .select('*')
      .order(
        'lesson_id',
        {
          ascending: true,
        },
      )
      .order(
        'id',
        {
          ascending: true,
        },
      )

  if (error) {
    throwServiceError(
      'Error obteniendo materiales.',
      error,
    )
  }

  return (data || [])
    .map(normalizeMaterial)
}

/* =========================================================
   RECURSOS POR CLASE
========================================================= */

export async function fetchMaterialsByLesson(
  lessonId,
) {
  const parsedLessonId =
    parseId(lessonId)

  if (!parsedLessonId) {
    return []
  }

  const { data, error } =
    await supabase
      .from(MATERIALS_TABLE)
      .select('*')
      .eq(
        'lesson_id',
        parsedLessonId,
      )
      .order(
        'id',
        {
          ascending: true,
        },
      )

  if (error) {
    throwServiceError(
      'Error obteniendo materiales de la clase.',
      error,
    )
  }

  return (data || [])
    .map(normalizeMaterial)
}

/* =========================================================
   SUBIR ARCHIVO A STORAGE
========================================================= */

export async function uploadMaterialFile({
  file,
  lessonId,
  folder = 'materiales',
}) {
  if (!file) {
    throw new Error(
      'Debes seleccionar un archivo.',
    )
  }

  const parsedLessonId =
    parseId(lessonId)

  if (!parsedLessonId) {
    throw new Error(
      'La clase no es válida.',
    )
  }

  const safeName =
    sanitizeFileName(
      file.name,
    )

  const uniqueName =
    `${Date.now()}-${safeName}`

  const storagePath = [
    `clase-${parsedLessonId}`,
    folder,
    uniqueName,
  ].join('/')

  const {
    error: uploadError,
  } = await supabase
    .storage
    .from(MATERIALS_BUCKET)
    .upload(
      storagePath,
      file,
      {
        cacheControl: '3600',
        upsert: false,
        contentType:
          file.type ||
          undefined,
      },
    )

  if (uploadError) {
    throwServiceError(
      'No fue posible subir el archivo.',
      uploadError,
    )
  }

  const {
    data: publicUrlData,
  } = supabase
    .storage
    .from(MATERIALS_BUCKET)
    .getPublicUrl(
      storagePath,
    )

  return {
    storagePath,
    url:
      publicUrlData?.publicUrl ||
      '',
    fileName:
      file.name,
    fileSize:
      Number(
        file.size ||
        0,
      ),
    mimeType:
      file.type ||
      '',
  }
}

/* =========================================================
   BORRAR SOLO ARCHIVO DE STORAGE
========================================================= */

export async function removeMaterialFile(
  storagePath,
) {
  if (!storagePath) {
    return true
  }

  const { error } =
    await supabase
      .storage
      .from(MATERIALS_BUCKET)
      .remove([
        storagePath,
      ])

  if (error) {
    throwServiceError(
      'Error eliminando archivo de Storage.',
      error,
    )
  }

  return true
}

/* =========================================================
   CREAR REGISTRO
========================================================= */

export async function insertMaterial(
  material,
) {
  const lessonId =
    parseId(
      material.lessonId,
    )

  if (!lessonId) {
    throw new Error(
      'El recurso necesita una clase válida.',
    )
  }

  const title =
    String(
      material.title ||
      '',
    ).trim()

  if (!title) {
    throw new Error(
      'El recurso necesita un título.',
    )
  }

  const payload = {
    lesson_id:
      lessonId,

    type:
      material.type ||
      'other',

    voice:
      material.voice ||
      'general',

    title,

    description:
      String(
        material.description ||
        '',
      ).trim(),

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
        0,
      ),

    mime_type:
      material.mimeType ||
      '',
  }

  const {
    data,
    error,
  } = await supabase
    .from(MATERIALS_TABLE)
    .insert(payload)
    .select()
    .single()

  if (error) {
    throwServiceError(
      'Error creando recurso.',
      error,
    )
  }

  return normalizeMaterial(
    data,
  )
}

/* =========================================================
   SUBIR ARCHIVO + CREAR REGISTRO
========================================================= */

export async function createMaterialFromFile({
  file,
  lessonId,
  title,
  description = '',
  type = 'file',
  voice = 'general',
  folder = 'materiales',
}) {
  const uploaded =
    await uploadMaterialFile({
      file,
      lessonId,
      folder,
    })

  try {
    return await insertMaterial({
      lessonId,
      type,
      voice,

      title:
        title ||
        file.name,

      description,

      url:
        uploaded.url,

      storagePath:
        uploaded.storagePath,

      fileName:
        uploaded.fileName,

      fileSize:
        uploaded.fileSize,

      mimeType:
        uploaded.mimeType,
    })
  } catch (error) {
    /*
     * Si falla la creación
     * del registro en materials,
     * limpiamos el archivo
     * que ya habíamos subido.
     */
    try {
      await removeMaterialFile(
        uploaded.storagePath,
      )
    } catch (
    cleanupError
    ) {
      console.error(
        'No se pudo limpiar el archivo después del error:',
        cleanupError,
      )
    }

    throw error
  }
}

/* =========================================================
   ACTUALIZAR RECURSO
========================================================= */

export async function updateMaterial(
  materialId,
  material,
) {
  const parsedMaterialId =
    parseId(
      materialId,
    )

  if (!parsedMaterialId) {
    throw new Error(
      'El recurso no es válido.',
    )
  }

  const payload = {
    lesson_id:
      parseId(
        material.lessonId,
      ),

    type:
      material.type ||
      'other',

    voice:
      material.voice ||
      'general',

    title:
      String(
        material.title ||
        '',
      ).trim(),

    description:
      String(
        material.description ||
        '',
      ).trim(),

    updated_at:
      new Date()
        .toISOString(),
  }

  if (
    material.url !==
    undefined
  ) {
    payload.url =
      material.url || ''
  }

  if (
    material.storagePath !==
    undefined
  ) {
    payload.storage_path =
      material.storagePath || ''
  }

  if (
    material.fileName !==
    undefined
  ) {
    payload.file_name =
      material.fileName || ''
  }

  if (
    material.fileSize !==
    undefined
  ) {
    payload.file_size =
      Number(
        material.fileSize ||
        0,
      )
  }

  if (
    material.mimeType !==
    undefined
  ) {
    payload.mime_type =
      material.mimeType ||
      ''
  }

  const {
    data,
    error,
  } = await supabase
    .from(MATERIALS_TABLE)
    .update(payload)
    .eq(
      'id',
      parsedMaterialId,
    )
    .select()
    .single()

  if (error) {
    throwServiceError(
      'Error actualizando recurso.',
      error,
    )
  }

  return normalizeMaterial(
    data,
  )
}

/* =========================================================
   ELIMINAR SOLO REGISTRO
========================================================= */

export async function removeMaterialRecord(
  materialId,
) {
  const parsedMaterialId =
    parseId(
      materialId,
    )

  if (!parsedMaterialId) {
    return false
  }

  const { error } =
    await supabase
      .from(MATERIALS_TABLE)
      .delete()
      .eq(
        'id',
        parsedMaterialId,
      )

  if (error) {
    throwServiceError(
      'Error eliminando registro del recurso.',
      error,
    )
  }

  return true
}

/* =========================================================
   ELIMINAR ARCHIVO + REGISTRO
========================================================= */

export async function removeMaterial(
  material,
) {
  if (!material) {
    return false
  }

  if (
    material.storagePath
  ) {
    await removeMaterialFile(
      material.storagePath,
    )
  }

  await removeMaterialRecord(
    material.id,
  )

  return true
}

export {
  normalizeMaterial,
}
