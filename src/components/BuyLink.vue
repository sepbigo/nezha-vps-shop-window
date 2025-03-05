<template>
  <a :class="cn('flex w-[150px] items-center justify-between focus-visible:outline-none shadow [&_.icon]:hover:bg-primary/80')"
    :href="data.link" target="_blank">
    <div
      :class="cn('bg-secondary flex flex-1 items-center whitespace-nowrap rounded-l text-xs font-medium transition-colors border border-r-0 focus-visible:ring-1 text-secondray-foreground h-8 px-3 py-0.5')">
      {{ data.amount == 0 ? $t('free') : `${data.amount} / ${data.cycle}` }}
    </div>
    <div
      :class="cn('icon h-8 px-4 bg-primary text-primary-foreground py-0.5 text-sm rounded-r flex items-center whitespace-nowrap transition-colors [&_svg]:size-4 [&_svg]:shrink-0')">
      <ShoppingCart />
    </div>
  </a>
</template>
<script setup>
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-vue-next';
defineProps({
  data: {
    type: Object,
    default() {
      return {
        amount: '0.00',
        startDate: '',
        endDate: '',
        cycle: '年',
        autoRenewal: '0',
        link: '',
      }
    }
  },
})
</script>

<style scoped></style>
