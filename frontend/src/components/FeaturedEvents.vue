<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight, Clock, Ticket } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import axios from 'axios'

// Default image import
import defaultEventImage from '@/assets/Images/tech.jpg'

const featuredEvents = ref([])
const currentIndex = ref(0)
const direction = ref('slide-right')
let autoplayInterval = null

// Fetch featured events from backend
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/events')
    featuredEvents.value = response.data.featuredEvents || []
    startAutoplay()
  } catch (error) {
    console.error(error)
  }
})

onBeforeUnmount(() => stopAutoplay())

const startAutoplay = () => {
  autoplayInterval = setInterval(next, 5000)
}

const stopAutoplay = () => clearInterval(autoplayInterval)

const next = () => {
  if (!featuredEvents.value.length) return
  direction.value = 'slide-right'
  currentIndex.value = (currentIndex.value + 1) % featuredEvents.value.length
}

const prev = () => {
  if (!featuredEvents.value.length) return
  direction.value = 'slide-left'
  currentIndex.value = (currentIndex.value - 1 + featuredEvents.value.length) % featuredEvents.value.length
}

const goToSlide = (index) => {
  direction.value = index > currentIndex.value ? 'slide-right' : 'slide-left'
  currentIndex.value = index
  stopAutoplay()
  startAutoplay()
}

const currentEvent = computed(() => featuredEvents.value[currentIndex.value])
</script>

<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">

      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">Featured Events</h2>
        <p class="mt-2 text-gray-600">Don't miss out on our highlighted events of the month</p>
      </div>

      <div class="relative" v-if="featuredEvents.length">
        <div
          class="relative overflow-hidden"
          @mouseenter="stopAutoplay"
          @mouseleave="startAutoplay"
        >
          <Transition :name="direction" mode="out-in">
            <div
              v-if="currentEvent"
              :key="currentEvent.id || currentIndex"
              class="bg-gray-50 rounded-2xl overflow-hidden border border-blue-100 shadow-lg"
            >
              <div class="grid lg:grid-cols-2 gap-8">

                <div class="relative h-[200px] lg:h-[500px]">
                  <div class="absolute top-4 left-4 z-10 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {{ currentEvent.category }}
                  </div>
                  <img
                    :src="currentEvent.image || defaultEventImage"
                    :alt="currentEvent.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div class="p-8">
                  <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ currentEvent.title }}</h3>
                  <p class="text-gray-600 mb-6 leading-relaxed">{{ currentEvent.description }}</p>

                  <div class="space-y-4 mb-8 text-gray-600">
                    <div class="flex items-center"><Calendar class="h-5 w-5 mr-3 text-blue-600" />{{ currentEvent.date }}</div>
                    <div class="flex items-center"><Clock class="h-5 w-5 mr-3 text-blue-600" />{{ currentEvent.time }}</div>
                    <div class="flex items-center"><MapPin class="h-5 w-5 mr-3 text-blue-600" />{{ currentEvent.location }}</div>
                    <div class="flex items-center"><Users class="h-5 w-5 mr-3 text-blue-600" />{{ currentEvent.attendees }} Attendees Expected</div>
                    <div class="flex items-center"><Ticket class="h-5 w-5 mr-3 text-blue-600" />Starting from {{ currentEvent.price }}</div>
                  </div>

                  <RouterLink
                    to="/login"
                    class="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-all inline-flex items-center justify-center"
                  >
                    Register Now
                  </RouterLink>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors">
          <ChevronLeft class="h-6 w-6" />
        </button>
        <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors">
          <ChevronRight class="h-6 w-6" />
        </button>

        <!-- FIXED INDICATORS -->
        <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            v-for="(_, index) in featuredEvents"
            :key="index"
            @click="goToSlide(index)"
            :class="[
              'w-2.5 h-2.5 rounded-full transition-all duration-200',
              currentIndex === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
            ]"
          />
        </div>
      </div>

      <div v-else class="text-center text-gray-500">
        No featured events available right now.
      </div>

    </div>
  </section>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-right-enter-from { transform: translateX(100%); opacity: 0; }
.slide-right-leave-to { transform: translateX(-100%); opacity: 0; }
.slide-left-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-left-leave-to { transform: translateX(100%); opacity: 0; }

.relative.overflow-hidden { min-height: 300px; }
@media (min-width: 1024px) { .relative.overflow-hidden { min-height: 500px; } }
</style>
