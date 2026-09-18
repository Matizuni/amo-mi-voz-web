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
========================================================= */

export const subscribeToMyNotifications =
  (
    authUserId,
    callback,
    statusCallback = null
  ) => {

    if (!authUserId) {
      return null
    }

    const channelName =
      `notifications:${authUserId}:${Date.now()}`

    const channel =
      supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter:
              `user_id=eq.${authUserId}`
          },

          payload => {

            console.debug(
              '[Notifications] Cambio recibido:',
              payload
            )

            if (
              typeof callback ===
              'function'
            ) {
              callback(payload)
            }
          }
        )
        .subscribe(
          (
            status,
            error
          ) => {

            console.debug(
              '[Notifications] Estado Realtime:',
              status
            )

            if (error) {
              console.error(
                '[Notifications] Error Realtime:',
                error
              )
            }

            if (
              status ===
              'SUBSCRIBED'
            ) {
              console.debug(
                '[Notifications] Canal conectado:',
                authUserId
              )
            }

            if (
              status ===
              'CHANNEL_ERROR'
            ) {
              console.error(
                '[Notifications] El canal sufrió un error.'
              )
            }

            if (
              status ===
              'TIMED_OUT'
            ) {
              console.warn(
                '[Notifications] La conexión agotó el tiempo de espera.'
              )
            }

            if (
              status ===
              'CLOSED'
            ) {
              console.warn(
                '[Notifications] El canal fue cerrado.'
              )
            }

            if (
              typeof statusCallback ===
              'function'
            ) {
              statusCallback(
                status,
                error
              )
            }
          }
        )

    return channel
  }

/* =========================================================
   DETENER REALTIME
========================================================= */

export const unsubscribeFromNotifications =
  async channel => {

    if (!channel) {
      return
    }

    try {

      await supabase.removeChannel(
        channel
      )

    } catch (error) {

      console.warn(
        '[Notifications] No fue posible eliminar el canal:',
        error
      )
    }
  }

export {
  normalizeNotification
}
