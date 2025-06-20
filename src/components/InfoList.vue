<template>
  <QImg src="@/assets/images/info.jpg" fit="cover" width="100%" height="200px"/>

  <QList>
    <InfoListItem
      :title="$t('RATE_APP')"
      icon="thumb_up"
      @click="rateApp()"
    />
    <InfoListItem
      :title="$t('WEBSITE')"
      icon="language"
      @click="openLink('https://gauge-app.com')"
    />
    <InfoListItem
      :title="$t('PRIVACY_POLICY')"
      icon="policy"
      @click="openLink('https://gauge-app.com/privacy-policy')"
    />
    <InfoListItem
      :title="$t('SUPPORT')"
      icon="support_agent"
      @click="sendMail()"
      v-if="props.mailAvailable"
    />
    <InfoListItem
      :title="$t('CHANGE_LANGUAGE')"
      icon="translate"
      :caption="currentLanguageName"
      @click="openLanguageDialog()"
    />
    <InfoListItem
      :title="$t('VERSION')"
      :caption="appVersion"
    />
  </QList>

  <SheetDialog ref="languageDialog" cancel>
    <div class="column items-center">
      <QSelect
        class="col-3"
        :label="$t('LANGUAGE')"
        :options="languageOptions"
        map-options
        :model-value="currentLanguage"
        @update:model-value="changeLanguage($event.value)"
      />
    </div>
  </SheetDialog>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { t } from '@/boot/i18n';
import { languageTypes, TLanguage } from '@/types/language-types';
import InfoListItem from '@/components/InfoListItem.vue';
import SheetDialog from '@/components/SheetDialog.vue';
import { rateApp } from '@/services/rate-app';
import { useLanguageStore } from '@/stores/language';
import { browserOpen } from '@/services/browser';
import { mailManager } from '@/services/mail';

interface IProps {
  mailAvailable: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  mailAvailable: false,
});

const languageStore = useLanguageStore();

const appVersion = `${process.env.VITE_VERSION}.${process.env.VITE_BUILD}`;

const languageDialog = ref<typeof SheetDialog>();

const currentLanguage = computed(() => languageStore.current);
const currentLanguageName = computed(() => t(`LANGUAGES.${languageStore.current}`))

const languageOptions = computed(() => {
  return Object.keys(languageTypes)
    .map(languageType => ({
      value: languageType,
      label: t(`LANGUAGES.${languageType}`)
    }));
});

function openLanguageDialog() {
  unref(languageDialog)!.show();
}

function changeLanguage(value: TLanguage) {
  languageStore.update(value);
  unref(languageDialog)!.hide();
}

function openLink(url: string) {
  browserOpen(url);
}

function sendMail() {
  mailManager.send({
    to: 'support@gauge-app.com',
    subject: '[QUESTION]'
  })
}
</script>
