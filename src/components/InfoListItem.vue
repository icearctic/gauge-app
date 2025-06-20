<template>
  <QItem
    clickable
    tag="a"
    :href="props.link"
    @click="$emit('click')"
  >
    <QItemSection avatar>
      <QIcon v-if="props.icon" :name="props.icon" />
    </QItemSection>

    <QItemSection>
      <QItemLabel>{{ props.title }}</QItemLabel>
      <QItemLabel caption v-if="props.caption">{{ props.caption }}</QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script lang="ts">
export interface ILinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}
</script>

<script setup lang="ts">
defineEmits(['click']);

const props = withDefaults(defineProps<ILinkProps>(), {});
</script>
