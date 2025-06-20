import { RouteRecordRaw } from 'vue-router';
import { t } from '@/boot/i18n';

export const routeNames = {
  HOME: 'HOME',
  SETTINGS: 'SETTINGS',
  INFO: 'INFO',
}

const routes: RouteRecordRaw[] = [
  {
    name: routeNames.HOME,
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      header: false,
    }
  },
  {
    name: routeNames.SETTINGS,
    path: '/settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: {
      header: false,
      title: () => t('SETTINGS')
    }
  },
  {
    name: routeNames.INFO,
    path: '/info',
    component: () => import('@/pages/InfoPage.vue'),
    meta: {
      header: false,
      title: () => t('INFO')
    }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorPage.vue'),
  },
];

export default routes;
