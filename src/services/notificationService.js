import { supabase } from '@/lib/supabase'

/* =========================================================
   NORMALIZAR
========================================================= */

const normalizeNotification = notification => {
  if (!notification) {
    return null
  }

  return {
    id:
      notification.id,

    userId:
      notification.user_id,

    type:
      notification.type,

    title:
      notification.title,

    message:
      notification.message || '',

    route:
      notification.route || '',

    entityType:
      notification.entity_type || '',

    entityId:
      notification.entity_id || '',

    metadata:
      notification.metadata || {},

    isRead:
      Boolean(
        notification.is_read
      ),

    createdAt:
      notification.created_at,

    readAt:
      notification.read_at
  }
}

/* =========================================================
   OBTENER MIS NOTIFICACIONES

   RLS se encarga de que el usuario solamente pueda
   consultar las notificaciones cuyo user_id = auth.uid().
========================================================= */

export const fetchMyNotifications =
  async (limit = 30) => {

    const {
      data,
      error
    } = await supabase
      .from('notifications')
      .select('*')
      .order(
        'created_at',
        {
          ascending: false
        }
      )
      .limit(limit)

    if (error) {
      console.error(
        'Error obteniendo notificaciones:',
        error
      )

      throw error
    }

    return (
      data || []
    ).map(
      normalizeNotification
    )
  }

/* =========================================================
   CONTAR NO LEÍDAS
========================================================= */

export const fetchMyUnreadNotificationCount =
  async () => {

    const {
      count,
      error
    } = await supabase
      .from('notifications')
      .select(
        'id',
        {
          count: 'exact',
          head: true
        }
      )
      .eq(
        'is_read',
        false
      )

    if (error) {
      console.error(
        'Error contando notificaciones:',
        error
      )

      throw error
    }

    return count || 0
  }

/* =========================================================
   MARCAR UNA COMO LEÍDA
========================================================= */

export const markNotificationAsRead =
  async notificationId => {

    const now =
      new Date().toISOString()

    const {
      data,
      error
    } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: now
      })
      .eq(
        'id',
        Number(notificationId)
      )
      .select()
      .single()

    if (error) {
      console.error(
        'Error marcando notificación:',
        error
      )

      throw error
    }

    return normalizeNotification(
      data
    )
  }

/* =========================================================
   MARCAR TODAS COMO LEÍDAS
========================================================= */

export const markAllNotificationsAsRead =
  async () => {

    const now =
      new Date().toISOString()

    const {
      data,
      error
    } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: now
      })
      .eq(
        'is_read',
        false
      )
      .select()

    if (error) {
      console.error(
        'Error marcando notificaciones:',
        error
      )

      throw error
    }

    return (
      data || []
    ).map(
      normalizeNotification
    )
  }

/* =========================================================
   REALTIME

   IMPORTANTE:
   usamos authUserId, no studentId.

   En tu arquitectura:
   currentUser.authId = UUID real de Supabase Auth.
========================================================= */

export const subscribeToMyNotifications =
  (
    authUserId,
    callback
  ) => {

    if (!authUserId) {
      return null
    }

    return supabase
      .channel(
        `notifications:${authUserId}`
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter:
            `user_id=eq.${authUserId}`
        },
        callback
      )
      .subscribe()
  }

/* =========================================================
   DETENER REALTIME
========================================================= */

export const unsubscribeFromNotifications =
  async channel => {

    if (!channel) {
      return
    }

    await supabase.removeChannel(
      channel
    )
  }
