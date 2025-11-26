<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Revenue Management</h1>
        <p class="text-gray-500 mt-1">Track and manage platform revenue</p>
      </div>
    </div>

    <!-- Revenue Overview -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <p class="text-sm text-gray-500">Total Revenue</p>
          <p class="text-2xl font-bold text-gray-900">${{ revenueData.totalRevenue.toFixed(2) }}</p>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-500">Monthly Revenue</p>
          <p class="text-2xl font-bold text-gray-900">
            ${{ revenueData.monthlyRevenue.toFixed(2) }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-500">Transactions</p>
          <p class="text-2xl font-bold text-gray-900">{{ revenueData.totalTransactions }}</p>
        </div>
      </div>
    </div>

    <!-- Revenue Trends -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Revenue Trends</h2>
      <div>
        <canvas id="revenueChart"></canvas>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Transaction ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in transactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ transaction.amount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="{
                    'text-green-600': transaction.status === 'completed',
                    'text-yellow-600': transaction.status === 'pending',
                    'text-red-600': transaction.status === 'failed',
                  }"
                >
                  {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Mock revenue data
const revenueData = ref({
  totalRevenue: 12500.75,
  monthlyRevenue: 2500.5,
  totalTransactions: 45,
})

// Mock transactions data
const transactions = ref([
  { id: 'TXN001', date: '2025-04-01', amount: 500.0, status: 'completed' },
  { id: 'TXN002', date: '2025-04-02', amount: 300.0, status: 'pending' },
  { id: 'TXN003', date: '2025-04-03', amount: 200.0, status: 'failed' },
])

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Render revenue trends chart
const renderRevenueChart = () => {
  const ctx = document.getElementById('revenueChart').getContext('2d')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Revenue',
          data: [2000, 2500, 3000, 3500, 4000, 4500],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
    },
  })
}

// Initialize chart on mount
onMounted(() => {
  renderRevenueChart()
})
</script>
