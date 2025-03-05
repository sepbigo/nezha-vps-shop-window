<template>
  <div class="flex flex-raw flex-wrap gap-2 justify-start items-center">
    <Badge variant="outline" class="font-sans font-normal rounded py-0 text-muted-foreground" v-if="data?.networkRoute">
      {{
        data?.networkRoute
      }}</Badge>
    <Badge variant="outline" class="font-sans font-normal rounded py-0 text-muted-foreground" v-if="data?.bandwidth">{{
      data?.bandwidth }}
    </Badge>
    <Badge variant="outline" class="font-sans font-normal rounded py-0 text-muted-foreground" v-if="data?.trafficVol">{{
      data?.trafficVol }}
    </Badge>
    <Badge variant="outline" class="font-sans font-normal rounded py-0 text-muted-foreground" v-if="data?.IPv4 == 1">
      IPv4
    </Badge>
    <Badge variant="outline" class="font-sans font-normal rounded py-0 text-muted-foreground" v-if="data?.IPv6 == 1">
      IPv6
    </Badge>
    <Badge variant="outline" v-for="(item, index) in extraData" :key="index"
      class="font-sans font-normal rounded py-0 text-muted-foreground">
      {{ item }}
    </Badge>
  </div>
</template>
<script setup>
import { Badge } from '@/components/shadcn/ui/badge';
import { computed } from 'vue';
const props = defineProps({
  data: {
    type: Object,
    default() {
      return {}
    }
  },
})

const extraData = computed(() => {
  let arr = [];
  let extraArr = props.data?.extra?.split(',');
  try {
    extraArr?.map(e => {
      if (e) {
        arr.push(e)
      }
    })
  } catch (error) {
    console.log(error)
  }
  return arr
})
</script>

<style scoped></style>
