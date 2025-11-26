<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  HelpCircle,
  LogOut,
} from 'lucide-vue-next'

defineEmits(['toggle-sidebar'])
const router = useRouter()
const showNotifications = ref(false)
const showProfile = ref(false)

// const notifications = [
//   {
//     id: 1,
//     message: 'New ticket purchased for Tech Conference 2024',
//     time: '2 minutes ago',
//   },
//   {
//     id: 2,
//     message: 'Event "Digital Marketing Summit" is starting soon',
//     time: '1 hour ago',
//   },
//   {
//     id: 3,
//     message: 'New review received for AI Workshop',
//     time: '3 hours ago',
//   },
// ]

const profileMenu = [
  { name: 'Profile', to: '/organizerview/profile', icon: User },
  // { name: 'Settings', to: '/organizerview/settings', icon: Settings },
  { name: 'Help', to: '/organizerview/support', icon: HelpCircle },
]

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showProfile.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  showNotifications.value = false
}

// Add logout logic here

const handleLogout = () => {
   localStorage.removeItem('token')
    localStorage.removeItem('user')
  router.push('/')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showProfile.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left section -->
      <div class="flex items-center lg:hidden">
        <button
          type="button"
          class="text-gray-600 hover:text-gray-900"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="w-6 h-6" />
        </button>
      </div>

      <!-- Search -->
      <div class="flex-1 max-w-xl ml-6">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          />
          <input
            type="search"
            placeholder="Search events, tickets, or analytics..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center space-x-4">
        
        <div class="relative">
          <RouterLink
          to="/organizerview/notification"
            class="mt-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            @click="toggleNotifications"
          >
            <Bell class="w-6 h-6" />
            <!-- <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> -->
          </RouterLink>

          <!-- Notifications dropdown -->
          <!-- <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="p-4 border-b border-gray-200 hover:bg-gray-50"
              >
                <p class="text-sm text-gray-900">{{ notification.message }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
              </div>
            </div>
          </div> -->
        </div>

        <!-- Profile dropdown -->
        <div class="relative">
          <button type="button" class="flex items-center space-x-3" @click="toggleProfile">
            <img src="#" alt="User avatar" class="w-8 h-8 rounded-full" />
            <ChevronDown class="w-4 h-4 text-gray-600" />
          </button>

          <!-- Profile dropdown menu -->
          <div
            v-if="showProfile"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <div class="py-1">
              <router-link
                v-for="item in profileMenu"
                :key="item.name"
                :to="item.to"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <component :is="item.icon" class="w-4 h-4 mr-3" />
                {{ item.name }}
              </router-link>
              <button
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                @click="handleLogout"
              >
                <LogOut class="w-4 h-4 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
