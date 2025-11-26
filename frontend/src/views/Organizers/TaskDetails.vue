<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div v-if="isLoading" class="text-center text-gray-500">Loading task details...</div>
    <div v-else-if="!task" class="text-center text-red-500">Failed to load task details.</div>

    <div v-else>
      <!-- Back button and header -->
      <div class="flex items-center mb-6">
        <RouterLink
          to="/organizerview/taskManagement"
          class="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft class="h-5 w-5" />
        </RouterLink>
        <h1 class="text-2xl font-bold flex-1">Task Details</h1>
      </div>

      <!-- Task status banner -->
      <div
        :class="[
          'mb-6 p-4 rounded-lg flex items-center justify-between',
          statusClasses[task.status],
        ]"
      >
        <div class="flex items-center">
          <div :class="['h-3 w-3 rounded-full mr-2', statusDotClasses[task.status]]"></div>
          <span class="font-medium">{{ statusLabels[task.status] }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main task info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">{{ task.title }}</h2>
            <p class="text-gray-700 mb-6">{{ task.description }}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="flex items-center">
                <Calendar class="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <div class="text-sm text-gray-500">Deadline</div>
                  <div class="font-medium" :class="deadlineClasses">
                    {{ formatDate(task.due_date) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <Flag class="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <div class="text-sm text-gray-500">Priority</div>
                  <div class="font-medium" :class="priorityClasses[task.priority]">
                    {{ priorityLabels[task.priority] }}
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <h3 class="font-medium mb-3">Dependencies</h3>
              <div v-if="task.dependencies && task.dependencies.length > 0">
                <div
                  v-for="depId in task.dependencies"
                  :key="depId"
                  class="flex items-center mb-2 p-2 bg-gray-50 rounded"
                >
                  <div
                    :class="[
                      'h-2 w-2 rounded-full mr-2',
                      statusDotClasses[getDependencyStatus(depId)],
                    ]"
                  ></div>
                  <span class="flex-1">{{ getDependencyName(depId) }}</span>
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded',
                      statusBadgeClasses[getDependencyStatus(depId)],
                    ]"
                    >{{ statusLabels[getDependencyStatus(depId)] }}</span
                  >
                </div>
              </div>
              <div v-else class="text-gray-500 italic">No dependencies</div>
            </div>
          </div>

          <!-- Activity and comments -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Activity & Comments</h3>

            <div class="mb-6">
              <div class="flex mb-4">
                <textarea
                  v-model="newComment"
                  placeholder="Add a comment..."
                  class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  rows="2"
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button @click="addComment" class="btn-primary">
                  <MessageSquare class="h-4 w-4 mr-1" />
                  Send
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="(activity, index) in task.task_comments" :key="index" class="border-t pt-4">
                <div class="flex items-start">
                  <div
                    class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3"
                  >
                    <User class="h-4 w-4 text-gray-500" />
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <div class="font-medium">{{ activity.user.firstName }}</div>
                      <div class="text-xs text-gray-500">{{ formatDate(activity.created_at) }}</div>
                    </div>
                    <div  class="text-gray-700">
                      {{ activity.comment }}
                    </div>
                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Assigned team members -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4 text-center">Assigned To</h3>
            <div v-if="task.members && task.members.length > 0" class="space-y-3">
              <div v-for="member in task.members" :key="member.user.id" class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <User class="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <div class="font-medium">
                    {{ member.user.firstName }} {{ member.user.lastName }}
                  </div>
                  <div class="text-xs text-gray-500">{{ member.user.role}}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 text-center">Not Assigned</div>
          </div>

          <!-- Task details -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Task Details</h3>
            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-500">Allocated Budget</div>
                <div class="font-medium">{{ task.budget }} ETB</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Created on</div>
                <div class="font-medium">{{ formatDate(task.created_at) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Last updated</div>
                <div class="font-medium">{{ formatDate(task.updated_at) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Event</div>
                <div class="font-medium">{{ task.event.title }}</div>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Attachments</h3>
            <div v-if="task.attachments && task.attachments.length > 0" class="space-y-2">
              <div
                v-for="file in task.attachments"
                :key="file.id"
                class="flex items-center p-2 border border-gray-200 rounded-md"
              >
                <FileText class="h-4 w-4 text-gray-500 mr-2" />
                <span class="flex-1 truncate">{{ file.name }}</span>
                <button class="text-gray-500 hover:text-gray-700">
                  <Download class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div v-else class="text-gray-500 italic mb-4">No attachments</div>
            <!-- Hidden File Input -->
            <input type="file" ref="fileInput" class="hidden" multiple @change="handleFileChange" />
            <button
              @click="triggerFileUpload"
              class="w-full btn-outline flex items-center justify-center"
            >
              <Upload class="h-4 w-4 mr-1" />
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  ChevronLeft,
  Calendar,
  Flag,
  User,
  MessageSquare,
  FileText,
  Download,
  Upload,
} from 'lucide-vue-next'
import axios from 'axios'

const route = useRoute()
const task = ref(null)
const isLoading = ref(true)
const taskId = route.params.id
const token = localStorage.getItem('token')
const selectedEventId = ref('')
const tasks = ref([])
const newComment = ref('')
const fileInput = ref(null)
const selectedFile = ref([])
//fetching team members

const teamMembers = ref([])

const fetchTeamMembers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/members', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    teamMembers.value = response.data.members
    console.log('Team members fetched:', teamMembers.value)
  } catch (error) {
    console.error('Error fetching team members:', error)
  }
}

// Fetch team members on component mount
onMounted(() => {
  fetchTeamMembers()
})

const fetchTasks = async () => {
  if (!selectedEventId.value) return []
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `http://localhost:8000/api/events/tasks/${selectedEventId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    // Ensure tasks include members
    tasks.value = response.data.tasks.map((task) => ({
      ...task,
      members: task.members || [], // Ensure members array exists
    }))
    console.log('Tasks fetched:', tasks.value)
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}
onMounted(() => {
  const savedEventId = localStorage.getItem('selectedEventId')
  if (savedEventId) {
    selectedEventId.value = savedEventId
    fetchTasks()
  }
})

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/tasks/details/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    task.value = response.data.task
    console.log('Task dependencies:', response.data.task)
  } catch (error) {
    console.error('Error fetching task:', error)
  } finally {
    isLoading.value = false
  }
})

const getDependencyName = (dependencyId) => {
  const dependencyTask = tasks.value.find((task) => task.id === dependencyId)
  return dependencyTask ? dependencyTask.title : `Task #${dependencyId}`
}

const getDependencyStatus = (dependencyId) => {
  const dependencyTask = tasks.value.find((task) => task.id === dependencyId)
  return dependencyTask ? dependencyTask.status : 'unknown'
}

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  completed: 'Completed',
}

const statusClasses = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-50 text-blue-700',
  blocked: 'bg-red-50 text-red-700',
  completed: 'bg-green-50 text-green-700',
}

