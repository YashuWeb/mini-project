<script setup>
/*
  Safe, defensive Vue 3 component for events / tickets / requests.
  - Guards against undefined data returned from backend
  - No undefined refs used in template
  - Defensive helpers for images & formatting
  - Toast + PDF download + add-to-cart implemented with safe checks
*/

import { ref, computed, onMounted, nextTick } from 'vue'
import { Calendar, MapPin } from 'lucide-vue-next'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import axios from 'axios'

// ---------- Basic state ----------
const unreadMessages = ref(0)
const activeTab = ref('events')
const searchQuery = ref('')
const showRequestForm = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const newRequirement = ref('')
const token = localStorage.getItem('token') || ''

const events = ref([])
const myRequests = ref([])
const myTickets = ref([])

// safe user parse
let user = {}
try {
  user = JSON.parse(localStorage.getItem('user')) || {}
} catch {
  user = {}
}

// ---------- Request form (kept simple) ----------
const eventRequest = ref({
  title: '',
  type: '',
  date: '',
  guests: '',
  location: '',
  budget: '',
  description: '',
  requirements: []
})

const errorMessage = ref({
  title: '',
  type: '',
  date: '',
  guests: '',
  location: '',
  budget: '',
  description: '',
  requirements: ''
})

const clearError = (field) => { if (field) errorMessage.value[field] = '' }
const charCount = computed(() => (eventRequest.value.description || '').length)

const addRequirement = () => {
  if (!newRequirement.value || !newRequirement.value.trim()) return
  eventRequest.value.requirements.push(newRequirement.value.trim())
  newRequirement.value = ''
}
const removeRequirement = (i) => eventRequest.value.requirements.splice(i, 1)

// ---------- Simple validation ----------
const validateForm = () => {
  const req = eventRequest.value
  // reset
  for (const k of Object.keys(errorMessage.value)) errorMessage.value[k] = ''
  if (!req.title) { errorMessage.value.title = 'Title required'; return false }
  if (!req.type) { errorMessage.value.type = 'Type required'; return false }
  if (!req.date) { errorMessage.value.date = 'Date required'; return false }
  if (!req.guests) { errorMessage.value.guests = 'Guests required'; return false }
  if (!req.location) { errorMessage.value.location = 'Location required'; return false }
  if (!req.budget) { errorMessage.value.budget = 'Budget required'; return false }
  if (!req.description || req.description.length < 200) { errorMessage.value.description = 'Min 200 chars'; return false }
  if (!req.requirements.length) { errorMessage.value.requirements = 'Add at least one requirement'; return false }
  return true
}

// ---------- Toast ----------
const showToastMessage = (msg, type = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

// ---------- API calls ----------
const apiHeaders = () => ({ headers: { Authorization: token ? `Bearer ${token}` : '' } })

const fetchEvents = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/events', apiHeaders())
    events.value = res?.data?.events ?? res?.data ?? []
  } catch (err) {
    console.error('fetchEvents error', err)
    showToastMessage('Failed to load events', 'error')
  }
}

const fetchRequests = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/user/event/request', apiHeaders())
    myRequests.value = res?.data ?? []
  } catch (err) {
    console.error('fetchRequests error', err)
    showToastMessage('Failed to load requests', 'error')
  }
}

const fetchTickets = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/user/tickets', apiHeaders())
    myTickets.value = Array.isArray(res?.data) ? res.data : (res?.data?.tickets ?? [])
  } catch (err) {
    console.error('fetchTickets error', err)
    showToastMessage('Failed to load tickets', 'error')
  }
}

onMounted(() => {
  fetchEvents()
  fetchRequests()
  fetchTickets()
})

// ---------- Helpers (safe) ----------
const safeString = (v) => (v === null || v === undefined) ? '' : String(v)

const imageForEvent = (ev) => {
  if (!ev) return '/placeholder.png'
  return ev.media_url || ev.image || '/placeholder.png'
}
const imageForTicket = (t) => {
  if (!t || !t.event) return '/placeholder.png'
  return t.event.image || t.event.media_url || '/placeholder.png'
}

const formatDate = (d) => {
  try { return new Date(d).toLocaleDateString() } catch { return safeString(d) }
}

