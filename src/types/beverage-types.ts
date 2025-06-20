export const beverageTypes = {
  BEER: 'BEER',
  WINE: 'WINE',
  SPARKLING_WINE: 'SPARKLING_WINE',
  STRONG: 'STRONG',
  PORT_WINE: 'PORT_WINE',
  CIDER: 'CIDER',
  CUSTOM: 'CUSTOM',
} as const;

export type TBeverageType = keyof typeof beverageTypes;
