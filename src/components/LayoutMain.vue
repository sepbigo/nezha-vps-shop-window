<script setup>
import logo from '@/assets/logo.svg'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/ui/avatar'
import { Button } from '@/components/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/ui/dropdown-menu'
import { Separator } from '@/components/shadcn/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/shadcn/ui/sheet'
import { getSetting } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useStore } from '@/stores'
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Languages, Palette } from 'lucide-vue-next'
import { onBeforeMount, ref } from 'vue'
import CustomListLinks from './CustomListLinks.vue'
import CustomNavLinks from './CustomNavLinks.vue'
import SettingPanel from './SettingPanel.vue'
const mode = useColorMode()
const store = useStore();


const settings = ref({});
const backgroundImage = ref('');

onBeforeMount(async () => {
  try {
    settings.value = await getSetting();

    // 更新store中的偏好设置
    if (settings.value?.preferences) {
      store.setPreferences(settings.value.preferences);

      // 应用壁纸设置
      if (settings.value.preferences.customBackgroundImage) {
        backgroundImage.value = `url(${settings.value.preferences.customBackgroundImage})`;
        // 先设置背景图片URL，再开启壁纸功能
        store.setBackgroundImage(settings.value.preferences.customBackgroundImage);
        if (!store.useBackgroundImage) {
          store.toggleBackgroundImage();
        }
      }

      // 应用半透明设置
      if (settings.value.preferences.useSemitransparent && !store.useSemitransparent) {
        store.toggleSemitransparent();
      }

      // 应用语言设置
      if (settings.value.preferences.customLanguage) {
        store.changeLanguage(settings.value.preferences.customLanguage);
      }

      // 应用主题设置
      if (settings.value.preferences.customTheme) {
        store.changeTheme(settings.value.preferences.customTheme);
        mode.value = settings.value.preferences.customTheme;
      }
    }
  } catch (error) {
    console.error('获取设置失败:', error);
  }
});
</script>

<template>
  <div class="fixed inset-0 top-0 bottom-0 left-0 right-0 -z-10 bg-cover bg-center bg-no-repeat"
    :style="store.useBackgroundImage ? `background-image: ${backgroundImage};` : ''"></div>
  <div class="flex min-h-screen w-full md:max-w-6xl mx-auto flex-col">
    <header :class="cn(
      'bg-transparent sticky top-0 z-10 flex h-16 justify-between items-center gap-4 px-4 md:px-8'
    )">
      <nav class="hidden gap-4 flex-1 md:flex md:items-center md:text-sm">
        <a href="/" class="flex items-center gap-2">
          <Avatar class="size-10 rounded-md bg-transparent" :title="store.preferences?.customTitle">
            <AvatarImage class="object-fill" :src="store.preferences?.customLogo ? store.preferences?.customLogo : logo"
              :alt="store.preferences?.customTitle" />
            <AvatarFallback>{{ store.preferences?.customTitle }}</AvatarFallback>
          </Avatar>
          <span class="sr-only">vps shop window</span>
        </a>

        <CustomNavLinks v-if="store.preferences?.customNavLinks?.length > 0"
          :links="store.preferences?.customNavLinks" />
      </nav>
      <nav class="md:hidden gap-4 flex-1 flex items-center text-sm">
        <a href="#" class="flex items-center gap-2 text-lg font-semibold">
          <Avatar class="size-10 rounded-md bg-transparent" :title="store.preferences?.customTitle">
            <AvatarImage class="object-fill" :src="store.preferences?.customLogo ? store.preferences?.customLogo : logo"
              :alt="store.preferences?.customTitle" />
            <AvatarFallback>{{ store.preferences?.customTitle }}</AvatarFallback>
          </Avatar>
          <span class="sr-only">vps shop window</span>
        </a>
        <CustomListLinks v-if="store.preferences?.customNavLinks?.length > 0"
          :links="store.preferences?.customNavLinks" />
      </nav>
      <div class="flex items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="border">
              <Languages class="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="store.changeLanguage('zh-CN')">
              {{ $t("cn") }}
            </DropdownMenuItem>
            <DropdownMenuItem @click="store.changeLanguage('en')">
              {{ $t("en") }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="border">
              <Icon icon="radix-icons:moon"
                class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icon icon="radix-icons:sun"
                class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="mode = 'light'">
              {{ $t("light") }}
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'dark'">
              {{ $t("dark") }}
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'auto'">
              {{ $t("system") }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="secondary" size="icon" class="border">
              <Palette class="size-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>
                <a href="#" class="flex items-center gap-2 text-lg font-semibold">
                  <Palette class="h-6 w-6" />
                  <span class="sr-only">Theme Setting</span>
                </a>
              </SheetTitle>
              <SheetDescription class="hidden">
              </SheetDescription>
            </SheetHeader>
            <SettingPanel />
          </SheetContent>
        </Sheet>
      </div>
    </header>
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <slot />
    </main>
    <footer>
      <div class="flex flex-row items-center justify-center py-8 w-full">
        <p class="flex flex-col md:flex-row justify-center items-center gap-1 text-gray-400 text-xs text-center">
          <span>&COPY;2025 {{ store.preferences?.customTitle || 'VPS橱窗' }}</span>
          <Separator orientation="vertical" class="hidden md:inline-flex h-2" />
          <span>{{ store.preferences?.customDesc || 'VPS Shop Window' }}</span>
        </p>
      </div>
    </footer>
  </div>
</template>
