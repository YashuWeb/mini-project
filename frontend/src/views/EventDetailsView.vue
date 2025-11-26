<template>
  <Navbar />
  <div v-if="loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-gray-600">Loading...</div>
  </div>
  <div v-else-if="event" class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Event Image and Quick Info Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Event Image -->
        <div class="w-full h-96 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg">
          <img
            :src="event.media_url || '/placeholder.svg?height=600&width=1200'"
            :alt="event.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Quick Info Section -->
        <div class="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <!-- Event Title and Status -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm text-gray-600">{{ event.category }}</span>
            </div>
            <h1 class="text-2xl md:text-4xl font-bold text-gray-900">{{ event.title }}</h1>
          </div>

          <!-- Quick Info Items -->
          <div class="space-y-4">
            <div class="flex items-center">
              <Calendar class="h-5 w-5 mr-2 text-blue-600" />
              <span class="text-sm md:text-base">{{ formatDate(event.date, event.time) }}</span>
            </div>

            <div class="flex items-center">
              <MapPin class="h-5 w-5 mr-2 text-red-600" />
              <span class="text-sm md:text-base"> {{ event.location }}</span>
            </div>

            <div class="flex items-center">
              <Users class="h-5 w-5 mr-2 text-green-600" />
              <span class="text-sm md:text-base">{{ event.attendees }} attendees</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
        <!-- Left Column (Main Content) -->
        <div class="lg:col-span-2 space-y-8">
          <!-- About This Event -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
            <div class="prose max-w-none text-gray-700 break-words">
              <p>{{ event.description }}</p>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Location</h2>
            <div class="aspect-video bg-gray-200 rounded-lg mb-4">
              <!-- Map would go here -->
              <div class="w-full h-full flex items-center justify-center text-gray-500">
                <EventMap :location="event.location" />
              </div>
            </div>
            <div class="flex items-center">
              <MapPin class="h-5 w-5 mr-2 text-red-600" />
              <span class="text-sm md:text-base">{{ event.location }}</span>
            </div>
          </div>
        </div>

        <!-- Right Column (Ticket & Related) -->
        <div class="space-y-8">
          <!-- Sticky Ticket Purchase -->
          <div class="lg:sticky lg:top-4">
            <!-- Ticket Info -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div class="mb-4">
                <div class="text-sm text-gray-500 mb-1">Price</div>
                <div class="text-3xl font-bold text-gray-900">{{ formatPrice(event.price) }}</div>
              </div>

              <button
                @click="handleAddToCart"
                class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors mb-4"
              >
                Add to Cart
              </button>

         
            </div>

            <!-- Similar Events -->
            <div v-if="similarEvents.length > 0" class="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Similar Events</h2>
              <div class="space-y-4">
                <div
                  v-for="similarEvent in similarEvents"
                  :key="similarEvent.id"
                  class="flex gap-3"
                >
                  <img
                    :src="similarEvent.image || '/placeholder.svg?height=80&width=80'"
                    :alt="similarEvent.title"
                    class="w-20 h-16 rounded-lg object-cover"
                  />
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900 line-clamp-1">{{ similarEvent.title }}</h3>
                    <p class="text-sm text-gray-600">
                      {{ formatDate(similarEvent.date, similarEvent.time, true) }}
                    </p>
                    <router-link
                      :to="`/publicEvents/${similarEvent.id}`"
                      class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Event
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Calendar, MapPin, Users, Share2 } from 'lucide-vue-next';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import EventMap from '@/components/EventMap.vue';

const route = useRoute();
const router = useRouter();
const eventId = route.params.id;

// Similar events
const similarEvents = ref([
  {
    id: 2,
    title: 'Digital Marketing Summit',
    date: '2024-04-01',
    time: '10:00 AM',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 3,
    title: 'AI Workshop Series',
    date: '2024-03-25',
    time: '09:30 AM',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 4,
    title: 'Blockchain Conference',
    date: '2024-04-15',
    time: '11:00 AM',
    image: '/placeholder.svg?height=80&width=80',
  },
]);

const event = ref(null);
const organizer = ref(null);
const loading = ref(true);

// In a real app, you would fetch the event data based on the ID
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/events/${eventId}`);
    event.value = response.data.event || null;
    organizer.value = response.data.organizer || null;
    console.log('Fetching event with ID:', eventId);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});

// Format date
const formatDate = (date, time, short = false) => {
  if (short) {
    return new Date(`${date} ${time}`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return new Date(`${date} ${time}`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

// Format price
const formatPrice = (price) => {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
  }).format(price);
};

// Handle Add to Cart button click
const handleAddToCart = () => {
  // Store the event ID in local storage
  localStorage.setItem('eventToAdd', eventId);
  // Redirect to the login page
  router.push('/login');
};

// Add event to cart
const addEventToCart = async (eventId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token not found');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:8000/api/user/cart/add',
      { event_id: eventId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Event added to cart:', response.data);
    // Optionally, you can show a success message to the user
  } catch (error) {
    console.error('Error adding event to cart:', error);
  }
};

// Check if an event needs to be added to the cart after login
onMounted(() => {
  const eventToAdd = localStorage.getItem('eventToAdd');
  if (eventToAdd) {
    addEventToCart(eventToAdd);
    localStorage.removeItem('eventToAdd');
  }
});
</script>
