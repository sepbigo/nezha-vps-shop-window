<template>
  <div class="flex flex-row items-center">
    <a v-for="(item, index) in links" :key="index" class="mx-2 flex flex-row" :href="item.link" target="_blank"
      rel="noopener nofollow">
      <span class="mx-1">{{ item.name }}</span>
      <div v-if="item.svg" v-html="formatSvg(item.svg)"></div>
    </a>
  </div>
</template>
<script setup>
defineProps({
  links: {
    type: Array,
    default() {
      return []
    }
  },
})

function formatSvg(svg) {
  return decodeURIComponent(svg);
}
</script>

<style scoped></style>
