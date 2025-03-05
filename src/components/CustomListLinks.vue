<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon" class="shrink-0 md:hidden">
        <Link class="h-5 w-5" />
        <span class="sr-only">Toggle custom links</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem v-for="(item, index) in links" :key="index">
        <a class="flex flex-1 justify-between items-center py-2" :href="item.link" target="_blank"
          rel="noopener nofollow">
          <span>{{ item.name }}</span>
          <div v-if="item.svg" v-html="formatSvg(item.svg)"></div>
        </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<script setup>
import { Button } from '@/components/shadcn/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu';
import { Link } from 'lucide-vue-next';
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
