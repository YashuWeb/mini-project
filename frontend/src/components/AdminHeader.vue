<template>
  <header class="bg-white shadow-sm z-10 w-full">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left side: Toggle button and breadcrumbs -->
      <div class="flex items-center">
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <Menu class="w-5 h-5 text-gray-500" />
        </button>

        <div class="hidden md:flex items-center ml-4">
          <h1 class="text-lg font-semibold text-gray-800">{{ currentPageTitle }}</h1>
        </div>
      </div>

      <!-- Right side: Search, notifications, and profile -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative hidden md:block search-container">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @focus="showSearchResults = true"
            @blur="hideSearchResultsDelayed"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <!-- Search Results Dropdown -->
          <div
            v-if="showSearchResults && filteredSearchResults.length > 0"
            class="absolute mt-1 w-full bg-white rounded-md shadow-lg py-1 z-50 max-h-96 overflow-y-auto"
          >
            <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Search Results
            </div>
            <div
              v-for="(section, sectionIndex) in filteredSearchResults"
              :key="sectionIndex"
              class="border-t border-gray-100"
            >
              <div class="px-4 py-2 text-xs font-semibold text-gray-500">{{ section.title }}</div>
              <router-link
                v-for="result in section.items"
                :key="result.id"
                :to="result.path"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showSearchResults = false"
              >
                <div class="font-medium">{{ result.title }}</div>
                <div class="text-xs text-gray-500">{{ result.description }}</div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <RouterLink
          to="/AdminDashboard/notification"
          class="relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Bell class="h-6 w-6" />
          <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </RouterLink>

        <!-- Profile dropdown -->
        <div class="relative">
          <button
            @click="isProfileOpen = !isProfileOpen"
            class="profile-button flex items-center space-x-2 focus:outline-none"
          >
            <div
              class="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white"
            >
              {{ currentUser?.firstName?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <span class="hidden md:block text-sm font-medium text-gray-700">
              {{ (currentUser?.firstName) }} 
            </span>
            <ChevronDown class="hidden md:block h-4 w-4 text-gray-500" />
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="isProfileOpen"
            class="profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            <router-link
              to="/admin/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </router-link>
            <router-link
              to="/admin/settings"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </router-link>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Menu, Search, Bell, ChevronDown } from 'lucide-vue-next';
import axios from 'axios';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();
const isProfileOpen = ref(false);
const searchQuery = ref('');
const showSearchResults = ref(false);
const searchTimeout = ref(null);

// Dynamic user data from localStorage
const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);



// Get current page title based on route
const currentPageTitle = computed(() => {
  const path = route.path;
  if (path === '/AdminDashboard') return 'Dashboard';
  if (path.includes('/users')) return 'User Management';
  if (path.includes('/event-requests')) return 'Event Requests';
  if (path.includes('/team-assignment')) return 'Team Assignment';
  if (path.includes('/event-monitoring')) return 'Event Monitoring';
  if (path.includes('/feedback')) return 'Feedback';
  if (path.includes('/content-moderation')) return 'Content Moderation';
  if (path.includes('/revenue')) return 'Revenue Management';
  if (path.includes('/branding')) return 'Platform Branding';
  if (path.includes('/announcements')) return 'System Announcements';
  if (path.includes('/settings')) return 'Settings';
  return 'Admin Dashboard';
});

// Logout function
const logout = async () => {
  try {
    await axios.post(
      'http://localhost:8000/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Logout failed:', error);
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  router.push('/');
};

// Sample search data
const searchData = [
  {
    title: 'Dashboard',
    items: [
      { id: 1, title: 'Overview Dashboard', description: 'Main admin dashboard', path: '/AdminDashboard' },
    ],
  },
  {
    title: 'Users',
    items: [
      { id: 2, title: 'User Management', description: 'Manage all platform users', path: '/AdminDashboard/users' },
      { id: 3, title: 'New User Registration', description: 'Recent user sign-ups', path: '/AdminDashboard/users?filter=new' },
    ],
  },
  {
    title: 'Events',
    items: [
      { id: 4, title: 'Event Requests', description: 'Review pending event requests', path: '/AdminDashboard/event-requests' },
      { id: 5, title: 'Event Monitoring', description: 'Monitor ongoing events', path: '/AdminDashboard/event-monitoring' },
      { id: 6, title: 'Team Assignment', description: 'Assign teams to events', path: '/AdminDashboard/team-assignment' },
    ],
  },
  {
    title: 'Content',
    items: [
      { id: 7, title: 'Content Moderation', description: 'Review and moderate content', path: '/AdminDashboard/content-moderation' },
      { id: 8, title: 'System Announcements', description: 'Create and manage announcements', path: '/AdminDashboard/announcements' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 9, title: 'Platform Settings', description: 'Configure platform settings', path: '/AdminDashboard/settings' },
      { id: 10, title: 'Platform Branding', description: 'Customize platform appearance', path: '/AdminDashboard/branding' },
    ],
  },
];

// Filter search results based on query
const filteredSearchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const query = searchQuery.value.toLowerCase();
  return searchData
    .map((section) => {
      const filteredItems = section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
      return { title: section.title, items: filteredItems };
    })
    .filter((section) => section.items.length > 0);
});

// Perform search when Enter is pressed
const performSearch = () => {
  if (filteredSearchResults.value.length > 0) {
    const firstSection = filteredSearchResults.value[0];
    const firstItem = firstSection.items[0];
    router.push(firstItem.path);
    searchQuery.value = '';
    showSearchResults.value = false;
  }
};

// Hide search results with a delay
const hideSearchResultsDelayed = () => {
  searchTimeout.value = setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

// Clear timeout when component is unmounted
onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});

// Handle click outside to close search results
const handleClickOutsideSearch = (event) => {
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer && !searchContainer.contains(event.target)) {
    showSearchResults.value = false;
  }
};

// Handle click outside to close profile dropdown
const handleClickOutsideProfile = (event) => {
  const profileDropdown = document.querySelector('.profile-dropdown');
  const profileButton = document.querySelector('.profile-button');
  if (
    profileDropdown &&
    !profileDropdown.contains(event.target) &&
    profileButton &&
    !profileButton.contains(event.target)
  ) {
    isProfileOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutsideSearch);
  document.addEventListener('click', handleClickOutsideProfile);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideSearch);
  document.removeEventListener('click', handleClickOutsideProfile);
});
</script>