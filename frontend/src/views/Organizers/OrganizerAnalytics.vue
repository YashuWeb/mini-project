<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Registrations -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Registrations</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatNumber(metrics.totalRegistrations) }}</p>
            </div>
            <Users class="h-8 w-8 text-blue-500" />
          </div>
          
        </div>
        <!-- Total Revenue -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">${{ formatNumber(metrics.totalRevenue) }}</p>
            </div>
            <DollarSign class="h-8 w-8 text-green-500" />
          </div>
         
        </div>
       
        <!-- Events Organized -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Events Organized</p>
              <p class="text-2xl font-bold text-gray-900">{{ metrics.totalEvents }}</p>
            </div>
            <TrendingUp class="h-8 w-8 text-purple-500" />
          </div>
          
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Registration Trends Over Time -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Registration Trends Over Time</h3>
            <p class="text-sm text-gray-600">Monthly registration & revenue</p>
          </div>
          <div class="h-80">
            <canvas ref="registrationChart"></canvas>
          </div>
        </div>
        <!-- Revenue Trends Over Time -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Revenue Trends Over Time</h3>
            <p class="text-sm text-gray-600">Monthly revenue from ticket sales</p>
          </div>
          <div class="h-80">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Top Performing Events & Satisfaction -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Top Performing Events -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Top Performing Events</h3>
            <p class="text-sm text-gray-600">Ranked by attendance & revenue</p>
          </div>
          <div class="space-y-4">
            <div
              v-for="(e, idx) in topEvents"
              :key="idx"
              class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div class="flex-1">
                <h4 class="font-medium text-sm">{{ e.name }}</h4>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <Users class="h-4 w-4 mr-1" /> {{ e.attendees }}
                  <Star class="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400"/> {{ e.rating }}
                  <DollarSign class="h-4 w-4 mr-1"/> ${{ formatNumber(e.revenue) }}
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full"
                    :style="{ width: `${(e.attendees/maxAttendees)*100}%` }"
                  ></div>
                </div>
                <span :class="getEventStatusClass(e.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ e.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- Overall Satisfaction -->
        
      </div>

      <!-- Event Categories Performance -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Performance by Category</h3>
          <p class="text-sm text-gray-600">Compare your event types</p>
        </div>
        <div class="h-80">
          <canvas ref="categoryChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import axios from 'axios'
