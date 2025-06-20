import { defineStore } from 'pinia';
import { useBeveragesStore } from '@/stores/beverages';
import { getNormalizedVolume } from '@/helpers/beverage';

export interface IConsumptionData {
  id: number;
  volume: number;
}

export const useBeverageConsumptionStore = defineStore('beverageConsumption', {
  state: () => ({
    tempItems: null,
    items: [] as IConsumptionData[],
  }),
  getters: {
    // need state params for ide compatibility
    getConsumption(_state) {
      return (id: number) => this.tempItems.find(item => item.id === id) || null;
    },
    getConsumptionRatio(_state) {
      const beveragesStore = useBeveragesStore();

      return ({ id, recommended = false }: { id: number, recommended: boolean }) => {
        const item = this.getConsumption(id);
        const beverage = beveragesStore.getItem(id);

        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        const alcoholVolume = item?.volume! * beverage?.percentage! / 100;

        if (!item) {
          return 0;
        } else if (recommended) {
          return (alcoholVolume / beveragesStore.maxAlcoholPerWeek) || 0;
        } else {
          return (alcoholVolume / this.totalAlcoholVolume) || 0;
        }
      }
    },
    // weekly
    totalAlcoholVolume(_state) {
      const beveragesStore = useBeveragesStore();

      return this.tempItems.reduce(
        (totalVolume, { id, volume }) => {
          const beverage = beveragesStore.getItem(id);
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          const alcoholVolume = volume * beverage?.percentage! / 100;

          return totalVolume + (alcoholVolume || 0);
        },
        0,
      )
    },
  },
  actions: {
    async init() {
      this.tempItems = null;
      await this.persistInitPromise;
    },
    add({ id, data }: { id: number, data?: Partial<IConsumptionData> }) {
      const currentItem = this.getConsumption(id);

      if (!currentItem) {
        const volume = getNormalizedVolume(data?.volume);
        const processedData: IConsumptionData = { id, volume };

        this.tempItems.push(processedData);
      }
    },
    update({ id, data, force = true }: { id: number, data: Partial<IConsumptionData>, force?: boolean }) {
      const currentItem = this.getConsumption(id);

      if (currentItem) {
        const volume = getNormalizedVolume(data.volume);
        const processedData: Partial<IConsumptionData> = { volume };

        Object.assign(currentItem, processedData);
      } else if (force) {
        this.add({ id, data });
      }
    },
    remove(id: number) {
      const currentItemIndex = this.tempItems.findIndex(item => item.id === id);
      const currentItem = this.tempItems[currentItemIndex];

      if (currentItem) {
        this.tempItems.splice(currentItemIndex, 1);
      }
    },
    reset() {
      const beveragesStore = useBeveragesStore();
      this.tempItems = beveragesStore.items.map(({ id }) => ({ id, volume: 0 }));
    },
  },
  persist: {
    include: ['tempItems']
  }
});
