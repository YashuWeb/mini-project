<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">My Events</h1>
      <p class="text-gray-500 mt-1">Manage your events by status</p>
    </div>

  <!-- Success Message -->
  <div v-if="successMessage" class="mt-4 p-4 bg-green-100 text-green-800 rounded">
      {{ successMessage }}
    </div>
    <!-- Tabs -->
    <div class="mt-6 border-b border-gray-200">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <!-- Published Events -->
      <div
        v-if="activeTab === 'published'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="event in publishedEvents"
          :key="event.id"
          class="bg-white shadow rounded-lg p-4"
        >
          <h3 class="text-lg font-bold text-gray-800">{{ event.title }}</h3>
          <p class="text-sm text-gray-500">{{ event.description }}</p>
          <p
            class="mt-2 text-sm font-medium"
            :class="{
              'text-green-600': event.approval_status === 'approved',
              'text-red-600': event.approval_status === 'rejected',
            }"
          >
            Status: {{ event.approval_status.charAt(0).toUpperCase() + event.approval_status.slice(1) }}
          </p>
        </div>
      </div>
      <p v-if="activeTab === 'published' && publishedEvents.length === 0" class="text-gray-500">
        No published events available.
      </p>

      <!-- Draft Events -->
      <div
        v-if="activeTab === 'draft'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="event in draftEvents" :key="event.id" class="bg-white shadow rounded-lg p-4">
          <h3 class="text-lg font-bold text-gray-800">{{ event.title }}</h3>
          <!-- <p class="text-sm text-gray-500">{{ event.description }}</p> -->
          <p class="mt-2 text-sm text-gray-500">
            Tasks Completed: {{ event.completedTasks }}/{{ event.totalTasks }}
          </p>
          <button
            v-if="event.completedTasks === event.totalTasks"
            @click="publishEvent(event.id)"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Publish Event
          </button>
        </div>
      </div>
      <p v-if="activeTab === 'draft' && draftEvents.length === 0" class="text-gray-500">
        No draft events available.
      </p>

      <!-- Pending Events -->
      <div
        v-if="activeTab === 'pending'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="event in pendingEvents" :key="event.id" class="bg-white shadow rounded-lg p-4">
          <h3 class="text-lg font-bold text-gray-800">{{ event.title }}</h3>
          <p class="text-sm text-gray-500">{{ event.description }}</p>
          <p class="mt-2 text-sm text-yellow-600 font-medium">Status: {{ event.approval_status }}</p>
        </div>
      </div>
      <p v-if="activeTab === 'pending' && pendingEvents.length === 0" class="text-gray-500">
        No pending events available.
      </p>

      <!-- Past Events -->
      <div v-if="activeTab === 'past'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="event in pastEvents" :key="event.id" class="bg-white shadow rounded-lg p-4">
          <h3 class="text-lg font-bold text-gray-800">{{ event.title }}</h3>
          <p class="text-sm text-gray-500">{{ event.description }}</p>
          <p class="mt-2 text-sm text-gray-500">Ended on: {{ formatDate(event.endDate) }}</p>
        </div>
      </div>
      <p v-if="activeTab === 'past' && pastEvents.length === 0" class="text-gray-500">
        No past events available.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue'
import axios from 'axios'
// Tabs configuration
const tabs = [
  { id: 'published', name: 'Published Events' },
  { id: 'draft', name: 'Draft Events' },
  { id: 'pending', name: 'Pending Events' },
  { id: 'past', name: 'Past Events' },
]

// Active tab state
const activeTab = ref('published')

// Mock event data
const events = ref()

// Categorized events

const publishedEvents = ref([])
const draftEvents = ref([])
const pendingEvents = ref([])
const pastEvents = ref([])

// Success message state
const successMessage = ref('')

//fetching organizer events

const fetchingEvents = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get('http://localhost:8000/api/organizer/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    events.value = response.data.events
    console.log('Events fetched successfully', events.value)
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

fetchingEvents()


// Categorize events
// Watch for changes in `events` and categorize them
watch(events, (newEvents) => {
  publishedEvents.value = newEvents.filter((event) =>
    ['approved', 'rejected'].includes(event.approval_status),
  )
  draftEvents.value = newEvents.filter((event) => event.approval_status === 'draft')
  pendingEvents.value = newEvents.filter((event) => event.approval_status === 'pending')
  pastEvents.value = newEvents.filter((event) => new Date(event.endDate) < new Date())
})
// Publish event
const publishEvent = async (eventId) => {
  const event = events.value.find((e) => e.id === eventId)  
  if (event) {

try {
  const event_id = event.id
  const token = localStorage.getItem('token')
  await axios.put('http://localhost:8000/api/events/publish',
    { event_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  console.log('Event published successfully')

 // Update event status locally
 event.approval_status = 'pending'
      pendingEvents.value.push(event)
      draftEvents.value = draftEvents.value.filter((e) => e.id !== eventId)
// Show success message
      successMessage.value = `Publish request for Event "${event.title}" has been sent successfully!`
   // Hide the message after 3 seconds
   setTimeout(() => {
        successMessage.value = ''
      }, 3000)
} catch (error) {
  console.error('Error publishing event:', error)
}


    // event.approval_status = 'approved'
    // publishedEvents.value.push(event)
    // draftEvents.value = draftEvents.value.filter((e) => e.id !== eventId)
    // alert(`Event "${event.title}" has been published.`)
  }
}

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
