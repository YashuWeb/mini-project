<template>
  <div v-if="loading" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-gray-600">Loading...</div>
  </div>
  <div v-else-if="event" class="min-h-screen bg-gray-50">
    <!-- Toast Notification -->
    <div
      v-if="showToast"
      :class="[
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center w-full max-w-md p-4 mb-4 text-gray-500 bg-white rounded-lg shadow',
        toastType === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
      ]"
      role="alert"
    >
      <div :class="[
        'inline-flex items-center justify-center flex-shrink-0 w-8 h-8',
        toastType === 'success' ? 'text-green-500' : 'text-red-500'
      ]">
        <svg v-if="toastType === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="ml-3 text-sm font-normal">
        {{ toastMessage }}
      </div>
      <button
        type="button"
        @click="showToast = false"
        :class="[
          'ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg',
          'focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8'
        ]"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6-6"/>
        </svg>
      </button>
    </div>

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
            <h2 class="text-xl font-bold text-gray-900 mb-10">Location</h2>
            <div class="aspect-video bg-gray-200 rounded-lg mb-4">
              <!-- Map would go here -->
              <div class="w-full h-full flex items-center justify-center text-gray-500">
                <EventMap :location="event.location" />
              </div>
            </div>
            <div class="flex items-center">
              <MapPin class="h-5 w-5 mr-2 mt-4 text-red-600" />
              <span class="text-sm mt-4 md:text-base">{{ event.location }}</span>
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
                @click="handleAddToCart(event.id)"
                class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors mb-4"
              >
                Add to Cart
              </button>
            </div>

            <!-- Similar Events -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Similar Events</h2>
              <div class="space-y-4">
                <div
                  v-for="similarEvent in similarEvents"
                  :key="similarEvent.id"
                  class="flex items-center gap-4"
                >
                  <div class="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      :src="similarEvent.image"
                      :alt="similarEvent.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">{{ similarEvent.title }}</h3>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar class="h-4 w-4" />
                      <span>{{ formatDate(similarEvent.date, similarEvent.time, true) }}</span>
                    </div>
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
import { Calendar, MapPin, Users } from 'lucide-vue-next';
import axios from 'axios';
import EventMap from '@/components/EventMap.vue';

// Toast notification state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success'); // 'success' or 'error'

// Show toast message function
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
};

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
const handleAddToCart = async (eventId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // If user is not logged in, redirect to login with event ID
    localStorage.setItem('eventToAdd', eventId);
    router.push('/login');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:8000/api/user/cart/add',
      { event_id: eventId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Added to cart:', response.data);
    showToastMessage('Event added to cart successfully!', 'success');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error('Conflict error:', error.response.data.message);
      showToastMessage(error.response.data.message || 'Event is already in the cart.', 'error');
    } else {
      console.error('Error adding to cart:', error);
      showToastMessage('Failed to add to cart. Please try again.', 'error');
    }
  }
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
    showToastMessage('Event added to cart successfully!', 'success');
  } catch (error) {
    console.error('Error adding event to cart:', error);
    showToastMessage('Failed to add to cart. Please try again.', 'error');
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
