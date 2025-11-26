<script setup>
  import { ref } from 'vue'
  import { Calendar, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-vue-next'
  import axios from 'axios'
  // Form state
  const email = ref('')
  const emailError = ref('')
  const error = ref('')
  const isLoading = ref(false)
  const isSubmitted = ref(false)
  
  // Validate email
  const validateEmail = () => {
    emailError.value = ''
    
    if (!email.value) {
      emailError.value = 'Email is required'
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      emailError.value = 'Please enter a valid email address'
      return false
    }
    
    return true
  }
  
  // Handle form submission
  const handleForgotPassword = async () => {
    // Reset errors
    error.value = ''
    
    // Validate form
    if (!validateEmail()) {
      return
    }
    
    // Show loading state
    isLoading.value = true
    
    try {
      // In a real app, you would call your API here
      // Example: await authService.requestPasswordReset(email.value)
      const response = await axios.post('http://localhost:8000/api/send/email', {
        email: email.value
      })
console.log("send email", response)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      isSubmitted.value = true
    } catch (err) {
      // Handle error
      if (err.response && err.response.status === 422) {
        error.value = 'Invalid email address. Please check and try again.'
      } else {
        error.value = err.message || 'Something went wrong. Please try again.'
      }
    } finally {
      // Hide loading state
      isLoading.value = false
    }
  }
  </script>

<template>
    
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo -->
        <div class="flex justify-center">
          <div class="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
            <Calendar class="h-6 w-6 text-white" />
          </div>
        </div>
        
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <!-- Success Message -->
          <div 
            v-if="isSubmitted" 
            class="rounded-md bg-green-50 p-4 mb-6"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <CheckCircle class="h-5 w-5 text-green-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Reset link sent
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>
                    We've sent a password reset link to {{ email }}. Please check your email and follow the instructions to reset your password.
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Error Message -->
          <div 
            v-if="error" 
            class="rounded-md bg-red-50 p-4 mb-6"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <XCircle class="h-5 w-5 text-red-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Form -->
          <form 
            v-if="!isSubmitted" 
            class="space-y-6" 
            @submit.prevent="handleForgotPassword()"
          >
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  
                  :class="[
                    'block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm',
                    emailError 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  ]"
                  placeholder="example@gmail.com"
                />
              </div>
              <p v-if="emailError" class="mt-2 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>
  
            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Loader2 v-if="isLoading" class="animate-spin h-5 w-5 mr-2" />
                {{ isLoading ? 'Sending...' : 'Send reset link' }}
              </button>
            </div>
          </form>
  
          <!-- Back to login -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>
  
            <div class="mt-6 text-center">
              <router-link 
                to="/login" 
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

