<template>
  <QList separator>
    <BeverageListItem
      v-for="item in items"
      :key="item.id"
      :consumption="props.consumption"
      :data="item"
      @reset="onItemResetClick"
      @delete="onItemDeleteClick"
      @edit="onItemEditClick"
      @consumption-edit="onItemConsumptionEditClick"
      @consumption-add="onItemConsumptionAddClick"
    />
  </QList>

  <template v-if="consumption">
    <SheetDialog ref="consumptionEditDialogRef" cancel confirm @confirm="onItemConsumptionEditConfirm()">
      <QForm ref="consumptionEditFormRef" autofocus greedy>
        <div class="column items-center">
          <QInput
            :label="$t('FIELD_VOLUME')"
            type="number"
            :suffix="$t('UNIT_ML')"
            v-model.number="consumptionEditForm.volume"
            no-error-icon
            :rules="consumptionEditFormRules.volume"
            @keypress.enter.prevent
          />
        </div>
      </QForm>
    </SheetDialog>

    <SheetDialog ref="consumptionAddDialogRef" cancel confirm="add" @confirm="onItemConsumptionAddConfirm()">
      <div class="text-body1 text-center">{{ $t('ADD_DRINK') }}</div>
      <QForm ref="consumptionAddFormRef" autofocus greedy>
        <div class="column items-center">
          <QInput
            :label="$t('FIELD_DOSE')"
            type="number"
            :suffix="$t('UNIT_ML')"
            v-model.number="consumptionAddForm.volume"
            no-error-icon
            :rules="consumptionAddFormRules.volume"
            @keypress.enter.prevent
          />
        </div>
      </QForm>
    </SheetDialog>
  </template>

  <template v-else>
    <div class="q-pa-md q-gutter-sm column items-center">
      <QBtn unelevated color="positive" icon="add" :label="$t('BUTTON_ADD')" @click="onItemAddClick()" />
    </div>

    <SheetDialog ref="resetDialogRef" cancel confirm="reset" @confirm="onItemResetConfirm()"/>

    <SheetDialog ref="deleteDialogRef" cancel confirm="delete" @confirm="onItemDeleteConfirm()"/>

    <SheetDialog ref="addDialogRef" cancel confirm @confirm="onItemAddConfirm()">
      <div class="text-body1 text-center">{{ $t('ADD_DRINK') }}</div>
      <QForm ref="addFormRef" autofocus greedy>
        <div class="column items-center">
          <QInput
            :label="$t('FIELD_NAME')"
            v-model="addForm.name"
            maxlength="50"
            no-error-icon
            :rules="addFormRules.name"
            @keypress.enter.prevent
          />

          <QInput
            :label="$t('AVERAGE_STRENGTH')"
            type="number"
            v-model.number="addForm.percentage"
            no-error-icon
            :rules="addFormRules.percentage"
            @keypress.enter.prevent
          />
        </div>
      </QForm>
    </SheetDialog>

    <SheetDialog ref="editDialogRef" cancel confirm @confirm="onItemEditConfirm()">
      <div class="text-body1 text-center">{{ $t('CHANGE_STRENGTH') }}</div>
      <QForm ref="editFormRef" autofocus greedy>
        <div class="column items-center">
          <QInput
            :label="$t('FIELD_NAME')"
            v-model="editForm.name"
            maxlength="50"
            no-error-icon
            :readonly="changedItem?.builtin"
            :rules="editFormRules.name"
            @keypress.enter.prevent
          />

          <QInput
            :label="$t('AVERAGE_STRENGTH')"
            type="number"
            v-model.number="editForm.percentage"
            no-error-icon
            :rules="editFormRules.percentage"
            @keypress.enter.prevent
          />
        </div>
      </QForm>
    </SheetDialog>
  </template>
</template>

<script lang="ts">
import type { IBeverage } from '@/stores/beverages';
import { beverageTypes } from '@/types/beverage-types';

