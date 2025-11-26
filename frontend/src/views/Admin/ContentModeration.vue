<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <p class="text-gray-500 mt-1">Review and moderate platform content</p>
      </div>
    </div>
    
    <!-- Placeholder content -->
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <div class="flex flex-col items-center">
        <FileText class="h-16 w-16 text-gray-400 mb-4" />
        <p class="text-lg font-medium mb-1">Content Moderation</p>
        <p class="text-sm text-gray-500 mb-4">This feature is coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileText } from 'lucide-vue-next';
</script>

