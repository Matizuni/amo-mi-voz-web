import {
  computed,
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
========================================================= */

const notifications =
  ref([])

const isLoadingNotifications =
  ref(false)

const notificationError =
  ref('')

let realtimeChannel =
  null

let realtimeAuthId =
  null

let realtimeGeneration =
  0

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
       CARGAR NOTIFICACIONES
    ===================================================== */

    const loadNotifications =
      async () => {

        if (
          !currentUser.value?.authId
        ) {
          notifications.value = []
          return []
        }

        isLoadingNotifications.value =
          true

        notificationError.value =
          ''

        try {

          const loadedNotifications =
            await fetchMyNotifications()

          notifications.value =
            loadedNotifications

          return loadedNotifications

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
       DETENER REALTIME
    ===================================================== */

    const stopNotificationsRealtime =
      async () => {

        realtimeGeneration += 1

        const channel =
          realtimeChannel

        realtimeChannel =
          null

        realtimeAuthId =
          null

        if (!channel) {
          return
        }

        try {

          await unsubscribeFromNotifications(
            channel
          )

        } catch (error) {

          console.warn(
            'No fue posible cerrar el canal de notificaciones:',
            error
          )
        }
      }

    /* =====================================================
       INICIAR REALTIME
    ===================================================== */

    const startNotificationsRealtime =
      async () => {

        const authId =
          currentUser.value?.authId

        if (!authId) {

          await stopNotificationsRealtime()

          return
        }

        /*
         * Si ya tenemos un canal para este mismo usuario,
         * no lo destruimos ni creamos otro.
         */

        if (
          realtimeChannel &&
          realtimeAuthId === authId
        ) {
          return
        }

        /*
         * Si cambió la sesión, cerramos el canal anterior.
         */

        await stopNotificationsRealtime()

        const generation =
          realtimeGeneration

        realtimeAuthId =
          authId

        realtimeChannel =
          subscribeToMyNotifications(
            authId,

            async payload => {

              /*
               * Ignoramos callbacks pertenecientes
               * a un canal que ya fue reemplazado.
               */

              if (
                generation !==
                realtimeGeneration
              ) {
                return
              }

              console.debug(
                '[Notifications Realtime]',
                payload
              )

              /*
               * Reconsultamos el buzón.
               *
               * Esto mantiene una única fuente de verdad
               * y funciona tanto para INSERT como UPDATE.
               */

              try {

                await loadNotifications()

              } catch (error) {

                console.error(
                  'Realtime recibió un cambio, pero no fue posible actualizar el buzón:',
                  error
                )
              }
            }
          )
      }

    /* =====================================================
       IMPORTANTE

       NO usamos onBeforeUnmount aquí.

       El canal es global y compartido.

       Su ciclo de vida debe controlarlo AulaLayout:
       - iniciar cuando existe sesión
       - detener al cerrar sesión
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
