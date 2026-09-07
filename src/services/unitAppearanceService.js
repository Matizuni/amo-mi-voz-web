import { supabase } from '@/lib/supabase'

const BUCKET =
  'aula-materiales'

const STORAGE_KEY =
  'amv.unit.appearance.v1'

/* =========================================================
   LOCAL STORAGE
========================================================= */

const safeRead = () => {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY,
        ) || '{}',
      ) || {}
    )
  } catch {
    return {}
  }
}

const safeWrite = data => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data),
    )
  } catch (error) {
    console.warn(
      'No fue posible guardar la apariencia local de la unidad.',
      error,
    )
  }
}

/* =========================================================
   OBTENER APARIENCIA
========================================================= */

export const getUnitAppearance =
  unitId => {
    const data =
      safeRead()

    return (
      data[
      String(unitId)
      ] || {
        coverUrl: '',
        coverPath: '',
        focalPoint:
          'center',
      }
    )
  }

/* =========================================================
   GUARDAR APARIENCIA LOCAL
========================================================= */

export const saveUnitAppearance = (
  unitId,
  patch = {},
) => {
  const data =
    safeRead()

  const key =
    String(unitId)

  data[key] = {
    ...getUnitAppearance(
      unitId,
    ),

    ...patch,

    updatedAt:
      new Date()
        .toISOString(),
  }

  safeWrite(data)

  window.dispatchEvent(
    new CustomEvent(
      'amv:unit-appearance',
      {
        detail: {
          unitId:
            Number(
              unitId,
            ),
        },
      },
    ),
  )

  return data[key]
}

/* =========================================================
   GUARDAR PORTADA EN DATABASE
========================================================= */

export async function saveUnitCoverToDatabase(
  unitId,
  {
    coverUrl = '',
    coverPath = '',
  } = {},
) {
  const {
    error,
  } =
    await supabase
      .from(
        'units',
      )
      .update({
        cover_url:
          coverUrl ||
          null,

        cover_path:
          coverPath ||
          null,
      })
      .eq(
        'id',
        Number(
          unitId,
        ),
      )

  if (error) {
    throw error
  }
}

/* =========================================================
   QUITAR PORTADA
========================================================= */

export async function clearUnitCover(
  unitId,
) {
  const previous =
    getUnitAppearance(
      unitId,
    )

  saveUnitAppearance(
    unitId,
    {
      coverUrl: '',
      coverPath: '',
    },
  )

  try {
    await saveUnitCoverToDatabase(
      unitId,
      {
        coverUrl: '',
        coverPath: '',
      },
    )
  } catch (error) {
    /*
     * Restauramos el estado local
     * si Database falla.
     */
    saveUnitAppearance(
      unitId,
      previous,
    )

    throw error
  }
}

/* =========================================================
   NOMBRE SEGURO
========================================================= */

const sanitize =
  name =>
    String(
      name ||
      'portada-unidad',
    )
      .normalize(
        'NFD',
      )
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

/* =========================================================
   SUBIR PORTADA
========================================================= */

export async function uploadUnitCover({
  unitId,
  file,
}) {
  if (!unitId) {
    throw new Error(
      'La unidad no es válida.',
    )
  }

  if (!file) {
    throw new Error(
      'Selecciona una imagen para la portada.',
    )
  }

  if (
    !String(
      file.type ||
      '',
    ).startsWith(
      'image/',
    )
  ) {
    throw new Error(
      'La portada debe ser una imagen.',
    )
  }

  if (
    file.size >
    8 * 1024 * 1024
  ) {
    throw new Error(
      'La portada no puede superar 8 MB.',
    )
  }

  const path =
    [
      `unidad-${Number(
        unitId,
      )}`,
      'portada',
      `${Date.now()}-${sanitize(
        file.name,
      )}`,
    ].join('/')

  /* =====================================================
     1. SUBIR A STORAGE
  ====================================================== */

  const {
    error:
    uploadError,
  } =
    await supabase
      .storage
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

  if (
    uploadError
  ) {
    throw uploadError
  }

  /* =====================================================
     2. OBTENER URL PÚBLICA
  ====================================================== */

  const {
    data:
    publicUrlData,
  } =
    supabase
      .storage
      .from(
        BUCKET,
      )
      .getPublicUrl(
        path,
      )

  const coverUrl =
    publicUrlData
      ?.publicUrl ||
    ''

  if (!coverUrl) {
    throw new Error(
      'No fue posible obtener la URL pública de la portada.',
    )
  }

  /* =====================================================
     3. GUARDAR EN DATABASE
  ====================================================== */

  try {
    await saveUnitCoverToDatabase(
      unitId,
      {
        coverUrl,

        coverPath:
          path,
      },
    )
  } catch (error) {
    /*
     * Si Database falla,
     * eliminamos el archivo recién subido.
     */
    try {
      await supabase
        .storage
        .from(
          BUCKET,
        )
        .remove([
          path,
        ])
    } catch {
      // Conservamos el error original.
    }

    throw error
  }

  /* =====================================================
     4. GUARDAR COPIA LOCAL
  ====================================================== */

  return saveUnitAppearance(
    unitId,
    {
      coverUrl,

      coverPath:
        path,
    },
  )
}

/* =========================================================
   MIGRAR PORTADAS ANTIGUAS
========================================================= */

export async function syncLocalUnitCoversToDatabase() {
  const stored =
    safeRead()

  const entries =
    Object.entries(
      stored,
    )

  if (
    !entries.length
  ) {
    return 0
  }

  const ids =
    entries
      .map(
        ([id]) =>
          Number(
            id,
          ),
      )
      .filter(
        Number.isFinite,
      )

  if (
    !ids.length
  ) {
    return 0
  }

  const {
    data:
    units,

    error,
  } =
    await supabase
      .from(
        'units',
      )
      .select(
        `
          id,
          cover_url,
          cover_path
        `,
      )
      .in(
        'id',
        ids,
      )

  if (error) {
    console.warn(
      'No fue posible sincronizar las portadas antiguas de las unidades.',
      error,
    )

    return 0
  }

  let migrated =
    0

  for (
    const unit
    of units || []
  ) {
    if (
      unit.cover_url
    ) {
      continue
    }

    const local =
      stored[
      String(
        unit.id,
      )
      ]

    if (
      !local?.coverUrl
    ) {
      continue
    }

    const {
      error:
      updateError,
    } =
      await supabase
        .from(
          'units',
        )
        .update({
          cover_url:
            local.coverUrl,

          cover_path:
            local.coverPath ||
            null,
        })
        .eq(
          'id',
          unit.id,
        )

    if (
      !updateError
    ) {
      migrated +=
        1
    }
  }

  return migrated
}
