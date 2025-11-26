<script setup>
import UserHeader from './UserHeader.vue'
import UserFooter from '@/components/UserFooter.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Use UserHeader Component -->
    <UserHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Render child routes here -->
      <router-view />
    </main>
    <!-- Use UserFooter Component -->
    <UserFooter />
  </div>
</template>