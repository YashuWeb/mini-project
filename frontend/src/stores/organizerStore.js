// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import axios from 'axios'

// export const useOrganizerStore = defineStore('organizer', () => {
//   const authStore = useAuthStore()
//   const stats = ref({})

//   //function to fetch dashboard stats for the organizer
//   const fetchOrganizerStats = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/organizer/analytics/')
//         // Check if the response is empty or not
//         if (response.data.length === 0) {
//           console.error('No data found for organizer stats')
//           return
//         }
//       stats.value = response.data
//       console.log('Successfully fetched stats', response.data)
//     } catch (error) {
//       console.error('Error fetching stats:', error)
//     }
//   }

//   return { fetchOrganizerStats, stats }
// })
