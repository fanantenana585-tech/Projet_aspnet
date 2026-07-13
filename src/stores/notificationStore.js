import { defineStore } from 'pinia'
import * as signalR from '@microsoft/signalr'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    connection: null,
    connected: false
  }),
  actions: {
    async connect() {
      if (this.connected) return
      const hubUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/hubs/notifications` : 'http://localhost:5070/hubs/notifications'
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build()

      this.connection.on('ReceiveNotification', (msg) => {
        try {
          this.notifications.unshift({ ...msg })
        } catch (e) {
          this.notifications.unshift({ title: 'Notification', body: JSON.stringify(msg) })
        }
      })

      await this.connection.start()
      this.connected = true
    },
    disconnect() {
      if (this.connection) {
        this.connection.stop()
        this.connection = null
      }
      this.connected = false
    },
    markAllRead() {
      this.notifications = []
    }
  }
})
