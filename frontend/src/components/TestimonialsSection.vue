<script setup>
import { Star } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import profile from '@/assets/Images/profile.jpg'

const testimonials = ref([])
const numbers = ref({ events: 0, organizers: 0, ticketsSold: 0 })

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/testimonial')
    const { users, feedback } = response.data
    testimonials.value = feedback.map(item => ({
      ...item,
      user: users[item.user_id]
    }))
  } catch (error) {
    console.error('Error fetching testimonials:', error)
  }

  try {
    const numbersResponse = await axios.get('http://localhost:8000/api/numbers')
    numbers.value = numbersResponse.data
  } catch (error) {
    console.error('Error fetching numbers:', error)
  }
})

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
</script>
<template>
  <section class="py-16 bg-gradient-to-b from-white to-blue-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
        <p class="mt-2 text-gray-600">Trusted by thousands of event organizers worldwide</p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
        >
          <!-- Rating -->
          <div class="flex mb-4">
            <Star
              v-for="i in testimonial.rating"
              :key="i"
              class="w-5 h-5 text-yellow-500 fill-current"
            />
          </div>

          <!-- Content -->
          <blockquote class="text-gray-600 mb-6 leading-relaxed flex-grow">
            "{{ truncateText(testimonial.content, 50) }}"
          </blockquote>

          <!-- Author -->
          <div class="flex items-center mt-auto">
            <img
              :src="profile"
              :alt="testimonial.user.firstName + ' ' + testimonial.user.lastName"
              class="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <div class="font-semibold text-gray-900">{{ testimonial.user.firstName }} {{ testimonial.user.lastName }}</div>
              <div class="text-sm text-gray-600">
                {{ testimonial.position }} • {{ testimonial.company }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="mt-16 text-center">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="space-y-2">
            <div class="text-3xl font-bold text-blue-600">{{ numbers.events }}+</div>
            <div class="text-sm text-gray-600">Events Hosted</div>
          </div>
          <div class="space-y-2">
            <div class="text-3xl font-bold text-blue-600">{{ numbers.organizers }}+</div>
            <div class="text-sm text-gray-600">Organizers</div>
          </div>
          <div class="space-y-2">
            <div class="text-3xl font-bold text-blue-600">{{ numbers.ticketsSold }}+</div>
            <div class="text-sm text-gray-600">Tickets Sold</div>
          </div>
          <div class="space-y-2">
            <div class="text-3xl font-bold text-blue-600">4.9</div>
            <div class="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shadow-lg {
  box-shadow:
    0 10px 30px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.shadow-xl {
  box-shadow:
    0 20px 40px -4px rgba(0, 0, 0, 0.1),
    0 8px 12px -4px rgba(0, 0, 0, 0.05);
}
</style>
