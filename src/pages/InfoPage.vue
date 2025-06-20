<template>
  <QPage>
    <InfoList :mail-available="isMailAvailable"/>
  </QPage>
</template>

<script setup lang="ts">
import InfoList from '@/components/InfoList.vue';
import { mailManager } from '@/services/mail';

const isMailAvailable = await mailManager.checkAvailable();

</script>
