<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Platform Settings</h1>
      <p class="text-gray-600">Configure and customize your event management platform</p>
    </div>

    <!-- Settings Navigation Tabs -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="flex space-x-8">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap',
            activeTab === tab.id 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <component :is="tab.icon" class="inline-block w-5 h-5 mr-2" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Platform Information</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="platform-name" class="block text-sm font-medium text-gray-700">Platform Name</label>
              <input 
                type="text" 
                id="platform-name" 
                v-model="settings.general.platformName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="platform-url" class="block text-sm font-medium text-gray-700">Platform URL</label>
              <input 
                type="url" 
                id="platform-url" 
                v-model="settings.general.platformUrl"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label for="platform-description" class="block text-sm font-medium text-gray-700">Platform Description</label>
            <textarea 
              id="platform-description" 
              v-model="settings.general.platformDescription"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="support-email" class="block text-sm font-medium text-gray-700">Support Email</label>
              <input 
                type="email" 
                id="support-email" 
                v-model="settings.general.supportEmail"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="support-phone" class="block text-sm font-medium text-gray-700">Support Phone</label>
              <input 
                type="tel" 
                id="support-phone" 
                v-model="settings.general.supportPhone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label for="business-address" class="block text-sm font-medium text-gray-700">Business Address</label>
            <textarea 
              id="business-address" 
              v-model="settings.general.businessAddress"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Regional Settings</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="timezone" class="block text-sm font-medium text-gray-700">Default Timezone</label>
              <select 
                id="timezone" 
                v-model="settings.general.timezone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
            <div>
              <label for="date-format" class="block text-sm font-medium text-gray-700">Date Format</label>
              <select 
                id="date-format" 
                v-model="settings.general.dateFormat"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700">Default Currency</label>
              <select 
                id="currency" 
                v-model="settings.general.currency"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="JPY">Japanese Yen (JPY)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
              </select>
            </div>
            <div>
              <label for="language" class="block text-sm font-medium text-gray-700">Default Language</label>
              <select 
                id="language" 
                v-model="settings.general.language"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Authentication</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
              <p class="text-sm text-gray-500">Require admins to use two-factor authentication</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.security.twoFactorAuth" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Password Requirements</h3>
              <p class="text-sm text-gray-500">Enforce strong password requirements</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.security.strongPasswords" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div>
            <label for="session-timeout" class="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
            <input 
              type="number" 
              id="session-timeout" 
              v-model="settings.security.sessionTimeout"
              min="5"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Privacy</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Data Retention</h3>
              <p class="text-sm text-gray-500">Automatically delete user data after inactivity period</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.security.dataRetention" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="settings.security.dataRetention">
            <label for="retention-period" class="block text-sm font-medium text-gray-700">Retention Period (days)</label>
            <input 
              type="number" 
              id="retention-period" 
              v-model="settings.security.retentionPeriod"
              min="30"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Cookie Consent</h3>
              <p class="text-sm text-gray-500">Show cookie consent banner to users</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.security.cookieConsent" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">API Access</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Enable API Access</h3>
              <p class="text-sm text-gray-500">Allow external applications to access your platform via API</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.security.apiAccess" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="settings.security.apiAccess">
            <button 
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate New API Key
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Permissions Settings -->
    <div v-if="activeTab === 'permissions'" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">User Roles</h2>
          <button 
            type="button"
            @click="openCreateRoleModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus class="w-4 h-4 mr-1" />
            Add Role
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="role in settings.permissions.roles" :key="role.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ role.name }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500">{{ role.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="role.isSystem" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    System
                  </span>
                  <span v-else class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Custom
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button 
                    @click="setDefaultRole(role.id)"
                    :class="[
                      'inline-flex items-center justify-center w-5 h-5 rounded-full',
                      role.isDefault ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    ]"
                  >
                    <Check v-if="role.isDefault" class="w-3 h-3" />
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="openEditRoleModal(role)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit class="w-4 h-4" />
                    <span class="sr-only">Edit</span>
                  </button>
                  <button 
                    v-if="!role.isSystem"
                    @click="deleteRole(role.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <Trash2 class="w-4 h-4" />
                    <span class="sr-only">Delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Role Modal -->
      <div v-if="showRoleModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditingRole ? 'Edit Role' : 'Create New Role' }}
            </h3>
            <button @click="closeRoleModal" class="text-gray-400 hover:text-gray-500">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="px-6 py-4">
            <div class="space-y-4">
              <div>
                <label for="role-name" class="block text-sm font-medium text-gray-700">Role Name</label>
                <input 
                  type="text" 
                  id="role-name" 
                  v-model="roleForm.name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="role-description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  id="role-description" 
                  v-model="roleForm.description"
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="role-default" 
                  v-model="roleForm.isDefault"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="role-default" class="ml-2 block text-sm text-gray-900">
                  Set as default role for new users
                </label>
              </div>
              
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Permissions</h4>
                
                <div v-for="module in settings.permissions.permissionModules" :key="module.id" class="mb-6">
                  <h5 class="text-sm font-medium text-gray-900 mb-2">{{ module.name }}</h5>
                  <div class="bg-gray-50 p-4 rounded-md">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-for="permission in module.permissions" :key="`${module.id}-${permission.id}`" class="flex items-center">
                        <input 
                          type="checkbox" 
                          :id="`${module.id}-${permission.id}`" 
                          v-model="roleForm.permissions[module.id][permission.id]"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label :for="`${module.id}-${permission.id}`" class="ml-2 block text-sm text-gray-900">
                          {{ permission.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
              type="button"
              @click="closeRoleModal"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Cancel
            </button>
            <button 
              type="button"
              @click="saveRole"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ isEditingRole ? 'Update Role' : 'Create Role' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Email Notifications</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">New User Registration</h3>
              <p class="text-sm text-gray-500">Send email when a new user registers</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.newUserEmail" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">New Event Request</h3>
              <p class="text-sm text-gray-500">Send email when a new event is submitted for approval</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.newEventEmail" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Support Ticket</h3>
              <p class="text-sm text-gray-500">Send email when a new support ticket is created</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.supportTicketEmail" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">System Alerts</h3>
              <p class="text-sm text-gray-500">Send email for system alerts and warnings</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.systemAlertsEmail" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">In-App Notifications</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">New User Registration</h3>
              <p class="text-sm text-gray-500">Show notification when a new user registers</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.newUserInApp" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">New Event Request</h3>
              <p class="text-sm text-gray-500">Show notification when a new event is submitted for approval</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.newEventInApp" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Support Ticket</h3>
              <p class="text-sm text-gray-500">Show notification when a new support ticket is created</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.supportTicketInApp" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">System Alerts</h3>
              <p class="text-sm text-gray-500">Show notification for system alerts and warnings</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.systemAlertsInApp" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Email Configuration</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="smtp-host" class="block text-sm font-medium text-gray-700">SMTP Host</label>
              <input 
                type="text" 
                id="smtp-host" 
                v-model="settings.notifications.smtpHost"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="smtp-port" class="block text-sm font-medium text-gray-700">SMTP Port</label>
              <input 
                type="number" 
                id="smtp-port" 
                v-model="settings.notifications.smtpPort"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="smtp-username" class="block text-sm font-medium text-gray-700">SMTP Username</label>
              <input 
                type="text" 
                id="smtp-username" 
                v-model="settings.notifications.smtpUsername"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="smtp-password" class="block text-sm font-medium text-gray-700">SMTP Password</label>
              <input 
                type="password" 
                id="smtp-password" 
                v-model="settings.notifications.smtpPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label for="from-email" class="block text-sm font-medium text-gray-700">From Email Address</label>
            <input 
              type="email" 
              id="from-email" 
              v-model="settings.notifications.fromEmail"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Use SSL/TLS</h3>
              <p class="text-sm text-gray-500">Enable secure connection for email sending</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.notifications.smtpSecure" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div>
            <button 
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Test Email Configuration
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Integration Settings -->
    <div v-if="activeTab === 'integrations'" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Payment Gateways</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Stripe</h3>
              <p class="text-sm text-gray-500">Accept payments via Stripe</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.integrations.stripeEnabled" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="settings.integrations.stripeEnabled" class="pl-6 space-y-4">
            <div>
              <label for="stripe-key" class="block text-sm font-medium text-gray-700">Stripe API Key</label>
              <input 
                type="password" 
                id="stripe-key" 
                v-model="settings.integrations.stripeKey"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="stripe-secret" class="block text-sm font-medium text-gray-700">Stripe Secret Key</label>
              <input 
                type="password" 
                id="stripe-secret" 
                v-model="settings.integrations.stripeSecret"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="stripe-webhook" class="block text-sm font-medium text-gray-700">Webhook Secret</label>
              <input 
                type="password" 
                id="stripe-webhook" 
                v-model="settings.integrations.stripeWebhook"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">PayPal</h3>
              <p class="text-sm text-gray-500">Accept payments via PayPal</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.integrations.paypalEnabled" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="settings.integrations.paypalEnabled" class="pl-6 space-y-4">
            <div>
              <label for="paypal-client-id" class="block text-sm font-medium text-gray-700">PayPal Client ID</label>
              <input 
                type="text" 
                id="paypal-client-id" 
                v-model="settings.integrations.paypalClientId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="paypal-secret" class="block text-sm font-medium text-gray-700">PayPal Secret</label>
              <input 
                type="password" 
                id="paypal-secret" 
                v-model="settings.integrations.paypalSecret"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Sandbox Mode</h3>
                <p class="text-sm text-gray-500">Use PayPal sandbox for testing</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.integrations.paypalSandbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Social Media</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Google Login</h3>
              <p class="text-sm text-gray-500">Allow users to sign in with Google</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.integrations.googleLogin" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="settings.integrations.googleLogin" class="pl-6 space-y-4">
            <div>
              <label for="google-client-id" class="block text-sm font-medium text-gray-700">Google Client ID</label>
              <input 
                type="text" 
                id="google-client-id" 
                v-model="settings.integrations.googleClientId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="google-secret" class="block text-sm font-medium text-gray-700">Google Client Secret</label>
              <input 
                type="password" 
                id="google-secret" 
                v-model="settings.integrations.googleSecret"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Facebook Login</h3>
              <p class="text-sm text-gray-500">Allow users to sign in with Facebook</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.integrations.facebookLogin" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="settings.integrations.facebookLogin" class="pl-6 space-y-4">
            <div>
              <label for="facebook-app-id" class="block text-sm font-medium text-gray-700">Facebook App ID</label>
              <input 
                type="text" 
                id="facebook-app-id" 
                v-model="settings.integrations.facebookAppId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="facebook-secret" class="block text-sm font-medium text-gray-700">Facebook App Secret</label>
              <input 
                type="password" 
                id="facebook-secret" 
                v-model="settings.integrations.facebookSecret"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">AI Integration</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Grok AI</h3>
              <p class="text-sm text-gray-500">Enable Grok AI for automated responses and assistance</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.integrations.grokEnabled" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="settings.integrations.grokEnabled" class="pl-6 space-y-4">
            <div>
              <label for="grok-api-key" class="block text-sm font-medium text-gray-700">Grok API Key</label>
              <input 
                type="password" 
                id="grok-api-key" 
                v-model="settings.integrations.grokApiKey"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="grok-model" class="block text-sm font-medium text-gray-700">Grok Model</label>
              <select 
                id="grok-model" 
                v-model="settings.integrations.grokModel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="grok-1">Grok-1</option>
                <option value="grok-1-mini">Grok-1 Mini</option>
                <option value="grok-2">Grok-2</option>
              </select>
            </div>
            <div>
              <label for="grok-temperature" class="block text-sm font-medium text-gray-700">Response Temperature (0-1)</label>
              <input 
                type="range" 
                id="grok-temperature" 
                v-model="settings.integrations.grokTemperature"
                min="0" 
                max="1" 
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div class="flex justify-between text-xs text-gray-500">
                <span>More Focused</span>
                <span>More Creative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appearance Settings -->
    <div v-if="activeTab === 'appearance'" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Theme</h2>
        <div class="space-y-4">
          <div>
            <label for="primary-color" class="block text-sm font-medium text-gray-700">Primary Color</label>
            <div class="mt-1 flex items-center">
              <input 
                type="color" 
                id="primary-color" 
                v-model="settings.appearance.primaryColor"
                class="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input 
                type="text" 
                v-model="settings.appearance.primaryColor"
                class="ml-2 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label for="secondary-color" class="block text-sm font-medium text-gray-700">Secondary Color</label>
            <div class="mt-1 flex items-center">
              <input 
                type="color" 
                id="secondary-color" 
                v-model="settings.appearance.secondaryColor"
                class="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input 
                type="text" 
                v-model="settings.appearance.secondaryColor"
                class="ml-2 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label for="accent-color" class="block text-sm font-medium text-gray-700">Accent Color</label>
            <div class="mt-1 flex items-center">
              <input 
                type="color" 
                id="accent-color" 
                v-model="settings.appearance.accentColor"
                class="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input 
                type="text" 
                v-model="settings.appearance.accentColor"
                class="ml-2 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Dark Mode</h3>
              <p class="text-sm text-gray-500">Enable dark mode option for users</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.appearance.darkMode" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Logo & Branding</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Platform Logo</label>
            <div class="mt-1 flex items-center">
              <div class="h-16 w-16 rounded-md border border-gray-300 bg-gray-100 flex items-center justify-center">
                <img v-if="settings.appearance.logoUrl" :src="settings.appearance.logoUrl" alt="Logo" class="h-14 w-14 object-contain" />
                <span v-else class="text-gray-400">No logo</span>
              </div>
              <button 
                type="button"
                class="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload Logo
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Favicon</label>
            <div class="mt-1 flex items-center">
              <div class="h-10 w-10 rounded-md border border-gray-300 bg-gray-100 flex items-center justify-center">
                <img v-if="settings.appearance.faviconUrl" :src="settings.appearance.faviconUrl" alt="Favicon" class="h-8 w-8 object-contain" />
                <span v-else class="text-gray-400">No icon</span>
              </div>
              <button 
                type="button"
                class="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload Favicon
              </button>
            </div>
          </div>
          <div>
            <label for="custom-css" class="block text-sm font-medium text-gray-700">Custom CSS</label>
            <textarea 
              id="custom-css" 
              v-model="settings.appearance.customCss"
              rows="5"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
              placeholder="/* Add your custom CSS here */"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Layout</h2>
        <div class="space-y-4">
          <div>
            <label for="layout-type" class="block text-sm font-medium text-gray-700">Default Layout</label>
            <select 
              id="layout-type" 
              v-model="settings.appearance.defaultLayout"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="standard">Standard</option>
              <option value="compact">Compact</option>
              <option value="wide">Wide</option>
            </select>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Sidebar Collapsed by Default</h3>
              <p class="text-sm text-gray-500">Start with sidebar collapsed for new users</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.appearance.sidebarCollapsed" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">Show Footer</h3>
              <p class="text-sm text-gray-500">Display footer with copyright and links</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.appearance.showFooter" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end mt-6">
      <button 
        type="button"
        @click="saveSettings"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save Settings
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { Cog, Shield, Bell, Plug, Palette, UserPlus, Plus, Trash2, Edit, Check, X } from "lucide-vue-next";

// Tabs configuration
const tabs = [
  { id: "general", name: "General", icon: Cog },
  { id: "security", name: "Security", icon: Shield },
  { id: "permissions", name: "Permissions", icon: UserPlus },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "integrations", name: "Integrations", icon: Plug },
  { id: "appearance", name: "Appearance", icon: Palette },
];

// Active tab state
const activeTab = ref("general");

// Settings data
const settings = ref({
  general: {
    platformName: "Event Management Platform",
    platformUrl: "https://events.example.com",
    platformDescription: "A comprehensive platform for managing events of all sizes.",
    supportEmail: "support@example.com",
    supportPhone: "+1 (555) 123-4567",
    businessAddress: "123 Main Street\nSuite 456\nNew York, NY 10001",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    language: "en",
  },
  security: {
    twoFactorAuth: true,
    strongPasswords: true,
    sessionTimeout: 30,
    dataRetention: false,
    retentionPeriod: 365,
    cookieConsent: true,
    apiAccess: false,
  },
  permissions: {
    roles: [
      {
        id: 1,
        name: "Super Admin",
        description: "Full access to all features and settings",
        isDefault: false,
        isSystem: true,
        permissions: {
          dashboard: { view: true, edit: true },
          users: { view: true, create: true, edit: true, delete: true },
          events: { view: true, create: true, edit: true, delete: true, approve: true },
        },
      },
      {
        id: 2,
        name: "Admin",
        description: "Access to most features except critical settings",
        isDefault: false,
        isSystem: true,
        permissions: {
          dashboard: { view: true, edit: true },
          users: { view: true, create: true, edit: true, delete: false },
          events: { view: true, create: true, edit: true, delete: false, approve: true },
        },
      },
    ],
    permissionModules: [
      {
        id: "dashboard",
        name: "Dashboard",
        permissions: [
          { id: "view", name: "View Dashboard" },
          { id: "edit", name: "Edit Dashboard Widgets" },
        ],
      },
      {
        id: "users",
        name: "User Management",
        permissions: [
          { id: "view", name: "View Users" },
          { id: "create", name: "Create Users" },
          { id: "edit", name: "Edit Users" },
          { id: "delete", name: "Delete Users" },
        ],
      },
    ],
  },
  notifications: {
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpUsername: "notifications@example.com",
    smtpPassword: "",
    fromEmail: "no-reply@example.com",
    smtpSecure: true,
  },
});

// Role Management
const showRoleModal = ref(false);
const isEditingRole = ref(false);
const roleForm = ref({
  id: null,
  name: "",
  description: "",
  isDefault: false,
  isSystem: false,
  permissions: {},
});

const openCreateRoleModal = () => {
  const permissions = {};
  settings.value.permissions.permissionModules.forEach((module) => {
    permissions[module.id] = {};
    module.permissions.forEach((perm) => {
      permissions[module.id][perm.id] = false;
    });
  });

  roleForm.value = {
    id: Date.now(),
    name: "",
    description: "",
    isDefault: false,
    isSystem: false,
    permissions,
  };

  isEditingRole.value = false;
  showRoleModal.value = true;
};

const openEditRoleModal = (role) => {
  if (role.isSystem) {
    alert("System roles cannot be edited.");
    return;
  }

  roleForm.value = JSON.parse(JSON.stringify(role)); // Deep copy
  isEditingRole.value = true;
  showRoleModal.value = true;
};

const closeRoleModal = () => {
  showRoleModal.value = false;
};

const saveRole = () => {
  if (!roleForm.value.name.trim()) {
    alert("Role name is required.");
    return;
  }

  if (isEditingRole.value) {
    const index = settings.value.permissions.roles.findIndex((r) => r.id === roleForm.value.id);
    if (index !== -1) {
      settings.value.permissions.roles[index] = { ...roleForm.value };
    }
  } else {
    settings.value.permissions.roles.push({ ...roleForm.value });
  }

  closeRoleModal();
};

const deleteRole = (roleId) => {
  const role = settings.value.permissions.roles.find((r) => r.id === roleId);
  if (role.isSystem) {
    alert("System roles cannot be deleted.");
    return;
  }

  if (confirm("Are you sure you want to delete this role?")) {
    settings.value.permissions.roles = settings.value.permissions.roles.filter((r) => r.id !== roleId);
  }
};

const setDefaultRole = (roleId) => {
  settings.value.permissions.roles.forEach((role) => {
    role.isDefault = role.id === roleId;
  });
};

// Save Settings
const saveSettings = () => {
  console.log("Saving settings:", settings.value);
  alert("Settings saved successfully!");
};
</script>