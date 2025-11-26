<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Members</h1>
        <p class="text-gray-500 mt-1">Manage your team and assign tasks to members</p>
      </div>
      <button
        @click="showAddMemberModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <UserPlus class="h-4 w-4 mr-2" />
        Add Team Member
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search team members..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <select
            v-model="roleFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Roles</option>
            <option v-for="role in uniqueRoles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Team Members Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="filteredMembers.length === 0" class="md:col-span-2 lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <div class="flex flex-col items-center">
            <Users class="h-16 w-16 text-gray-400 mb-4" />
            <p class="text-lg font-medium mb-1">No team members found</p>
            <p class="text-sm text-gray-500 mb-4">
              {{
                searchQuery || roleFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first team member to get started'
              }}
            </p>
            <button
              @click="showAddMemberModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus class="h-4 w-4 mr-2" />
              Add Team Member
            </button>
          </div>
        </div>
      </div>

      <div
        v-for="member in filteredMembers"
        :key="member.id"
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div
                class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg"
              >
                {{ getInitials(member.firstName, member.lastName) }}
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ `${member.firstName} ${member.lastName}` }}
                </h3>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editMember(member)"
                class="p-1 rounded-full text-blue-600 hover:text-blue-800 focus:outline-none"
                title="Edit Member"
              >
                <Edit class="h-5 w-5" />
              </button>
              <button
                @click="confirmDeleteMember(member)"
                class="p-1 rounded-full text-red-600 hover:text-red-800 focus:outline-none"
                title="Delete Member"
              >
                <Trash2 class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-500">Email</span>
              <span class="text-xs font-medium text-gray-900">{{ member.email }}</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-500">Phone</span>
              <span class="text-xs font-medium text-gray-900">{{
                member.phone || 'Not provided'
              }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4"></div>

          <!-- <div class="mt-4 flex justify-end space-x-2">
            <button
              @click="assignEvent(member)"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar class="h-4 w-4 mr-1" />
              Assign Event
            </button>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Add/Edit Member Modal -->
    <div
      v-if="showAddMemberModal || showEditMemberModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showEditMemberModal ? 'Edit Team Member' : 'Add New Team Member' }}
            </h3>
            <button @click="closeMemberModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <form id="member-form" @submit.prevent="saveMember" class="space-y-4">
            <div>
              <label for="member-fistName" class="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                id="member-fistName"
                type="text"
                v-model="memberForm.firstName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label for="member-lastName" class="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                id="member-lastName"
                type="text"
                v-model="memberForm.lastName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label for="member-email" class="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="member-email"
                type="email"
                v-model="memberForm.email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label for="member-phone" class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="member-phone"
                type="tel"
                v-model="memberForm.phone"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label for="member-role" class="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <input
                id="member-role"
                type="text"
                v-model="memberForm.role"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter role(s) e.g. 'Venue Coordinator, Technical Support'"
              />
            </div>

            <div>
              <label for="member-password" class="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="member-password"
                type="password"
                v-model="memberForm.password"
                :required="!showEditMemberModal"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter password"
                autocomplete="new-password"
              />
              <p
                v-if="showEditMemberModal && !memberForm.password"
                class="mt-1 text-xs text-gray-500"
              >
                Leave blank to keep current password
              </p>
            </div>

            <div>
              <label for="member-confirm-password" class="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="member-confirm-password"
                type="password"
                v-model="memberForm.confirmPassword"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm password"
                autocomplete="new-password"
              />
              <p v-if="passwordError" class="mt-1 text-xs text-red-500">
                {{ passwordError }}
              </p>
            </div>
          </form>
        </div>
        <div class="p-6 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="closeMemberModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="member-form"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="!!passwordError"
            >
              {{ showEditMemberModal ? 'Update Member' : 'Add Member' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Member Details Modal -->
    <div
      v-if="showMemberDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Team Member Details</h3>
            <button @click="closeMemberDetailsModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6 overflow-y-auto" v-if="selectedMember">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left column: Member details -->
            <div class="md:col-span-2 space-y-6">
              <div class="flex items-center">
                <div
                  class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl"
                >
                  {{ getInitials(selectedMember.name) }}
                </div>
                <div class="ml-4">
                  <h2 class="text-xl font-bold text-gray-900">{{ selectedMember.fistName }}</h2>
                  <p class="text-sm text-gray-500">{{ selectedMember.role }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p class="text-sm text-gray-900">{{ selectedMember.email }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                  <p class="text-sm text-gray-900">{{ selectedMember.phone || 'Not provided' }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                  <p class="text-sm text-gray-900">{{ formatDate(selectedMember.joinedDate) }}</p>
                </div>
              </div>

              <!-- Assigned Events -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Assigned Events</h3>
                <div
                  v-if="selectedMember.assignedEvents && selectedMember.assignedEvents.length > 0"
                  class="bg-gray-50 rounded-md p-4"
                >
                  <div class="space-y-3">
                    <div
                      v-for="event in selectedMember.assignedEvents"
                      :key="event.id"
                      class="p-3 bg-white rounded-md border border-gray-200"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                          <p class="text-xs text-gray-500">
                            {{ formatDate(event.date) }} • {{ event.location }}
                          </p>
                        </div>
                        <button
                          @click="unassignEvent(selectedMember, event)"
                          class="text-red-600 hover:text-red-800"
                          title="Unassign from Event"
                        >
                          <X class="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="bg-gray-50 rounded-md p-4 text-center text-sm text-gray-500">
                  No events assigned to this team member
                </div>
              </div>

              <!-- Task History -->
              <div v-if="selectedMember.taskHistory && selectedMember.taskHistory.length > 0">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Recent Tasks</h3>
                <div class="bg-gray-50 rounded-md p-4">
                  <div class="space-y-3">
                    <div
                      v-for="task in selectedMember.taskHistory"
                      :key="task.id"
                      class="p-3 bg-white rounded-md border border-gray-200"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
                          <p class="text-xs text-gray-500">
                            {{ task.eventTitle }} • Due: {{ formatDate(task.dueDate) }}
                          </p>
                        </div>
                        <span
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="{
                            'bg-gray-100 text-gray-800': task.status === 'not-started',
                            'bg-yellow-100 text-yellow-800': task.status === 'in-progress',
                            'bg-green-100 text-green-800': task.status === 'completed',
                          }"
                        >
                          {{ formatStatus(task.status) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right column: Actions -->
            <div class="space-y-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Member Actions</h3>
                <div class="space-y-3">
                  <button
                    @click="editMemberFromDetails(selectedMember)"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit class="h-4 w-4 mr-2" />
                    Edit Member
                  </button>
                  <button
                    @click="assignEventFromDetails(selectedMember)"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Calendar class="h-4 w-4 mr-2" />
                    Assign to Event
                  </button>
                </div>
              </div>

              <!-- Performance Stats (if applicable) -->
              <!-- <div v-if="selectedMember.performance" class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Performance</h3>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">Events Completed</span>
                    <span class="text-sm font-medium text-gray-900">{{
                      selectedMember.performance.eventsCompleted
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">Tasks Completed</span>
                    <span class="text-sm font-medium text-gray-900">{{
                      selectedMember.performance.tasksCompleted
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">On-time Completion</span>
                    <span class="text-sm font-medium text-gray-900"
                      >{{ selectedMember.performance.onTimePercentage }}%</span
                    >
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

 
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Delete Team Member</h3>
          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete {{ memberToDelete?.name }}? This action cannot be
            undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="deleteMember"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, UserPlus, Edit, Trash2, Calendar, Users, X, AlertCircle } from 'lucide-vue-next'
import axios from 'axios'


// State variables
const searchQuery = ref('')
const roleFilter = ref('all')
const showAddMemberModal = ref(false)
const showEditMemberModal = ref(false)
const showMemberDetailsModal = ref(false)
const showAssignEventModal = ref(false)
const showDeleteModal = ref(false)
const selectedMember = ref(null)
const memberToDelete = ref(null)
const memberToAssign = ref(null)
const selectedEventId = ref('')
const teamMembers = ref([])
const memberForm = ref({
  firstName: '',
  lastName: '',
  role: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const eventAssignmentForm = ref({
  role: 'Support Staff',
  notes: '',
})

// Password validation
const passwordError = computed(() => {
  if (!memberForm.value.password && !memberForm.value.confirmPassword) return ''

  if (memberForm.value.password && memberForm.value.password.length < 6) {
    return 'Password must be at least 6 characters'
  }

  if (memberForm.value.password !== memberForm.value.confirmPassword) {
    return 'Passwords do not match'
  }

  return ''
})

// Fetch team members from API
const fetchTeamMembers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/members', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    // Map the API response to flatten the user data
    teamMembers.value = response.data.members.map((member) => ({
      userId: member.user.id,
      firstName: member.user.firstName || 'Unknown',
      lastName: member.user.lastName || '',
      email: member.user.email || 'Not provided',
      role: member.user.role || 'Not assigned',
      phone: member.phone || 'Not provided', // Add phone if available
    }))

    console.log('Mapped team members:', teamMembers.value) // Debugging log
  } catch (error) {
    console.error('Error fetching team members:', error)
  }
}
fetchTeamMembers()

// Computed properties
const filteredMembers = computed(() => {
  let result = [...teamMembers.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (member) =>
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query),
    )
  }

  // Apply role filter
  if (roleFilter.value !== 'all') {
    result = result.filter((member) => {
      const memberRoles = (member.role || '').split(',').map((r) => r.trim())
      return memberRoles.includes(roleFilter.value)
    })
  }

  return result
})


const uniqueRoles = computed(() => {
  const allRoles = new Set()

  teamMembers.value.forEach((member) => {
    // Ensure role is defined and split by comma
    const roles = (member.role || '').split(',').map((r) => r.trim())
    roles.forEach((role) => {
      if (role) allRoles.add(role)
    })
  })

  return Array.from(allRoles).sort()
})

// Helper functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatStatus = (status) => {
  switch (status) {
    case 'not-started':
      return 'Not Started'
    case 'in-progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    default:
      return status
  }
}

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '' // If both are missing, return an empty string
  if (!firstName) return lastName.charAt(0).toUpperCase() // If only lastName exists
  if (!lastName) return firstName.charAt(0).toUpperCase() // If only firstName exists
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
}

const closeMemberDetailsModal = () => {
  showMemberDetailsModal.value = false
  selectedMember.value = null
}

const editMember = (member) => {
  memberForm.value = {
    user_id: member.userId, // Include the user ID
    firstName: member.firstName,
    lastName: member.lastName,
    role: member.role,
    email: member.email,
    phone: member.phone,
    password: '',
    confirmPassword: '',
  }
  showEditMemberModal.value = true
}

const editMemberFromDetails = (member) => {
  editMember(member)
  closeMemberDetailsModal()
}

const closeMemberModal = () => {
  showAddMemberModal.value = false
  showEditMemberModal.value = false
  resetMemberForm()
}

const resetMemberForm = () => {
  memberForm.value = {
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  }
}

const saveMember = async () => {
  if (showEditMemberModal.value) {
    const index = teamMembers.value.findIndex((m) => m.userId === memberForm.value.user_id)
    if (index !== -1) {
      const updatedMember = {
        user_id: memberForm.value.user_id,
        firstName: memberForm.value.firstName,
        lastName: memberForm.value.lastName,
        email: memberForm.value.email,
        role: memberForm.value.role,
        phone: memberForm.value.phone,
      }

      if (memberForm.value.password) {
        updatedMember.password = memberForm.value.password
      }

      console.log('Update Member Payload:', updatedMember)

      try {
        const response = await axios.put(
          'http://localhost:8000/api/members/update',
          updatedMember,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        console.log('Member updated successfully:', response.data)

        // Update the member in the teamMembers array
        teamMembers.value[index] = {
          ...teamMembers.value[index],
          ...response.data.user,
        }
        closeMemberModal()
      } catch (error) {
        console.error('Error updating member:', error)
      }
    }
  }              else{
    // Add new member

    try {
      const memberData = {
        firstName: memberForm.value.firstName,
        lastName: memberForm.value.lastName,
        email: memberForm.value.email,
        password: memberForm.value.password,
        phone: memberForm.value.phone,
        role: memberForm.value.role,
      }
      console.log('Sending member data:', memberData)
      const response = await axios.post(
        'http://localhost:8000/api/members/add',
        memberData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      // Add the new member to the teamMembers array
      teamMembers.value.push({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
        phone: response.data.user.phone, // Use the phone from the response
      })
      console.log('Member added successfully:', response.data)
    } catch (error) {
      console.error('Error adding member:', error)
    }
  }

  closeMemberModal()
}
  

const confirmDeleteMember = (member) => {
  memberToDelete.value = member
  showDeleteModal.value = true
}

const deleteMember = async() => {
  if (memberToDelete.value) {

try {
await axios.delete(`http://localhost:8000/api/members/delete/${memberToDelete.value.userId}`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
console.log('Member deleted successfully');
} catch (error) {
  console.error('Error deleting member:', error)
}

    teamMembers.value = teamMembers.value.filter((m) => m.userId !== memberToDelete.value.userId)
    showDeleteModal.value = false
    memberToDelete.value = null
  }
}

const assignEvent = (member) => {
  memberToAssign.value = member
  selectedEventId.value = ''
  eventAssignmentForm.value = {
    role: 'Support Staff',
    notes: '',
  }
  showAssignEventModal.value = true
}

const assignEventFromDetails = (member) => {
  assignEvent(member)
  closeMemberDetailsModal()
}



// Watch for password changes to validate in real-time
watch(
  () => [memberForm.value.password, memberForm.value.confirmPassword],
  () => {
    // Password validation happens automatically via the computed property
  },
  { deep: true },
)
</script>
