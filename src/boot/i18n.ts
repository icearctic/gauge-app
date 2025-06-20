import { boot } from 'quasar/wrappers';
import { createI18n, PluralizationRule as IPluralizationRule } from 'vue-i18n';
import * as pluralCardinals from 'make-plural/cardinals'
import type { PluralCategory as TPluralCategory } from 'make-plural/cardinals';
import de from '@/i18n/de';
import en from '@/i18n/en';
import ru from '@/i18n/ru';

const messages = {
  de,
  en,
  ru
}

export type TLocale = keyof typeof messages;

export const locales = Object.keys(messages) as TLocale[];

// Type-define 'en' as the master schema for the resource
export type IMessageSchema = typeof messages['en'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends IMessageSchema {
  }

  // define the datetime format schema
  export interface DefineDateTimeFormat {
  }

  // define the number format schema
  export interface DefineNumberFormat {
  }
}
/* eslint-enable @typescript-eslint/no-empty-interface */

type TPluralCardinal = (n: number) => TPluralCategory;

// force max choices with no zero->many fallback
// https://vue-i18n.intlify.dev/guide/essentials/pluralization.html#custom-pluralization
function getPluralRule(pluralCardinal: TPluralCardinal): IPluralizationRule {
  return (choice: number, choicesLength: number, _fallbackPluralRule?: IPluralizationRule): number => {
    if (choice == 0) {
      return 0;
    }

    choice = Math.abs(choice);

    const category = pluralCardinal(choice);

    if (choicesLength > 3) {
      // Russian, etc
      if (category === 'one') {
        return 1;
      } else if (category === 'two') {
        return 2;
      } else {
        // few, many, other
        return 3;
      }
    } else if (choicesLength === 3) {
      // English
      if (category === 'one') {
        return 1;
      } else {
        // few, many, other
        return 2;
      }
    } else {
      // No plural
      return Math.min(0, choicesLength - 1);
    }
  };
}

// list plural cardinals explicitly to enable import tree shaking
const pluralRules: Record<TLocale, IPluralizationRule> = {
  de: getPluralRule(pluralCardinals.de),
  en: getPluralRule(pluralCardinals.en),
  ru: getPluralRule(pluralCardinals.ru),
};

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  pluralRules,
  messages,
});

export const t = i18n.global.t;

export default boot(({app}) => {
  app.use(i18n);
});
