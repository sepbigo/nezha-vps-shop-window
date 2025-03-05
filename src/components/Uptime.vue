<template>
  <div class="flex flex-row items-center text-xs">
    <span>{{ formatTime }}</span>
  </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
  showIcon: {
    type: Boolean,
    default: false
  },
  time: {
    type: [Number, String],
    default: '',
  },
})

const formatTime = computed(() => {
  const seconds = Number(props.time);
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分`;
  } else if (seconds < 3600 * 24) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}时`;
  } else if (seconds < 3600 * 24 * 365) {
    const days = Math.floor(seconds / (3600 * 24));
    return `${days}天`;
  } else {
    const years = Math.floor(seconds / (3600 * 24 * 365));
    return `${years}年`;
  }
})
</script>

<style scoped></style>
