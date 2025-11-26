import { defineStore } from 'pinia'

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    selectedEventId: null, // Store the selected event ID
  }),
  actions: {
    setSelectedEventId(eventId) {
      this.selectedEventId = eventId
    },
  },
})
