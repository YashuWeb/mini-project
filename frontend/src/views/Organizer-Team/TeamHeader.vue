<template>

<header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-5 py-3 flex justify-between items-center">
      <div class="flex items-center">
        <svg
          class="h-6 w-6 text-blue-600 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h1 class="text-xl font-semibold text-gray-800">Tasks</h1>
      </div>
      <div class="flex items-center">
        <div class="mr-4 text-right">
          <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="text-xs text-gray-500">{{ user.email }}</div>
        </div>
        
        <button
          @click="signout"
          class="ml-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <LogOut class="h-4 w-4 mr-1" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  </header>
  </template>

<script setup>
import { ref } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')) || null);




const signout = () => {
  // Clear user data and redirect to login page
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>
