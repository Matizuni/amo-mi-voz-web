import { supabase } from '@/lib/supabase'

const BUCKET =
  'aula-materiales'

const MAX_FILE_SIZE =
  50 * 1024 * 1024

const ALLOWED_KINDS =
  new Set([
    'audio',
    'image',
  ])

const sanitizeFileName =
  value =>
    String(
      value ||
      'archivo',
    )
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .replace(
        /[^a-zA-Z0-9._-]+/g,
        '-',
      )
      .replace(
        /-+/g,
        '-',
      )
      .replace(
        /^-|-$/g,
        '',
      ) ||
    'archivo'

const getSafeKind =
  kind => {
    return ALLOWED_KINDS.has(
      kind,
    )
      ? kind
      : 'audio'
  }

const validateMimeType = (
  file,
  kind,
) => {
  const mimeType =
    String(
      file?.type ||
      '',
    ).toLowerCase()

  /*
   * Algunos navegadores pueden entregar
   * un Blob sin MIME type.
   *
   * En ese caso dejamos continuar y
   * Supabase intentará almacenar el archivo.
   */
  if (!mimeType) {
    return
  }

  if (
    kind === 'audio' &&
    !mimeType.startsWith(
      'audio/',
    )
  ) {
    throw new Error(
      'Selecciona un archivo de audio válido.',
    )
  }

  if (
    kind === 'image' &&
    !mimeType.startsWith(
      'image/',
    )
  ) {
    throw new Error(
      'Selecciona una imagen válida.',
    )
  }
}

export async function uploadQuizMediaFile({
  file,
  lessonId,
  questionKey,
  kind = 'audio',
}) {
  /*
   * File hereda de Blob.
   * También aceptamos Blob porque
   * MediaRecorder genera blobs.
   */
  if (!(file instanceof Blob)) {
    throw new Error(
      'No se recibió un archivo válido.',
    )
  }

  /*
   * Máximo 50 MB.
   */
  if (
    Number(
      file.size,
    ) >
    MAX_FILE_SIZE
  ) {
    throw new Error(
      'El archivo supera el máximo permitido de 50 MB.',
    )
  }

  /*
   * Evitamos subir archivos vacíos.
   */
  if (
    !Number(
      file.size,
    )
  ) {
    throw new Error(
      'El archivo está vacío.',
    )
  }

  /*
   * Validar clase.
   */
  const parsedLessonId =
    Number(
      lessonId,
    )

  if (
    !Number.isFinite(
      parsedLessonId,
    ) ||
    parsedLessonId <= 0
  ) {
    throw new Error(
      'La clase asociada no es válida.',
    )
  }

  /*
   * Tipo permitido.
   */
  const safeKind =
    getSafeKind(
      kind,
    )

  /*
   * Validación básica MIME.
   */
  validateMimeType(
    file,
    safeKind,
  )

  /*
   * Nombre del archivo.
   *
   * File normalmente tiene .name.
   * Blob de grabación puede no tenerlo.
   */
  const originalFileName =
    file.name ||
    `recurso-${safeKind}`

  const fileName =
    sanitizeFileName(
      originalFileName,
    )

  /*
   * Identificador local de la pregunta.
   */
  const safeQuestionKey =
    sanitizeFileName(
      questionKey ||
      'pregunta',
    )

  /*
   * Organización del Storage:
   *
   * evaluaciones/
   *   clase-12/
   *     preguntas/
   *       question-xxx/
   *         timestamp-audio.webm
   */
  const path =
    [
      'evaluaciones',
      `clase-${parsedLessonId}`,
      'preguntas',
      safeQuestionKey,
      `${Date.now()}-${fileName}`,
    ].join('/')

  /*
   * Subir archivo.
   */
  const {
    data: uploadData,
    error: uploadError,
  } =
    await supabase.storage
      .from(
        BUCKET,
      )
      .upload(
        path,
        file,
        {
          cacheControl:
            '3600',

          upsert:
            false,

          contentType:
            file.type ||
            undefined,
        },
      )

  if (uploadError) {
    console.error(
      'Error subiendo multimedia del quiz:',
      uploadError,
    )

    throw new Error(
      uploadError?.message ||
      'No se pudo subir el recurso multimedia.',
    )
  }

  /*
   * La ruta que devuelve Supabase
   * normalmente coincide con path,
   * pero usamos el dato retornado
   * si está disponible.
   */
  const storedPath =
    uploadData?.path ||
    path

  /*
   * Obtener URL pública.
   *
   * Este sistema supone que
   * aula-materiales es un bucket público.
   */
  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from(
        BUCKET,
      )
      .getPublicUrl(
        storedPath,
      )

  const url =
    publicUrlData
      ?.publicUrl ||
    ''

  if (!url) {
    throw new Error(
      'Supabase no devolvió una URL pública para el archivo.',
    )
  }

  return {
    url,

    storagePath:
      storedPath,

    fileName:
      file.name ||
      fileName,

    fileSize:
      Number(
        file.size ||
        0,
      ),

    mimeType:
      file.type ||
      '',

    kind:
      safeKind,
  }
}
