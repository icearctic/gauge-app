import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory, START_LOCATION,
} from 'vue-router';

import routes from './routes';
import { adManager } from '@/services/applovin';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface RouteMeta {
    header?: boolean;
    title?: () => string;
  }
}

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  (router as any).startPromise = new Promise(resolve => {
    (router as any).start = resolve;
  });

  // move to Root in case of nav race conditions
  // (router as any).start();

  router.beforeEach(async() => {
    await (router as any).startPromise;
  })

  // guaranteed to run before navigation start
  /*
  router.beforeEach((to, from) => {
    if (from === START_LOCATION) {
      adManager.init();
    }
  })
  */

  router.afterEach(() => {
    // applovin should autorefresh, so not needed
    adManager.refreshBanner({ force: true });
  })

  return router;
});
