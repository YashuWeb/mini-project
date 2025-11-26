<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">My Events</h1>

    <!-- No events -->
    <div v-if="events.length === 0" class="text-center text-gray-500">
      No events assigned yet.
    </div>

    <!-- Event cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="event in events"
        :key="event.id"
        class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
      >
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-800">{{ event.title }}</h2>
          <p class="text-sm text-gray-500 mt-1">
            <strong>Date:</strong> {{ formatDate(event.date) }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            <strong>Location:</strong> {{ event.location }}
          </p>
        </div>
        <div class="bg-gray-100 px-4 py-2 text-right">
          <button
            class="text-sm text-blue-600 hover:underline"
            @click="openModal(event)"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">{{ selectedEvent.title }}</h2>

        <p class="text-sm text-gray-500 mb-2">
          <strong>Date:</strong> {{ formatDate(selectedEvent.date) }}
        </p>
        <p class="text-sm text-gray-500 mb-2">
          <strong>Location:</strong> {{ selectedEvent.location }}
        </p>

        <p class="text-sm text-gray-500 mb-2">
          <strong>Budget:</strong> ${{ selectedEvent.budget }}
        </p>
        <p class="text-sm text-gray-500 mb-2">
          <strong>Expected Guests:</strong> {{ selectedEvent.attendees }}
        </p>

        <div class="text-sm text-gray-500 mb-2">
          <strong>Requirements:</strong>
          <ul class="list-disc list-inside mt-2">
            <li v-for="requirement in formattedRequirements" :key="requirement">
              {{ requirement }}
            </li>
          </ul>
        </div>

        <div class="text-right mt-4">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

// Environment variable for backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// State
const events = ref([]);
const showModal = ref(false);
const selectedEvent = ref({});
const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);

// Fetch assigned events
const assignedEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/at/assigned/events`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    events.value = response.data.events;
    console.log('Assigned events:', response.data);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

// Run fetch on component mount
assignedEvents();

// Format date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Modal control
const openModal = (event) => {
  selectedEvent.value = event;
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};

// Format requirements safely
const formattedRequirements = computed(() => {
  const reqs = selectedEvent.value.requirements;
  try {
    if (Array.isArray(reqs)) return reqs;
    if (typeof reqs === 'string') {
      const parsed = JSON.parse(reqs);
      return Array.isArray(parsed) ? parsed : reqs.split(',').map(r => r.trim());
    }
    return [];
  } catch {
    return [];
  }
});
</script>

<style>
/* You can add any custom styles here */
</style>
