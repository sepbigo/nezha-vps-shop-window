<script setup>
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/ui/card';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcn/ui/tooltip';
import { cn } from '@/lib/utils';
import { useStore } from '@/stores';
import { PcCase, Wifi, WifiOff } from 'lucide-vue-next';
import { computed } from 'vue';
import BuyLink from './BuyLink.vue';
import CardItem from './CardItem.vue';
import IconCountry from './IconCountry.vue';
import PlanDataMod from './PlanDataMod.vue';
import Platform from './Platform.vue';
import Progress from './Progress.vue';
import RemainingPrice from './RemainingPrice.vue';
import RemainingProgress from './RemainingProgress.vue';
import SpeedProgress from './SpeedProgress.vue';
import Uptime from './Uptime.vue';
import WifiAnimate from './WifiAnimate.vue';
const store = useStore();

const props = defineProps({
  list: {
    type: Array,
    default() {
      return []
    }
  },
  publicNote: {
    type: Array,
    default() {
      return []
    }
  },
  status: {
    type: String,
    default() {
      return 'OPEN'
    }
  }
})

const onlineCount = computed(() => {
  return props.list.filter(e => {
    return e.online
  }).length;
})
const offlineCount = computed(() => {
  return props.list.filter(e => {
    return !e.online
  }).length;
})


</script>
<template>
  <div class="grid gap-2 md:gap-4 grid-cols-3">
    <Card :class="cn(store.preferences?.useSemitransparent && 'bg-card/70')">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          {{ $t('total') }}
        </CardTitle>
        <PcCase class="h-4 w-4 text-muted-foreground hidden md:block" />
      </CardHeader>
      <CardContent>
        <div class="flex flex-row items-center text-2xl font-bold">
          <span class="inline-block size-3 bg-primary rounded-full mr-2" />{{ list.length
          }}
        </div>
      </CardContent>
    </Card>
    <Card :class="cn(store.preferences?.useSemitransparent && 'bg-card/70')">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          {{ $t('online') }}
        </CardTitle>
        <Wifi class="h-4 w-4 text-muted-foreground hidden md:block" />
      </CardHeader>
      <CardContent>
        <div class="flex flex-row items-center text-2xl font-bold">
          <span class="inline-block size-3 bg-green-500 animate-pulse rounded-full mr-2" />{{ onlineCount }}
        </div>
      </CardContent>
    </Card>
    <Card :class="cn(store.preferences?.useSemitransparent && 'bg-card/70')">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          {{ $t('offline') }}
        </CardTitle>
        <WifiOff class="h-4 w-4 text-muted-foreground hidden md:block" />
      </CardHeader>
      <CardContent>
        <div class="flex flex-row items-center text-2xl font-bold">
          <span class="inline-block size-3 bg-destructive animate-pulse rounded-full mr-2" />{{ offlineCount }}
        </div>
      </CardContent>
    </Card>
  </div>
  <div class="">
    <div v-if="status != 'OPEN'" class="text-sm text-center">{{ $t('connecting') }}</div>
    <div v-else class="grid gap-4 md:grid-cols-2">
      <Card v-for="(item, index) in list" :key="index"
        :class="cn(store.preferences?.useSemitransparent && 'bg-card/70')">
        <CardHeader>
          <CardTitle>
            <div class="flex flex-row gap-8 justify-between items-center">
              <div class="flex items-center py-2">
                <IconCountry v-if="item.online" :countryCode="item.country_code" :online="item.online" class="mr-2" />
                <span class="mr-2 text-left break-all">{{
      item.name
    }}</span>
                <Platform v-if="item.online" type="badge" :platform="item.host.platform" />
              </div>
              <div class="flex flex-row gap-1 justify-start items-center">
                <SpeedProgress v-if="item.online" :showLabel="true" label="Up"
                  :net_in_speed="item?.state?.net_in_speed || 0" :net_out_speed="item?.state?.net_out_speed || 0" />
                <WifiAnimate v-if="item.online"></WifiAnimate>
                <WifiOff v-else class="size-4 text-gray-300" />
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <PlanDataMod :data="publicNote[index]?.planDataMod" />
          </CardDescription>
        </CardHeader>
        <CardContent class="px-6 flex flex-row gap-1 md:gap-3 items-center justify-between">
          <CardItem label="expire" :online="item.online">
            <RemainingProgress :data="publicNote[index]?.billingDataMod" />
          </CardItem>
          <CardItem label="uptime" :online="item.online">
            <Uptime v-if="item.online" :showLabel="true" :time="item.state?.uptime" />
          </CardItem>
          <CardItem label="cpu" :online="item.online">
            <Progress v-if="item.online" :onlyText="true" :percentage="item?.state?.cpu?.toFixed(2) || 0" />
          </CardItem>
          <CardItem label="mem" :online="item.online">
            <Progress v-if="list[index].online" :onlyText="true"
              :percentage="(list[index]?.state?.mem_used / list[index]?.host?.mem_total * 100).toFixed(2)" />
          </CardItem>
          <CardItem label="stg" :online="item.online">
            <Progress v-if="list[index].online" :onlyText="true"
              :percentage="(list[index]?.state?.disk_used / list[index]?.host?.disk_total * 100).toFixed(2)" />
          </CardItem>
        </CardContent>
        <CardFooter class="px-6 pb-6 flex justify-between items-center">
          <div>
            <RemainingPrice v-if="item.online" :onlyPrice="true" :data="publicNote[index]?.billingDataMod" />
            <span v-else>-</span>
          </div>
          <TooltipProvider v-if="publicNote[index]?.billingDataMod?.link">
            <Tooltip>
              <TooltipTrigger>
                <BuyLink :data="publicNote[index]?.billingDataMod" />
              </TooltipTrigger>
              <TooltipContent class="bg-muted/80 text-muted-foreground">
                <p>{{ $t('buy') }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
