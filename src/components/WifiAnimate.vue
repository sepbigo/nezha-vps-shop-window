<script setup>
import { WifiZero, WifiLow, WifiHigh, Wifi } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const currentIndex = ref(0);
const wifiIcons = [WifiZero, WifiLow, WifiHigh, Wifi];
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % wifiIcons.length;
  }, 300);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div class="wifi-animate size-4 text-green-600">
    <component :is="wifiIcons[currentIndex]" />
  </div>
</template>

<style scoped>
.wifi-animate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
