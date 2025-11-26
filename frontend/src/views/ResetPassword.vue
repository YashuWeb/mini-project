<script setup>
import { Calendar, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter, useRoute,RouterLink } from 'vue-router' 
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const resetData = ref({
  password: '',
  confirmPassword: '',

})
const isLoading = ref(false)
const isSuccess = ref(false)
const errors= ref({
  passwordError: '',
  confirmPasswordError: '',
  serverError: '',
})
// Password strength regex
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


const validateForm = () => {
  //Reset errors
  errors.value.passwordError = ''
  errors.value.confirmPasswordError = ''
  errors.value.serverError = '' 

  if(!resetData.value.password.trim()){
    errors.value.passwordError = 'Password is required'
    return false;
  }
  else if (!passwordRegex.test(resetData.value.password) || resetData.value.password.length < 8) {
    errors.value.passwordError =
      'Password must be at least 8 characters, include an uppercase letter, a number, and a special character'
      return false;

}
 if(resetData.value.confirmPassword.trim() !== resetData.value.password.trim())
 {
  errors.value.confirmPasswordError = 'Password not match'
  return;

}
return true;
}

const resetPassword = async () =>{
  if(!validateForm()){
    return
  }

  const data = {
    email: route.query.email,
    password: resetData.value.password,
    password_confirmation: resetData.value.confirmPassword,
    token : route.query.token,
  }

// Show loading state
isLoading.value = true

try {
  const response  = await axios.post('http://localhost:8000/api/password/reset', data)
  console.log('Password reset success', response.data)

 // Show success message
 isSuccess.value = true
} catch (error) {
  console.log('Password reset error', error)

  // Show backend error message
  if (error.response?.data?.error) {
      errors.value.serverError = error.response.data.error
    } else {
      errors.value.serverError = 'Something went wrong. Please try again.'
    }
}
finally {
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
          Set new password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Create a new password for your account
        </p>
      </div>
    <!-- Success Message -->
    <div 
          v-if="isSuccess" 
          class="rounded-md bg-green-50 p-4 mb-6"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircle class="h-5 w-5 text-green-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Password reset successful
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <p class="mt-4">
                  <router-link 
                    to="/login" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Go to login
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <!-- Form -->
          <form class="space-y-6" @submit.prevent=resetPassword()>
            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                New password
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                v-model="resetData.password"
                  id="password"
                  type="password"
                  autocomplete="new-password"
                  
                  class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />

                <!-- <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                 
                </div> -->
              </div>
            </div>
            <p v-if="errors.passwordError" class="text-red-500">{{errors.passwordError}}</p>
  
            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="resetData.confirmPassword"
                  id="confirmPassword"
                  type="password"
                  autocomplete="new-password"
              
                  class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  
                </div>
              </div>
            </div>
            <p v-if="errors.confirmPasswordError" class="text-red-500">{{errors.confirmPasswordError}}</p>
            <!-- Submit Button -->
            <div>
              <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Loader2 v-if="isLoading" class="animate-spin h-5 w-5 mr-2" />
              {{ isLoading ? 'Resetting password...' : 'Reset password' }}
            </button>
            </div>
          </form>
          <p v-if="errors.serverError" class="text-red-500 text-center mt-4">{{ errors.serverError }}</p>

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
              <RouterLink
                to="/login" 
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to login
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </template>
  
 