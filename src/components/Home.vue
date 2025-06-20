<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-md column items-center">
      <div class="text-body1 text-center">{{ $t('AVERAGE_WEEKLY_CONSUMPTION') }}</div>
      <div
        class="weekly-badge text-weight-bold"
        :class="[
          { 'weekly-badge--negative': weeklyRecommendedAlcoholPercent > 100 },
          weeklyRecommendedAlcoholPercent > 1000 ? 'text-h4' : 'text-h2'
        ]"
      >
        {{weeklyRecommendedAlcoholPercent}}%
      </div>
    </div>
  </div>

  <div class="q-pa-md q-gutter-sm column items-center">
    <div class="text-body1 text-center">
      {{ $t('DRINK_CONSUMPTION') }}
    </div>
  </div>

  <QSeparator/>

  <BeverageList consumption/>

  <div class="q-pa-md q-gutter-sm column items-center text-center">
    {{$t('RESTART_WEEK')}}
  </div>

<div class="q-pa-md q-gutter-sm column items-center">
<QBtn unelevated color="negative" icon="cached" :label="$t('BUTTON_RESET')" @click="onResetClick()" />
</div>

<SheetDialog ref="resetDialogRef" cancel confirm="reset" @confirm="onResetConfirm()"/>
</template>

<script setup lang="ts">
import BeverageList from '@/components/BeverageList.vue';
import { useBeverageConsumptionStore } from '@/stores/beverage-consumption';
import { useBeveragesStore } from '@/stores/beverages';
import { computed, ref, unref } from 'vue';
import SheetDialog from '@/components/SheetDialog.vue';
import { getFormattedPercent } from '@/helpers/beverage';

const beveragesStore = useBeveragesStore();
const beverageConsumptionStore = useBeverageConsumptionStore();

const resetDialogRef = ref<typeof SheetDialog>();

const weeklyRecommendedAlcoholPercent = computed(() => {
  const weeklyRecommendedAlcoholRatio = beverageConsumptionStore.totalAlcoholVolume / beveragesStore.maxAlcoholPerWeek;

  return getFormattedPercent(weeklyRecommendedAlcoholRatio * 100);
});


function onResetClick() {
  unref(resetDialogRef)!.show();
}

function onResetConfirm() {
  beverageConsumptionStore.reset();
  unref(resetDialogRef)!.hide();
}

</script>

<style scoped lang="scss">
  .weekly-badge {
    color: $positive;


    &--negative {
      color: $negative;
    }
  }
</style>
