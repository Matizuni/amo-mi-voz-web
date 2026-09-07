import { supabase } from '@/lib/supabase'

/* =========================================================
   NORMALIZAR UNIDAD
========================================================= */

const normalizeUnit = unit => {
  if (!unit) {
    return null
  }

  return {
    ...unit,

    id:
      Number(
        unit.id,
      ),

    title:
      unit.title ||
      '',

    description:
      unit.description ||
      '',

    position:
      unit.position ??
      1,

    status:
      unit.status ||
      'published',

    /* =====================================================
       PORTADA
    ====================================================== */

    coverUrl:
      unit.cover_url ||
      '',

    coverPath:
      unit.cover_path ||
      '',

    createdAt:
      unit.created_at ||
      null,

    updatedAt:
      unit.updated_at ||
      null,
  }
}

/* =========================================================
   LISTAR UNIDADES
========================================================= */

export async function fetchUnits() {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        'units',
      )
      .select('*')
      .order(
        'position',
        {
          ascending:
            true,
        },
      )
      .order(
        'id',
        {
          ascending:
            true,
        },
      )

  if (error) {
    throw error
  }

  return (
    data ||
    []
  ).map(
    normalizeUnit,
  )
}

/* =========================================================
   OBTENER UNIDAD
========================================================= */

export async function fetchUnitById(
  unitId,
) {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        'units',
      )
      .select('*')
      .eq(
        'id',
        Number(
          unitId,
        ),
      )
      .single()

  if (error) {
    throw error
  }

  return normalizeUnit(
    data,
  )
}

/* =========================================================
   CREAR UNIDAD
========================================================= */

export async function insertUnit(
  unit,
) {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        'units',
      )
      .insert({
        title:
          unit.title,

        description:
          unit.description ||
          null,

        position:
          unit.position ??
          1,

        status:
          unit.status ||
          'published',
      })
      .select()
      .single()

  if (error) {
    throw error
  }

  return normalizeUnit(
    data,
  )
}

/* =========================================================
   ACTUALIZAR UNIDAD
========================================================= */

export async function updateUnit(
  unitId,
  unit,
) {
  const payload = {
    title:
      unit.title,

    description:
      unit.description ||
      null,

    position:
      unit.position ??
      1,

    status:
      unit.status ||
      'published',

    updated_at:
      new Date()
        .toISOString(),
  }

  /*
   * Solo modificamos portada si viene
   * explícitamente en el payload.
   */
  if (
    Object.prototype
      .hasOwnProperty.call(
        unit,
        'coverUrl',
      )
  ) {
    payload.cover_url =
      unit.coverUrl ||
      null
  }

  if (
    Object.prototype
      .hasOwnProperty.call(
        unit,
        'coverPath',
      )
  ) {
    payload.cover_path =
      unit.coverPath ||
      null
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        'units',
      )
      .update(
        payload,
      )
      .eq(
        'id',
        Number(
          unitId,
        ),
      )
      .select()
      .single()

  if (error) {
    throw error
  }

  return normalizeUnit(
    data,
  )
}

/* =========================================================
   ELIMINAR UNIDAD
========================================================= */

export async function removeUnit(
  unitId,
) {
  const {
    error,
  } =
    await supabase
      .from(
        'units',
      )
      .delete()
      .eq(
        'id',
        Number(
          unitId,
        ),
      )

  if (error) {
    throw error
  }

  return true
}
