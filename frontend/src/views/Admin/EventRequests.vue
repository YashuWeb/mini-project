<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Event Requests</h1>
        <p class="text-gray-500 mt-1">Review and manage event requests from organizers</p>
      </div>
    </div>

    <!-- Request Stats -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
      <div class="bg-white rounded-lg shadow p-6 ">
        <p class="text-sm font-medium text-gray-500">Total Requests</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ requestStats.total }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Pending</p>
        <p class="text-2xl font-bold text-yellow-600 mt-1">{{ requestStats.pending }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Approved</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ requestStats.approved }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Rejected</p>
        <p class="text-2xl font-bold text-red-600 mt-1">{{ requestStats.rejected }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Organizer</p>
        <p class="text-2xl font-bold text-purple-600 mt-1">{{ requestStats.organizer }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">User</p>
        <p class="text-2xl font-bold text-teal-600 mt-1">{{ requestStats.user }}</p>
      </div>
    </div>

    <!-- Request Filters and Search -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search event requests..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <select
            v-model="statusFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            v-model="requestTypeFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Request Types</option>
            <option value="organizer">Organizer Requests</option>
            <option value="user">User Requests</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Event Requests Table -->
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
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Request Type
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
                Submitted On
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="request in paginatedRequests"
              :key="request.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ request.title }}</div>
                <div class="text-xs text-gray-500">{{ request.location }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-3 text-sm text-gray-900">
                    {{ request.organizer.firstName }} {{ request.organizer.lastName }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                >
                  {{ request.category.charAt(0).toUpperCase() + request.category.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-purple-100 text-purple-800': request.request_type === 'organizer',
                    'bg-teal-100 text-teal-800': request.request_type === 'user',
                  }"
                >
                  {{ request.request_type === 'organizer' ? 'Organizer' : 'User' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ request.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': request.approval_status === 'pending',
                    'bg-green-100 text-green-800': request.approval_status === 'approved',
                    'bg-red-100 text-red-800': request.approval_status === 'rejected',
                  }"
                >
                  {{
                    request.approval_status.charAt(0).toUpperCase() +
                    request.approval_status.slice(1)
                  }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ request.submitted_date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewRequest(request)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    <Eye class="h-5 w-5" />
                  </button>
                  <button
                    v-if="request.approval_status === 'pending'"
                    @click="approveRequest(request.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Approve Request"
                  >
                    <CheckCircle class="h-5 w-5" />
                  </button>
                  <button
                    v-if="request.approval_status === 'pending'"
                    @click="rejectRequest(request.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Reject Request"
                  >
                    <XCircle class="h-5 w-5" />
                  </button>
                </div>
              </td>
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
              Showing <span class="font-medium">{{ startIndex }}</span> to <span class="font-medium">{{ endIndex }}</span> of
              <span class="font-medium">{{ eventRequests.length }}</span> results
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

    <!-- View Request Modal -->
    <div
      v-if="showRequestModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Event Request Details</h3>
            <button @click="closeRequestModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6" v-if="selectedRequest">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left column: Event details -->
            <div class="md:col-span-2 space-y-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ selectedRequest.title }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ selectedRequest.location }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p class="text-sm text-gray-900">{{ selectedRequest.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Event Type</h3>
                  <p class="text-sm text-gray-900">
                    {{
                      selectedRequest.request_type.charAt(0).toUpperCase() +
                      selectedRequest.request_type.slice(1)
                    }}
                  </p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Expected Attendees</h3>
                  <p class="text-sm text-gray-900">{{ selectedRequest.attendees }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Date</h3>
                  <p class="text-sm text-gray-900">{{ selectedRequest.date }}</p>
                </div>
                <div v-if="selectedRequest.request_type === 'user'">
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Budget</h3>
                  <p class="text-sm text-gray-900">
                    ${{ selectedRequest.budget.toLocaleString() }}
                  </p>
                </div>
              </div>

              <div v-if="selectedRequest.request_type === 'user'">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Requirements</h3>
                <ul class="list-disc pl-5 text-sm text-gray-900 space-y-1">
                  <li v-for="(req, index) in selectedRequest.requirements" :key="index">
                    {{ req }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Right column: Organizer details and actions -->
            <div class="space-y-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Organizer</h3>
                <div class="flex items-center">
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ selectedRequest.organizer.firstName }} {{ selectedRequest.organizer.lastName }}</p>
                    <p class="text-xs text-gray-500">{{ selectedRequest.organizerEmail }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Request Status</h3>
                <div class="flex items-center">
                  <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': selectedRequest.approval_status === 'pending',
                      'bg-green-100 text-green-800': selectedRequest.approval_status === 'approved',
                      'bg-red-100 text-red-800': selectedRequest.approval_status === 'rejected',
                    }"
                  >
                    {{
                      selectedRequest.approval_status.charAt(0).toUpperCase() +
                      selectedRequest.approval_status.slice(1)
                    }}
                  </span>
                  <span class="ml-2 text-xs text-gray-500">
                    Submitted on {{ selectedRequest.submitted_date }}
                  </span>
                </div>
              </div>

              <div v-if="selectedRequest.approval_status === 'pending'" class="space-y-4">
                <div class="flex space-x-3">
                  <button
                    @click="approveRequestWithFeedback(selectedRequest)"
                    class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckCircle class="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    @click="rejectRequestWithFeedback(selectedRequest)"
                    class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircle class="h-4 w-4 mr-1" />
                    Reject
                  </button>
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
import { ref, computed, watch } from 'vue'
import { Search, Eye, CheckCircle, XCircle, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import axios from 'axios'

// Sample data
const requestStats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  organizer: 0,
  user: 0,
})

const eventRequests = ref([])
const itemsPerPage = 10
const currentPage = ref(1)

const fetchEventRequests = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get('http://localhost:8000/api/admin/event/requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    eventRequests.value = response.data.events.map(event => ({
      ...event,
      requirements: JSON.parse(event.requirements), // Parse the requirements field
    }))
    requestStats.value.total = response.data.total
    requestStats.value.pending = response.data.pending
    requestStats.value.approved = response.data.approved
    requestStats.value.rejected = response.data.rejected
    requestStats.value.organizer = response.data.organizer
    requestStats.value.user = response.data.user
    console.log('Event Requests:', eventRequests.value)
  } catch (error) {
    console.error('Error fetching event requests:', error)
  }
}

fetchEventRequests()

// State variables
const searchQuery = ref('')
const statusFilter = ref('all')
const requestTypeFilter = ref('all')
const showRequestModal = ref(false)
const selectedRequest = ref(null)
const feedbackText = ref('')

// Computed properties
const filteredRequests = computed(() => {
  let result = [...eventRequests.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (request) =>
        request.title.toLowerCase().includes(query) ||
        request.organizer.firstName.toLowerCase().includes(query) ||
        request.organizer.lastName.toLowerCase().includes(query) ||
        request.category.toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter((request) => request.approval_status === statusFilter.value)
  }

  // Apply request type filter
  if (requestTypeFilter.value !== 'all') {
    result = result.filter((request) => request.request_type === requestTypeFilter.value)
  }

  return result
})

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRequests.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRequests.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredRequests.value.length)
})



