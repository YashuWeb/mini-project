<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div v-if="cart.length > 0" class="space-y-4">
        <div
          v-for="(item, index) in cart"
          :key="item.id"
          class="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4"
        >
          <div class="md:w-1/4 h-32 md:h-auto bg-gray-200 rounded overflow-hidden">
            <img
              :src="item.event.media_url"
              :alt="item.event.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-2">{{ item.event.title }}</h3>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <i class="i-lucide-calendar w-4 h-4 mr-1"></i>
              Date: {{ item.event.date }}
            </div>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <i class="i-lucide-map-pin w-4 h-4 mr-1"></i>
              Location: {{ item.event.location }}
            </div>
          </div>
          <div class="md:w-1/6 flex flex-col justify-between items-end">
            <div class="text-right">
              <span class="text-xs text-gray-500">Total Price</span>
              <p class="font-bold text-primary">ETB {{ item.event.price }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="removeFromCart(item.event.id)"
                class="text-red-600 hover:text-red-800 mr-5 font-medium text-sm flex items-center"
              >
                <i class="i-lucide-trash-2 w-4 h-4 mr-1"></i>
                Remove
              </button>
              <button
                @click="openCheckoutModal(item.event)"
                class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <i class="i-lucide-shopping-cart w-12 h-12 mx-auto text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
        <p class="text-gray-500">Browse events and add tickets to your cart.</p>
        <div class="mt-8">
          <router-link
            to="/userview"
            class="mt-4 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Events
          </router-link>
        </div>
      </div>
    </div>

    <!-- Multi-Step Checkout Modal -->
    <Teleport to="body">
      <div
        v-if="selectedEvent"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-lg max-w-[600px] w-full max-h-[90vh] overflow-y-auto p-6 relative"
        >
          <!-- Header -->
          <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
            <h2 class="text-lg font-semibold leading-none tracking-tight">Purchase Tickets</h2>
            <p class="text-sm text-gray-500">Buy tickets for {{ selectedEvent.title }}.</p>
          </div>

          <!-- Step Indicator -->
          <div class="flex items-center justify-center space-x-2 mb-6">
            <template v-for="(s, index) in steps" :key="s">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="step === s ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'"
                >
                  {{ index + 1 }}
                </div>
                <div v-if="index < steps.length - 1" class="w-8 h-0.5 bg-gray-200 mx-1"></div>
              </div>
            </template>
          </div>

          <!-- Step Content -->
          <div class="py-2">
            <!-- Details Step -->
            <div v-if="step === 'details'" class="space-y-4">
              <div class="grid gap-2">
                <label for="first-name" class="text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="first-name"
                  v-model="formData.first_name"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-700 focus:border-blue-700"
                  placeholder="John"
                  disabled
                />
              </div>
              <div class="grid gap-2">
                <label for="last-name" class="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="last-name"
                  v-model="formData.last_name"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-700 focus:border-blue-700"
                  placeholder="Doe"
                  disabled
                />
              </div>
              <div class="grid gap-2">
                <label for="email" class="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  v-model="formData.email"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-700 focus:border-blue-700"
                  placeholder="john@example.com"
                  disabled
                />
              </div>
              <div class="grid gap-2">
                <label for="phone" class="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  v-model="phone"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-700 focus:border-blue-700"
                  placeholder="+251 912 345 678"
                />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-gray-700">Ticket Type</label>
                <select
                  v-model="ticketType"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-700 focus:border-blue-700"
                >
                  <option value="standard">Standard - ETB {{ selectedEvent.price }}</option>
                  <option value="vip">VIP - ETB {{ selectedEvent.price * 2 }}</option>
                  <option value="premium">Premium - ETB {{ selectedEvent.price * 3 }}</option>
                </select>
              </div>
            </div>

            <!-- Guests Step -->
            <div v-if="step === 'guests'" class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium">Guests</h3>
                  <p class="text-sm text-gray-500">Add information for additional guests</p>
                </div>
                <button
                  @click="addGuest"
                  class="border border-gray-300 bg-gray-50 hover:bg-gray-100 h-9 px-3 rounded-md text-sm flex items-center"
                >
                  <Plus class="h-4 w-4 mr-1" /> Add Guest
                </button>
              </div>
              <div v-if="guests.length === 0" class="text-center py-8 text-gray-500">
                <Users class="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No guests added yet</p>
                <p class="text-sm">Click "Add Guest" to purchase tickets for others</p>
              </div>
              <div v-else class="space-y-6">
                <div
                  v-for="(guest, index) in guests"
                  :key="guest.id"
                  class="relative border rounded-lg shadow-sm"
                >
                  <button
                    @click="removeGuest(guest.id)"
                    class="absolute top-2 right-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <X class="h-4 w-4" />
                  </button>
                  <div class="p-4 pb-2">
                    <h3 class="text-base font-semibold">Guest {{ index + 1 }}</h3>
                  </div>
                  <div class="p-4 pt-2 space-y-3">
                    <div class="grid gap-2">
                      <label
                        :for="`guest-name-${guest.id}`"
                        class="text-sm font-medium text-gray-700"
                        >Full Name</label
                      >
                      <input
                        :id="`guest-name-${guest.id}`"
                        v-model="guest.name"
                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-700 focus:border-blue-700"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div class="grid gap-2">
                      <label
                        :for="`guest-email-${guest.id}`"
                        class="text-sm font-medium text-gray-700"
                        >Email</label
                      >
                      <input
                        :id="`guest-email-${guest.id}`"
                        type="email"
                        v-model="guest.email"
                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-700 focus:border-blue-700"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div class="grid gap-2">
                      <label
                        :for="`guest-ticket-type-${guest.id}`"
                        class="text-sm font-medium text-gray-700"
                        >Ticket Type</label
                      >
                      <select
                        :id="`guest-ticket-type-${guest.id}`"
                        v-model="guest.ticketType"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-700 focus:border-blue-700"
                      >
                        <option value="standard">Standard - ETB {{ selectedEvent.price }}</option>
                        <option value="vip">VIP - ETB {{ selectedEvent.price * 2 }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Confirmation Step -->
            <div v-if="step === 'confirmation'" class="space-y-6">
              <div class="text-center">
                <Ticket class="h-12 w-12 mx-auto mb-3 text-blue-700" />
                <h3 class="text-xl font-medium">Order Summary</h3>
                <p class="text-sm text-gray-500">Please review your order details</p>
              </div>
              <div class="space-y-4">
                <div>
                  <h4 class="font-medium mb-2">Primary Ticket</h4>
                  <div class="bg-gray-50 p-3 rounded-md">
                    <p class="font-medium">{{ formData.first_name }} {{ formData.last_name }}</p>
                    <p class="text-sm text-gray-500">{{ formData.email }}</p>
                    <p class="text-sm text-gray-500">{{ phone }}</p>
                    <p class="text-sm text-gray-500">
                      Ticket Type: {{ capitalize(ticketType) }} (ETB
                      {{ getTicketPrice(ticketType) }})
                    </p>
                  </div>
                </div>
                <div v-if="guests.length > 0">
                  <h4 class="font-medium mb-2">Guest Tickets ({{ guests.length }})</h4>
                  <div class="space-y-2">
                    <div
                      v-for="(guest, index) in guests"
                      :key="guest.id"
                      class="bg-gray-50 p-3 rounded-md"
                    >
                      <p class="font-medium">{{ guest.name || `Guest ${index + 1}` }}</p>
                      <p class="text-sm text-gray-500">{{ guest.email || 'No email provided' }}</p>
                      <p class="text-sm text-gray-500">
                        Ticket Type: {{ capitalize(guest.ticketType) }} (ETB
                        {{ getTicketPrice(guest.ticketType) }})
                      </p>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-md">
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Total</span>
                    <span>ETB {{ totalPrice }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-between mt-6">
            <button
              v-if="step !== 'details'"
              @click="handleBack"
              class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
            >
              <ChevronLeft class="h-4 w-4 mr-1" /> Back
            </button>
            <div v-else></div>
            <button
              v-if="step !== 'confirmation'"
              @click="handleNext"
              class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              Next <ChevronRight class="h-4 w-4 ml-1" />
            </button>
            <button
              v-else
              @click="purchaseTicket"
              class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Complete Purchase
            </button>
          </div>

          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { Users, Ticket, ChevronLeft, ChevronRight, X, Plus } from 'lucide-vue-next'

// Capitalize function
const capitalize = (value) => {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const cart = ref([])
const token = localStorage.getItem('token')
const selectedEvent = ref(null)
const ticketType = ref('standard')
const steps = ['details', 'guests', 'confirmation']
const step = ref('details')
const phone = ref('')
const formData = reactive({
  first_name: '',
  last_name: '',
  email: '',
})
const guests = ref([])

// Fetch cart items from the API
const fetchCart = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/cart', {
      headers: { Authorization: `Bearer ${token}` },
    })
    cart.value = response.data.cart_items
    console.log('Cart items:', cart.value)
  } catch (error) {
    console.error('Error fetching cart:', error)
  }
}

