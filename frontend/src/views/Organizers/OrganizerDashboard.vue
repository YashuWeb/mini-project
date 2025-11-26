<script setup>
import { ref, onMounted } from 'vue'
import {
  Calendar,
  Ticket,
  Users,
  DollarSign,
  ChevronRight,
  BarChart,
  Star,
  CheckCircle2,
} from 'lucide-vue-next'
import axios from 'axios'

// Dashboard Data
const stats = ref({
  totalEvents: 0,
  activeEvents: 0,
  totalTickets: 0,
  totalRevenue: 0,
  ticketsSold: 0,
  averageAttendance: 0,
})
onMounted(async () => {
  try {
    const token = localStorage.getItem('token') // Get the token from local storage
    if (!token) {
      console.error('No token found')
      return
    }

    const response = await axios.get('http://localhost:8000/api/organizer/analytics/', {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the request headers
      },
    })
    stats.value = {
      totalEvents: response.data.events || 0,
      activeEvents: response.data.activeEvents || 0, // If your API supports this
      totalTickets: response.data.tickets || 0,
      totalRevenue: response.data.revenue || 0,
      ticketsSold: response.data.ticketsSold || 0, // If your API supports this
      averageAttendance: response.data.averageAttendance || 0, // If your API supports this
    }
    console.log('Analytics data:', response.data)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
  }
})
const upcomingEvents = ref([
  {
    id: 1,
    title: 'Tech Conference 2024',
    date: '2024-03-15',
    time: '09:00 AM',
    location: 'San Francisco Convention Center',
    ticketsSold: 450,
    totalTickets: 600,
    status: 'Active',
    image: '/placeholder.svg?height=100&width=200',
  },
  {
    id: 2,
    title: 'Digital Marketing Summit',
    date: '2024-04-01',
    time: '10:00 AM',
    location: 'New York Business Center',
    ticketsSold: 280,
    totalTickets: 400,
    status: 'Active',
    image: '/placeholder.svg?height=100&width=200',
  },
])

const recentActivity = ref([
  {
    id: 1,
    type: 'ticket_sale',
    message: 'New ticket purchased for Tech Conference 2024',
    time: '2 minutes ago',
  },
  {
    id: 2,
    type: 'event_update',
    message: 'Updated venue details for Digital Marketing Summit',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'review',
    message: 'New 5-star review received for AI Workshop',
    time: '3 hours ago',
  },
])


//fetching organizer events

const fetchingEvents = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get('http://localhost:8000/api/organizer/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    upcomingEvents.value = response.data.events
    console.log('Events fetched successfully', upcomingEvents.value)
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

fetchingEvents()


const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
  }).format(value)
}

const formatDate = (date, time) => {
  return new Date(`${date} ${time}`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

const calculateProgress = (sold, total) => {
  return (sold / total) * 100
}

const getActivityIcon = (type) => {
  switch (type) {
    case 'ticket_sale':
      return Ticket
    case 'event_update':
      return CheckCircle2
    case 'review':
      return Star
    default:
      return Calendar
  }
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
      <p class="text-gray-600">Welcome back! Here's what's happening with your events.</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      <!-- Total Events -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-medium text-gray-600">Total Events</h3>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalEvents }}</p>
      </div>

      <!-- Total Tickets -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-medium text-gray-600">Total Tickets</h3>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalTickets }}</p>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-medium text-gray-600">Total Revenue</h3>
        <p class="text-3xl font-bold text-gray-900 mt-1">
          {{ formatCurrency(stats.totalRevenue) }}
        </p>
      </div>

      <!-- Average Attendance -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-medium text-gray-600">Average Attendance</h3>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.averageAttendance }}</p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-2 mb-8 ">
      <!-- Upcoming Events -->
      <div class="bg-white rounded-xl shadow-sm border  border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center w-full justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <router-link
              to="/organizer/events"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
            >
              View All
              <ChevronRight class="h-4 w-4 ml-1" />
            </router-link>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div v-for="event in upcomingEvents" :key="event.id" class="p-6">
            <div class="flex gap-4">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-24 h-16 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 truncate">
                      {{ event.title }}
                    </h3>
                    <div class="mt-1 flex items-center text-sm text-gray-600">
                      <Calendar class="h-4 w-4 mr-1" />
                      {{ formatDate(event.date, event.time) }}
                    </div>
                  </div>
                 
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <!-- <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div class="p-6">
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivity" :key="activity.id">
                <div class="relative pb-8">
                  <span
                    v-if="index !== recentActivity.length - 1"
                    class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  ></span>
                  <div class="relative flex space-x-3">
                    <div>
                      <span
                        class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        :class="{
                          'bg-blue-100': activity.type === 'ticket_sale',
                          'bg-green-100': activity.type === 'event_update',
                          'bg-yellow-100': activity.type === 'review',
                        }"
                      >
                        <component
                          :is="getActivityIcon(activity.type)"
                          class="h-4 w-4"
                          :class="{
                            'text-blue-600': activity.type === 'ticket_sale',
                            'text-green-600': activity.type === 'event_update',
                            'text-yellow-600': activity.type === 'review',
                          }"
                        />
                      </span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm text-gray-900">{{ activity.message }}</p>
                      <p class="mt-0.5 text-sm text-gray-500">{{ activity.time }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div> -->
    </div>

    <!-- Quick Actions -->
    <div class="grid gap-6 md:grid-cols-3 mb-8">
      <router-link
        to="organizerView/events/create"
        class="flex items-center justify-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span class="text-sm font-medium text-gray-900">Create New Event</span>
      </router-link>

      <router-link
        to="/organizer/tickets"
        class="flex items-center justify-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span class="text-sm font-medium text-gray-900">Manage Tickets</span>
      </router-link>

      <router-link
        to="/organizer/analytics"
        class="flex items-center justify-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span class="text-sm font-medium text-gray-900">View Analytics</span>
      </router-link>
    </div>
  </div>
</template>