export interface IBeverageItem extends IBeverage {
  name: string;
  image: string;
  maxVolume: number;
}

export interface IBeverageConsumptionItem extends IBeverageItem {
  volume: number | null;
}
</script>

<script setup lang="ts">
import { computed, reactive, ref, unref } from 'vue';
import { t } from '@/boot/i18n';
import { QForm } from 'quasar';
import { useBeveragesStore } from '@/stores/beverages';
import { useBeverageConsumptionStore } from '@/stores/beverage-consumption';
import { beverageTypes } from '@/types/beverage-types';
import BeverageListItem from '@/components/BeverageListItem.vue';
import SheetDialog from '@/components/SheetDialog.vue';

import imageBeverageBeer from '@/assets/images/beverages/beer.jpg';
import imageBeverageWine from '@/assets/images/beverages/wine.jpg';
import imageBeverageSparklingWine from '@/assets/images/beverages/sparkling_wine.jpg';
import imageBeverageStrong from '@/assets/images/beverages/strong.jpg';
import imageBeveragePortWine from '@/assets/images/beverages/port_wine.jpg';
import imageBeverageCider from '@/assets/images/beverages/cider.jpg';
import imageBeverageCustom from '@/assets/images/beverages/custom.jpg';

// avoid the use of await import(...) to not restrict browser compatibility
const beverageImagesMap = {
  [beverageTypes.BEER]: imageBeverageBeer,
  [beverageTypes.WINE]: imageBeverageWine,
  [beverageTypes.SPARKLING_WINE]: imageBeverageSparklingWine,
  [beverageTypes.STRONG]: imageBeverageStrong,
  [beverageTypes.PORT_WINE]: imageBeveragePortWine,
  [beverageTypes.CIDER]: imageBeverageCider,
  [beverageTypes.CUSTOM]: imageBeverageCustom,
} as const;

interface IProps {
  consumption?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  consumption: false,
});

const beveragesStore = useBeveragesStore();
const beverageConsumptionStore = useBeverageConsumptionStore();

const resetDialogRef = ref<typeof SheetDialog>();
const deleteDialogRef = ref<typeof SheetDialog>();
const addDialogRef = ref<typeof SheetDialog>();
const editDialogRef = ref<typeof SheetDialog>();
const consumptionEditDialogRef = ref<typeof SheetDialog>();
const consumptionAddDialogRef = ref<typeof SheetDialog>();
const addFormRef = ref<QForm>();
const editFormRef = ref<QForm>();
const consumptionEditFormRef = ref<QForm>();
const consumptionAddFormRef = ref<QForm>();
const addForm = reactive({
  name: '',
  percentage: 0,
})
const editForm = reactive({
  name: '',
  percentage: 0,
})
const editFormRules = {
  name: [(v: string) => !!v?.trim()],
  percentage: [(v: number) => (v === 0 || v > 0) && v < 100]
};
const addFormRules = editFormRules;
const consumptionEditForm = reactive({
  volume: 0,
})
const consumptionEditFormRules = {
  volume: [(v: number) => (v === 0 || v > 0)]
};
const consumptionAddForm = reactive({
  volume: 0,
})
const consumptionAddFormRules = {
  volume: [(v: number) => (v > 0)]
};

const changedItemId = ref<number | null>(null);

const editableItems = computed<IBeverageItem[]>(() => {
  return beveragesStore.items.map((item): IBeverageItem => {
    const name = item.builtin ? t(`BEVERAGES.${item.type}`) : item.name!;
    const image = beverageImagesMap[item.type];
    const maxVolume = beveragesStore.getMaxWeeklyVolume(item.percentage);

    return {
      ...item,
      name,
      image,
      maxVolume,
    };
  });
});

