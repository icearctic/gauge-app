import * as quasar from 'quasar';
import * as capacitorAppLauncher  from '@capacitor/app-launcher';
import { browserOpen } from '@/services/browser';
import * as capacitorRateApp from 'capacitor-rate-app';

const iosFallbackUrl = `https://apps.apple.com/app/id${process.env.VITE_STORE_APPLE_ID}?action=write-review`;

export let rateApp = async () => {
  await browserOpen(iosFallbackUrl);
};

if (quasar.Platform.is.nativeMobile && quasar.Platform.is.ios) {
  // import statement needs to be static and not list named imports
  // to be stubbed for web build
  const { AppLauncher } = capacitorAppLauncher;

  rateApp = async () => {
    const url = `itms-apps://itunes.apple.com/app/apple-store/id${process.env.VITE_STORE_APPLE_ID}?action=write-review`;

    const { value: isOpenable } = await AppLauncher.canOpenUrl({ url });

    if (isOpenable) {
      await AppLauncher.openUrl({ url })
    } else {
      await browserOpen(iosFallbackUrl);
    }
  };
} else if (quasar.Platform.is.nativeMobile && quasar.Platform.is.android) {
  const { RateApp } = capacitorRateApp;

  rateApp = async () => {
    const url = `http://play.google.com/store/apps/details?id=${process.env.VITE_STORE_GOOGLE_ID}`;

    try {
      // error doesn't seem to be thrown
      await RateApp.requestReview();
    } catch (err) {
      console.warn(err);
      await browserOpen(url);
    }
  };
}
