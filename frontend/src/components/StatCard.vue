<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
      </div>
      <div :class="`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`">
        <component :is="iconComponent" class="w-6 h-6 text-white" />
      </div>
    </div>
    <div class="mt-4 flex items-center">
      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    default: '0%'
  },
  trendDirection: {
    type: String,
    default: 'up',
    validator: (value) => ['up', 'down'].includes(value)
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'yellow', 'red', 'purple'].includes(value)
  }
});

// Compute the icon component based on the icon prop
const iconComponent = computed(() => {
  switch (props.icon) {
    case 'Users': return Users;
    case 'Calendar': return Calendar;
    case 'Clock': return Clock;
    case 'DollarSign': return DollarSign;
    default: return Users;
  }
});

// Compute the background color based on the color prop
const bgColor = computed(() => {
  switch (props.color) {
    case 'blue': return 'bg-blue-600';
    case 'green': return 'bg-green-600';
    case 'yellow': return 'bg-yellow-600';
    case 'red': return 'bg-red-600';
    case 'purple': return 'bg-purple-600';
    default: return 'bg-blue-600';
  }
});


</script>

