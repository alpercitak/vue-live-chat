import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLiveChatStore = defineStore('liveChat', () => {
  const connection = ref(null);
  const isConnectionOpen = ref(false);
  const id = ref('');
  const name = ref('');
  // const message = ref('');
  const peers = ref([]);
  const messages = ref([]);

  function setName() {
    connection.value.send(JSON.stringify({ type: 'setName', value: name.value }));
  }

  return {
    connection,
    id,
    name,
    // message,
    peers,
    messages,
    isConnectionOpen,
    setName,
  };
});
