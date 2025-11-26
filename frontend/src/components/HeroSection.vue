<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const numbers = ref({ events: 0, organizers: 0, ticketsSold: 0 });

onMounted(async () => {
  try {
    const numbersResponse = await axios.get('http://localhost:8000/api/numbers');
    numbers.value = numbersResponse.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <section class="relative overflow-hidden bg-white flex items-center justify-center min-h-screen">
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"
    ></div>

    <div class="container mx-auto px-4">
      <div class="relative pt-20 pb-24 md:pt-32 md:pb-32">
        <!-- Main Content -->
        <div class="grid gap-8 lg:grid-cols-1 lg:gap-16 items-center text-center">
          <!-- Left Column -->
          <div class="max-w-2xl mx-auto">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
            >
              Create Unforgettable
              <span class="text-blue-600">Events</span>
              With Ease
            </h1>
            <p class="mt-6 text-base sm:text-lg md:text-xl leading-8 text-gray-600">
              Your all-in-one platform for planning, managing, and hosting successful events. From
              registration to ticketing, we've got everything you need to make your event a success.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <RouterLink to="/login"
                class="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 inline-flex items-center justify-center"
              >
                Create Event
              </RouterLink>
              <RouterLink to="/publicEvents"
                class="w-full sm:w-auto rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-all hover:bg-blue-50 border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 inline-flex items-center justify-center"
              >
                Browse Events
              </RouterLink>
            </div>
            <!-- Stats -->
            <dl class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div class="flex flex-col">
                <dt class="text-sm font-medium leading-6 text-gray-600">Events Hosted</dt>
                <dd class="text-2xl font-bold leading-10 tracking-tight text-blue-600">{{ numbers.events }}+</dd>
              </div>
              <div class="flex flex-col">
                <dt class="text-sm font-medium leading-6 text-gray-600">Total Attendees</dt>
                <dd class="text-2xl font-bold leading-10 tracking-tight text-blue-600">{{ numbers.tickets }}+</dd>
              </div>
              <div class="flex flex-col">
                <dt class="text-sm font-medium leading-6 text-gray-600">Event Organizers</dt>
                <dd class="text-2xl font-bold leading-10 tracking-tight text-blue-600">{{ numbers.organizers }}+</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-grid-slate-100 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.6)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>
