import { supabase } from '@/lib/supabase'

const BUCKET =
  'aula-materiales'

const MAX_FILE_SIZE =
  50 * 1024 * 1024

const sanitizeFileName =
  value =>
    String(value || 'archivo')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') ||
    'archivo'

export async function uploadQuizMediaFile({
  file,
  lessonId,
  questionKey,
  kind = 'audio',
}) {
  if (!(file instanceof Blob)) {
    throw new Error(
      'No se recibió un archivo válido.',
    )
  }

  if (
    Number(file.size) >
    MAX_FILE_SIZE
  ) {
    throw new Error(
      'El archivo supera el máximo permitido de 50 MB.',
    )
  }

  const parsedLessonId =
    Number(lessonId)

  if (
    !Number.isFinite(parsedLessonId) ||
    parsedLessonId <= 0
  ) {
    throw new Error(
      'La clase asociada no es válida.',
    )
  }

  const fileName =
    sanitizeFileName(
      file.name ||
      `recurso-${kind}`,
    )

  const safeQuestionKey =
    sanitizeFileName(
      questionKey ||
      'pregunta',
    )

  const path =
    `clase-${parsedLessonId}/evaluaciones/${safeQuestionKey}/${Date.now()}-${fileName}`

  const {
    error: uploadError,
  } =
    await supabase.storage
      .from(BUCKET)
      .upload(
        path,
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
    throw new Error(
      uploadError?.message ||
      'No se pudo subir el recurso multimedia.',
    )
  }

  const { data } =
    supabase.storage
      .from(BUCKET)
      .getPublicUrl(path)

  const url =
    data?.publicUrl || ''

  if (!url) {
    throw new Error(
      'Supabase no devolvió una URL pública para el archivo.',
    )
  }

  return {
    url,
    storagePath: path,
    fileName:
      file.name ||
      fileName,
    fileSize:
      Number(file.size || 0),
    mimeType:
      file.type || '',
    kind,
  }
}
