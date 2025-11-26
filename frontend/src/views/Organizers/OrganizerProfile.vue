<template>
    <div class="relative">
      <button
        type="button"
        class="flex items-center space-x-3"
        @click="toggleProfile"
      >
        <img
          src="/placeholder.svg?height=40&width=40"
          alt="User avatar"
          class="w-8 h-8 rounded-full"
        />
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
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-vue-next'
  
  const router = useRouter()
  const showProfile = ref(false)
  
  const profileMenu = [
    { name: 'Profile', to: '/organizerview/profile', icon: User },
    { name: 'Settings', to: '/organizerView/settings', icon: Settings },
    { name: 'Help', to: '/organizerView/support', icon: HelpCircle }
  ]
  
  const toggleProfile = () => {
    showProfile.value = !showProfile.value
  }
  
  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token')
   localStorage.removeItem('user')
    router.push('/')
  }
  </script>
  
  