const consumptionItems = computed<IBeverageConsumptionItem[]>(() => {
  return beveragesStore.items.map((item): IBeverageConsumptionItem => {
    const name = item.builtin ? t(`BEVERAGES.${item.type}`) : item.name!;
    const image = beverageImagesMap[item.type];
    const maxVolume = beveragesStore.getMaxWeeklyVolume(item.percentage);
    const { volume = null } = beverageConsumptionStore.getConsumption(item.id) || {};
    return {
      ...item,
      name,
      image,
      maxVolume,
      volume,
    };
  });
});

const items = computed<IBeverageConsumptionItem[] | IBeverageItem[]>(() => {
  return props.consumption ? unref(consumptionItems) : unref(editableItems);
});

const changedItem = computed(() => {
  const id = unref(changedItemId);
  if (id) {
    return unref(editableItems).find(item => item.id === id) ?? null;
  } else {
    return null;
  }
})

const changedItemConsumption = computed(() => {
  const id = unref(changedItemId);
  if (id) {
    return beverageConsumptionStore.getConsumption(id) ?? null;
  } else {
    return null;
  }
})


function onItemResetClick(id: number) {
  changedItemId.value = id;
  unref(resetDialogRef)!.show();
}

function onItemResetConfirm() {
  const id = unref(changedItemId)!;
  changedItemId.value = null;

  beveragesStore.resetBeverage(id);
  unref(resetDialogRef)!.hide();
}

function onItemDeleteClick(id: number) {
  changedItemId.value = id;
  unref(deleteDialogRef)!.show();
}

function onItemDeleteConfirm() {
  const id = unref(changedItemId)!;

  beveragesStore.removeBeverage(id);
  unref(deleteDialogRef)!.hide();
}

function onItemAddClick() {
  changedItemId.value = null;

  addForm.name = ''
  addForm.percentage = 0;

  unref(addDialogRef)!.show();
}

function onItemEditClick(id: number) {
  changedItemId.value = id;
  const { name, percentage } = unref(changedItem)!;
  Object.assign(editForm, { name, percentage });

  unref(editDialogRef)!.show();
}

async function onItemAddConfirm() {
  const isValid = await unref(addFormRef)!.validate();

  if (isValid) {
    beveragesStore.addBeverage({
      data: addForm
    });

    unref(addDialogRef)!.hide();
  }
}

async function onItemEditConfirm() {
  const isValid = await unref(editFormRef)!.validate();

  if (isValid) {
    const id = unref(changedItemId)!;
    changedItemId.value = null;

    beveragesStore.updateBeverage({
      id,
      data: editForm
    });

    unref(editDialogRef)!.hide();
  }
}

function onItemConsumptionEditClick(id: number) {
  changedItemId.value = id;
  const { volume = null } = unref(changedItemConsumption) || {};
  Object.assign(consumptionEditForm, { volume });

  unref(consumptionEditDialogRef)!.show();
}

async function onItemConsumptionEditConfirm() {
  const isValid = await unref(consumptionEditFormRef)!.validate();

  if (isValid) {
    const id = unref(changedItemId)!;
    changedItemId.value = null;

    beverageConsumptionStore.update({
      id,
      data: consumptionEditForm
    });

    unref(consumptionEditDialogRef)!.hide();
  }
}

function onItemConsumptionAddClick(id: number) {
  changedItemId.value = id;
  const { dose = null } = unref(changedItem)!;
  Object.assign(consumptionAddForm, { volume: dose });

  unref(consumptionAddDialogRef)!.show();
}

async function onItemConsumptionAddConfirm() {
  const isValid = await unref(consumptionAddFormRef)!.validate();

  if (isValid) {
    const id = unref(changedItemId)!;
    const { volume: currentVolume = 0 } = unref(changedItemConsumption) || {};
    changedItemId.value = null;

    const addedDose = consumptionAddForm.volume;
    const data = { volume: currentVolume + addedDose };
    beverageConsumptionStore.update({
      id,
      data,
    });

    unref(consumptionAddDialogRef)!.hide();
  }
}
</script>
