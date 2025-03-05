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

const parseCustomPreferences = async (customCode) => {
  try {
    const domparser = new DOMParser();
    const dom = domparser.parseFromString(customCode, 'text/html');

    // 解析外部脚本
    const externalScript = Array.from(dom.querySelectorAll('script'));
    const parsedPreferences = await Promise.all(externalScript.map(script => {
      const scriptLang = script.getAttribute('lang');
      const scriptRel = script.getAttribute('rel');

      // 解析个性化配置
      if (scriptLang === 'json' && scriptRel === 'preferences') {
        try {
          return JSON.parse(script?.innerHTML || '{}');
        } catch (error) {
          console.error('解析JSON配置失败:', error);
          return {};
        }
      } else if (scriptLang === 'json' && scriptRel === 'resource') {
        // 解析外部资源
        let resourceArray = JSON.parse(script?.innerHTML || '[]')
        resourceArray.map(res => new Promise((resolve, reject) => {
          if (res.endsWith('css')) {
            let linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = res;
            linkElement.crossOrigin = 'anonymous';
            linkElement.onload = resolve;
            linkElement.onerror = reject;
            document.head.appendChild(linkElement);
          } else if (res.endsWith('js')) {
            let scriptElement = document.createElement('script');
            scriptElement.src = res;
            scriptElement.crossOrigin = 'anonymous';
            scriptElement.onload = resolve;
            scriptElement.onerror = reject;
            document.head.appendChild(scriptElement);
          }
        }));
      } else {
        new Promise((resolve, reject) => {
          let scriptElement = document.createElement('script');
          scriptElement.innerHTML = script?.innerHTML;
          scriptElement.onload = resolve;
          scriptElement.onerror = reject;
          document.head.appendChild(scriptElement);
        })
      }
    }));

    // 解析外部style
    const externalStyle = Array.from(dom.querySelectorAll('style'));
    await Promise.all(externalStyle.map(style => {
      return new Promise((resolve, reject) => {
        let styleElement = document.createElement('style');
        styleElement.innerHTML = style?.innerHTML;
        styleElement.onload = resolve;
        styleElement.onerror = reject;
        document.head.appendChild(styleElement);
      })
    }));

    return parsedPreferences.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  } catch (error) {
    console.error('解析自定义配置失败:', error);
    return {};
  }
};

onBeforeMount(async () => {
  try {
    settings.value = await getSetting();
    const customCode = settings.value?.data?.config?.custom_code;
    if (!customCode) return;

    // 解析自定义配置
    const customPreferences = await parseCustomPreferences(customCode);

    // 更新配置
    const newPreferences = {
      ...store.preferences,
      ...customPreferences
    };

    // 应用配置
    store.setPreferences(newPreferences);
    store.changeLanguage(store.getLanguage());
    store.changeTheme(store.getTheme());

    // 更新背景图片
    if (newPreferences?.customBackgroundImage) {
      backgroundImage.value = `url(${newPreferences.customBackgroundImage})`;
    }
  } catch (error) {
    console.error('初始化配置失败:', error);
  }
});
</script>

<template>
  <div class="fixed inset-0 top-0 bottom-0 left-0 right-0 -z-10 bg-cover bg-center bg-no-repeat"
    :style="`background-image: ${backgroundImage};`"></div>
  <div class="flex min-h-screen w-full md:max-w-6xl mx-auto flex-col">
    <header :class="cn(
      'bg-transparent sticky top-0 z-10 flex h-16 justify-between items-center gap-4 px-4 md:px-8'
    )">
      <nav class="hidden gap-4 flex-1 md:flex md:items-center md:text-sm">
        <a href="/" class="flex items-center gap-2">
          <Avatar class="size-10 rounded-none bg-transparent" :title="store.preferences?.customTitle">
            <AvatarImage class="object-fill" :src="store.preferences?.customLogo ? store.preferences?.customLogo : logo"
              :alt="store.preferences?.customTitle" />
            <AvatarFallback>{{ store.preferences?.customTitle }}</AvatarFallback>
          </Avatar>
          <div class="flex flex-row gap-2 items-center">
            <div class="text-lg">{{ store.preferences?.customTitle }}</div>
            <Separator orientation="vertical" class="h-3"></Separator>
            <div class="text-sm text-muted-foreground">{{ store.preferences?.customDesc }}</div>
          </div>
        </a>

        <CustomNavLinks v-if="store.preferences?.customNavLinks?.length > 0"
          :links="store.preferences?.customNavLinks" />
      </nav>
      <nav class="md:hidden gap-4 flex-1 flex items-center text-sm">
        <a href="#" class="flex items-center gap-2 text-lg font-semibold">
          <Avatar class="size-10 rounded-none bg-transparent" :title="store.preferences?.customTitle">
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
        <p class="text-gray-400 text-xs">&COPY;2025 VPS Shop Window</p>
      </div>
    </footer>
  </div>
</template>
