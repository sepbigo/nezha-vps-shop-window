<script setup>
import { useWebSocket } from '@vueuse/core';
import { ref } from 'vue';
import LayoutMain from './components/LayoutMain.vue';
import ListCard from './components/ListCard.vue';

const wsStatus = ref('disconnected')
const { status } = useWebSocket('/api/v1/ws/server', {
  autoReconnect: {
    retries: Infinity, // 无限重试
    delay: 3000, // 增加重连延迟到3秒
    onFailed() {
      console.error('WebSocket连接失败，请检查网络连接')
    }
  },
  heartbeat: {
    message: 'ping',
    interval: 30000, // 增加心跳间隔到30秒
    pongTimeout: 10000, // 添加 pong 超时时间
  },
  onConnected() {
    wsStatus.value = 'connected'
    console.log('WebSocket已连接')
  },
  onDisconnected() {
    wsStatus.value = 'disconnected'
    console.log('WebSocket已断开')
  },
  onError(ws, event) {
    console.error('WebSocket错误:', event)
  },
  onMessage: (ws, e) => {
    try {
      onWSMessage(ws, e)
    } catch (error) {
      console.error('处理WebSocket消息时出错:', error)
    }
  }
})

const list = ref([]);
const publicNote = ref([]);

const OFFLINE_THRESHOLD = 30000;

function onWSMessage(ws, e) {
  try {
    if (!e.data) return;

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
</script>

<template>
  <LayoutMain>
    <ListCard :list="list" :status="status" :publicNote="publicNote" />
  </LayoutMain>
</template>

<style scoped></style>
