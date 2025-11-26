<template>
    <div class="flex h-screen bg-gray-100">
      <!-- Team Sidebar -->
      <TeamSidebar 
        :isOpen="sidebarOpen" 
        @toggle="toggleSidebar" 
        @collapse-change="isCollapsed = $event" 
      />
      
      <!-- Main Content -->
      <div 
        class="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        :style="contentStyle"
      >
        <!-- Top Navigation -->
        <TeamHeader @toggle-sidebar="toggleSidebar" :user="currentUser" />
        
        <!-- Main Content Area - This is where child routes will be rendered -->
        <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
import TeamSidebar from '@/views/SubTeam/TeamSidebar.vue'
  import TeamHeader from '@/views/SubTeam/TeamHeader.vue';
  
  // Current user data (would come from auth store in a real app)
  const currentUser = {
    name: 'Tseganesh Aschalew',
    email: 'tsega@gmail.com',
    avatar: '/path/to/avatar.jpg',
    role: 'Event Coordinator',
  };
  
  // Sidebar state
  const sidebarOpen = ref(false);
  const isCollapsed = ref(false);
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };
  
  // Compute the style for the main content area
  const contentStyle = computed(() => {
    // On large screens, always offset for the sidebar
    // On mobile, only offset when sidebar is open
    const marginLeft = isCollapsed.value ? '5rem' : '16rem'; // 5rem = 80px, 16rem = 256px
    
    if (window.innerWidth >= 1024) {
      return { marginLeft };
    } else {
      return { marginLeft: sidebarOpen.value ? '16rem' : '0' };
    }
  });
  </script>
  
  