onMounted(() => {
  fetchCart()
})

// Remove item from cart
const removeFromCart = async (eventId) => {
  try {
    await axios.delete('http://localhost:8000/api/user/cart/remove', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { event_id: eventId },
    })
    cart.value = cart.value.filter((item) => item.event.id !== eventId)
  } catch (error) {
    console.error('Error removing item from cart:', error)
  }
}

// Open checkout modal
const openCheckoutModal = (event) => {
  selectedEvent.value = event
  ticketType.value = 'standard'
  step.value = 'details'
  formData.first_name = user.firstName
  formData.last_name = user.lastName
  formData.email = user.email
  phone.value = ''
  guests.value = []
}

// Close modal
const closeModal = () => {
  selectedEvent.value = null
}

// Ticket price based on type
const getTicketPrice = (ticketType) => {
  if (!selectedEvent.value || !selectedEvent.value.price) return 0
  return Number(
    ticketType === 'standard'
      ? selectedEvent.value.price
      : ticketType === 'vip'
        ? selectedEvent.value.price * 2
        : 0,
  )
}

// Total price for all tickets (computed to ensure reactivity)
const totalPrice = computed(() => {
  let total = Number(getTicketPrice(ticketType.value)) || 0
  guests.value.forEach((guest) => {
    total += Number(getTicketPrice(guest.ticketType)) || 0
  })
  return Number.isFinite(total) ? total.toFixed(2) : '0.00'
})