// Action functions
const viewRequest = (request) => {
  selectedRequest.value = request
  feedbackText.value = ''
  showRequestModal.value = true
}

const closeRequestModal = () => {
  showRequestModal.value = false
  selectedRequest.value = null
  feedbackText.value = ''
}

const approveRequest = async (requestId) => {
  const index = eventRequests.value.findIndex((r) => r.id === requestId)
  const event_id = eventRequests.value[index].id
  if (index !== -1) {
    try {
      await axios.put(
        'http://localhost:8000/api/admin/event/approve',
        { event_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      console.log('Approved successfully')
      eventRequests.value[index].approval_status = 'approved'
      requestStats.value.pending--
      requestStats.value.approved++
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }
}

const rejectRequest = async (requestId) => {
  const index = eventRequests.value.findIndex((r) => r.id === requestId)
  const event_id = eventRequests.value[index].id

  if (index !== -1) {
    try {
      await axios.put(
        'http://localhost:8000/api/admin/event/reject',
        { event_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      console.log('Rejected successfully')
      eventRequests.value[index].approval_status = 'rejected'
      requestStats.value.pending--
      requestStats.value.rejected++
    } catch (error) {
      console.log('Error rejecting request:', error)
    }
  }
}

const approveRequestWithFeedback = (request) => {
  approveRequest(request.id)
  closeRequestModal()
}

const rejectRequestWithFeedback = (request) => {
  rejectRequest(request.id)
  closeRequestModal()
}

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

watch(currentPage, () => {
  // Reset to the first page if the filtered requests change
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})
</script>
