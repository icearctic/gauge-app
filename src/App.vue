
<template>
  <Suspense>
    <Root/>
  </Suspense>
</template>

<script setup lang="ts">
import Root from '@/components/Root.vue';
import { useLanguageStore } from '@/stores/language';
import { useBeveragesStore } from '@/stores/beverages';
import { useBeverageConsumptionStore } from '@/stores/beverage-consumption';
import { useRouter } from 'vue-router';
import { i18n } from '@/boot/i18n';
import { adManager } from '@/services/applovin';
import { mailManager } from '@/services/mail';
import { rateApp } from '@/services/rate-app';
import { browserOpen } from '@/services/browser';

const languageStore = useLanguageStore();
const beveragesStore = useBeveragesStore();
const beverageConsumptionStore = useBeverageConsumptionStore();

const router = useRouter();

// Not same as imported i18n
// const i18n = useI18n();

// debuggable globals
(window as any).APP = {
  languageStore,
  beveragesStore,
  beverageConsumptionStore,
  i18n,
  router,
  adManager,
  mailManager,
  rateApp,
  browserOpen,

};
</script>