// Guest management
const addGuest = () => {
  guests.value.push({
    id: `guest-${Date.now()}`,
    name: '',
    email: '',
    ticketType: 'standard',
  })
}

const removeGuest = (id) => {
  guests.value = guests.value.filter((guest) => guest.id !== id)
}

// Step navigation
const handleNext = () => {
  const currentIndex = steps.indexOf(step.value)
  if (currentIndex < steps.length - 1) {
    step.value = steps[currentIndex + 1]
  }
}

const handleBack = () => {
  const currentIndex = steps.indexOf(step.value)
  if (currentIndex > 0) {
    step.value = steps[currentIndex - 1]
  }
}
const user = JSON.parse(localStorage.getItem('user'))
console.log('User:', user)
// Purchase ticket
const purchaseTicket = async () => {
  const purchaseData = {
    event_id: selectedEvent.value.id,

    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    phone: phone.value,
    ticket_type: ticketType.value,
    recipients: [
      {
        type: 'user',
        id: user.id, // Assuming you have the user ID available
      },
      ...guests.value.map((guest) => ({
        type: 'guest',
        name: guest.name,
        email: guest.email,
      })),
    ],
    amount: parseFloat(totalPrice.value),
  }

  try {
  const response=  await axios.post('http://localhost:8000/api/user/initialize/payment', purchaseData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    // Handle the response based on what the backend returns
    if (response.data && typeof response.data === 'string' && response.data.startsWith('http')) {
      // If the response is directly the checkout URL as a string
      console.log('Redirecting to:', response.data);
      window.location.href = response.data;
    } else if (response.data && response.data.checkout_url) {
      // If the response is an object with a checkout_url property
      console.log('Redirecting to:', response.data.checkout_url);
      window.location.href = response.data.checkout_url;
    }  else if (response.data === 'Free ticket issued.') {
      // If it's a free event, show success message
      console.log('Free ticket issued successfully');
      await removeFromCart(selectedEvent.value.id);
      closeModal();
    } else {
      console.log('Purchase successful:', response.data);
      await removeFromCart(selectedEvent.value.id);
      closeModal();
    }
  
  } catch (error) {
    console.error('Error purchasing ticket:', error)
  }
}
</script>
