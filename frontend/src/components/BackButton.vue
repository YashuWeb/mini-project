<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <div class="container m-auto py-4 px-4">
      <RouterLink to="/" class="text-blue-500 text-xl hover:text-blue-600 flex items-center">
        <i class="pi pi-arrow-circle-left mr-3"></i> Back to Home
      </RouterLink>
    </div>
  </section>
</template>
