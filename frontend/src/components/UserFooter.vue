<script setup>
import { ref } from 'vue'
import { Facebook, Twitter, Instagram, Linkedin, Calendar, ArrowRight } from 'lucide-vue-next'

const email = ref('')
const subscribeSuccess = ref(false)

const handleSubscribe = () => {
  if (email.value && email.value.includes('@')) {
    subscribeSuccess.value = true
    email.value = ''
    setTimeout(() => {
      subscribeSuccess.value = false
    }, 3000)
  }
}

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-900 text-white">
    <!-- Top Section with Centered Tagline -->
    <div class="container mx-auto px-4 py-8 border-b border-gray-800">
      <div class="text-center">
        <p class="text-gray-300 text-xl md:text-2xl font-light leading-relaxed">
          Streamlining every step of your event planning journey with ease and precision.
        </p>
      </div>
    </div>

    <!-- Middle Section with Brand, Navigation, Resources, and Social Media -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- 1. Brand/Logo Section -->
        <div class="col-span-1">
          <div class="flex items-center mb-4 justify-center md:justify-start">
            <img src="#" alt="EventMaster Logo" class="h-8 w-8 mr-2" />
            <span class="text-2xl font-bold">EthioEvents</span>
          </div>
          <div class="text-gray-400 text-sm space-y-2 text-center md:text-left">
            <p>
              Email:
              <a href="mailto:support@eventmaster.com" class="hover:text-white"
                >support@eventmaster.com</a
              >
            </p>
            <p>Phone: <a href="tel:+1234567890" class="hover:text-white">+1 234 567 890</a></p>
            <p>Location: 123 Event Street, Celebration City</p>
          </div>
        </div>

        <!-- 2. Navigation Links -->
        <div class="col-span-1">
          <h3 class="text-lg font-semibold mb-4 text-center md:text-left">Navigation</h3>
          <ul class="space-y-2 text-center md:text-left">
            <!-- <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Home</a>
            </li> -->
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Browse Events</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">About Us</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact Us</a>
            </li>
          </ul>
        </div>

        <!-- 3. Resources / Legal -->
        <div class="col-span-1">
          <h3 class="text-lg font-semibold mb-4 text-center md:text-left">Resources</h3>
          <ul class="space-y-2 text-center md:text-left">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors"
                >Privacy Policy</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors"
                >Terms of Service</a
              >
            </li>      <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors"
                >Refund Policy</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">FAQ / Help</a>
            </li>
          </ul>
        </div>

        <!-- 4. Social Media -->
        <div class="col-span-1">
          <h3 class="text-lg font-semibold mb-4 text-center md:text-left">Social Media</h3>
          <div class="flex flex-col space-y-2 justify-center md:justify-start items-center md:items-start max-w-xs mx-auto">
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook class="h-5 w-5 inline-block mr-2" /> Facebook
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram class="h-5 w-5 inline-block mr-2" /> Instagram
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter class="h-5 w-5 inline-block mr-2" /> Twitter
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin class="h-5 w-5 inline-block mr-2" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with Centered Newsletter -->
    <div class="container mx-auto px-4 py-8 border-t border-gray-800">
      <div class="max-w-md mx-auto">
        <h3 class="text-lg font-semibold mb-4 text-center">Newsletter</h3>
        <p class="text-gray-400 mb-4 text-center">
          Subscribe to receive updates on upcoming events.
        </p>
        <form @submit.prevent="handleSubscribe" class="space-y-2">
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="Your email address"
              class="w-full px-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
            <button
              type="submit"
              class="absolute right-1 top-1 bottom-1 bg-blue-600 text-white rounded-md px-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowRight class="h-4 w-4" />
            </button>
          </div>
          <p v-if="subscribeSuccess" class="text-green-400 text-sm text-center">
            Thanks for subscribing!
          </p>
        </form>
      </div>
    </div>

    <!-- Copyright Bar -->
    <div class="border-t border-gray-800">
      <div class="container mx-auto px-4 py-6">
        <p class="text-gray-500 text-sm text-center">
          &copy; {{ currentYear }} Poly Events. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
