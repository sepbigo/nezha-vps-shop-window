<template>
  <ul class="w-full max-w-sm mx-auto p-3 pt-0 text-sm">
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">系统:</span>
      <span class="flex-1">
        {{
          data?.host?.platform }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">CPU:</span>
      <span class="flex-1">
        {{
          data?.host?.cpu?.join('<br />') }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">硬盘:</span>
      <span class="flex-1">
        {{
          formatBytes(data?.state?.disk_used) }} / {{
          formatBytes(data?.host?.disk_total) }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">内存:</span>
      <span class="flex-1">
        {{
          formatBytes(data?.state?.mem_used) }} / {{
          formatBytes(data?.host?.mem_total) }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">流量:</span>
      <span class="flex-1">
        {{
          formatBytes(data?.state?.net_in_transfer) }} / {{
          formatBytes(data?.state?.net_out_transfer) }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">Load:</span>
      <span class="flex-1">
        {{
          data?.state?.load_1?.toFixed(2) || 0 }} / {{
          data?.state?.load_5?.toFixed(2) || 0 }} / {{
          data?.state?.load_15?.toFixed(2) || 0 }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">启动:</span>
      <span class="flex-1">
        {{
          data?.host?.boot_time }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">活动:</span>
      <span class="flex-1">
        {{
          data?.last_active }}</span>
    </li>
    <li class="flex flex-row justify-start items-start py-1">
      <span class="inline-flex w-[60px] text-right mr-1">在线:</span>
      <span class="flex-1">
        {{
          data?.state?.uptime }}</span>
    </li>
  </ul>
</template>
<script setup>
import { formatBytes } from '@/lib/function';
defineProps({
  data: {
    type: Object,
    default() {
      return {}
    }
  },
})
</script>

<style scoped></style>
