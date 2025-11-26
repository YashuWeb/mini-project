<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Event Monitoring</h1>
        <p class="text-gray-500 mt-1">Monitor and manage all events on the platform</p>
      </div>
    </div>

    <!-- Event Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        v-for="(status, index) in eventStatusCounts"
        :key="index"
        class="bg-white rounded-lg shadow p-6"
      >
        <p class="text-sm font-medium text-gray-500">{{ status.label }}</p>
        <p class="text-2xl font-bold mt-1" :class="status.textColor">{{ status.count }}</p>
      </div>
    </div>

    <!-- Event Filters and Search -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search events..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <select
            v-model="statusFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Events Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Event
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Organizer
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Attendees
              </th>
              <!-- <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th> -->
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="event in paginatedEvents" :key="event.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                <div class="text-xs text-gray-500">{{ event.location }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
                  >
                    <!-- {{ getInitials(event.organizer) }} -->
                  </div>
                  <div class="ml-3 text-sm text-gray-900">
                    {{ event.organizer.firstName }}
                    {{ event.organizer.lastName }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                >
                  {{ event.request_type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-800': event.event_status === 'Upcoming',
                    'bg-green-100 text-green-800': event.event_status === 'live',
                    'bg-gray-100 text-gray-800': event.event_status === 'Past',
                    'bg-red-100 text-red-800': event.event_status === 'canceled',
                  }"
                >
                  {{ event.event_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.attendees }} 
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewEvent(event)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    <Eye class="h-5 w-5" />
                  </button>
                  <button
                    v-if="event.event_status === 'upcoming'"
                    @click="cancelEvent(event.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Cancel Event"
                  >
                    <XCircle class="h-5 w-5" />
                  </button>
                </div>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ startIndex }}</span> to
              <span class="font-medium">{{ endIndex }}</span> of
              <span class="font-medium">{{ events.length }}</span> results
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="{
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium': true,
                  'bg-indigo-50 text-indigo-600': currentPage === page,
                  'bg-white text-gray-700 hover:bg-gray-50': currentPage !== page,
                }"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- View Event Modal -->
    <div
      v-if="showEventModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Event Details</h3>
            <button @click="closeEventModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6" v-if="selectedEvent">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left column: Event details -->
            <div class="md:col-span-2 space-y-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ selectedEvent.title }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ selectedEvent.location }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p class="text-sm text-gray-900">{{ selectedEvent.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Event Type</h3>
                  <p class="text-sm text-gray-900">
                    {{ selectedEvent.request_type.charAt(0).toUpperCase() + selectedEvent.request_type.slice(1) }}
                  </p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Expected Attendees</h3>
                  <p class="text-sm text-gray-900">{{ selectedEvent.attendees }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Date</h3>
                  <p class="text-sm text-gray-900">{{ selectedEvent.date }}</p>
                </div>
              </div>

              <!-- Attendance Stats -->
              <div v-if="selectedEvent.request_type.toLowerCase() !== 'user'">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Attendance</h3>
                <div class="bg-gray-100 rounded-md p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-700"
                      >{{ selectedEvent.attendees }} / {{ selectedEvent.capacity }} attendees</span
                    >
                    <span class="text-sm text-gray-700"
                      >{{ Math.round((selectedEvent.attendees / selectedEvent.capacity) * 100) }}%
                      capacity</span
                    >
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full bg-indigo-600"
                      :style="{
                        width: `${Math.min((selectedEvent.attendees / selectedEvent.capacity) * 100, 100)}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Ticket Sales -->
              <div v-if="selectedEvent.request_type.toLowerCase() !== 'user'">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Ticket Sales</h3>
                <div class="bg-gray-100 rounded-md p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500">Total Revenue</p>
                      <p class="text-lg font-bold text-gray-900">
                        <!-- ${{ selectedEvent.revenue.toLocaleString() }} -->
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Tickets Sold</p>
                      <p class="text-lg font-bold text-gray-900">{{ selectedEvent.ticketsSold }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right column: Organizer details and actions -->
            <div class="space-y-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Organizer</h3>
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium"
                  >
                    <!-- {{ getInitials(selectedEvent.organizer) }} -->
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ selectedEvent.organizer.firstName }} {{ selectedEvent.organizer.lastName }}</p>
                    <p class="text-xs text-gray-500">{{ selectedEvent.organizer.email }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Event Status</h3>
                <div class="flex items-center">
                  <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-800': selectedEvent.event_status === 'Upcoming',
                      'bg-green-100 text-green-800': selectedEvent.event_status === 'live',
                      'bg-gray-100 text-gray-800': selectedEvent.event_status === 'Past',
                      'bg-red-100 text-red-800': selectedEvent.event_status === 'canceled',
                    }"
                  >
                    {{
                      selectedEvent.event_status
                    }}
                  </span>
                  <span class="ml-2 text-xs text-gray-500">
                    Submitted on {{ selectedEvent.submitted_date }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { Search, Eye, XCircle, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import axios from 'axios'
// const router = useRouter()

// event state
const eventStatusCounts = ref([])
const events = ref([])

//token
const token = localStorage.getItem('token')

const fetchingEvents = async()=>{
  try {
    const response = await axios.get('http://localhost:8000/api/event/monitoring', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    events.value = response.data.events
    eventStatusCounts.value = [
      { label: 'Upcoming', count: response.data.upcomingEventsCount, textColor: 'text-blue-600' },
      { label: 'Live', count: response.data.liveEventsCount, textColor: 'text-green-600' },
      { label: 'Completed', count: response.data.pastEventsCount, textColor: 'text-gray-600' },
      { label: 'Canceled', count: response.data.canceledEventsCount, textColor: 'text-red-600' },
    ]
    console.log('Events fetched successfully:', events.value)
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}
onMounted(()=>{
  fetchingEvents()
})
// State variables
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const showEventModal = ref(false)
const selectedEvent = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const filteredEvents = computed(() => {
  let result = [...events.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter((event) => event.status === statusFilter.value)
  }

  // Apply type filter
  if (typeFilter.value !== 'all') {
    result = result.filter((event) => event.type === typeFilter.value)
  }

  return result
})

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredEvents.value.length)
})

// Helper functions
// const getInitials = (name) => {
//   return name
//     .split(' ')
//     .map((part) => part.charAt(0))
//     .join('')
//     .toUpperCase()
//     .substring(0, 2)
// }

// Action functions
const viewEvent = (event) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

// const cancelEvent = (eventId) => {
//   const index = events.value.findIndex((e) => e.id === eventId)
//   if (index !== -1) {
//     events.value[index].status = 'canceled'

//     // Update event status counts
//     eventStatusCounts[0].count-- // Decrease upcoming count
//     eventStatusCounts[3].count++ // Increase canceled count
//   }
// }

// const cancelEventFromModal = (eventId) => {
//   cancelEvent(eventId)
//   closeEventModal()
// }

// const assignTeamFromModal = (event) => {
//   // Navigate to team assignment page with the event ID
//   router.push(`/admin/team-assignment?eventId=${event.id}`)
// }

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Watch for currentPage changes to reset to the first page if filteredEvents change
watch(currentPage, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})
</script>
