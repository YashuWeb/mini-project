<script setup>
import { ref, computed , onMounted} from 'vue'
import Navbar from '@/components/Navbar.vue'
import { 
  Search, 
  Calendar,
  MapPin,
  Users,
  Filter,
  
} from 'lucide-vue-next'
import axios from 'axios'
// Filter and Search State
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedDate = ref('all')
const selectedPrice = ref('all')
const showFilters = ref(false)

// Categories
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'conference', name: 'Conferences' },
  { id: 'workshop', name: 'Workshops' },
  { id: 'concert', name: 'Concerts' },
  { id: 'exhibition', name: 'Exhibitions' },
  { id: 'sports', name: 'Sports' },
  { id: 'networking', name: 'Networking' }
]

// Date Filters
const dateFilters = [
  { id: 'all', name: 'Any Date' },
  { id: 'today', name: 'Today' },
  { id: 'tomorrow', name: 'Tomorrow' },
  { id: 'this-week', name: 'This Week' },
  { id: 'this-weekend', name: 'This Weekend' },
  { id: 'next-week', name: 'Next Week' }
]

// Price Filters
const priceFilters = [
  { id: 'all', name: 'Any Price' },
  { id: 'free', name: 'Free' },
  { id: 'paid', name: 'Paid' },
  { id: 'under-50', name: 'Under $50' },
  { id: 'under-100', name: 'Under $100' }
]

const publicEvents = ref([])

onMounted(async () =>{
 try {
  const response = await axios.get('http://localhost:8000/api/events')
  publicEvents.value = response.data.events
  console.log('Successfull',response.data)
 } catch (error) {
  console.log('Fetching error', error)
 }
  // console.log('Upcoming Events:', response.data)
})
// Computed filtered events 
const filteredEvents = computed(() => {
  return publicEvents.value.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'all' || event.category === selectedCategory.value
     const matchesRequestType = event.request_type === 'organizer'
    // Add more filter logic here
    return matchesSearch && matchesCategory && matchesRequestType
  })
})

// Featured events
// const featuredEvents = computed(() => {
//   return filteredEvents.value.filter(event => event.featured)
// })

// Format date
const formatDate = (date, time) => {
  return new Date(`${date} ${time}`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

// Format price
const formatPrice = (price) => {
  if (price === 0) return 'Free'
  return `${price}`
}
</script>

<template>
    <Navbar/>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Discover Amazing Events
        </h1>
        <p class="text-lg text-gray-600 mb-8">
          Find and attend events that match your interests
        </p>

        <!-- Search Bar -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search events by name or location..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <button
            @click="showFilters = !showFilters"
            class="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <Filter class="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        <!-- Filters -->
        <div
          v-show="showFilters"
          class="mt-4 p-4 bg-white border border-gray-200 rounded-lg"
        >
          <div class="grid gap-4 md:grid-cols-3">
            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                v-model="selectedCategory"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Date Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <select
                v-model="selectedDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option
                  v-for="filter in dateFilters"
                  :key="filter.id"
                  :value="filter.id"
                >
                  {{ filter.name }}
                </option>
              </select>
            </div>

            <!-- Price Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <select
                v-model="selectedPrice"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option
                  v-for="filter in priceFilters"
                  :key="filter.id"
                  :value="filter.id"
                >
                  {{ filter.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
    
     
      <!-- All Events -->
      <section >
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          All Events
        </h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <!-- Event Image -->
            <div class="aspect-video relative overflow-hidden">
              <img
                :src="event.media_url"
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <!-- Event Details -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ event.title }}
                </h3>
                <span class="text-blue-600 font-medium">
                  Price: {{ formatPrice(event.price) }} ETB
                </span>
              </div>

              <div class="space-y-2 text-sm text-gray-600 mb-4">
                <div class="flex items-center">
                  <Calendar class="h-4 w-4 mr-2" />
                  {{ formatDate(event.date, event.time) }}
                </div>
                <div class="flex items-center">
                  <MapPin class="h-4 w-4 mr-2" />
                  {{ event.venue }}, {{ event.location }}
                </div>
                <div class="flex items-center">
                  <Users class="h-4 w-4 mr-2" />
                  {{ event.attendees }} attendees
                </div>
              </div>

              <div class="flex items-center justify-between">
             
                <router-link
                  :to="`/publicEvents/${event.id}`"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredEvents.length === 0"
          class="text-center py-12"
        >
          <div class="text-gray-500">
            No events found matching your criteria
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
