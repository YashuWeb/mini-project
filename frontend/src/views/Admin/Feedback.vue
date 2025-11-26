<template>
  <div class="space-y-6">
    <!-- Search and Filters -->
    <div class="flex items-center justify-between">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search feedback..."
        class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>

    <!-- Status Filters -->
    <div class="flex space-x-2">
      <button
        v-for="filter in statusFilters"
        :key="filter.value"
        @click="toggleStatusFilter(filter.value)"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md',
          isStatusFilterActive(filter.value)
            ? `bg-${filter.color}-100 text-${filter.color}-800`
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        ]"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Feedback Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Subject
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Event
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="feedback in filteredFeedback"
            :key="feedback.id"
            @click="openFeedbackDetail(feedback)"
            class="hover:bg-gray-50 cursor-pointer"
          >
            <td class="px-6 py-4 text-sm text-gray-900">{{ feedback.subject }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ feedback.event }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(feedback.status)">
                {{ feedback.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(feedback.date) }}
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button
                v-if="feedback.status === 'New'"
                @click.stop="markAsInProgress(feedback)"
                class="text-yellow-600 hover:text-yellow-900"
              >
                Mark as In Progress
              </button>
              <button
                v-if="feedback.status === 'In Progress'"
                @click.stop="markAsResolved(feedback)"
                class="text-green-600 hover:text-green-900"
              >
                Mark as Resolved
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500">
        Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalFeedback }} results
      </p>
      <div class="flex space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Feedback Detail Modal -->
    <div v-if="selectedFeedback" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Feedback Details</h3>
          <button @click="selectedFeedback = null" class="text-gray-400 hover:text-gray-500">
            Close
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p><strong>Subject:</strong> {{ selectedFeedback.subject }}</p>
          <p><strong>Event:</strong> {{ selectedFeedback.event }}</p>
          <p><strong>Message:</strong> {{ selectedFeedback.message }}</p>
          <p><strong>Status:</strong> {{ selectedFeedback.status }}</p>
          <p><strong>Date:</strong> {{ formatDate(selectedFeedback.date) }}</p>

          <!-- Admin Response Section -->
          <div v-if="selectedFeedback.status !== 'Resolved'">
            <label for="response" class="block text-sm font-medium text-gray-700">Response</label>
            <textarea
              id="response"
              v-model="responseMessage"
              placeholder="Write your response here..."
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
            <div class="flex justify-end space-x-3 mt-4">
              <button
                @click="submitResponse"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit Response
              </button>
              <button
                @click="selectedFeedback = null"
                class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200"
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

<script>
import { ref, computed, onMounted } from "vue";

export default {
  name: "FeedbackManagement",
  setup() {
    const feedbackItems = ref([]);
    const selectedFeedback = ref(null);
    const searchQuery = ref("");
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const activeStatusFilters = ref(["New"]); // Default to "New" section
    const sortOrder = ref("desc"); // 'asc' or 'desc'
    const responseMessage = ref("");

    // Status filter options
    const statusFilters = [
      { label: "New", value: "New", color: "green" },
      { label: "In Progress", value: "In Progress", color: "yellow" },
      { label: "Resolved", value: "Resolved", color: "purple" },
    ];

    // Generate mock data
    onMounted(() => {
      const mockFeedback = [];
      const statuses = ["New", "In Progress", "Resolved"];
      const events = [
        "Summer Music Festival 2023",
        "Tech Conference 2023",
        "Food & Wine Expo",
        "Charity Gala Dinner",
        "Art Exhibition Opening",
      ];
      const subjects = [
        "Issue with ticket scanning",
        "Suggestion for event layout",
        "Complaint about venue facilities",
        "Positive feedback on staff",
        "Question about refund policy",
      ];

      for (let i = 1; i <= 45; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        const status = statuses[Math.floor(Math.random() * statuses.length)];

        mockFeedback.push({
          id: i,
          subject: subjects[Math.floor(Math.random() * subjects.length)],
          event: events[Math.floor(Math.random() * events.length)],
          message: `This is a detailed feedback message for item ${i}.`,
          date: date,
          status: status,
        });
      }

      feedbackItems.value = mockFeedback;
    });

    // Filter feedback based on search query and active filters
    const filteredFeedback = computed(() => {
      let result = [...feedbackItems.value];

      // Apply status filters
      if (activeStatusFilters.value.length > 0) {
        result = result.filter((item) =>
          activeStatusFilters.value.includes(item.status)
        );
      }

      // Apply search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
          (item) =>
            item.subject.toLowerCase().includes(query) ||
            item.event.toLowerCase().includes(query) ||
            item.message.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      result.sort((a, b) => {
        if (sortOrder.value === "asc") {
          return new Date(a.date) - new Date(b.date);
        } else {
          return new Date(b.date) - new Date(a.date);
        }
      });

      return result;
    });

    // Pagination
    const paginatedFeedback = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredFeedback.value.slice(start, end);
    });

    const totalFeedback = computed(() => filteredFeedback.value.length);
    const totalPages = computed(() =>
      Math.ceil(totalFeedback.value / itemsPerPage)
    );
    const paginationStart = computed(
      () => (currentPage.value - 1) * itemsPerPage + 1
    );
    const paginationEnd = computed(() =>
      Math.min(currentPage.value * itemsPerPage, totalFeedback.value)
    );

    // Methods
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getStatusClass = (status) => {
      switch (status) {
        case "New":
          return "px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800";
        case "In Progress":
          return "px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800";
        case "Resolved":
          return "px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800";
        default:
          return "px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800";
      }
    };

    const toggleStatusFilter = (status) => {
      if (activeStatusFilters.value.includes(status)) {
        activeStatusFilters.value = [];
      } else {
        activeStatusFilters.value = [status];
      }
      currentPage.value = 1;
    };

    const isStatusFilterActive = (status) => {
      return activeStatusFilters.value.includes(status);
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const openFeedbackDetail = (feedback) => {
      selectedFeedback.value = { ...feedback };
    };

    const markAsInProgress = (feedback) => {
      feedback.status = "In Progress";
    };

    const markAsResolved = (feedback) => {
      feedback.status = "Resolved";
    };

    const submitResponse = () => {
      if (selectedFeedback.value) {
        console.log("Response submitted:", responseMessage.value);
        responseMessage.value = "";
        selectedFeedback.value = null;
      }
    };

    return {
      feedbackItems,
      filteredFeedback: paginatedFeedback,
      selectedFeedback,
      searchQuery,
      currentPage,
      activeStatusFilters,
      statusFilters,
      sortOrder,
      totalFeedback,
      totalPages,
      paginationStart,
      paginationEnd,
      formatDate,
      getStatusClass,
      toggleStatusFilter,
      isStatusFilterActive,
      prevPage,
      nextPage,
      openFeedbackDetail,
      markAsInProgress,
      markAsResolved,
      responseMessage,
      submitResponse,
    };
  },
};
</script>
