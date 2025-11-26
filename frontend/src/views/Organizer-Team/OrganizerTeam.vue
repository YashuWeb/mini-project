<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="container mx-auto px-10 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Welcome back, {{ user.firstName }}</h2>
        <p class="text-gray-600">Here are all your assigned tasks across various events.</p>
      </div>

      <!-- Pending Tasks -->
      <section class="mb-10">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pending Tasks</h3>
        <div v-if="pendingTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="task in pendingTasks"
            :key="task.id"
            class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div class="p-4 pb-2 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Calendar class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">{{ task.event.title }}</span>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-blue-100 text-blue-800': task.priority === 'low',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <div class="mb-1">
                <span class="inline-block px-2 text-l">Status: </span>
                <span
                  class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full mb-2"
                >
                  {{ task.status }}
                </span>
              </div>
              <h4 class="text-base font-medium mb-2">{{ task.title }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ task.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <Clock class="h-4 w-4 mr-1" />
                  <span>Due: {{ task.due_date }}</span>
                </div>
                <RouterLink :to="`/subteamview/${task.id}`" class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View details
                  <ArrowRight class="h-4 w-4 ml-1" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <p>No pending tasks available.</p>
        </div>
      </section>

      <!-- In Progress -->
      <section class="mb-10">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">In Progress</h3>
        <div v-if="inProgressTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="task in inProgressTasks"
            :key="task.id"
            class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div class="p-4 pb-2 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Calendar class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">{{ task.event.title }}</span>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-blue-100 text-blue-800': task.priority === 'low',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <div class="mb-1">
                <span
                  class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2"
                >
                  {{ task.status }}
                </span>
              </div>
              <h4 class="text-base font-medium mb-2">{{ task.title }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ task.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <Clock class="h-4 w-4 mr-1" />
                  <span>Due: {{ task.due_date }}</span>
                </div>
                <RouterLink :to="`/subteamview/${task.id}`" class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View details
                  <ArrowRight class="h-4 w-4 ml-1" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <p>No tasks in progress.</p>
        </div>
      </section>

      <!-- Completed -->
      <section>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Completed</h3>
        <div v-if="completedTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="task in completedTasks"
            :key="task.id"
            class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div class="p-4 pb-2 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Calendar class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">{{ task.event.title }}</span>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-blue-100 text-blue-800': task.priority === 'low',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <div class="mb-1">
                <span
                  class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mb-2"
                >
                  {{ task.status }}
                </span>
              </div>
              <h4 class="text-base font-medium mb-2">{{ task.title }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ task.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <CheckCircle class="h-4 w-4 mr-1" />
                  <span>Completed</span>
                </div>
                <RouterLink :to="`/subteamview/${task.id}`" class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View details
                  <ArrowRight class="h-4 w-4 ml-1" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <p>No completed tasks available.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Calendar, CheckCircle, Clock, ArrowRight } from 'lucide-vue-next'
// import { useRouter } from 'vue-router'
import axios from 'axios'

// const router = useRouter()
// Task data
const token = localStorage.getItem('token')
const pendingTasks = ref([])
const inProgressTasks = ref([])
const completedTasks = ref([])
const user = ref(JSON.parse(localStorage.getItem('user')) || null);

// User data


const fetchTasks = async () => {
  const response = await axios.get('http://localhost:8000/api/subteam/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  pendingTasks.value = response.data.tasks.filter(task => task.status === 'not_started')
  inProgressTasks.value = response.data.tasks.filter(task => task.status === 'in_progress')
  completedTasks.value = response.data.tasks.filter(task => task.status === 'completed')

  console.log('Pending Tasks:', pendingTasks.value)
  console.log('In Progress Tasks:', inProgressTasks.value)
  console.log('Completed Tasks:', completedTasks.value)
  console.log('tasks',response.data)
}

fetchTasks()


</script>

<style>
/* You can add any additional custom styles here if needed */
</style>
