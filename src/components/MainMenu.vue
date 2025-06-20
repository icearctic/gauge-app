<template>
  <QFooter bordered>
    <QTabs
      indicator-color="transparent"
      active-color="primary"
      align="justify"
      class="bg-white text-grey-8"
    >
      <QRouteTab
        :to="{ name: routeNames.HOME }"
        exact
        icon="home"
        :label="$t('HOME')"
      />

      <QRouteTab
        :to="{ name: routeNames.SETTINGS }"
        exact
        icon="settings"
        :label="$t('SETTINGS')"
      />

      <QRouteTab
        :to="{ name: routeNames.INFO }"
        exact
        icon="help"
        :label="$t('INFO')"
      />
    </QTabs>
  </QFooter>
</template>

<script setup lang="ts">
import { routeNames } from '@/router/routes';
</script>
