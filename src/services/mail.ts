import * as quasar from 'quasar';
import * as capacitorAppLauncher  from '@capacitor/app-launcher';
// import * as cordovaEmailComposer from '@awesome-cordova-plugins/email-composer';
// import type { EmailComposerOriginal as IEmailComposer } from '@awesome-cordova-plugins/email-composer';
import { browserOpen } from '@/services/browser';

export let mailManager = {
  _emailComposer: null as any,
  _emailComposerWrapper: null as unknown /* as IEmailComposer */,
  async checkAvailable({ request = false }: { request?: boolean } = {}) {
    return true;
  },
  async send({ to, subject, body }: { to: string, subject?: string, body?: string }) {
    const url = `mailto:${to}`;
    await browserOpen(url);
  }
};
;

if (quasar.Platform.is.nativeMobile) {
  // import statement needs to be static and not list named imports
  // to be stubbed for web build
  const { AppLauncher } = capacitorAppLauncher;

  mailManager = {
    _emailComposer: null as any,
    _emailComposerWrapper: null as unknown /* as IEmailComposer */,
    async checkAvailable({ request = false }: { request?: boolean } = {}) {
      return true;
    },
    async send({ to, subject, body }: { to: string, subject?: string, body?: string }) {
      const url = `mailto:${to}`;

      const { value: isOpenable } = await AppLauncher.canOpenUrl({ url });

      if (isOpenable) {
        await AppLauncher.openUrl({ url })
      } else {
        await browserOpen(url);
      }
    }
  };

  /*
  mailManager = {
    // cordova-plugin-email-composer
    _emailComposer: (window.cordova?.plugins as any)?.email,
    // promises not resolve correctly
    // _emailComposerWrapper: EmailComposer,
    async checkAvailable({ request = false }: { request?: boolean } = {}) {
      try {
        const isAvailable = await this._emailComposerWrapper.isAvailable();
        if (!isAvailable) {
          return false;
        }

        const READ_ACCOUNTS = this._emailComposer.permission;
        let isAllowed = await this._emailComposerWrapper.hasPermission(...([READ_ACCOUNTS] as unknown as []));

        if (!isAllowed && request) {
          isAllowed = await this._emailComposerWrapper.requestPermission(...([READ_ACCOUNTS] as unknown as []));
        }

        return isAllowed;
      } catch (err) {
        return false;
      }
    },
    async send({ to, subject, body }: { to: string, subject?: string, body?: string }) {
      try {
        await this._emailComposerWrapper.open({ to, subject, body });
        return true;
      } catch (err) {
        return false;
      }
    }
  }*/
}
