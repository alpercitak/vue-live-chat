<template>
  <div class="main">
    <div class="container-peers">
      <div class="name">
        <input type="text" v-model="name" placeholder="Name" />
      </div>
      <div class="peer" v-for="peer in peers" v-bind:class="(peer.id === id) ? 'self' : ''" :key="peer.id">
        {{peer.id}}
        {{peer.name ? `(${peer.name})`: ''}}
      </div>
    </div>
    <div class="container-chat">
      <div class="container-message-list" ref="messagesContainer">
        <div class="container-message" v-for="item in messages" :key="item.id"
          :set="senderName = getSenderName(item.senderId)" v-bind:class="(item.senderId === id) ? 'self' : ''">
          <div class="info">
            <div>{{ item.dateTime | dateFormat }}</div>
            <div>
              {{ item.senderId }}
              {{ senderName ? `(${senderName})` :'' }}
            </div>
          </div>
          <div class="message">{{ item.message }}</div>
        </div>
      </div>
      <div class="container-message-send">
        <input type="text" v-model="message" v-on:keyup.enter="sendMessage()" />
        <button v-on:click="sendMessage()">Send Message</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiveChat',
  data: function () {
    return {
      peers: [],
      messages: [],
      message: '',
      id: '',
      name: '',
      connection: null
    }
  },
  created: function () {
    let self = this;

    this.connection = new WebSocket('ws://localhost:3000/');
    this.connection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type == 'setPeers') {
        this.peers = data.value;
      }
      if (data.type == 'sendMessage') {
        this.messages.push({
          id: data.id,
          senderId: data.senderId,
          message: data.message,
          dateTime: new Date(),
        });
      }
      if (data.type == 'setId') {
        this.id = data.value;
      }
    }
    this.connection.onopen = function () {
      if (localStorage.name) {
        self.name = localStorage.name;
      }
      self.setName();
      this.send(JSON.stringify({type: 'getPeers'}));
    }
  },
  methods: {
    sendMessage: function () {
      if (!this.message) {
        return;
      }
      this.connection.send(JSON.stringify({type: 'sendMessage', value: this.message}));
      this.message = '';
    },
    setName: function () {
      this.connection.send(JSON.stringify({type: 'setName', value: this.name}));
    },
    getSenderName: function (senderId) {
      return this.peers.find(x => x.id === senderId)?.name;
    },
    scrollToElement() {
      const el = this.$refs.scrollToMe;

      if (el) {
        el.scrollIntoView({behavior: 'smooth'});
      }
    }
  },
  filters: {
    dateFormat: function (value) {
      const YYYY = value.getFullYear();
      const MM = (value.getMonth() + 1).toString().padStart(2, '0');
      const DD = value.getDate();
      const HH = value.getHours();
      const mm = value.getMinutes();
      const ss = value.getSeconds().toString().padStart(2, '0');
      return `${DD}-${MM}-${YYYY} ${HH}:${mm}:${ss}`;
    }
  },
  watch: {
    messages: function () {
      this.$nextTick(function () {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    name: function (newName) {
      localStorage.name = newName;
      this.setName();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container() {
  border: 1px solid #DDD;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.row() {
  border: 1px solid #CCC;
  background-color: #EEE;

  &.self {
    background-color: rgba(0, 255, 0, 0.2);
  }
}

.self() {}

.main {
  height: 100%;
  display: flex;
  flex-direction: row;
}

.container-peers {
  .container;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-basis: 25%;
  overflow: auto;

  .name {
    display: flex;
    width: 100%;

    input {
      width: 100%;
    }
  }

  .peer {
    .row;
    padding: 2px;
    width: 100%;
    font-size: 12px;
    display: flex;
    align-items: flex-start;
  }
}

.container-chat {
  .container;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;

  .container-message-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;

    .container-message {
      .row;
      flex-basis: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
      flex-basis: 0;

      .info {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }

      .message {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .container-message-send {
    align-self: flex-end;
    display: flex;
    width: 100%;
    gap: 8px;

    input {
      flex: 1;
    }
  }
}
</style>