const statusDotClasses = {
  not_started: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  blocked: 'bg-red-500',
  completed: 'bg-green-500',
}

const statusBadgeClasses = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  blocked: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const priorityClasses = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
}

const deadlineClasses = computed(() => {
  if (!task.value) return ''
  const now = new Date()
  const deadline = new Date(task.due_date)
  const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))

  if (task.value.status === 'completed') return 'text-gray-500'
  if (daysUntilDeadline < 0) return 'text-red-600 font-bold'
  if (daysUntilDeadline <= 3) return 'text-orange-600'
  return 'text-gray-900'
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  const commentData = {
    task_id: task.value.id,
    comment: newComment.value,
  }
  console.log('token', token)
  try {
    const response = await axios.post(
      'http://localhost:8000/api/tasks/comments/create',
      commentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const taskComment = response.data.taskComment
    await fetchingComments();
    console.log('comment added', taskComment)
  } catch (error) {
    console.error('Error on adding comment;', error)
  }

  newComment.value = ''
}

//fetching comments

const fetchingComments = async () => {
  try {
    // Add your logic for fetching comments here
    const response = await axios.get(`http://localhost:8000/api/tasks/comments/${task.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    task.value = response.data
    console.log('Fetching comments...', response.data)
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
}

fetchingComments()


const triggerFileUpload = () => {
  fileInput.value.click() // Trigger the file input when the user clicks the button
}

const handleFileChange = async (event) => {
  const files = event.target.files
  if (!files.length) return

  // Get the first selected file (controller expects single file)
  selectedFile.value = files[0]

  // Create FormData and append the file
  const formData = new FormData()
  formData.append('task_id', task.value.id)
  formData.append('file', selectedFile.value) // Use 'file' to match controller expectation

  try {
    const response = await axios.post(
      'http://localhost:8000/api/tasks/attachments/upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    // Update the task attachments with the newly uploaded file
    if (!task.value.attachments) {
      task.value.attachments = []
    }

    // Create a new attachment object based on the response
    const newAttachment = {
      id: Date.now(), // Temporary ID
      name: selectedFile.value.name,
      file: response.data.file_path || `storage/${response.data.file}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    task.value.attachments.push(newAttachment)

    console.log('File uploaded:', response.data)

   

    // Reset the file input
    event.target.value = ''
    selectedFile.value = null
  } catch (error) {
    console.error('Error uploading file:', error)

    // Show error message to the user
    let errorMessage = 'Error uploading file. Please try again.'

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      } else if (error.response.status === 422) {
        // Validation error
        errorMessage = 'File validation failed. Please check the file size and type.'
      }
    }

    console.log(errorMessage)

    // Reset the file input
    event.target.value = ''
    selectedFile.value = null
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center;
}

.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center;
}

.btn-danger {
  @apply bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium flex items-center;
}

.btn-outline {
  @apply border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium;
}
</style>
