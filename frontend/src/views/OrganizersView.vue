<template>
  <div class="min-h-screen bg-gray-50">
    <OrganizerSidebar :is-open="isSidebarOpen" @toggle="toggleSidebar" />

    <div class="lg:pl-64">
      <OrganizerHeader @toggle-sidebar="toggleSidebar" />

      <main class="p-6">
        <!-- Router view for nested routes -->
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrganizerSidebar from '@/views/Organizers/OrganizerSidebar.vue'
import OrganizerHeader from '@/views/Organizers/OrganizerHeader.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
