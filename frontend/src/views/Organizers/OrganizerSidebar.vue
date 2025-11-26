<script setup>
import { defineProps, defineEmits } from 'vue'
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BarChart3,
  Bell,
  HelpCircle,
  PlusCircle,
  ListTodo,
  UsersRound,
} from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['toggle'])

const navigation = [
  {
    name: 'General',
    items: [
      { name: 'Dashboard', to: '/organizerview', icon: LayoutDashboard },
      { name: 'Create Event', to: '/organizerview/events/create', icon: PlusCircle },
      { name: 'My Events', to: '/organizerview/events', icon: Calendar },
      { name: 'Tickets', to: '/organizerview/tickets', icon: Ticket },
      // {name: 'Notifications', to: '/organizerview/notifications', icon: Bell},
    ],
  },
  {
    name: 'Management',
    items: [
      // { name: 'Audience', to: '/organizerview/audience', icon: Users },
      { name: 'Task Management', to: '/organizerview/taskManagement', icon: ListTodo },
      // { name: 'Task Reports', to: '/organizerview/task-reports', icon: ClipboardList },
      { name: 'Team Members', to: '/organizerview/teamManagement', icon: UsersRound },
      // { name: 'Team Assignment', to: '/organizerview/team-assignment', icon: UserPlus },
      { name: 'Analytics', to: '/organizerview/organizerAnalytics', icon: BarChart3 },
    ],
  },
  {
    name: 'Support',
    items: [
      // { name: 'Settings', to: '/organizerview/settings', icon: Settings },
      // { name: 'Settings', to: '/organizerview/settings', icon: Settings },
      { name: 'Help and Support', to: '/organizerview/support', icon: HelpCircle },
    ],
  },
]
</script>

<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div v-if="isOpen" class="fixed inset-0 z-40 lg:hidden" @click="$emit('toggle')">
      <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center h-16 px-6 border-b border-gray-200">
        <router-link to="/organizerView" class="flex items-center space-x-2">
          <img src="#" alt="Logo" class="w-8 h-8" />
          <span class="text-xl font-bold text-gray-900">Organizer</span>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <div v-for="(section, index) in navigation" :key="index" class="space-y-1">
          <h3
            v-if="section.name"
            class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            {{ section.name }}
          </h3>

          <router-link
            v-for="item in section.items"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="[
              $route.path === item.to
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="flex items-center p-4 border-t border-gray-200">
        <img src="#" alt="User avatar" class="w-10 h-10 rounded-full" />
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Teddy</p>
          <p class="text-xs text-gray-500">Event Organizer</p>
        </div>
      </div>
    </div>
  </div>
</template>
