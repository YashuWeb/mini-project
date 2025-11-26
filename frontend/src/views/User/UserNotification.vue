```vue
<script setup>
import { onMounted, ref } from 'vue'
import { AlertCircle, Check } from 'lucide-vue-next'
import axios from 'axios'

// Notification data
const notifications = ref([])

const token = localStorage.getItem('token')
const fetchingNotifications = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/notification', {
      headers: { Authorization: `Bearer ${token}` },
    })
    notifications.value = response.data
    console.log('Notifications fetched:', notifications.value)
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}
// Fetch notifications on component mount
onMounted(() => {
  fetchingNotifications()
})

// Methods
const markAsRead = async (id) => {
  try {
    await axios.post(
      'http://localhost:8000/api/user/notification/read',
      { id: id },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    console.log('Notification marked as read')
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await axios.post('http://localhost:8000/api/user/notification/read/all',{}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    notifications.value.forEach((notification) => {
      notification.read = true
    })
    console.log('All notifications marked as read')
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

// const clearAllNotifications = () => {
//   notifications.value = [] // Clears all notifications
// }




const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <div class="rounded-lg shadow-md overflow-hidden">
        <!-- Header -->
        <div class="bg-gray-100 p-6 text-white">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <h1 class="text-2xl text-black font-bold">Notifications</h1>
            </div>
            <div class="flex space-x-2">
              <!-- Mark All Read Button -->
              <button
                v-if="notifications && notifications.some((n) => !n.read_at)"
                @click="markAllAsRead"
                class="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600 inline-flex items-center text-sm"
              >
                <Check class="h-4 w-4 mr-1" />
                Mark All Read
              </button>

              <!-- Clear All Button -->
              <button
                v-if="notifications.length > 0"
                @click="clearAllNotifications"
                class="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600 inline-flex items-center text-sm"
              >
                <AlertCircle class="h-4 w-4 mr-1" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="divide-y divide-gray-200">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"
            ></div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
            <p class="text-gray-500">You don't have any notifications yet.</p>
          </div>

          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'p-4 hover:bg-gray-50 transition-colors duration-150',
              !notification.read ? 'bg-blue-50' : '',
            ]"
          >
            <div class="flex">
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3
                    :class="[
                      'text-sm font-medium',
                      !notification.read ? 'text-gray-900' : 'text-gray-600',
                    ]"
                  >
                    {{ notification.title }}
                  </h3>
                  <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {{ formatDate(notification.created_at) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ notification.data.message }}</p>
                <div class="mt-2 flex justify-between items-center">
                  <button
                    v-if="!notification.read_at"
                    @click="markAsRead(notification.id)"
                    class="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center"
                  >
                    <Check class="h-3 w-3 mr-1" />
                    Mark as read
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```
