<script setup>
import { useStore } from '@/stores';
import { useWebSocket } from '@vueuse/core';
import { onMounted, onUnmounted, ref } from 'vue';
import LayoutMain from './components/LayoutMain.vue';
import ListCard from './components/ListCard.vue';

const store = useStore();
const wsStatus = ref('disconnected');
const reconnectAttempts = ref(0);
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;
const messageQueue = ref([]);
const isProcessingQueue = ref(false);

const { status } = useWebSocket('/api/v1/ws/server', {
  autoReconnect: {
    retries: MAX_RECONNECT_ATTEMPTS,
    delay: RECONNECT_DELAY,
    onFailed() {
      console.error('WebSocket连接失败，请检查网络连接');
      wsStatus.value = 'error';
      if (reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS) {
        store.setError('WebSocket连接失败，请刷新页面重试');
      }
    }
  },
  heartbeat: {
    message: 'ping',
    interval: 30000,
    pongTimeout: 10000,
  },
  onConnected() {
    wsStatus.value = 'connected';
    reconnectAttempts.value = 0;
    console.log('WebSocket已连接');
    processMessageQueue();
  },
  onDisconnected() {
    wsStatus.value = 'disconnected';
    reconnectAttempts.value++;
    console.log('WebSocket已断开');
  },
  onError(ws, event) {
    console.error('WebSocket错误:', event);
    wsStatus.value = 'error';
  },
  onMessage: (ws, e) => {
    try {
      messageQueue.value.push(e);
      if (!isProcessingQueue.value) {
        processMessageQueue();
      }
    } catch (error) {
      console.error('处理WebSocket消息时出错:', error);
    }
  }
});

const list = ref([]);
const publicNote = ref([]);
const OFFLINE_THRESHOLD = 30000;

async function processMessageQueue() {
  if (messageQueue.value.length === 0 || isProcessingQueue.value) return;

  isProcessingQueue.value = true;
  while (messageQueue.value.length > 0) {
    const e = messageQueue.value.shift();
    await processMessage(e);
  }
  isProcessingQueue.value = false;
}

async function processMessage(e) {
  if (!e.data) return;

  try {
    const data = JSON.parse(e.data);
    const servers = data?.servers || [];
    const currentTime = Date.now();

    list.value = servers.map(server => {
      const lastActiveTime = new Date(server.last_active).getTime();
      if (server.public_note) {
        try {
          publicNote.value.push(JSON.parse(server.public_note));
        } catch (noteError) {
          console.error('解析公告数据失败:', noteError);
        }
      }

      return {
        ...server,
        online: (currentTime - lastActiveTime) <= OFFLINE_THRESHOLD
      };
    });
  } catch (error) {
    console.error('处理WebSocket消息失败:', error);
  }
}

onMounted(() => {
  // 初始化WebSocket连接
  if (status.value === 'CLOSED') {
    wsStatus.value = 'connecting';
  }
});

onUnmounted(() => {
  // 清理工作
  messageQueue.value = [];
  isProcessingQueue.value = false;
});
</script>

<template>
  <LayoutMain>
    <ListCard :list="list" :status="status" :publicNote="publicNote" />
  </LayoutMain>
</template>

<style scoped></style>
