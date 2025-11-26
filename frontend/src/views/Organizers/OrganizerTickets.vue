<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading/Error State -->
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-if="error" class="text-center text-red-500">{{ error }}</div>

      <!-- Stats Overview -->
      <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Calendar class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Events</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalEvents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <Ticket class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Tickets Sold</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalTicketsSold }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <DollarSign class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">${{ totalRevenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Users class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Attendees</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalAttendees }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div v-if="!loading && !error" class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Events</label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by event name..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="selectedStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              v-model="selectedDateRange"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Time</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="next-month">Next Month</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div v-if="!loading && !error" class="space-y-6">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-xl font-bold text-gray-900">{{ event.name || 'Unnamed Event' }}</h3>
                  <span :class="getStatusBadgeClass(event.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ event.status || 'Unknown' }}
                  </span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-600">
                  <div class="flex items-center space-x-1">
                    <Calendar class="h-4 w-4" />
                    <span>{{ formatDate(event.date) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <Clock class="h-4 w-4" />
                    <span>{{ event.time }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <MapPin class="h-4 w-4" />
                    <span>{{ event.location }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-4 lg:mt-0 flex space-x-2">
                <button class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors">View Details</button>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">Manage</button>
              </div>
            </div>
          </div>

          <!-- Ticket Sales Summary -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ event.ticketsSold }}</p>
                <p class="text-sm text-gray-600">Tickets Sold</p>
                <div class="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    :style="{ width: `${event.totalTickets ? (event.ticketsSold / event.totalTickets) * 100 : 0}%` }"
                    class="bg-blue-600 h-2 rounded-full"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ event.attendees }} total</p>
              </div>

              <div class="text-center">
                <p class="text-2xl font-bold text-green-600">${{ event.revenue.toLocaleString() }}</p>
                <p class="text-sm text-gray-600">Revenue</p>
              </div>

              <div class="text-center">
                <p class="text-2xl font-bold text-purple-600">{{ event.attendees }}</p>
                <p class="text-sm text-gray-600">Expected Attendees</p>
              </div>
            </div>

            <!-- Ticket Breakdown -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Ticket Breakdown</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Ticket Type</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Sold</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Available</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="ticket in event.ticketTypes"
                      :key="ticket.id"
                      class="border-b border-gray-100"
                    >
                      <td class="py-3 px-4">{{ ticket.name || 'N/A' }}</td>
                      <td class="py-3 px-4">${{ ticket.price ? ticket.price.toFixed(2) : '0.00' }}</td>
                      <td class="py-3 px-4">{{ ticket.sold || 0 }}</td>
                      <td class="py-3 px-4">{{ ticket.available || 0 }}</td>
                      <td class="py-3 px-4 text-green-600">${{ ticket.price && ticket.sold ? (ticket.price * ticket.sold).toFixed(2) : '0.00' }}</td>
                    </tr>
                    <tr v-if="!event.ticketTypes.length" class="border-b border-gray-100">
                      <td colspan="5" class="py-3 px-4 text-center text-gray-500">No ticket types available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <p v-if="filteredEvents.length === 0" class="text-center text-gray-500">No events found.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Calendar, Ticket, DollarSign, Users, Search, Clock, MapPin } from 'lucide-vue-next';
import axios from 'axios';

const events = ref([]);
const totalEvents = ref(0);
const totalTicketsSold = ref(0);
const totalRevenue = ref(0);
const totalAttendees = ref(0);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDateRange = ref('');
const loading = ref(true);
const error = ref(null);
const token = localStorage.getItem('token');

onMounted(async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:8000/api/dashboard-summary', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    events.value = response.data.events || [];
    totalEvents.value = response.data.totalEvents || 0;
    totalTicketsSold.value = response.data.totalTicketsSold || 0;
    totalRevenue.value = response.data.totalRevenue || 0;
    totalAttendees.value = response.data.totalAttendees || 0;
    console.log('events',response.data)
  } catch (err) {
    error.value = 'Failed to load events. Please try again later.';
    console.error('Fetch error:', err);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const eventName = event.name || 'Unnamed Event';
    const matchesSearch = eventName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = selectedStatus.value ? (event.status || 'Unknown') === selectedStatus.value : true;

    const eventDate = new Date(event.date);
    const now = new Date();
    let matchesDateRange = true;

    if (selectedDateRange.value === 'this-week') {
      const day = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - ((day + 6) % 7));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      matchesDateRange = eventDate >= start && eventDate <= end;
    } else if (selectedDateRange.value === 'this-month') {
      matchesDateRange = eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    } else if (selectedDateRange.value === 'next-month') {
      const nextMonth = (now.getMonth() + 1) % 12;
      const year = nextMonth === 0 ? now.getFullYear() + 1 : now.getFullYear();
      matchesDateRange = eventDate.getMonth() === nextMonth && eventDate.getFullYear() === year;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });
});

function getStatusBadgeClass(status) {
  status = status || 'Unknown';
  switch (status) {
    case 'upcoming': return 'bg-blue-100 text-blue-800';
    case 'ongoing': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
</script>

<style scoped>
/* Tailwind is used directly in the template, so no additional styles needed */
</style>