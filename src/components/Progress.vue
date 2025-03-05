<template>
  <div class="flex flex-col items-end justify-start">
    <div class="text-xs" :class="{ 'mt-1': showLabel }">{{ percentage }}%</div>
    <Progress v-if="!onlyText" class="h-1 rounded-none" :model-value="percentageFormat" data-state="loading" />
  </div>
</template>
<script setup>
import { Progress } from '@/components/shadcn/ui/progress';
import { computed } from 'vue';

const percentageFormat = computed(() => {
  return parseFloat(props.percentage);
})
const props = defineProps({
  type: {
    type: String,
    default: 'line'
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  percentage: {
    type: [Number, String],
    default: 0,
  },
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  onlyText: {
    type: Boolean,
    default: false
  },
})
</script>

<style scoped></style>
