import { supabase } from '@/lib/supabase'

const BUCKET = 'aula-materiales'
const STORAGE_KEY = 'amv.lesson.appearance.v1'

const safeRead = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {} }
  catch { return {} }
}

const safeWrite = data => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
  catch (error) { console.warn('No fue posible guardar la apariencia local de la clase.', error) }
}

export const getLessonAppearance = lessonId => {
  const data = safeRead()
  return data[String(lessonId)] || { coverUrl: '', coverPath: '', focalPoint: 'center' }
}

export const saveLessonAppearance = (lessonId, patch = {}) => {
  const data = safeRead()
  const key = String(lessonId)
  data[key] = { ...getLessonAppearance(lessonId), ...patch, updatedAt: new Date().toISOString() }
  safeWrite(data)
  window.dispatchEvent(new CustomEvent('amv:lesson-appearance', { detail: { lessonId: Number(lessonId) } }))
  return data[key]
}

export const clearLessonCover = lessonId => saveLessonAppearance(lessonId, { coverUrl: '', coverPath: '' })

const sanitize = name => String(name || 'portada').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-')

export async function uploadLessonCover({ lessonId, file }) {
  if (!file) throw new Error('Selecciona una imagen para la portada.')
  if (!String(file.type || '').startsWith('image/')) throw new Error('La portada debe ser una imagen.')
  if (file.size > 8 * 1024 * 1024) throw new Error('La portada no puede superar 8 MB.')

  const path = `clase-${Number(lessonId)}/portada/${Date.now()}-${sanitize(file.name)}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type || undefined,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const coverUrl = data?.publicUrl || ''
  if (!coverUrl) throw new Error('No fue posible obtener la URL pública de la portada.')
  return saveLessonAppearance(lessonId, { coverUrl, coverPath: path })
}
