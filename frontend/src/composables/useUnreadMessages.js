import { ref } from 'vue'
const unreadMessages = ref(0)
export function useUnreadMessages() { return { unreadMessages } }