// ---------- Computed filtered events ----------
const filteredEvents = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim()
  if (!q) return events.value || []
  return (events.value || []).filter((e) => {
    const title = (e?.title || '').toLowerCase()
    const loc = (e?.location || '').toLowerCase()
    return title.includes(q) || loc.includes(q)
  })
})

// ---------- Add to cart ----------
const addToCart = async (eventId) => {
  if (!eventId) { showToastMessage('Invalid event', 'error'); return }
  try {
    await axios.post('http://localhost:8000/api/user/cart/add', { event_id: eventId }, apiHeaders())
    showToastMessage('Event added to cart', 'success')
  } catch (err) {
    console.error('addToCart', err)
    const msg = err?.response?.data?.message || 'Failed to add to cart'
    showToastMessage(msg, 'error')
  }
}

// ---------- PDF / QR ----------
const generateQRCode = async (text) => {
  try { return await QRCode.toDataURL(text, { width: 150, margin: 2 }) }
  catch (err) { console.error('QR error', err); return null }
}

const downloadTicket = async (ticket) => {
  if (!ticket) { showToastMessage('Invalid ticket', 'error'); return }
  try {
    const doc = new jsPDF({ unit: 'mm', format: [210, 150] })
    doc.setFontSize(18)
    doc.text('EVENT TICKET', 105, 15, { align: 'center' })
    doc.setFontSize(14)
    doc.text(safeString(ticket?.event?.title || 'Event'), 105, 28, { align: 'center' })

    doc.setFontSize(10)
    doc.text(`Date: ${formatDate(ticket?.event?.date)}`, 20, 45)
    doc.text(`Location: ${safeString(ticket?.event?.location)}`, 20, 52)
    doc.text(`Order ID: #${ticket?.id}`, 20, 59)

    const qr = await generateQRCode(`TicketID:${ticket?.id}\nEvent:${ticket?.event?.title}`)
    if (qr) doc.addImage(qr, 'PNG', 75, 65, 50, 50)
    doc.save(`Ticket_${ticket?.id || Date.now()}.pdf`)
  } catch (err) {
    console.error('downloadTicket', err)
    showToastMessage('Failed to create PDF', 'error')
  }
}

