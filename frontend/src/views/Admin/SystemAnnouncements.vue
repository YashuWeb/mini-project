<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">System Announcements</h1>
        <p class="text-gray-500 mt-1">Create and manage system-wide announcements</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus class="h-4 w-4 mr-2" />
        Create Announcement
      </button>
    </div>

    <!-- Announcement Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Total Announcements</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ announcements.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Active Announcements</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ activeAnnouncementsCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Scheduled Announcements</p>
        <p class="text-2xl font-bold text-blue-600 mt-1">{{ scheduledAnnouncementsCount }}</p>
      </div>
    </div>

    <!-- Announcements Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Audience
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="announcement in announcements" :key="announcement.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ announcement.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-blue-100 text-blue-800': announcement.type === 'info',
                    'bg-yellow-100 text-yellow-800': announcement.type === 'warning',
                    'bg-red-100 text-red-800': announcement.type === 'critical',
                    'bg-green-100 text-green-800': announcement.type === 'success'
                  }"
                >
                  {{ announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ announcement.audience }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-green-100 text-green-800': announcement.status === 'active',
                    'bg-blue-100 text-blue-800': announcement.status === 'scheduled',
                    'bg-gray-100 text-gray-800': announcement.status === 'expired'
                  }"
                >
                  {{ announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ announcement.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ announcement.scheduledFor || 'Immediate' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="viewAnnouncement(announcement)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    <Eye class="h-5 w-5" />
                  </button>
                  <button 
                    v-if="announcement.status !== 'expired'"
                    @click="editAnnouncement(announcement)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit Announcement"
                  >
                    <Edit class="h-5 w-5" />
                  </button>
                  <button 
                    v-if="announcement.status === 'active'"
                    @click="deactivateAnnouncement(announcement.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Deactivate Announcement"
                  >
                    <EyeOff class="h-5 w-5" />
                  </button>
                  <button 
                    @click="deleteAnnouncement(announcement.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete Announcement"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Announcement Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showEditModal ? 'Edit Announcement' : 'Create New Announcement' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveAnnouncement" class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                id="title"
                type="text"
                v-model="announcementForm.title"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter announcement title"
              />
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                v-model="announcementForm.message"
                rows="4"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter announcement message"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">
                  Type *
                </label>
                <select
                  id="type"
                  v-model="announcementForm.type"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="success">Success</option>
                </select>
              </div>
              
              <div>
                <label for="audience" class="block text-sm font-medium text-gray-700">
                  Target Audience *
                </label>
                <select
                  id="audience"
                  v-model="announcementForm.audience"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="All Users">All Users</option>
                  <option value="Admins">Admins</option>
                  <option value="Organizers">Organizers</option>
                  <option value="Attendees">Attendees</option>
                </select>
              </div>
            </div>
            
            <div>
              <div class="flex items-center">
                <input
                  id="schedule"
                  type="checkbox"
                  v-model="isScheduled"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="schedule" class="ml-2 block text-sm text-gray-900">
                  Schedule for later
                </label>
              </div>
            </div>
            
            <div v-if="isScheduled">
              <label for="scheduledDate" class="block text-sm font-medium text-gray-700">
                Schedule Date and Time *
              </label>
              <input
                id="scheduledDate"
                type="datetime-local"
                v-model="announcementForm.scheduledFor"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <div class="flex items-center">
                <input
                  id="expiration"
                  type="checkbox"
                  v-model="hasExpiration"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="expiration" class="ml-2 block text-sm text-gray-900">
                  Set expiration date
                </label>
              </div>
            </div>
            
            <div v-if="hasExpiration">
              <label for="expirationDate" class="block text-sm font-medium text-gray-700">
                Expiration Date and Time *
              </label>
              <input
                id="expirationDate"
                type="datetime-local"
                v-model="announcementForm.expiresAt"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div class="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{ showEditModal ? 'Update Announcement' : 'Create Announcement' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Announcement Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Announcement Details
            </h3>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6" v-if="selectedAnnouncement">
          <div class="space-y-6">
            <div>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900">{{ selectedAnnouncement.title }}</h2>
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-blue-100 text-blue-800': selectedAnnouncement.type === 'info',
                    'bg-yellow-100 text-yellow-800': selectedAnnouncement.type === 'warning',
                    'bg-red-100 text-red-800': selectedAnnouncement.type === 'critical',
                    'bg-green-100 text-green-800': selectedAnnouncement.type === 'success'
                  }"
                >
                  {{ selectedAnnouncement.type.charAt(0).toUpperCase() + selectedAnnouncement.type.slice(1) }}
                </span>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Message</h3>
              <div class="bg-gray-50 p-4 rounded-md">
                <p class="text-sm text-gray-900 whitespace-pre-line">{{ selectedAnnouncement.message }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Target Audience</h3>
                <p class="text-sm text-gray-900">{{ selectedAnnouncement.audience }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-green-100 text-green-800': selectedAnnouncement.status === 'active',
                    'bg-blue-100 text-blue-800': selectedAnnouncement.status === 'scheduled',
                    'bg-gray-100 text-gray-800': selectedAnnouncement.status === 'expired'
                  }"
                >
                  {{ selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1) }}
                </span>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Created</h3>
                <p class="text-sm text-gray-900">{{ selectedAnnouncement.createdAt }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Scheduled For</h3>
                <p class="text-sm text-gray-900">{{ selectedAnnouncement.scheduledFor || 'Immediate' }}</p>
              </div>
              <div v-if="selectedAnnouncement.expiresAt">
                <h3 class="text-sm font-medium text-gray-500 mb-1">Expires</h3>
                <p class="text-sm text-gray-900">{{ selectedAnnouncement.expiresAt }}</p>
              </div>
            </div>
            
            <div class="pt-4 flex justify-end space-x-3">
              <button
                v-if="selectedAnnouncement.status !== 'expired'"
                @click="editFromView()"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit class="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                v-if="selectedAnnouncement.status === 'active'"
                @click="deactivateAnnouncementFromView(selectedAnnouncement.id)"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <EyeOff class="h-4 w-4 mr-2" />
                Deactivate
              </button>
              <button
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="closeViewModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  EyeOff
} from 'lucide-vue-next';

// Sample data
const announcements = ref([
  {
    id: 1,
    title: 'Platform Maintenance',
    message: 'We will be performing scheduled maintenance on our servers on October 15, 2023, from 2:00 AM to 4:00 AM UTC. During this time, the platform may experience brief periods of downtime.\n\nWe apologize for any inconvenience this may cause and appreciate your understanding.',
    type: 'warning',
    audience: 'All Users',
    status: 'active',
    createdAt: 'Oct 10, 2023',
    scheduledFor: null,
    expiresAt: 'Oct 16, 2023'
  },
  {
    id: 2,
    title: 'New Feature: Team Chat',
    message: 'We\'re excited to announce the launch of our new Team Chat feature! Now you can communicate with your team members directly within the platform.\n\nTo access this feature, navigate to your team dashboard and click on the "Chat" tab.',
    type: 'info',
    audience: 'Organizers',
    status: 'active',
    createdAt: 'Oct 5, 2023',
    scheduledFor: null,
    expiresAt: null
  },
  {
    id: 3,
    title: 'Holiday Schedule',
    message: 'Please note that our support team will have limited availability during the upcoming holiday season (December 24-26, 2023).\n\nFor urgent matters, please use the emergency contact form.',
    type: 'info',
    audience: 'All Users',
    status: 'scheduled',
    createdAt: 'Oct 12, 2023',
    scheduledFor: 'Dec 20, 2023',
    expiresAt: 'Dec 27, 2023'
  },
  {
    id: 4,
    title: 'Security Update Required',
    message: 'We have released an important security update. Please update your account settings by clicking on your profile and selecting "Security".\n\nThis update is mandatory and must be completed by October 20, 2023.',
    type: 'critical',
    audience: 'All Users',
    status: 'active',
    createdAt: 'Oct 13, 2023',
    scheduledFor: null,
    expiresAt: 'Oct 21, 2023'
  },
  {
    id: 5,
    title: 'Payment System Update',
    message: 'Our payment system has been updated to provide better security and faster processing times.\n\nNo action is required on your part.',
    type: 'success',
    audience: 'Organizers',
    status: 'expired',
    createdAt: 'Sep 15, 2023',
    scheduledFor: null,
    expiresAt: 'Oct 1, 2023'
  }
]);

// State variables
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedAnnouncement = ref(null);
const isScheduled = ref(false);
const hasExpiration = ref(false);
const announcementForm = ref({
  id: null,
  title: '',
  message: '',
  type: 'info',
  audience: 'All Users',
  status: 'active',
  createdAt: '',
  scheduledFor: null,
  expiresAt: null
});

// Computed properties
const activeAnnouncementsCount = computed(() => {
  return announcements.value.filter(a => a.status === 'active').length;
});

const scheduledAnnouncementsCount = computed(() => {
  return announcements.value.filter(a => a.status === 'scheduled').length;
});

// Action functions
const viewAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
  showViewModal.value = true;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedAnnouncement.value = null;
};

