<template>
  <!--  https://quasar.dev/layout-builder -->
  <QLayout view="hHh LpR fFf" :style="{ 'padding-top': `${headerOffset}px` }">
    <div class="header-stub" v-if="!isHeader"/>
    <QHeader bordered reveal v-else :style="{ 'margin-top': `${headerOffset}px` }">
      <QToolbar>
<!--
        <QBtn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
-->
        <QToolbarTitle class="row flex-center">
          {{ title }}
        </QToolbarTitle>
      </QToolbar>
    </QHeader>

<!--
    <QDrawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
    </QDrawer>
-->

    <QPageContainer>
      <RouterView />
    </QPageContainer>

    <MainMenu/>
  </QLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainMenu from '@/components/MainMenu.vue';
import { useLanguageStore } from '@/stores/language';
import { adManager } from '@/services/applovin';

const languageStore = useLanguageStore();

await languageStore.init();

const router = useRouter();
const currentRoute = useRoute();


// Banner
// refreshed on every route
(router as any).start();

const headerOffset = ref(0);

// non-blocking init
(async () => {
  try {
    await adManager.init();
    headerOffset.value = adManager.size.y;
    // show banner in case there's race condition with route hook
    await adManager.refreshBanner();
    adManager.showPopup();
  } catch (err) {
    console.error(err);
  }
})();

const isHeader = computed(() => currentRoute.meta.header !== false);
const title = computed(() => currentRoute.meta.title?.());

// fix initial active route tab
await new Promise(r => setTimeout(r, 200));
</script>

<style scoped lang="scss">
// QLayout fix that may not be needed
/*
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
*/

// fix ios safe area without QHeader
.header-stub {
    background: transparent;
    padding-top: $ios-statusbar-height;
    min-height: ($ios-statusbar-height);
    padding-top: env(safe-area-inset-top);
    min-height: calc(env(safe-area-inset-top));
}
</style>
