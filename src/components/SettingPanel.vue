<template>
  <div class="mt-6">
    <div class="flex flex-col gap-2 items-start justify-between">
      <label for="theme">{{ $t('theme') }}</label>
      <div class="grid grid-cols-3 gap-2">
        <Button variant="secondary"
          class="inline-flex items-center border py-2 h-8 justify-start px-2 md:px-5 bg-secondary"
          :class="{ 'border-primary': item === store.currentTheme }" v-for="item in store.themeList"
          :key="item" @click="store.changeTheme(item)">
          <span :class="`theme-${item}`">
            <i class="inline-flex size-3 bg-primary cursor-pointer"></i>
          </span>
          <span>{{ item }}</span>
        </Button>
      </div>
    </div>
    <div class="mt-5 flex items-center justify-between">
      <label for="theme">{{ $t('semitransparent') }}</label>
      <Switch :model-value="store.useSemitransparent" @update:model-value="store.toggleSemitransparent">
      </Switch>
    </div>
    <div class="mt-5 flex items-center justify-between">
      <label for="theme">{{ $t('backgroundImage') }}</label>
      <Switch :model-value="store.useBackgroundImage" @update:model-value="handleBackgroundImageToggle">
      </Switch>
    </div>
  </div>
</template>
<script setup>
import { Button } from '@/components/shadcn/ui/button';
import { Switch } from '@/components/shadcn/ui/switch';
import { useStore } from '@/stores';

const store = useStore();

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

function handleBackgroundImageToggle(value) {
  store.toggleBackgroundImage();
  if (value) {
    store.setBackgroundImage(`https://picsum.photos/1920/1080?random=${Math.random()}`);
  }
}
</script>

<style scoped></style>