const editAnnouncement = (announcement) => {
  announcementForm.value = { ...announcement };
  isScheduled.value = !!announcement.scheduledFor;
  hasExpiration.value = !!announcement.expiresAt;
  showEditModal.value = true;
};

const editFromView = () => {
  editAnnouncement(selectedAnnouncement.value);
  closeViewModal();
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  announcementForm.value = {
    id: null,
    title: '',
    message: '',
    type: 'info',
    audience: 'All Users',
    status: 'active',
    createdAt: '',
    scheduledFor: null,
    expiresAt: null
  };
  isScheduled.value = false;
  hasExpiration.value = false;
};

const saveAnnouncement = () => {
  // Format the form data
  const formData = { ...announcementForm.value };
  
  // Handle scheduling
  if (!isScheduled.value) {
    formData.scheduledFor = null;
    formData.status = 'active';
  } else {
    formData.status = 'scheduled';
  }
  
  // Handle expiration
  if (!hasExpiration.value) {
    formData.expiresAt = null;
  }
  
  if (showEditModal.value) {
    // Update existing announcement
    const index = announcements.value.findIndex(a => a.id === formData.id);
    if (index !== -1) {
      announcements.value[index] = formData;
    }
  } else {
    // Add new announcement
    const newId = Math.max(0, ...announcements.value.map(a => a.id)) + 1;
    formData.id = newId;
    formData.createdAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    announcements.value.unshift(formData);
  }
  
  closeModal();
};

const deactivateAnnouncement = (announcementId) => {
  const index = announcements.value.findIndex(a => a.id === announcementId);
  if (index !== -1) {
    announcements.value[index].status = 'expired';
  }
};

const deactivateAnnouncementFromView = (announcementId) => {
  deactivateAnnouncement(announcementId);
  closeViewModal();
};

const deleteAnnouncement = (announcementId) => {
  if (confirm('Are you sure you want to delete this announcement?')) {
    announcements.value = announcements.value.filter(a => a.id !== announcementId);
  }
};
</script>

