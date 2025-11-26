<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUnreadMessages } from '@/composables/useUnreadMessages'

// Shared unread messages reactive ref (composable)
const { unreadMessages } = useUnreadMessages()

// Mobile menu toggle state
const mobileOpen = ref(false)

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
    <nav class="container mx-auto px-4 flex h-16 items-center justify-between">
      <!-- Logo -->
      <div>
        <RouterLink to="/" class="px-2 py-2 text-sm sm:text-xl font-medium text-gray-600">
          EthioEvents
        </RouterLink>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="lg:hidden">
        <button
          @click="toggleMobile"
          class="text-gray-600 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden lg:flex items-center space-x-6">
        <ul class="flex items-center space-x-6">
          <li>
            <RouterLink
              to="/"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Home
            </RouterLink>
          </li>

          <li class="relative">
            <RouterLink
              to="/publicEvents"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors inline-flex items-center"
            >
              Events
              <!-- unread badge (only shown if >0) -->
              <span
                v-if="unreadMessages && unreadMessages > 0"
                class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full"
                aria-live="polite"
              >
                {{ unreadMessages }}
              </span>
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/about"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              About Us
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/contact"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Contact Us
            </RouterLink>
          </li>
        </ul>

        <!-- Auth links on the right -->
        <div class="flex items-center space-x-4">
          <RouterLink
            to="/login"
            class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Login
          </RouterLink>

          <RouterLink
            to="/signup"
            class="px-3 py-2 text-sm sm:text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            Signup
          </RouterLink>
        </div>
      </div>

      <!-- Mobile Menu Panel -->
      <div v-if="mobileOpen" class="lg:hidden absolute top-16 left-0 w-full bg-white border-b shadow-md">
        <ul class="space-y-2 py-4 text-center">
          <li>
            <RouterLink @click="mobileOpen = false" to="/" class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink @click="mobileOpen = false" to="/publicEvents" class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              Events
              <span v-if="unreadMessages && unreadMessages > 0" class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                {{ unreadMessages }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink @click="mobileOpen = false" to="/about" class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              About Us
            </RouterLink>
          </li>
          <li>
            <RouterLink @click="mobileOpen = false" to="/contact" class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              Contact Us
            </RouterLink>
          </li>
          <li>
            <RouterLink @click="mobileOpen = false" to="/login" class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              Login
            </RouterLink>
          </li>
          <li>
            <RouterLink @click="mobileOpen = false" to="/signup" class="block px-4 py-2 text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors">
              Signup
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* small styling helper if needed */
</style>
