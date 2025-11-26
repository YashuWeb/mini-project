<template>
    <div class="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
      <form @submit.prevent="changePassword">
        <div class="mb-4">
          <label for="current-password" class="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            id="current-password"
            v-model="form.currentPassword"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="new-password"
            v-model="form.newPassword"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="form.confirmPassword"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Change Password
          </button>
        </div>
      </form>
      <div v-if="errorMessage" class="mt-4 text-red-600 text-sm">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mt-4 text-green-600 text-sm">
        {{ successMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const errorMessage = ref('');
  const successMessage = ref('');
  
  const changePassword = async () => {
    if (form.value.newPassword !== form.value.confirmPassword) {
      errorMessage.value = 'New password and confirm password do not match.';
      successMessage.value = '';
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/organizer/change-password', form.value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        successMessage.value = 'Password changed successfully.';
        errorMessage.value = '';
        form.value.currentPassword = '';
        form.value.newPassword = '';
        form.value.confirmPassword = '';
      } else {
        errorMessage.value = response.data.message || 'Failed to change password.';
        successMessage.value = '';
      }
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'An error occurred. Please try again.';
      successMessage.value = '';
    }
  };
  </script>
  
  <style scoped>
  .bg-white {
    background-color: #ffffff;
  }
  .text-gray-800 {
    color: #2d3748;
  }
  .text-gray-700 {
    color: #4a5568;
  }
  .text-blue-600 {
    color: #2563eb;
  }
  .text-blue-700 {
    color: #1d4ed8;
  }
  .text-red-600 {
    color: #e53e3e;
  }
  .text-green-600 {
    color: #10b981;
  }
  .hover\:text-blue-700:hover {
    color: #1d4ed8;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  .p-6 {
    padding: 1.5rem;
  }
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .mt-1 {
    margin-top: 0.25rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .block {
    display: block;
  }
  .w-full {
    width: 100%;
  }
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .border {
    border-width: 1px;
  }
  .border-gray-300 {
    border-color: #d1d5db;
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .focus\:outline-none:focus {
    outline: none;
  }
  .focus\:ring-blue-500:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
  .focus\:border-blue-500:focus {
    border-color: #3b82f6;
  }
  .sm\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .inline-flex {
    display: inline-flex;
  }
  .items-center {
    align-items: center;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .justify-end {
    justify-content: flex-end;
  }
  </style>
  