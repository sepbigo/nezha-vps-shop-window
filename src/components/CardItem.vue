<script setup>
import { cn } from '@/lib/utils';
import { useStore } from '@/stores';
const store = useStore();
defineProps({
  label: {
    type: String,
    default() {
      return ''
    }
  },
  online: {
    type: Boolean,
    default() {
      return false
    }
  }
})
</script>
<template>
  <div class="flex flex-col gap-1 justify-start items-center">
    <slot v-if="online" />
    <span v-else>-</span>
    <div class="w-full px-1 text-xs rounded-b-md">
      <span
        class="block relative text-center after:absolute after:block after:content-[''] after:bottom-0 after:-left-1 after:-right-1 z-10 after:rounded-full after:h-2 after:-z-10"
        :class="cn(
      store.preferences.customTheme === 'yellow'
        ? label === 'remaining' ? 'text-primary-foreground' : 'text-muted-foreground'
        : 'text-muted-foreground',
      store.preferences?.useSemitransparent
        ? store.preferences?.customTheme === 'yellow' ? 'after:bg-primary/30' : 'after:bg-primary/20'
        : 'after:bg-primary/10'
    )">
        {{ $t(label) }}
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
