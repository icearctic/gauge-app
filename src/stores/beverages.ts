import { defineStore } from 'pinia';
import { beverageTypes, TBeverageType } from '@/types/beverage-types';
import { useBeverageConsumptionStore } from '@/stores/beverage-consumption';
import { getNormalizedPercentage, getNormalizedVolume } from '@/helpers/beverage';

export interface IBeverage {
  id: number;
  type: TBeverageType,
  builtin: boolean,
  percentage: number,
  dose?: number,
  name?: string,
}

function getDefaultBeverages(): IBeverage[] {
  return [
    { id: 1, type: beverageTypes.BEER, builtin: true, percentage: 5, dose: 500 },
    { id: 2, type: beverageTypes.WINE, builtin: true, percentage: 13, dose: 125 },
    { id: 3, type: beverageTypes.SPARKLING_WINE, builtin: true, percentage: 11, dose: 125 },
    { id: 4, type: beverageTypes.STRONG, builtin: true, percentage: 40, dose: 50 },
    { id: 5, type: beverageTypes.PORT_WINE, builtin: true, percentage: 18, dose: 100 },
    { id: 6, type: beverageTypes.CIDER, builtin: true, percentage: 4.7, dose: 500 },
  ]
}

const maxAlcoholPerYear = 8000;

// Linked with beverageConsumption store to keep data separately
export const useBeveragesStore = defineStore('beverages', {
  state: () => ({
    maxAlcoholPerYear,
    items: getDefaultBeverages()
  }),
  getters: {
    getItem(_state) {
      return (id: number) => {
        return this.items.find(beverage => beverage.id === id) ?? null;
      };
    },
    getMaxWeeklyVolume(_state) {
      return (percentage: number) => {
        return (this.maxAlcoholPerWeek / (percentage / 100)) || 0;
      };
    },
    maxAlcoholPerWeek(_state) {
      return this.maxAlcoholPerYear / 365 * 7;
    }
  },
  actions: {
    async init() {
      await this.persistInitPromise;
    },
    addBeverage({ data }: { data: Partial<IBeverage> }) {
      const beverageConsumptionStore = useBeverageConsumptionStore();

      const id = Math.max(...this.items.map(({ id }) => id)) + 1;
      const percentage = getNormalizedPercentage(data.percentage);
      const dose = 0;
      const name = data.name || '';

      const processedData: IBeverage = {
        id,
        type: beverageTypes.CUSTOM,
        builtin: false,
        percentage,
        dose,
        name,
      };

      this.items.push(processedData);

      beverageConsumptionStore.add({ id });
    },
    updateBeverage({ id, data }: { id: number, data: Partial<IBeverage> }) {
      const currentBeverage = this.getItem(id);

      if (currentBeverage) {
        const percentage = getNormalizedPercentage(data.percentage);
        // const dose = getNormalizedVolume(data.dose);
        const processedData: Partial<IBeverage> = { percentage/*, dose*/ };

        if (!currentBeverage.builtin) {
          processedData.name = data.name || '';
        }

        Object.assign(currentBeverage, processedData);
      }
    },
    removeBeverage(id: number) {
      const beverageConsumptionStore = useBeverageConsumptionStore();

      const currentBeverageIndex = this.items.findIndex(beverage => beverage.id === id);
      const currentBeverage = this.items[currentBeverageIndex];

      if (currentBeverage && !currentBeverage.builtin) {
        this.items.splice(currentBeverageIndex, 1);

        beverageConsumptionStore.remove(id);
      }
    },
    resetBeverage(id: number) {
      const defaultBeverages = getDefaultBeverages();
      const defaultBeverage = defaultBeverages.find(beverage => beverage.id === id);
      const currentBeverageIndex = this.items.findIndex(beverage => beverage.id === id);

      if (defaultBeverage && currentBeverageIndex >= 0) {
        this.items.splice(currentBeverageIndex, 1, defaultBeverage);
      }
    },
    updateAlcoholPerYear(value: number) {
      this.maxAlcoholPerYear = getNormalizedVolume(value);
    },
    resetAlcoholPerYear() {
      this.maxAlcoholPerYear = maxAlcoholPerYear;
    },
  },
  persist: {
    include: ['maxAlcoholPerYear', 'items']
  }
});
