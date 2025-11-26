<template>
  <div class="space-y-6">
    <!-- Toast Notification -->
    <div
      v-if="showToast"
      :class="[
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center w-full max-w-md p-4 mb-4 text-gray-500 bg-white rounded-lg shadow',
        toastType === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
      ]"
      role="alert"
    >
      <div :class="[
        'inline-flex items-center justify-center flex-shrink-0 w-8 h-8',
        toastType === 'success' ? 'text-green-500' : 'text-red-500'
      ]">
        <svg v-if="toastType === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="ml-3 text-sm font-normal">
        {{ toastMessage }}
      </div>
      <button
        type="button"
        @click="showToast = false"
        :class="[
          'ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg',
          'focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8'
        ]"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6-6"/>
        </svg>
      </button>
    </div>

    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Assignment</h1>
        <p class="text-gray-500 mt-1">Assign teams to upcoming events</p>
      </div>
    </div>

    <!-- Event Selection -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Select Event</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="event-select" class="block text-sm font-medium text-gray-700 mb-1">
            Event
          </label>
          <select
            id="event-select"
            v-model="selectedEventId"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select an event</option>
            <option v-for="event in upcomingEvents" :key="event.id" :value="event.id">
              {{ event.title }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="selectedEventId">
      <!-- Event Details -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">{{ selectedEvent.title }}</h2>
            <p class="text-gray-500 mt-1">
              {{ selectedEvent.location }} • {{ formatDate(selectedEvent.date) }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
            >
              {{ selectedEvent.category }}
            </span>
            <span class="text-sm text-gray-500">
              {{ selectedEvent.expectedAttendees }} attendees
            </span>
          </div>
        </div>
      </div>

      <!-- Team Assignment -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">Assign Teams</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Available Teams -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Available Teams</h3>
              <div class="border border-gray-200 rounded-md overflow-hidden">
                <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-gray-500">Team Leader Name</span>
                  </div>
                </div>
                <div class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                  <div
                    v-for="team in availableTeams"
                    :key="team.id"
                    class="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    @click="selectTeam(team)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="flex items-center justify-center font-medium">
                          <div
                            class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-green-600 font-medium"
                          >
                            {{ getInitials(`${team.firstName} ${team.lastName}`) }}
                          </div>
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            {{ team.firstName }} {{ team.lastName }}
                          </p>
                          <p class="text-xs text-gray-500">{{ team.role }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assigned Teams -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Assigned Teams</h3>
              <div class="border border-gray-200 rounded-md overflow-hidden">
                <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-gray-500">Team Name</span>
                    <span class="text-xs font-medium text-gray-500">Actions</span>
                  </div>
                </div>
                <div class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                  <div
                    v-if="assignedTeams.length === 0"
                    class="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No teams assigned yet
                  </div>
                  <div v-for="team in assignedTeams" :key="team.id" class="px-4 py-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div
                          class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-green-600 font-medium"
                        >
                          {{ getInitials(`${team.firstName} ${team.lastName}`) }}
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            {{ team.firstName }} {{ team.lastName }}
                          </p>
                          <p class="text-xs text-gray-500">{{ team.role }}</p>
                        </div>
                      </div>
                      <button
                        @click="removeTeam(team)"
                        class="text-red-600 hover:text-red-900"
                        title="Remove Team"
                      >
                        <X class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Details -->
          <div v-if="selectedTeam" class="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div class="flex items-center justify-between mb-4">
              
              <button
                @click="assignTeam(selectedTeam)"
                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <UserPlus class="h-4 w-4 mr-1" />
                Assign to Event
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <div class="mt-6 flex justify-end">
            <button
              @click="saveAssignments"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { UserPlus, X } from 'lucide-vue-next'
import axios from 'axios'

const route = useRoute()

// Toast notification state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' or 'error'

// State variables
const selectedEventId = ref('')
const selectedTeam = ref(null)
const assignedTeams = ref([])
const upcomingEvents = ref([])
const teams = ref([])

// Show toast message function
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    showToast.value = false
  }, 5000)
}

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Get initials helper
const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Fetch paid events
const fetchPaidEvents = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/paid/events', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    upcomingEvents.value = response.data.paidEvents || []
    console.log('Fetched events:', upcomingEvents.value)
  } catch (error) {
    console.error('Error fetching events:', error)
    showToastMessage('Failed to load events. Please try again.', 'error')
  }
}

// Fetch team members
const fetchTeamMembers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/team', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    teams.value = response.data.teamMembers || []
    console.log('Fetched team members:', teams.value)
  } catch (error) {
    console.error('Error fetching team members:', error)
    showToastMessage('Failed to load team members. Please try again.', 'error')
  }
}

// Computed properties
const selectedEvent = computed(() => {
  return upcomingEvents.value.find((event) => event.id === parseInt(selectedEventId.value)) || {}
})

const availableTeams = computed(() => {
  const assignedTeamIds = assignedTeams.value.map((team) => team.user_id)
  return teams.value.filter((team) => !assignedTeamIds.includes(team.user_id))
})

// Action functions
const selectTeam = (team) => {
  selectedTeam.value = team
}

const assignTeam = (team) => {
  if (!assignedTeams.value.some((t) => t.user_id === team.user_id)) {
    assignedTeams.value.push(team)
    selectedTeam.value = null
    showToastMessage(`${team.firstName} ${team.lastName} added to assigned teams`, 'success')
  }
}

const removeTeam = (team) => {
  assignedTeams.value = assignedTeams.value.filter((t) => t.user_id !== team.user_id)
  showToastMessage(`${team.firstName} ${team.lastName} removed from assigned teams`, 'success')
}

const saveAssignments = async () => {
  if (assignedTeams.value.length === 0) {
    showToastMessage('Please assign at least one team', 'error')
    return
  }

  if (!selectedEventId.value) {
    showToastMessage('Please select an event first', 'error')
    return
  }

  const payload = {
    event_id: parseInt(selectedEventId.value),
    user_id: assignedTeams.value[0].user_id,
  }

  try {
    const response = await axios.post(
      'http://localhost:8000/api/admin/assign/team',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    console.log('Assignment successful:', response.data)
    showToastMessage('Team successfully assigned to the event!', 'success')

    // Reset the form after successful assignment
    selectedTeam.value = null
    assignedTeams.value = []
    selectedEventId.value = ''

  } catch (error) {
    console.error('Error assigning team:', error)
    let errorMessage = 'Failed to assign team. Please try again.'

    if (error.response) {
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      } else if (error.response.status === 422) {
        errorMessage = 'Validation error. Please check your inputs.'
      }
    }

    showToastMessage(errorMessage, 'error')
  }
}

// Initialize data on component mount
onMounted(() => {
  fetchPaidEvents()
  fetchTeamMembers()

  // Check if we have a team ID from the route query
  const eventId = route.query.eventId
  const teamId = route.query.teamId

  if (eventId) {
    selectedEventId.value = eventId
  }

  if (teamId) {
    // If a team ID is provided, pre-select that team for assignment
    const team = teams.value.find((t) => t.id === parseInt(teamId))
    if (team) {
      selectedTeam.value = team
    }
  }
})

// Watch for changes in selectedEventId to reset the form when it changes
watch(selectedEventId, () => {
  assignedTeams.value = []
  selectedTeam.value = null
})
</script>
