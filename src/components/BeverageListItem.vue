<template>
  <QItem class="beverage-item">
    <QItemSection avatar>
      <QAvatar color="gray-8" size="xl">
        <img :src="props.data.image"/>
      </QAvatar>
    </QItemSection>

    <QItemSection>
      <QItemLabel class="text-body1">{{ props.data.name }}</QItemLabel>

      <QItemLabel caption lines="1" v-if="props.consumption">
        <p>
          {{consumptionVolume}} {{ $t('UNIT_ML')}} ({{consumptionVolumePercent}}%)
        </p>
      </QItemLabel>

      <QItemLabel caption lines="3" v-else>
        <p>
          {{ $t('AVERAGE_STRENGTH')}} -
          <span class="text-weight-bold">{{props.data.percentage}}°</span>
        </p>
        <p>
          {{ $t('AVERAGE_WEEKLY')}} -
          <span class="text-weight-bold" v-if="isFinite(props.data.maxVolume)">
            {{maxVolume}} {{ $t('UNIT_ML')}}
          </span>
          <span class="text-weight-bold" v-else>
            ∞
          </span>
        </p>
      </QItemLabel>
    </QItemSection>

    <QItemSection side class="self-center">
      <div class="text-grey-8 q-gutter-sm" v-if="props.consumption">
        <QBtn unelevated size="12px" color="positive" dense round icon="add" @click="onConsumptionAddClick()" v-if="props.data.dose > 0"/>
        <QBtn unelevated size="12px" color="secondary" dense round icon="edit" @click="onConsumptionEditClick()"/>
      </div>

      <div class="text-grey-8 q-gutter-sm" v-else-if="props.data.builtin">
        <QBtn unelevated size="12px" color="negative" dense round icon="cached" @click="onResetClick()" />
        <QBtn unelevated size="12px" color="secondary" dense round icon="edit" @click="onEditClick()" />
      </div>

      <div class="text-grey-8 q-gutter-sm" v-else>
        <QBtn unelevated size="12px" color="negative" dense round icon="delete" @click="onDeleteClick()" />
        <QBtn unelevated size="12px" color="secondary" dense round icon="edit" @click="onEditClick()"/>
      </div>
    </QItemSection>
  </QItem>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getFormattedPercent, getFormattedVolume } from '@/helpers/beverage';
import { useBeverageConsumptionStore } from '@/stores/beverage-consumption';
import type { IBeverageConsumptionItem, IBeverageItem } from '@/components/BeverageList.vue';

interface IProps {
  data: IBeverageItem | IBeverageConsumptionItem,
  consumption?: boolean;
}

const emit = defineEmits([
  'reset',
  'delete',
  'edit',
  'consumptionEdit',
  'consumptionAdd',
]);

const props = withDefaults(defineProps<IProps>(), {
  consumption: false,
});

const beverageConsumptionStore = useBeverageConsumptionStore();


const maxVolume = computed(() => {
  return getFormattedVolume((props.data as IBeverageItem).maxVolume!);
});

const consumptionVolume = computed(() => {
  return getFormattedVolume((props.data as IBeverageConsumptionItem).volume!);
});

const consumptionVolumePercent = computed(() => {
  const consumptionRatio = beverageConsumptionStore.getConsumptionRatio({
    id: props.data.id,
    recommended: true
  });

  return getFormattedPercent(consumptionRatio * 100);
});

function onResetClick() {
  emit('reset', props.data.id);
}

function onDeleteClick() {
  emit('delete', props.data.id);
}

function onEditClick() {
  emit('edit', props.data.id);
}

function onConsumptionEditClick() {
  emit('consumptionEdit', props.data.id);
}

function onConsumptionAddClick() {
  emit('consumptionAdd', props.data.id);
}
</script>

<style scoped lang="scss">
.beverage-item ::v-deep .q-avatar__content {
  border: 2px solid rgba(0, 0, 0, 0.3);

  img {
    width: 87%;
    height: 87%;
  }
}

.beverage-item ::v-deep .q-item__label--caption {
  p {
    margin-bottom: 0;
  }
}
</style>
