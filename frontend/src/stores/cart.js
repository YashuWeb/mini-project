// src/stores/cart.js
import { reactive, computed } from 'vue';
import axios from 'axios';

const state = reactive({
  items: [], // Cart items array
});

// Computed total quantity
const cartItemCount = computed(() => {
  return state.items.reduce((total, item) => total + (item.quantity || 1), 0);
});

// Fetch cart items from API
const fetchCartItems = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await axios.get('http://localhost:8000/api/user/cart', {
      headers: { Authorization: `Bearer ${token}` },
    });
    state.items = response.data;
  } catch (err) {
    console.error('Error fetching cart items:', err);
  }
};

// Add item to cart (update store)
const addItem = (item) => {
  const existing = state.items.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    state.items.push({ ...item, quantity: item.quantity || 1 });
  }
};

// Remove item from cart
const removeItem = (itemId) => {
  state.items = state.items.filter(i => i.id !== itemId);
};

export default {
  state,
  cartItemCount,
  fetchCartItems,
  addItem,
  removeItem,
};
