<script setup>
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

// State for upcoming events
const upcomingEvents = ref([]);

// Helper function to get the full image URL
// const getImageUrl = (path) => {
//   const baseUrl = 'http://localhost:8000'; // Replace with your backend base URL
//   return path ? `${baseUrl}/${path}` : '/placeholder.svg?height=400&width=600';
// };

// Fetch upcoming events on component mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/events');
    console.log('API Response:', response.data.events); // Log the raw API response

    upcomingEvents.value = response.data.events;

    console.log('Final Upcoming Events:', upcomingEvents.value); // Log the final array
  } catch (error) {
    console.error('Error fetching events:', error);
  }
});

const filteredEvents = computed(() => {
  return upcomingEvents.value.filter(event => {
    const matchesRequestType = event.request_type === 'organizer';
    return matchesRequestType;
  }).slice(0, 4); // Limit to the first 4 events
});
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="flex justify-between items-center mb-12">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Upcoming Events</h2>
          <p class="mt-2 text-gray-600">Discover and join amazing events near you</p>
        </div>
        <RouterLink
          to="/publicEvents"
          class="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all events
          <ChevronRight class="ml-1 h-4 w-4" />
        </RouterLink>
      </div>

      <!-- Events Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
        >
          <!-- Event Image -->
          <div class="relative h-48 overflow-hidden">
            <div
              class="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {{ event.category }}
            </div>
            <img
              :src="event.media_url"
              :alt="event.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <!-- Event Content -->
          <div class="p-5">
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <Calendar class="h-4 w-4 mr-1" />
              {{ event.date }}
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ event.title }}
            </h3>

            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-500">
                <MapPin class="h-4 w-4 mr-1" />
                {{ event.location }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <Users class="h-4 w-4 mr-1" />
                {{ event.attendees }}
              </div>
            </div>

            <!-- Action Button -->
            <RouterLink
              :to="`/publicEvents/${event.id}`"
              class="w-full mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View Details
              <ChevronRight class="ml-1 h-4 w-4" />
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Mobile View All Button -->
      <div class="mt-8 text-center md:hidden">
        <RouterLink
          to="/publicEvents"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all events
          <ChevronRight class="ml-1 h-4 w-4" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
