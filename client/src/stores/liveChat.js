import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLiveChatStore = defineStore('liveChat', () => {
  const connection = ref(null);
  const isConnectionOpen = ref(false);
  const peerId = ref('');
  const peers = ref([]);

  return {
    connection,
    peerId,
    peers,
    isConnectionOpen,
  };
});
