<template>
  <i class="fi h-4 shadow" :class="`${className}`" :title="countryCode"></i>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  countryCode: {
    type: String,
    default: '',
  },
  online: {
    type: Boolean,
    default: false,
  },
})

const className = computed(() => {
  return `fi-${props.countryCode.toLowerCase()}`
})
</script>

<style scoped></style>