// ---------- Submit request ----------
const submitEventRequest = async () => {
  if (!validateForm()) return
  try {
    const payload = {
      title: eventRequest.value.title,
      category: eventRequest.value.type,
      due_date: eventRequest.value.date,
      location: eventRequest.value.location,
      budget: eventRequest.value.budget,
      description: eventRequest.value.description,
      requirements: eventRequest.value.requirements,
      attendees: eventRequest.value.guests
    }
    await axios.post('http://localhost:8000/api/user/event/request', payload, apiHeaders())
    eventRequest.value = { title: '', type: '', date: '', guests: '', location: '', budget: '', description: '', requirements: [] }
    showRequestForm.value = false
    showToastMessage('Request submitted', 'success')
    fetchRequests()
    activeTab.value = 'requests'
  } catch (err) {
    console.error('submitEventRequest', err)
    showToastMessage('Failed to submit request', 'error')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Tabs -->
      <div class="border-b mb-6">
        <nav class="flex space-x-8">
          <button @click="activeTab = 'events'"
                  :class="[ activeTab === 'events' ? 'text-blue-600 border-blue-600' : 'text-gray-500', 'py-4 px-1 border-b-2 font-medium text-sm' ]">
            Browse Events
          </button>

          <button @click="activeTab = 'myTickets'"
                  :class="[ activeTab === 'myTickets' ? 'text-blue-600 border-blue-600' : 'text-gray-500', 'py-4 px-1 border-b-2 font-medium text-sm' ]">
            My Tickets
          </button>

          <button @click="activeTab = 'requests'"
                  :class="[ activeTab === 'requests' ? 'text-blue-600 border-blue-600' : 'text-gray-500', 'py-4 px-1 border-b-2 font-medium text-sm' ]">
            My Requests
            <span v-if="unreadMessages > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {{ unreadMessages }}
            </span>
          </button>
        </nav>
      </div>

      <!-- EVENTS -->
      <section v-if="activeTab === 'events'">
        <div class="flex justify-between mb-6">
          <h2 class="text-xl font-semibold">Browse Events</h2>
          <input v-model="searchQuery" placeholder="Search events..." class="border px-3 py-2 rounded" />
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="ev in filteredEvents" :key="ev?.id" class="bg-white rounded shadow hover:shadow-md overflow-hidden">
            <div class="h-48 bg-gray-200">
              <img :src="imageForEvent(ev)" :alt="ev?.title" class="w-full h-full object-cover" />
            </div>

            <div class="p-4">
              <div class="flex items-center text-sm text-gray-600">
                <Calendar class="w-4 h-4 mr-2 text-blue-600" />
                <span>{{ formatDate(ev?.date) }}</span>
              </div>

              <h3 class="font-bold mt-3 text-lg">{{ ev?.title || 'Untitled Event' }}</h3>

              <div class="flex items-center mt-3 text-sm text-gray-700">
                <MapPin class="w-4 h-4 mr-2 text-red-600" />
                <span>{{ ev?.location || 'Location TBA' }}</span>
              </div>

              <div class="flex justify-between items-center mt-4">
                <div class="font-bold text-blue-600">ETB {{ ev?.price ?? '0' }}</div>
                <div class="flex gap-2">
                  <button @click="addToCart(ev?.id)" class="bg-blue-600 text-white px-3 py-1.5 rounded">Add to Cart</button>
                  <router-link :to="`/userview/event-details/${ev?.id || ''}`" class="bg-gray-100 px-3 py-1.5 rounded">View</router-link>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-if="(filteredEvents || []).length === 0" class="text-center py-12 text-gray-500">No events found</div>
      </section>

      <!-- TICKETS -->
      <section v-if="activeTab === 'myTickets'">
        <h2 class="text-xl font-semibold mb-6">My Tickets</h2>

        <div v-if="(myTickets || []).length > 0" class="space-y-4">
          <div v-for="t in myTickets" :key="t?.id" class="bg-white rounded shadow p-4 flex items-center gap-4">
            <img :src="imageForTicket(t)" alt="ticket image" class="w-40 h-28 object-cover rounded" />
            <div class="flex-1">
              <h3 class="font-bold">{{ t?.event?.title || 'Event' }}</h3>
              <p class="text-gray-500">{{ t?.event?.location || '' }}</p>
              <p class="text-gray-500">Order ID: #{{ t?.id }}</p>
            </div>
            <div>
              <button @click="downloadTicket(t)" class="text-blue-600">Download</button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">No tickets found</div>
      </section>

      <!-- REQUESTS: small listing -->
      <section v-if="activeTab === 'requests'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">My Requests</h2>
          <button @click="showRequestForm = true" class="bg-blue-600 text-white px-4 py-2 rounded">New Request</button>
        </div>

        <div v-if="(myRequests || []).length > 0" class="space-y-4">
          <div v-for="r in myRequests" :key="r?.id" class="bg-white rounded shadow p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold">{{ r?.title || 'Request' }}</h3>
                <p class="text-sm text-gray-500">Preferred Date: {{ formatDate(r?.date) }}</p>
              </div>
              <div>
                <span class="px-2 py-1 rounded text-xs font-medium" :class="{
                  'bg-yellow-100 text-yellow-800': r?.approval_status === 'Pending',
                  'bg-green-100 text-green-800': r?.approval_status === 'approved',
                  'bg-red-100 text-red-800': r?.approval_status && r?.approval_status !== 'approved' && r?.approval_status !== 'Pending'
                }">{{ r?.approval_status || 'Unknown' }}</span>
              </div>
            </div>
            <p class="mt-3 text-gray-700">{{ r?.description?.slice(0, 200) || '' }}{{ r?.description && r.description.length > 200 ? '...' : '' }}</p>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">No requests yet</div>
      </section>
    </main>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" :class="[
          'fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded shadow z-50 max-w-md',
          toastType === 'success' ? 'bg-green-50 border-l-4 border-green-600 text-green-800' : 'bg-red-50 border-l-4 border-red-600 text-red-800'
        ]">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<style>
.toast-enter-active, .toast-leave-active { transition: all .2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
