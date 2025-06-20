<template>
  <div class="q-pa-md q-gutter-sm column items-center">
    <div class="text-center">{{ $t('WEEKLY_RATE_CALCULATION') }}</div>
    <div class="text-center">{{ $t('CURRENT_YEAR_VOLUME') }}</div>
    <div class="text-h6">{{ $t('LITRE_PLURAL', { value: maxAlcoholPerYear }, maxAlcoholPerYear) }}</div>
<!--    {{ $t('CHANGE_ANNUAL_AMOUNT') }}-->
    <div class="row q-gutter-sm items-center">
      <QBtn unelevated color="negative" icon="cached" :label="$t('BUTTON_RESET')" @click="onMaxAlcoholResetClick()" />
      <QBtn unelevated color="secondary" icon="edit" :label="$t('BUTTON_CHANGE')" @click="onMaxAlcoholEditClick()" />
    </div>
  </div>

  <div class="q-pa-md q-gutter-sm column items-center">
    <div class="text-body1 text-center">{{ $t('AVERAGE_QUANTITIES') }}</div>
  </div>

  <BeverageList/>

  <div class="q-pa-md q-gutter-sm column items-center">
    <div class="text-center">{{ $t('CONSUMPTION_DETAILS') }}:</div>
    <div class="row q-gutter-sm items-center justify-center">
      <QBtn outline unelevated color="secondary" icon="link" :label="$t('CONSUMPTION_LEVEL')" @click="openLink('https://www.who.int/europe/news/item/04-01-2023-no-level-of-alcohol-consumption-is-safe-for-our-health')" />
      <QBtn outline unelevated color="secondary" icon="link" :label="$t('CONSUMPTION_RECOMMENDATIONS')" @click="openLink('https://www.cdc.gov/alcohol/fact-sheets/moderate-drinking.htm')" />
    </div>
  </div>

  <SheetDialog ref="resetDialogRef" cancel confirm="reset" @confirm="onMaxAlcoholResetConfirm()"/>

  <SheetDialog ref="editDialogRef" cancel confirm @confirm="onMaxAlcoholEditConfirm()">
    <QForm ref="editFormRef" autofocus greedy>
      <div class="text-body1 text-center">{{ $t('YEAR_VOLUME') }}</div>
      <div class="column items-center">
        <QInput
          :label="$t('FIELD_VOLUME')"
          type="number"
          :suffix="$t('UNIT_L')"
          v-model.number="editForm.volume"
          no-error-icon
          :rules="editFormRules.volume"
          @keypress.enter.prevent
        />
      </div>
    </QForm>
  </SheetDialog>
</template>

<script setup lang="ts">
import BeverageList from '@/components/BeverageList.vue';
import { useBeveragesStore } from '@/stores/beverages';
import { computed, reactive, ref, unref } from 'vue';
import SheetDialog from '@/components/SheetDialog.vue';
import { QForm } from 'quasar';
import { browserOpen } from '@/services/browser';
import { convertLToMl, convertMlToL } from '@/helpers/beverage';

const beveragesStore = useBeveragesStore();

const resetDialogRef = ref<typeof SheetDialog>();
const editDialogRef = ref<typeof SheetDialog>();
const editFormRef = ref<QForm>();
const editForm = reactive({
  volume: 0,
})
const editFormRules = {
  volume: [(v: number) => (v === 0 || v > 0)]
};

const maxAlcoholPerYear = computed(() => convertMlToL(beveragesStore.maxAlcoholPerYear));

function onMaxAlcoholResetClick() {
  unref(resetDialogRef)!.show();
}

function onMaxAlcoholResetConfirm() {
  beveragesStore.resetAlcoholPerYear();
  unref(resetDialogRef)!.hide();
}

function onMaxAlcoholEditClick() {
  const volume = convertMlToL(beveragesStore.maxAlcoholPerYear);
  Object.assign(editForm, { volume });

  unref(editDialogRef)!.show();
}

// handle both edit and add
async function onMaxAlcoholEditConfirm() {
  const isValid = await unref(editFormRef)!.validate();

  if (isValid) {
    const volume = convertLToMl(editForm.volume);
    beveragesStore.updateAlcoholPerYear(volume);

    unref(editDialogRef)!.hide();
  }
}

function openLink(url: string) {
  browserOpen(url);
}
</script>
