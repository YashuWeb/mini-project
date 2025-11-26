<template>
  <div class="map-container">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: 100%; width: 100%;"
    >
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-if="markerLatLng" :lat-lng="markerLatLng" :icon="customPinIcon">
        <l-popup>{{ location }}</l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const props = defineProps({
  location: String,
});

const zoom = ref(15);
const center = ref([0, 0]); // Default center
const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
const markerLatLng = ref(null);

// Define the custom pin icon
const customPinIcon = L.icon({
  iconUrl: '/redpin.png', // Make sure this path is correct
  iconSize: [38, 38], // Size of the icon
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
});

// Watch for changes in the location prop
watch(
  () => props.location,
  async (newLocation) => {
    if (newLocation) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: newLocation,
            format: 'json',
            limit: 1,
          },
        });
        if (response.data && response.data.length > 0) {
          const coords = [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
          center.value = coords;
          markerLatLng.value = coords;
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.map-container {
  height: 450px; /* Set a fixed height for the map container */
  width: 100%;
  overflow: hidden; /* Prevent overflow */
  position: relative; /* Ensure the map stays within its container */
  z-index:1;
}
</style>
