import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import PublicEventsView from '@/views/PublicEventsView.vue'
import EventDetailsView from '@/views/EventDetailsView.vue'

// Admin Routes
import AdminDashboard from '@/views/AdminDashboard.vue'
import AdminDashboardOverview from '@/views/Admin/AdminDashboardOverview.vue'
import UserManagement from '@/views/Admin/UserManagement.vue'
import EventRequests from '@/views/Admin/EventRequests.vue'
import TeamAssignment from '@/views/Admin/TeamAssignment.vue'
import TeamManagement from '@/views/Admin/TeamManagement.vue'
import EventMonitoring from '@/views/Admin/EventMonitoring.vue'
import SystemAnnouncements from '@/views/Admin/SystemAnnouncements.vue'
import ContentModeration from '@/views/Admin/ContentModeration.vue'
import RevenueManagement from '@/views/Admin/RevenueManagement.vue'
import PlatformBranding from '@/views/Admin/PlatformBranding.vue'
import Settings from '@/views/Admin/Settings.vue'
import Feedback from '@/views/Admin/Feedback.vue'
import Notification from '@/views/Admin/AdminNotification.vue'

// Platform Team Routes
import TeamProfile from '@/views/SubTeam/TeamProfile.vue'
import TeamView from '@/views/SubTeam/TeamView.vue'
import TeamNotification from '@/views/SubTeam/TeamNotification.vue'
import TeamEvents from '@/views/SubTeam/TeamEvents.vue'
import TeamTaskDetails from '@/views/SubTeam/TeamTaskDetails.vue'
import TeamTaskManagement from '@/views/SubTeam/TeamTaskManagement.vue'
import SubTeamManagement from '@/views/SubTeam/SubTeamManagement.vue'

// User Routes
import UserView from '@/views/User/UserView.vue'
import UserProfile from '@/views/User/UserProfile.vue'
import UserSetting from '@/views/User/UserSetting.vue'
import UserNotification from '@/views/User/UserNotification.vue'
import UserHome from '@/views/User/UserHome.vue'
import UserEventDetails from '@/views/User/UserEventDetails.vue'
import TicketCart from '@/components/TicketCart.vue'

import TeamHome from '@/views/Organizer-Team/TeamHome.vue'

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/publicEvents',
      name: 'PublicEvents',
      component: PublicEventsView,
    },
    {
      path: '/publicEvents/:id',
      name: 'EventDetails',
      component: EventDetailsView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignupView,
    },
    {
      path: '/forgotpassword',
      name: 'ForgotPassword',
      component: () => import('@/views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPassword.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactView,
    },
    {
      path: '/userview',
      name: 'User',
      component: UserView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'UserHome',
          component: UserHome,
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: UserProfile,
        },
        {
          path: 'setting',
          name: 'UserSetting',
          component: UserSetting,
        },
        {
          path: 'event-details/:id',
          name: 'UserEventDetails',
          component: UserEventDetails,
        },
        {
          path: 'notification',
          name: 'UserNotification',
          component: UserNotification,
        },
        {
          path: 'cart',
          name: 'TicketCart',
          component: TicketCart,
        },
      ],
    },
    {
      path: '/organizerview',
      component: () => import('@/views/OrganizersView.vue'),
      meta: {
        requiresAuth: true,
      },
      redirect: { name: 'organizer-dashboard' }, // Add this line to redirect to dashboard
      children: [
        {
          path: '',
          name: 'organizer-dashboard',
          component: () => import('@/views/Organizers/OrganizerDashboard.vue'),
        },
        {
          path: 'events/create',
          name: 'create-event',
          component: () => import('@/views/Organizers/OrganizerCreateEvents.vue'),
        },
        {
          path: 'events',
          name: 'my-events',
          component: () => import('@/views/Organizers/OrganizerMyEvents.vue'),
        },
        {
          path: 'tickets',
          name: 'tickets',
          component: () => import('@/views/Organizers/OrganizerTickets.vue'),
        },
        {
          path: 'taskManagement',
          name: 'task-management',
          component: () => import('@/views/Organizers/TaskManagement.vue'),
        },
        {
          path: 'taskManagement/:id',
          name: 'task-details',
          component: () => import('@/views/Organizers/TaskDetails.vue'),
        },
        {
          path: 'teamManagement',
          name: 'team-management',
          component: () => import('@/views/Organizers/TeamManagement.vue'),
        },
        {
          path: 'profile',
          name: 'organizer-profile',
          component: () => import('@/views/Organizers/ProfileSettings.vue'),
        },
        {
          path: 'organizerAnalytics',
          name: 'organizer-analytics',
          component: () => import('@/views/Organizers/OrganizerAnalytics.vue'),
        },
        {
          path: 'notification',
          name: 'organizer-notification',
          component: () => import('@/views/Organizers/OrganizerNotification.vue'),
        },
      ],
    },
    {
      path: '/subteamview',
      component: TeamHome,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'OrganiserTeam',
          component: ()=>import('@/views/Organizer-Team/OrganizerTeam.vue'),
        },
        {
          path: ':id',
          name: 'task-detail',
          component: () => import('@/views/Organizer-Team/TeamTaskDetail.vue'),
        },
      ],
    },
    {
      path: '/teamDashboard',
      component: TeamView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'TeamEvents',
          component: TeamEvents,
        },
        {
          path: 'teamTaskManagement',
          name: 'TeamTaskManagement',
          component: TeamTaskManagement,
        },
        {path: 'subTeamManagement', name: 'SubTeamManagement', component: SubTeamManagement },
        {
          path: 'teamTaskDetails/:id',
          name: 'TeamTaskDetails',
          component: TeamTaskDetails,
        },
        {
          path: 'teamNotification',
          name: 'TeamNotification',
          component: TeamNotification,
        },
        {
          path: 'teamProfile',
          name: 'TeamProfile',
          component: TeamProfile,
        },
      ],
    },
    {
      path: '/AdminDashboard',
      component: AdminDashboard,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'AdminDashboardOverview',
          component: AdminDashboardOverview,
        },
        {
          path: 'users',
          name: 'UserManagement',
          component: UserManagement,
        },
        {
          path: 'event-requests',
          name: 'EventRequests',
          component: EventRequests,
        },
        {
          path: 'teams',
          name: 'TeamManagement',
          component: TeamManagement,
        },
        {
          path: 'team-assignment',
          name: 'TeamAssignment',
          component: TeamAssignment,
        },
        {
          path: 'event-monitoring',
          name: 'EventMonitoring',
          component: EventMonitoring,
        },
        {
          path: 'feedback',
          name: 'Feedback',
          component: Feedback,
        },
        {
          path: 'content-moderation',
          name: 'ContentModeration',
          component: ContentModeration,
        },
        {
          path: 'revenue',
          name: 'RevenueManagement',
          component: RevenueManagement,
        },
        {
          path: 'branding',
          name: 'PlatformBranding',
          component: PlatformBranding,
        },
        {
          path: 'announcements',
          name: 'SystemAnnouncements',
          component: SystemAnnouncements,
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings,
        },
        {
          path: 'notification',
          name: 'Notification',
          component: Notification,
        },
      ],
    },
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // Redirect to login if not authenticated
  } else {
    next()
  }
})

export default router
