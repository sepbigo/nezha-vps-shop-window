<template>
  <Badge v-if="type === 'badge'" variant="outline" class="rounded-full capitalize font-normal text-muted-foreground">{{
    platform }}</Badge>
  <i v-else :class="`fl-${osName.toLowerCase()} text-secondary-foreground`" :title="platform"></i>{{ label }}
</template>
<script setup>
import { Badge } from '@/components/shadcn/ui/badge';
import { computed } from 'vue';

const props = defineProps({
  platform: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'icon',
  }
});

const osName = computed(() => {
  return GetOsName(props.platform);
});

function GetOsName(platform) {
  if (
    [
      "almalinux",
      "alpine",
      "aosc",
      "apple",
      "archlinux",
      "archlabs",
      "artix",
      "budgie",
      "centos",
      "coreos",
      "debian",
      "deepin",
      "devuan",
      "docker",
      "fedora",
      "ferris",
      "flathub",
      "freebsd",
      "gentoo",
      "gnu-guix",
      "illumos",
      "linuxmint",
      "mageia",
      "mandriva",
      "manjaro",
      "nixos",
      "openbsd",
      "opensuse",
      "pop-os",
      "redhat",
      "sabayon",
      "slackware",
      "snappy",
      "solus",
      "tux",
      "ubuntu",
      "void",
      "zorin",
    ].indexOf(platform) > -1
  ) {
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }
  if (platform == "darwin") {
    return "macOS"
  }
  if (["openwrt", "linux", "immortalwrt"].indexOf(platform) > -1) {
    return "Linux"
  }
  if (platform == "amazon") {
    return "Redhat"
  }
  if (platform == "arch") {
    return "Archlinux"
  }
  if (platform.toLowerCase().includes("opensuse")) {
    return "Opensuse"
  }
  return "Linux"
}
</script>

<style scoped></style>
