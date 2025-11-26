<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="$emit('toggle')"
    >
      <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isCollapsed ? 'lg:w-20' : 'w-64',
        'z-30' // Higher than content but lower than overlay
      ]"
    >
      <!-- Logo and collapse toggle -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <router-link to="/AdminDashboard" class="flex items-center space-x-2">
          <img src="#" alt="Logo" class="w-8 h-8" />
          <span v-if="!isCollapsed" class="text-xl font-bold text-gray-900">EthioEvents</span>
        </router-link>
        
        <!-- Collapse toggle button (desktop only) -->
        <button 
          @click="toggleCollapse" 
          class="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 focus:outline-none"
          :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <ChevronLeft v-if="!isCollapsed" class="w-5 h-5 text-gray-500" />
          <ChevronRight v-else class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <router-link
  v-for="item in navigation"
  :key="item.name"
  :to="item.to"
  class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
  :class="[
    $route.path === item.to
      ? 'text-blue-600 bg-blue-50'
      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
    isCollapsed ? 'justify-center' : ''
  ]"
  :title="isCollapsed ? item.name : ''"
>
  <component :is="item.icon" class="w-5 h-5" :class="isCollapsed ? '' : 'mr-3'" />
  <span v-if="!isCollapsed">{{ item.name }}</span>
</router-link>
      </nav>

      <!-- User Profile -->
      <div 
        class="flex items-center p-4 border-t border-gray-200"
        :class="{ 'justify-center': isCollapsed }"
      >
        <img
          src="#"
          alt="User avatar"
          class="w-10 h-10 rounded-full"
        />
        <div v-if="!isCollapsed" class="ml-3">
          <p class="text-sm font-medium text-gray-900">Admin</p>
          <p class="text-xs text-gray-500">Super Admin</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Settings,
  Bell,
  CheckSquare,
  UserPlus,
  Palette,
  UsersRound
} from 'lucide-vue-next';

// const props = defineProps({
//   isOpen: {
//     type: Boolean,
//     required: true
//   }
// });

const emit = defineEmits(['toggle', 'collapse-change']);

// State for collapsed sidebar
const isCollapsed = ref(false);

// Toggle collapsed state
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('collapse-change', isCollapsed.value);
};

// Navigation items
const navigation = [
  { name: 'Dashboard', to: '/AdminDashboard', icon: LayoutDashboard },
  { name: 'User Management', to: '/AdminDashboard/users', icon: Users },
  { name: 'Event Requests', to: '/AdminDashboard/event-requests', icon: Calendar },
  { name: 'Team Management', to: '/AdminDashboard/teams', icon: UsersRound },
  { name: 'Team Assignment', to: '/AdminDashboard/team-assignment', icon: UserPlus },
  { name: 'Event Monitoring', to: '/AdminDashboard/event-monitoring', icon: CheckSquare },
  { name: 'Feedback', to: '/AdminDashboard/feedback', icon: MessageSquare },
  // { name: 'Content Moderation', to: '/AdminDashboard/content-moderation', icon: FileText },
  { name: 'Revenue Management', to: '/AdminDashboard/revenue', icon: DollarSign },
  { name: 'Platform Branding', to: '/AdminDashboard/branding', icon: Palette },
  { name: 'System Announcements', to: '/AdminDashboard/announcements', icon: Bell },
  { name: 'Settings', to: '/AdminDashboard/settings', icon: Settings }
];
</script>

