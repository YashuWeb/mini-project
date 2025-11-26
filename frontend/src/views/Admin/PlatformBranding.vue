<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-500 mt-1">Manage platform settings and configurations</p>
      </div>
    </div>

    <!-- Platform Branding -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Platform Branding</h2>
      <div class="space-y-4">
        <!-- Platform Name -->
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900">Platform Name</p>
          <input
            type="text"
            placeholder="Enter platform name"
            v-model="branding.platformName"
            class="mt-1 block w-60 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="updateBranding"
          />
        </div>

        <!-- Platform Logo -->
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900">Platform Logo</p>
          <div class="flex items-center space-x-4">
            <img
              :src="branding.logoPreview || branding.logo"
              alt="Platform Logo"
              class="h-12 w-12 rounded-full object-cover border border-gray-300"
            />
            <input
              type="file"
              @change="uploadLogo"
              class="mt-1 block w-60 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <!-- Platform Tagline -->
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900">Platform Tagline</p>
          <input
            type="text"
            v-model="branding.tagline"
            class="mt-1 block w-60 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="updateBranding"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock branding data
const branding = ref({
  platformName: 'My Platform',
  logo: 'https://via.placeholder.com/150', // Placeholder logo URL
  logoPreview: null, // For previewing the uploaded logo
  tagline: 'Your tagline here',
})

// Update branding settings
const updateBranding = () => {
  console.log('Updated branding:', branding.value)
  // Add API call here to update branding settings in the backend
}

// Upload platform logo
const uploadLogo = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      branding.value.logoPreview = e.target.result // Preview the uploaded logo
    }
    reader.readAsDataURL(file)

    console.log('Uploaded logo:', file.name)
    // Add API call here to upload the logo to the backend
  }
}
</script>
