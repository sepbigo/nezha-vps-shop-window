<template>
  <div class="flex flex-col justify-center items-end text-nowrap text-right text-xs font-normal text-muted-foreground">
    <span v-if="net_in_speed">{{ numberFormat(net_in_speed) }}</span>
    <span v-if="net_out_speed">{{ numberFormat(net_out_speed) }}</span>
  </div>
</template>
<script setup>
defineProps({
  percentage: {
    type: [Number, String],
    default: 0,
  },
  net_out_speed: {
    type: [Number, String],
    default: 0,
  },
  net_in_speed: {
    type: [Number, String],
    default: 0,
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
})

function numberFormat(number) {
  let speed = parseFloat(number) / 1024 / 1024;
  return speed >= 1024 ? `${(speed / 1024).toFixed(2)} GB/s` : speed >= 1 ? `${speed.toFixed(2)} MB/s` : `${(speed * 1024).toFixed(2)} KB/s`
}
</script>

<style scoped></style>
