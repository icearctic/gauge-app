import { defineStore } from 'pinia';
import { languageTypes, TLanguage } from '@/types/language-types';
import { i18n, TLocale } from '@/boot/i18n';
import { getLanguage } from '@/services/language';


function getSupportedLanguage(value?: string): TLanguage {
  return languageTypes[value as TLanguage] || 'EN';
}

function getSupportedLocale(value: string): TLocale {
  return getSupportedLanguage(value).toLowerCase() as TLocale;
}

export const useLanguageStore = defineStore('language', {
  state: () => ({
    current: null as unknown as TLanguage,
  }),
  getters: {},
  actions: {
    async init() {
      await this.persistInitPromise;

      if (!this.current) {
        const clientLanguage = await getLanguage();
        this.update(clientLanguage);
      } else {
        this.update();
      }
    },
    update(value?: string) {
      if (!this.current || (value && this.current !== value)) {
        this.current = getSupportedLanguage(value);
      }

      i18n.global.locale.value = getSupportedLocale(this.current);
    },
  },
  persist: true
});
