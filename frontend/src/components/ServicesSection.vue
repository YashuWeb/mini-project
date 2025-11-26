<script setup>
import { 
  Ticket, 
  Calendar, 
  Users, 
  BarChart, 
  CreditCard,
  MessageSquare,
  Settings,
  Shield,
  Megaphone
} from 'lucide-vue-next'

const services = [
  {
    id: 1,
    title: 'Ticketing Solutions',
    description: 'Complete ticketing system for seamless event management',
    icon: Ticket,
    features: [
      'Multiple ticket types and pricing tiers',
      'QR code-based ticket validation',
      'Automated ticket distribution',
      'Real-time sales tracking',
      'Secure payment processing'
    ],
    color: 'blue'
  },
  {
    id: 2,
    title: 'Event Organization',
    description: 'End-to-end event planning and management services',
    icon: Calendar,
    features: [
      'Professional event planning team',
      'Venue selection assistance',
      'Vendor coordination',
      'Custom event branding',
      'On-site event management'
    ],
    color: 'purple'
  },
  {
    id: 3,
    title: 'Event Hosting Platform',
    description: 'Powerful platform for organizers to create and manage events',
    icon: Settings,
    features: [
      'Easy event creation and setup',
      'Customizable event pages',
      'Attendee management tools',
      'Marketing and promotion tools',
      'Mobile-friendly interface'
    ],
    color: 'green'
  },
  {
    id: 4,
    title: 'Analytics & Insights',
    description: 'Comprehensive data analysis for event optimization',
    icon: BarChart,
    features: [
      'Real-time sales analytics',
      'Attendee demographics',
      'Performance metrics',
      'Revenue tracking',
      'Custom reporting'
    ],
    color: 'orange'
  }
]

const additionalFeatures = [
  {
    id: 1,
    title: 'Secure Payments',
    description: 'Integrated payment processing with multiple payment options',
    icon: CreditCard
  },
  {
    id: 2,
    title: 'Marketing Tools',
    description: 'Built-in promotion and social sharing capabilities',
    icon: Megaphone
  },
  {
    id: 3,
    title: 'Customer Support',
    description: '24/7 support for organizers and attendees',
    icon: MessageSquare
  },
  {
    id: 4,
    title: 'Data Security',
    description: 'Enterprise-grade security for all events and transactions',
    icon: Shield
  }
]

const serviceTypes = [
  {
    title: 'For Event Organizers',
    features: [
      'Complete ticketing system',
      'Real-time analytics dashboard',
      'Marketing tools and promotion',
      'Attendee management',
      'Revenue tracking'
    ]
  },
  {
    title: 'For Event Planners',
    features: [
      'Professional planning services',
      'Vendor coordination',
      'Budget management',
      'On-site management',
      'Post-event reporting'
    ]
  },
  {
    title: 'For Attendees',
    features: [
      'Easy ticket purchasing',
      'Mobile tickets with QR codes',
      'Event discovery',
      'Secure payments',
      'Event updates and notifications'
    ]
  }
]
</script>

<template>
  <section class="py-20 bg-gradient-to-b from-white to-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Comprehensive Event Management Solutions
        </h2>
        <p class="text-lg text-gray-600">
          Everything you need to create, manage, and scale successful events
        </p>
      </div>

      <!-- Main Services Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
        <div
          v-for="service in services"
          :key="service.id"
          class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
        >
          <!-- Service Header -->
          <div class="flex items-start mb-4">
            <div 
              :class="`p-3 rounded-lg bg-${service.color}-50 text-${service.color}-600`"
            >
              <component :is="service.icon" class="h-6 w-6" />
            </div>
          </div>

          <!-- Service Title & Description -->
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ service.title }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{ service.description }}
          </p>

          <!-- Features List -->
          <ul class="space-y-2">
            <li
              v-for="feature in service.features"
              :key="feature"
              class="flex items-center text-sm text-gray-600"
            >
              <svg
                class="h-4 w-4 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Service Types -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            Tailored Solutions for Everyone
          </h3>
          <p class="text-gray-600">
            Specialized features designed for different types of users
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <div
            v-for="type in serviceTypes"
            :key="type.title"
            class="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h4 class="text-lg font-semibold text-gray-900 mb-4">
              {{ type.title }}
            </h4>
            <ul class="space-y-3">
              <li
                v-for="feature in type.features"
                :key="feature"
                class="flex items-start text-gray-600"
              >
                <svg
                  class="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Additional Features -->
      <div>
        <div class="text-center mb-12">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            Additional Platform Features
          </h3>
          <p class="text-gray-600">
            Enhance your event management experience with these powerful tools
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-4">
          <div
            v-for="feature in additionalFeatures"
            :key="feature.id"
            class="text-center"
          >
            <div class="inline-flex p-3 rounded-full bg-blue-50 text-blue-600 mb-4">
              <component :is="feature.icon" class="h-6 w-6" />
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">
              {{ feature.title }}
            </h4>
            <p class="text-gray-600">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-16 text-center">
        <div class="inline-flex items-center p-1 rounded-lg bg-gray-100">
          <span class="px-3 py-1">Ready to start organizing events?</span>
          <router-link
            to="/signup"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started Free
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add any custom styles here */
</style>