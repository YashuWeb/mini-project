// import { defineStore } from 'pinia'
// import { ref, onMounted } from 'vue'
// import axios from 'axios'

// export const useAuthStore = defineStore('auth', () => {
//  const token = ref(localStorage.getItem('token') || null)
//  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

//   //for login error handling

//   const apiError = ref('')

//   // Fetch token and user from localStorage on store initialization
  

//   //signup function
//   const signup = async (data) => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/register', data)
//       token.value = response.data.token
//       user.value = response.data.user // Store the user object directly
//       localStorage.setItem('token', token.value)
//     } catch (error) {
//       console.error('Signup error:', error.response?.data?.error || error.message) // Safely accessing error
//     }
//   }

//   // Login function
//   const login = async (loginData) => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/login', loginData)
//       token.value = response.data.token
//       user.value = response.data.user // Store the user object directly
//       localStorage.setItem('token', token.value)
//       localStorage.setItem('user', JSON.stringify(user.value)) // Store the user data
//     } catch (error) {
//       if (error.response && error.response.status === 422) {
//         console.error('Validation error:', error.response.data)
//         apiError.value = 'Incorrect email or password.'
//       }
//       // else if (error.response.status === 422) {
//       //     apiError.value = "Incorrect email or password.";
//       //   }
//       else {
//         console.error('Login error:', error)
//         apiError.value = 'Something went wrong. Try again.'
//       }
//     }
    
//   }

//   onMounted(() => {
//     const storedToken = localStorage.getItem('token')
//     const storedUser = localStorage.getItem('user')
//     if (storedToken) {
//       token.value = storedToken
//     }
//     if (storedUser) {
//       user.value = JSON.parse(storedUser)
//     }
//   })

//   //Logout function
//   const logout = async () => {
//     token.value = null
//     user.value = null
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//   }
//   return { token, user, signup, login, logout }
// })
