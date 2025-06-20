<template>
  <QDialog class="sheet-dialog" v-bind="qdialogProps" ref="qdialog">
    <QCard :style="{ 'min-width': '200px' }">
      <QCardSection class="column justify-center" v-if="$slots.default">
        <slot/>
      </QCardSection>

      <QSeparator/>
      <QCardActions align="between" class="text-primary">
        <QBtn unelevated flat :label="$t('BUTTON_CANCEL')" v-close-popup v-if="props.cancel" @click="$emit('cancel')" />
        <QBtn unelevated flat v-bind="confirmProps" v-if="confirmProps" @click="$emit('confirm')" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { QDialog } from 'quasar';
import { t } from '@/boot/i18n';

interface IProps {
  position?: 'top' | 'right' | 'bottom' | 'left',
  cancel?: boolean;
  confirm?: boolean | 'reset' | 'delete' | 'add';
}

defineEmits(['confirm', 'cancel']);

const props = withDefaults(defineProps<IProps>(), {});

const qdialog = ref<QDialog>();

const confirmTypes = {
  BUTTON_OK: 'BUTTON_OK',
  BUTTON_RESET: 'BUTTON_RESET',
  BUTTON_DELETE: 'BUTTON_DELETE',
  BUTTON_ADD: 'BUTTON_ADD',
} as const;

const confirmType = computed(() => {
  if (props.confirm === 'reset') {
    return confirmTypes.BUTTON_RESET;
  } else if (props.confirm === 'delete') {
    return confirmTypes.BUTTON_DELETE;
  } else if (props.confirm === 'add') {
    return confirmTypes.BUTTON_ADD;
  } else if (props.confirm) {
    return confirmTypes.BUTTON_OK;
  } else {
    return null;
  }
});

const confirmProps = computed(() => {
  if (props.confirm === 'reset') {
    return { label: t('BUTTON_RESET'), color: 'negative' };
  } else if (props.confirm === 'delete') {
    return { label: t('BUTTON_DELETE'), color: 'negative' };
  } else if (props.confirm === 'add') {
    return { label: t('BUTTON_ADD') };
  } else if (props.confirm) {
    return { label: t('BUTTON_OK') };
  } else {
    return null;
  }
});

const qdialogProps = computed(() => {
  const { position } = props;
  if (position) {
    return { position, maximized: true };
  } else {
    return null;
  }
});

function show() {
  unref(qdialog)?.show();
}

function hide() {
  unref(qdialog)?.hide();
}

defineExpose({ show, hide, qdialog });
</script>

<style scoped lang="scss">

.sheet-dialog .q-card__section--vert {
  padding-bottom: 0 !important;
}
</style>