import {
  BarChart3,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-vue-next'

// Refs for chart elements
const registrationChart = ref(null)
const revenueChart = ref(null)
const satisfactionChart = ref(null)
const categoryChart = ref(null)

// Data refs
const selectedPeriod = ref('last-6-months')
const currentEvent = ref({ name: 'Your Events' })

const metrics = ref({
  totalRegistrations: 0,
  registrationGrowth: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
  avgSatisfaction: 0,
  satisfactionChange: 0,
  totalEvents: 0,
  activeEvents: 0
})

const registrationData = ref([])
const topEvents = ref([])
const satisfactionData = ref([])
const satisfactionColors = ref([])
const categoryData = ref([])
const maxAttendees = ref(1)

const token = localStorage.getItem('token')

// Chart instances
let registrationChartInstance = null
let revenueChartInstance = null
let satisfactionChartInstance = null
let categoryChartInstance = null

// Fetch data functions
async function fetchMetrics() {
  try {
    const res = await axios.get('http://localhost:8000/api/analytics/metrics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    Object.assign(metrics.value, res.data)
  } catch (error) {
    console.error('Error fetching metrics:', error)
  }
}

async function fetchCharts() {
  try {
    const res = await axios.get('http://localhost:8000/api/analytics/charts', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    registrationData.value = res.data.registrationData || []
  } catch (error) {
    console.error('Error fetching charts:', error)
  }
}

async function fetchTopEvents() {
  try {
    const res = await axios.get('http://localhost:8000/api/analytics/top-events', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    topEvents.value = res.data || []
    maxAttendees.value = Math.max(...topEvents.value.map(e => e.attendees), 0)
  } catch (error) {
    console.error('Error fetching top events:', error)
  }
}

async function fetchSatisfaction() {
  try {
    const res = await axios.get('http://localhost:8000/api/analytics/satisfaction', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    satisfactionData.value = res.data.data || []
    satisfactionColors.value = res.data.colors || []
  } catch (error) {
    console.error('Error fetching satisfaction:', error)
  }
}

async function fetchCategories() {
  try {
    const res = await axios.get('http://localhost:8000/api/analytics/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    // Ensure categoryData.value is always an array
    categoryData.value = res.data.filter(d => d.avgAttendees > 0 || d.avgRevenue > 0) || []

    await nextTick()
    await createCharts()
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Initialize with empty array if there's an error
    categoryData.value = []
  }
}

// Helper functions
const formatNumber = num => new Intl.NumberFormat().format(num)

const getEventStatusClass = s => (
  [
    { key: 'Completed', class: 'bg-green-100 text-green-800' },
    { key: 'Active', class: 'bg-blue-100 text-blue-800' },
    { key: 'Upcoming', class: 'bg-yellow-100 text-yellow-800' }
  ].find(e => e.key === s)?.class || 'bg-gray-100 text-gray-800'
)

// Chart creation function
const createCharts = async () => {
  await nextTick()

  // Destroy existing chart instances if they exist
  registrationChartInstance?.destroy()
  revenueChartInstance?.destroy()
  satisfactionChartInstance?.destroy()
  categoryChartInstance?.destroy()

  // Only create charts if the elements exist
  if (registrationChart.value) {
    const ctx = registrationChart.value.getContext('2d')
    registrationChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: registrationData.value.map(d => d.month),
        datasets: [{
          label: 'Registrations',
          data: registrationData.value.map(d => d.registrations),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    })
  }

  if (revenueChart.value) {
    const ctx = revenueChart.value.getContext('2d')
    revenueChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: registrationData.value.map(d => d.month),
        datasets: [{
          label: 'Revenue',
          data: registrationData.value.map(d => d.revenue),
          backgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    })
  }

  if (satisfactionChart.value) {
    const ctx = satisfactionChart.value.getContext('2d')
    satisfactionChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: satisfactionData.value.map(d => d.rating),
        datasets: [{
          data: satisfactionData.value.map(d => d.count),
          backgroundColor: satisfactionColors.value
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    })
  }

  if (categoryChart.value) {
    // Ensure categoryData.value is an array and has data
    if (Array.isArray(categoryData.value) && categoryData.value.length > 0) {
      const ctx = categoryChart.value.getContext('2d')
      categoryChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: categoryData.value.map(d => d.category),
          datasets: [
            {
              label: 'Avg Attendees',
              data: categoryData.value.map(d => d.avgAttendees),
              yAxisID: 'y',
              backgroundColor: '#3b82f6'
            },
            {
              label: 'Avg Revenue',
              data: categoryData.value.map(d => d.avgRevenue),
              yAxisID: 'y1',
              backgroundColor: '#10b981'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'Attendees' }
            },
            y1: {
              type: 'linear',
              position: 'right',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'Revenue ($)' }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: context => {
                  let label = context.dataset.label + ': ' + context.raw
                  return context.dataset.label === 'Avg Revenue' ? `${label} $` : label
                }
              }
            }
          }
        }
      })
    } else {
      console.warn('No valid category data available for chart')
    }
  } else {
    console.warn('categoryChart element is not mounted')
  }
}

// Other functions
const updateAnalytics = () => { /* optional: refetch & redraw */ }

const exportReport = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/analytics/export', {}, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'analytics_report.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting report:', error)
  }
}

const viewDetailedReports = () => {}
const manageEvents = () => {}

// Lifecycle hook
onMounted(async () => {
  try {
    await Promise.all([
      fetchMetrics(),
      fetchCharts(),
      fetchTopEvents(),
      fetchSatisfaction(),
      fetchCategories()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})

// Expose functions to template if needed
defineExpose({
  updateAnalytics,
  exportReport,
  viewDetailedReports,
  manageEvents
})
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
</style>
