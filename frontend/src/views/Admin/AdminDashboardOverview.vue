<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Users" icon="Users" :value="stats.totalUsers" color="blue" />
      <StatCard title="Active Events" :value="stats.activeEvents" icon="Calendar" color="green" />
      <StatCard
        title="Pending Requests"
        icon="Clock"
        color="yellow"
        :value="stats.pendingRequests"
      />
      <StatCard
        title="Total Revenue"
        icon="DollarSign"
        :value="formatCurrency(stats.totalRevenue)"
        color="purple"
      />
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          v-for="action in quickActions"
          :key="action.name"
          :to="action.to"
          class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <div :class="`w-10 h-10 rounded-full flex items-center justify-center ${action.bgColor}`">
            <component :is="action.icon" class="w-5 h-5 text-white" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">{{ action.name }}</h3>
            <p class="text-xs text-gray-500">{{ action.description }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Events Overview -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">Events Overview</h2>
        <router-link
          to="/AdminDashboard/event-monitoring"
          class="text-sm text-indigo-600 hover:text-indigo-800"
        >
          View All Events
        </router-link>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            v-for="(status, index) in eventStatusCounts"
            :key="index"
            class="bg-gray-50 rounded-lg p-4 text-center"
          >
            <h3 class="text-sm font-medium text-gray-500">{{ status.label }}</h3>
            <p class="text-2xl font-bold" :class="status.textColor">{{ status.count }}</p>
          </div>
        </div>

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
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="event in recentEvents" :key="event.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                  <div class="text-sm text-gray-500">{{ event.type }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ event.organizer }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ event.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': event.status === 'Live',
                      'bg-blue-100 text-blue-800': event.status === 'Upcoming',
                      'bg-gray-100 text-gray-800': event.status === 'Completed',
                      'bg-red-100 text-red-800': event.status === 'Canceled',
                    }"
                  >
                    {{ event.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ event.attendees }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckSquare, Bell, UserPlus } from 'lucide-vue-next'
import axios from 'axios'

import StatCard from '@/components/StatCard.vue'

// Sample data
const stats = ref({
  totalUsers: '',
  activeEvents: '',
  pendingRequests: '',
  totalRevenue: '',
})

// Reactive event status counts
const eventStatusCounts = ref([
  { label: 'Upcoming', count: 0, textColor: 'text-blue-600' },
  { label: 'Live', count: 0, textColor: 'text-green-600' },
  { label: 'Completed', count: 0, textColor: 'text-gray-600' },
  { label: 'Canceled', count: 0, textColor: 'text-red-600' },
]);


const recentEvents = ref([])

const token = localStorage.getItem('token')

//fetching admin dashboard overview

const fetchingOverView = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/admin-dashboard', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    stats.value.totalUsers = response.data.stats.totalUsers
    stats.value.activeEvents = response.data.stats.activeEvents
    stats.value.pendingRequests = response.data.stats.pendingRequests
    stats.value.totalRevenue = response.data.stats.totalRevenue
    recentEvents.value = response.data.recentEvents
    console.log('Overview fetched successfully:', response.data)

console.log('Overview fetched successfully:', response.data.eventStatusCounts)
    const { Upcoming, Live, Completed, Canceled } = response.data.eventStatusCounts;
      // Update counts
      eventStatusCounts.value = eventStatusCounts.value.map((status) => ({
      ...status,
      count: {
        Upcoming: Upcoming || 0,
        Live: Live || 0,
        Completed: Completed || 0,
        Canceled: Canceled || 0,
      }[status.label],
    }));

    
  } catch (error) {
    console.error('Error fetching overview:', error)
  }
}
fetchingOverView()
const quickActions = [
  {
    name: 'Approve Event Request',
    description: 'Review and approve pending event requests',
    to: '/AdminDashboard/event-requests',
    icon: CheckSquare,
    bgColor: 'bg-green-600',
  },
  {
    name: 'Assign Team',
    description: 'Assign teams to upcoming events',
    to: '/AdminDashboard/team-assignment',
    icon: UserPlus,
    bgColor: 'bg-blue-600',
  },
  {
    name: 'Send Announcement',
    description: 'Create and send system announcements',
    to: '/AdminDashboard/announcements',
    icon: Bell,
    bgColor: 'bg-purple-600',
  },
]





// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>
