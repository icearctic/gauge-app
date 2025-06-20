export const languageTypes = {
  EN: 'EN',
  RU: 'RU',
  DE: 'DE',
} as const;

export type TLanguage = keyof typeof languageTypes;
