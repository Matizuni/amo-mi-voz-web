import {
  computed,
  onBeforeUnmount,
  ref
} from 'vue'

import {
  useAuth
} from '@/composables/useAuth'

import {
  fetchMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  subscribeToMyNotifications,
  unsubscribeFromNotifications
} from '@/services/notificationService'

/* =========================================================
   ESTADO GLOBAL

   Está fuera de useNotifications para que todas las vistas
   compartan el mismo estado.
========================================================= */

const notifications =
  ref([])

const isLoadingNotifications =
  ref(false)

const notificationError =
  ref('')

let realtimeChannel =
  null

/* =========================================================
   COMPOSABLE
========================================================= */

export const useNotifications =
  () => {

    const {
      currentUser
    } = useAuth()

    /* =====================================================
       CONTADOR
    ===================================================== */

    const unreadCount =
      computed(() =>
        notifications.value.filter(
          notification =>
            !notification.isRead
        ).length
      )

    /* =====================================================
       CARGAR
    ===================================================== */

    const loadNotifications =
      async () => {

        if (
          !currentUser.value?.authId
        ) {
          notifications.value = []

          return
        }

        isLoadingNotifications.value =
          true

        notificationError.value =
          ''

        try {

          notifications.value =
            await fetchMyNotifications()

        } catch (error) {

          console.error(
            'Error cargando notificaciones:',
            error
          )

          notificationError.value =
            error?.message ||
            'No se pudieron cargar las notificaciones.'

          throw error

        } finally {

          isLoadingNotifications.value =
            false

        }
      }

    /* =====================================================
       MARCAR UNA COMO LEÍDA
    ===================================================== */

    const readNotification =
      async notificationId => {

        const updated =
          await markNotificationAsRead(
            notificationId
          )

        notifications.value =
          notifications.value.map(
            notification =>
              notification.id ===
                updated.id
                ? updated
                : notification
          )

        return updated
      }

    /* =====================================================
       MARCAR TODAS COMO LEÍDAS
    ===================================================== */

    const readAllNotifications =
      async () => {

        await markAllNotificationsAsRead()

        const now =
          new Date().toISOString()

        notifications.value =
          notifications.value.map(
            notification => ({
              ...notification,

              isRead:
                true,

              readAt:
                notification.readAt ||
                now
            })
          )
      }

    /* =====================================================
       INICIAR REALTIME
    ===================================================== */

    const startNotificationsRealtime =
      async () => {

        await stopNotificationsRealtime()

        /*
         * MUY IMPORTANTE:
         *
         * currentUser.id puede ser el ID numérico
         * de students cuando es alumno.
         *
         * currentUser.authId siempre representa
         * el UUID de Supabase Auth.
         */

        const authId =
          currentUser.value?.authId

        if (!authId) {
          return
        }

        realtimeChannel =
          subscribeToMyNotifications(
            authId,
            async () => {

              /*
               * Cuando Supabase informa INSERT/UPDATE,
               * recargamos el buzón.
               *
               * Más adelante podemos optimizar esto
               * actualizando solamente el elemento afectado.
               */

              await loadNotifications()
            }
          )
      }

    /* =====================================================
       DETENER REALTIME
    ===================================================== */

    const stopNotificationsRealtime =
      async () => {

        if (!realtimeChannel) {
          return
        }

        const channel =
          realtimeChannel

        realtimeChannel =
          null

        await unsubscribeFromNotifications(
          channel
        )
      }

    /* =====================================================
       LIMPIEZA
    ===================================================== */

    onBeforeUnmount(
      stopNotificationsRealtime
    )

    /* =====================================================
       API
    ===================================================== */

    return {

      notifications,

      unreadCount,

      isLoadingNotifications,

      notificationError,

      loadNotifications,

      readNotification,

      readAllNotifications,

      startNotificationsRealtime,

      stopNotificationsRealtime

    }
  }
