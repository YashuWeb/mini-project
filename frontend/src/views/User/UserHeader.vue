<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronDown, LogOut, User, ShoppingCart, Bell } from 'lucide-vue-next';
import { RouterLink, useRouter } from 'vue-router';
import cartStore from '@/stores/cart'; // <-- import store
import axios from 'axios';

const router = useRouter();

const dropdownOpen = ref(false);
const dropdown = ref(null);
const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const unreadNotifications = ref(0);

// Methods
const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value; };
const handleNotifications = () => { unreadNotifications.value = 0; router.push('/userview/notification'); };
const handleClickOutside = (event) => { if (dropdown.value && !dropdown.value.contains(event.target)) dropdownOpen.value = false; };
const signout = () => { localStorage.removeItem('user'); localStorage.removeItem('token'); router.push('/'); };

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchUnreadNotifications();
  cartStore.fetchCartItems(); // Fetch initial cart
});
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

// Notifications fetch
const fetchUnreadNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const response = await axios.get('http://localhost:8000/api/user/notification', {
      headers: { Authorization: `Bearer ${token}` },
    });
    unreadNotifications.value = response.data.filter(n => !n.read_at).length;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};
</script>

<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <RouterLink to="/userview" class="text-2xl text-gray-900">EthioEvents</RouterLink>

      <div class="flex-1 flex justify-center">
        <RouterLink to="/userview" class="text-gray-500 hover:text-gray-700 font-medium text-xl">
          Home
        </RouterLink>
      </div>

      <div class="flex items-center gap-4">
        <button class="relative focus:outline-none" @click="handleNotifications">
          <Bell class="w-7 h-7 text-gray-500 hover:text-gray-700" />
          <span v-if="unreadNotifications > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {{ unreadNotifications }}
          </span>
        </button>

        <RouterLink to="/userview/cart" class="relative focus:outline-none">
          <ShoppingCart class="w-7 h-7 text-gray-500 hover:text-gray-700" />
          <span v-if="cartStore.cartItemCount > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {{ cartStore.cartItemCount }}
          </span>
        </RouterLink>

        <div class="relative" ref="dropdown">
          <button @click="toggleDropdown" class="flex items-center gap-2 focus:outline-none">
            <div class="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center">
              {{ user?.value?.firstName?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <ChevronDown class="w-4 h-4 text-gray-500" />
          </button>

          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50" @click.stop>
            <ul class="py-1">
              <li>
                <RouterLink to="/userview/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <User class="w-4 h-4 text-gray-500" /> Profile
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/userview/notification" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <Bell class="w-4 h-4 text-gray-500" /> Notifications
                </RouterLink>
              </li>
              <li>
                <button @click="signout" class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <LogOut class="w-4 h-4 text-gray-500" /> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
